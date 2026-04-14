import { Target, Shield } from "lucide-react";
import { motion } from "motion/react";
import { UnityIcon, ExcellenceIcon, DisciplineIcon, CommunityIcon } from "@/components/ValueIcons";
import { PageHeader } from "@/components/PageHeader";
import { Tilt3DCard } from "@/components/Tilt3DCard";
import { ParticleField } from "@/components/ParticleField";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function About() {
  useDocumentTitle("About");
  return (
    <div className="flex flex-col min-h-screen pt-24 bg-[#050505]">
      <PageHeader
        badge="Our Story"
        title="About The Club"
        subtitle="Founded on the principles of unity, discipline, and excellence. We are more than a football club; we are a community institution."
        backgroundImage="/gallery/Teams.JPG"
      />

      {/* Mission & Vision */}
      <section className="py-24 relative">
        <ParticleField count={8} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -40, rotateY: 10 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Tilt3DCard tiltMaxX={8} tiltMaxY={8} glare maxGlare={0.1}>
                <div className="glass-card-3d rounded-3xl p-10 md:p-14 relative overflow-hidden group hover:border-teal-500/30 transition-colors">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-teal-500/20 transition-colors" />
                  <Target size={48} className="text-teal-400 mb-8" />
                  <h2 className="font-display text-4xl uppercase tracking-tight text-white mb-6">
                    Our Mission
                  </h2>
                  <p className="text-slate-400 text-lg leading-relaxed">
                    To discover, nurture, and develop football talent through
                    world-class coaching and facilities, while instilling core
                    values of discipline, teamwork, and respect that extend beyond
                    the pitch.
                  </p>
                </div>
              </Tilt3DCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40, rotateY: -10 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <Tilt3DCard tiltMaxX={8} tiltMaxY={8} glare maxGlare={0.1}>
                <div className="glass-card-3d rounded-3xl p-10 md:p-14 relative overflow-hidden group hover:border-teal-500/30 transition-colors">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-colors" />
                  <Shield size={48} className="text-emerald-400 mb-8" />
                  <h2 className="font-display text-4xl uppercase tracking-tight text-white mb-6">
                    Our Vision
                  </h2>
                  <p className="text-slate-400 text-lg leading-relaxed">
                    To become the premier football academy and professional club in
                    the region, recognized globally for our commitment to youth
                    development, community engagement, and sporting excellence.
                  </p>
                </div>
              </Tilt3DCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 relative border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-sm font-bold uppercase tracking-widest text-teal-400 mb-4">
              The Strikers Way
            </h2>
            <h3 className="font-display text-5xl md:text-6xl uppercase tracking-tight text-white">
              Core Values
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <UnityIcon className="w-8 h-8" />,
                title: "Unity",
                desc: "We win together, we lose together. The team always comes before the individual.",
              },
              {
                icon: <ExcellenceIcon className="w-8 h-8" />,
                title: "Excellence",
                desc: "We demand the highest standards in training, matches, and personal conduct.",
              },
              {
                icon: <DisciplineIcon className="w-8 h-8" />,
                title: "Discipline",
                desc: "Commitment to the process, respect for the rules, and dedication to improvement.",
              },
              {
                icon: <CommunityIcon className="w-8 h-8" />,
                title: "Community",
                desc: "We represent our city and give back to the supporters who make our club possible.",
              },
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Tilt3DCard tiltMaxX={12} tiltMaxY={12}>
                  <div className="flex flex-col items-center text-center p-8 glass-card-3d rounded-2xl hover:border-teal-500/30 transition-colors h-full">
                    <div className="w-16 h-16 rounded-full bg-teal-900/30 flex items-center justify-center text-teal-400 mb-6">
                      {value.icon}
                    </div>
                    <h4 className="font-display text-2xl uppercase tracking-wider text-white mb-4">
                      {value.title}
                    </h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {value.desc}
                    </p>
                  </div>
                </Tilt3DCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-24 relative">
        <ParticleField count={10} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-sm font-bold uppercase tracking-widest text-teal-400 mb-4">
              Our Journey
            </h2>
            <h3 className="font-display text-5xl md:text-6xl uppercase tracking-tight text-white">
              Club History
            </h3>
          </motion.div>

          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
            {[
              {
                year: "2020",
                title: "The Foundation",
                desc: "African Strikers FC was founded in Brooklyn Park, Minnesota by a group of passionate players from the African diaspora community, united by a love of the beautiful game and a shared dream.",
              },
              {
                year: "2021",
                title: "Building the Squad",
                desc: "In our first full year, we focused on building chemistry, recruiting players from across the community, and laying the groundwork for a competitive squad.",
              },
              {
                year: "2022",
                title: "Finding Our Feet",
                desc: "Year two brought invaluable experience as we sharpened our identity and began establishing ASFC as a respected name in local football circles.",
              },
              {
                year: "2023",
                title: "ADH Super League",
                desc: "Joined the Around Da Hours Super League — the premier community football league in the Twin Cities area — and competed against the best local sides for the first time.",
              },
              {
                year: "2025",
                title: "Regular Season Champions",
                desc: "A breakout season — 8 wins, 3 losses, 29 goals scored, and 24 points put us 1st in the regular season table. We fell in the playoff semifinals to Baraya FC on penalties, finishing 3rd overall.",
              },
              {
                year: "2026",
                title: "Chasing the Title",
                desc: "With the core squad returning and a burning hunger from last season's heartbreak, 2026 is the year we chase our first-ever league title. The journey continues.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#050505] bg-teal-500 text-[#050505] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 glow-pulse">
                  <div className="w-2 h-2 bg-[#050505] rounded-full" />
                </div>
                <Tilt3DCard tiltMaxX={6} tiltMaxY={6} className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)]">
                  <div className="glass-card-3d p-6 rounded-2xl shadow-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-display text-xl uppercase tracking-wider text-white">
                        {item.title}
                      </h4>
                      <span className="text-teal-400 font-display text-xl">
                        {item.year}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {item.desc}
                    </p>
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
