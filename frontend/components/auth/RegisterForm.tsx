"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { registerUser } from "@/lib/api/auth";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Lock, AlertCircle, Sparkles, ArrowRight, UserPlus } from "lucide-react";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agreeToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    setIsLoading(true);

    try {
      const response = await registerUser({ name, email, password });
      login(response);
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error: unknown) {
      let errorMessage = "Registration failed. Please try again.";
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
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl grid items-center gap-12 md:gap-16 md:grid-cols-2">
        {/* Left: hero copy — hidden on mobile */}
        <section className="hidden md:flex flex-col space-y-6 animate-slideInLeft">
          <div className="self-start inline-flex items-center gap-2 rounded-full bg-white/80 border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm shadow-emerald-100">
            <Sparkles className="w-4 h-4" />
            Join TaskBoard Today!
          </div>
          <div>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
              Start Your{" "}
              <span className="text-emerald-600">Productivity Journey</span>
            </h1>
            <p className="mt-4 text-base lg:text-lg text-slate-600 max-w-lg leading-relaxed">
              Create your free account and unlock powerful tools to organize, prioritize, and accomplish your goals with ease.
            </p>
          </div>
        </section>

        {/* Right: form card */}
        <section className="animate-slideInRight w-full">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 px-6 sm:px-8 py-8 sm:py-10">
            <div className="mb-8">
              <h2 className="text-3xl font-heading font-bold text-slate-900">
                Create Account
              </h2>
              <p className="mt-2 text-base text-slate-500">
                Fill in your details to get started
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <User className="w-4 h-4 text-emerald-600" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setName(e.target.value)
                  }
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50
                    focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white
                    transition-all outline-none text-base text-slate-900"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50
                    focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white
                    transition-all outline-none text-base text-slate-900"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Minimum 6 characters"
                  required
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50
                    focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white
                    transition-all outline-none text-base text-slate-900"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Confirm your password"
                  required
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50
                    focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white
                    transition-all outline-none text-base text-slate-900"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-emerald-600 
                      focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
                  />
                  <span className="text-sm text-slate-600 leading-relaxed">
                    I agree to the{" "}
                    <Link href="/terms" className="font-medium text-emerald-600 hover:text-emerald-700">
                      Terms of Service
                    </Link>
                    {" "}and{" "}
                    <Link href="/privacy" className="font-medium text-emerald-600 hover:text-emerald-700">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-emerald-500 to-teal-600 text-white rounded-xl py-3.5 font-semibold text-base
                  hover:from-emerald-600 hover:to-teal-700 hover:shadow-lg hover:shadow-emerald-200/60
                  transform transition-all duration-200 
                  disabled:opacity-60 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2"
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
                    Creating account...
                  </span>
                ) : (
                  <>
                    Create Account
                    <UserPlus className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-600 mb-2">
                Already have an account?
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-base font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Sign in to your account
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
