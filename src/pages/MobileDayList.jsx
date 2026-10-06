import React from "react";
import { Users, Clock } from "lucide-react";

const STATUS_LABEL = {
  full: "Full",
  closed: "Booking closed",
  blocked: "Unavailable",
  cancelled: "Cancelled",
};

function nextDateForDow(availability, dow) {
  return (
    (availability?.days || []).find(
      (d) => new Date(d.date + "T12:00:00Z").getUTCDay() === dow
    ) || null
  );
}

// Phone schedule: a vertical day-by-day list with sticky day headers, instead
// of the six-column grid that is unreadable on a small screen.
export default function MobileDayList({ schedule, availability, enforce, onSelect }) {
  const days = schedule || [];

  return (
    <div className="space-y-8">
      {days.map((d) => {
        const live = nextDateForDow(availability, d.dayOfWeek);
        return (
          <section key={d.dayOfWeek}>
            <h2 className="sticky top-14 z-10 px-4 py-2.5 bg-white/95 backdrop-blur border-b border-[hsl(var(--border))] font-orbitron uppercase tracking-wide text-sm font-bold text-[hsl(var(--navy))]">
              {d.dayName}
            </h2>
            <div className="space-y-3 mt-3">
              {d.sessions.map((s) => {
                const liveSession = live?.sessions.find(
                  (x) => x.sessionTemplateId === s.sessionTemplateId
                );
                const unavailable =
                  liveSession && liveSession.status !== "open" && liveSession.status !== "almost_full";
                return (
                  <button
                    key={s.sessionTemplateId}
                    onClick={() => onSelect(s, d)}
                    className={`w-full text-left rounded-[12px] border px-4 py-3.5 min-h-[64px] transition-colors ${
                      unavailable
                        ? "border-[hsl(var(--border))] bg-[hsl(var(--light-bg))]"
                        : "border-[hsl(var(--border))] bg-white active:bg-[hsl(var(--light-bg))]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-orbitron text-base font-bold text-[hsl(var(--black))]">
                        {s.startTimeDisplay}
                      </span>
                      <span className="text-xs text-muted-foreground font-body flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {s.endTimeDisplay}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground font-body mt-1.5 flex items-center gap-1.5">
                      {liveSession ? (
                        unavailable ? (
                          STATUS_LABEL[liveSession.status] || "Unavailable"
                        ) : enforce ? (
                          <>
                            <Users className="w-4 h-4" />
                            {liveSession.spotsLeft} left
                          </>
                        ) : (
                          <>
                            <Users className="w-4 h-4" />
                            {liveSession.bookedCount} signed up
                          </>
                        )
                      ) : (
                        "45 min"
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
