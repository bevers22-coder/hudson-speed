import React from "react";
import { Link } from "react-router-dom";
import { Award, GraduationCap, Check, ArrowRight, BookOpen, Zap, Briefcase } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import { usePublicData } from "@/components/PublicDataProvider";
import CoachPhoto from "@/components/CoachPhoto";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";

const TRAINED = ["Thousands of Division I athletes", "100+ professional athletes", "60+ NFL alumni"];

const BOOM_STATS = [
  { value: 500, suffix: "+", label: "D1 Alumni" },
  { value: 60, suffix: "+", label: "NFL Alumni" },
  { value: 17, suffix: "", label: "National Championships" },
  { value: 108, suffix: "", label: "Total Championships" },
];

const CERTS = [
  "NASM Personal Trainer",
  "NASM Corrective Exercise Specialist",
  "NASM Performance Enhancement Specialist",
  "NASE Speed & Explosion Specialist",
  "TPI Level 1 Golf Performance Specialist",
  "Certified Trauma-Informed Coach",
];

const CULTURE = ["Data drives decisions.", "Accountability is non-negotiable.", "Your results are the only scoreboard that counts."];

// What Jimmy actually coaches, session after session.
const SPEED_WORK = [
  {
    title: "Linear Speed Mechanics",
    text: "Acceleration, first-step quickness and top-end velocity — taught as technique, not just effort.",
  },
  {
    title: "Change of Direction",
    text: "Deceleration, cutting and re-acceleration without losing balance, posture or speed.",
  },
  {
    title: "Power & Explosiveness",
    text: "Plyometrics, medicine-ball work and Olympic-style lifts that turn strength into on-field speed.",
  },
  {
    title: "Strength Foundations",
    text: "Age-appropriate loading that builds force while protecting growing joints and connective tissue.",
  },
  {
    title: "Movement Quality",
    text: "Ankle, hip and core stability screened and trained every session to keep athletes healthy.",
  },
  {
    title: "Speed Endurance",
    text: "Repeat-sprint conditioning so the last rep of the game looks like the first one.",
  },
];

// Career timeline.
const EXPERIENCE = [
  {
    period: "2013 — Present",
    role: "Director of Sports Performance & Wellness",
    place: "Hudson SportsPlex · Naperville, IL",
    text: "Designs and personally leads the speed, agility and strength programming on the turf — from first-time 5-year-olds taking their first athletic steps to NFL-bound athletes chasing a combine number.",
  },
  {
    period: "Founding Member",
    role: "Midwest Boom 7v7 Football Club",
    place: "National 7v7 program",
    text: "Helped build the #1 7v7 organization in the country, and built the speed and movement curriculum behind 500+ Division I athletes, 100+ professionals and 60+ NFL alumni.",
  },
  {
    period: "Playing Career",
    role: "Division I Football",
    place: "University of Illinois",
    text: "Competed at the Division I level, then posted a 9.4/10 at the NFL Elite Regional Combine — one of the top overall scores — so every method he teaches has been tested on his own body first.",
  },
  {
    period: "Education",
    role: "M.S. Exercise Science",
    place: "California University of Pennsylvania",
    text: "Sports Performance & Injury Prevention, with a B.A. in Psychology from the University of Illinois at Urbana-Champaign — the combination behind his sports-science-meets-mindset approach.",
  },
];

