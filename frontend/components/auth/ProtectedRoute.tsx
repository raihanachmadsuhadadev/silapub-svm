"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth, type UserRole } from "@/context/AuthContext";

type ProtectedRouteProps = {
  children: ReactNode;
  role: UserRole;
};

function dashboardPath(role: UserRole) {
  return role === "admin" ? "/admin/dashboard" : "/warga/dashboard";
}

export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    if (user.role !== role) {
      router.replace(dashboardPath(user.role));
    }
  }, [isAuthenticated, loading, role, router, user]);

  if (loading || !isAuthenticated || !user || user.role !== role) {
    return (
      <main className="app-gradient-bg flex min-h-screen items-center justify-center px-4">
        <div className="glass-card flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-700">
          <Loader2 className="animate-spin text-blue-700" size={20} />
          Memeriksa akses...
        </div>
      </main>
    );
  }

  return children;
}
