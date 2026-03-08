import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">My Tasks</h1>
      <div className="flex justify-center items-center min-h-100">
        <LoadingSpinner size="lg" />
      </div>
    </div>
  );
}
