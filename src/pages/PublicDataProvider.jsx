import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { buildSchedule } from "@/lib/schedule";
import { useLiveRefresh } from "@/hooks/useLiveRefresh";

// Safe defaults so public pages always render something real, even if the
// public data request fails. The weekly schedule in particular must never be
// empty — it is defined in code and used as the fallback. Image slots are
// intentionally empty: when nothing is set the Hero draws its own turf
// fallback rather than a broken image.
export const DEFAULT_DATA = {
  announcement: { active: false, text: "" },
  contact: {
    email: "info@hudsonsportsplex.com",
    phone: "(630) 303-9282",
    address: "31W290 Schoger Dr, Naperville IL 60564",
  },
  images: { hero: [], coach: "", wordmark: "", location: "" },
  location: "Turf Loading Doc - Hudson Sportsplex, 31W290 Schoger Dr, Naperville IL 60564",
  waiverUrl: "",
  parkingNotes: "",
  entranceNotes: "",
  enforceCapacityLimit: false,
  viewerIsStaff: false,
  schedule: buildSchedule([]),
};

// The public data lives in a module-level snapshot rather than only in React
// context. Pages such as Home, Coach and Schedule render <PublicLayout>
// themselves — which means they sit ABOVE the provider in the tree and would
// otherwise only ever read the empty default context. Keeping the snapshot at
// module scope lets every consumer, above or below the provider, read the same
// live data.
let snapshot = { data: DEFAULT_DATA, loading: true };
const listeners = new Set();

function publish(next) {
  snapshot = next;
  listeners.forEach((fn) => fn());
}

async function fetchPublicData() {
  const res = await base44.functions.invoke("getPublicData", {});
  const incoming = res.data || {};
  publish({
    data: {
      ...DEFAULT_DATA,
      ...incoming,
      contact: { ...DEFAULT_DATA.contact, ...(incoming.contact || {}) },
      images: { ...DEFAULT_DATA.images, ...(incoming.images || {}) },
      schedule: incoming.schedule && incoming.schedule.length > 0 ? incoming.schedule : DEFAULT_DATA.schedule,
    },
    loading: false,
  });
}

/** Force a refetch — used after an admin changes site images. */
export async function refreshPublicData() {
  try {
    await fetchPublicData();
  } catch (err) {
    // Keep whatever we already have.
  }
}

export function usePublicData() {
  const [, bump] = useState(0);
  useEffect(() => {
    const fn = () => bump((n) => n + 1);
    listeners.add(fn);
    return () => listeners.delete(fn);
  }, []);
  return snapshot;
}

export default function PublicDataProvider({ children }) {
  useEffect(() => {
    if (!snapshot.loading) return;
    (async () => {
      try {
        await fetchPublicData();
      } catch (err) {
        publish({ data: snapshot.data, loading: false });
      }
    })();
  }, []);

  // Keep every public view in step with the saved settings, the weekly schedule
  // and the site images. An admin changing Jimmy's photo or the schedule shows
  // up across the site without anyone reloading.
  useLiveRefresh(fetchPublicData, { intervalMs: 60000, entity: "Settings" });

  return <>{children}</>;
}
