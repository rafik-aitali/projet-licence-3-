import React from "react";
import Hero from "../components/Hero";
import RecentActivities from "../components/recent activities/RecentActivities";
import FeaturedBusinesses from "../components/FeaturedBusinesses";
import CTASection from "../components/CTASection";

export default function Home() {
  return (
    <main className="mx-auto flex flex-col items-center max-w-full">
      <Hero />
      <FeaturedBusinesses />
      <RecentActivities />
      <CTASection />
    </main>
  );
}
