import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import {
  Users, Calendar, Newspaper, Mail, UserPlus, Shield, LogOut,
  Plus, Trash2, Edit, Check, X, Eye, BarChart3, ChevronRight, Briefcase
} from "lucide-react";

type Tab = "dashboard" | "players" | "fixtures" | "news" | "contacts" | "applications" | "staff";

interface Stats {
  players: number;
  fixtures: number;
  news: number;
  unreadContacts: number;
  totalContacts: number;
  pendingApplications: number;
  totalApplications: number;
  staff: number;
}

export function Admin() {
  useDocumentTitle("Admin Dashboard");
  const [token, setToken] = useState<string | null>(localStorage.getItem("asfc_token"));
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [stats, setStats] = useState<Stats | null>(null);

  // Auth state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const authHeaders = useCallback(() => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }), [token]);

  const fetchStats = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/stats", { headers: authHeaders() });
      if (res.ok) setStats(await res.json());
      else if (res.status === 401) { setToken(null); localStorage.removeItem("asfc_token"); }
    } catch {}
  }, [token, authHeaders]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setToken(data.token);
      localStorage.setItem("asfc_token", data.token);
    } catch (err: any) {
      setLoginError(err.message || "Login failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    if (token) fetch("/api/auth/logout", { method: "POST", headers: authHeaders() });
    setToken(null);
    localStorage.removeItem("asfc_token");
  };

  // ──────────────── LOGIN SCREEN ────────────────
  if (!token) {
    return (
      <div className="flex flex-col min-h-screen pt-24 bg-[#050505] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md px-4"
        >
          <div className="glass-card-3d rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Shield size={32} className="text-teal-400" />
              <h1 className="font-display text-3xl uppercase tracking-tight text-white">Admin Panel</h1>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block">Username</label>
                <input
                  type="text" value={username} onChange={(e) => setUsername(e.target.value)} required
                  className="w-full glass rounded-lg px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  placeholder="admin"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block">Password</label>
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full glass rounded-lg px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  placeholder="••••••••"
                />
              </div>

              {loginError && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">{loginError}</div>
              )}

              <button
                type="submit" disabled={isLoggingIn}
                className="w-full px-8 py-4 bg-teal-600 hover:bg-teal-500 disabled:bg-teal-800 text-white font-display text-xl uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-teal-600/20"
              >
                {isLoggingIn ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // ──────────────── ADMIN DASHBOARD ────────────────
  const TABS: { key: Tab; label: string; icon: any }[] = [
    { key: "dashboard", label: "Overview", icon: BarChart3 },
    { key: "players", label: "Players", icon: Users },
    { key: "fixtures", label: "Fixtures", icon: Calendar },
    { key: "news", label: "News", icon: Newspaper },
    { key: "contacts", label: "Contacts", icon: Mail },
    { key: "applications", label: "Applications", icon: UserPlus },
    { key: "staff", label: "Staff", icon: Briefcase },
  ];

  return (
    <div className="flex flex-col min-h-screen pt-20 bg-[#050505]">
      {/* Top Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-teal-600/20 text-teal-400 border border-teal-500/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <tab.icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-red-400 transition-colors text-sm font-bold uppercase tracking-wider">
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20 pb-12">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && <DashboardTab key="dash" stats={stats} setActiveTab={setActiveTab} />}
          {activeTab === "players" && <PlayersTab key="players" authHeaders={authHeaders} onUpdate={fetchStats} />}
          {activeTab === "fixtures" && <FixturesTab key="fixtures" authHeaders={authHeaders} onUpdate={fetchStats} />}
          {activeTab === "news" && <NewsTab key="news" authHeaders={authHeaders} onUpdate={fetchStats} />}
          {activeTab === "contacts" && <ContactsTab key="contacts" authHeaders={authHeaders} onUpdate={fetchStats} />}
          {activeTab === "applications" && <ApplicationsTab key="apps" authHeaders={authHeaders} onUpdate={fetchStats} />}
          {activeTab === "staff" && <StaffTab key="staff" authHeaders={authHeaders} onUpdate={fetchStats} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   DASHBOARD TAB
   ──────────────────────────────────────────────────────────────── */
function DashboardTab({ stats, setActiveTab }: { stats: Stats | null; setActiveTab: (t: Tab) => void }) {
  const cards = [
    { label: "Active Players", value: stats?.players ?? "—", icon: Users, color: "teal", tab: "players" as Tab },
    { label: "Upcoming Matches", value: stats?.fixtures ?? "—", icon: Calendar, color: "emerald", tab: "fixtures" as Tab },
    { label: "News Articles", value: stats?.news ?? "—", icon: Newspaper, color: "blue", tab: "news" as Tab },
    { label: "Unread Messages", value: stats?.unreadContacts ?? "—", icon: Mail, color: "amber", tab: "contacts" as Tab },
    { label: "Pending Applications", value: stats?.pendingApplications ?? "—", icon: UserPlus, color: "purple", tab: "applications" as Tab },
    { label: "Staff Members", value: stats?.staff ?? "—", icon: Briefcase, color: "cyan", tab: "staff" as Tab },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <h2 className="font-display text-4xl uppercase tracking-tight text-white mb-8">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <button key={card.label} onClick={() => setActiveTab(card.tab)} className="glass-card-3d rounded-2xl p-6 hover:border-teal-500/30 transition-all text-left group">
            <div className="flex items-center justify-between mb-4">
              <card.icon size={24} className="text-teal-400" />
              <ChevronRight size={16} className="text-slate-600 group-hover:text-teal-400 transition-colors" />
            </div>
            <div className="font-display text-4xl text-white mb-2">{card.value}</div>
            <span className="text-sm font-bold uppercase tracking-widest text-slate-400">{card.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────
   PLAYERS TAB
   ──────────────────────────────────────────────────────────────── */
function PlayersTab({ authHeaders, onUpdate }: { authHeaders: () => Record<string, string>; onUpdate: () => void }) {
  const [players, setPlayers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", position: "Goalkeeper", number: "", role: "" });

  const load = useCallback(async () => {
    const res = await fetch("/api/players/all", { headers: authHeaders() });
    if (res.ok) setPlayers(await res.json());
  }, [authHeaders]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/players/${editing.id}` : "/api/players";
    await fetch(url, { method, headers: authHeaders(), body: JSON.stringify({ ...form, role: form.role || null }) });
    setShowForm(false);
    setEditing(null);
    setForm({ name: "", position: "Goalkeeper", number: "", role: "" });
    load();
    onUpdate();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this player?")) return;
    await fetch(`/api/players/${id}`, { method: "DELETE", headers: authHeaders() });
    load();
    onUpdate();
  };

  const startEdit = (p: any) => {
    setEditing(p);
    setForm({ name: p.name, position: p.position, number: p.number, role: p.role || "" });
    setShowForm(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-4xl uppercase tracking-tight text-white">Players</h2>
        <button onClick={() => { setEditing(null); setForm({ name: "", position: "Goalkeeper", number: "", role: "" }); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-bold uppercase tracking-wider transition-colors">
          <Plus size={16} /> Add Player
        </button>
      </div>

      {showForm && (
        <div className="glass-card-3d rounded-2xl p-6 mb-8">
          <h3 className="font-display text-2xl uppercase text-white mb-6">{editing ? "Edit Player" : "New Player"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name"
              className="glass rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
            <select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}
              className="glass rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500">
              {["Goalkeeper", "Right Back / Left Back", "Center Back", "Left Back", "Midfield", "Attacking Midfielder", "Winger", "Striker"].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <input value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} placeholder="# Number"
              className="glass rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Role (optional)"
              className="glass rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-bold uppercase tracking-wider"><Check size={16} /> Save</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="flex items-center gap-2 px-4 py-2 glass text-slate-300 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-white/10"><X size={16} /> Cancel</button>
          </div>
        </div>
      )}

      <div className="glass-card-3d rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_2fr_1fr_1fr_auto] gap-2 px-6 py-3 bg-white/5 text-xs font-bold uppercase tracking-widest text-teal-400 border-b border-white/10">
          <span>#</span><span>Name</span><span>Position</span><span>Role</span><span>Actions</span>
        </div>
        {players.map((p) => (
          <div key={p.id} className={`grid grid-cols-[1fr_2fr_1fr_1fr_auto] gap-2 px-6 py-4 items-center border-b border-white/5 hover:bg-white/5 transition-colors ${!p.is_active ? "opacity-50" : ""}`}>
            <span className="text-white font-display text-lg">{p.number}</span>
            <span className="text-white font-semibold">{p.name}</span>
            <span className="text-slate-400 text-sm">{p.position}</span>
            <span className="text-teal-400 text-xs font-bold uppercase">{p.role || "—"}</span>
            <div className="flex gap-2">
              <button onClick={() => startEdit(p)} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-teal-400 transition-colors"><Edit size={16} /></button>
              <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────
   FIXTURES TAB
   ──────────────────────────────────────────────────────────────── */
function FixturesTab({ authHeaders, onUpdate }: { authHeaders: () => Record<string, string>; onUpdate: () => void }) {
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ date: "", time: "", opponent: "", opp_logo: "", type: "Home", venue: "Brooklyn Park, Minnesota", comp: "ADH Super League", result: "", score: "", is_upcoming: 1 });

  const load = useCallback(async () => {
    const res = await fetch("/api/fixtures/all", { headers: authHeaders() });
    if (res.ok) setFixtures(await res.json());
  }, [authHeaders]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/fixtures/${editing.id}` : "/api/fixtures";
    await fetch(url, {
      method, headers: authHeaders(),
      body: JSON.stringify({ ...form, result: form.result || null, score: form.score || null }),
    });
    setShowForm(false);
    setEditing(null);
    setForm({ date: "", time: "", opponent: "", opp_logo: "", type: "Home", venue: "Brooklyn Park, Minnesota", comp: "ADH Super League", result: "", score: "", is_upcoming: 1 });
    load();
    onUpdate();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this fixture?")) return;
    await fetch(`/api/fixtures/${id}`, { method: "DELETE", headers: authHeaders() });
    load();
    onUpdate();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-4xl uppercase tracking-tight text-white">Fixtures</h2>
        <button onClick={() => { setEditing(null); setForm({ date: "", time: "", opponent: "", opp_logo: "", type: "Home", venue: "Brooklyn Park, Minnesota", comp: "ADH Super League", result: "", score: "", is_upcoming: 1 }); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-bold uppercase tracking-wider transition-colors">
          <Plus size={16} /> Add Fixture
        </button>
      </div>

      {showForm && (
        <div className="glass-card-3d rounded-2xl p-6 mb-8">
          <h3 className="font-display text-2xl uppercase text-white mb-6">{editing ? "Edit Fixture" : "New Fixture"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="Date (e.g. Apr 12, 2026)"
              className="glass rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
            <input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="Time (e.g. 15:00)"
              className="glass rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
            <input value={form.opponent} onChange={(e) => setForm({ ...form, opponent: e.target.value })} placeholder="Opponent"
              className="glass rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="glass rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500">
              <option value="Home">Home</option><option value="Away">Away</option>
            </select>
            <input value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} placeholder="Score (e.g. 3 - 1, leave empty if upcoming)"
              className="glass rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
            <select value={form.result || ""} onChange={(e) => setForm({ ...form, result: e.target.value })}
              className="glass rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500">
              <option value="">No result (upcoming)</option><option value="W">Win</option><option value="L">Loss</option><option value="D">Draw</option>
            </select>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <label className="flex items-center gap-2 text-sm text-slate-400">
              <input type="checkbox" checked={form.is_upcoming === 1} onChange={(e) => setForm({ ...form, is_upcoming: e.target.checked ? 1 : 0 })}
                className="w-4 h-4 rounded accent-teal-500" />
              Upcoming match
            </label>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-bold uppercase tracking-wider"><Check size={16} /> Save</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="flex items-center gap-2 px-4 py-2 glass text-slate-300 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-white/10"><X size={16} /> Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {fixtures.map((f) => (
          <div key={f.id} className="glass-card-3d rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-white/20 transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded ${f.is_upcoming ? "bg-teal-900/30 text-teal-400" : "bg-white/5 text-slate-500"}`}>
                  {f.is_upcoming ? "Upcoming" : f.result === "W" ? "Win" : f.result === "L" ? "Loss" : f.result === "D" ? "Draw" : "Played"}
                </span>
                <span className="text-xs text-slate-500 uppercase tracking-widest">{f.type}</span>
              </div>
              <div className="text-white font-semibold">ASFC vs {f.opponent}</div>
              <div className="text-sm text-slate-400">{f.date} • {f.time} {f.score ? `• ${f.score}` : ""}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditing(f); setForm({ date: f.date, time: f.time, opponent: f.opponent, opp_logo: f.opp_logo, type: f.type, venue: f.venue, comp: f.comp, result: f.result || "", score: f.score || "", is_upcoming: f.is_upcoming }); setShowForm(true); }}
                className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-teal-400 transition-colors"><Edit size={16} /></button>
              <button onClick={() => handleDelete(f.id)}
                className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────
   NEWS TAB
   ──────────────────────────────────────────────────────────────── */
function NewsTab({ authHeaders, onUpdate }: { authHeaders: () => Record<string, string>; onUpdate: () => void }) {
  const [articles, setArticles] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: "", excerpt: "", date: "", author: "Media Team", category: "General", img: "" });

  const load = useCallback(async () => {
    const res = await fetch("/api/news", { headers: authHeaders() });
    if (res.ok) setArticles(await res.json());
  }, [authHeaders]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/news/${editing.id}` : "/api/news";
    await fetch(url, { method, headers: authHeaders(), body: JSON.stringify({ ...form, img: form.img || null }) });
    setShowForm(false);
    setEditing(null);
    setForm({ title: "", excerpt: "", date: "", author: "Media Team", category: "General", img: "" });
    load();
    onUpdate();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this article?")) return;
    await fetch(`/api/news/${id}`, { method: "DELETE", headers: authHeaders() });
    load();
    onUpdate();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-4xl uppercase tracking-tight text-white">News</h2>
        <button onClick={() => { setEditing(null); setForm({ title: "", excerpt: "", date: "", author: "Media Team", category: "General", img: "" }); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-bold uppercase tracking-wider transition-colors">
          <Plus size={16} /> New Article
        </button>
      </div>

      {showForm && (
        <div className="glass-card-3d rounded-2xl p-6 mb-8">
          <h3 className="font-display text-2xl uppercase text-white mb-6">{editing ? "Edit Article" : "New Article"}</h3>
          <div className="space-y-4 mb-6">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title"
              className="w-full glass rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
            <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Excerpt / Summary" rows={3}
              className="w-full glass rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="Date (e.g. Mar 01, 2026)"
                className="glass rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
              <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Author"
                className="glass rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category"
                className="glass rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
              <input value={form.img} onChange={(e) => setForm({ ...form, img: e.target.value })} placeholder="Image path (optional)"
                className="glass rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-bold uppercase tracking-wider"><Check size={16} /> Save</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="flex items-center gap-2 px-4 py-2 glass text-slate-300 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-white/10"><X size={16} /> Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {articles.map((a) => (
          <div key={a.id} className="glass-card-3d rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-white/20 transition-colors">
            <div className="flex-1">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-1 block">{a.category}</span>
              <div className="text-white font-semibold mb-1">{a.title}</div>
              <div className="text-sm text-slate-400">{a.date} • By {a.author}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditing(a); setForm({ title: a.title, excerpt: a.excerpt, date: a.date, author: a.author, category: a.category, img: a.img || "" }); setShowForm(true); }}
                className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-teal-400 transition-colors"><Edit size={16} /></button>
              <button onClick={() => handleDelete(a.id)}
                className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────
   CONTACTS TAB
   ──────────────────────────────────────────────────────────────── */
function ContactsTab({ authHeaders, onUpdate }: { authHeaders: () => Record<string, string>; onUpdate: () => void }) {
  const [contacts, setContacts] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/contact", { headers: authHeaders() });
    if (res.ok) setContacts(await res.json());
  }, [authHeaders]);

  useEffect(() => { load(); }, [load]);

  const markRead = async (id: number) => {
    await fetch(`/api/contact/${id}/read`, { method: "PUT", headers: authHeaders() });
    load();
    onUpdate();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/contact/${id}`, { method: "DELETE", headers: authHeaders() });
    load();
    onUpdate();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <h2 className="font-display text-4xl uppercase tracking-tight text-white mb-8">Contact Messages</h2>

      {contacts.length === 0 ? (
        <div className="glass-card-3d rounded-2xl p-12 text-center text-slate-500">No messages yet</div>
      ) : (
        <div className="space-y-3">
          {contacts.map((c) => (
            <div key={c.id} className={`glass-card-3d rounded-xl overflow-hidden transition-colors ${!c.is_read ? "border-teal-500/30" : ""}`}>
              <button onClick={() => { setExpanded(expanded === c.id ? null : c.id); if (!c.is_read) markRead(c.id); }}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  {!c.is_read && <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse shrink-0" />}
                  <div>
                    <div className="text-white font-semibold">{c.name} <span className="text-slate-500 font-normal text-sm">— {c.subject}</span></div>
                    <div className="text-sm text-slate-400">{c.email} • {new Date(c.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Eye size={16} className="text-slate-600" />
                </div>
              </button>
              {expanded === c.id && (
                <div className="px-4 pb-4 border-t border-white/10 pt-4">
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">{c.message}</p>
                  <button onClick={() => handleDelete(c.id)} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────
   APPLICATIONS TAB
   ──────────────────────────────────────────────────────────────── */
function ApplicationsTab({ authHeaders, onUpdate }: { authHeaders: () => Record<string, string>; onUpdate: () => void }) {
  const [apps, setApps] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [emailFeedback, setEmailFeedback] = useState<{ id: number; type: string } | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/applications", { headers: authHeaders() });
    if (res.ok) setApps(await res.json());
  }, [authHeaders]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: number, status: string) => {
    // Confirmation for accept/reject since they trigger emails
    if (status === "accepted") {
      if (!confirm("Accept this player? A welcome email will be sent to them congratulating them on making the team.")) return;
    }
    if (status === "rejected") {
      if (!confirm("Reject this application? An email will be sent informing them of the decision.")) return;
    }

    const res = await fetch(`/api/applications/${id}/status`, {
      method: "PUT", headers: authHeaders(),
      body: JSON.stringify({ status }),
    });
    const data = await res.json();

    // Show email feedback toast
    if (data.emailSent) {
      setEmailFeedback({ id, type: status });
      setTimeout(() => setEmailFeedback(null), 4000);
    }

    load();
    onUpdate();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this application?")) return;
    await fetch(`/api/applications/${id}`, { method: "DELETE", headers: authHeaders() });
    load();
    onUpdate();
  };

  const statusColors: Record<string, string> = {
    pending: "bg-amber-900/30 text-amber-400 border-amber-500/30",
    reviewed: "bg-blue-900/30 text-blue-400 border-blue-500/30",
    accepted: "bg-emerald-900/30 text-emerald-400 border-emerald-500/30",
    rejected: "bg-red-900/30 text-red-400 border-red-500/30",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <h2 className="font-display text-4xl uppercase tracking-tight text-white mb-8">Applications</h2>

      {/* Email Sent Toast */}
      <AnimatePresence>
        {emailFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-24 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-xl flex items-center gap-3 ${
              emailFeedback.type === "accepted"
                ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-300"
                : "bg-slate-800/90 border-slate-500/40 text-slate-300"
            }`}
          >
            <Mail size={20} />
            <div>
              <div className="font-bold text-sm">
                {emailFeedback.type === "accepted" ? "Welcome email sent! 🎉" : "Rejection email sent"}
              </div>
              <div className="text-xs opacity-70">
                {emailFeedback.type === "accepted"
                  ? "Player has been notified they made the team"
                  : "Applicant has been notified of the decision"}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {apps.length === 0 ? (
        <div className="glass-card-3d rounded-2xl p-12 text-center text-slate-500">No applications yet</div>
      ) : (
        <div className="space-y-3">
          {apps.map((a) => (
            <div key={a.id} className="glass-card-3d rounded-xl overflow-hidden">
              <button onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors">
                <div>
                  <div className="text-white font-semibold">{a.full_name} <span className="text-slate-500 text-sm font-normal">• Age {a.age}</span></div>
                  <div className="text-sm text-slate-400">{a.position} • {a.experience} • {new Date(a.created_at).toLocaleDateString()}</div>
                </div>
                <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${statusColors[a.status] || statusColors.pending}`}>
                  {a.status}
                </span>
              </button>
              {expanded === a.id && (
                <div className="px-4 pb-4 border-t border-white/10 pt-4">
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div><span className="text-slate-500">Email:</span> <span className="text-slate-300">{a.email}</span></div>
                    <div><span className="text-slate-500">Phone:</span> <span className="text-slate-300">{a.phone}</span></div>
                  </div>
                  {a.message && <p className="text-slate-300 text-sm leading-relaxed mb-4 p-3 bg-white/5 rounded-lg">{a.message}</p>}

                  {/* Trial Decision Buttons */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <button onClick={() => updateStatus(a.id, "accepted")}
                      className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg border transition-all ${
                        a.status === "accepted"
                          ? "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/20"
                          : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-500"
                      }`}>
                      <Check size={14} /> Accept — Send Welcome Email
                    </button>
                    <button onClick={() => updateStatus(a.id, "rejected")}
                      className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg border transition-all ${
                        a.status === "rejected"
                          ? "bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/20"
                          : "border-red-500/30 text-red-400 hover:bg-red-600 hover:text-white hover:border-red-500"
                      }`}>
                      <X size={14} /> Reject — Send Rejection Email
                    </button>
                  </div>

                  {/* Other status buttons */}
                  <div className="flex flex-wrap gap-2">
                    {["pending", "reviewed"].map((s) => (
                      <button key={s} onClick={() => updateStatus(a.id, s)}
                        className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-colors ${a.status === s ? statusColors[s] : "border-white/10 text-slate-500 hover:text-white hover:border-white/20"}`}>
                        {s}
                      </button>
                    ))}
                    <button onClick={() => handleDelete(a.id)} className="ml-auto flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors">
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>

                  {/* Email status indicator */}
                  {(a.status === "accepted" || a.status === "rejected") && (
                    <div className={`mt-3 flex items-center gap-2 text-xs ${a.status === "accepted" ? "text-emerald-500" : "text-slate-500"}`}>
                      <Mail size={12} />
                      {a.status === "accepted" ? "Welcome email was sent to this player" : "Rejection email was sent to this applicant"}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}


/* ────────────────────────────────────────────────────────────────
   STAFF TAB
   ──────────────────────────────────────────────────────────────── */
function StaffTab({ authHeaders, onUpdate }: { authHeaders: () => Record<string, string>; onUpdate: () => void }) {
  const [staff, setStaff] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", role: "", category: "Leadership", sort_order: 0 });

  const load = useCallback(async () => {
    const res = await fetch("/api/staff/all", { headers: authHeaders() });
    if (res.ok) setStaff(await res.json());
  }, [authHeaders]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/staff/${editing.id}` : "/api/staff";
    await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(form) });
    setShowForm(false);
    setEditing(null);
    setForm({ name: "", role: "", category: "Leadership", sort_order: 0 });
    load();
    onUpdate();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this staff member?")) return;
    await fetch(`/api/staff/${id}`, { method: "DELETE", headers: authHeaders() });
    load();
    onUpdate();
  };

  const startEdit = (s: any) => {
    setEditing(s);
    setForm({ name: s.name, role: s.role, category: s.category, sort_order: s.sort_order });
    setShowForm(true);
  };

  const categories = ["Ownership", "Executive", "Coaching", "Board", "Leadership"];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-4xl uppercase tracking-tight text-white">Staff & Leadership</h2>
        <button onClick={() => { setEditing(null); setForm({ name: "", role: "", category: "Leadership", sort_order: 0 }); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-bold uppercase tracking-wider transition-colors">
          <Plus size={16} /> Add Member
        </button>
      </div>

      {showForm && (
        <div className="glass-card-3d rounded-2xl p-6 mb-8">
          <h3 className="font-display text-2xl uppercase text-white mb-6">{editing ? "Edit Member" : "New Member"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name"
              className="glass rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Role (e.g. Head Coach)"
              className="glass rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="glass rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500">
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} placeholder="Sort order"
              className="glass rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-bold uppercase tracking-wider"><Check size={16} /> Save</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="flex items-center gap-2 px-4 py-2 glass text-slate-300 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-white/10"><X size={16} /> Cancel</button>
          </div>
        </div>
      )}

      <div className="glass-card-3d rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2fr_2fr_1fr_auto] gap-2 px-6 py-3 bg-white/5 text-xs font-bold uppercase tracking-widest text-teal-400 border-b border-white/10">
          <span>Name</span><span>Role</span><span>Category</span><span>Actions</span>
        </div>
        {staff.map((s) => (
          <div key={s.id} className={`grid grid-cols-[2fr_2fr_1fr_auto] gap-2 px-6 py-4 items-center border-b border-white/5 hover:bg-white/5 transition-colors ${!s.is_active ? "opacity-50" : ""}`}>
            <span className="text-white font-semibold">{s.name}</span>
            <span className="text-slate-400 text-sm">{s.role}</span>
            <span className="text-teal-400 text-xs font-bold uppercase">{s.category}</span>
            <div className="flex gap-2">
              <button onClick={() => startEdit(s)} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-teal-400 transition-colors"><Edit size={16} /></button>
              <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
