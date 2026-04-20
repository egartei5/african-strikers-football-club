import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MapPin,
  Mail,
} from "lucide-react";

const SOCIAL_LINKS = [
  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/people/African-Strikers-FC/61576785016744/" },
  { icon: Twitter, label: "Twitter / X", href: null },
  { icon: Instagram, label: "Instagram", href: null },
  { icon: Youtube, label: "YouTube", href: null },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subState, setSubState] = useState<"idle" | "loading" | "success" | "duplicate" | "error">("idle");

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSubState(data.alreadySubscribed ? "duplicate" : "success");
      setEmail("");
    } catch {
      setSubState("error");
    }
  };

  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <Logo className="w-16 h-16 drop-shadow-lg" />
              <div className="flex flex-col">
                <span className="font-display text-3xl leading-none tracking-tight text-white uppercase">
                  African Strikers
                </span>
                <span className="text-[11px] uppercase tracking-widest text-teal-400 font-medium mt-1">
                  Where Unity Comes First
                </span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              A premier football club dedicated to excellence, unity, and
              community development. We build champions on and off the pitch.
            </p>
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) =>
                href ? (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-10 h-10 rounded-full glass flex items-center justify-center text-slate-400 hover:text-teal-400 hover:border-teal-400/50 transition-colors"
                  >
                    <Icon size={18} />
                  </a>
                ) : (
                  <div
                    key={label}
                    title={`${label} — Coming Soon`}
                    aria-label={`${label} — Coming Soon`}
                    className="w-10 h-10 rounded-full glass flex items-center justify-center text-slate-600 cursor-not-allowed select-none"
                  >
                    <Icon size={18} />
                  </div>
                )
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-display text-2xl uppercase tracking-wider mb-6">
              Quick Links
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/about"
                  className="text-slate-400 hover:text-teal-400 transition-colors text-sm font-medium"
                >
                  About the Club
                </Link>
              </li>
              <li>
                <Link
                  to="/team"
                  className="text-slate-400 hover:text-teal-400 transition-colors text-sm font-medium"
                >
                  First Team
                </Link>
              </li>
              <li>
                <Link
                  to="/fixtures"
                  className="text-slate-400 hover:text-teal-400 transition-colors text-sm font-medium"
                >
                  Fixtures & Results
                </Link>
              </li>
              <li>
                <Link
                  to="/news"
                  className="text-slate-400 hover:text-teal-400 transition-colors text-sm font-medium"
                >
                  Latest News
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="text-slate-400 hover:text-teal-400 transition-colors text-sm font-medium"
                >
                  Media Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-display text-2xl uppercase tracking-wider mb-6">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-teal-500 mt-0.5 shrink-0" />
                <span className="text-slate-400 text-sm leading-relaxed">
                  Brooklyn Park, Minnesota
                  <br />
                  Twin Cities Metro Area
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-teal-500 shrink-0" />
                <span className="text-slate-400 text-sm">
                  info@africanstrikersfc.com
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-display text-2xl uppercase tracking-wider mb-6">
              Newsletter
            </h3>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              Subscribe to get the latest news, match updates, and exclusive
              offers.
            </p>
            {subState === "success" ? (
              <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg px-4 py-3 text-emerald-400 text-sm font-medium">
                You're subscribed! Welcome to the ASFC family.
              </div>
            ) : subState === "duplicate" ? (
              <div className="bg-teal-900/20 border border-teal-500/30 rounded-lg px-4 py-3 text-teal-400 text-sm font-medium">
                You're already subscribed!
              </div>
            ) : (
              <form className="flex flex-col gap-3" onSubmit={handleNewsletter}>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (subState === "error") setSubState("idle"); }}
                  className="glass border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  required
                />
                {subState === "error" && (
                  <p className="text-red-400 text-xs">Something went wrong. Please try again.</p>
                )}
                <button
                  type="submit"
                  disabled={subState === "loading"}
                  className="bg-teal-600 hover:bg-teal-500 disabled:bg-teal-800 disabled:cursor-not-allowed text-white font-display text-lg uppercase tracking-wider rounded-lg px-4 py-3 transition-colors flex items-center justify-center gap-2"
                >
                  {subState === "loading" ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Subscribing...</>
                  ) : "Subscribe"}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} African Strikers Football Club.
            All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
