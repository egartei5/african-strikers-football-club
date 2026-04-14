import { Calendar, MapPin, Clock, Trophy, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Logo } from "@/components/Logo";
import { PageHeader } from "@/components/PageHeader";
import { Tilt3DCard } from "@/components/Tilt3DCard";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

const STANDINGS = [
  { pos: 1, team: "Baraya FC", gp: 12, w: 8, l: 2, d: 2, gf: 51, ga: 21, gd: 30, pts: 26, isUs: false },
  { pos: 2, team: "Junior Professional FC", gp: 12, w: 8, l: 3, d: 1, gf: 44, ga: 29, gd: 15, pts: 25, isUs: false },
  { pos: 3, team: "All Nation FC", gp: 12, w: 7, l: 2, d: 3, gf: 35, ga: 18, gd: 17, pts: 24, isUs: false },
  { pos: 4, team: "African Strikers FC", gp: 12, w: 8, l: 4, d: 0, gf: 32, ga: 27, gd: 5, pts: 24, isUs: true },
  { pos: 5, team: "Caucus FC", gp: 12, w: 6, l: 5, d: 1, gf: 21, ga: 33, gd: -12, pts: 19, isUs: false },
  { pos: 6, team: "East Coast Stars FC", gp: 12, w: 5, l: 4, d: 3, gf: 34, ga: 20, gd: 14, pts: 18, isUs: false },
  { pos: 7, team: "Mande FC", gp: 12, w: 6, l: 6, d: 0, gf: 27, ga: 23, gd: 4, pts: 18, isUs: false },
  { pos: 8, team: "Ajax Africa FC", gp: 12, w: 5, l: 4, d: 3, gf: 23, ga: 22, gd: 1, pts: 18, isUs: false },
  { pos: 9, team: "Brooklyn FC", gp: 12, w: 4, l: 4, d: 4, gf: 27, ga: 24, gd: 3, pts: 16, isUs: false },
  { pos: 10, team: "Buduburam FC", gp: 12, w: 4, l: 7, d: 1, gf: 28, ga: 34, gd: -6, pts: 13, isUs: false },
  { pos: 11, team: "Kamair FC", gp: 12, w: 3, l: 8, d: 1, gf: 29, ga: 36, gd: -7, pts: 10, isUs: false },
  { pos: 12, team: "Fabulous FC", gp: 12, w: 2, l: 9, d: 1, gf: 21, ga: 47, gd: -26, pts: 7, isUs: false },
  { pos: 13, team: "Friends And Family", gp: 12, w: 1, l: 9, d: 2, gf: 15, ga: 53, gd: -38, pts: 5, isUs: false },
];

const FIXTURES = [
  {
    date: "Apr 12, 2026",
    time: "15:00",
    opp: "Baraya FC",
    oppLogo: "BF",
    type: "Home",
    venue: "Brooklyn Park, Minnesota",
    comp: "ADH Super League",
    result: null,
  },
  {
    date: "Apr 19, 2026",
    time: "14:00",
    opp: "Junior Professional FC",
    oppLogo: "JP",
    type: "Away",
    venue: "Brooklyn Park, Minnesota",
    comp: "ADH Super League",
    result: null,
  },
  {
    date: "Apr 26, 2026",
    time: "16:00",
    opp: "All Nation FC",
    oppLogo: "AN",
    type: "Home",
    venue: "Brooklyn Park, Minnesota",
    comp: "ADH Super League",
    result: null,
  },
  {
    date: "May 03, 2026",
    time: "15:30",
    opp: "Mande FC",
    oppLogo: "MF",
    type: "Away",
    venue: "Brooklyn Park, Minnesota",
    comp: "ADH Super League",
    result: null,
  },
];

const RESULTS = [
  {
    date: "Sep 14, 2025",
    opp: "All Nation FC",
    oppLogo: "AN",
    type: "Home",
    score: "3 - 4",
    result: "L",
    comp: "ADH Super League",
  },
  {
    date: "Sep 07, 2025",
    opp: "Friends And Family",
    oppLogo: "FF",
    type: "Away",
    score: "6 - 0",
    result: "W",
    comp: "ADH Super League",
  },
  {
    date: "Aug 17, 2025",
    opp: "Brooklyn FC",
    oppLogo: "BK",
    type: "Away",
    score: "1 - 0",
    result: "W",
    comp: "ADH Super League",
  },
  {
    date: "Aug 10, 2025",
    opp: "Baraya FC",
    oppLogo: "BF",
    type: "Away",
    score: "1 - 7",
    result: "L",
    comp: "ADH Super League",
  },
  {
    date: "Aug 03, 2025",
    opp: "Ajax Africa FC",
    oppLogo: "AA",
    type: "Away",
    score: "3 - 2",
    result: "W",
    comp: "ADH Super League",
  },
];

