import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { FloatingFootball } from "@/components/FloatingFootball";
import { Tilt3DCard } from "@/components/Tilt3DCard";
import { ParticleField } from "@/components/ParticleField";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Calendar,
  Trophy,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

const FALLBACK_FIXTURES = [
  { date: "Apr 12, 2026", time: "15:00", opp: "Baraya FC", oppLogo: "BF", type: "Home", comp: "ADH Super League" },
  { date: "Apr 19, 2026", time: "14:00", opp: "Junior Professional FC", oppLogo: "JP", type: "Away", comp: "ADH Super League" },
  { date: "Apr 26, 2026", time: "16:00", opp: "All Nation FC", oppLogo: "AN", type: "Home", comp: "ADH Super League" },
  { date: "May 03, 2026", time: "15:30", opp: "Mande FC", oppLogo: "MF", type: "Away", comp: "ADH Super League" },
];

export function Home() {
  useDocumentTitle();

  const FALLBACK_FEATURED = [
    { name: "Barclay", pos: "Striker", num: "9" },
    { name: "Enoch Gartei", pos: "Winger", num: "11" },
    { name: "Elton Saylee", pos: "Winger", num: "7" },
    { name: "Koffie", pos: "Attacking Midfielder", num: "10" },
  ];

  const [featuredPlayers, setFeaturedPlayers] = useState(FALLBACK_FEATURED);
  const [upcomingFixtures, setUpcomingFixtures] = useState(FALLBACK_FIXTURES);

  useEffect(() => {
    fetch("/api/players?featured=true")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFeaturedPlayers(data.map((p: any) => ({ name: p.name, pos: p.position, num: p.number })));
        }
      })
      .catch(() => {});

    fetch("/api/fixtures")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setUpcomingFixtures(data.map((f: any) => ({
            date: f.date,
            time: f.time,
            opp: f.opponent,
            oppLogo: f.opp_logo,
            type: f.type,
            comp: f.comp,
          })));
        }
      })
      .catch(() => {});
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image / Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/gallery/Team.JPG"
            alt="ASFC squad on the pitch"
            className="w-full h-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-[#050505]/20" />
          <div className="absolute inset-0 bg-teal-900/20 mix-blend-multiply" />
        </div>

        {/* Particles */}
        <ParticleField count={25} className="z-[1]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center flex flex-col items-center mt-16 perspective-container">
          {/* 3D Floating Football */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -80 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute right-8 top-[10%] hidden lg:block"
          >
            <FloatingFootball size={100} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            className="absolute left-12 bottom-[20%] hidden lg:block"
          >
            <FloatingFootball size={60} className="float-3d-fast" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Logo className="w-48 md:w-64 mb-8 drop-shadow-2xl" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30, rotateX: 15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="font-display text-6xl md:text-8xl lg:text-9xl uppercase tracking-tight text-white mb-6 drop-shadow-2xl"
          >
            African{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300 text-glow">
              Strikers
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-xl md:text-2xl text-slate-300 font-medium max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            2025 Regular Season Champions. 3rd Place Playoffs. Now chasing
            our first-ever league title — Brooklyn Park, Minnesota.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <Link
              to="/join"
              className="w-full sm:w-auto px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white font-display text-xl uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-teal-600/20 hover:shadow-teal-500/40 hover:-translate-y-1 flex items-center justify-center gap-3 glow-pulse"
            >
              Join the Team
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/fixtures"
              className="w-full sm:w-auto px-8 py-4 glass hover:bg-white/10 text-white font-display text-xl uppercase tracking-wider rounded-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              View Fixtures
              <Calendar size={20} />
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
            Scroll
          </span>
          <div className="w-0.5 h-8 bg-gradient-to-b from-teal-500 to-transparent" />
        </div>
      </section>

      {/* Club Intro Section */}
      <section className="py-24 bg-[#050505] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-900/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <ParticleField count={10} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-1 bg-teal-500" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-teal-400">
                  Our Story
                </h2>
              </div>
              <h3 className="font-display text-5xl md:text-6xl uppercase tracking-tight text-white mb-8 leading-tight">
                More Than Just <br />A Football Club
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed mb-6">
                Founded in 2020 in Brooklyn Park, Minnesota, African Strikers
                emerged from a shared passion for the beautiful game and a deep
                commitment to the African diaspora community. We compete in the
                Around Da Hours Super League — and last season we topped the
                regular season table before finishing 3rd in the playoffs.
              </p>
              <p className="text-slate-400 text-lg leading-relaxed mb-10">
                We've never won the league or the playoffs — but that's what
                drives us. With 29 goals scored in the 2025 season and a squad
                that's only getting stronger, we're more determined than ever
                to bring home our first championship in 2026.
              </p>

              <div className="grid grid-cols-2 gap-8">
                {[
                  { value: "3rd", label: "2025 Playoffs" },
                  { value: "24", label: "Pts (8W-3L) '25" },
                  { value: "29", label: "Goals Scored '25" },
                  { value: "2020", label: "Established" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex flex-col gap-2"
                  >
                    <span className="font-display text-5xl text-white">
                      {stat.value}
                    </span>
                    <span className="text-sm font-bold uppercase tracking-wider text-teal-500">
                      {stat.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
              style={{ perspective: "1200px" }}
            >
              <Tilt3DCard tiltMaxX={10} tiltMaxY={10} glare maxGlare={0.15}>
                <div
                  className="aspect-[4/5] rounded-2xl overflow-hidden relative"
                  style={{
                    transformStyle: "preserve-3d",
                    boxShadow:
                      "0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(20,184,166,0.15), inset 0 0 0 1px rgba(255,255,255,0.08)",
                  }}
                >
                  <img
                    src="/our-story-team.jpg"
                    alt="ASFC players on the pitch"
                    loading="lazy"
                    className="w-full h-full object-cover"
                    style={{ transform: "translateZ(20px) scale(1.02)" }}
                  />
                  {/* 3D depth gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent" />
                  {/* Animated shine sweep for 3D effect */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 55%, transparent 60%)",
                      animation: "shimmer 4s ease-in-out infinite",
                    }}
                  />
                  {/* Teal glow border ring */}
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      border: "1px solid rgba(20,184,166,0.25)",
                      boxShadow:
                        "inset 0 0 30px rgba(20,184,166,0.06), 0 0 20px rgba(20,184,166,0.08)",
                    }}
                  />
                </div>
              </Tilt3DCard>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -bottom-8 -left-8 hidden md:block"
              >
                <Tilt3DCard tiltMaxX={15} tiltMaxY={15} scale={1.05}>
                  <div className="glass-card-3d p-6 rounded-2xl max-w-xs glow-pulse">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-full bg-teal-900/50 flex items-center justify-center text-teal-400">
                        <Trophy size={24} />
                      </div>
                      <h4 className="text-white font-bold uppercase tracking-wider">
                        2025 Playoffs
                      </h4>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Finished 3rd — eliminated by Baraya FC in PKs.
                      Chasing our first title in 2026.
                    </p>
                  </div>
                </Tilt3DCard>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upcoming Fixtures */}
      <section className="py-24 bg-[#050505] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-1 bg-teal-500" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-teal-400">
                  Matchday
                </h2>
              </div>
              <h3 className="font-display text-5xl md:text-6xl uppercase tracking-tight text-white">
                Upcoming Fixtures
              </h3>
            </div>
            <Link
              to="/fixtures"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white hover:text-teal-400 transition-colors group"
            >
              View Full Schedule
              <ChevronRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Next Match (Featured) */}
            {upcomingFixtures.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <Tilt3DCard tiltMaxX={4} tiltMaxY={4} glare maxGlare={0.08}>
                <div className="glass-card-3d rounded-2xl overflow-hidden group hover:border-teal-500/50 transition-colors relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-400" />
                  <div className="p-8 md:p-10">
                    <div className="flex items-center justify-between mb-8">
                      <span className="px-4 py-1.5 rounded-full bg-teal-900/30 text-teal-400 text-xs font-bold uppercase tracking-widest border border-teal-500/20">
                        Next Match — {upcomingFixtures[0].comp}
                      </span>
                      <span className="text-slate-400 text-sm font-medium flex items-center gap-2">
                        <Calendar size={16} />
                        {upcomingFixtures[0].date} • {upcomingFixtures[0].time}
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
                      <div className="flex flex-col items-center text-center gap-4 w-full md:w-1/3">
                        <Logo className="w-24 h-24 drop-shadow-xl" />
                        <h4 className="text-xl font-bold uppercase tracking-wider text-white">
                          African Strikers
                        </h4>
                      </div>

                      <div className="flex flex-col items-center justify-center w-full md:w-1/3">
                        <span className="text-4xl font-black text-slate-700 mb-2">
                          VS
                        </span>
                        <span className="text-sm font-bold uppercase tracking-widest text-teal-500">
                          {upcomingFixtures[0].type}
                        </span>
                      </div>

                      <div className="flex flex-col items-center text-center gap-4 w-full md:w-1/3">
                        <div className="w-24 h-24 rounded-full glass border-2 border-white/10 flex items-center justify-center text-2xl font-black text-white shadow-xl">
                          {upcomingFixtures[0].oppLogo}
                        </div>
                        <h4 className="text-xl font-bold uppercase tracking-wider text-white">
                          {upcomingFixtures[0].opp}
                        </h4>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-white/10">
                      <div className="flex items-center gap-3 text-slate-400">
                        <MapPin size={18} className="text-teal-500" />
                        <span className="text-sm font-medium">
                          Brooklyn Park, Minnesota
                        </span>
                      </div>
                      <Link
                        to="/fixtures"
                        className="px-6 py-2.5 bg-white text-slate-950 hover:bg-slate-200 text-sm font-bold uppercase tracking-wider rounded-lg transition-colors w-full sm:w-auto text-center"
                      >
                        View Standings
                      </Link>
                    </div>
                  </div>
                </div>
              </Tilt3DCard>
            </motion.div>
            )}

            {/* Other Matches */}
            <div className="flex flex-col gap-6">
              {upcomingFixtures.slice(1, 4).map((match, i) => (
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  key={i}
                >
                  <Tilt3DCard tiltMaxX={10} tiltMaxY={10}>
                    <div className="glass-card-3d rounded-2xl p-6 hover:border-white/20 transition-colors flex flex-col justify-center h-full">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-teal-500">
                          {match.date}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                          {match.type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                            {match.opp.substring(0, 2).toUpperCase()}
                          </div>
                          <h4 className="text-white font-bold uppercase tracking-wider">
                            {match.opp}
                          </h4>
                        </div>
                        <span className="text-slate-400 text-sm font-medium">
                          {match.time}
                        </span>
                      </div>
                    </div>
                  </Tilt3DCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Players */}
      <section className="py-24 bg-[#050505] relative overflow-hidden">
        <ParticleField count={8} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-1 bg-teal-500" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-teal-400">
                  First Team
                </h2>
              </div>
              <h3 className="font-display text-5xl md:text-6xl uppercase tracking-tight text-white">
                Meet The Squad
              </h3>
            </div>
            <Link
              to="/team"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white hover:text-teal-400 transition-colors group"
            >
              View Full Squad
              <ChevronRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPlayers.map((player, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                key={i}
              >
                <Tilt3DCard tiltMaxX={12} tiltMaxY={12} glare maxGlare={0.2}>
                  <div className="group relative rounded-2xl overflow-hidden glass-card-3d aspect-[3/4]">
                    {/* Gradient background with large jersey number */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-teal-950/60 to-slate-900" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-[120px] md:text-[140px] text-white/[0.06] font-black select-none">
                        {player.num}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-teal-600/90 backdrop-blur-sm flex items-center justify-center text-white font-black text-xl shadow-lg border border-white/20">
                      {player.num}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-teal-400 text-xs font-bold uppercase tracking-widest mb-2 block">
                        {player.pos}
                      </span>
                      <h4 className="font-display text-3xl uppercase tracking-wider text-white">
                        {player.name}
                      </h4>
                      <div className="h-1 w-12 bg-teal-500 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100" />
                    </div>
                  </div>
                </Tilt3DCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/gallery/Teams.JPG"
            alt="ASFC team"
            loading="lazy"
            className="w-full h-full object-cover object-center opacity-20 grayscale"
          />
          <div className="absolute inset-0 bg-teal-950/90 mix-blend-multiply" />
        </div>

        <ParticleField count={15} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center perspective-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
            whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 mb-8 glow-pulse">
              <Trophy size={32} className="text-teal-400" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl uppercase tracking-tight text-white mb-6"
          >
            Be Part of The Legacy
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-teal-100/80 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Whether you're an aspiring player looking to join the squad, a fan
            wanting to support us in the Around Da Hours Super League, or a
            sponsor looking for partnership opportunities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/join"
              className="w-full sm:w-auto px-8 py-4 bg-white text-teal-950 hover:bg-slate-200 font-display text-xl uppercase tracking-wider rounded-lg transition-colors shadow-xl"
            >
              Join The Academy
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-4 glass hover:bg-white/10 text-white font-display text-xl uppercase tracking-wider rounded-lg transition-colors"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
