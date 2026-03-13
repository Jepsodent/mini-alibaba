"use client";
import { useAuthStore } from "@/stores/auth-store";
import { ReactNode, useEffect } from "react";

export default function AuthStoreProvider({
  children,
  user,
}: {
  children: ReactNode;
  user: User;
}) {
  useEffect(() => {
    useAuthStore.getState().setUser(user);
  });

  return <>{children}</>;
}
