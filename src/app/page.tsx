"use client";

import { SafeToSpend } from "@/components/SafeToSpend";
import { BudgetProgressBar } from "@/components/BudgetProgressBar";
import { AccountCard } from "@/components/AccountCard";
import { TransactionList } from "@/components/TransactionList";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSafeToSpend } from "@/hooks/useSafeToSpend";
import { useAccounts } from "@/hooks/useAccounts";
import { useTransactions } from "@/hooks/useTransactions";
import { useAppStore } from "@/stores/app-store";
import Link from "next/link";

export default function DashboardPage() {
  const { setAddTransactionOpen } = useAppStore();
  const { data: sts } = useSafeToSpend();
  const { data: accounts } = useAccounts();
  const { data: txData } = useTransactions({ limit: 5 });

  const recentTransactions = txData?.data ?? [];

  return (
    <div className="space-y-6">
      {/* Safe to Spend */}
      <Card>
        <CardContent className="pt-6">
          <SafeToSpend />
        </CardContent>
      </Card>

      {/* Budget Progress */}
      {sts && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <BudgetProgressBar
                label="Необходимое"
                spent={sts.needsSpent}
                limit={sts.needsLimit}
                color="#3B82F6"
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <BudgetProgressBar
                label="Желания"
                spent={sts.wantsSpent}
                limit={sts.wantsLimit}
                color="#F97316"
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <BudgetProgressBar
                label="Сбережения"
                spent={sts.savingsSpent}
                limit={sts.savingsLimit}
                color="#22C55E"
              />
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Последние транзакции</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setAddTransactionOpen(true)}>
                + Добавить
              </Button>
              <Link href="/transactions">
                <Button variant="ghost" size="sm">Все</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">Нет транзакций</p>
            ) : (
              <TransactionList transactions={recentTransactions} compact />
            )}
          </CardContent>
        </Card>

        {/* Accounts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Счета</CardTitle>
            <Link href="/accounts">
              <Button variant="ghost" size="sm">Все</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {accounts?.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </CardContent>
        </Card>
      </div>

      <AddTransactionModal />
    </div>
  );
}
