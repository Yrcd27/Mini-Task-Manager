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
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Logo */}
        <Link
          href="/dashboard"
          className="text-xl font-bold text-indigo-600 hover:text-indigo-700"
        >
          TaskFlow
        </Link>

        {/* Center: Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-slate-700 hover:text-indigo-600 font-medium transition-colors"
          >
            My Tasks
          </Link>
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="text-slate-700 hover:text-indigo-600 font-medium transition-colors"
            >
              Admin
            </Link>
          )}
        </div>

        {/* Right: User info + Logout */}
        <div className="flex items-center gap-4">
          <span className="text-slate-700 text-sm">{user?.name}</span>
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
