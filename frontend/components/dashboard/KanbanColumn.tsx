"use client";

import { TaskResponse, TaskStatus } from "@/types";
import TaskCard from "./TaskCard";
import { Plus } from "lucide-react";

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: TaskResponse[];
  colorClass: string;
  borderColor: string;
  onEdit: (task: TaskResponse) => void;
  onDelete: (id: number) => void;
  onMove: (task: TaskResponse, newStatus: TaskStatus) => void;
  onAddClick: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onDragStart: (task: TaskResponse) => void;
}

export default function KanbanColumn({
  title,
  status,
  tasks,
  colorClass,
  borderColor,
  onEdit,
  onDelete,
  onMove,
  onAddClick,
  onDragOver,
  onDrop,
  onDragStart,
}: KanbanColumnProps) {
  const columnTasks = tasks.filter((task) => task.status === status);

  return (
    <section
      className="flex flex-col gap-4"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Column Header — soft pastel like Nora */}
      <div
        className={`flex items-center justify-between bg-linear-to-br ${colorClass} rounded-2xl p-4 border ${borderColor}`}
      >
        <div>
          <h4 className="text-sm font-bold text-slate-800">{title}</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            {columnTasks.length} task{columnTasks.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={onAddClick}
          className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-800 hover:bg-white/60 px-2 py-1 rounded-lg transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Task list — drop zone */}
      <div className="space-y-4 min-h-50">
        {columnTasks.length === 0 ? (
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center">
            <p className="text-slate-400 text-sm">Drop tasks here</p>
          </div>
        ) : (
          columnTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              currentStatus={status}
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task.id)}
              onMove={onMove}
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>
    </section>
  );
}
