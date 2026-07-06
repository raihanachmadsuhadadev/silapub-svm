import type { AuthUser } from "@/context/AuthContext";

export type AspirationStatus =
  | "submitted"
  | "verified"
  | "in_progress"
  | "completed"
  | "rejected";

export type MasterOption = {
  id: number;
  code: string;
  name: string;
  rt?: string;
  rw?: string;
};

export type AspirationAttachment = {
  id: number;
  file_name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  url?: string;
};

export type AspirationStatusHistory = {
  id: number;
  status: AspirationStatus;
  note: string | null;
  created_at: string;
  creator?: AuthUser | null;
};

export type Aspiration = {
  id: number;
  code: string;
  user?: AuthUser;
  category: MasterOption;
  region: MasterOption;
  title: string;
  content: string;
  location_detail: string | null;
  status: AspirationStatus;
  priority_recommendation: string | null;
  svm_score: string | null;
  submitted_at: string | null;
  created_at: string;
  attachments?: AspirationAttachment[];
  attachments_count?: number;
  status_histories?: AspirationStatusHistory[];
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const statusLabels: Record<AspirationStatus, string> = {
  submitted: "Diajukan",
  verified: "Diverifikasi",
  in_progress: "Diproses",
  completed: "Selesai",
  rejected: "Ditolak",
};

export const statusTones: Record<AspirationStatus, "blue" | "teal" | "violet" | "amber" | "green" | "red" | "slate"> = {
  submitted: "amber",
  verified: "blue",
  in_progress: "violet",
  completed: "green",
  rejected: "red",
};

export function priorityLabel(priority: string | null) {
  if (!priority) {
    return "Belum diproses";
  }

  const normalized = priority.toLowerCase();

  if (normalized === "high" || normalized === "tinggi") {
    return "Tinggi";
  }

  if (normalized === "medium" || normalized === "sedang") {
    return "Sedang";
  }

  if (normalized === "low" || normalized === "rendah") {
    return "Rendah";
  }

  return priority;
}

export function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
