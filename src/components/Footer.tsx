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

export function Footer() {
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
              <a
                href="#"
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-slate-400 hover:text-teal-400 hover:border-teal-400/50 transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-slate-400 hover:text-teal-400 hover:border-teal-400/50 transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-slate-400 hover:text-teal-400 hover:border-teal-400/50 transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-slate-400 hover:text-teal-400 hover:border-teal-400/50 transition-colors"
              >
                <Youtube size={18} />
              </a>
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
            <form
              className="flex flex-col gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Your email address"
                className="glass border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                required
              />
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-500 text-white font-display text-lg uppercase tracking-wider rounded-lg px-4 py-3 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} African Strikers Football Club.
            All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
