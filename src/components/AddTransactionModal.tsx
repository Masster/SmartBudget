"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAccounts } from "@/hooks/useAccounts";
import { useCategories } from "@/hooks/useCategories";
import { useCreateTransaction } from "@/hooks/useTransactions";
import { useAppStore } from "@/stores/app-store";

export function AddTransactionModal() {
  const { addTransactionOpen, setAddTransactionOpen } = useAppStore();
  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories();
  const createTransaction = useCreateTransaction();

  const [type, setType] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [accountId, setAccountId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !accountId) return;

    createTransaction.mutate(
      {
        type,
        amount: type === "EXPENSE" ? -Math.abs(Number(amount)) : Math.abs(Number(amount)),
        description,
        accountId,
        categoryId: categoryId || null,
        date,
      },
      {
        onSuccess: () => {
          setAddTransactionOpen(false);
          resetForm();
        },
      }
    );
  };

  const resetForm = () => {
    setType("EXPENSE");
    setAmount("");
    setDescription("");
    setAccountId("");
    setCategoryId("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  return (
    <Dialog open={addTransactionOpen} onOpenChange={setAddTransactionOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить транзакцию</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type toggle */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={type === "EXPENSE" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setType("EXPENSE")}
            >
              Расход
            </Button>
            <Button
              type="button"
              variant={type === "INCOME" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setType("INCOME")}
            >
              Доход
            </Button>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label>Сумма</Label>
            <Input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0.01"
              step="0.01"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Описание</Label>
            <Input
              placeholder="Описание транзакции"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Account */}
          <div className="space-y-2">
            <Label>Счёт</Label>
            <Select value={accountId} onValueChange={(v) => v && setAccountId(v)} required>
              <SelectTrigger>
                <SelectValue placeholder="Выберите счёт" />
              </SelectTrigger>
              <SelectContent>
                {accounts?.map((acc) => (
                  <SelectItem key={acc.id} value={acc.id}>
                    {acc.icon} {acc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Категория</Label>
            <Select value={categoryId} onValueChange={(v) => v && setCategoryId(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Без категории" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>Дата</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={createTransaction.isPending}>
            {createTransaction.isPending ? "Сохранение..." : "Сохранить"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
