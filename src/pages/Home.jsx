import React from "react";
import { Link } from "react-router-dom";
import { Clock, AlertCircle, Calendar, ArrowRight, MapPin, Users } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import { usePublicData } from "@/components/PublicDataProvider";
import Hero from "@/components/home/Hero";
import StatsStrip from "@/components/home/StatsStrip";
import HowItWorks from "@/components/home/HowItWorks";
import ThisWeek from "@/components/home/ThisWeek";
import CoachTeaser from "@/components/home/CoachTeaser";
import Reveal from "@/components/Reveal";
import { LOCATION_LINE } from "@/lib/schedule";

const POLICIES = [
  { icon: Clock, title: "Session Length", text: "Each session is 45 minutes of focused training." },
  {
    icon: AlertCircle,
    title: "Reschedule Fee",
    text: "Reschedules less than 72 hours before a session incur a $50 rescheduling fee.",
  },
  {
    icon: Calendar,
    title: "Cancellations",
    text: "Cancellations within 72 hours may be made up by joining one of the group training sessions.",
  },
  {
    icon: Users,
    title: "All Ages Welcome",
    text: "Athletes of any age can train. Age is optional when you book.",
  },
];

export default function Home() {
  const { data } = usePublicData();
  const address = data?.contact?.address || "31W290 Schoger Dr, Naperville IL 60564";

  return (
    <PublicLayout>
      <Hero images={data?.images?.hero} />

      <StatsStrip />
      <HowItWorks />
      <ThisWeek />
      <CoachTeaser />

      {/* Policies */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="rule-energy mx-auto mb-4" />
            <h2 className="font-orbitron font-bold text-2xl sm:text-3xl uppercase tracking-wide text-[hsl(var(--black))]">
              Good to Know
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {POLICIES.map((item, i) => (
              <Reveal key={item.title} delay={i * 100}>
                <div className="card p-6 h-full transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <item.icon className="w-8 h-8 text-[hsl(var(--energy))] mb-3" />
                  <h3 className="font-orbitron uppercase tracking-wide text-xs font-bold text-[hsl(var(--black))] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-body">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="section-light py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MapPin className="w-10 h-10 text-[hsl(var(--navy))] mx-auto mb-4" />
          <h2 className="font-orbitron font-bold text-xl uppercase tracking-wide text-[hsl(var(--black))] mb-2">
            Hudson SportsPlex
          </h2>
          <p className="text-muted-foreground font-body mb-5">{LOCATION_LINE}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Get Directions
            </a>
            <Link to="/location" className="btn-navy">
              Location &amp; Contact
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[hsl(var(--navy))] text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-orbitron font-bold text-2xl sm:text-4xl uppercase tracking-wide mb-4">
            Ready to build your next gear?
          </h2>
          <p className="font-body text-gray-200 mb-8 max-w-2xl mx-auto">
            Pick a day, add your athlete, and show up ready to train. No account needed — and no limit on how many athletes
            can join a session.
          </p>
          <Link to="/book" className="btn-energy">
            Book a Session <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
