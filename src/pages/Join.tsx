import React, { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { PageHeader } from "@/components/PageHeader";
import { Tilt3DCard } from "@/components/Tilt3DCard";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function Join() {
  useDocumentTitle("Join the Team");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = e.target as HTMLFormElement;
    const formData = {
      full_name: (form.elements.namedItem("fullName") as HTMLInputElement).value,
      age: parseInt((form.elements.namedItem("age") as HTMLInputElement).value),
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      position: (form.elements.namedItem("position") as HTMLSelectElement).value,
      experience: (form.elements.namedItem("experience") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value || null,
    };

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit application");
      }

      setIsSubmitted(true);
      form.reset();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-24 bg-[#050505]">
      <PageHeader
        badge="Academy Registration"
        title="Join The Team"
        subtitle="Ready to take your game to the next level? Apply for a trial with African Strikers Football Club."
        backgroundImage="/gallery/Teams.JPG"
      />

      {/* Form Section */}
      <section className="py-24 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-10 text-center flex flex-col items-center gap-6"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 glow-pulse">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="font-display text-4xl uppercase tracking-tight text-white">
                Application Received
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-lg mx-auto">
                Thank you for your interest in African Strikers. Our coaching
                staff will review your application and contact you regarding
                upcoming trial dates.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 px-8 py-4 glass hover:bg-white/10 text-white font-display text-xl uppercase tracking-wider rounded-lg transition-colors"
              >
                Submit Another Application
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30, rotateX: 5 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <Tilt3DCard tiltMaxX={3} tiltMaxY={3} glare maxGlare={0.05}>
                <div className="glass-card-3d rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                  <div className="flex items-start gap-4 mb-10 p-4 bg-teal-900/20 border border-teal-500/20 rounded-xl">
                    <AlertCircle
                      className="text-teal-400 shrink-0 mt-0.5"
                      size={20}
                    />
                    <p className="text-sm text-teal-100/80 leading-relaxed">
                      Please fill out all fields accurately. Trials are currently
                      open for players aged 16-23. Selected candidates will be
                      invited for an assessment session.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label
                          htmlFor="fullName"
                          className="text-xs font-bold uppercase tracking-widest text-slate-400 block"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          required
                          className="w-full glass rounded-lg px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                          placeholder="John Doe"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="age"
                          className="text-xs font-bold uppercase tracking-widest text-slate-400 block"
                        >
                          Age
                        </label>
                        <input
                          type="number"
                          id="age"
                          min="16"
                          max="35"
                          required
                          className="w-full glass rounded-lg px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                          placeholder="18"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="text-xs font-bold uppercase tracking-widest text-slate-400 block"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          className="w-full glass rounded-lg px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                          placeholder="john@example.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="phone"
                          className="text-xs font-bold uppercase tracking-widest text-slate-400 block"
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          required
                          className="w-full glass rounded-lg px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="position"
                          className="text-xs font-bold uppercase tracking-widest text-slate-400 block"
                        >
                          Primary Position
                        </label>
                        <select
                          id="position"
                          required
                          className="w-full glass rounded-lg px-4 py-3.5 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all appearance-none"
                        >
                          <option value="" disabled selected>
                            Select Position
                          </option>
                          <option value="Goalkeeper">Goalkeeper</option>
                          <option value="Defender">Defender</option>
                          <option value="Midfielder">Midfielder</option>
                          <option value="Forward">Forward</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="experience"
                          className="text-xs font-bold uppercase tracking-widest text-slate-400 block"
                        >
                          Playing Experience
                        </label>
                        <select
                          id="experience"
                          required
                          className="w-full glass rounded-lg px-4 py-3.5 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all appearance-none"
                        >
                          <option value="" disabled selected>
                            Select Experience Level
                          </option>
                          <option value="Beginner">Beginner / Amateur</option>
                          <option value="School">School / College Team</option>
                          <option value="Academy">Academy Level</option>
                          <option value="Semi-Pro">Semi-Professional</option>
                          <option value="Professional">Professional</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="message"
                        className="text-xs font-bold uppercase tracking-widest text-slate-400 block"
                      >
                        Additional Information (Optional)
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        className="w-full glass rounded-lg px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all resize-none"
                        placeholder="Tell us briefly about your playing history, previous clubs, or notable achievements..."
                      ></textarea>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-8 py-4 bg-teal-600 hover:bg-teal-500 disabled:bg-teal-800 disabled:cursor-not-allowed text-white font-display text-xl uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-teal-600/20 hover:shadow-teal-500/40 flex items-center justify-center"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Submitting...
                          </span>
                        ) : (
                          "Submit Application"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </Tilt3DCard>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
