import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";

export default function Custom404() {
  return (
    <PublicLayout>
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center">
        <div className="font-orbitron text-6xl sm:text-8xl font-bold text-[hsl(var(--navy))] mb-4">404</div>
        <h1 className="font-orbitron text-xl font-bold uppercase tracking-wide text-[hsl(var(--black))] mb-3">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has moved.
        </p>
        <Link to="/" className="btn-navy">
          <Home className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </PublicLayout>
  );
}
