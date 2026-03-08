import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-white via-emerald-50/30 to-emerald-100/50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12">
          {/* 404 Number */}
          <div className="text-9xl font-bold bg-linear-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent mb-6 font-playfair">
            404
          </div>
          
          {/* Heading */}
          <h1 className="text-3xl font-bold text-slate-800 mb-3 font-playfair">
            Page Not Found
          </h1>
          <p className="text-slate-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-8 bg-emerald-100 rounded-full flex items-center justify-center">
            <Search className="w-10 h-10 text-emerald-600" />
          </div>

          {/* Action Button */}
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 
              rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 
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
