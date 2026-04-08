"use client";

import { Progress } from "@/components/ui/progress";
import { formatMoney } from "@/lib/budget-calculator";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  spent: number;
  limit: number;
  color: string;
}

export function BudgetProgressBar({ label, spent, limit, color }: Props) {
  const percent = limit > 0 ? Math.min(100, (spent / limit) * 100) : 0;
  const isOver = spent > limit;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className={cn("tabular-nums", isOver && "text-red-500")}>
          {formatMoney(spent)} / {formatMoney(limit)}
        </span>
      </div>
      <div className="relative">
        <Progress value={percent} className="h-3" />
        <div
          className="absolute inset-0 h-3 rounded-full opacity-30"
          style={{ width: `${Math.min(percent, 100)}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-xs text-muted-foreground text-right">
        {isOver
          ? `Превышение на ${formatMoney(spent - limit)}`
          : `Осталось ${formatMoney(limit - spent)}`}
      </p>
    </div>
  );
}
