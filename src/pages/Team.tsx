import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Tilt3DCard } from "@/components/Tilt3DCard";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import { Shield, Users } from "lucide-react";

// Map player names to their gallery photos
const PLAYER_IMAGES: Record<string, string> = {
  "Prince": "/gallery/Prince.JPG",
  "Ray Ra": "/gallery/Rays.JPG",
  "Jojo": "/gallery/Jojo.JPG",
  "Patrick": "/gallery/Patrick.JPG",
  "Lawrence": "/gallery/Lawrence.JPG",
  "Yussufu": "/gallery/Yussef and Natla.JPG",
  "Koffie": "/gallery/Koffie.JPG",
  "Edward": "/gallery/Edward.JPG",
  "Enoch Gartei": "/gallery/Enoch Gartei.JPG",
  "Elton Saylee": "/gallery/Elton Saylee.JPG",
  "Jack": "/gallery/Jack.JPG",
  "Kafeme": "/gallery/Kafeme.JPG",
  "Barclay": "/gallery/Barclay.JPG",
  "Abdoulaye": "/gallery/Abdoulaye.JPG",
  "Mamadou": "/gallery/Mamadou.JPG",
  "Elijah": "/gallery/Elijah.JPG",
};

const PLAYERS = [
  // Goalkeepers
  { name: "Leo", pos: "Goalkeeper", num: "1", role: "Captain Candidate" },
  { name: "Prince", pos: "Goalkeeper", num: "30" },
  // Defenders
  { name: "Ray Ra", pos: "Right Back / Left Back", num: "2" },
  { name: "Justin", pos: "Center Back", num: "4", role: "Captain Candidate" },
  { name: "Kittee", pos: "Center Back", num: "5" },
  { name: "Jojo", pos: "Center Back", num: "6" },
  { name: "Patrick", pos: "Center Back", num: "3" },
  { name: "Victor", pos: "Left Back", num: "15" },
  // Midfielders
  { name: "Lawrence", pos: "Midfield", num: "8", role: "Captain Candidate" },
  { name: "Yussufu", pos: "Midfield", num: "6", role: "Captain Candidate" },
  { name: "Koffie", pos: "Attacking Midfielder", num: "10" },
  { name: "Abdoulaye", pos: "Midfield", num: "14" },
  { name: "Mamadou", pos: "Midfield", num: "16" },
  { name: "Edward", pos: "Midfield", num: "18" },
  { name: "Christian", pos: "Midfield", num: "20" },
  { name: "Challo", pos: "Midfield", num: "22" },
  // Wingers
  { name: "Enoch Gartei", pos: "Winger", num: "11" },
  { name: "Elton Saylee", pos: "Winger", num: "7" },
  { name: "Jack", pos: "Winger", num: "17" },
  { name: "Kafeme", pos: "Winger", num: "19" },
  // Strikers
  { name: "Barclay", pos: "Striker", num: "9" },
  { name: "Savey Jones", pos: "Striker", num: "21" },
  { name: "Elijah", pos: "Forward", num: "23" },
];

const STAFF = [
  { name: "Johnathan", role: "Team Owner", category: "Ownership" },
  { name: "Joseph", role: "Team Owner", category: "Ownership" },
  { name: "Constance", role: "Team President", category: "Executive" },
  { name: "Dave", role: "Team Finance Manager", category: "Executive" },
  { name: "Nitty", role: "Team Advisor", category: "Executive" },
  { name: "Solari", role: "Head Coach", category: "Coaching" },
  { name: "Exodus", role: "Assistant Coach", category: "Coaching" },
  { name: "Brooks", role: "Board Member", category: "Board" },
  { name: "Michael", role: "Board Member", category: "Board" },
];

const FORMATIONS = {
  "4-3-3": {
    label: "4-3-3 (Primary)",
    rows: [
      { label: "Attack", players: [{ name: "Enoch Gartei", tag: "LW" }, { name: "Barclay", tag: "ST" }, { name: "Elton Saylee", tag: "RW" }] },
      { label: "Midfield", players: [{ name: "Lawrence", tag: "CM" }, { name: "Yussufu", tag: "CM" }, { name: "Koffie", tag: "CAM" }] },
      { label: "Defense", players: [{ name: "Ray Ra", tag: "RB" }, { name: "Justin", tag: "CB" }, { name: "Kittee", tag: "CB" }, { name: "Victor", tag: "LB" }] },
      { label: "GK", players: [{ name: "Leo", tag: "GK" }] },
    ],
    bench: ["Prince", "Jojo", "Patrick", "Abdoulaye", "Mamadou", "Lorenzo", "Christian", "Challo", "Jack", "Kafeme", "Savey Jones"],
  },
  "4-4-2": {
    label: "4-4-2 (Alternative)",
    rows: [
      { label: "Strikers", players: [{ name: "Barclay", tag: "ST" }, { name: "Savey Jones", tag: "ST" }] },
      { label: "Midfield", players: [{ name: "Enoch Gartei", tag: "LM" }, { name: "Lawrence", tag: "CM" }, { name: "Yussufu", tag: "CM" }, { name: "Elton Saylee", tag: "RM" }] },
      { label: "Defense", players: [{ name: "Ray Ra", tag: "RB" }, { name: "Justin", tag: "CB" }, { name: "Kittee", tag: "CB" }, { name: "Victor", tag: "LB" }] },
      { label: "GK", players: [{ name: "Leo", tag: "GK" }] },
    ],
    bench: ["Prince", "Jojo", "Patrick", "Abdoulaye", "Mamadou", "Koffie", "Lorenzo", "Christian", "Challo", "Jack", "Kafeme"],
  },
};

