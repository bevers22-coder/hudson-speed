import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, CalendarDays, CalendarPlus, Search } from "lucide-react";

const ITEMS = [
  { label: "Home", path: "/", icon: Home },
  { label: "Schedule", path: "/schedule", icon: CalendarDays },
  { label: "Book", path: "/book", icon: CalendarPlus },
  { label: "Manage", path: "/manage", icon: Search },
];

// Fixed phone navigation. Keeps the four things parents actually do one tap
// away, and replaces the old sticky "Book a Session" bar.
export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[hsl(var(--border))] no-print"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary navigation"
    >
      <div className="grid grid-cols-4">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-1 min-h-[56px] py-2 font-orbitron uppercase tracking-wider text-[10px] ${
                active ? "text-[hsl(var(--navy))]" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
