"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getAllTasksAdmin } from "@/lib/api/tasks";
import { TaskResponse } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Search, Users } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface UserSummary {
  userId: number;
  name: string;
  todo: number;
  inProgress: number;
  done: number;
  total: number;
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function AdminUsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [tasks, setTasks]       = useState<TaskResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch]     = useState("");

  useEffect(() => {
    if (user?.role !== "ADMIN") { router.replace("/dashboard"); return; }
    const load = async () => {
      try {
        const data = await getAllTasksAdmin({ page: 0, size: 1000 });
        setTasks(data.content);
      } finally { setIsLoading(false); }
    };
    load();
  }, [user, router]);

  const users: UserSummary[] = useMemo(() => {
    const map = new Map<number, UserSummary>();
    tasks.forEach((t) => {
      if (!map.has(t.userId)) {
        map.set(t.userId, { userId: t.userId, name: t.userName, todo: 0, inProgress: 0, done: 0, total: 0 });
      }
      const u = map.get(t.userId)!;
      u.total++;
      if (t.status === "TODO")        u.todo++;
      if (t.status === "IN_PROGRESS") u.inProgress++;
      if (t.status === "DONE")        u.done++;
    });
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [tasks]);

  const filtered = search
    ? users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()))
    : users;

  if (user?.role !== "ADMIN") return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h1 className="text-2xl font-heading font-bold tracking-tight text-slate-900">User Management</h1>
            <p className="text-sm text-slate-500 mt-1">{users.length} registered users</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
            <Users className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">{users.length} users</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-3 border-2 border-slate-200 rounded-xl
              focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
              transition-all outline-none text-sm text-slate-900"
          />
        </div>
      </div>

      {/* User list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-16 text-center">
          <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium">No users found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    To Do
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    In Progress
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Done
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Completion
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((u) => (
                  <tr key={u.userId} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-400 to-emerald-600
                          flex items-center justify-center text-white font-bold text-xs shrink-0">
                          {getInitials(u.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{u.name}</p>
                          <p className="text-xs text-slate-500">{u.total} task{u.total !== 1 ? "s" : ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm">
                        {u.todo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 text-amber-700 font-semibold text-sm">
                        {u.inProgress}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 font-semibold text-sm">
                        {u.done}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-semibold text-slate-800">{u.total}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500"
                            style={{ width: `${u.total > 0 ? (u.done / u.total) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-emerald-600 w-12 text-right">
                          {u.total > 0 ? Math.round((u.done / u.total) * 100) : 0}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
