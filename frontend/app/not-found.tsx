import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-12">
          {/* 404 Number */}
          <div className="text-7xl md:text-8xl font-heading font-bold bg-linear-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent mb-6">
            404
          </div>
          
          {/* Heading */}
          <h1 className="text-2xl md:text-3xl font-heading font-bold tracking-tight text-slate-900 mb-3">
            Page Not Found
          </h1>
          <p className="text-base text-slate-600 leading-relaxed mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-8 bg-emerald-100 rounded-full flex items-center justify-center">
            <Search className="w-10 h-10 text-emerald-600" />
          </div>

          {/* Action Button */}
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-emerald-500 to-teal-600 text-white px-8 py-3.5 
              rounded-xl font-semibold text-base hover:from-emerald-600 hover:to-teal-700 
              hover:shadow-lg hover:shadow-emerald-200/50 hover:scale-[1.02] transform 
              transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
