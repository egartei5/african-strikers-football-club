import { Calendar, User } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Tilt3DCard } from "@/components/Tilt3DCard";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

const NEWS_ITEMS = [
  {
    id: 1,
    title: "ASFC Finish 3rd in 2025 ADH Super League Playoffs",
    excerpt:
      "Despite topping the regular season with 24 points, African Strikers were eliminated by Baraya FC in a heartbreaking penalty shootout in the playoff semifinals. The Strikers finished the 2025 season in 3rd place.",
    date: "Dec 15, 2025",
    author: "Media Team",
    category: "Playoffs",
    img: "/gallery/Team.JPG",
  },
  {
    id: 2,
    title: "2025 Recap: ASFC Top Regular Season Table",
    excerpt:
      "African Strikers capped off a dominant 2025 regular season with 8 wins, 3 losses, and 29 goals scored — finishing 1st with 24 points, one point clear of Baraya FC.",
    date: "Nov 20, 2025",
    author: "Media Team",
    category: "Season Recap",
    img: "/gallery/d4a05eed-9973-460a-abd1-407ff2234054.JPG",
  },
  {
    id: 3,
    title: "Match Report: ASFC 3 – 1 Ajax Africa FC",
    excerpt:
      "One of the highlights of the 2025 season — a dominant home display with three goals saw the Strikers cruise past Ajax Africa FC in front of a packed Brooklyn Park crowd.",
    date: "Oct 15, 2025",
    author: "Media Team",
    category: "Match Report",
    img: "/gallery/Enoch Gartei.JPG",
  },
  {
    id: 4,
    title: "2026 Season Preview: Can ASFC Win Their First Title?",
    excerpt:
      "After a heartbreaking playoff exit in 2025, the Strikers are more motivated than ever. With the core squad returning and a burning desire to win their first-ever league title, 2026 could be ASFC's year.",
    date: "Mar 01, 2026",
    author: "Media Team",
    category: "Preview",
    img: "/gallery/teamp.JPG",
  },
  {
    id: 5,
    title: "Brooklyn Park Community Day Celebrates 2025 Season",
    excerpt:
      "African Strikers FC hosted a community gathering in Brooklyn Park to celebrate the 2025 season and thank the local African diaspora community for their incredible support throughout the year.",
    date: "Jan 15, 2026",
    author: "Community Dept",
    category: "Community",
    img: "/gallery/Lawrence.JPG",
  },
  {
    id: 6,
    title: "The Road to 3rd: ASFC's 2025 Playoff Journey",
    excerpt:
      "From topping the regular season with 24 points to a crushing penalty shootout loss against Baraya FC — relive every moment of ASFC's unforgettable 2025 playoff run that ended in 3rd place.",
    date: "Dec 20, 2025",
    author: "Media Team",
    category: "Features",
    img: "/gallery/f92e0131-80b7-4a65-97a9-0e5431582300.JPG",
  },
];

export function News() {
  useDocumentTitle("News");
  const [newsItems, setNewsItems] = useState(NEWS_ITEMS);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setNewsItems(data.map((n: any) => ({
            id: n.id,
            title: n.title,
            excerpt: n.excerpt,
            date: n.date,
            author: n.author,
            category: n.category,
            img: n.img,
          })));
        }
      })
      .catch(() => {});
  }, []);
  return (
    <div className="flex flex-col min-h-screen pt-24 bg-[#050505]">
      <PageHeader
        badge="Latest Updates"
        title="Club News"
        subtitle="Stay up to date with the latest news, match reports, and announcements from the Around Da Hours Super League."
      />

      {/* News Grid */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30, rotateX: 5 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Tilt3DCard tiltMaxX={8} tiltMaxY={8} glare maxGlare={0.1}>
                  <article className="glass-card-3d rounded-2xl overflow-hidden group hover:border-teal-500/50 transition-colors flex flex-col h-full">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img
                        src={item.img}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-teal-600/90 backdrop-blur-sm border border-white/20 text-xs font-bold uppercase tracking-widest text-white">
                        {item.category}
                      </div>
                    </div>

                    <div className="p-6 md:p-8 flex flex-col flex-1">
                      <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-teal-500" />{" "}
                          {item.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <User size={14} className="text-teal-500" /> {item.author}
                        </span>
                      </div>

                      <h3 className="font-display text-3xl uppercase tracking-tight text-white mb-4 leading-tight group-hover:text-teal-400 transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">
                        {item.excerpt}
                      </p>

                      <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-teal-500/60 mt-auto">
                        Full Story Coming Soon
                      </span>
                    </div>
                  </article>
                </Tilt3DCard>
              </motion.div>
            ))}
          </div>


        </div>
      </section>
    </div>
  );
}
