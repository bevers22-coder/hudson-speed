import React from "react";
import { Link, Navigate } from "react-router-dom";
import { CalendarCheck, ArrowRight } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import { useAuth } from "@/lib/AuthContext";
import { usePublicData } from "@/components/PublicDataProvider";

export default function Account() {
  const { user, isAuthenticated, isLoadingAuth, authChecked } = useAuth();
  const { data } = usePublicData();

  const staffEmails = String(data?.staffEmails || "jimmycarter@hudsonsportsplex.com")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const isStaff =
    !!data?.viewerIsStaff ||
    (!!user &&
      (user.role === "admin" || staffEmails.includes(String(user.email || "").toLowerCase())));

  if (isStaff) return <Navigate to="/staff/home" replace />;

  return (
    <PublicLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[hsl(var(--light-bg))] mb-5">
          <CalendarCheck className="w-8 h-8 text-[hsl(var(--navy))]" />
        </div>

        {isLoadingAuth || !authChecked ? (
          <div className="w-8 h-8 border-4 border-[hsl(var(--border))] border-t-[hsl(var(--navy))] rounded-full animate-spin mx-auto" />
        ) : isAuthenticated ? (
          <>
            <h1 className="font-orbitron text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[hsl(var(--black))] mb-3">
              You&rsquo;re all set
            </h1>
            <p className="font-body text-muted-foreground mb-8">
              Your account is ready{user?.email ? ` (${user.email})` : ""}. Parents and guardians do not need an account to
              book a session — you can book any time as a guest.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {isStaff ? (
                <Link to="/staff/home" className="btn-navy">
                  Open Staff Home <ArrowRight className="w-4 h-4" />
                </Link>
              ) : null}
              <Link to="/book" className="btn-outline">Book a Session</Link>
              <Link to="/manage" className="btn-outline">Manage My Booking</Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="font-orbitron text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[hsl(var(--black))] mb-3">
              Not Signed In
            </h1>
            <p className="font-body text-muted-foreground mb-8">
              Parents do not need to log in to book a session — you can book any time as a guest.
            </p>
            <Link to="/book" className="btn-navy">
              Book a Session <ArrowRight className="w-4 h-4" />
            </Link>
          </>
        )}
      </div>
    </PublicLayout>
  );
}
