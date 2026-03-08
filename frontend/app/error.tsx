"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, Home, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-12">
          {/* Error Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
          
          {/* Heading */}
          <h1 className="text-3xl font-heading font-bold tracking-tight text-slate-900 mb-2">
            Oops!
          </h1>
          <h2 className="text-lg font-heading font-semibold text-slate-700 mb-2">
            Something went wrong
          </h2>
          <p className="text-base text-slate-600 leading-relaxed mb-8">
            An error occurred while processing your request. Please try again.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="bg-linear-to-r from-emerald-500 to-teal-600 text-white px-6 py-3.5 
                rounded-xl font-semibold text-base hover:from-emerald-600 hover:to-teal-700 
                hover:shadow-lg hover:shadow-emerald-200/50 hover:scale-[1.02] transform 
                transition-all duration-300 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-3.5 border border-slate-300 text-slate-700 
                rounded-xl font-semibold text-base hover:bg-slate-50 transition-all 
                flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
