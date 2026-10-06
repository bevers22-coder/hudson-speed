import React from "react";
import { Users } from "lucide-react";

const STATUS_LABEL = {
  full: "Full",
  closed: "Booking closed",
  blocked: "Unavailable",
  cancelled: "Cancelled",
};

function nextDateForDow(availability, dow) {
  return (availability?.days || []).find((d) => new Date(d.date + "T12:00:00Z").getUTCDay() === dow) || null;
}

export default function WeeklyGrid({ schedule, availability, enforce, onSelect, activeDay, onDayChange }) {
  const days = schedule || [];
  const visible = activeDay == null ? days : days.filter((d) => d.dayOfWeek === activeDay);

  return (
    <div>
      <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-5 -mx-1 px-1">
        {days.map((d) => (
          <button
            key={d.dayOfWeek}
            onClick={() => onDayChange(d.dayOfWeek)}
            className={`flex-shrink-0 px-4 py-2 rounded-[10px] font-orbitron uppercase tracking-wider text-xs border transition-colors ${
              activeDay === d.dayOfWeek
                ? "bg-[hsl(var(--navy))] text-white border-[hsl(var(--navy))]"
                : "bg-white border-[hsl(var(--border))] text-foreground"
            }`}
          >
            {d.dayName.slice(0, 3)}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {visible.map((d) => {
          const live = nextDateForDow(availability, d.dayOfWeek);
          return (
            <div key={d.dayOfWeek} className="card p-4">
              <h3 className="font-orbitron uppercase tracking-wide text-xs font-bold text-[hsl(var(--navy))] pb-3 mb-3 border-b border-[hsl(var(--border))]">
                {d.dayName}
              </h3>
              <div className="space-y-2">
                {d.sessions.map((s) => {
                  const liveSession = live?.sessions.find((x) => x.sessionTemplateId === s.sessionTemplateId);
                  const unavailable = liveSession && liveSession.status !== "open" && liveSession.status !== "almost_full";
                  return (
                    <button
                      key={s.sessionTemplateId}
                      onClick={() => onSelect(s, d)}
                      className={`w-full text-left rounded-[10px] border px-3 py-2.5 transition-all ${
                        unavailable
                          ? "border-[hsl(var(--border))] bg-[hsl(var(--light-bg))]"
                          : "border-[hsl(var(--border))] bg-white hover:border-[hsl(var(--navy))] hover:-translate-y-0.5 hover:shadow-sm"
                      }`}
                    >
                      <div className="font-orbitron text-xs font-bold text-[hsl(var(--black))]">
                        {s.startTimeDisplay}
                      </div>
                      {liveSession ? (
                        <div className="text-[11px] text-muted-foreground font-body mt-0.5 flex items-center gap-1">
                          {unavailable ? (
                            STATUS_LABEL[liveSession.status] || "Unavailable"
                          ) : enforce ? (
                            <><Users className="w-3 h-3" />{liveSession.spotsLeft} left</>
                          ) : (
                            <><Users className="w-3 h-3" />{liveSession.bookedCount} signed up</>
                          )}
                        </div>
                      ) : (
                        <div className="text-[11px] text-muted-foreground font-body mt-0.5">45 min</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
