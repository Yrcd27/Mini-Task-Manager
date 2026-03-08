"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { getTaskById, updateTask } from "@/lib/api/tasks";
import { TaskRequest, TaskResponse } from "@/types";
import TaskForm from "@/components/tasks/TaskForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function EditTaskPage() {
  const [task, setTask] = useState<TaskResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await getTaskById(Number(taskId));
        setTask(data);
      } catch (error) {
        console.error("Fetch task error:", error);
        toast.error("Failed to load task");
        router.push("/dashboard");
      } finally {
        setIsFetching(false);
      }
    };

    fetchTask();
  }, [taskId, router]);

  const handleSubmit = async (data: TaskRequest) => {
    setIsLoading(true);
    try {
      await updateTask(Number(taskId), data);
      toast.success("Task updated successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Update task error:", error);
      toast.error("Failed to update task");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (!task) return null;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Edit Task</h1>
        <p className="text-slate-600 mt-1">Update task details</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <TaskForm
          initialValues={task}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitLabel="Save Changes"
          isEdit
        />
      </div>
    </div>
  );
}
