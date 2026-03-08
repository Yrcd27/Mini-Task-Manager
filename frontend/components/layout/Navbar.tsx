"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10 px-4 md:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center shadow-sm shadow-emerald-200/80">
            <span className="text-white text-sm font-semibold">TB</span>
          </div>
          <span className="font-heading text-lg font-bold text-slate-900 tracking-tight">
            TaskBoard
          </span>
        </Link>

        {/* Center: Nav Links */}
        <div className="hidden md:flex items-center gap-4 text-sm">
          <Link
            href="/dashboard"
            className="text-slate-700 hover:text-emerald-700 font-medium transition-colors"
          >
            My tasks
          </Link>
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="text-slate-700 hover:text-emerald-700 font-medium transition-colors"
            >
              Admin
            </Link>
          )}
        </div>

        {/* Right: User info + Logout */}
        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden sm:inline text-slate-700 text-sm max-w-[140px] truncate">
              {user.name}
            </span>
          )}
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
