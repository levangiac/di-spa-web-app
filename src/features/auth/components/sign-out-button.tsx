"use client";

import { signOut } from "next-auth/react";
import { SignOut } from "@phosphor-icons/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="flex items-center gap-3 w-full px-3 py-3.5 rounded-card hover:bg-destructive/5 transition-colors text-destructive"
    >
      <SignOut size={18} weight="thin" className="shrink-0" />
      <span className="text-sm font-medium">Đăng xuất</span>
    </button>
  );
}
