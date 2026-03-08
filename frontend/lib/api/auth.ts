import axiosInstance from "@/lib/axios";
import { AuthResponse, LoginRequest, RegisterRequest } from "@/types";

export const registerUser = async (
  data: RegisterRequest
): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(
    "/auth/register",
    data
  );
  return response.data;
};

export const loginUser = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>("/auth/login", data);
  return response.data;
};
