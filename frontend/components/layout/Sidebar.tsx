"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  LogOut,
  ChevronLeft,
  X,
  UserCircle,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobile: boolean;
  onClose: () => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed, isMobile, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard",       href: "/dashboard", adminOnly: false },
    { id: "scheduled", icon: Calendar,         label: "Scheduled",       href: "/scheduled", adminOnly: false },
    { id: "completed", icon: CheckCircle2,     label: "Completed",       href: "/completed", adminOnly: false },
    { id: "admin",     icon: LayoutDashboard,  label: "Admin Dashboard", href: "/admin",     adminOnly: true  },
    { id: "users",     icon: Users,            label: "Users",           href: "/admin/users", adminOnly: true },
  ];

  const filtered = navItems.filter((i) => !i.adminOnly || user?.role === "ADMIN");
  const collapsed = isCollapsed && !isMobile;

  return (
    <>
      <ConfirmModal
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
        title="Log out?"
        message="You'll be signed out of your account. Any unsaved changes will be lost."
        confirmLabel="Log out"
        variant="logout"
      />

      <aside
        className={`flex flex-col h-full bg-white/90 backdrop-blur-md border border-emerald-100
          shadow-lg rounded-3xl transition-all duration-300 ease-in-out overflow-hidden
          ${isMobile ? "w-64" : "w-full"}`}
      >
        {/* Header */}
        <div
          className={`flex items-center border-b border-slate-100 transition-all duration-300
            ${collapsed ? "justify-center py-5 px-3" : "justify-between p-5"}`}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <span
              className={`font-heading text-xl font-bold text-slate-800 whitespace-nowrap
                transition-all duration-300 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
            >
              TaskBoard
            </span>
          </div>

          {!isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-700
                transition-all duration-200 shrink-0"
            >
              <ChevronLeft
                className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
              />
            </button>
          )}
          {isMobile && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav
          className={`flex-1 space-y-1 py-4 transition-all duration-300
            ${collapsed ? "px-3" : "px-4"}`}
        >
          {filtered.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => isMobile && onClose()}
                className={`flex items-center rounded-xl text-sm font-medium transition-all duration-200
                  ${collapsed ? "justify-center px-3 py-3" : "gap-3 px-4 py-3"}
                  ${isActive
                    ? "bg-emerald-100 text-emerald-700 font-semibold"
                    : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"}`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span
                  className={`whitespace-nowrap transition-all duration-300
                    ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div
          className={`border-t border-slate-100 py-4 space-y-3 transition-all duration-300 mt-auto
            ${collapsed ? "px-3" : "px-4"}`}
        >
          {user && (
            <div
              className={`flex items-center p-3 bg-emerald-50 rounded-xl transition-all duration-300
                ${collapsed ? "justify-center" : "gap-3"}`}
            >
              <UserCircle className="w-8 h-8 text-emerald-500 shrink-0" />
              {!collapsed && (
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setLogoutOpen(true)}
            className={`w-full flex items-center rounded-xl text-sm font-semibold text-white
              bg-linear-to-r from-emerald-500 to-emerald-600
              hover:from-emerald-600 hover:to-emerald-700
              shadow-md hover:shadow-lg hover:shadow-emerald-200/50
              transition-all duration-300
              ${collapsed ? "justify-center px-3 py-3" : "justify-center gap-2 px-4 py-3"}`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
