import React from "react";
import PublicLayout from "@/components/PublicLayout";
import StaffGate from "@/components/staff/StaffGate";
import StaffCalendar from "@/components/staff/StaffCalendar";

// Kept so existing bookmarks to /calendar keep working. Staff-only, and
// enforced on the server by getCoachCalendar.
export default function Calendar() {
  return (
    <StaffGate>
      {() => (
        <PublicLayout>
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="font-orbitron text-xl font-bold uppercase tracking-wide text-[hsl(var(--black))] mb-6">
              Staff Calendar
            </h1>
            <StaffCalendar />
          </div>
        </PublicLayout>
      )}
    </StaffGate>
  );
}
