"use client";

import { ApplicationsTable } from "@/components/tables/applications";
import { SuppliersTable } from "@/components/tables/suppliers";
import { ServicesTable } from "@/components/tables/services";
import { GatewaysTable } from "@/components/tables/gateways";
import { TokenomicsCard } from "@/components/cards/tokenomics";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 p-8 w-full">
      <h1 className="text-3xl font-bold mb-4">Pocket Dashboard</h1>
      <section className="flex justify-between gap-4">
        {/* Gateways Table */}
        <section className="w-full">
          <GatewaysTable />
        </section>
        <TokenomicsCard />
      </section>
      {/* Applications Table */}
      <section>
        <ApplicationsTable />
      </section>
      {/* Services Table */}
      <section>
        <ServicesTable />
      </section>
      {/* Suppliers Table */}
      <section>
        <SuppliersTable />
      </section>
    </div>
  );
}
