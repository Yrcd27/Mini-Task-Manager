"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { loginUser } from "@/lib/api/auth";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckSquare } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginUser({ email, password });
      login(response);
      toast.success(`Welcome back, ${response.name}!`);
      router.push("/dashboard");
    } catch (error: unknown) {
      let errorMessage = "Login failed. Please check your credentials.";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4">
              <CheckSquare className="w-9 h-9 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 font-heading mb-2">
              Welcome Back
            </h2>
            <p className="text-slate-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl 
                    focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 
                    transition-all outline-none text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-12 py-3 border-2 border-slate-200 rounded-xl 
                    focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 
                    transition-all outline-none text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 
                    hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-emerald-500 to-teal-600 text-white 
                rounded-xl py-3 font-semibold hover:from-emerald-600 hover:to-teal-700 
                hover:shadow-lg hover:shadow-emerald-200/50 transform 
                transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
