import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, Footprints, Dumbbell, Check, ChevronDown, ArrowRight, Clock, MapPin } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import Reveal from "@/components/Reveal";
import { LOCATION_LINE } from "@/lib/schedule";

const CARDS = [
  {
    id: "speed",
    icon: Zap,
    title: "Speed & Agility",
    blurb: "Faster first steps, better balance, and cleaner change of direction.",
    detail:
      "Speed & Agility is ONE 45-minute session. It targets the mechanics behind a faster first step and cleaner acceleration, plus the balance and coordination needed to change direction under control. Athletes of any age train together in the same group format while working on their own mechanics.",
  },
  {
    id: "strength",
    icon: Dumbbell,
    title: "Strength",
    blurb: "Foundational strength — on its own, or added right after Speed & Agility.",
    detail:
      "Strength is a SEPARATE 45-minute session. Book it by itself as a strength-only class, or add it right after a Speed & Agility session — the two run back-to-back for a 90-minute block. Strength builds the foundation that makes speed and agility last, scaled for every age.",
  },
  {
    id: "how",
    icon: Clock,
    title: "How Booking Works",
    blurb: "Pick your sessions, pick the program, add them to one signup.",
    detail:
      "In the booking flow each session has a program choice: Speed & Agility (45 min), Speed & Agility + Strength (90 min, two back-to-back slots), or Strength only (45 min). You can add as many sessions as you like across different days in a single signup — one confirmation code covers everything, and every athlete you add attends all of the sessions.",
  },
];

const BRING = ["Athletic clothing", "Court shoes", "Water bottle"];

export default function Program() {
  const [expanded, setExpanded] = useState(null);

  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <nav className="text-xs text-muted-foreground font-body mb-6" aria-label="Breadcrumb">
          <a href="/" className="hover:text-[hsl(var(--navy))]">Home</a>
          <span className="mx-2">/</span>
          <span className="text-foreground">Program</span>
        </nav>

        <div className="max-w-3xl mb-12">
          <h1 className="font-orbitron font-bold text-2xl sm:text-4xl uppercase tracking-wide text-[hsl(var(--black))]">
            The Program
          </h1>
          <p className="text-muted-foreground mt-4 font-body leading-relaxed">
            Designed to improve first-step quickness, balance, coordination, and overall athletic performance — for
            athletes of any age. Speed &amp; Agility is one 45-minute session. Strength is a separate 45-minute session
            that can be added right after Speed &amp; Agility (90 minutes total) or booked by itself. Sessions are led by
            Coach Jimmy Carter.
          </p>
          <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground font-body">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-[hsl(var(--navy))]" />
            <span>{LOCATION_LINE}</span>
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-14">
          {CARDS.map((card, i) => {
            const isOpen = expanded === card.id;
            return (
              <Reveal key={card.id} delay={i * 110}>
                <div
                  className={`card p-6 h-full flex flex-col transition-all duration-300 ${
                    isOpen ? "border-[hsl(var(--navy))] shadow-lg" : "hover:-translate-y-1 hover:shadow-lg"
                  }`}
                >
                  <card.icon className="w-9 h-9 text-[hsl(var(--navy))] mb-4" />
                  <h2 className="font-orbitron font-bold uppercase tracking-wide text-lg text-[hsl(var(--black))]">
                    {card.title}
                  </h2>
                  <p className="text-sm text-muted-foreground font-body mt-2">{card.blurb}</p>
                  <button
                    onClick={() => setExpanded(isOpen ? null : card.id)}
                    aria-expanded={isOpen}
                    className="mt-5 inline-flex items-center gap-1 font-orbitron uppercase tracking-wider text-[11px] text-[hsl(var(--navy))]"
                  >
                    {isOpen ? "Show less" : "Full breakdown"}
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <p className="text-sm text-muted-foreground font-body mt-4 pt-4 border-t border-[hsl(var(--border))] leading-relaxed">
                      {card.detail}
                    </p>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        <div className="card p-7 sm:p-9">
          <h2 className="font-orbitron font-bold uppercase tracking-wide text-lg text-[hsl(var(--black))] mb-5">
            What to Bring
          </h2>
          <ul className="grid gap-3 sm:grid-cols-3">
            {BRING.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm font-body">
                <span className="w-6 h-6 rounded-full bg-[hsl(var(--navy))] text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link to="/book" className="btn-navy">
              Book a Session <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/schedule" className="btn-outline">
              View Schedule
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
