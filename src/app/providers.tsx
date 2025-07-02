"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PocketApiProvider } from "@/context/PocketApiProvider";
import { PocketApi } from "@/utils/api";
import { env } from "@/utils/env";

const api = new PocketApi(env.apiUrl);
const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <PocketApiProvider api={api}>
        {children}
      </PocketApiProvider>
    </QueryClientProvider>
  );
}