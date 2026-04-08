"use client";

import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/budget-calculator";
import { cn } from "@/lib/utils";
import type { Transaction, Category, Account } from "@/types";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

type TransactionWithRelations = Transaction & {
  category?: Category | null;
  account?: Account | null;
};

interface Props {
  transactions: TransactionWithRelations[];
  onEdit?: (tx: TransactionWithRelations) => void;
  compact?: boolean;
}

const GROUP_COLORS: Record<string, string> = {
  NEEDS: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  WANTS: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  SAVINGS: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

export function TransactionList({ transactions, onEdit, compact }: Props) {
  // Group by date
  const grouped: Record<string, TransactionWithRelations[]> = {};
  for (const tx of transactions) {
    const key = format(new Date(tx.date), "yyyy-MM-dd");
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(tx);
  }

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  if (compact) {
    return (
      <div className="space-y-2">
        {transactions.slice(0, 5).map((tx) => (
          <TransactionRow key={tx.id} tx={tx} onEdit={onEdit} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedDates.map((dateStr) => (
        <div key={dateStr}>
          <h3 className="text-sm font-medium text-muted-foreground mb-2 sticky top-0 bg-background py-1">
            {format(new Date(dateStr), "d MMMM, EEEE", { locale: ru })}
          </h3>
          <div className="space-y-1">
            {grouped[dateStr].map((tx) => (
              <TransactionRow key={tx.id} tx={tx} onEdit={onEdit} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TransactionRow({
  tx,
  onEdit,
}: {
  tx: TransactionWithRelations;
  onEdit?: (tx: TransactionWithRelations) => void;
}) {
  const isIncome = Number(tx.amount) > 0;

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors",
        onEdit && "cursor-pointer"
      )}
      onClick={() => onEdit?.(tx)}
    >
      <div className="text-xl w-8 text-center">
        {tx.category?.icon || (isIncome ? "💰" : "📝")}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{tx.description}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {tx.category && (
            <Badge variant="secondary" className={cn("text-xs", GROUP_COLORS[tx.category.budgetGroup])}>
              {tx.category.name}
            </Badge>
          )}
          {tx.status === "UNCATEGORIZED" && (
            <Badge variant="outline" className="text-xs">
              Без категории
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">{tx.account?.name}</span>
        </div>
      </div>
      <div className={cn("font-semibold tabular-nums text-sm", isIncome ? "text-green-600" : "text-foreground")}>
        {isIncome ? "+" : ""}{formatMoney(Number(tx.amount))}
      </div>
    </div>
  );
}
