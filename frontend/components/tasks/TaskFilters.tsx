"use client";

import Select from "@/components/ui/Select";
import { TaskStatus, TaskPriority } from "@/types";

interface TaskFiltersProps {
  status: TaskStatus | "";
  priority: TaskPriority | "";
  sortBy: "createdAt" | "dueDate" | "priority";
  sortDir: "ASC" | "DESC";
  onStatusChange: (status: TaskStatus | "") => void;
  onPriorityChange: (priority: TaskPriority | "") => void;
  onSortByChange: (sortBy: "createdAt" | "dueDate" | "priority") => void;
  onSortDirChange: (sortDir: "ASC" | "DESC") => void;
}

export default function TaskFilters({
  status,
  priority,
  sortBy,
  sortDir,
  onStatusChange,
  onPriorityChange,
  onSortByChange,
  onSortDirChange,
}: TaskFiltersProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <Select
          label="Status"
          value={status}
          onChange={(e) =>
            onStatusChange(e.target.value as TaskStatus | "")
          }
        >
          <option value="">All Statuses</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </Select>

        {/* Priority Filter */}
        <Select
          label="Priority"
          value={priority}
          onChange={(e) =>
            onPriorityChange(e.target.value as TaskPriority | "")
          }
        >
          <option value="">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </Select>

        {/* Sort By */}
        <Select
          label="Sort By"
          value={sortBy}
          onChange={(e) =>
            onSortByChange(
              e.target.value as "createdAt" | "dueDate" | "priority"
            )
          }
        >
          <option value="createdAt">Created Date</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </Select>

        {/* Sort Direction */}
        <Select
          label="Order"
          value={sortDir}
          onChange={(e) => onSortDirChange(e.target.value as "ASC" | "DESC")}
        >
          <option value="DESC">Newest First</option>
          <option value="ASC">Oldest First</option>
        </Select>
      </div>
    </div>
  );
}
