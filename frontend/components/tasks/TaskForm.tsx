"use client";

import { FormEvent, ChangeEvent, useState } from "react";
import Link from "next/link";
import { TaskRequest, TaskStatus, TaskPriority } from "@/types";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

interface TaskFormProps {
  initialValues?: Partial<TaskRequest>;
  onSubmit: (data: TaskRequest) => Promise<void>;
  isLoading: boolean;
  submitLabel: string;
  isEdit?: boolean;
}

export default function TaskForm({
  initialValues,
  onSubmit,
  isLoading,
  submitLabel,
  isEdit = false,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(
    initialValues?.description || ""
  );
  const [status, setStatus] = useState<TaskStatus>(
    initialValues?.status || "TODO"
  );
  const [priority, setPriority] = useState<TaskPriority>(
    initialValues?.priority || "MEDIUM"
  );
  const [dueDate, setDueDate] = useState(initialValues?.dueDate || "");
  const [titleError, setTitleError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTitleError("");

    if (!title.trim()) {
      setTitleError("Title is required");
      return;
    }
    if (title.trim().length < 3) {
      setTitleError("Title must be at least 3 characters");
      return;
    }
    if (!dueDate) return;

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <Input
        type="text"
        label="Title"
        value={title}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setTitle(e.target.value);
          if (titleError) setTitleError("");
        }}
        placeholder="Enter task title (3–100 characters)"
        required
        minLength={3}
        maxLength={100}
        error={titleError}
      />

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Description{" "}
          <span className="text-slate-400 font-normal text-xs">(optional)</span>
        </label>
        <textarea
          value={description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setDescription(e.target.value)
          }
          placeholder="Add more details about this task…"
          maxLength={500}
          rows={4}
          className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 px-3 py-2.5 text-sm hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none"
        />
        <p className="text-xs text-slate-400 mt-1 text-right">
          {description.length}/500
        </p>
      </div>

      {/* Status + Priority on same row */}
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Status"
          value={status}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setStatus(e.target.value as TaskStatus)
          }
          required
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </Select>

        <Select
          label="Priority"
          value={priority}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setPriority(e.target.value as TaskPriority)
          }
          required
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </Select>
      </div>

      {/* Due Date */}
      <Input
        type="date"
        label="Due Date"
        value={dueDate}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setDueDate(e.target.value)}
        min={isEdit ? undefined : today}
        required
      />

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" isLoading={isLoading} className="flex-1">
          {submitLabel}
        </Button>
        <Link href="/dashboard" className="flex-1">
          <Button type="button" variant="ghost" className="w-full">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
