"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";

export function AuthProviderClient({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
