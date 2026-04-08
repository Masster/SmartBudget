"use client";

import { useState } from "react";
import { useAccounts, useCreateAccount, useUpdateAccount, useDeleteAccount } from "@/hooks/useAccounts";
import { AccountCard } from "@/components/AccountCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatMoney } from "@/lib/budget-calculator";
import type { Account } from "@/types";

const ACCOUNT_TYPES = [
  { value: "CHECKING", label: "Расчётный", icon: "💳" },
  { value: "SAVINGS", label: "Накопительный", icon: "🏦" },
  { value: "CREDIT", label: "Кредитный", icon: "💳" },
  { value: "CASH", label: "Наличные", icon: "💵" },
  { value: "INVESTMENT", label: "Инвестиционный", icon: "📈" },
];

const COLORS = ["#3B82F6", "#22C55E", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6", "#F97316"];

export default function AccountsPage() {
  const { data: accounts, isLoading } = useAccounts();
  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const deleteAccount = useDeleteAccount();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("CHECKING");
  const [balance, setBalance] = useState("");
  const [color, setColor] = useState(COLORS[0]);

  const totalBalance = accounts?.reduce((sum, acc) => sum + Number(acc.balance), 0) ?? 0;

  const openCreate = () => {
    setEditing(null);
    setName("");
    setType("CHECKING");
    setBalance("");
    setColor(COLORS[0]);
    setDialogOpen(true);
  };

  const openEdit = (account: Account) => {
    setEditing(account);
    setName(account.name);
    setType(account.type);
    setBalance(String(Number(account.balance)));
    setColor(account.color || COLORS[0]);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const icon = ACCOUNT_TYPES.find((t) => t.value === type)?.icon || "💳";
    const data = { name, type: type as Account["type"], balance: Number(balance) || 0, icon, color };

    if (editing) {
      updateAccount.mutate({ id: editing.id, ...data }, { onSuccess: () => setDialogOpen(false) });
    } else {
      createAccount.mutate(data, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Архивировать счёт?")) {
      deleteAccount.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Счета</h1>
          <p className="text-muted-foreground">
            Общий баланс: <span className="font-semibold text-foreground">{formatMoney(totalBalance)}</span>
          </p>
        </div>
        <Button onClick={openCreate}>+ Добавить счёт</Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-12 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {accounts?.map((account) => (
            <div key={account.id} className="relative group">
              <AccountCard account={account} onClick={() => openEdit(account)} />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                onClick={(e) => { e.stopPropagation(); handleDelete(account.id); }}
              >
                Архив
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Редактировать счёт" : "Новый счёт"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Название</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Название счёта" required />
            </div>
            <div className="space-y-2">
              <Label>Тип</Label>
              <Select value={type} onValueChange={(v) => v && setType(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ACCOUNT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.icon} {t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Баланс</Label>
              <Input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} placeholder="0" step="0.01" />
            </div>
            <div className="space-y-2">
              <Label>Цвет</Label>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 ${color === c ? "border-foreground" : "border-transparent"}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
            <Button type="submit" className="w-full">
              {editing ? "Сохранить" : "Создать"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
