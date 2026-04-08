"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useCategories, useCreateCategory, useDeleteCategory } from "@/hooks/useCategories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import type { User, UserSettings } from "@/types";

interface SettingsData {
  user: User;
  settings: UserSettings;
}

export default function SettingsPage() {
  const { data, isLoading } = useQuery<SettingsData>({
    queryKey: ["settings"],
    queryFn: () => api.get("/settings"),
  });
  const qc = useQueryClient();
  const updateSettings = useMutation({
    mutationFn: (body: Record<string, unknown>) => api.patch("/settings", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });
  const { data: categories } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("RUB");
  const [paydayDate, setPaydayDate] = useState("1");
  const [addCatOpen, setAddCatOpen] = useState(false);
  const [catName, setCatName] = useState("");
  const [catIcon, setCatIcon] = useState("");
  const [catGroup, setCatGroup] = useState("NEEDS");
  const [catColor, setCatColor] = useState("#3B82F6");

  useEffect(() => {
    if (data) {
      setName(data.user.name ?? "");
      setCurrency(data.user.currency);
      setPaydayDate(String(data.user.paydayDate));
    }
  }, [data]);

  const handleProfileSave = () => {
    updateSettings.mutate({ name, currency, paydayDate: Number(paydayDate) });
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    createCategory.mutate(
      { name: catName, icon: catIcon, color: catColor, budgetGroup: catGroup as "NEEDS" | "WANTS" | "SAVINGS", sortOrder: 99 },
      {
        onSuccess: () => {
          setAddCatOpen(false);
          setCatName("");
          setCatIcon("");
        },
      }
    );
  };

  const handleExportCsv = async () => {
    try {
      const res = await fetch("/api/transactions?limit=10000");
      const json = await res.json();
      const transactions = json.data?.data ?? [];

      const csv = [
        "Дата,Описание,Сумма,Тип,Категория,Счёт",
        ...transactions.map((tx: Record<string, unknown>) => {
          const date = new Date(tx.date as string).toLocaleDateString("ru-RU");
          const cat = (tx as Record<string, Record<string, string>>).category;
          const acc = (tx as Record<string, Record<string, string>>).account;
          return `${date},"${tx.description}",${tx.amount},${tx.type},${cat?.name ?? ""},${acc?.name ?? ""}`;
        }),
      ].join("\n");

      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `smartbudget_export_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export failed:", e);
    }
  };

  if (isLoading) {
    return <div className="h-64 bg-muted animate-pulse rounded-lg" />;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Настройки</h1>

      {/* Profile */}
      <Card>
        <CardHeader><CardTitle>Профиль</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Имя</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Валюта</Label>
              <Select value={currency} onValueChange={(v) => v && setCurrency(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="RUB">RUB (₽)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>День зарплаты</Label>
              <Input type="number" min="1" max="31" value={paydayDate} onChange={(e) => setPaydayDate(e.target.value)} />
            </div>
          </div>
          <Button onClick={handleProfileSave} disabled={updateSettings.isPending}>
            Сохранить
          </Button>
        </CardContent>
      </Card>

      {/* Theme */}
      <Card>
        <CardHeader><CardTitle>Оформление</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {(["light", "dark", "system"] as const).map((t) => (
              <Button
                key={t}
                variant={theme === t ? "default" : "outline"}
                onClick={() => setTheme(t)}
              >
                {{ light: "☀️ Светлая", dark: "🌙 Тёмная", system: "💻 Системная" }[t]}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Категории</CardTitle>
          <Button size="sm" onClick={() => setAddCatOpen(true)}>+ Добавить</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(["NEEDS", "WANTS", "SAVINGS"] as const).map((group) => (
              <div key={group}>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  {{ NEEDS: "Необходимое", WANTS: "Желания", SAVINGS: "Сбережения" }[group]}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories
                    ?.filter((c) => c.budgetGroup === group)
                    .map((cat) => (
                      <Badge
                        key={cat.id}
                        variant="secondary"
                        className="gap-1 py-1.5 px-3"
                      >
                        {cat.icon} {cat.name}
                        {!cat.isSystem && (
                          <button
                            className="ml-1 text-muted-foreground hover:text-destructive"
                            onClick={() => {
                              if (confirm(`Удалить категорию "${cat.name}"?`)) {
                                deleteCategory.mutate(cat.id);
                              }
                            }}
                          >
                            ×
                          </button>
                        )}
                      </Badge>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export */}
      <Card>
        <CardHeader><CardTitle>Экспорт данных</CardTitle></CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleExportCsv}>
            Скачать CSV
          </Button>
        </CardContent>
      </Card>

      {/* Add category dialog */}
      <Dialog open={addCatOpen} onOpenChange={setAddCatOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Новая категория</DialogTitle></DialogHeader>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Иконка (emoji)</Label>
                <Input value={catIcon} onChange={(e) => setCatIcon(e.target.value)} placeholder="🎯" required />
              </div>
              <div className="space-y-2">
                <Label>Цвет</Label>
                <Input type="color" value={catColor} onChange={(e) => setCatColor(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Название</Label>
              <Input value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="Название категории" required />
            </div>
            <div className="space-y-2">
              <Label>Группа</Label>
              <Select value={catGroup} onValueChange={(v) => v && setCatGroup(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEEDS">Необходимое</SelectItem>
                  <SelectItem value="WANTS">Желания</SelectItem>
                  <SelectItem value="SAVINGS">Сбережения</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">Создать</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
