"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { TaskResponse } from "@/types";
import { updateTask, deleteTask } from "@/lib/api/tasks";
import Badge from "@/components/ui/Badge";
import {
  formatDate,
  isOverdue,
  getStatusLabel,
  getPriorityLabel,
  getStatusBadgeClass,
  getPriorityBadgeClass,
} from "@/lib/utils";

interface TaskCardProps {
  task: TaskResponse;
  onUpdate: () => void;
}

export default function TaskCard({ task, onUpdate }: TaskCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMarkingDone, setIsMarkingDone] = useState(false);

  const handleMarkDone = async () => {
    setIsMarkingDone(true);
    try {
      await updateTask(task.id, {
        title: task.title,
        description: task.description,
        status: "DONE",
        priority: task.priority,
        dueDate: task.dueDate,
      });
      toast.success("Task marked as done!");
      onUpdate();
    } catch (error: unknown) {
      let errorMessage = "Failed to update task";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setIsMarkingDone(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      toast.success("Task deleted.");
      onUpdate();
    } catch (error: unknown) {
      let errorMessage = "Failed to delete task";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const overdue = isOverdue(task.dueDate);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow">
      {/* Top section: Title + Status badge */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-semibold text-slate-800 line-clamp-2 flex-1">
          {task.title}
        </h3>
        <Badge className={getStatusBadgeClass(task.status)}>
          {getStatusLabel(task.status)}
        </Badge>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-500 line-clamp-2 mb-4">
        {task.description || "No description"}
      </p>

      {/* Tags: Priority + Due Date */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Badge className={getPriorityBadgeClass(task.priority)}>
          {getPriorityLabel(task.priority)}
        </Badge>
        <div
          className={`flex items-center gap-1 text-xs ${
            overdue ? "text-red-500 font-medium" : "text-slate-600"
          }`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>
            {formatDate(task.dueDate)}
            {overdue && " (Overdue)"}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      {!showDeleteConfirm ? (
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={`/tasks/${task.id}/edit`}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </Link>

          {task.status !== "DONE" && (
            <button
              onClick={handleMarkDone}
              disabled={isMarkingDone}
              className="text-sm text-green-600 hover:text-green-700 font-medium disabled:opacity-50"
            >
              {isMarkingDone ? "Marking..." : "Mark Done"}
            </button>
          )}

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1 ml-auto"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-700">Confirm delete?</span>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Yes"}
          </button>
          <button
            onClick={() => setShowDeleteConfirm(false)}
            disabled={isDeleting}
            className="text-sm border border-slate-300 text-slate-700 px-3 py-1 rounded hover:bg-slate-50"
          >
            No
          </button>
        </div>
      )}
    </div>
  );
}
