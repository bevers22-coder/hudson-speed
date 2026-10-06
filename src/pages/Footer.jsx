import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";

export default function Footer({ contact }) {
  const c = contact || {};
  const address = c.address || "31W290 Schoger Dr, Naperville IL 60564";
  const phone = c.phone || "(630) 303-9282";
  const email = c.email || "info@hudsonsportsplex.com";
  const phoneHref = `tel:+1${phone.replace(/\D/g, "")}`;

  return (
    <footer className="bg-gradient-to-br from-[hsl(var(--black))] to-[hsl(var(--navy))] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="wordmark text-white text-sm">Hudson Speed and Strength</div>
            <div className="text-xs text-gray-400 mt-1 tracking-wide font-orbitron uppercase">At Hudson SportsPlex</div>
            <p className="text-sm text-gray-300 mt-4 max-w-xs font-body">
              Speed, agility, and strength training that builds first-step quickness, balance, and overall athletic performance.
            </p>
          </div>

          <div>
            <h3 className="font-orbitron text-xs uppercase tracking-wider text-gray-400 mb-4">Contact</h3>
            <ul className="space-y-3 text-sm font-body">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 flex-shrink-0 text-gray-400" />
                <a href={phoneHref} className="hover:text-white transition-colors">{phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 flex-shrink-0 text-gray-400" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-orbitron text-xs uppercase tracking-wider text-gray-400 mb-4">Explore</h3>
            <ul className="space-y-3 text-sm font-body">
              <li><Link to="/program" className="hover:text-white transition-colors">Program</Link></li>
              <li><Link to="/schedule" className="hover:text-white transition-colors">Schedule</Link></li>
              <li><Link to="/coach" className="hover:text-white transition-colors">Meet the Coach</Link></li>
              <li><Link to="/book" className="hover:text-white transition-colors">Book a Session</Link></li>
              <li><Link to="/manage" className="hover:text-white transition-colors">Manage Booking</Link></li>
              <li>
                <a href="https://hudsonsportsplex.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">
                  hudsonsportsplex.com <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-gray-400 font-body">
            © {new Date().getFullYear()} Hudson Speed and Strength. All rights reserved.
          </span>
          {/* The only door into the staff area. Kept small and low-contrast so
              parents never mistake it for a parent login. */}
          <Link to="/staff" className="text-[12px] text-gray-500 hover:text-gray-300 transition-colors">
            Staff
          </Link>
        </div>
      </div>
    </footer>
  );
}
