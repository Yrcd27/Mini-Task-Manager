"use client";

import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import { TaskResponse, TaskPriority, TaskStatus } from "@/types";
import CustomSelect from "@/components/ui/CustomSelect";
import CustomDatePicker from "@/components/ui/CustomDatePicker";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: {
    title: string;
    description: string;
    dueDate: string;
    priority: TaskPriority;
    status: TaskStatus;
  }) => Promise<void>;
  task?: TaskResponse | null;
  mode: "create" | "edit";
  defaultStatus?: TaskStatus;
}

const STATUS_OPTIONS = [
  { value: "TODO",        label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE",        label: "Done" },
];

const PRIORITY_OPTIONS = [
  { value: "LOW",    label: "🟢 Low" },
  { value: "MEDIUM", label: "🟡 Medium" },
  { value: "HIGH",   label: "🔴 High" },
];

export default function TaskModal({
  isOpen, onClose, onSubmit, task, mode, defaultStatus = "TODO",
}: TaskModalProps) {
  const [title, setTitle]           = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate]       = useState("");
  const [priority, setPriority]     = useState<TaskPriority>("MEDIUM");
  const [status, setStatus]         = useState<TaskStatus>(defaultStatus);
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState("");

  useEffect(() => {
    if (task && mode === "edit") {
      setTitle(task.title);
      setDescription(task.description || "");
      setDueDate(task.dueDate || "");
      setPriority(task.priority);
      setStatus(task.status);
    } else {
      setTitle(""); setDescription(""); setDueDate("");
      setPriority("MEDIUM"); setStatus(defaultStatus);
    }
    setError("");
  }, [task, mode, isOpen, defaultStatus]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (!title.trim()) { 
      setError("Task title is required"); 
      return; 
    }
    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters");
      return;
    }
    if (title.trim().length > 100) {
      setError("Title cannot exceed 100 characters");
      return;
    }
    if (description.trim().length > 500) {
      setError("Description cannot exceed 500 characters");
      return;
    }
    if (!dueDate) { 
      setError("Due date is required"); 
      return; 
    }
    
    // Validate date is not in the past
    const selectedDate = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setError("Due date cannot be in the past");
      return;
    }
    
    setIsLoading(true);
    try {
      await onSubmit({ 
        title: title.trim(), 
        description: description.trim() || "", 
        dueDate, 
        priority, 
        status 
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div role="dialog" aria-modal="true" aria-labelledby="task-modal-title" className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-slideInRight">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-4 sm:px-6 py-4 flex items-center justify-between z-10">
          <h2 id="task-modal-title" className="text-xl font-bold text-slate-800 font-heading">
            {mode === "create" ? "Add New Task" : "Edit Task"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4 max-h-[70vh] sm:max-h-[65vh] overflow-y-auto">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                placeholder="Enter task title"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl
                  focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
                  transition-all outline-none text-slate-900 text-sm"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Description <span className="text-xs text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                placeholder="Describe the task…"
                rows={3}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl
                  focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
                  transition-all outline-none text-slate-900 text-sm resize-none"
              />
            </div>

            {/* Status + Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
                <CustomSelect
                  value={status}
                  onChange={(v) => setStatus(v as TaskStatus)}
                  options={STATUS_OPTIONS}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Priority</label>
                <CustomSelect
                  value={priority}
                  onChange={(v) => setPriority(v as TaskPriority)}
                  options={PRIORITY_OPTIONS}
                />
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Due Date <span className="text-red-500">*</span>
              </label>
              <CustomDatePicker value={dueDate} onChange={setDueDate} placeholder="Pick a due date" />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-slate-100 px-4 sm:px-6 py-4 flex items-center justify-end gap-3 pb-safe">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200
                font-semibold text-sm transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-linear-to-r from-emerald-500 to-emerald-600
                text-white font-semibold text-sm hover:from-emerald-600 hover:to-emerald-700
                hover:shadow-lg hover:shadow-emerald-200/50 hover:scale-[1.02] transform
                transition-all duration-300 disabled:opacity-60 disabled:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving…
                </span>
              ) : mode === "create" ? "Add Task" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
