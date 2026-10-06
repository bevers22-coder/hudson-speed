import React from "react";
import { MapPin, Phone, Mail, ExternalLink, Navigation, Car, DoorOpen } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import { usePublicData } from "@/components/PublicDataProvider";
import { Image } from "@/components/ui/image";
import Reveal from "@/components/Reveal";
import { LOCATION_LINE } from "@/lib/schedule";

export default function Location() {
  const { data } = usePublicData();
  const contact = data?.contact || {};
  const address = data?.location || LOCATION_LINE;
  const phone = contact.phone || "(630) 303-9282";
  const email = contact.email || "info@hudsonsportsplex.com";
  const mapQuery = encodeURIComponent(address);

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <nav className="text-xs text-muted-foreground font-body mb-6" aria-label="Breadcrumb">
          <a href="/" className="hover:text-[hsl(var(--navy))]">Home</a>
          <span className="mx-2">/</span>
          <span className="text-foreground">Location</span>
        </nav>

        <h1 className="font-orbitron font-bold text-2xl sm:text-4xl uppercase tracking-wide text-[hsl(var(--black))] mb-8">
          Location
        </h1>

        <div className="grid gap-8 md:grid-cols-2 mb-10">
          <Reveal>
            <div className="card p-7 h-full">
              <MapPin className="w-9 h-9 text-[hsl(var(--navy))] mb-4" />
              <h2 className="font-orbitron font-bold uppercase tracking-wide text-lg text-[hsl(var(--black))] mb-3">
                Where to Go
              </h2>
              <p className="font-body text-muted-foreground mb-6">{LOCATION_LINE}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-navy"
                >
                  <Navigation className="w-4 h-4" /> Get Directions
                </a>
              </div>

              <ul className="mt-7 pt-6 border-t border-[hsl(var(--border))] space-y-4 font-body text-sm">
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[hsl(var(--navy))] flex-shrink-0" />
                  <a href={`tel:+1${phone.replace(/\D/g, "")}`} className="hover:text-[hsl(var(--navy))]">{phone}</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[hsl(var(--navy))] flex-shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-[hsl(var(--navy))]">{email}</a>
                </li>
                <li className="flex items-center gap-3">
                  <ExternalLink className="w-4 h-4 text-[hsl(var(--navy))] flex-shrink-0" />
                  <a href="https://hudsonsportsplex.com" target="_blank" rel="noopener noreferrer" className="hover:text-[hsl(var(--navy))]">
                    hudsonsportsplex.com
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="card overflow-hidden h-full min-h-[320px]">
              <iframe
                title="Map to Hudson SportsPlex"
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                className="w-full h-full min-h-[320px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>

        {data?.images?.location && (
          <Reveal>
            <div className="card overflow-hidden mb-10">
              <Image
                src={data.images.location}
                alt="Hudson SportsPlex training space"
                fittingType="fill"
                className="block w-full aspect-[16/9]"
              />
            </div>
          </Reveal>
        )}

        {(data?.parkingNotes || data?.entranceNotes) && (
          <div className="grid gap-5 sm:grid-cols-2 mb-10">
            {data?.parkingNotes && (
              <div className="card p-6">
                <Car className="w-6 h-6 text-[hsl(var(--navy))] mb-3" />
                <h3 className="font-orbitron uppercase tracking-wide text-xs font-bold text-[hsl(var(--black))] mb-2">Parking</h3>
                <p className="font-body text-sm text-muted-foreground">{data.parkingNotes}</p>
              </div>
            )}
            {data?.entranceNotes && (
              <div className="card p-6">
                <DoorOpen className="w-6 h-6 text-[hsl(var(--navy))] mb-3" />
                <h3 className="font-orbitron uppercase tracking-wide text-xs font-bold text-[hsl(var(--black))] mb-2">Entrance</h3>
                <p className="font-body text-sm text-muted-foreground">{data.entranceNotes}</p>
              </div>
            )}
          </div>
        )}

        <div className="card p-7 text-center">
          <h2 className="font-orbitron font-bold uppercase tracking-wide text-lg text-[hsl(var(--black))] mb-2">
            Questions?
          </h2>
          <p className="font-body text-muted-foreground mb-5">
            Reach out and we&rsquo;ll help you find the right session.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={`tel:+1${phone.replace(/\D/g, "")}`} className="btn-outline">
              <Phone className="w-4 h-4" /> {phone}
            </a>
            <a href={`mailto:${email}`} className="btn-navy">
              <Mail className="w-4 h-4" /> Email Us
            </a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
