import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, AlertCircle, Calendar, Clock, Users, X, CheckCircle, MapPin } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import RescheduleModal from "@/components/manage/RescheduleModal";
import { base44 } from "@/api/base44Client";
import { programLong, LOCATION_LINE } from "@/lib/schedule";

const MAX_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 10 * 60 * 1000;

export default function Manage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null); // { mode: 'one'|'all', session }
  const [cancelling, setCancelling] = useState(false);
  const [outcome, setOutcome] = useState(null);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [rescheduled, setRescheduled] = useState(null);

  const [attempts, setAttempts] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("hss_lookup_attempts") || "[]");
      return stored.filter((t) => Date.now() - t < ATTEMPT_WINDOW_MS);
    } catch { return []; }
  });

  const recordFailedAttempt = () => {
    const now = Date.now();
    const updated = [...attempts.filter((t) => now - t < ATTEMPT_WINDOW_MS), now];
    setAttempts(updated);
    localStorage.setItem("hss_lookup_attempts", JSON.stringify(updated));
  };

  const isRateLimited = attempts.length >= MAX_ATTEMPTS;

  const handleLookup = async (e) => {
    e.preventDefault();
    if (isRateLimited) {
      setError("Too many attempts. Please try again later.");
      return;
    }
    setLoading(true);
    setError(null);
    setBooking(null);
    setOutcome(null);
    try {
      const res = await base44.functions.invoke("lookupBooking", {
        email: email.trim().toLowerCase(),
        confirmationCode: code.trim().toUpperCase(),
      });
      if (res.data.error) {
        setError(res.data.error);
        recordFailedAttempt();
      } else {
        setBooking(res.data.booking);
      }
    } catch (err) {
      setError(err?.response?.data?.error || "No booking found. Please check your details.");
      recordFailedAttempt();
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirmTarget) return;
    setCancelling(true);
    try {
      const payload = {
        email: email.trim().toLowerCase(),
        confirmationCode: code.trim().toUpperCase(),
        cancelledBy: "parent",
        manageUrl: `${window.location.origin}/book`,
      };
      if (confirmTarget.mode === "all") {
        payload.cancelAll = true;
      } else {
        payload.sessionDate = confirmTarget.session.sessionDate;
        payload.sessionTemplateId = confirmTarget.session.sessionTemplateId;
      }
      const res = await base44.functions.invoke("cancelBooking", payload);
      if (res.data.error) {
        setError(res.data.error);
      } else {
        setOutcome(res.data);
        await refresh();
      }
    } catch (err) {
      setError(err?.response?.data?.error || "Unable to cancel. Please try again.");
    } finally {
      setCancelling(false);
      setConfirmTarget(null);
    }
  };

  const refresh = async () => {
    try {
      const res = await base44.functions.invoke("lookupBooking", {
        email: email.trim().toLowerCase(),
        confirmationCode: code.trim().toUpperCase(),
      });
      if (!res.data.error) setBooking(res.data.booking);
    } catch (err) {
      // keep current view
    }
  };

  const confirmedSessions = booking?.sessions?.filter((s) => s.status === "confirmed") || [];

  return (
    <PublicLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h1 className="font-orbitron text-2xl sm:text-3xl font-bold text-[hsl(var(--black))] uppercase tracking-wide text-center mb-2">
          Manage My Booking
        </h1>
        <p className="text-center text-muted-foreground mb-8 text-sm font-body">
          Enter your email and confirmation code to view or cancel your sessions.
        </p>

        {error && (
          <div className="flex items-start gap-2 text-destructive bg-red-50 border border-red-200 rounded-[10px] px-4 py-3 mb-6 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {!booking && (
          <form onSubmit={handleLookup} className="card p-6 sm:p-8 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="jane@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="code" className="block text-sm font-medium mb-1.5">Confirmation Code</label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="input-field uppercase tracking-widest"
                placeholder="ABC123"
                maxLength={6}
                required
              />
            </div>

            <button type="submit" disabled={loading || isRateLimited} className="btn-navy w-full">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Find My Booking <Search className="w-4 h-4" /></>
              )}
            </button>
          </form>
        )}

        {outcome && (
          <div className="card p-6 sm:p-8 text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="font-orbitron text-xl font-bold text-[hsl(var(--black))] uppercase tracking-wide mb-2">
              {outcome.allCancelled ? "Booking Cancelled" : "Session Cancelled"}
            </h2>
            <p className="text-muted-foreground text-sm mb-4 font-body">
              {outcome.allCancelled
                ? "Your entire signup has been cancelled. A confirmation email has been sent."
                : "That session has been cancelled. Your other sessions are still booked."}
            </p>
            <p className="text-sm text-muted-foreground mb-6 bg-amber-50 border border-amber-200 rounded-[10px] px-4 py-3 font-body">
              Reschedules less than 72 hours before a session incur a $50 fee. Cancellations within 72 hours may be made up
              by joining one of our group training sessions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => { setOutcome(null); setBooking(null); }} className="btn-outline">
                Look Up Another
              </button>
              <Link to="/book" className="btn-navy">Book a New Session</Link>
            </div>
          </div>
        )}

        {booking && !outcome && booking.sessions && (
          <div className="card p-6 sm:p-8">
            {rescheduled && (
              <div className="flex items-start gap-2 bg-green-50 border border-green-200 text-green-800 rounded-[10px] px-4 py-3 mb-6 text-sm font-body">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>
                  Session moved to{" "}
                  <strong>
                    {new Date(rescheduled.to.sessionDate + "T12:00:00Z").toLocaleDateString("en-US", {
                      weekday: "long", month: "long", day: "numeric", timeZone: "UTC",
                    })}
                  </strong>
                  . A confirmation email has been sent.
                </span>
              </div>
            )}
            <div className="text-center mb-6 pb-6 border-b border-[hsl(var(--border))]">
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Confirmation Code</div>
              <div className="font-orbitron text-2xl font-bold text-[hsl(var(--navy))] tracking-[0.15em]">
                {booking.confirmationCode}
              </div>
            </div>

            <div className="mb-6">
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
                Sessions ({booking.sessions.length})
              </div>
              <ul className="space-y-3">
                {booking.sessions.map((s, i) => (
                  <li
                    key={`${s.sessionDate}-${s.sessionTemplateId}-${i}`}
                    className={`border rounded-[10px] p-4 ${s.status === "cancelled" ? "border-[hsl(var(--border))] bg-[hsl(var(--light-bg))]" : "border-[hsl(var(--border))]"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-sm">
                          {new Date(s.sessionDate + "T12:00:00Z").toLocaleDateString("en-US", {
                            weekday: "long", month: "long", day: "numeric", timeZone: "UTC",
                          })}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {s.startTimeDisplay} – {s.endTimeDisplay}
                        </div>
                        <div className="text-xs font-orbitron uppercase tracking-wider text-[hsl(var(--navy))] mt-1">
                          {programLong(s.program)}
                        </div>
                        {s.status === "cancelled" && (
                          <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">Cancelled</div>
                        )}
                      </div>
                      {s.status === "confirmed" && (
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <button
                            onClick={() => { setRescheduled(null); setRescheduleTarget(s); }}
                            className="text-xs font-orbitron uppercase tracking-wider text-[hsl(var(--navy))] border-2 border-[hsl(var(--navy))] rounded-[10px] px-3 py-2 hover:bg-[hsl(var(--navy))] hover:text-white transition-colors"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => setConfirmTarget({ mode: "one", session: s })}
                            className="text-xs font-orbitron uppercase tracking-wider text-destructive border-2 border-destructive rounded-[10px] px-3 py-2 hover:bg-destructive hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-start gap-3 mb-6">
              <MapPin className="w-5 h-5 text-[hsl(var(--navy))] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground">Location</div>
                <div className="font-semibold text-sm">{LOCATION_LINE}</div>
              </div>
            </div>

            <div className="space-y-4 mb-6 pt-6 border-t border-[hsl(var(--border))]">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[hsl(var(--navy))] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-muted-foreground">Parent / Guardian</div>
                  <div className="font-semibold text-sm">{booking.parentName}</div>
                  <div className="text-xs text-muted-foreground">{booking.parentEmail} · {booking.parentPhone}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-[hsl(var(--navy))] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-muted-foreground">Athletes</div>
                  <ul className="text-sm">
                    {booking.athletes.map((a, i) => (
                      <li key={i}>
                        <strong>{a.name}</strong>
                        {a.age ? ` — age ${a.age}` : ""}
                        {a.grade ? `, ${a.grade}` : ""}
                        {a.program ? ` · ${a.program}` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {booking.notes && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Notes:</span> {booking.notes}
                </div>
              )}
            </div>

            {confirmedSessions.length > 0 && (
              <button
                onClick={() => setConfirmTarget({ mode: "all" })}
                className="w-full border-2 border-destructive text-destructive rounded-[10px] py-3 font-orbitron uppercase tracking-wider text-sm hover:bg-destructive hover:text-white transition-colors min-h-[48px]"
              >
                Cancel Entire Signup
              </button>
            )}
          </div>
        )}

        {rescheduleTarget && (
          <RescheduleModal
            booking={booking}
            session={rescheduleTarget}
            onClose={() => setRescheduleTarget(null)}
            onDone={(result) => {
              setRescheduleTarget(null);
              setRescheduled(result);
              refresh();
            }}
          />
        )}

        {confirmTarget && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setConfirmTarget(null)}>
            <div className="bg-white rounded-[12px] p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-orbitron text-lg font-bold uppercase tracking-wide">
                  {confirmTarget.mode === "all" ? "Cancel Entire Signup?" : "Cancel This Session?"}
                </h3>
                <button onClick={() => setConfirmTarget(null)} aria-label="Close"><X className="w-5 h-5" /></button>
              </div>
              <p className="text-sm text-muted-foreground mb-4 font-body">
                {confirmTarget.mode === "all"
                  ? `This cancels all ${confirmedSessions.length} sessions in this signup.`
                  : `${new Date(confirmTarget.session.sessionDate + "T12:00:00Z").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" })} at ${confirmTarget.session.startTimeDisplay}. Your other sessions stay booked.`}
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-[10px] px-4 py-3 text-sm mb-6 font-body">
                Reschedules less than 72 hours before a session incur a $50 fee. Cancellations within 72 hours may be made
                up by joining one of our group training sessions.
              </div>
              <div className="flex gap-3">
                <button onClick={() => setConfirmTarget(null)} className="btn-outline flex-1">Keep Booking</button>
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="btn-navy flex-1 bg-destructive hover:bg-destructive/90"
                >
                  {cancelling ? "Cancelling..." : "Yes, Cancel"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
