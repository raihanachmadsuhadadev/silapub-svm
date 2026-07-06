import type { ReactNode } from "react";
import { Sidebar, type SidebarItem } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

type DashboardLayoutProps = {
  children: ReactNode;
  sidebarItems: SidebarItem[];
  activeLabel: string;
  roleLabel: string;
  title: string;
  subtitle?: string;
  showNotification?: boolean;
};

export function DashboardLayout({
  children,
  sidebarItems,
  activeLabel,
  roleLabel,
  title,
  subtitle,
  showNotification,
}: DashboardLayoutProps) {
  return (
    <main className="app-gradient-bg min-h-screen">
      <div className="flex min-h-screen">
        <Sidebar items={sidebarItems} activeLabel={activeLabel} roleLabel={roleLabel} />
        <section className="min-w-0 flex-1">
          <Topbar
            title={title}
            subtitle={subtitle}
            showNotification={showNotification}
          />
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
