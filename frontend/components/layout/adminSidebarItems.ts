import {
  ClipboardCheck,
  Database,
  FileBarChart,
  FolderKanban,
  Gauge,
  Home,
  Layers3,
  MapPinned,
  Users,
} from "lucide-react";
import type { SidebarItem } from "@/components/layout/Sidebar";

export const adminSidebarItems: SidebarItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: Home },
  { label: "Data Aspirasi", href: "/admin/aspirations", icon: FolderKanban },
  { label: "Verifikasi Aspirasi", href: "/admin/dashboard", icon: ClipboardCheck },
  { label: "Rekomendasi Prioritas", href: "/admin/dashboard", icon: Gauge },
  { label: "Data Latih SVM", href: "/admin/dashboard", icon: Database },
  { label: "Kategori", href: "/admin/categories", icon: Layers3 },
  { label: "Wilayah", href: "/admin/regions", icon: MapPinned },
  { label: "User", href: "/admin/dashboard", icon: Users },
  { label: "Laporan", href: "/admin/dashboard", icon: FileBarChart },
];
