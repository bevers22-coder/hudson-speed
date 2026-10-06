import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Loader2, Mail, Lock, ShieldCheck } from "lucide-react";
import GoogleIcon from "@/components/GoogleIcon";
import NoIndex from "@/components/staff/NoIndex";

export default function StaffSignIn() {
  const { isAuthenticated, isLoadingAuth, authChecked } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Staff Sign In — Hudson Speed and Strength";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = "/staff/home";
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    base44.auth.loginWithProvider("google", "/staff/home");
  };

  // Already signed in? Go straight through — the staff home will either let
  // them in or show the staff-only message.
  if (!isLoadingAuth && authChecked && isAuthenticated) {
    return <Navigate to="/staff/home" replace />;
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--light-bg))] flex flex-col">
      <NoIndex />

      <div className="bg-[hsl(var(--navy))] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link to="/" className="wordmark text-xs sm:text-sm text-white">
            Hudson Speed and Strength
          </Link>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-[12px] bg-[hsl(var(--navy))] mb-4">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-orbitron text-2xl font-bold uppercase tracking-wide text-[hsl(var(--black))]">
              Staff Sign In
            </h1>
            <p className="text-sm text-muted-foreground font-body mt-2">
              For coaching staff only.
            </p>
          </div>

          <div className="card p-6 sm:p-8">
            <button onClick={handleGoogle} className="btn-outline w-full mb-6">
              <GoogleIcon className="w-5 h-5" /> Continue with Google
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[hsl(var(--border))]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-[10px] font-orbitron uppercase tracking-wider text-muted-foreground">
                  or
                </span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-[10px] bg-destructive/10 text-destructive text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="staff-email" className="block text-xs font-medium mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="staff-email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@hudsonsportsplex.com"
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="staff-password" className="block text-xs font-medium">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs text-[hsl(var(--navy))] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="staff-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-navy w-full">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <p className="text-xs text-muted-foreground font-body text-center mt-6">
              First time here?{" "}
              <Link
                to="/register?returnTo=%2Fstaff%2Fhome"
                className="text-[hsl(var(--navy))] font-medium hover:underline"
              >
                Create your staff account
              </Link>
            </p>
          </div>

          <p className="text-center mt-6">
            <Link to="/" className="text-xs text-muted-foreground hover:text-[hsl(var(--navy))]">
              Back to the website
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
