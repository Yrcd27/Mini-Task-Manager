"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getTasks } from "@/lib/api/tasks";
import { TaskResponse, TaskStatus, TaskPriority } from "@/types";
import TaskFilters from "@/components/tasks/TaskFilters";
import TaskCard from "@/components/tasks/TaskCard";
import Pagination from "@/components/tasks/Pagination";
import Button from "@/components/ui/Button";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // Filter states
  const [status, setStatus] = useState<TaskStatus | "">("");
  const [priority, setPriority] = useState<TaskPriority | "">("");
  const [sortBy, setSortBy] = useState<"createdAt" | "dueDate" | "priority">(
    "createdAt"
  );
  const [sortDir, setSortDir] = useState<"ASC" | "DESC">("DESC");

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await getTasks({
        status: status || undefined,
        priority: priority || undefined,
        page: currentPage,
        size: 9,
        sortBy,
        sortDir,
      });
      setTasks(response.content);
      setTotalPages(response.totalPages);
    } catch (error: unknown) {
      console.error("Failed to fetch tasks:", error);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch tasks when filters or page changes
  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, priority, sortBy, sortDir, currentPage]);

  // Reset to page 0 when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [status, priority, sortBy, sortDir]);

  // Loading skeleton
  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 animate-pulse"
        >
          <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-2/3 mb-4"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-slate-200 rounded w-16"></div>
            <div className="h-6 bg-slate-200 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Empty state
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg
        className="w-24 h-24 text-slate-300 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
      <h3 className="text-xl font-semibold text-slate-700 mb-2">
        No tasks found
      </h3>
      <p className="text-slate-500 mb-6">
        Create your first task to get started!
      </p>
      <Link href="/tasks/new">
        <Button>+ Create Task</Button>
      </Link>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">My Tasks</h1>
        <Link href="/tasks/new">
          <Button>+ New Task</Button>
        </Link>
      </div>

      {/* Filters */}
      <TaskFilters
        status={status}
        priority={priority}
        sortBy={sortBy}
        sortDir={sortDir}
        onStatusChange={setStatus}
        onPriorityChange={setPriority}
        onSortByChange={setSortBy}
        onSortDirChange={setSortDir}
      />

      {/* Task Grid / Loading / Empty State */}
      {isLoading ? (
        renderSkeleton()
      ) : tasks.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onUpdate={fetchTasks} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
