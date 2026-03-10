"use client";

import { useState, useRef, useEffect } from "react";
import { TaskResponse, TaskPriority, TaskStatus } from "@/types";
import {
  Calendar,
  Edit2,
  Trash2,
  MoreVertical,
  MoveRight,
  AlertCircle,
} from "lucide-react";
import { formatDate, isOverdue, getPriorityLabel } from "@/lib/utils";

interface TaskCardProps {
  task: TaskResponse;
  currentStatus: TaskStatus;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (task: TaskResponse, newStatus: TaskStatus) => void;
  onDragStart: (task: TaskResponse) => void;
}

const priorityColors: Record<TaskPriority, string> = {
  LOW: "bg-green-100 text-green-700 border-green-200",
  MEDIUM: "bg-amber-100 text-amber-700 border-amber-200",
  HIGH: "bg-red-100 text-red-700 border-red-200",
};

const priorityIcons: Record<TaskPriority, string> = {
  LOW: "🟢",
  MEDIUM: "🟡",
  HIGH: "🔴",
};

const ALL_STATUSES: { value: TaskStatus; label: string }[] = [
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
];

export default function TaskCard({
  task,
  currentStatus,
  onEdit,
  onDelete,
  onMove,
  onDragStart,
}: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showMoveSubmenu, setShowMoveSubmenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const overdue = task.dueDate ? isOverdue(task.dueDate) : false;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
        setShowMoveSubmenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const availableStatuses = ALL_STATUSES.filter(
    (s) => s.value !== currentStatus
  );

  return (
    <div
      draggable
      onDragStart={() => onDragStart(task)}
      className="group bg-white rounded-2xl p-5 shadow-md hover:shadow-xl border border-emerald-100 hover:border-emerald-300 transition-all duration-300 cursor-grab active:cursor-grabbing flex flex-col gap-3"
    >
      {/* Title row with actions */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-emerald-700 transition-colors flex-1 line-clamp-2">
          {task.title}
        </h3>

        <div className="flex items-center gap-1 shrink-0">
          {/* Priority emoji */}
          <span className="text-base">{priorityIcons[task.priority]}</span>

          {/* Desktop: hover-reveal edit & delete */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="hidden md:block opacity-0 group-hover:opacity-100 p-2 hover:bg-emerald-50 rounded-lg transition-all duration-200"
            aria-label="Edit task"
          >
            <Edit2 className="w-4 h-4 text-emerald-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="hidden md:block opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-lg transition-all duration-200"
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>

          {/* Mobile: 3-dot dropdown menu */}
          <div className="relative md:hidden" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
                setShowMoveSubmenu(false);
              }}
              className="p-2.5 hover:bg-slate-100 rounded-lg transition-all"
              aria-label="Task options"
              aria-expanded={showMenu}
            >
              <MoreVertical className="w-5 h-5 text-slate-500" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-9 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50">
                {!showMoveSubmenu ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMoveSubmenu(true);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <MoveRight className="w-4 h-4" />
                        Move
                      </span>
                      <span className="text-xs text-slate-400">›</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMoveSubmenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100"
                    >
                      <span className="text-xs">‹</span>
                      Back
                    </button>
                    {availableStatuses.map((s) => (
                      <button
                        key={s.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMove(task, s.value);
                          setShowMenu(false);
                          setShowMoveSubmenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      >
                        {s.label}
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Priority badge */}
      <div>
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
            priorityColors[task.priority]
          }`}
        >
          <AlertCircle className="w-3 h-3" />
          {getPriorityLabel(task.priority)}
        </span>
      </div>

      {/* Due date */}
      {task.dueDate && (
        <div
          className={`flex items-center gap-2 text-xs pt-2 border-t border-slate-100 ${
            overdue ? "text-red-500" : "text-slate-500"
          }`}
        >
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span className="font-medium">
            {formatDate(task.dueDate)}
            {overdue && " · Overdue"}
          </span>
        </div>
      )}
    </div>
  );
}
