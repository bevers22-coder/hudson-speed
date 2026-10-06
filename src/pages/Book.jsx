import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import PublicLayout from "@/components/PublicLayout";
import Step2Sessions from "@/components/book/Step2Sessions";
import Step3Parent from "@/components/book/Step3Parent";
import Step4Athletes from "@/components/book/Step4Athletes";
import Step5Review from "@/components/book/Step5Review";
import BookingConfirmation from "@/components/book/BookingConfirmation";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { useLiveRefresh } from "@/hooks/useLiveRefresh";

const STEPS = ["Sessions", "Your Details", "Athletes", "Review"];

export default function Book() {
  const [step, setStep] = useState(0);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const [booking, setBooking] = useState({
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    notes: "",
    athletes: [{ name: "", age: "", grade: "", club: "" }],
    sessions: [],
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await base44.functions.invoke("getAvailability", {});
        setAvailability(res.data);

        // Pre-select a session when arriving from the Schedule page.
        // ?template=<id>  or  ?dow=<0-6>&time=HH:mm   (plus optional ?date=)
        const params = new URLSearchParams(window.location.search);
        const tpl = params.get("template");
        const dow = params.get("dow");
        const time = params.get("time");
        const dateParam = params.get("date");

        if (res.data?.days && (tpl || (dow !== null && time))) {
          const search = dateParam
            ? res.data.days.filter((d) => d.date === dateParam)
            : res.data.days;

          for (const d of search) {
            const dDate = new Date(d.date + "T12:00:00Z");
            const dDow = String(dDate.getUTCDay());
            const found = d.sessions.find((s) =>
              tpl ? s.sessionTemplateId === tpl : (String(dow) === dDow && s.startTime === time)
            );
            if (found) {
              setBooking((prev) => ({
                ...prev,
                sessions: [{
                  sessionDate: d.date,
                  sessionTemplateId: found.sessionTemplateId,
                  program: "SA",
                  startTime: found.startTime,
                  endTime: found.endTime,
                  startTimeDisplay: found.startTimeDisplay,
                  endTimeDisplay: found.endTimeDisplay,
                  dayName: d.dayName,
                }],
              }));
              break;
            }
          }
        }
      } catch (err) {
        setError("Unable to load available sessions. Please try again later.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateBooking = (updates) => setBooking((b) => ({ ...b, ...updates }));

  // Availability stays live while the parent fills the form in — a session that
  // fills up or gets cancelled is reflected without losing their progress.
  const refreshAvailability = React.useCallback(async () => {
    const res = await base44.functions.invoke("getAvailability", {});
    if (res.data) setAvailability(res.data);
  }, []);

  useLiveRefresh(refreshAvailability, { intervalMs: 30000, entity: "BookingSession" });

  const handleConfirm = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await base44.functions.invoke("createBooking", {
        parentName: booking.parentName,
        parentEmail: booking.parentEmail,
        parentPhone: booking.parentPhone,
        notes: booking.notes,
        athletes: booking.athletes.map((a) => ({
          name: a.name,
          age: a.age,
          grade: a.grade,
          club: a.club,
        })),
        sessions: booking.sessions.map((s) => ({
          sessionDate: s.sessionDate,
          sessionTemplateId: s.sessionTemplateId,
          program: s.program,
        })),
        manageUrl: `${window.location.origin}/manage`,
      });
      if (res.data.error) {
        setError(res.data.error);
      } else {
        setConfirmation(res.data.booking);
        window.scrollTo(0, 0);
      }
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || "Unable to complete your booking. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex justify-center items-center py-32">
          <div className="w-8 h-8 border-4 border-[hsl(var(--light-bg))] border-t-[hsl(var(--navy))] rounded-full animate-spin" />
        </div>
      </PublicLayout>
    );
  }

  if (confirmation) {
    return (
      <PublicLayout>
        <BookingConfirmation booking={confirmation} />
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-28 md:pb-12">
        <h1 className="font-orbitron text-2xl sm:text-3xl font-bold text-[hsl(var(--black))] uppercase tracking-wide text-center mb-8">
          Book a Session
        </h1>

        <div className="flex items-center justify-between mb-10 max-w-xl mx-auto">
          {STEPS.map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    i <= step ? "bg-[hsl(var(--navy))] text-white" : "bg-[hsl(var(--light-bg))] text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                <span className={`text-[10px] sm:text-xs mt-1.5 hidden sm:block ${i <= step ? "text-[hsl(var(--navy))] font-medium" : "text-muted-foreground"}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 sm:mx-2 ${i < step ? "bg-[hsl(var(--navy))]" : "bg-[hsl(var(--border))]"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {error && (
          <div className="flex items-start gap-2 text-destructive bg-red-50 border border-red-200 rounded-[10px] px-4 py-3 mb-6 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="card p-5 sm:p-8">
          {step === 0 && (
            <Step2Sessions
              availability={availability}
              booking={booking}
              updateBooking={(d) => { updateBooking(d); setError(null); }}
              onNext={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <Step3Parent
              booking={booking}
              updateBooking={(d) => { updateBooking(d); setError(null); }}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <Step4Athletes
              booking={booking}
              updateBooking={(d) => { updateBooking(d); setError(null); }}
              onNext={() => setStep(3)}
            />
          )}
          {step === 3 && (
            <Step5Review
              booking={booking}
              onConfirm={handleConfirm}
              submitting={submitting}
            />
          )}
        </div>

        {step > 0 && (
          <button
            onClick={() => { setStep(step - 1); setError(null); }}
            className="mt-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-[hsl(var(--navy))] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        )}
      </div>

      {/* Phone: sticky "sessions selected" bar with a big Continue button. */}
      {step === 0 && (
        <div
          className="md:hidden fixed inset-x-0 z-40 bg-white border-t border-[hsl(var(--border))] px-4 py-3 no-print"
          style={{ bottom: "calc(4.5rem + env(safe-area-inset-bottom))" }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xs font-orbitron uppercase tracking-wider text-muted-foreground flex-shrink-0">
              {booking.sessions.length} {booking.sessions.length === 1 ? "session" : "sessions"}
            </span>
            <button
              onClick={() => setStep(1)}
              disabled={booking.sessions.length === 0}
              className="btn-navy flex-1 text-sm"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
