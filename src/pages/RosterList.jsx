import React from "react";
import { Users, Check } from "lucide-react";
import { fmtDateLong, fmtTime } from "@/lib/calendar";

// Full rosters — used by the Day view and the Agenda view.
export default function RosterList({ days, onSelect, matches, emptyLabel }) {
  const visibleDays = (days || [])
    .map((d) => ({ ...d, sessions: (d.sessions || []).filter((s) => !matches || matches(s)) }))
    .filter((d) => d.sessions.length > 0);

  if (visibleDays.length === 0) {
    return (
      <div className="card p-8 text-center text-muted-foreground font-body text-sm">
        {emptyLabel || "Nothing scheduled in this range."}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {visibleDays.map((day) => (
        <div key={day.date} className="card p-5">
          <h2 className="font-orbitron text-sm font-bold uppercase tracking-wide text-[hsl(var(--navy))] mb-4">
            {fmtDateLong(day.date)}
          </h2>
          <div className="space-y-4">
            {day.sessions.map((s) => (
              <div key={s.sessionTemplateId} className="border border-[hsl(var(--border))] rounded-[10px] p-4">
                <button
                  onClick={() => onSelect(day.date, s)}
                  className="flex items-center justify-between w-full text-left mb-3"
                >
                  <span className="font-orbitron text-sm font-bold text-[hsl(var(--black))]">
                    {fmtTime(s.startTime)} – {fmtTime(s.endTime)}
                  </span>
                  <span className="flex items-center gap-2">
                    {s.programs?.map((p) => (
                      <span key={p} className="text-[10px] font-orbitron font-bold px-1.5 py-0.5 rounded-[4px] bg-[hsl(var(--navy))] text-white">
                        {p}
                      </span>
                    ))}
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {s.athleteCount}
                    </span>
                  </span>
                </button>

                {s.athletes.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-muted-foreground border-b border-[hsl(var(--border))]">
                          <th className="py-2 pr-3">Athlete</th>
                          <th className="py-2 pr-3">Age</th>
                          <th className="py-2 pr-3">Grade</th>
                          <th className="py-2 pr-3">Program</th>
                          <th className="py-2 pr-3">Parent</th>
                          <th className="py-2 pr-3">Checked in</th>
                        </tr>
                      </thead>
                      <tbody>
                        {s.athletes.map((a) => (
                          <tr key={a.id} className="border-b border-[hsl(var(--border))] last:border-0">
                            <td className="py-2 pr-3 font-medium">
                              {a.name}
                              {a.club ? <div className="text-xs text-muted-foreground">{a.club}</div> : null}
                            </td>
                            <td className="py-2 pr-3">{a.age ?? "—"}</td>
                            <td className="py-2 pr-3">{a.grade || "—"}</td>
                            <td className="py-2 pr-3">{a.program}</td>
                            <td className="py-2 pr-3">
                              {a.parentName ? (
                                <>
                                  <div>{a.parentName}</div>
                                  <div className="text-xs text-muted-foreground">{a.parentPhone}</div>
                                </>
                              ) : "—"}
                            </td>
                            <td className="py-2 pr-3">
                              {a.checkedIn ? (
                                <span className="inline-flex items-center gap-1 text-green-600 text-xs">
                                  <Check className="w-3 h-3" /> Yes
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground">No</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground font-body">No athletes signed up yet.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
