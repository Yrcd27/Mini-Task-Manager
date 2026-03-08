import { TaskStatus, TaskPriority } from "@/types";

// Format date from YYYY-MM-DD or ISO to readable format like "Mar 15, 2026"
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Check if a due date is overdue (before today)
export const isOverdue = (dueDate: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
};

// Get human-readable status label
export const getStatusLabel = (status: TaskStatus): string => {
  switch (status) {
    case "TODO":
      return "To Do";
    case "IN_PROGRESS":
      return "In Progress";
    case "DONE":
      return "Done";
    default:
      return status;
  }
};

// Get human-readable priority label
export const getPriorityLabel = (priority: TaskPriority): string => {
  switch (priority) {
    case "LOW":
      return "Low";
    case "MEDIUM":
      return "Medium";
    case "HIGH":
      return "High";
    default:
      return priority;
  }
};

// Get Tailwind CSS classes for status badge
export const getStatusBadgeClass = (status: TaskStatus): string => {
  switch (status) {
    case "TODO":
      return "bg-blue-100 text-blue-700";
    case "IN_PROGRESS":
      return "bg-amber-100 text-amber-700";
    case "DONE":
      return "bg-green-100 text-green-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

// Get Tailwind CSS classes for priority badge
export const getPriorityBadgeClass = (priority: TaskPriority): string => {
  switch (priority) {
    case "LOW":
      return "bg-green-100 text-green-700";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-700";
    case "HIGH":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};
