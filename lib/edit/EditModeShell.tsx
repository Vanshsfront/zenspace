"use client";

import type { ReactNode } from "react";
import { EditProvider } from "./context";
import { EditToolbar } from "./EditToolbar";

/**
 * The editor's entry point and the only module EditModeBoot imports at runtime.
 * Everything the editor needs hangs off this file, so the bundler can put the
 * whole thing in one chunk that is fetched after, and only after, /api/admin/me
 * confirms the visitor is the admin.
 *
 * The page is re-parented under the provider rather than re-rendered: `children`
 * is the already-rendered server output of the (site) layout, so switching edit
 * mode on costs one client render and no extra server work.
 */
export default function EditModeShell({ children }: { children: ReactNode }) {
  return (
    <EditProvider>
      {children}
      <EditToolbar />
    </EditProvider>
  );
}
