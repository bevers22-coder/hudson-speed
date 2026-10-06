import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import PublicDataProvider, { usePublicData } from "./PublicDataProvider";

function Shell({ children }) {
  const { data } = usePublicData();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header
        announcement={data?.announcement}
        wordmark={data?.images?.wordmark}
        isStaff={data?.viewerIsStaff}
      />
      <main className="flex-1">{children}</main>
      <Footer contact={data?.contact} wordmark={data?.images?.wordmark} />
      {/* Spacer so the fixed phone navigation never covers the footer. */}
      <div
        className="md:hidden"
        style={{ height: "calc(4.5rem + env(safe-area-inset-bottom))" }}
        aria-hidden="true"
      />
      <BottomNav />
    </div>
  );
}

export default function PublicLayout({ children }) {
  return (
    <PublicDataProvider>
      <Shell>{children}</Shell>
    </PublicDataProvider>
  );
}
