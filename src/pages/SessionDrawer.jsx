import React, { useEffect, useState } from "react";
import { X, Printer, Copy, Check, Phone, Mail, UserPlus } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { fmtDateLong, fmtTime } from "@/lib/calendar";

export default function SessionDrawer({ date, session, onClose, onChanged }) {
  const [copied, setCopied] = useState(false);
  const [adding, setAdding] = useState(false);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const open = !!session;

  const handleCheckIn = async (athlete) => {
    setBusyId(athlete.id);
    try {
      await base44.functions.invoke("adminCheckIn", { athleteId: athlete.id, checkedIn: !athlete.checkedIn });
      onChanged?.();
    } catch (e) {
      // leave the toggle as-is
    } finally {
      setBusyId(null);
    }
  };

  const rosterText = () => {
    if (!session) return "";
    const lines = [`${fmtDateLong(date)} — ${fmtTime(session.startTime)} to ${fmtTime(session.endTime)}`];
    for (const a of session.athletes) {
      const bits = [a.name];
      if (a.age) bits.push(`age ${a.age}`);
      if (a.grade) bits.push(a.grade);
      bits.push(a.program);
      lines.push(`  ${bits.join(" · ")} — ${a.checkedIn ? "checked in" : "not checked in"}`);
    }
    return lines.join("\n");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rosterText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // clipboard unavailable
    }
  };

  const handlePrint = () => {
    if (!session) return;
    const rows = session.athletes.map((a) => `
      <tr>
        <td>${escapeHtml(a.name)}</td>
        <td>${a.age ?? ""}</td>
        <td>${escapeHtml(a.grade || "")}</td>
        <td>${escapeHtml(a.program)}</td>
        <td>${escapeHtml(a.parentName || "")}</td>
        <td>${escapeHtml(a.parentPhone || "")}</td>
        <td>${a.checkedIn ? "&#10003;" : ""}</td>
      </tr>`).join("");
    const html = `<!DOCTYPE html><html><head><title>Roster</title>
      <style>
        body{font-family:Arial,sans-serif;padding:24px;color:#111;}
        h1{font-size:18px;margin:0 0 4px;}
        p{margin:0 0 16px;color:#555;font-size:13px;}
        table{border-collapse:collapse;width:100%;font-size:13px;}
        th,td{border:1px solid #ccc;padding:6px 8px;text-align:left;}
        th{background:#0B1F3F;color:#fff;}
      </style></head><body>
      <h1>Hudson Speed and Strength — Roster</h1>
      <p>${fmtDateLong(date)} · ${fmtTime(session.startTime)} – ${fmtTime(session.endTime)}</p>
      <table><thead><tr>
        <th>Athlete</th><th>Age</th><th>Grade</th><th>Program</th><th>Parent</th><th>Phone</th><th>In</th>
      </tr></thead><tbody>${rows}</tbody></table>
      </body></html>`;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  };

  return (
    <div className={`fixed inset-0 z-[80] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`absolute top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {session && (
          <>
            <div className="flex items-start justify-between px-6 py-5 border-b border-[hsl(var(--border))]">
              <div>
                <div className="font-orbitron uppercase tracking-wider text-xs text-muted-foreground">
                  {fmtDateLong(date)}
                </div>
                <h2 className="font-orbitron font-bold text-lg text-[hsl(var(--black))] mt-1">
                  {fmtTime(session.startTime)} – {fmtTime(session.endTime)}
                </h2>
                <p className="text-xs text-muted-foreground font-body mt-1">
                  {session.athleteCount} {session.athleteCount === 1 ? "athlete" : "athletes"} signed up
                </p>
              </div>
              <button onClick={onClose} aria-label="Close" className="p-2 -mr-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 border-b border-[hsl(var(--border))] flex flex-wrap gap-2">
              <button onClick={handlePrint} className="btn-outline text-[11px] px-3 py-2 min-h-0">
                <Printer className="w-3.5 h-3.5" /> Print roster
              </button>
              <button onClick={handleCopy} className="btn-outline text-[11px] px-3 py-2 min-h-0">
                {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy roster</>}
              </button>
              <button onClick={() => setAdding((v) => !v)} className="btn-navy text-[11px] px-3 py-2 min-h-0">
                <UserPlus className="w-3.5 h-3.5" /> Add booking
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {adding && (
                <AddBookingForm
                  date={date}
                  session={session}
                  onDone={() => { setAdding(false); onChanged?.(); }}
                />
              )}

              {session.athletes.length === 0 ? (
                <p className="text-sm text-muted-foreground font-body py-6 text-center">
                  No athletes signed up yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {session.athletes.map((a) => (
                    <div key={a.id} className="border border-[hsl(var(--border))] rounded-[10px] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold text-sm">{a.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {a.age ? `Age ${a.age}` : "Age not given"}
                            {a.grade ? ` · ${a.grade}` : ""}
                            {a.club ? ` · ${a.club}` : ""}
                          </div>
                          <div className="mt-1">
                            <span className="text-[10px] font-orbitron font-bold px-1.5 py-0.5 rounded-[4px] bg-[hsl(var(--navy))] text-white">
                              {a.program}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCheckIn(a)}
                          disabled={busyId === a.id}
                          className={`flex-shrink-0 text-[10px] font-orbitron uppercase tracking-wider rounded-[8px] px-3 py-2 border transition-colors ${
                            a.checkedIn
                              ? "bg-green-600 border-green-600 text-white"
                              : "border-[hsl(var(--border))] text-muted-foreground"
                          }`}
                        >
                          {a.checkedIn ? "Checked in" : "Check in"}
                        </button>
                      </div>

                      <div className="mt-3 pt-3 border-t border-[hsl(var(--border))] space-y-1.5">
                        {a.parentName && (
                          <div className="text-xs text-muted-foreground">{a.parentName}</div>
                        )}
                        <div className="flex flex-wrap gap-3 text-xs">
                          {a.parentPhone && (
                            <a href={`tel:${a.parentPhone.replace(/\D/g, "")}`} className="inline-flex items-center gap-1 text-[hsl(var(--navy))] hover:underline">
                              <Phone className="w-3 h-3" /> {a.parentPhone}
                            </a>
                          )}
                          {a.parentEmail && (
                            <a href={`mailto:${a.parentEmail}`} className="inline-flex items-center gap-1 text-[hsl(var(--navy))] hover:underline">
                              <Mail className="w-3 h-3" /> {a.parentEmail}
                            </a>
                          )}
                        </div>
                        {a.notes && (
                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium">Notes:</span> {a.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function AddBookingForm({ date, session, onDone }) {
  const [form, setForm] = useState({
    parentName: "", parentEmail: "", parentPhone: "", notes: "",
    athletes: [{ name: "", age: "", grade: "", club: "" }],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await base44.functions.invoke("adminCreateBooking", {
        sessionDate: date,
        sessionTemplateId: session.sessionTemplateId,
        parentName: form.parentName,
        parentEmail: form.parentEmail,
        parentPhone: form.parentPhone,
        notes: form.notes,
        athletes: form.athletes,
        allowOverCapacity: true,
        manageUrl: `${window.location.origin}/manage`,
      });
      if (res.data.error) setError(res.data.error);
      else onDone();
    } catch (err) {
      setError(err?.response?.data?.error || "Unable to add the booking.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-[hsl(var(--navy))] rounded-[10px] p-4 mb-5">
      <h3 className="font-orbitron uppercase tracking-wider text-xs text-[hsl(var(--navy))] mb-3">
        Add booking manually
      </h3>
      <div className="space-y-3">
        <input placeholder="Parent name" value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} className="input-field text-sm" />
        <input placeholder="Parent email" type="email" value={form.parentEmail} onChange={(e) => setForm({ ...form, parentEmail: e.target.value })} className="input-field text-sm" />
        <input placeholder="Parent phone" value={form.parentPhone} onChange={(e) => setForm({ ...form, parentPhone: e.target.value })} className="input-field text-sm" />
        <input placeholder="Notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field text-sm" />
        {form.athletes.map((a, i) => (
          <div key={i} className="grid grid-cols-2 gap-2">
            <input placeholder="Athlete name" value={a.name} onChange={(e) => { const at = [...form.athletes]; at[i] = { ...at[i], name: e.target.value }; setForm({ ...form, athletes: at }); }} className="input-field text-sm" />
            <input placeholder="Age (optional)" value={a.age} onChange={(e) => { const at = [...form.athletes]; at[i] = { ...at[i], age: e.target.value }; setForm({ ...form, athletes: at }); }} className="input-field text-sm" />
            <input placeholder="Grade (optional)" value={a.grade} onChange={(e) => { const at = [...form.athletes]; at[i] = { ...at[i], grade: e.target.value }; setForm({ ...form, athletes: at }); }} className="input-field text-sm" />
            <input placeholder="Club (optional)" value={a.club} onChange={(e) => { const at = [...form.athletes]; at[i] = { ...at[i], club: e.target.value }; setForm({ ...form, athletes: at }); }} className="input-field text-sm" />
          </div>
        ))}
        <button
          onClick={() => setForm({ ...form, athletes: [...form.athletes, { name: "", age: "", grade: "", club: "" }] })}
          className="text-xs text-[hsl(var(--navy))] font-medium"
        >
          + Add athlete
        </button>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <div className="flex gap-2">
          <button onClick={save} disabled={saving} className="btn-navy text-xs flex-1">
            {saving ? "Saving..." : "Create booking"}
          </button>
        </div>
      </div>
    </div>
  );
}

function escapeHtml(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
