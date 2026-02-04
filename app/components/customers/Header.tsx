"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="w-full border-b border-border">
      <div className="container flex h-16 items-center justify-between px-6">
        <span className="text-4xl font-bold text-[#044055]">
          KOSIGN
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/login", redirect: true })}
          className="gap-2 rounded-full px-4 font-medium text-destructive hover:bg-red-100 hover:text-destructive-foreground transition-colors"
        >
          <LogOut className="size-4 text-destructive" />
          Sign out
        </Button>
      </div>
    </header>
  );
}
