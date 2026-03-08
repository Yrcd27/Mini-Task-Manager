"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import { AuthUser, AuthResponse } from "@/types";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface JwtPayload {
  exp: number;
  sub: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth data on mount
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem("task_manager_token");
      const storedUser = localStorage.getItem("task_manager_user");

      if (storedToken && storedUser) {
        try {
          // Decode token and check expiry
          const decoded = jwtDecode<JwtPayload>(storedToken);
          const currentTime = Date.now() / 1000;

          if (decoded.exp > currentTime) {
            // Token is still valid
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          } else {
            // Token expired, clear storage
            localStorage.removeItem("task_manager_token");
            localStorage.removeItem("task_manager_user");
          }
        } catch {
          // Invalid token, clear storage
          localStorage.removeItem("task_manager_token");
          localStorage.removeItem("task_manager_user");
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (data: AuthResponse) => {
    const userData: AuthUser = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    };

    localStorage.setItem("task_manager_token", data.token);
    localStorage.setItem("task_manager_user", JSON.stringify(userData));

    setToken(data.token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("task_manager_token");
    localStorage.removeItem("task_manager_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
