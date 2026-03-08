"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createTask } from "@/lib/api/tasks";
import { TaskRequest } from "@/types";
import TaskForm from "@/components/tasks/TaskForm";

export default function NewTaskPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: TaskRequest) => {
    setIsLoading(true);
    try {
      await createTask(data);
      toast.success("Task created successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Create task error:", error);
      toast.error("Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Create New Task</h1>
        <p className="text-slate-600 mt-1">Add a new task to your list</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <TaskForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitLabel="Create Task"
        />
      </div>
    </div>
  );
}
