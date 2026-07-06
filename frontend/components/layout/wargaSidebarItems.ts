import { ClipboardList, Home, MessageSquarePlus, UserCircle2 } from "lucide-react";
import type { SidebarItem } from "@/components/layout/Sidebar";

export const wargaSidebarItems: SidebarItem[] = [
  { label: "Dashboard", href: "/warga/dashboard", icon: Home },
  { label: "Ajukan Aspirasi", href: "/warga/aspirations/create", icon: MessageSquarePlus },
  { label: "Status Aspirasi", href: "/warga/aspirations", icon: ClipboardList },
  { label: "Profil", href: "/warga/dashboard", icon: UserCircle2 },
];
