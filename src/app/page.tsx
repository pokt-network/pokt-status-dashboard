"use client";

import { TokenomicsCard } from "@/components/cards/tokenomics";
import { GatewaysCard } from "@/components/cards/gateways";
import { ApplicationsCard } from "@/components/cards/applications";
import { ServicesCard } from "@/components/cards/services";
import { SuppliersCard } from "@/components/cards/suppliers";
import { RelayMiningDifficultiesCard } from "@/components/cards/relay-mining-difficulties";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 p-8 w-full">
      <h1 className="text-3xl font-bold mb-4">Pocket Dashboard</h1>
      <section className="flex justify-between gap-8">
        {/* Gateways Card */}
        <GatewaysCard />
        {/* Tokenomics Card */}
        <TokenomicsCard />
      </section>
      {/* Applications Table */}
      <section>
        <ApplicationsCard />
      </section>
      {/* Services Table */}
      <section>
        <ServicesCard />
      </section>
      {/* Relay Mining Difficulties Table */}
      <section>
        <RelayMiningDifficultiesCard />
      </section>
      {/* Suppliers Table */}
      <section>
        <SuppliersCard />
      </section>
    </div>
  );
}
