"use client";

import { useState, useEffect } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "@/lib/api/tasks";
import { TaskResponse, TaskPriority, TaskStatus } from "@/types";
import { toast } from "react-toastify";
import { Plus, Calendar, AlertCircle, Edit2, Trash2 } from "lucide-react";
import TaskModal from "@/components/dashboard/TaskModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import CustomSelect from "@/components/ui/CustomSelect";
import { formatDate, isOverdue, getPriorityLabel } from "@/lib/utils";

const PRIORITY_OPTIONS = [
  { value: "",       label: "All Priorities" },
  { value: "LOW",    label: "🟢 Low" },
  { value: "MEDIUM", label: "🟡 Medium" },
  { value: "HIGH",   label: "🔴 High" },
];

const priorityColors: Record<TaskPriority, string> = {
  LOW:    "bg-green-100 text-green-700 border-green-200",
  MEDIUM: "bg-amber-100 text-amber-700 border-amber-200",
  HIGH:   "bg-red-100  text-red-700   border-red-200",
};

export default function ScheduledPage() {
  const [tasks, setTasks]               = useState<TaskResponse[]>([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [editingTask, setEditingTask]   = useState<TaskResponse | null>(null);
  const [modalMode, setModalMode]       = useState<"create" | "edit">("create");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "">("");
  const [deleteTarget, setDeleteTarget] = useState<TaskResponse | null>(null);

  const fetch = async () => {
    setIsLoading(true);
    try {
      const res = await getTasks({ status: "TODO", page: 0, size: 200, sortBy: "createdAt", sortDir: "DESC" });
      setTasks(res.content);
    } catch { toast.error("Failed to load tasks"); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const filtered = priorityFilter ? tasks.filter((t) => t.priority === priorityFilter) : tasks;

  const openCreate = () => { setModalMode("create"); setEditingTask(null); setIsModalOpen(true); };
  const openEdit   = (t: TaskResponse) => { setModalMode("edit"); setEditingTask(t); setIsModalOpen(true); };

  const handleSubmit = async (data: { title: string; description: string; dueDate: string; priority: TaskPriority; status: TaskStatus }) => {
    if (modalMode === "create") {
      await createTask({ ...data, status: "TODO" });
      toast.success("Task created!");
    } else if (editingTask) {
      await updateTask(editingTask.id, data);
      toast.success("Task updated!");
    }
    fetch();
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
            <h1 className="text-2xl font-bold text-slate-800 font-heading">Scheduled Tasks</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {filtered.length} {filtered.length === 1 ? "task" : "tasks"} to do
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-linear-to-r from-emerald-500 to-emerald-600
              text-white px-5 py-2.5 rounded-xl font-semibold text-sm
              hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-emerald-200/50
              hover:scale-[1.02] transform transition-all duration-300 shrink-0"
          >
            <Plus className="w-4 h-4" /> New Task
          </button>
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
          <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium">No scheduled tasks</p>
          <p className="text-slate-400 text-sm mt-1">Click "New Task" to add one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((task) => {
            const overdue = task.dueDate ? isOverdue(task.dueDate) : false;
            return (
              <div
                key={task.id}
                className="group bg-white rounded-2xl p-5 shadow-md border border-slate-100
                  hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-emerald-700 transition-colors flex-1 line-clamp-2">
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => openEdit(task)}
                      className="p-1.5 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-emerald-600" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(task)}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>

                {task.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{task.description}</p>
                )}

                <span
                  className={`self-start inline-flex items-center gap-1 px-2.5 py-1 rounded-lg
                    text-xs font-semibold border ${priorityColors[task.priority]}`}
                >
                  <AlertCircle className="w-3 h-3" />
                  {getPriorityLabel(task.priority)}
                </span>

                {task.dueDate && (
                  <div
                    className={`flex items-center gap-2 text-xs pt-2 border-t border-slate-100
                      ${overdue ? "text-red-500" : "text-slate-500"}`}
                  >
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-medium">
                      {formatDate(task.dueDate)}{overdue && " · Overdue"}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        task={editingTask}
        mode={modalMode}
        defaultStatus="TODO"
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
