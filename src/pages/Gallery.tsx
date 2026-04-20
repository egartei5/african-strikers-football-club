import { useState } from "react";
import { X, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PageHeader } from "@/components/PageHeader";
import { Tilt3DCard } from "@/components/Tilt3DCard";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

const IMAGES = [
  // Team Photos
  {
    src: "/gallery/Teams.JPG",
    alt: "ASFC team lineup in green and white kits",
    category: "Team",
  },
  {
    src: "/gallery/Team.JPG",
    alt: "ASFC squad group photo before match",
    category: "Team",
  },
  {
    src: "/gallery/teamp.JPG",
    alt: "ASFC team formation on the pitch",
    category: "Team",
  },
  {
    src: "/gallery/teame.JPG",
    alt: "ASFC team huddle",
    category: "Team",
  },
  // Matchday Action
  {
    src: "/gallery/Koffie.JPG",
    alt: "Koffie in action — Attacking Midfielder",
    category: "Matchday",
  },
  {
    src: "/gallery/Enoch Gartei.JPG",
    alt: "Enoch Gartei — Winger on the attack",
    category: "Matchday",
  },
  {
    src: "/gallery/Elton Saylee.JPG",
    alt: "Elton Saylee — Winger driving forward",
    category: "Matchday",
  },
  {
    src: "/gallery/Barclay.JPG",
    alt: "Barclay — Striker leading the line",
    category: "Matchday",
  },
  {
    src: "/gallery/Jack.JPG",
    alt: "Jack — Winger in match action",
    category: "Matchday",
  },
  {
    src: "/gallery/Edward.JPG",
    alt: "Edward — Midfielder in action",
    category: "Matchday",
  },
  {
    src: "/gallery/game.JPG",
    alt: "ASFC matchday action on the pitch",
    category: "Matchday",
  },
  {
    src: "/gallery/jackandlawrence.JPG",
    alt: "Jack and Lawrence celebrating on the pitch",
    category: "Matchday",
  },
  // Player Portraits
  {
    src: "/gallery/Lawrence.JPG",
    alt: "Lawrence — Midfield Captain Candidate",
    category: "Players",
  },
  {
    src: "/gallery/b7340890-0c29-4f24-96f7-46b273307d14.JPG",
    alt: "ASFC player on the sideline",
    category: "Players",
  },
  {
    src: "/gallery/Prince.JPG",
    alt: "Prince — Goalkeeper",
    category: "Players",
  },
  {
    src: "/gallery/Jojo.JPG",
    alt: "Jojo — Center Back",
    category: "Players",
  },
  {
    src: "/gallery/Patrick.JPG",
    alt: "Patrick — Center Back",
    category: "Players",
  },
  {
    src: "/gallery/Kafeme.JPG",
    alt: "Kafeme — Winger",
    category: "Players",
  },
  {
    src: "/gallery/Eleton2.JPG",
    alt: "Elton Saylee — Portrait",
    category: "Players",
  },
  {
    src: "/gallery/Jack1.JPG",
    alt: "Jack — Portrait",
    category: "Players",
  },
  {
    src: "/gallery/Yussef and Natla.JPG",
    alt: "Yussufu — Midfielder",
    category: "Players",
  },
  // Training & Warm-up
  {
    src: "/gallery/Rays.JPG",
    alt: "Ray Ra — Fullback warming up",
    category: "Training",
  },
];

const CATEGORIES = ["All", "Team", "Matchday", "Players", "Training"];

export function Gallery() {
  useDocumentTitle("Gallery");
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const filteredImages =
    activeCategory === "All"
      ? IMAGES
      : IMAGES.filter((img) => img.category === activeCategory);

  return (
    <div className="flex flex-col min-h-screen pt-24 bg-[#050505]">
      <PageHeader
        badge="Media Center"
        title="Club Gallery"
        subtitle="Moments captured on and off the pitch. Explore our visual history."
      />

      {/* Gallery Grid */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-16"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full font-display text-lg uppercase tracking-wider transition-all ${activeCategory === cat
                  ? "bg-teal-600 text-white shadow-lg shadow-teal-600/20"
                  : "glass text-slate-400 hover:text-white hover:border-white/30"
                  }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((img, i) => (
              <motion.div
                key={`${img.src}-${i}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                layout
              >
                <Tilt3DCard tiltMaxX={8} tiltMaxY={8} glare maxGlare={0.12}>
                  <div
                    className="group relative aspect-square rounded-2xl overflow-hidden glass-card-3d cursor-pointer"
                    onClick={() => setLightboxImage(img.src)}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-[#050505]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-teal-600/90 backdrop-blur-sm flex items-center justify-center text-white shadow-lg border border-white/20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Maximize2 size={20} />
                      </div>
                      <span className="text-white font-display text-xl uppercase tracking-wider transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                        {img.category}
                      </span>
                    </div>
                  </div>
                </Tilt3DCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-[#050505]/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 lightbox-3d"
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full glass hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
            >
              <X size={24} />
            </button>
            <motion.img
              initial={{ scale: 0.8, rotateY: 15 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.8, rotateY: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              src={lightboxImage}
              alt="Enlarged view"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
