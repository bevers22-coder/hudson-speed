import React from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Search, Bell, BellOff } from "lucide-react";

const VIEWS = [
  { key: "agenda", label: "Agenda" },
  { key: "day", label: "Day" },
  { key: "month", label: "Month" },
  { key: "week", label: "Week", desktopOnly: true },
];

export default function CalendarHeader({
  view, onViewChange, anchor, onPrev, onNext, onToday, onPickDate,
  query, onQueryChange, liveSeconds, notifyCoach, onNotifyToggle, rangeLabel,
}) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <h1 className="font-orbitron text-lg sm:text-xl font-bold uppercase tracking-wide text-[hsl(var(--black))] mr-auto">
          Coach Calendar
        </h1>

        {onNotifyToggle && (
          <button
            onClick={onNotifyToggle}
            className={`inline-flex items-center gap-2 min-h-[44px] rounded-[10px] border px-3 py-2 text-xs font-orbitron uppercase tracking-wider transition-colors ${
              notifyCoach
                ? "border-[hsl(var(--navy))] bg-[hsl(var(--navy))] text-white"
                : "border-[hsl(var(--border))] text-muted-foreground"
            }`}
            title="Email me about new signups and cancellations"
          >
            {notifyCoach ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Email me about signups</span>
            <span className="sm:hidden">Emails</span>
          </button>
        )}

        <span className="inline-flex items-center gap-2 text-xs text-muted-foreground font-body">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live · {liveSeconds}s
        </span>
      </div>

      {/* Sticky control bar on phones so the view tabs and date controls are
          always reachable while scrolling a long agenda. */}
      <div className="sticky top-14 z-20 bg-white/95 backdrop-blur md:static md:bg-transparent md:backdrop-blur-none py-2 md:py-0 border-b border-[hsl(var(--border))] md:border-0 mb-3 md:mb-0">
        <div className="inline-flex w-full md:w-auto rounded-[10px] border border-[hsl(var(--border))] overflow-hidden mb-2 md:mb-0 md:mr-3">
          {VIEWS.map((v) => (
            <button
              key={v.key}
              onClick={() => onViewChange(v.key)}
              className={`flex-1 md:flex-none min-h-[48px] px-3 text-xs font-orbitron uppercase tracking-wider transition-colors ${
                v.desktopOnly ? "hidden md:block" : ""
              } ${view === v.key ? "bg-[hsl(var(--navy))] text-white" : "bg-white text-foreground"}`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 w-full md:w-auto">
          <button
            onClick={onPrev}
            className="p-3 min-h-[48px] min-w-[48px] flex items-center justify-center rounded-[10px] border border-[hsl(var(--border))]"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onToday}
            className="flex-1 md:flex-none px-4 min-h-[48px] rounded-[10px] border border-[hsl(var(--border))] font-orbitron uppercase tracking-wider text-xs"
          >
            Today
          </button>
          <button
            onClick={onNext}
            className="p-3 min-h-[48px] min-w-[48px] flex items-center justify-center rounded-[10px] border border-[hsl(var(--border))]"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <label className="inline-flex items-center gap-2 rounded-[10px] border border-[hsl(var(--border))] px-3 min-h-[48px]">
          <CalendarIcon className="w-4 h-4 text-muted-foreground" />
          <input
            type="date"
            value={anchor}
            onChange={(e) => e.target.value && onPickDate(e.target.value)}
            className="bg-transparent outline-none"
            aria-label="Jump to date"
          />
        </label>

        <div className="font-orbitron uppercase tracking-wider text-sm text-[hsl(var(--navy))]">
          {rangeLabel}
        </div>

        <div className="w-full md:w-auto md:ml-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search athlete or parent"
              className="rounded-[10px] border border-[hsl(var(--border))] pl-9 pr-3 py-2.5 min-h-[48px] w-full md:w-56 outline-none focus:border-[hsl(var(--navy))]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
