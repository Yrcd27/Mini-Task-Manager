"use client";

import { useState, FormEvent, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { registerUser } from "@/lib/api/auth";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "One digit", test: (p) => /\d/.test(p) },
  {
    label: "One special character (@#$%^&+=!)",
    test: (p) => /[@#$%^&+=!]/.test(p),
  },
];

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  // Check which password requirements are met
  const passwordChecks = useMemo(() => {
    return passwordRequirements.map((req) => ({
      ...req,
      met: req.test(password),
    }));
  }, [password]);

  const allRequirementsMet = passwordChecks.every((check) => check.met);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!allRequirementsMet) {
      toast.error("Password does not meet all requirements");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await registerUser({ name, email, password });
      // Backend returns token on successful registration
      login(response);
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error: unknown) {
      let errorMessage = "Registration failed. Please try again.";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600 mb-2">TaskFlow</h1>
          <p className="text-slate-600">Create your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
            autoComplete="name"
          />

          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-slate-500 hover:text-slate-700 text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Password Requirements Hints */}
          {password && (
            <div className="bg-slate-50 rounded-lg p-3 space-y-1">
              <p className="text-xs font-medium text-slate-700 mb-2">
                Password requirements:
              </p>
              {passwordChecks.map((check, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  {check.met ? (
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                  <span
                    className={
                      check.met ? "text-green-700" : "text-slate-600"
                    }
                  >
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-slate-500 hover:text-slate-700 text-sm"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full">
            Create Account
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            Login →
          </Link>
        </p>
      </div>
    </div>
  );
}
