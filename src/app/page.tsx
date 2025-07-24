"use client";

import { StatusCard } from "@/components/cards/status";

// Node count | Status | Latency | Block

export default function Home() {
  return (
    <div className="flex flex-col gap-8 p-8 w-full">
      <section className="w-full flex justify-center">
        <StatusCard />
      </section>
    </div>
  );
}