export default function Coach() {
  const { data } = usePublicData();
  const photo = data?.images?.coach;

  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <nav className="text-xs text-muted-foreground font-body mb-6" aria-label="Breadcrumb">
          <a href="/" className="hover:text-[hsl(var(--navy))]">Home</a>
          <span className="mx-2">/</span>
          <span className="text-foreground">Coach</span>
        </nav>

        <div className="grid gap-8 md:gap-10 md:grid-cols-[minmax(0,420px)_1fr] md:items-start mb-16">
          <Reveal>
            <CoachPhoto src={photo} className="mx-auto md:mx-0" />
          </Reveal>
          <Reveal delay={120}>
            <div>
              <p className="font-orbitron uppercase tracking-wider text-xs text-[hsl(var(--navy))] mb-3">
                Director of Sports Performance &amp; Wellness
              </p>
              <h1 className="font-orbitron font-bold text-3xl sm:text-5xl uppercase tracking-wide text-[hsl(var(--black))] mb-6">
                Jimmy Carter
              </h1>
              <p className="font-body text-muted-foreground leading-relaxed mb-5">
                Jimmy Carter, M.S., is the coach people call when &ldquo;working hard&rdquo; stops working. As Director of
                Sports Performance and Director of Wellness, he&rsquo;s built a reputation for turning untapped potential
                into Division I scholarships, pro contracts, and life-changing transformations.
              </p>
              <p className="font-body text-muted-foreground leading-relaxed">
                A former Division I football player at the University of Illinois, Jimmy has lived what most coaches only
                study. At the NFL Elite Regional Combine, he posted one of the top overall scores with a 9.4/10 &mdash;
                proof that his methods aren&rsquo;t theory, they&rsquo;re battle-tested on his own body first.
              </p>
              <p className="font-body text-muted-foreground leading-relaxed mt-5">
                Speed and agility are his specialty. Every session on the Hudson SportsPlex turf is built around
                first-step quickness, change of direction, balance and coordination &mdash; the qualities that decide
                whether an athlete wins the rep. Strength work sits right beside it, so the speed an athlete builds is
                speed they can hold onto all season.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <section className="mb-16">
            <div className="flex items-center gap-2 text-[hsl(var(--navy))] font-orbitron uppercase tracking-wider text-xs mb-4">
              <Zap className="w-4 h-4 text-[hsl(var(--energy))]" /> Speed &amp; Agility Background
            </div>
            <h2 className="font-orbitron font-bold uppercase tracking-wide text-lg text-[hsl(var(--black))] mb-5">
              What he actually trains
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SPEED_WORK.map((item) => (
                <div key={item.title} className="card p-5 border-t-2 border-t-[hsl(var(--energy))]">
                  <h3 className="font-orbitron uppercase tracking-wide text-[11px] font-bold text-[hsl(var(--black))] mb-2">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="mb-16">
            <h2 className="font-orbitron font-bold uppercase tracking-wide text-lg text-[hsl(var(--black))] mb-5">
              Over the last 13+ years, Jimmy has trained:
            </h2>
            <ul className="grid gap-4 sm:grid-cols-3">
              {TRAINED.map((item) => (
                <li key={item} className="card p-5 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[hsl(var(--navy))] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-body text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        <Reveal>
          <section className="mb-16">
            <p className="font-body text-muted-foreground leading-relaxed mb-6 max-w-3xl">
              He&rsquo;s also one of the original founders of Midwest Boom 7v7 Football Club, the #1 7v7 organization in
              the country with:
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {BOOM_STATS.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 80}>
                  <div className="bg-[hsl(var(--black))] text-white rounded-[12px] p-6 text-center">
                    <div className="font-orbitron font-bold text-3xl">
                      <Counter value={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="font-orbitron uppercase tracking-wider text-[10px] text-gray-400 mt-2">
                      {stat.label}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="font-body text-muted-foreground leading-relaxed mt-6">
              In other words: he doesn&rsquo;t &ldquo;hope&rdquo; his system works. The numbers prove it.
            </p>
          </section>
        </Reveal>

        <Reveal>
          <section className="mb-16">
            <div className="flex items-center gap-2 text-[hsl(var(--navy))] font-orbitron uppercase tracking-wider text-xs mb-5">
              <Briefcase className="w-4 h-4 text-[hsl(var(--energy))]" /> Coaching Experience
            </div>
            <ol className="space-y-5">
              {EXPERIENCE.map((item) => (
                <li key={item.role} className="card p-5 sm:p-6 border-l-4 border-l-[hsl(var(--energy))]">
                  <div className="font-orbitron uppercase tracking-wider text-[10px] text-[hsl(var(--navy))] mb-1.5">
                    {item.period}
                  </div>
                  <h3 className="font-orbitron font-bold uppercase tracking-wide text-sm text-[hsl(var(--black))]">
                    {item.role}
                  </h3>
                  <div className="font-body text-xs text-muted-foreground mb-2">{item.place}</div>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </li>
              ))}
            </ol>
          </section>
        </Reveal>

        <Reveal>
          <section className="mb-16">
            <div className="flex items-center gap-2 text-[hsl(var(--navy))] font-orbitron uppercase tracking-wider text-xs mb-4">
              <GraduationCap className="w-4 h-4 text-[hsl(var(--energy))]" /> Education
            </div>
            <p className="font-body text-muted-foreground leading-relaxed max-w-3xl">
              Jimmy holds a Master&rsquo;s Degree in Exercise Science (Sports Performance &amp; Injury Prevention) from
              California University of Pennsylvania and a Bachelor&rsquo;s in Psychology from the University of Illinois at
              Urbana-Champaign.
            </p>
          </section>
        </Reveal>

        <Reveal>
          <section className="mb-16">
            <div className="flex items-center gap-2 text-[hsl(var(--navy))] font-orbitron uppercase tracking-wider text-xs mb-5">
              <Award className="w-4 h-4 text-[hsl(var(--energy))]" /> Certifications
            </div>
            <ul className="flex flex-wrap gap-3">
              {CERTS.map((cert) => (
                <li
                  key={cert}
                  className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--light-bg))] px-4 py-2 font-orbitron uppercase tracking-wider text-[10px] text-[hsl(var(--navy))]"
                >
                  <Check className="w-3 h-3" /> {cert}
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        <Reveal>
          <section className="mb-16">
            <blockquote className="bg-[hsl(var(--navy))] text-white rounded-[12px] p-8 sm:p-10 border-l-4 border-l-[hsl(var(--energy))]">
              <p className="font-body text-lg sm:text-xl leading-relaxed">
                That combination of sports science, psychology, and trauma-informed coaching is his unfair advantage. He
                doesn&rsquo;t just build faster, stronger bodies &mdash; he helps athletes and high performers rewire their
                nervous system so they stop choking, freezing, or self-sabotaging when it matters most.
              </p>
            </blockquote>
          </section>
        </Reveal>

        <Reveal>
          <section className="mb-16">
            <div className="flex items-center gap-2 text-[hsl(var(--navy))] font-orbitron uppercase tracking-wider text-xs mb-4">
              <BookOpen className="w-4 h-4 text-[hsl(var(--energy))]" /> Author
            </div>
            <p className="font-body text-muted-foreground leading-relaxed max-w-3xl">
              Jimmy is also a co-author of the Amazon best-selling book Radical Freedom, where he dives into the deeper
              mindset and emotional patterns that either fuel high performance&mdash;or quietly destroy it.
            </p>
          </section>
        </Reveal>

        <Reveal>
          <section className="mb-16">
            <p className="font-body text-muted-foreground leading-relaxed max-w-3xl mb-6">
              Work with Jimmy, and you&rsquo;re not just getting &ldquo;workouts&rdquo; and &ldquo;meal plans.&rdquo;
              You&rsquo;re stepping into a high-standard, no-excuses culture where:
            </p>
            <ul className="grid gap-4 sm:grid-cols-3">
              {CULTURE.map((item) => (
                <li key={item} className="card p-5 font-body text-sm">{item}</li>
              ))}
            </ul>
            <p className="font-body text-muted-foreground leading-relaxed mt-6 max-w-3xl">
              If you&rsquo;re serious about winning&mdash;on the field, in the gym, or in your life&mdash;Jimmy Carter is
              the one you want designing your game plan.
            </p>
          </section>
        </Reveal>

        <div className="text-center">
          <Link to="/book" className="btn-navy">
            Book a Session with Jimmy <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
