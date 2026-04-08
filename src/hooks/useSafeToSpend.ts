"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { SafeToSpendData } from "@/types";

export function useSafeToSpend() {
  return useQuery<SafeToSpendData>({
    queryKey: ["safe-to-spend"],
    queryFn: () => api.get("/budgets/safe-to-spend"),
  });
}
