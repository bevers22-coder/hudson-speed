import React, { useEffect, useState } from "react";
import { blockTier, chicagoNowMinutes, fmtTime, minutesFromHHMM, todayStr, DAY_LABELS, toDate } from "@/lib/calendar";

const HOUR_START = 8;
const HOUR_END = 20;
const HOUR_PX = 64;
const HOURS = Array.from({ length: HOUR_END - HOUR_START + 1 }, (_, i) => HOUR_START + i);

const TIER_CLASS = {
  empty: "border border-dashed border-[hsl(var(--border))] bg-white text-foreground",
  light: "border border-[hsl(var(--navy))]/30 bg-[hsl(var(--navy))]/10 text-[hsl(var(--navy))]",
  navy: "border border-[hsl(var(--navy))] bg-[hsl(var(--navy))] text-white",
  black: "border border-black bg-[hsl(var(--black))] text-white",
};

export default function WeekView({ days, weekStart, onSelect, matches }) {
  const [nowMin, setNowMin] = useState(chicagoNowMinutes());
  const today = todayStr();

  useEffect(() => {
    const t = setInterval(() => setNowMin(chicagoNowMinutes()), 60000);
    return () => clearInterval(t);
  }, []);

  const columns = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(`${weekStart}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + i);
    return d.toISOString().slice(0, 10);
  });

  const dayMap = {};
  for (const d of days || []) dayMap[d.date] = d;

  const gridHeight = (HOUR_END - HOUR_START + 1) * HOUR_PX;

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Day headers */}
          <div className="grid" style={{ gridTemplateColumns: "64px repeat(6, minmax(0, 1fr))" }}>
            <div className="border-b border-r border-[hsl(var(--border))]" />
            {columns.map((date) => {
              const d = toDate(date);
              const isToday = date === today;
              return (
                <div
                  key={date}
                  className={`border-b border-r border-[hsl(var(--border))] px-3 py-2 text-center ${
                    isToday ? "bg-[hsl(var(--navy))]/8" : ""
                  }`}
                >
                  <div className="font-orbitron uppercase tracking-wider text-[10px] text-muted-foreground">
                    {DAY_LABELS[d.getUTCDay()]}
                  </div>
                  <div className={`font-orbitron font-bold text-sm ${isToday ? "text-[hsl(var(--navy))]" : "text-[hsl(var(--black))]"}`}>
                    {d.getUTCDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time grid */}
          <div className="grid relative" style={{ gridTemplateColumns: "64px repeat(6, minmax(0, 1fr))", height: gridHeight }}>
            {/* Hour labels + lines */}
            <div className="relative border-r border-[hsl(var(--border))]">
              {HOURS.map((h, i) => (
                <div
                  key={h}
                  className="absolute left-0 right-0 text-[10px] text-muted-foreground font-orbitron text-right pr-2"
                  style={{ top: i * HOUR_PX - 6 }}
                >
                  {fmtTime(`${String(h).padStart(2, "0")}:00`)}
                </div>
              ))}
            </div>

            {columns.map((date) => {
              const isToday = date === today;
              const sessions = dayMap[date]?.sessions || [];
              return (
                <div
                  key={date}
                  className={`relative border-r border-[hsl(var(--border))] ${isToday ? "bg-[hsl(var(--navy))]/5" : ""}`}
                >
                  {HOURS.map((h, i) => (
                    <div
                      key={h}
                      className="absolute left-0 right-0 border-t border-[hsl(var(--border))]"
                      style={{ top: i * HOUR_PX }}
                    />
                  ))}

                  {sessions.map((s) => {
                    const top = ((minutesFromHHMM(s.startTime) - HOUR_START * 60) / 60) * HOUR_PX;
                    const height = Math.max(
                      40,
                      ((minutesFromHHMM(s.endTime) - minutesFromHHMM(s.startTime)) / 60) * HOUR_PX - 4
                    );
                    const visible = !matches || matches(s);
                    if (!visible) return null;
                    const tier = blockTier(s.athleteCount);
                    const names = (s.athletes || []).slice(0, 3).map((a) => a.shortName);
                    const extra = Math.max(0, (s.athletes || []).length - names.length);
                    return (
                      <button
                        key={s.sessionTemplateId}
                        onClick={() => onSelect(date, s)}
                        className={`absolute left-1 right-1 rounded-[8px] px-2 py-1.5 text-left overflow-hidden transition-transform hover:z-10 hover:scale-[1.02] ${TIER_CLASS[tier]} ${
                          s.status === "cancelled" || s.status === "blocked" ? "opacity-50" : ""
                        }`}
                        style={{ top: top + 2, height }}
                      >
                        <div className="text-[10px] font-orbitron font-bold leading-tight">
                          {fmtTime(s.startTime)}
                        </div>
                        <div className="text-[10px] leading-tight opacity-90">
                          {s.athleteCount} {s.athleteCount === 1 ? "athlete" : "athletes"}
                        </div>
                        {s.programs && s.programs.length > 0 && (
                          <div className="flex gap-1 mt-0.5 flex-wrap">
                            {s.programs.map((p) => (
                              <span key={p} className="text-[8px] font-orbitron font-bold px-1 rounded-[3px] bg-black/15">
                                {p}
                              </span>
                            ))}
                          </div>
                        )}
                        {names.length > 0 && (
                          <div className="text-[9px] leading-tight mt-0.5 truncate">{names.join(", ")}</div>
                        )}
                        {extra > 0 && <div className="text-[9px] leading-tight opacity-80">+{extra} more</div>}
                      </button>
                    );
                  })}

                  {/* Current time line */}
                  {isToday && (
                    <div
                      className="absolute left-0 right-0 border-t-2 border-red-500 z-20 pointer-events-none"
                      style={{ top: ((nowMin - HOUR_START * 60) / 60) * HOUR_PX }}
                    >
                      <span className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-red-500" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
