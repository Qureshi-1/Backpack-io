"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Users, Activity, MessageSquare, Loader2, ShieldCheck } from "lucide-react";

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetchApi("/api/admin/stats"),
      fetchApi("/api/admin/users")
    ]).then(([s, u]) => {
      setStats(s);
      setUsers(u);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleUpgrade = async (email: string, newPlan: string) => {
    setUpdating(email);
    try {
      await fetchApi("/api/admin/update-plan", {
        method: "POST",
        body: JSON.stringify({ email, plan: newPlan })
      });
      // Refresh user list
      const updatedUsers = await fetchApi("/api/admin/users");
      setUsers(updatedUsers);
    } catch (err) {
      alert("Failed to update plan");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div className="p-8 text-zinc-400 flex items-center gap-2"><Loader2 className="animate-spin h-4 w-4" /> Loading Admin Dashboard...</div>;

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Admin Control Center</h1>
        <p className="text-zinc-400">Manage users, view stats, and handle platform growth.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-sm text-zinc-400">Total Users</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats?.total_users || 0}</p>
        </div>
        <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-sm text-zinc-400">Total Proxy Requests</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats?.total_requests || 0}</p>
        </div>
        <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
              <MessageSquare className="h-5 w-5" />
            </div>
            <span className="text-sm text-zinc-400">Feedbacks</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats?.pending_feedbacks || 0}</p>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="font-semibold text-white">Recent Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-900/60 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-6 py-4 font-medium">User Email</th>
                <th className="px-6 py-4 font-medium">Join Date</th>
                <th className="px-6 py-4 font-medium">Plan</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{u.email} {u.is_admin && <span className="ml-2 text-[10px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded">ADMIN</span>}</td>
                  <td className="px-6 py-4 text-zinc-500">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${u.plan === 'pro' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                      {u.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {u.plan === 'free' ? (
                      <button 
                        onClick={() => handleUpgrade(u.email, 'pro')}
                        disabled={updating === u.email}
                        className="text-emerald-500 hover:text-emerald-400 text-xs font-bold transition-colors disabled:opacity-50"
                      >
                        {updating === u.email ? '...' : 'Upgrade to Pro'}
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleUpgrade(u.email, 'free')}
                        disabled={updating === u.email}
                        className="text-zinc-500 hover:text-zinc-400 text-xs font-bold transition-colors disabled:opacity-50"
                      >
                        {updating === u.email ? '...' : 'Downgrade to Free'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
