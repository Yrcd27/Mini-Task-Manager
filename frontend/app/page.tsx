"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckSquare, Sparkles, ArrowRight, Menu, X } from "lucide-react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="h-screen overflow-hidden bg-linear-to-br from-emerald-50 via-white to-teal-50 flex flex-col">
      {/* Top bar */}
      <header className="w-full relative flex items-center justify-between px-5 sm:px-8 md:px-16 lg:px-24 py-4 sm:py-6 md:py-7">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-200/70">
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-xl font-bold text-slate-900 tracking-tight">
              TaskBoard
            </span>
            <span className="hidden sm:block text-xs text-slate-500">
              Simple, fast task management
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-3 md:gap-4">
          {/* Desktop nav */}
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-emerald-400 text-emerald-700 text-sm font-semibold px-4 py-2 md:px-5 md:py-2.5 hover:bg-emerald-50 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-emerald-500 text-white text-sm font-semibold px-4 py-2 md:px-5 md:py-2.5 shadow-lg shadow-emerald-200/60 hover:bg-emerald-600 transition-colors"
          >
            Get started
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="sm:hidden p-2.5 rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-colors"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="sm:hidden absolute top-full left-0 right-0 mx-5 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors mt-1"
            >
              Get started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </header>

      {/* Hero section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 pb-25">
        <div className="space-y-8 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm shadow-emerald-100">
            <Sparkles className="w-4 h-4" />
            Built for focused, high-impact work
          </div>

          <div>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl leading-tight font-bold tracking-tight text-slate-900">
              Make your workday
              <span className="block text-emerald-600">
                visible, intentional, done.
              </span>
            </h1>
            <p className="mt-5 text-sm sm:text-base md:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
              TaskBoard turns a noisy list of to&#8209;dos into a single, calm view of what
              you&apos;re committing to today — and what can wait.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 text-white text-base font-semibold px-7 py-3.5 shadow-lg shadow-emerald-200/60 hover:from-emerald-600 hover:to-teal-700 hover:shadow-xl hover:shadow-emerald-200/80 transform hover:scale-[1.01] transition-all duration-300"
            >
              Create free account
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/80 text-base font-semibold text-slate-800 px-7 py-3.5 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50/70 transition-all duration-300"
            >
              I already use TaskBoard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
