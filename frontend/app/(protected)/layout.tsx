"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Menu } from "lucide-react";

interface JwtPayload {
  exp: number;
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, isLoading } = useAuth();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!token) {
        router.replace("/login");
        return;
      }
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.exp <= Date.now() / 1000) {
          router.replace("/login");
        }
      } catch {
        router.replace("/login");
      }
    }
  }, [token, isLoading, router]);

  if (isLoading || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop sidebar — sticky in normal flow, adjusts width on collapse */}
      <div
        className={`hidden lg:flex sticky top-0 h-screen shrink-0 p-4 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-22" : "w-72"
        }`}
      >
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobile={false}
          onClose={() => {}}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-100 shadow-sm sticky top-0 z-30">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-xl hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-playfair text-lg font-bold text-slate-800">
            TaskBoard
          </span>
        </div>

        <main className="flex-1 p-6">{children}</main>
      </div>

      {/* Mobile overlay — always rendered for smooth fade transition */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
          isMobileOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop fades in/out */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            isMobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMobileOpen(false)}
        />
        {/* Sidebar slides in/out */}
        <div
          className={`absolute left-0 top-0 h-full p-4 transition-transform duration-300 ease-in-out ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar
            isCollapsed={false}
            setIsCollapsed={() => {}}
            isMobile={true}
            onClose={() => setIsMobileOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}
