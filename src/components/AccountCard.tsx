"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatMoney } from "@/lib/budget-calculator";
import type { Account } from "@/types";

interface Props {
  account: Account;
  onClick?: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  CHECKING: "Расчётный",
  SAVINGS: "Накопительный",
  CREDIT: "Кредитный",
  CASH: "Наличные",
  INVESTMENT: "Инвестиционный",
};

export function AccountCard({ account, onClick }: Props) {
  return (
    <Card
      className={`cursor-pointer transition-shadow hover:shadow-md ${onClick ? "" : ""}`}
      onClick={onClick}
    >
      <CardContent className="flex items-center gap-4 p-4">
        <div
          className="flex items-center justify-center w-12 h-12 rounded-full text-2xl"
          style={{ backgroundColor: account.color ? `${account.color}20` : undefined }}
        >
          {account.icon || "💳"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{account.name}</p>
          <p className="text-xs text-muted-foreground">
            {TYPE_LABELS[account.type] || account.type}
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold tabular-nums">
            {formatMoney(Number(account.balance), account.currency)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
