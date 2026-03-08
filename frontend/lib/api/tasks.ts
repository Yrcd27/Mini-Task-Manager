import axiosInstance from "@/lib/axios";
import {
  TaskRequest,
  TaskResponse,
  TaskFilters,
  PageResponse,
} from "@/types";

export const getTasks = async (
  filters: TaskFilters
): Promise<PageResponse<TaskResponse>> => {
  const params = new URLSearchParams();

  if (filters.status) params.append("status", filters.status);
  if (filters.priority) params.append("priority", filters.priority);
  if (filters.page !== undefined)
    params.append("page", filters.page.toString());
  if (filters.size !== undefined)
    params.append("size", filters.size.toString());
  if (filters.sortBy) params.append("sortBy", filters.sortBy);
  if (filters.sortDir) params.append("sortDir", filters.sortDir);

  const response = await axiosInstance.get<PageResponse<TaskResponse>>(
    `/tasks?${params.toString()}`
  );
  return response.data;
};

export const getTaskById = async (id: number): Promise<TaskResponse> => {
  const response = await axiosInstance.get<TaskResponse>(`/tasks/${id}`);
  return response.data;
};

export const createTask = async (data: TaskRequest): Promise<TaskResponse> => {
  const response = await axiosInstance.post<TaskResponse>("/tasks", data);
  return response.data;
};

export const updateTask = async (
  id: number,
  data: TaskRequest
): Promise<TaskResponse> => {
  const response = await axiosInstance.put<TaskResponse>(`/tasks/${id}`, data);
  return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/tasks/${id}`);
};

export const getAllTasksAdmin = async (
  filters: TaskFilters
): Promise<PageResponse<TaskResponse>> => {
  const params = new URLSearchParams();

  if (filters.status) params.append("status", filters.status);
  if (filters.priority) params.append("priority", filters.priority);
  if (filters.page !== undefined)
    params.append("page", filters.page.toString());
  if (filters.size !== undefined)
    params.append("size", filters.size.toString());
  if (filters.sortBy) params.append("sortBy", filters.sortBy);
  if (filters.sortDir) params.append("sortDir", filters.sortDir);

  const response = await axiosInstance.get<PageResponse<TaskResponse>>(
    `/admin/tasks?${params.toString()}`
  );
  return response.data;
};