export function Fixtures() {
  useDocumentTitle("Fixtures & Results");
  const [standings, setStandings] = useState(STANDINGS);
  const [fixtures, setFixtures] = useState(FIXTURES);
  const [results, setResults] = useState(RESULTS);

  useEffect(() => {
    fetch("/api/fixtures/standings")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setStandings(data.map((s: any) => ({ pos: s.pos, team: s.team, gp: s.gp, w: s.w, l: s.l, d: s.d, gf: s.gf, ga: s.ga, gd: s.gd, pts: s.pts, isUs: !!s.is_us }))); })
      .catch(() => {});

    fetch("/api/fixtures")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setFixtures(data.map((f: any) => ({ date: f.date, time: f.time, opp: f.opponent, oppLogo: f.opp_logo, type: f.type, venue: f.venue, comp: f.comp, result: f.result }))); })
      .catch(() => {});

    fetch("/api/fixtures/results")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setResults(data.map((r: any) => ({ date: r.date, opp: r.opponent, oppLogo: r.opp_logo, type: r.type, score: r.score, result: r.result, comp: r.comp }))); })
      .catch(() => {});
  }, []);
  return (
    <div className="flex flex-col min-h-screen pt-24 bg-[#050505]">
      <PageHeader
        badge="Match Center"
        title="Fixtures & Results"
        subtitle="Follow African Strikers in the Around Da Hours Super League. Brooklyn Park, Minnesota."
      />

      {/* League Standings */}
      <section className="py-24 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4"
          >
            <div className="w-12 h-1 bg-teal-500" />
            <h2 className="font-display text-4xl uppercase tracking-tight text-white flex items-center gap-3">
              <Trophy size={28} className="text-yellow-500" />
              2025 Season Standings
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-lg mb-12 ml-16"
          >
            Around Da Hours Super League — 2025 Final Regular Season Standings
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: 4 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <Tilt3DCard tiltMaxX={2} tiltMaxY={2}>
              <div
                className="glass-card-3d rounded-2xl overflow-hidden"
                style={{
                  boxShadow:
                    "0 25px 60px rgba(0,0,0,0.4), 0 0 40px rgba(20,184,166,0.08)",
                }}
              >
                {/* Table Header */}
                <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 px-4 py-4 grid grid-cols-[2.5rem_1fr_repeat(8,_minmax(0,_1fr))] gap-1 text-xs font-bold uppercase tracking-widest text-teal-400">
                  <span className="text-center">#</span>
                  <span>Team</span>
                  <span className="text-center hidden sm:block">GP</span>
                  <span className="text-center">W</span>
                  <span className="text-center">L</span>
                  <span className="text-center">D</span>
                  <span className="text-center hidden md:block">GF</span>
                  <span className="text-center hidden md:block">GA</span>
                  <span className="text-center hidden sm:block">GD</span>
                  <span className="text-center font-extrabold">PTS</span>
                </div>

                {/* Table Body */}
                {standings.map((row, i) => (
                  <motion.div
                    key={row.pos}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    className={`grid grid-cols-[2.5rem_1fr_repeat(8,_minmax(0,_1fr))] gap-1 px-4 py-3.5 items-center transition-colors ${row.isUs
                      ? "bg-teal-500/10 border-l-4 border-l-teal-500"
                      : i % 2 === 0
                        ? "bg-white/[0.02]"
                        : ""
                      } ${row.pos === 8 ? "border-b-2 border-b-teal-500/30" : "border-b border-white/5"} hover:bg-white/5`}
                  >
                    <span
                      className={`text-center font-display text-lg ${row.isUs ? "text-teal-400" : row.pos <= 8 ? "text-white" : "text-slate-500"
                        }`}
                    >
                      {row.pos}
                    </span>
                    <span
                      className={`font-semibold text-sm sm:text-base truncate ${row.isUs ? "text-teal-300 font-bold" : "text-white"
                        }`}
                    >
                      {row.isUs && (
                        <span className="inline-block w-2 h-2 bg-teal-400 rounded-full mr-2 animate-pulse" />
                      )}
                      {row.team}
                    </span>
                    <span className="text-center text-slate-400 hidden sm:block">{row.gp}</span>
                    <span className="text-center text-emerald-400 font-medium">{row.w}</span>
                    <span className="text-center text-red-400 font-medium">{row.l}</span>
                    <span className="text-center text-slate-400">{row.d}</span>
                    <span className="text-center text-slate-400 hidden md:block">{row.gf}</span>
                    <span className="text-center text-slate-400 hidden md:block">{row.ga}</span>
                    <span
                      className={`text-center font-medium hidden sm:block ${row.gd > 0 ? "text-emerald-400" : row.gd < 0 ? "text-red-400" : "text-slate-400"
                        }`}
                    >
                      {row.gd > 0 ? `+${row.gd}` : row.gd}
                    </span>
                    <span
                      className={`text-center font-display text-xl ${row.isUs ? "text-teal-300" : "text-white"
                        }`}
                    >
                      {row.pts}
                    </span>
                  </motion.div>
                ))}

                {/* Playoff result note */}
                <div className="px-4 py-4 bg-white/[0.02] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex items-center gap-3">
                    <TrendingUp size={16} className="text-teal-500" />
                    <span className="text-sm text-slate-400">
                      Top <span className="text-teal-400 font-bold">8</span> teams qualified for playoffs
                    </span>
                  </div>
                  <span className="sm:ml-auto text-xs text-slate-500 uppercase tracking-widest">
                    ASFC finished <span className="text-teal-400 font-bold">3rd</span> · Eliminated by Baraya FC (PKs)
                  </span>
                </div>
              </div>
            </Tilt3DCard>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Fixtures */}
      <section className="py-24 relative border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-12"
          >
            <div className="w-12 h-1 bg-teal-500" />
            <h2 className="font-display text-4xl uppercase tracking-tight text-white">
              Upcoming Matches
            </h2>
          </motion.div>

          <div className="space-y-6">
            {fixtures.map((match, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, rotateX: 5 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Tilt3DCard tiltMaxX={4} tiltMaxY={4}>
                  <div className="glass-card-3d rounded-2xl overflow-hidden hover:border-teal-500/50 transition-colors group">
                    <div className="flex flex-col md:flex-row">
                      {/* Date/Time Block */}
                      <div className="bg-white/5 backdrop-blur-sm p-6 md:w-48 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10 shrink-0">
                        <span className="text-teal-400 text-xs font-bold uppercase tracking-widest mb-2 text-center block">
                          {match.comp}
                        </span>
                        <span className="text-white font-bold text-center block mb-1">
                          {match.date}
                        </span>
                        <span className="text-slate-400 text-sm font-medium flex items-center gap-2">
                          <Clock size={14} /> {match.time}
                        </span>
                      </div>

                      {/* Match Info */}
                      <div className="p-6 flex-1 flex flex-col justify-center">
                        <div className="flex items-center justify-between mb-4">
                          <span
                            className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${match.type === "Home" ? "bg-teal-900/30 text-teal-400 border border-teal-500/20" : "glass text-slate-300 border border-white/10"}`}
                          >
                            {match.type}
                          </span>
                        </div>

                        <div className="flex items-center gap-6 mb-6">
                          <div className="flex items-center gap-4 flex-1">
                            <Logo className="w-12 h-12 drop-shadow-lg shrink-0" />
                            <h4 className="font-display text-2xl uppercase tracking-wider text-white hidden sm:block">
                              African Strikers
                            </h4>
                            <h4 className="font-display text-2xl uppercase tracking-wider text-white sm:hidden">
                              ASFC
                            </h4>
                          </div>

                          <span className="font-display text-3xl text-slate-600 shrink-0">
                            VS
                          </span>

                          <div className="flex items-center gap-4 flex-1 justify-end">
                            <h4 className="font-display text-2xl uppercase tracking-wider text-white hidden sm:block text-right">
                              {match.opp}
                            </h4>
                            <h4 className="font-display text-2xl uppercase tracking-wider text-white sm:hidden text-right">
                              {match.oppLogo}
                            </h4>
                            <div className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0">
                              {match.oppLogo}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-slate-400 border-t border-white/10 pt-4">
                          <MapPin size={16} className="text-teal-500 shrink-0" />
                          <span className="text-sm font-medium">{match.venue}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tilt3DCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Results */}
      <section className="py-24 relative border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-12"
          >
            <div className="w-12 h-1 bg-teal-500" />
            <h2 className="font-display text-4xl uppercase tracking-tight text-white">
              Recent Results
            </h2>
          </motion.div>

          <div className="space-y-4">
            {results.map((match, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Tilt3DCard tiltMaxX={3} tiltMaxY={3}>
                  <div className="glass-card-3d rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-white/20 transition-colors">
                    <div className="flex flex-col items-center md:items-start w-full md:w-auto shrink-0">
                      <span className="text-slate-400 text-sm font-medium mb-1">
                        {match.date}
                      </span>
                      <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
                        {match.comp}
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-4 md:gap-8 w-full md:flex-1">
                      <div className="flex items-center gap-3 flex-1 justify-end">
                        <span className="text-white font-display text-xl uppercase tracking-wider hidden sm:block">
                          African Strikers
                        </span>
                        <span className="text-white font-display text-xl uppercase tracking-wider sm:hidden">
                          ASFC
                        </span>
                      </div>

                      <div className="flex flex-col items-center shrink-0">
                        <div className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-2xl font-display text-white tracking-widest min-w-[80px] text-center">
                          {match.score}
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${match.result === "W" ? "text-emerald-400" : match.result === "L" ? "text-red-400" : "text-slate-400"}`}
                        >
                          {match.result === "W"
                            ? "Win"
                            : match.result === "L"
                              ? "Loss"
                              : "Draw"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 flex-1 justify-start">
                        <span className="text-slate-400 font-display text-xl uppercase tracking-wider hidden sm:block">
                          {match.opp}
                        </span>
                        <span className="text-slate-400 font-display text-xl uppercase tracking-wider sm:hidden">
                          {match.oppLogo}
                        </span>
                      </div>
                    </div>

                    <div className="w-full md:w-24 flex justify-center md:justify-end shrink-0">
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-500 border border-white/10 px-3 py-1 rounded-full">
                        {match.type}
                      </span>
                    </div>
                  </div>
                </Tilt3DCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
