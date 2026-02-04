"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const handleSignOut = () => {
    signOut({
      callbackUrl: "/login",
      redirect: true,
    });
  };

  return (
    <Button
      variant="outline"
      onClick={handleSignOut}
      className="gap-2"
    >
      <LogOut className="size-4" />
      Sign out
    </Button>
  );
}
