export type TaskStatus = "in_progress" | "done";
export type FilterKey = "all" | "in_progress" | "done";

export interface TaskBase {
  id: string;
  ticket: string;
  room: string;
  description: string;
  status: TaskStatus;
  updatedAt: string; // ISO string เช่น "2025-11-01T10:36:05+07:00"

  // rating
  canRate?: boolean; // ขึ้นไอคอนได้หรือยัง
  rating?: number | null; // ถ้าให้แล้ว 1–5, ถ้ายัง = null
  ratingItems?: RatingItem[];
  currentStep?: number | null;
  media: TaskMedia[];
}

export interface Task extends TaskBase {
  isMine?: boolean;
  schoolName?: string;
  dueDate: string;

  hasImage?: boolean;
  hasVideo?: boolean;
  commentsCount?: number;
  endsv_job?: string;
  eduExh48?: string;
}

export interface TaskDetail extends TaskBase {
  timeline?: StepRuntimeInfo[];
  isSubmit?: boolean;
  machineNo?: string;
}

type MediaType = "image" | "video";

export interface TaskMedia {
  type: MediaType;
  url: string;
}

export interface StepRuntimeInfo {
  code?: string;
  step: number;
  label: string;
  finishedAt?: string;
  dueAt?: string;
  operator?: string;
  empCode?: string;
}

interface TimelineStep {
  key: string;
  label: string;
  description?: string;
  number: number;
  icon: string; // รูปภาพจาก online
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

export interface PreviewMedia {
  type: MediaType;
  url: string;
}

export type PayLoadActive = {
  jobNo: string;
  typeCode: string;
  typeSeq: string;
};

export interface PayLoadActiveFinish extends PayLoadActive {
  startTime: string;
  endTime: string;
  process: string;
  pending: string;
}
