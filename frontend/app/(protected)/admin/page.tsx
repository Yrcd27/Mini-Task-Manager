"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAllTasksAdmin } from "@/lib/api/tasks";
import { TaskResponse, TaskStatus, TaskPriority } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle, Clock, ListTodo, Users, SlidersHorizontal } from "lucide-react";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CustomSelect from "@/components/ui/CustomSelect";
import {
  formatDate,
  isOverdue,
  getStatusLabel,
  getPriorityLabel,
  getStatusBadgeClass,
  getPriorityBadgeClass,
} from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "",            label: "All Statuses" },
  { value: "TODO",        label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE",        label: "Done" },
];
const PRIORITY_OPTIONS = [
  { value: "",       label: "All Priorities" },
  { value: "LOW",    label: "🟢 Low" },
  { value: "MEDIUM", label: "🟡 Medium" },
  { value: "HIGH",   label: "🔴 High" },
];
const SORT_OPTIONS = [
  { value: "createdAt", label: "Date Created" },
  { value: "dueDate",   label: "Due Date" },
  { value: "priority",  label: "Priority" },
];
const DIR_OPTIONS = [
  { value: "ASC",  label: "Ascending" },
  { value: "DESC", label: "Descending" },
];

export default function AdminPage() {
  const { user } = useAuth();
  const router   = useRouter();

  const [tasks, setTasks]           = useState<TaskResponse[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  const [status, setStatus]     = useState<TaskStatus | "">("");
  const [priority, setPriority] = useState<TaskPriority | "">("");
  const [sortBy, setSortBy]     = useState<"createdAt" | "dueDate" | "priority">("dueDate");
  const [sortDir, setSortDir]   = useState<"ASC" | "DESC">("ASC");

  useEffect(() => {
    if (user?.role !== "ADMIN") router.replace("/dashboard");
  }, [user, router]);

  useEffect(() => {
    if (user?.role !== "ADMIN") return;
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await getAllTasksAdmin({
          status: status || undefined,
          priority: priority || undefined,
          page: currentPage,
          size: 20,
          sortBy,
          sortDir,
        });
        setTasks(data.content);
        setTotalPages(data.totalPages);
      } finally { setIsLoading(false); }
    };
    load();
  }, [status, priority, sortBy, sortDir, currentPage, user]);

  if (user?.role !== "ADMIN") return null;

  const stats = {
    total:      tasks.length,
    todo:       tasks.filter((t) => t.status === "TODO").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    done:       tasks.filter((t) => t.status === "DONE").length,
  };

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 font-heading mb-1">Admin Dashboard</h1>
            <p className="text-slate-500">Overview of all tasks across all users</p>
          </div>
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 bg-white border-2 border-emerald-200
              text-emerald-700 px-5 py-2.5 rounded-xl font-semibold text-sm
              hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 shrink-0"
          >
            <Users className="w-4 h-4" />
            Manage Users
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Tasks", value: stats.total,      icon: ListTodo,      bg: "bg-emerald-50",  border: "border-emerald-100", iconColor: "text-emerald-600" },
          { label: "To Do",       value: stats.todo,       icon: Clock,         bg: "bg-slate-50",    border: "border-slate-200",   iconColor: "text-slate-500"   },
          { label: "In Progress", value: stats.inProgress, icon: Clock,         bg: "bg-amber-50",    border: "border-amber-100",   iconColor: "text-amber-500"   },
          { label: "Completed",   value: stats.done,       icon: CheckCircle,   bg: "bg-emerald-50",  border: "border-emerald-100", iconColor: "text-emerald-600" },
        ].map((s) => (
          <div
            key={s.label}
            className={`bg-white rounded-2xl p-5 border ${s.border} shadow-md hover:shadow-lg transition-shadow`}
          >
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.iconColor}`} />
            </div>
            <p className="text-3xl font-bold text-slate-800">{s.value}</p>
            <p className="text-sm text-slate-500 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-200 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-800">Filters</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Status</label>
            <CustomSelect value={status} onChange={(v) => setStatus(v as TaskStatus | "")} options={STATUS_OPTIONS} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Priority</label>
            <CustomSelect value={priority} onChange={(v) => setPriority(v as TaskPriority | "")} options={PRIORITY_OPTIONS} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Sort By</label>
            <CustomSelect value={sortBy} onChange={(v) => setSortBy(v as "createdAt" | "dueDate" | "priority")} options={SORT_OPTIONS} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Order</label>
            <CustomSelect value={sortDir} onChange={(v) => setSortDir(v as "ASC" | "DESC")} options={DIR_OPTIONS} />
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20"><LoadingSpinner /></div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-md">
          <ListTodo className="w-14 h-14 mx-auto text-slate-300 mb-4" />
          <p className="text-slate-600 font-semibold">No tasks found</p>
          <p className="text-slate-400 text-sm mt-1">No tasks match the current filters</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-linear-to-r from-emerald-50 to-emerald-100/50 border-b-2 border-emerald-100">
                <tr>
                  {["ID","Title","User","Status","Priority","Due Date"].map((h) => (
                    <th key={h} className="px-4 py-4 text-left text-xs font-bold text-emerald-900 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.map((task, idx) => {
                  const overdue = isOverdue(task.dueDate);
                  return (
                    <tr
                      key={task.id}
                      className={`hover:bg-emerald-50/40 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}
                    >
                      <td className="px-4 py-4 text-xs text-slate-400 font-mono">{task.id}</td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-semibold text-slate-800 max-w-xs truncate">{task.title}</p>
                        {task.description && (
                          <p className="text-xs text-slate-400 max-w-xs truncate mt-0.5">{task.description}</p>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700 font-medium whitespace-nowrap">{task.userName}</td>
                      <td className="px-4 py-4">
                        <Badge className={getStatusBadgeClass(task.status)}>{getStatusLabel(task.status)}</Badge>
                      </td>
                      <td className="px-4 py-4">
                        <Badge className={getPriorityBadgeClass(task.priority)}>{getPriorityLabel(task.priority)}</Badge>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-sm whitespace-nowrap ${overdue ? "text-red-600 font-semibold" : "text-slate-600"}`}>
                          {task.dueDate ? formatDate(task.dueDate) : "—"}
                          {overdue && <span className="block text-xs">(Overdue)</span>}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="border-t border-slate-100 p-4 flex items-center justify-between bg-slate-50/50">
              <p className="text-sm text-slate-500">Page {currentPage + 1} of {totalPages}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border-2 border-slate-200
                    rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-emerald-500 to-emerald-600
                    rounded-xl hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
