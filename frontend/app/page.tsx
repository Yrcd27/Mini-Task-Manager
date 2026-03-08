import Link from "next/link";
import { CheckSquare, Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="h-screen overflow-hidden bg-linear-to-br from-emerald-50 via-white to-teal-50">
      <div className="h-full max-w-6xl mx-auto px-4 md:px-8 flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between py-6 md:py-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-200/70">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl font-bold text-slate-900 tracking-tight">
                TaskBoard
              </span>
              <span className="text-xs text-slate-500">
                Simple, fast task management
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-3 md:gap-4">
            <Link
              href="/login"
              className="hidden sm:inline-flex text-sm font-medium text-slate-700 hover:text-emerald-700 hover:underline underline-offset-4 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white text-sm font-semibold px-4 py-2 md:px-5 md:py-2.5 shadow-lg shadow-slate-900/15 hover:bg-slate-800 transition-colors"
            >
              Get started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </nav>
        </header>

        {/* Hero section */}
        <section className="flex-1 flex items-center pb-30">
          <div className="max-w-2xl space-y-8 animate-slideInLeft">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm shadow-emerald-100">
              <Sparkles className="w-4 h-4" />
              Built for focused, high-impact work
            </div>

            <div>
              <h1 className="font-heading text-5xl md:text-6xl leading-tight font-bold tracking-tight text-slate-900">
                Make your workday
                <span className="block text-emerald-600">
                  visible, intentional, done.
                </span>
              </h1>
              <p className="mt-4 text-base md:text-lg text-slate-600 max-w-xl leading-relaxed">
                TaskBoard turns a noisy list of to&#8209;dos into a single, calm view of what
                you&apos;re committing to today — and what can wait.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 text-white text-base font-semibold px-6 py-3.5 shadow-lg shadow-emerald-200/60 hover:from-emerald-600 hover:to-teal-700 hover:shadow-xl hover:shadow-emerald-200/80 transform hover:scale-[1.01] transition-all duration-300"
              >
                Create free account
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/80 text-base font-semibold text-slate-800 px-6 py-3.5 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50/70 transition-all duration-300"
              >
                I already use TaskBoard
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
