import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Team", path: "/team" },
  { name: "Fixtures", path: "/fixtures" },
  { name: "Gallery", path: "/gallery" },
  { name: "News", path: "/news" },
  { name: "Contact", path: "/contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "glass border-b border-white/10 py-3"
          : "bg-transparent py-5",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <Logo className="w-12 h-12 group-hover:scale-105 transition-transform drop-shadow-lg" />
            <div className="flex flex-col">
              <span className="font-display text-2xl leading-none tracking-tight text-white uppercase">
                African Strikers
              </span>
              <span className="text-[10px] uppercase tracking-widest text-teal-400 font-medium mt-1">
                Where Unity Comes First
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6 preserve-3d">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={cn(
                      "font-display text-lg uppercase tracking-wider transition-all nav-link-3d relative",
                      location.pathname === link.path
                        ? "text-teal-400 text-glow"
                        : "text-slate-300 hover:text-teal-400",
                    )}
                  >
                    {link.name}
                    {location.pathname === link.path && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/join"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-display text-lg uppercase tracking-wider rounded-full transition-all shadow-lg shadow-teal-600/20 hover:shadow-teal-500/40 hover:-translate-y-0.5"
            >
              Join the Team
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-slate-300 hover:text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={cn(
          "md:hidden absolute top-full left-0 right-0 glass border-b border-white/10 transition-all duration-300 overflow-hidden",
          isMobileMenuOpen
            ? "max-h-screen py-4 opacity-100"
            : "max-h-0 opacity-0",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "font-display text-2xl uppercase tracking-wider py-2 transition-colors",
                location.pathname === link.path
                  ? "text-teal-400"
                  : "text-slate-300",
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/join"
            className="mt-4 px-5 py-3 bg-teal-600 hover:bg-teal-500 text-white text-center font-display text-xl uppercase tracking-wider rounded-lg transition-colors"
          >
            Join the Team
          </Link>
        </div>
      </div>
    </header>
  );
}
