"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/budget-calculator";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, Legend,
} from "recharts";
import type { SpendingByCategory, MonthComparison, RecurringPayment } from "@/types";

const FREQ_LABELS: Record<string, string> = {
  WEEKLY: "Еженедельно",
  BIWEEKLY: "Раз в 2 недели",
  MONTHLY: "Ежемесячно",
  YEARLY: "Ежегодно",
};

export default function AnalyticsPage() {
  const { data: spending } = useQuery<SpendingByCategory[]>({
    queryKey: ["analytics", "spending"],
    queryFn: () => api.get("/analytics?type=spending-by-category&months=1"),
  });
  const { data: trend } = useQuery<Array<{ month: string; income: number; expenses: number }>>({
    queryKey: ["analytics", "trend"],
    queryFn: () => api.get("/analytics?type=spending-trend&months=6"),
  });
  const { data: recurring } = useQuery<Array<RecurringPayment & { count: number }>>({
    queryKey: ["analytics", "recurring"],
    queryFn: () => api.get("/analytics?type=recurring-payments"),
  });
  const { data: comparison } = useQuery<MonthComparison[]>({
    queryKey: ["analytics", "comparison"],
    queryFn: () => api.get("/analytics?type=month-comparison&months=3"),
  });

  const totalSpending = spending?.reduce((s, c) => s + c.total, 0) ?? 0;
  const totalRecurring = recurring?.reduce((s, r) => s + r.amount, 0) ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Аналитика</h1>

      <Tabs defaultValue="categories">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="categories">По категориям</TabsTrigger>
          <TabsTrigger value="trend">Тренд</TabsTrigger>
          <TabsTrigger value="comparison">Сравнение</TabsTrigger>
          <TabsTrigger value="recurring">Подписки</TabsTrigger>
        </TabsList>

        {/* Spending by category */}
        <TabsContent value="categories" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Расходы по категориям</CardTitle>
              </CardHeader>
              <CardContent>
                {spending && spending.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={spending}
                        dataKey="total"
                        nameKey="categoryName"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }: { name?: string; percent?: number }) =>
                          `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {spending.map((entry, i) => (
                          <Cell key={i} fill={entry.categoryColor} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatMoney(Number(value))}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-muted-foreground py-12">Нет данных</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Топ категорий</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {spending?.slice(0, 5).map((cat) => (
                  <div key={cat.categoryId} className="flex items-center gap-3">
                    <span className="text-lg">{cat.categoryIcon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span>{cat.categoryName}</span>
                        <span className="font-medium">{formatMoney(cat.total)}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full mt-1">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(cat.total / totalSpending) * 100}%`,
                            backgroundColor: cat.categoryColor,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Spending trend */}
        <TabsContent value="trend">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Доходы и расходы за 6 месяцев</CardTitle>
            </CardHeader>
            <CardContent>
              {trend && trend.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={trend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                    <Tooltip formatter={(value) => formatMoney(Number(value))} />
                    <Area type="monotone" dataKey="income" stroke="#22C55E" fill="#22C55E" fillOpacity={0.2} name="Доходы" />
                    <Area type="monotone" dataKey="expenses" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2} name="Расходы" />
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground py-12">Нет данных</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Month comparison */}
        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Сравнение месяцев</CardTitle>
            </CardHeader>
            <CardContent>
              {comparison && comparison.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={comparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                    <Tooltip formatter={(value) => formatMoney(Number(value))} />
                    <Bar dataKey="income" fill="#22C55E" name="Доходы" />
                    <Bar dataKey="expenses" fill="#EF4444" name="Расходы" />
                    <Bar dataKey="savings" fill="#3B82F6" name="Сбережения" />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground py-12">Нет данных</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recurring payments */}
        <TabsContent value="recurring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Обнаруженные подписки</span>
                {totalRecurring > 0 && (
                  <Badge variant="secondary">
                    ~{formatMoney(totalRecurring)} / мес
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recurring && recurring.length > 0 ? (
                <div className="space-y-3">
                  {recurring.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
                      <div>
                        <p className="font-medium capitalize">{item.description}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {FREQ_LABELS[item.frequency] ?? item.frequency}
                          </Badge>
                          {item.categoryName && (
                            <Badge variant="secondary" className="text-xs">
                              {item.categoryName}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="font-semibold tabular-nums">{formatMoney(item.amount)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-12">
                  Регулярные платежи не обнаружены
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
