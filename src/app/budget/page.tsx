"use client";

import { useState } from "react";
import { useCurrentBudget, useCreateOrUpdateBudget } from "@/hooks/useBudget";
import { useSafeToSpend } from "@/hooks/useSafeToSpend";
import { useCategories } from "@/hooks/useCategories";
import { useTransactions } from "@/hooks/useTransactions";
import { BudgetProgressBar } from "@/components/BudgetProgressBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatMoney } from "@/lib/budget-calculator";
import { Badge } from "@/components/ui/badge";

export default function BudgetPage() {
  const { data: budget, isLoading: budgetLoading } = useCurrentBudget();
  const { data: sts } = useSafeToSpend();
  const { data: categories } = useCategories();
  const updateBudget = useCreateOrUpdateBudget();

  const [editOpen, setEditOpen] = useState(false);
  const [income, setIncome] = useState("");
  const [needsPct, setNeedsPct] = useState("50");
  const [wantsPct, setWantsPct] = useState("30");
  const [savingsPct, setSavingsPct] = useState("20");

  const openEdit = () => {
    if (budget) {
      setIncome(String(Number(budget.totalIncome)));
      const total = Number(budget.totalIncome);
      if (total > 0) {
        setNeedsPct(String(Math.round((Number(budget.needsLimit) / total) * 100)));
        setWantsPct(String(Math.round((Number(budget.wantsLimit) / total) * 100)));
        setSavingsPct(String(Math.round((Number(budget.savingsLimit) / total) * 100)));
      }
    }
    setEditOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const totalIncome = Number(income);
    updateBudget.mutate(
      {
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        totalIncome,
        needsLimit: Math.round(totalIncome * Number(needsPct) / 100),
        wantsLimit: Math.round(totalIncome * Number(wantsPct) / 100),
        savingsLimit: Math.round(totalIncome * Number(savingsPct) / 100),
      },
      { onSuccess: () => setEditOpen(false) }
    );
  };

  const totalPct = Number(needsPct) + Number(wantsPct) + Number(savingsPct);

  // Group spending by category
  const needsCats = categories?.filter((c) => c.budgetGroup === "NEEDS") ?? [];
  const wantsCats = categories?.filter((c) => c.budgetGroup === "WANTS") ?? [];
  const savingsCats = categories?.filter((c) => c.budgetGroup === "SAVINGS") ?? [];

  if (budgetLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-48 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <span className="text-5xl">📋</span>
        <h2 className="text-xl font-bold">Бюджет не настроен</h2>
        <p className="text-muted-foreground">Создайте бюджет на текущий месяц</p>
        <Button onClick={openEdit}>Создать бюджет</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Бюджет</h1>
          <p className="text-muted-foreground">
            Доход: {formatMoney(Number(budget.totalIncome))} / мес
          </p>
        </div>
        <Button variant="outline" onClick={openEdit}>Редактировать</Button>
      </div>

      {/* Main progress bars */}
      {sts && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                Необходимое (50%)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetProgressBar label="" spent={sts.needsSpent} limit={sts.needsLimit} color="#3B82F6" />
              <div className="mt-3 space-y-1">
                {needsCats.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between text-xs">
                    <span>{cat.icon} {cat.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500" />
                Желания (30%)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetProgressBar label="" spent={sts.wantsSpent} limit={sts.wantsLimit} color="#F97316" />
              <div className="mt-3 space-y-1">
                {wantsCats.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between text-xs">
                    <span>{cat.icon} {cat.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500" />
                Сбережения (20%)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetProgressBar label="" spent={sts.savingsSpent} limit={sts.savingsLimit} color="#22C55E" />
              <div className="mt-3 space-y-1">
                {savingsCats.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between text-xs">
                    <span>{cat.icon} {cat.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit budget dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Настройка бюджета</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label>Месячный доход</Label>
              <Input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="150000"
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Необходимое (%)</Label>
                <Input
                  type="number"
                  value={needsPct}
                  onChange={(e) => setNeedsPct(e.target.value)}
                  min="0" max="100"
                />
              </div>
              <div className="space-y-2">
                <Label>Желания (%)</Label>
                <Input
                  type="number"
                  value={wantsPct}
                  onChange={(e) => setWantsPct(e.target.value)}
                  min="0" max="100"
                />
              </div>
              <div className="space-y-2">
                <Label>Сбережения (%)</Label>
                <Input
                  type="number"
                  value={savingsPct}
                  onChange={(e) => setSavingsPct(e.target.value)}
                  min="0" max="100"
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Итого:</span>
              <Badge variant={totalPct === 100 ? "default" : "destructive"}>
                {totalPct}%
              </Badge>
            </div>
            {income && (
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Необходимое: {formatMoney(Number(income) * Number(needsPct) / 100)}</p>
                <p>Желания: {formatMoney(Number(income) * Number(wantsPct) / 100)}</p>
                <p>Сбережения: {formatMoney(Number(income) * Number(savingsPct) / 100)}</p>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={updateBudget.isPending}>
              Сохранить
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