const CAPTAINS = [
  { name: "Justin", pos: "Center Back", desc: "Commanding presence at the back. Leads by example with fearless defending and vocal organization." },
  { name: "Lawrence", pos: "Midfield", desc: "Engine of the team. Controls tempo, sets the standard in training, and drives the squad forward." },
  { name: "Yussufu", pos: "Midfield", desc: "A tireless competitor. Covers every blade of grass and inspires those around him with relentless energy." },
  { name: "Leo", pos: "Goalkeeper", desc: "The last line of defense. Calm under pressure, commands the box, and keeps the team focused." },
];

export function Team() {
  useDocumentTitle("Team");
  const [activeFormation, setActiveFormation] = useState<"4-3-3" | "4-4-2">("4-3-3");
  const formation = FORMATIONS[activeFormation];
  const [players, setPlayers] = useState(PLAYERS);
  const [staff, setStaff] = useState(STAFF);

  useEffect(() => {
    fetch("/api/players")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPlayers(data.map((p: any) => ({ name: p.name, pos: p.position, num: p.number, role: p.role })));
        }
      })
      .catch(() => {/* use fallback data */});

    fetch("/api/staff")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setStaff(data.map((s: any) => ({ name: s.name, role: s.role, category: s.category })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col min-h-screen pt-24 bg-[#050505]">
      <PageHeader
        badge="First Team Squad"
        title="Meet The Players"
        subtitle="The athletes who wear the badge with pride. Discover the talent driving African Strikers forward this season."
      />

      {/* Players Grid */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {players.map((player, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9, rotateY: 8 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
              >
                <Tilt3DCard tiltMaxX={10} tiltMaxY={10} glare maxGlare={0.15}>
                  <div className="group relative rounded-2xl overflow-hidden glass-card-3d aspect-[3/4] hover:border-teal-500/50 transition-colors">
                    {/* Player photo or gradient background */}
                    {PLAYER_IMAGES[player.name] ? (
                      <>
                        <img src={PLAYER_IMAGES[player.name]} alt={player.name} className="absolute inset-0 w-full h-full object-cover object-top" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent" />
                      </>
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-teal-950/60 to-slate-900" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-display text-[120px] md:text-[140px] text-white/[0.06] font-black select-none">
                            {player.num}
                          </span>
                        </div>
                      </>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-teal-600/90 backdrop-blur-sm flex items-center justify-center text-white font-black text-xl shadow-lg border border-white/20">
                      {player.num}
                    </div>

                    {player.role && (
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full glass backdrop-blur-sm border border-white/10 text-xs font-bold uppercase tracking-widest text-teal-400 flex items-center gap-1">
                        <Shield size={12} />
                        {player.role}
                      </div>
                    )}

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

      {/* Formations Section */}
      <section className="py-24 relative border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-sm font-bold uppercase tracking-widest text-teal-400 mb-4">
              Tactical Setup
            </h2>
            <h3 className="font-display text-5xl md:text-6xl uppercase tracking-tight text-white mb-8">
              Formations
            </h3>

            {/* Formation Tabs */}
            <div className="inline-flex rounded-xl glass p-1 gap-1">
              {(Object.keys(FORMATIONS) as Array<keyof typeof FORMATIONS>).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveFormation(key)}
                  className={`px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
                    activeFormation === key
                      ? "bg-teal-600 text-white shadow-lg shadow-teal-600/30"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {FORMATIONS[key].label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Pitch Diagram */}
          <motion.div
            key={activeFormation}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative rounded-2xl overflow-hidden" style={{ background: "linear-gradient(180deg, #0d4a2e 0%, #0a3d26 30%, #0d4a2e 50%, #0a3d26 70%, #0d4a2e 100%)" }}>
              {/* Pitch lines */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-4 border-2 border-white/15 rounded-lg" />
                <div className="absolute left-4 right-4 top-1/2 -translate-y-px h-[2px] bg-white/15" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/15 rounded-full" />
                {/* Penalty areas */}
                <div className="absolute left-1/2 -translate-x-1/2 top-4 w-48 h-20 border-2 border-t-0 border-white/10 rounded-b-lg" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-4 w-48 h-20 border-2 border-b-0 border-white/10 rounded-t-lg" />
              </div>

              <div className="relative z-10 py-10 px-4 flex flex-col gap-8">
                {formation.rows.map((row, ri) => (
                  <div key={ri} className="flex flex-col items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">{row.label}</span>
                    <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
                      {row.players.map((p, pi) => (
                        <motion.div
                          key={pi}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: ri * 0.1 + pi * 0.05 }}
                          className="flex flex-col items-center gap-1.5"
                        >
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-teal-600/90 backdrop-blur-sm flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-lg shadow-black/40 border-2 border-teal-400/30 hover:scale-110 hover:border-teal-300/60 transition-all cursor-default">
                            {p.tag}
                          </div>
                          <span className="text-white text-xs sm:text-sm font-bold text-center max-w-[80px] leading-tight">
                            {p.name}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bench */}
            <div className="mt-6 glass-card-3d rounded-2xl p-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-4 flex items-center gap-2">
                <Users size={14} />
                Bench / Rotation
              </h4>
              <div className="flex flex-wrap gap-2">
                {formation.bench.map((name, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg glass text-sm font-medium text-slate-300 border border-white/5 hover:border-teal-500/30 hover:text-white transition-colors"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Captain Group */}
      <section className="py-24 relative border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-sm font-bold uppercase tracking-widest text-teal-400 mb-4">
              Leadership
            </h2>
            <h3 className="font-display text-5xl md:text-6xl uppercase tracking-tight text-white">
              Captain Group
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {CAPTAINS.map((captain, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Tilt3DCard tiltMaxX={8} tiltMaxY={8}>
                  <div className="glass-card-3d rounded-2xl p-6 hover:border-teal-500/30 transition-colors h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-teal-900/50 flex items-center justify-center text-teal-400 border border-teal-500/20">
                        <Shield size={24} />
                      </div>
                      <div>
                        <h4 className="font-display text-2xl uppercase tracking-wider text-white">
                          {captain.name}
                        </h4>
                        <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
                          {captain.pos}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {captain.desc}
                    </p>
                  </div>
                </Tilt3DCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Club Leadership */}
      <section className="py-24 relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-sm font-bold uppercase tracking-widest text-teal-400 mb-4">
              The People Behind The Club
            </h2>
            <h3 className="font-display text-5xl md:text-6xl uppercase tracking-tight text-white">
              Club Leadership
            </h3>
          </motion.div>

          {/* Group by category */}
          {["Ownership", "Executive", "Coaching", "Board"].map((category, catIndex) => {
            const members = staff.filter((s) => s.category === category);
            if (members.length === 0) return null;

            const categoryLabels: Record<string, { title: string; badge: string }> = {
              Ownership: { title: "Club Ownership", badge: "Owners" },
              Executive: { title: "Executive Team", badge: "Management" },
              Coaching: { title: "Technical Staff", badge: "Coaching" },
              Board: { title: "Board Members", badge: "Leadership" },
            };
            const { title, badge } = categoryLabels[category] || { title: category, badge: category };

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                className="mb-12 last:mb-0"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-1 bg-teal-500" />
                  <span className="text-xs font-bold uppercase tracking-widest text-teal-400">{badge}</span>
                </div>
                <h4 className="font-display text-3xl uppercase tracking-tight text-white mb-8">{title}</h4>
                <div className={`grid gap-6 ${members.length <= 2 ? "grid-cols-1 sm:grid-cols-2 max-w-3xl" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
                  {members.map((member, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                    >
                      <Tilt3DCard tiltMaxX={6} tiltMaxY={6}>
                        <div className="flex items-center gap-5 glass-card-3d rounded-2xl p-6 hover:border-teal-500/30 transition-colors">
                          <div className="w-16 h-16 rounded-full shrink-0 bg-gradient-to-br from-teal-900/60 to-slate-900 border-2 border-teal-500/20 flex items-center justify-center">
                            <Users size={28} className="text-teal-400/60" />
                          </div>
                          <div>
                            <h5 className="font-display text-2xl uppercase tracking-wider text-white">
                              {member.name}
                            </h5>
                            <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
                              {member.role}
                            </span>
                          </div>
                        </div>
                      </Tilt3DCard>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
