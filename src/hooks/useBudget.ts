"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Budget } from "@/types";

export function useCurrentBudget() {
  return useQuery<Budget>({
    queryKey: ["budgets", "current"],
    queryFn: () => api.get("/budgets/current"),
  });
}

export function useBudgetByPeriod(year: number, month: number) {
  return useQuery<Budget>({
    queryKey: ["budgets", year, month],
    queryFn: () => api.get(`/budgets/${year}/${month}`),
    enabled: !!year && !!month,
  });
}

interface BudgetInput {
  month: number;
  year: number;
  totalIncome: number;
  needsLimit: number;
  wantsLimit: number;
  savingsLimit: number;
}

export function useCreateOrUpdateBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: BudgetInput) => api.post<Budget>("/budgets", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["budgets"] });
      qc.invalidateQueries({ queryKey: ["safe-to-spend"] });
    },
  });
}
