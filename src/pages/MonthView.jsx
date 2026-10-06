import React, { useState } from "react";
import { blockTier, fmtTime, todayStr, monthGridStart, monthGridEnd, addDays, toDate, fmtDateLong } from "@/lib/calendar";

const TIER_DOT = {
  empty: "bg-[hsl(var(--border))]",
  light: "bg-[hsl(var(--navy))]/40",
  navy: "bg-[hsl(var(--navy))]",
  black: "bg-[hsl(var(--black))]",
};

export default function MonthView({ days, anchor, onSelect, matches }) {
  const [picked, setPicked] = useState(null);

  const start = monthGridStart(anchor);
  const end = monthGridEnd(anchor);
  const today = todayStr();
  const month = toDate(anchor).getUTCMonth();

  const cells = [];
  let cur = start;
  for (let i = 0; i < 42 && cur <= end; i++) {
    cells.push(cur);
    cur = addDays(cur, 1);
  }

  const dayMap = {};
  for (const d of days || []) dayMap[d.date] = d;

  const sessionsFor = (date) =>
    (dayMap[date]?.sessions || []).filter((s) => !matches || matches(s));

  const pickedSessions = picked ? sessionsFor(picked) : [];

  return (
    <div className="space-y-4">
      <div className="card overflow-hidden">
        <div className="grid grid-cols-7">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div
              key={d}
              className="py-2 text-center font-orbitron uppercase tracking-wider text-[10px] text-muted-foreground border-b border-[hsl(var(--border))]"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((date) => {
            const d = toDate(date);
            const isToday = date === today;
            const inMonth = d.getUTCMonth() === month;
            const sessions = sessionsFor(date);
            const isPicked = picked === date;
            const topTier = sessions.length
              ? blockTier(Math.max(...sessions.map((s) => s.athleteCount || 0)))
              : "empty";
            return (
              <div
                key={date}
                onClick={() => setPicked(isPicked ? null : date)}
                className={`min-h-[58px] md:min-h-[110px] border-b border-r border-[hsl(var(--border))] p-1.5 md:p-2 cursor-pointer ${
                  isPicked
                    ? "bg-[hsl(var(--navy))]/15"
                    : isToday
                    ? "bg-[hsl(var(--navy))]/8"
                    : inMonth
                    ? "bg-white"
                    : "bg-[hsl(var(--light-bg))]"
                }`}
              >
                <div
                  className={`font-orbitron text-xs font-bold text-center md:text-left ${
                    inMonth ? "text-[hsl(var(--black))]" : "text-muted-foreground"
                  }`}
                >
                  {d.getUTCDate()}
                </div>

                {/* Phone: a dot plus the session count — never tiny multi-line text. */}
                {sessions.length > 0 && (
                  <div className="md:hidden flex flex-col items-center gap-0.5 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${TIER_DOT[topTier]}`} />
                    <span className="text-[10px] leading-none text-muted-foreground font-body">
                      {sessions.length}
                    </span>
                  </div>
                )}

                {/* Desktop: the full inline list. */}
                <div className="hidden md:block space-y-1">
                  {sessions.map((s) => (
                    <button
                      key={s.sessionTemplateId}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(date, s);
                      }}
                      className="w-full flex items-center gap-1.5 text-left rounded-[6px] px-1.5 py-1 hover:bg-[hsl(var(--light-bg))]"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${TIER_DOT[blockTier(s.athleteCount)]}`} />
                      <span className="text-[10px] leading-tight truncate">
                        {fmtTime(s.startTime)} · {s.athleteCount} {s.athleteCount === 1 ? "athlete" : "athletes"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phone: the tapped day's sessions, listed directly below the grid. */}
      <div className="md:hidden">
        {picked ? (
          <div className="card p-4">
            <h3 className="font-orbitron uppercase tracking-wide text-xs font-bold text-[hsl(var(--navy))] mb-3">
              {fmtDateLong(picked)}
            </h3>
            {pickedSessions.length === 0 ? (
              <p className="text-sm text-muted-foreground font-body">No sessions this day.</p>
            ) : (
              <div className="space-y-2">
                {pickedSessions.map((s) => (
                  <button
                    key={s.sessionTemplateId}
                    onClick={() => onSelect(picked, s)}
                    className="w-full flex items-center gap-3 text-left rounded-[10px] border border-[hsl(var(--border))] px-4 py-3 min-h-[56px] active:bg-[hsl(var(--light-bg))]"
                  >
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${TIER_DOT[blockTier(s.athleteCount)]}`} />
                    <span className="font-orbitron text-sm font-bold text-[hsl(var(--black))]">
                      {fmtTime(s.startTime)}
                    </span>
                    <span className="text-sm text-muted-foreground font-body ml-auto">
                      {s.athleteCount} {s.athleteCount === 1 ? "athlete" : "athletes"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground font-body text-center py-2">
            Tap a day to see its sessions.
          </p>
        )}
      </div>
    </div>
  );
}
