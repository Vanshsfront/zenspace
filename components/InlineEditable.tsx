"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ClipboardEvent as ReactClipboardEvent,
  type ElementType,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { useAnchorRect } from "@/lib/edit/anchor";
import { isNearLimit } from "@/lib/edit/fields";

/**
 * A capped contentEditable that hands the finished text back to its caller.
 *
 * lib/edit/EditableText is the right primitive for anything that maps onto one
 * column, because it owns the PATCH. Two things in the blog and legal pages do
 * not map onto one column and so have to own the write themselves:
 *
 *  - rich text lives in a single `blocks` jsonb array and lib/blocks.ts gives
 *    its items no id, so editing one paragraph means writing the whole array;
 *  - a post's title has to be saved together with its slug, because the write
 *    API derives the slug from the title whenever the body leaves it out, on
 *    PATCH as well as POST (normalizeBody in app/api/admin/[table]/route.ts).
 *
 * The editing behaviour is deliberately the same as EditableText's: the real
 * element becomes contentEditable so the type keeps its exact font, colour and
 * wrapping, the cap is refused rather than truncated afterwards, and the
 * counter is portaled onto <body> so nothing the editor adds can shift the page.
 *
 * The one difference is when it writes. EditableText debounces because it patches
 * one column; here a save rewrites an entire array, so two overlapping writes
 * would clobber each other. Committing once per finished edit (blur, Enter) is
 * the only cadence that is safe.
 */

/** Inserts text at the caret, replacing the selection. */
function insertAtCaret(text: string) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;
  const range = sel.getRangeAt(0);
  range.deleteContents();
  const node = document.createTextNode(text);
  range.insertNode(node);
  range.setStartAfter(node);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

/** How many characters the current selection would replace. */
function selectionLength(el: HTMLElement): number {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || sel.rangeCount === 0) return 0;
  const range = sel.getRangeAt(0);
  return el.contains(range.commonAncestorContainer) ? sel.toString().length : 0;
}

export type InlineEditableProps = {
  as?: ElementType;
  className?: string;
  /** The text as the server last rendered it. */
  value: string;
  /** Hard cap from the registry. 0 means uncapped. */
  max: number;
  /** Plain-language field name, used as the accessible label. */
  label: string;
  /** Allows line breaks. Off by default, as most of these are single lines. */
  multiline?: boolean;
  /**
   * Called with the finished text. Resolving to false means the write was
   * refused, and the element goes back to the last value that stuck.
   */
  onCommit: (next: string) => void | Promise<boolean | void>;
};

/**
 * Reads what the admin can actually see in the element.
 *
 * textContent joins the child nodes with no separator, so the <div> or <br> a
 * contentEditable inserts on Enter leaves no trace and the line break is lost
 * on save. innerText honours the rendered line boxes. Single-line fields keep
 * textContent: they cannot hold a break anyway.
 */
function readText(el: HTMLElement, multiline?: boolean): string {
  return (multiline ? el.innerText : el.textContent) ?? "";
}

export function InlineEditable({
  as: As = "span",
  className,
  value,
  max,
  label,
  multiline = false,
  onCommit,
}: InlineEditableProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [focused, setFocused] = useState(false);
  const [length, setLength] = useState(value.length);
  // Rendered once as the element's only child so there is no empty flash on
  // mount. React never touches the text again; the effect below owns it.
  const initial = useRef(value).current;
  // What the caller last accepted. Escape returns to it and blur only writes
  // when the text actually moved.
  const committed = useRef(value);

  const rect = useAnchorRect(ref.current, focused && max > 0);

  // Pull the server value back into the DOM, but never mid-edit: the
  // router.refresh() that follows every save would otherwise wipe the caret.
  useEffect(() => {
    const el = ref.current;
    if (!el || focused) return;
    committed.current = value;
    if (readText(el, multiline) !== value) el.textContent = value;
    setLength(value.length);
  }, [value, focused, multiline]);

  const onBeforeInput = useCallback(
    (e: FormEvent<HTMLElement>) => {
      if (max <= 0) return;
      const el = ref.current;
      if (!el) return;
      const native = e.nativeEvent as InputEvent;
      const inserted = native.data ?? "";
      if (!inserted) return; // deletions and IME composition starts are always fine
      const current = readText(el, multiline).length;
      // Refuse the keystroke rather than trimming afterwards, so the counter can
      // never show a number above the cap.
      if (current - selectionLength(el) + inserted.length > max) e.preventDefault();
    },
    [max, multiline]
  );

  const onPaste = useCallback(
    (e: ReactClipboardEvent<HTMLElement>) => {
      const el = ref.current;
      if (!el) return;
      e.preventDefault();
      let text = e.clipboardData.getData("text/plain");
      if (!multiline) text = text.replace(/\s*\n+\s*/g, " ");
      if (max > 0) {
        const room = max - readText(el, multiline).length + selectionLength(el);
        if (room <= 0) return;
        text = text.slice(0, room);
      }
      insertAtCaret(text);
      setLength(readText(el, multiline).length);
    },
    [max, multiline]
  );

  const onInput = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    let next = readText(el, multiline);
    // Backstop for the input types beforeinput cannot refuse (an IME commit, a
    // drag-and-drop of text). The cap is hard, so trim and move on.
    if (max > 0 && next.length > max) {
      next = next.slice(0, max);
      el.textContent = next;
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
    setLength(next.length);
  }, [max, multiline]);

  const commit = useCallback(async () => {
    const el = ref.current;
    if (!el) return;
    const next = readText(el, multiline);
    const previous = committed.current;
    if (next === previous) return;
    committed.current = next;
    const ok = await onCommit(next);
    if (ok === false) {
      // Put the old text back so the screen never claims a change the database
      // refused.
      committed.current = previous;
      if (ref.current) ref.current.textContent = previous;
      setLength(previous.length);
    }
  }, [onCommit, multiline]);

  const onKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLElement>) => {
      if (e.key === "Escape") {
        e.preventDefault();
        const previous = committed.current;
        if (ref.current) {
          ref.current.textContent = previous;
          setLength(previous.length);
          ref.current.blur();
        }
        return;
      }
      if (e.key === "Enter" && !multiline) {
        // Single-line fields commit on Enter instead of growing a second line
        // the layout has no room for.
        e.preventDefault();
        ref.current?.blur();
      }
    },
    [multiline]
  );

  const nearLimit = isNearLimit(length, max);
  const atLimit = max > 0 && length >= max;

  return (
    <>
      <As
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        role="textbox"
        aria-label={label}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          void commit();
        }}
        onInput={onInput}
        onBeforeInput={onBeforeInput}
        onPaste={onPaste}
        onKeyDown={onKeyDown}
        // Outline and ring draw outside the box, so switching to edit mode
        // cannot shift a single pixel of the page.
        className={[
          className,
          "outline-none rounded-[2px] transition-shadow",
          "hover:shadow-[0_0_0_2px_rgba(120,113,108,0.35)]",
          "focus:shadow-[0_0_0_2px_rgba(120,113,108,0.9)]",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {initial}
      </As>
      {rect &&
        createPortal(
          <span
            style={{ top: Math.max(4, rect.top - 24), left: rect.left, zIndex: 10001 }}
            className={`fixed pointer-events-none px-2 py-0.5 rounded-full text-[11px] font-medium tabular-nums shadow-lg ${
              atLimit
                ? "bg-amber-500 text-stone-900"
                : nearLimit
                ? "bg-amber-100 text-amber-900 border border-amber-400"
                : "bg-stone-900 text-stone-50"
            }`}
          >
            {length}/{max}
          </span>,
          document.body
        )}
    </>
  );
}
