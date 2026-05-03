import { ToastProvider } from "./_components/Toast";
import { ConfirmProvider } from "./_components/ConfirmDialog";
import { AdminShell } from "./_components/AdminShell";

export const metadata = { title: "Admin — Zenspace" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <AdminShell>{children}</AdminShell>
      </ConfirmProvider>
    </ToastProvider>
  );
}
