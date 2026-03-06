"use client";

import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export function AdminSignOutButton() {
  return (
    <Button onClick={() => signOut({ callbackUrl: "/" })} variant="secondary">
      Sair
    </Button>
  );
}
