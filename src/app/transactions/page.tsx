"use client";

import { useState } from "react";
import { useTransactions, useDeleteTransaction } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import { useAccounts } from "@/hooks/useAccounts";
import { TransactionList } from "@/components/TransactionList";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore } from "@/stores/app-store";
import { formatMoney } from "@/lib/budget-calculator";

export default function TransactionsPage() {
  const { setAddTransactionOpen } = useAppStore();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [type, setType] = useState("");

  const { data, isLoading } = useTransactions({
    page,
    limit: 20,
    search: search || undefined,
    categoryId: categoryId || undefined,
    accountId: accountId || undefined,
    type: type || undefined,
  });
  const { data: categories } = useCategories();
  const { data: accounts } = useAccounts();
  const deleteTransaction = useDeleteTransaction();

  const transactions = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  // Calculate period totals from visible data
  const income = transactions.filter((t) => Number(t.amount) > 0).reduce((s, t) => s + Number(t.amount), 0);
  const expenses = transactions.filter((t) => Number(t.amount) < 0).reduce((s, t) => s + Math.abs(Number(t.amount)), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Транзакции</h1>
        <Button onClick={() => setAddTransactionOpen(true)}>+ Добавить</Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Доходы</p>
            <p className="text-lg font-semibold text-green-600">+{formatMoney(income)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Расходы</p>
            <p className="text-lg font-semibold text-red-500">-{formatMoney(expenses)}</p>
          </CardContent>
        </Card>
        <Card className="hidden md:block">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Всего записей</p>
            <p className="text-lg font-semibold">{data?.total ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Поиск..."
          className="max-w-xs"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <Select value={type} onValueChange={(v) => { setType(!v || v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Все типы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы</SelectItem>
            <SelectItem value="EXPENSE">Расходы</SelectItem>
            <SelectItem value="INCOME">Доходы</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryId} onValueChange={(v) => { setCategoryId(!v || v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Все категории" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.icon} {cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={accountId} onValueChange={(v) => { setAccountId(!v || v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Все счета" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все счета</SelectItem>
            {accounts?.map((acc) => (
              <SelectItem key={acc.id} value={acc.id}>{acc.icon} {acc.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Transaction list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">Транзакции не найдены</p>
      ) : (
        <TransactionList transactions={transactions} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Назад
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Вперёд
          </Button>
        </div>
      )}

      <AddTransactionModal />
    </div>
  );
}
