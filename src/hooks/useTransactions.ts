"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Transaction, PaginatedResponse } from "@/types";

interface TransactionFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  accountId?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
}

function buildQuery(filters: TransactionFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function useTransactions(filters: TransactionFilters = {}) {
  return useQuery<PaginatedResponse<Transaction>>({
    queryKey: ["transactions", filters],
    queryFn: () => api.get(`/transactions${buildQuery(filters)}`),
  });
}

export function useUncategorizedTransactions() {
  return useQuery<Transaction[]>({
    queryKey: ["transactions", "uncategorized"],
    queryFn: () => api.get("/transactions/uncategorized"),
  });
}

export function useCreateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post<Transaction>("/transactions", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      qc.invalidateQueries({ queryKey: ["accounts"] });
      qc.invalidateQueries({ queryKey: ["safe-to-spend"] });
      qc.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
}

export function useUpdateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Record<string, unknown> & { id: string }) =>
      api.patch<Transaction>(`/transactions/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      qc.invalidateQueries({ queryKey: ["accounts"] });
      qc.invalidateQueries({ queryKey: ["safe-to-spend"] });
      qc.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
}

export function useDeleteTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/transactions/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      qc.invalidateQueries({ queryKey: ["accounts"] });
      qc.invalidateQueries({ queryKey: ["safe-to-spend"] });
      qc.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
}

export function useBulkCategorize() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { transactions: Array<{ id: string; categoryId: string }> }) =>
      api.post("/transactions/bulk-categorize", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      qc.invalidateQueries({ queryKey: ["safe-to-spend"] });
      qc.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
}
