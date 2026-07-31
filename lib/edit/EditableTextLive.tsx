"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ElementType,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { useAnchorRect } from "./anchor";
import { isNearLimit } from "./fields";
import { useFieldSave } from "./useSave";

/**
 * The interactive half of EditableText. Only ever mounted for a signed-in admin
 * in edit mode, and loaded lazily so it never reaches a visitor.
 *
 * The real element is made contentEditable rather than swapped for an input, so
 * the text keeps the exact font, colour and wrapping it has on the live site.
 * React deliberately renders it with no children: the text is written into the
 * DOM imperatively, which is what stops a re-render from resetting the caret.
 */

type Props = {
  table: string;
  field: string;
  id?: string;
  as: ElementType;
  className?: string;
  value: string;
  /** Hard cap from the registry. 0 means uncapped. */
  max: number;
  label: string;
  multiline: boolean;
};

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

export default function EditableTextLive({
  table,
  field,
  id,
  as: As,
  className,
  value,
  max,
  label,
  multiline,
}: Props) {
  const { value: saved, edit, flush, reset } = useFieldSave({ table, id, field, value, label });
  const ref = useRef<HTMLElement | null>(null);
  const [focused, setFocused] = useState(false);
  const [length, setLength] = useState(value.length);
  // Rendered once as the element's only child so there is no empty flash on
  // mount. It never changes, so React has no reason to touch the text again and
  // the effect below stays in sole charge of it.
  const initial = useRef(value).current;

  const rect = useAnchorRect(ref.current, focused && max > 0);

  // Sync the server value into the DOM, but never while the admin is typing in
  // it — a router.refresh() mid-sentence would otherwise wipe the caret.
  useEffect(() => {
    const el = ref.current;
    if (!el || focused) return;
    if (el.textContent !== saved) el.textContent = saved;
    setLength(saved.length);
  }, [saved, focused]);

  const onBeforeInput = useCallback(
    (e: FormEvent<HTMLElement>) => {
      if (max <= 0) return;
      const el = ref.current;
      if (!el) return;
      const native = e.nativeEvent as InputEvent;
      const inserted = native.data ?? "";
      if (!inserted) return; // deletions and IME composition starts are always fine
      const current = el.textContent?.length ?? 0;
      // Refuse the keystroke outright rather than truncating afterwards, so the
      // counter can never show a number above the cap.
      if (current - selectionLength(el) + inserted.length > max) e.preventDefault();
    },
    [max]
  );

  const onPaste = useCallback(
    (e: React.ClipboardEvent<HTMLElement>) => {
      const el = ref.current;
      if (!el) return;
      e.preventDefault();
      let text = e.clipboardData.getData("text/plain");
      if (!multiline) text = text.replace(/\s*\n+\s*/g, " ");
      if (max > 0) {
        const room = max - (el.textContent?.length ?? 0) + selectionLength(el);
        if (room <= 0) return;
        text = text.slice(0, room);
      }
      insertAtCaret(text);
      const next = el.textContent ?? "";
      setLength(next.length);
      edit(next);
    },
    [edit, max, multiline]
  );

  const onInput = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    let next = el.textContent ?? "";
    // Backstop for the input types beforeinput can't refuse (an IME commit, a
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
    edit(next);
  }, [edit, max]);

  const onKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLElement>) => {
      if (e.key === "Escape") {
        e.preventDefault();
        const previous = reset();
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
    [multiline, reset]
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
        data-edit-field={`${table}.${field}`}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          flush(ref.current?.textContent ?? "");
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
