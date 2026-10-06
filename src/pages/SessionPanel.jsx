import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Users, MapPin } from "lucide-react";
import { LOCATION_LINE } from "@/lib/schedule";

const STATUS_LABEL = {
  full: "Full",
  closed: "Booking closed (starts within 2 hours)",
  blocked: "Unavailable",
  cancelled: "Cancelled",
};

export default function SessionPanel({ session, day, upcoming, enforce, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const open = !!session;

  const bookLink = (u) =>
    u.sessionTemplateId
      ? `/book?template=${u.sessionTemplateId}&date=${u.date}`
      : `/book?dow=${day?.dayOfWeek ?? ""}&time=${session?.startTime ?? ""}&date=${u.date}`;

  return (
    <div className={`fixed inset-0 z-[70] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Session details"
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {session && (
          <>
            <div className="flex items-start justify-between px-6 py-5 border-b border-[hsl(var(--border))]">
              <div>
                <div className="font-orbitron uppercase tracking-wider text-xs text-muted-foreground">
                  {day?.dayName}
                </div>
                <h2 className="font-orbitron font-bold text-lg text-[hsl(var(--black))] mt-1">
                  {session.startTimeDisplay} – {session.endTimeDisplay}
                </h2>
                <p className="text-xs text-muted-foreground font-body mt-1">
                  Speed &amp; Agility (45 min), or add Strength right after for 90 minutes.
                </p>
                <p className="text-xs text-muted-foreground font-body mt-1 flex items-start gap-1">
                  <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
                  <span>{LOCATION_LINE}</span>
                </p>
              </div>
              <button onClick={onClose} aria-label="Close panel" className="p-2 -mr-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <h3 className="font-orbitron uppercase tracking-wider text-xs text-[hsl(var(--navy))] mb-4">
                Upcoming Dates
              </h3>
              <div className="space-y-3">
                {upcoming.map((u) => {
                  const bookable = u.status === "open" || u.status === "almost_full";
                  const dateObj = new Date(u.date + "T12:00:00Z");
                  return (
                    <div key={u.date} className="border border-[hsl(var(--border))] rounded-[10px] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-orbitron text-sm font-bold text-[hsl(var(--black))]">
                            {dateObj.toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              timeZone: "UTC",
                            })}
                          </div>
                          <div className="text-xs text-muted-foreground font-body mt-1 flex items-center gap-1">
                            {bookable ? (
                              enforce ? (
                                <>
                                  <Users className="w-3 h-3" />
                                  {u.spotsLeft} {u.spotsLeft === 1 ? "spot" : "spots"} left
                                </>
                              ) : (
                                <>
                                  <Users className="w-3 h-3" />
                                  {u.bookedCount} {u.bookedCount === 1 ? "athlete" : "athletes"} signed up
                                </>
                              )
                            ) : (
                              STATUS_LABEL[u.status] || "Unavailable"
                            )}
                          </div>
                        </div>
                        {bookable && (
                          <Link
                            to={bookLink(u)}
                            className="inline-flex items-center gap-1 rounded-[10px] bg-[hsl(var(--navy))] text-white font-orbitron uppercase tracking-wider text-[11px] px-4 py-2.5 flex-shrink-0 hover:bg-[hsl(var(--navy-light))] transition-colors"
                          >
                            Book this session
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
                {upcoming.length === 0 && (
                  <p className="text-sm text-muted-foreground font-body">
                    No upcoming dates in the next 30 days.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
