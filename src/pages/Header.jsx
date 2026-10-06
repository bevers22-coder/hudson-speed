import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Calendar } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useAuth } from "@/lib/AuthContext";

// Public navigation only. The staff area is deliberately absent — staff reach
// it through the small "Staff" link in the footer.
const NAV = [
  { label: "Home", path: "/" },
  { label: "Program", path: "/program" },
  { label: "Schedule", path: "/schedule" },
  { label: "Coach", path: "/coach" },
  { label: "Location", path: "/location" },
];

export default function Header({ announcement, wordmark }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[hsl(var(--border))]">
      {announcement?.active && announcement?.text && (
        <div className="bg-[hsl(var(--navy))] text-white text-center text-xs sm:text-sm px-4 py-2.5 font-body">
          {announcement.text}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between gap-4 transition-all ${scrolled ? "h-14 sm:h-16" : "h-16 sm:h-20"}`}>
          <Link to="/" className="flex flex-col leading-tight flex-shrink-0" aria-label="Hudson Speed and Strength home">
            <span className={`wordmark text-[hsl(var(--black))] transition-all ${scrolled ? "text-[11px] sm:text-sm" : "text-xs sm:text-base"}`}>
              Hudson Speed and Strength
            </span>
            {wordmark ? (
              <Image
                src={wordmark}
                alt="Hudson SportsPlex"
                fittingType="fit"
                style={{ display: "block", width: scrolled ? "118px" : "146px", height: scrolled ? "13px" : "16px" }}
              />
            ) : (
              <span className="text-[10px] sm:text-xs text-muted-foreground tracking-wide mt-0.5 font-body">
                at Hudson SportsPlex
              </span>
            )}
          </Link>

          <nav className="hidden xl:flex items-center gap-0.5" aria-label="Main navigation">
            {NAV.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-2.5 py-2 rounded-[8px] font-orbitron uppercase tracking-wider text-[11px] transition-colors ${
                  isActive(link.path)
                    ? "text-[hsl(var(--navy))] bg-[hsl(var(--light-bg))]"
                    : "text-foreground hover:text-[hsl(var(--navy))] hover:bg-[hsl(var(--light-bg))]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <Link to="/manage" className="font-orbitron uppercase tracking-wider text-[11px] text-muted-foreground hover:text-[hsl(var(--navy))]">
              Manage Booking
            </Link>
            {isAuthenticated && (
              <Link
                to="/account"
                className="inline-flex items-center gap-1 font-orbitron uppercase tracking-wider text-[11px] text-muted-foreground hover:text-[hsl(var(--navy))]"
              >
                My Account
              </Link>
            )}
            <Link
              to="/book"
              className="inline-flex items-center gap-2 rounded-[10px] bg-[hsl(var(--navy))] text-white font-orbitron uppercase tracking-wider text-xs px-4 py-2.5 transition-colors hover:bg-[hsl(var(--navy-light))]"
            >
              <Calendar className="w-4 h-4" /> Book a Session
            </Link>
          </div>

          <button
            className="xl:hidden p-2 -mr-2 text-foreground"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile slide-in menu */}
      <div className={`xl:hidden fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-[82%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-5 h-16 border-b border-[hsl(var(--border))]">
            <span className="wordmark text-xs text-[hsl(var(--black))]">Menu</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-2 -mr-2">
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile navigation">
            {NAV.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3.5 rounded-[10px] font-orbitron uppercase tracking-wider text-sm ${
                  isActive(link.path) ? "text-[hsl(var(--navy))] bg-[hsl(var(--light-bg))]" : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/manage" className="block px-4 py-3.5 rounded-[10px] font-orbitron uppercase tracking-wider text-sm text-foreground">
              Manage Booking
            </Link>
            {isAuthenticated && (
              <Link to="/account" className="block px-4 py-3.5 rounded-[10px] font-orbitron uppercase tracking-wider text-sm text-muted-foreground">
                My Account
              </Link>
            )}
          </nav>
          <div className="p-4 border-t border-[hsl(var(--border))]">
            <Link to="/book" className="btn-navy w-full">
              <Calendar className="w-4 h-4" /> Book a Session
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
