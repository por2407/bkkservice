export type TaskStatus = "in_progress" | "done";
export type FilterKey = "all" | "in_progress" | "done";

export interface Task {
  id: string;
  isMine?: boolean;
  schoolName?: string;
  ticket: string;
  room: string;
  description: string;
  status: TaskStatus;
  updatedAt: string; // ISO string เช่น "2025-11-01T10:36:05+07:00"
  dueDate: string;
  hasImage?: boolean;
  hasVideo?: boolean;
  commentsCount?: number;
  endsv_job? : string;
  eduExh48?: string;

  //rating
  canRate?: boolean; // ขึ้นไอคอนได้หรือยัง
  rating?: number | null; // ถ้าให้แล้ว 1–5, ถ้ายัง = null
}

type MediaType = "image" | "video";

interface TaskMedia {
  type: MediaType;
  url: string;
}

interface StepRuntimeInfo {
  step: number;
  finishedAt?: string;
  dueAt?: string;
  operator?: string;
}

interface TimelineStep {
  key: string;
  label: string;
  description?: string;
  number: number;
  icon: string; // รูปภาพจาก online
}

export interface TaskDetail {
  id: string;
  room: string;
  description: string;
  status: TaskStatus;
  updatedAt: string;
  media: TaskMedia[];
  currentStep: number;
  timeline?: StepRuntimeInfo[];
}

/* ---------- comment types ---------- */

interface CommentMedia extends TaskMedia {
  id: string;
}

interface TaskComment {
  id: string;
  taskId: string;
  author: string;
  role: "customer" | "operator";
  createdAt: string;
  message: string;
  media: CommentMedia[];
}

export interface RatingItem {
  id: string;
  label: string;
}
