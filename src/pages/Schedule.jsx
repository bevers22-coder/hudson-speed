import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import PublicLayout from "@/components/PublicLayout";
import { usePublicData } from "@/components/PublicDataProvider";
import WeeklyGrid from "@/components/schedule/WeeklyGrid";
import MobileDayList from "@/components/schedule/MobileDayList";
import SessionPanel from "@/components/schedule/SessionPanel";
import { AlertCircle, MapPin } from "lucide-react";
import { LOCATION_LINE, TOTAL_WEEKLY_SESSIONS } from "@/lib/schedule";
import { useLiveRefresh } from "@/hooks/useLiveRefresh";

export default function Schedule() {
  const { data } = usePublicData();
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [activeDay, setActiveDay] = useState(null);

  useEffect(() => {
    const dayParam = new URLSearchParams(window.location.search).get("day");
    if (dayParam !== null && dayParam !== "") setActiveDay(Number(dayParam));
  }, []);

  const loadAvailability = React.useCallback(async () => {
    try {
      const res = await base44.functions.invoke("getAvailability", {});
      setAvailability(res.data);
      setError(null);
    } catch (err) {
      setError("Live availability is unavailable right now. Times below are still correct.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAvailability(); }, [loadAvailability]);

  // Another family booking a session updates these counts on their own.
  useLiveRefresh(loadAvailability, { intervalMs: 30000, entity: "BookingSession" });

  const schedule = data?.schedule || [];
  const totalSessions = schedule.reduce((sum, d) => sum + d.sessions.length, 0) || TOTAL_WEEKLY_SESSIONS;
  const enforce = !!availability?.settings?.enforceCapacityLimit;

  const upcomingFor = (templateId) => {
    const days = availability?.days || [];
    const out = [];
    for (const d of days) {
      const s = d.sessions.find((x) => x.sessionTemplateId === templateId);
      if (s) out.push({ date: d.date, ...s });
    }
    return out;
  };

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <nav className="text-xs text-muted-foreground font-body mb-6" aria-label="Breadcrumb">
          <a href="/" className="hover:text-[hsl(var(--navy))]">Home</a>
          <span className="mx-2">/</span>
          <span className="text-foreground">Schedule</span>
        </nav>

        <div className="mb-10">
          <h1 className="font-orbitron font-bold text-2xl sm:text-4xl uppercase tracking-wide text-[hsl(var(--black))]">
            Weekly Schedule
          </h1>
          <p className="text-muted-foreground mt-3 font-body max-w-3xl">
            {totalSessions} sessions each week, Monday through Saturday. Speed &amp; Agility is one 45-minute session.
            Strength is a separate 45-minute session that can be added right after Speed &amp; Agility (90 minutes total)
            or booked on its own. Tap any time to see upcoming dates.
          </p>
          <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground font-body">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-[hsl(var(--navy))]" />
            <span>{LOCATION_LINE}</span>
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2 text-destructive bg-red-50 border border-red-200 rounded-[10px] px-4 py-3 mb-6 text-sm font-body">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="card p-4 h-56 animate-pulse bg-[hsl(var(--light-bg))]" />
            ))}
          </div>
        ) : (
          <>
            {/* Phones get a vertical day-by-day list; the grid is for larger screens. */}
            <div className="md:hidden">
              <MobileDayList
                schedule={schedule}
                availability={availability}
                enforce={enforce}
                onSelect={(session, day) => setSelected({ session, day })}
              />
            </div>
            <div className="hidden md:block">
              <WeeklyGrid
                schedule={schedule}
                availability={availability}
                enforce={enforce}
                activeDay={activeDay}
                onDayChange={setActiveDay}
                onSelect={(session, day) => setSelected({ session, day })}
              />
            </div>
          </>
        )}
      </div>

      <SessionPanel
        session={selected?.session}
        day={selected?.day}
        upcoming={selected?.session?.sessionTemplateId ? upcomingFor(selected.session.sessionTemplateId) : []}
        enforce={enforce}
        onClose={() => setSelected(null)}
      />
    </PublicLayout>
  );
}
