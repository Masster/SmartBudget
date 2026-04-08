"use client";

import { useSafeToSpend } from "@/hooks/useSafeToSpend";
import { formatMoney } from "@/lib/budget-calculator";
import { cn } from "@/lib/utils";

export function SafeToSpend() {
  const { data, isLoading } = useSafeToSpend();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="h-12 w-48 bg-muted animate-pulse rounded-lg" />
        <div className="h-4 w-32 bg-muted animate-pulse rounded mt-3" />
      </div>
    );
  }

  if (!data) return null;

  const percent = data.wantsLimit > 0 ? (data.safeToSpend / data.wantsLimit) * 100 : 0;
  const color =
    data.safeToSpend < 0
      ? "text-red-500"
      : percent < 20
        ? "text-yellow-500"
        : "text-green-500";

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <p className="text-sm text-muted-foreground mb-2">Безопасно потратить</p>
      <p className={cn("text-5xl font-bold tabular-nums", color)}>
        {formatMoney(data.safeToSpend)}
      </p>
      <p className="text-xs text-muted-foreground mt-3">
        Общий баланс: {formatMoney(data.totalBalance)}
      </p>
    </div>
  );
}
