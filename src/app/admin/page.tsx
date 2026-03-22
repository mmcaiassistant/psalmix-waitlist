'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Stats {
  totalSignups: number;
  signupsToday: number;
  signupsThisWeek: number;
  signupsThisMonth: number;
}

interface TopReferrer {
  id: string;
  email: string;
  first_name: string | null;
  referral_count: number;
  position: number;
}

interface Signup {
  id: string;
  email: string;
  first_name: string | null;
  created_at: string;
  referred_by: string | null;
  referredByEmail: string | null;
  position: number;
  referral_code: string;
  referral_count: number;
}

interface ChartData {
  date: string;
  count: number;
}

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [topReferrers, setTopReferrers] = useState<TopReferrer[]>([]);
  const [recentSignups, setRecentSignups] = useState<Signup[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataError, setDataError] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);

  // Auto-restore admin session on page load (avoids forced re-login within 8h cookie window)
  useEffect(() => {
    fetch('/api/admin/me')
      .then((res) => {
        if (res.ok) {
          setAuthenticated(true);
          loadDashboardData();
        }
      })
      .catch(() => {/* ignore — stays on login screen */})
      .finally(() => setCheckingSession(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch {/* ignore network errors */}
    setAuthenticated(false);
    setStats(null);
    setTopReferrers([]);
    setRecentSignups([]);
    setChartData([]);
    setPassword('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setAuthenticated(true);
        loadDashboardData();
      } else {
        setError('Invalid password');
      }
    } catch {
      setError('Login failed — please try again');
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    setDataError('');
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users?limit=20'),
      ]);

      if (!statsRes.ok || !usersRes.ok) {
        setDataError('Failed to load dashboard data — please refresh');
        return;
      }

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();

      setStats(statsData.stats);
      setTopReferrers(statsData.topReferrers ?? []);
      setChartData(statsData.chartData ?? []);
      setRecentSignups(usersData.users ?? []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setDataError('Unexpected error loading data — check console');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await fetch('/api/admin/export');
      if (!res.ok) {
        alert('Export failed — please try again');
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `psalmix-waitlist-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed — please try again');
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md"
        >
          <h1 className="text-2xl font-bold text-white mb-6">PsalMix Admin</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Enter admin password"
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">PsalMix Waitlist Dashboard</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              Export CSV
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-lg font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center text-white mb-8">Loading...</div>
        )}

        {dataError && (
          <div className="bg-red-900/50 border border-red-500 text-red-300 rounded-lg p-4 mb-8">
            {dataError}
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatCard title="Total Signups" value={stats.totalSignups} />
            <StatCard title="Today" value={stats.signupsToday} />
            <StatCard title="This Week" value={stats.signupsThisWeek} />
            <StatCard title="This Month" value={stats.signupsThisMonth} />
          </div>
        )}

        {/* Chart and Top Referrers Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Signups Chart */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Signups Over Time</h2>
            <div className="h-64">
              <SimpleBarChart data={chartData} />
            </div>
          </div>

          {/* Top Referrers */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Top Referrers</h2>
            {topReferrers.length === 0 ? (
              <p className="text-gray-400">No referrals yet</p>
            ) : (
              <div className="space-y-3">
                {topReferrers.map((referrer, idx) => (
                  <div key={referrer.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-purple-400">#{idx + 1}</span>
                      <div>
                        {referrer.first_name && (
                          <p className="text-white font-medium">{referrer.first_name}</p>
                        )}
                        <p className="text-gray-400 text-sm">{referrer.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{referrer.referral_count}</p>
                      <p className="text-gray-400 text-sm">referrals</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Signups Table */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Signups</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-400 font-medium py-3 px-4">Position</th>
                  <th className="text-left text-gray-400 font-medium py-3 px-4">Email</th>
                  <th className="text-left text-gray-400 font-medium py-3 px-4">Name</th>
                  <th className="text-left text-gray-400 font-medium py-3 px-4">Date</th>
                  <th className="text-left text-gray-400 font-medium py-3 px-4">Referred By</th>
                </tr>
              </thead>
              <tbody>
                {recentSignups.map((signup) => (
                  <tr key={signup.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-3 px-4 text-white font-bold">#{signup.position}</td>
                    <td className="py-3 px-4 text-gray-300">{signup.email}</td>
                    <td className="py-3 px-4 text-gray-300">{signup.first_name ?? '—'}</td>
                    <td className="py-3 px-4 text-gray-400 text-sm">
                      {new Date(signup.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-sm">
                      {signup.referredByEmail ?? signup.referred_by ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentSignups.length === 0 && !loading && (
              <p className="text-gray-400 text-center py-8">No signups yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-6"
    >
      <p className="text-gray-400 text-sm font-medium mb-2">{title}</p>
      <p className="text-3xl font-bold text-white">{value.toLocaleString()}</p>
    </motion.div>
  );
}

function SimpleBarChart({ data }: { data: ChartData[] }) {
  if (!data || data.length === 0) {
    return <div className="text-gray-400 text-center">No data available</div>;
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1); // avoid divide-by-zero

  return (
    <div className="flex items-end justify-between h-full gap-2">
      {data.map((item) => (
        <div key={item.date} className="flex-1 flex flex-col items-center gap-2">
          <div
            className="w-full bg-purple-600 rounded-t"
            style={{
              height: `${(item.count / maxCount) * 100}%`,
              minHeight: item.count > 0 ? '4px' : '0',
            }}
          />
          <div className="text-xs text-gray-400 rotate-45 origin-top-left mt-4">
            {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
      ))}
    </div>
  );
}
