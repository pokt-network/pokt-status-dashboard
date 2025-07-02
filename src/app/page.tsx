"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApplications } from "@/hooks/useApplications";
import { useGateways } from "@/hooks/useGateways";
import { useServices } from "@/hooks/useServices";
import { useSuppliers } from "@/hooks/useSuppliers";
import { useTokenomics } from "@/hooks/useTokenomics";
import { toTruncatedPoktAddress } from "@/utils/formatting";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ApplicationsTable } from "@/components/tables/applications";
import { SuppliersTable } from "@/components/tables/suppliers";
import { ServicesTable } from "@/components/tables/services";
import { GatewaysTable } from "@/components/tables/gateways";
import { TokenomicsTable } from "@/components/tables/tokenomics";

export default function Dashboard() {
  const { data: gateways, isLoading: gatewaysLoading, error: gatewaysError } = useGateways();
  const { data: services, isLoading: servicesLoading, error: servicesError } = useServices();
  const { data: suppliers, isLoading: suppliersLoading, error: suppliersError } = useSuppliers();
  const { data: tokenomics, isLoading: tokenomicsLoading, error: tokenomicsError } = useTokenomics();

  return (
    <div className="flex flex-col gap-12 p-8 w-full">
      <h1 className="text-3xl font-bold mb-4">Pocket Dashboard</h1>
      {/* Applications Table */}
      <section>
        <ApplicationsTable />
      </section>
      {/* Gateways Table */}
      <section>
        <GatewaysTable />
      </section>
      {/* Services Table */}
      <section>
        <ServicesTable />
      </section>
      {/* Suppliers Table */}
      <section>
        <SuppliersTable />
      </section>
      {/* Tokenomics Table */}
      <section>
        <TokenomicsTable />
      </section>
    </div>
  );
}
