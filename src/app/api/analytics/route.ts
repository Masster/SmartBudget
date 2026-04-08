import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { successResponse, errorResponse, parseSearchParams } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    switch (type) {
      case "spending-by-category":
        return successResponse(await getSpendingByCategory(userId, searchParams));
      case "spending-trend":
        return successResponse(await getSpendingTrend(userId, searchParams));
      case "recurring-payments":
        return successResponse(await getRecurringPayments(userId));
      case "month-comparison":
        return successResponse(await getMonthComparison(userId, searchParams));
      default:
        return errorResponse("Unknown analytics type. Use: spending-by-category, spending-trend, recurring-payments, month-comparison");
    }
  } catch (e) {
    return errorResponse(String(e), 500);
  }
}

async function getSpendingByCategory(userId: string, params: URLSearchParams) {
  const months = parseInt(params.get("months") ?? "1", 10);
  const since = new Date();
  since.setMonth(since.getMonth() - months);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      type: "EXPENSE",
      date: { gte: since },
      status: "CATEGORIZED",
    },
    include: { category: true },
  });

  const grouped: Record<string, { categoryName: string; categoryIcon: string; categoryColor: string; budgetGroup: string; total: number }> = {};
  for (const tx of transactions) {
    if (!tx.category) continue;
    const key = tx.categoryId!;
    if (!grouped[key]) {
      grouped[key] = {
        categoryName: tx.category.name,
        categoryIcon: tx.category.icon,
        categoryColor: tx.category.color,
        budgetGroup: tx.category.budgetGroup,
        total: 0,
      };
    }
    grouped[key].total += Math.abs(Number(tx.amount));
  }

  return Object.entries(grouped)
    .map(([categoryId, data]) => ({ categoryId, ...data }))
    .sort((a, b) => b.total - a.total);
}

async function getSpendingTrend(userId: string, params: URLSearchParams) {
  const months = parseInt(params.get("months") ?? "6", 10);
  const result: Array<{ month: string; income: number; expenses: number }> = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const year = date.getFullYear();
    const month = date.getMonth();
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const transactions = await prisma.transaction.findMany({
      where: { userId, date: { gte: start, lte: end } },
    });

    let income = 0;
    let expenses = 0;
    for (const tx of transactions) {
      const amount = Number(tx.amount);
      if (amount > 0) income += amount;
      else expenses += Math.abs(amount);
    }

    const monthName = start.toLocaleDateString("ru-RU", { month: "short", year: "2-digit" });
    result.push({ month: monthName, income: Math.round(income), expenses: Math.round(expenses) });
  }

  return result;
}

async function getRecurringPayments(userId: string) {
  // Detect recurring by finding transactions with same description appearing 2+ times
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      type: "EXPENSE",
      date: { gte: threeMonthsAgo },
    },
    include: { category: true },
    orderBy: { date: "desc" },
  });

  // Group by normalized description
  const groups: Record<string, Array<{ amount: number; date: Date; categoryName?: string }>> = {};
  for (const tx of transactions) {
    const key = tx.description.toLowerCase().trim();
    if (!groups[key]) groups[key] = [];
    groups[key].push({
      amount: Math.abs(Number(tx.amount)),
      date: tx.date,
      categoryName: tx.category?.name,
    });
  }

  // Filter to recurring (2+ occurrences with similar amounts)
  const recurring = Object.entries(groups)
    .filter(([, txs]) => txs.length >= 2)
    .map(([description, txs]) => {
      const avgAmount = txs.reduce((s, t) => s + t.amount, 0) / txs.length;
      const lastDate = txs[0].date;
      const daysBetween = txs.length >= 2
        ? Math.abs(txs[0].date.getTime() - txs[txs.length - 1].date.getTime()) / (1000 * 60 * 60 * 24) / (txs.length - 1)
        : 30;

      let frequency = "MONTHLY";
      if (daysBetween < 10) frequency = "WEEKLY";
      else if (daysBetween < 20) frequency = "BIWEEKLY";
      else if (daysBetween > 300) frequency = "YEARLY";

      return {
        description: txs[0].categoryName ? `${description}` : description,
        amount: Math.round(avgAmount),
        frequency,
        lastDate: lastDate.toISOString(),
        categoryName: txs[0].categoryName,
        count: txs.length,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  return recurring;
}

async function getMonthComparison(userId: string, params: URLSearchParams) {
  const months = parseInt(params.get("months") ?? "3", 10);
  const result: Array<{ month: string; income: number; expenses: number; savings: number }> = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const year = date.getFullYear();
    const month = date.getMonth();
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const transactions = await prisma.transaction.findMany({
      where: { userId, date: { gte: start, lte: end } },
      include: { category: true },
    });

    let income = 0;
    let expenses = 0;
    let savings = 0;
    for (const tx of transactions) {
      const amount = Number(tx.amount);
      if (amount > 0) {
        income += amount;
      } else {
        if (tx.category?.budgetGroup === "SAVINGS") {
          savings += Math.abs(amount);
        } else {
          expenses += Math.abs(amount);
        }
      }
    }

    const monthName = start.toLocaleDateString("ru-RU", { month: "long" });
    result.push({
      month: monthName,
      income: Math.round(income),
      expenses: Math.round(expenses),
      savings: Math.round(savings),
    });
  }

  return result;
}
