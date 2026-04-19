"use client";
export function SignOut() {
  return (
    <button
      onClick={async () => {
        await fetch("/api/admin/login", { method: "DELETE" });
        window.location.href = "/admin-login";
      }}
      className="block px-3 py-2 text-sm text-stone-400 w-full text-left"
    >
      Sign out
    </button>
  );
}
