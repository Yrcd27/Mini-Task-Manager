// Auth types
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface AuthResponse {
  token: string;
  type: "Bearer";
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Task types
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface TaskRequest {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string; // YYYY-MM-DD format
}

export interface TaskResponse {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string; // YYYY-MM-DD format
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
  userId: number;
  userName: string;
}

// Pagination types
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page (0-based)
  size: number;
}

// Filter types
export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  page?: number;
  size?: number;
  sortBy?: "createdAt" | "dueDate" | "priority";
  sortDir?: "ASC" | "DESC";
}
