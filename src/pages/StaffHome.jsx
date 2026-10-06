import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StaffGate from "@/components/staff/StaffGate";
import StaffCalendar from "@/components/staff/StaffCalendar";
import UpcomingSessions from "@/components/staff/UpcomingSessions";
import WhatsNew from "@/components/staff/WhatsNew";
import BookingsTab from "@/components/staff/BookingsTab";
import NotificationsTab from "@/components/staff/NotificationsTab";
import NoIndex from "@/components/staff/NoIndex";
import { useAuth } from "@/lib/AuthContext";
import {
  Home, CalendarDays, ClipboardList, Bell, LogOut,
  LayoutDashboard, Settings, Image as ImageIcon, FileText, Mail, CalendarX,
} from "lucide-react";

const TABS = [
  { key: "home", label: "Home", icon: Home },
  { key: "calendar", label: "Calendar", icon: CalendarDays },
  { key: "bookings", label: "Bookings", icon: ClipboardList },
  { key: "notifications", label: "Notifications", icon: Bell },
];

const ADMIN_LINKS = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Settings", path: "/admin/settings", icon: Settings },
  { label: "Site Images", path: "/admin/images", icon: ImageIcon },
  { label: "Blocked Dates", path: "/admin/blocked-dates", icon: CalendarX },
  { label: "Weekly Report", path: "/admin/weekly-report", icon: FileText },
  { label: "Email Log", path: "/admin/email-log", icon: Mail },
];

function StaffShell({ access }) {
  const { logout } = useAuth();
  const [tab, setTab] = useState("home");
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    document.title = "Staff — Hudson Speed and Strength";
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSecondsAgo((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const onUpdated = React.useCallback(() => setSecondsAgo(0), []);

  return (
    <div className="min-h-screen bg-[hsl(var(--light-bg))]">
      <NoIndex />

      <div className="bg-[hsl(var(--navy))] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="wordmark text-xs sm:text-sm text-white">Hudson Speed and Strength</div>
            <div className="text-[10px] text-white/60 tracking-wide font-orbitron uppercase">Staff Home</div>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-orbitron uppercase tracking-wider text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Live · updated {secondsAgo}s ago
            </span>
            <span className="hidden md:inline text-xs text-white/60">{access.email}</span>
            <button
              onClick={() => logout(true)}
              className="inline-flex items-center gap-1 text-[10px] font-orbitron uppercase tracking-wider text-white/80 hover:text-white"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-30 bg-white border-b border-[hsl(var(--border))]">
        <div className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-8">
          <nav className="flex overflow-x-auto" aria-label="Staff sections">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-2 px-4 py-3.5 font-orbitron uppercase tracking-wider text-[11px] whitespace-nowrap border-b-2 transition-colors ${
                    active
                      ? "border-[hsl(var(--navy))] text-[hsl(var(--navy))]"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="sm:hidden mb-4 flex items-center gap-1.5 text-[10px] font-orbitron uppercase tracking-wider text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Live · updated {secondsAgo}s ago
        </div>

        {tab === "home" && (
          <>
            <UpcomingSessions onUpdated={onUpdated} />
            <WhatsNew />
          </>
        )}

        {tab === "calendar" && <StaffCalendar />}
        {tab === "bookings" && <BookingsTab />}
        {tab === "notifications" && <NotificationsTab access={access} />}

        {access.isAdmin && (
          <div className="mt-10 pt-6 border-t border-[hsl(var(--border))]">
            <h2 className="font-orbitron text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Admin
            </h2>
            <div className="flex flex-wrap gap-2">
              {ADMIN_LINKS.map((l) => {
                const Icon = l.icon;
                return (
                  <Link key={l.path} to={l.path} className="btn-outline text-[11px] px-3 py-2 min-h-0">
                    <Icon className="w-3.5 h-3.5" /> {l.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StaffHome() {
  return (
    <StaffGate>
      {({ access }) => <StaffShell access={access} />}
    </StaffGate>
  );
}
