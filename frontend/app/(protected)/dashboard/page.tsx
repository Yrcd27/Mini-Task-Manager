"use client";

import { useState, useEffect, useRef } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "@/lib/api/tasks";
import { TaskResponse, TaskPriority, TaskStatus } from "@/types";
import { toast } from "react-toastify";
import { Plus, Search } from "lucide-react";
import KanbanColumn from "@/components/dashboard/KanbanColumn";
import TaskModal from "@/components/dashboard/TaskModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import CustomSelect from "@/components/ui/CustomSelect";

const COLUMNS: { status: TaskStatus; title: string; colorClass: string; borderColor: string }[] = [
  { status: "TODO",        title: "To Do",       colorClass: "from-slate-50 to-white",   borderColor: "border-slate-200"   },
  { status: "IN_PROGRESS", title: "In Progress", colorClass: "from-amber-50 to-white",   borderColor: "border-amber-100"   },
  { status: "DONE",        title: "Done",        colorClass: "from-emerald-50 to-white", borderColor: "border-emerald-100" },
];

const PRIORITY_OPTIONS = [
  { value: "",       label: "All Priorities" },
  { value: "LOW",    label: "🟢 Low" },
  { value: "MEDIUM", label: "🟡 Medium" },
  { value: "HIGH",   label: "🔴 High" },
];

const SORT_OPTIONS = [
  { value: "createdAt", label: "Newest First" },
  { value: "dueDate",   label: "By Due Date" },
  { value: "priority",  label: "By Priority" },
];

export default function DashboardPage() {
  const [tasks, setTasks]             = useState<TaskResponse[]>([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode]     = useState<"create" | "edit">("create");
  const [editingTask, setEditingTask] = useState<TaskResponse | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("TODO");

  const [searchQuery, setSearchQuery]     = useState("");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "">("");
  const [sortBy, setSortBy] = useState<"createdAt" | "dueDate" | "priority">("createdAt");

  // Delete confirm modal
  const [deleteTarget, setDeleteTarget] = useState<TaskResponse | null>(null);

  // Drag
  const draggedTask = useRef<TaskResponse | null>(null);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const res = await getTasks({ page: 0, size: 200, sortBy, sortDir: "DESC" });
      setTasks(res.content);
    } catch {
      toast.error("Failed to load tasks");
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, [sortBy]); // eslint-disable-line

  const filtered = tasks.filter((t) => {
    const matchSearch = !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPriority = !priorityFilter || t.priority === priorityFilter;
    return matchSearch && matchPriority;
  });

  const openCreate = (status: TaskStatus = "TODO") => {
    setModalMode("create"); setEditingTask(null); setDefaultStatus(status); setIsModalOpen(true);
  };
  const openEdit = (task: TaskResponse) => {
    setModalMode("edit"); setEditingTask(task); setIsModalOpen(true);
  };

  const handleSubmit = async (data: { title: string; description: string; dueDate: string; priority: TaskPriority; status: TaskStatus }) => {
    if (modalMode === "create") {
      await createTask(data);
      toast.success("Task created!");
    } else if (editingTask) {
      await updateTask(editingTask.id, data);
      toast.success("Task updated!");
    }
    fetchTasks();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTask(deleteTarget.id);
      toast.success("Task deleted!");
      fetchTasks();
    } catch {
      toast.error("Failed to delete task");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleMove = async (task: TaskResponse, newStatus: TaskStatus) => {
    if (task.status === newStatus) return;
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)));
    try {
      await updateTask(task.id, {
        title: task.title,
        description: task.description || "",
        dueDate: task.dueDate || "",
        priority: task.priority,
        status: newStatus,
      });
    } catch {
      toast.error("Failed to move task");
      fetchTasks();
    }
  };

  const handleDragStart = (task: TaskResponse) => { draggedTask.current = task; };
  const handleDragOver  = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };
  const handleDrop      = (status: TaskStatus) => {
    if (draggedTask.current) { handleMove(draggedTask.current, status); draggedTask.current = null; }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Top Bar */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h1 className="text-2xl font-heading font-bold tracking-tight text-slate-900">My Tasks</h1>
            <p className="text-sm text-slate-500 mt-1">{tasks.length} {tasks.length === 1 ? "task" : "tasks"} total</p>
          </div>
          <button
            onClick={() => openCreate()}
            className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-emerald-500 to-emerald-600
              text-white px-5 py-2.5 rounded-xl font-semibold text-sm w-full sm:w-auto
              hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-emerald-200/50
              hover:scale-[1.02] transform transition-all duration-300 shrink-0"
          >
            <Plus className="w-4 h-4" /> New Task
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-3 border-2 border-slate-200 rounded-xl
                focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
                transition-all outline-none text-sm text-slate-900"
            />
          </div>
          <CustomSelect
            value={priorityFilter}
            onChange={(v) => setPriorityFilter(v as TaskPriority | "")}
            options={PRIORITY_OPTIONS}
            placeholder="All Priorities"
            className="sm:w-44"
          />
          <CustomSelect
            value={sortBy}
            onChange={(v) => setSortBy(v as "createdAt" | "dueDate" | "priority")}
            options={SORT_OPTIONS}
            className="sm:w-44"
          />
        </div>
      </div>

      {/* Kanban Board */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Loading tasks…</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.status}
              title={col.title}
              status={col.status}
              tasks={filtered}
              colorClass={col.colorClass}
              borderColor={col.borderColor}
              onEdit={openEdit}
              onDelete={(id) => {
                const t = tasks.find((x) => x.id === id);
                if (t) setDeleteTarget(t);
              }}
              onMove={handleMove}
              onAddClick={() => openCreate(col.status)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(col.status)}
              onDragStart={handleDragStart}
            />
          ))}
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        task={editingTask}
        mode={modalMode}
        defaultStatus={defaultStatus}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete task?"
        message={`"${deleteTarget?.title}" will be permanently deleted. This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
