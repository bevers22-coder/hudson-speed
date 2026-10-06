import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

export default function AdminRoute({ children }) {
  const { user, isAuthenticated, isLoadingAuth, authChecked } = useAuth();

  if (isLoadingAuth || !authChecked) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--light-bg))] px-4">
        <div className="card p-8 max-w-md text-center">
          <h1 className="font-orbitron text-xl font-bold uppercase tracking-wide text-destructive mb-2">Access Denied</h1>
          <p className="text-muted-foreground text-sm mb-6">
            You need administrator access to view this page.
          </p>
          <a href="/" className="btn-navy">Back to Home</a>
        </div>
      </div>
    );
  }

  return children;
}
