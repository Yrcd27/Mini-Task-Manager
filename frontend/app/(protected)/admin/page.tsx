"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllTasksAdmin } from "@/lib/api/tasks";
import { TaskResponse, TaskStatus, TaskPriority } from "@/types";
import { useAuth } from "@/context/AuthContext";
import TaskFilters from "@/components/tasks/TaskFilters";
import Pagination from "@/components/tasks/Pagination";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  formatDate,
  isOverdue,
  getStatusLabel,
  getPriorityLabel,
  getStatusBadgeClass,
  getPriorityBadgeClass,
} from "@/lib/utils";

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  const [status, setStatus] = useState<TaskStatus | "">("");
  const [priority, setPriority] = useState<TaskPriority | "">("");
  const [sortBy, setSortBy] = useState<string>("dueDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    if (user?.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const data = await getAllTasksAdmin({
          status: status || undefined,
          priority: priority || undefined,
          page: currentPage,
          size: 10,
          sortBy,
          sortDir,
        });
        setTasks(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === "ADMIN") {
      fetchTasks();
    }
  }, [status, priority, sortBy, sortDir, currentPage, user]);

  if (user?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600 mt-1">View all tasks from all users</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
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
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner />
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="text-slate-400 mb-3">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-1">
            No tasks found
          </h3>
          <p className="text-slate-500">No tasks match the current filters</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.map((task, idx) => {
                  const overdue = isOverdue(task.dueDate);
                  return (
                    <tr
                      key={task.id}
                      className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                    >
                      <td className="px-4 py-3 text-xs text-slate-400 font-mono">
                        {task.id}
                      </td>
                      <td className="px-4 py-3">
                        <div
                          className="text-sm font-medium text-slate-800 max-w-56 truncate"
                          title={task.title}
                        >
                          {task.title}
                        </div>
                        {task.description && (
                          <div className="text-xs text-slate-400 max-w-56 truncate mt-0.5">
                            {task.description}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                        {task.userName}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={getStatusBadgeClass(task.status)}>
                          {getStatusLabel(task.status)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={getPriorityBadgeClass(task.priority)}
                        >
                          {getPriorityLabel(task.priority)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div
                          className={`text-sm whitespace-nowrap ${
                            overdue
                              ? "text-red-500 font-medium"
                              : "text-slate-600"
                          }`}
                        >
                          {formatDate(task.dueDate)}
                          {overdue && (
                            <span className="block text-xs">(Overdue)</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="border-t border-slate-200 p-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
