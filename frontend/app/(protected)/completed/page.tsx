"use client";

import { useState, useEffect } from "react";
import { getTasks, updateTask, deleteTask } from "@/lib/api/tasks";
import { TaskResponse, TaskPriority, TaskStatus } from "@/types";
import { toast } from "react-toastify";
import { CheckCircle2, Calendar, Trash2 } from "lucide-react";
import TaskModal from "@/components/dashboard/TaskModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import CustomSelect from "@/components/ui/CustomSelect";
import { formatDate, getPriorityLabel } from "@/lib/utils";

const PRIORITY_OPTIONS = [
  { value: "",       label: "All Priorities" },
  { value: "LOW",    label: "🟢 Low" },
  { value: "MEDIUM", label: "🟡 Medium" },
  { value: "HIGH",   label: "🔴 High" },
];

const priorityColors: Record<TaskPriority, string> = {
  LOW:    "bg-green-100 text-green-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  HIGH:   "bg-red-100  text-red-700",
};

export default function CompletedPage() {
  const [tasks, setTasks]             = useState<TaskResponse[]>([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskResponse | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "">("");
  const [deleteTarget, setDeleteTarget] = useState<TaskResponse | null>(null);

  const fetch = async () => {
    setIsLoading(true);
    try {
      const res = await getTasks({ status: "DONE", page: 0, size: 200, sortBy: "createdAt", sortDir: "DESC" });
      setTasks(res.content);
    } catch { toast.error("Failed to load tasks"); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const filtered = priorityFilter ? tasks.filter((t) => t.priority === priorityFilter) : tasks;

  const handleSubmit = async (data: { title: string; description: string; dueDate: string; priority: TaskPriority; status: TaskStatus }) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
      toast.success("Task updated!");
      fetch();
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try { await deleteTask(deleteTarget.id); toast.success("Task deleted!"); fetch(); }
    catch { toast.error("Failed to delete task"); }
    finally { setDeleteTarget(null); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h1 className="text-2xl font-heading font-bold tracking-tight text-slate-900">Completed Tasks</h1>
            <p className="text-sm text-slate-500 mt-1">
              {filtered.length} {filtered.length === 1 ? "task" : "tasks"} completed
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">{tasks.length} done</span>
          </div>
        </div>
        <CustomSelect
          value={priorityFilter}
          onChange={(v) => setPriorityFilter(v as TaskPriority | "")}
          options={PRIORITY_OPTIONS}
          className="sm:w-52"
        />
      </div>

      {/* Task grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-16 text-center">
          <CheckCircle2 className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium">No completed tasks yet</p>
          <p className="text-slate-400 text-sm mt-1">Complete tasks from the dashboard to see them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((task) => (
            <div
              key={task.id}
              className="group bg-white rounded-2xl p-5 shadow-md border border-emerald-100/60
                hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col gap-3"
            >
              {/* Completion badge + actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Completed
                  </span>
                </div>
                <button
                  onClick={() => setDeleteTarget(task)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>

              <h3 className="font-bold text-slate-700 text-sm leading-snug line-clamp-2 line-through decoration-slate-300">
                {task.title}
              </h3>

              {task.description && (
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{task.description}</p>
              )}

              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${priorityColors[task.priority]}`}>
                  {getPriorityLabel(task.priority)}
                </span>
                {task.dueDate && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(task.dueDate)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        task={editingTask}
        mode="edit"
        defaultStatus="DONE"
      />
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete task?"
        message={`"${deleteTarget?.title}" will be permanently deleted.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
