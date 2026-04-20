import { MapPin, MessageCircle, Mail, Clock, Send } from "lucide-react";
import React, { useState } from "react";
import { motion } from "motion/react";
import { PageHeader } from "@/components/PageHeader";
import { Tilt3DCard } from "@/components/Tilt3DCard";
import { ParticleField } from "@/components/ParticleField";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function Contact() {
  useDocumentTitle("Contact");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailConfirmed, setEmailConfirmed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = e.target as HTMLFormElement;
    const formData = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setEmailConfirmed(data.autoReplySent === true);
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
        badge="Get In Touch"
        title="Contact Us"
        subtitle="Have a question about the club, ticketing, or sponsorship? We'd love to hear from you."
      />

      {/* Contact Section */}
      <section className="py-24 relative">
        <ParticleField count={10} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-12"
            >
              <div>
                <h2 className="font-display text-4xl uppercase tracking-tight text-white mb-8">
                  Club Headquarters
                </h2>
                <div className="space-y-8">
                  {[
                    {
                      icon: MapPin,
                      title: "Location",
                      content: (
                        <>
                          Brooklyn Park, Minnesota
                          <br />
                          Twin Cities Metro Area
                        </>
                      ),
                    },
                    {
                      icon: MessageCircle,
                      title: "Reach Out",
                      content: (
                        <>
                          Contact us via email or social media
                          <br />
                          for the fastest response.
                        </>
                      ),
                    },
                    {
                      icon: Mail,
                      title: "Email",
                      content: (
                        <>
                          General: info@africanstrikersfc.com
                          <br />
                          Sponsorship: sponsors@africanstrikersfc.com
                        </>
                      ),
                    },
                    {
                      icon: Clock,
                      title: "Training Schedule",
                      content: (
                        <>
                          Weekday Evenings &amp; Saturday Mornings
                          <br />
                          Match Days: Per ADH Super League Schedule
                        </>
                      ),
                    },
                  ].map((info, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="flex items-start gap-6 group"
                    >
                      <div className="w-14 h-14 rounded-full glass flex items-center justify-center text-teal-400 shrink-0 group-hover:bg-teal-900/30 group-hover:border-teal-500/30 transition-colors">
                        <info.icon size={24} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-2">
                          {info.title}
                        </h3>
                        <p className="text-slate-400 leading-relaxed">
                          {info.content}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 40, rotateY: -5 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <Tilt3DCard tiltMaxX={3} tiltMaxY={3} glare maxGlare={0.05}>
                <div className="glass-card-3d rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                  <h2 className="font-display text-3xl uppercase tracking-tight text-white mb-8 relative z-10">
                    Send a Message
                  </h2>

                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-8 text-center flex flex-col items-center gap-4 relative z-10"
                    >
                      <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 glow-pulse">
                        <Send size={32} />
                      </div>
                      <h3 className="text-xl font-bold uppercase tracking-wider text-white">
                        Message Sent
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        Thank you for contacting African Strikers. Our team will get
                        back to you as soon as possible.
                      </p>
                      {emailConfirmed ? (
                        <p className="text-emerald-400/80 text-xs">
                          ✅ A confirmation email has been sent to your inbox.
                        </p>
                      ) : (
                        <p className="text-amber-400/80 text-xs">
                          ⚠️ Your message was saved. We couldn't send a confirmation email,
                          but our team will still get back to you.
                        </p>
                      )}
                      <button
                        onClick={() => { setIsSubmitted(false); setEmailConfirmed(false); }}
                        className="mt-4 px-6 py-3 glass hover:bg-white/10 text-white text-sm font-bold uppercase tracking-wider rounded-lg transition-colors"
                      >
                        Send Another Message
                      </button>
                    </motion.div>
                  ) : (
                    <form
                      onSubmit={handleSubmit}
                      className="space-y-6 relative z-10"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label
                            htmlFor="name"
                            className="text-xs font-bold uppercase tracking-widest text-slate-400 block"
                          >
                            Your Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            required
                            className="w-full glass rounded-lg px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                            placeholder="John Doe"
                          />
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor="email"
                            className="text-xs font-bold uppercase tracking-widest text-slate-400 block"
                          >
                            Your Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            required
                            className="w-full glass rounded-lg px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="subject"
                          className="text-xs font-bold uppercase tracking-widest text-slate-400 block"
                        >
                          Subject
                        </label>
                        <select
                          id="subject"
                          required
                          className="w-full glass rounded-lg px-4 py-3.5 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all appearance-none"
                        >
                          <option value="" disabled selected>
                            Select a subject
                          </option>
                          <option value="General">General Inquiry</option>
                          <option value="Ticketing">Ticketing & Memberships</option>
                          <option value="Sponsorship">
                            Sponsorship Opportunities
                          </option>
                          <option value="Press">Press & Media</option>
                          <option value="Academy">Academy Information</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="message"
                          className="text-xs font-bold uppercase tracking-widest text-slate-400 block"
                        >
                          Message
                        </label>
                        <textarea
                          id="message"
                          required
                          rows={6}
                          className="w-full glass rounded-lg px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all resize-none"
                          placeholder="How can we help you?"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-8 py-4 bg-teal-600 hover:bg-teal-500 disabled:bg-teal-800 disabled:cursor-not-allowed text-white font-display text-xl uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-teal-600/20 hover:shadow-teal-500/40 flex items-center justify-center gap-3"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send size={18} />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </Tilt3DCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="relative border-t border-white/10 overflow-hidden">
        <div className="relative h-96">
          <iframe
            title="Brooklyn Park, Minnesota"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d90210.78821583705!2d-93.43178!3d45.094!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x52b33f6a1a6b9c43%3A0x3a4e7d3a0a0a0a0a!2sBrooklyn%20Park%2C%20MN!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) saturate(0.6) brightness(0.85)" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          {/* Overlay badge */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 glass border border-white/10 rounded-full px-5 py-3 shadow-xl z-10">
            <MapPin size={18} className="text-teal-400 shrink-0" />
            <span className="text-sm font-bold uppercase tracking-widest text-white">
              Brooklyn Park, Minnesota
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
