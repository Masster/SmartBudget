import { prisma } from "./prisma";
import { getBudgetPeriod } from "./budget-calculator";
import type { SafeToSpendData } from "@/types";

export async function calculateSafeToSpend(userId: string): Promise<SafeToSpendData> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const { start, end } = getBudgetPeriod(user.paydayDate);

  // Get total balance of all active accounts
  const accounts = await prisma.account.findMany({
    where: { userId, isActive: true },
  });
  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

  // Get current budget
  const now = new Date();
  const budget = await prisma.budget.findUnique({
    where: {
      userId_month_year: {
        userId,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      },
    },
  });

  const needsLimit = budget ? Number(budget.needsLimit) : 0;
  const wantsLimit = budget ? Number(budget.wantsLimit) : 0;
  const savingsLimit = budget ? Number(budget.savingsLimit) : 0;

  // Get spending in current period by budget group
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      type: "EXPENSE",
      date: { gte: start, lte: end },
      status: "CATEGORIZED",
    },
    include: { category: true },
  });

  let needsSpent = 0;
  let wantsSpent = 0;
  let savingsSpent = 0;

  for (const tx of transactions) {
    const amount = Math.abs(Number(tx.amount));
    switch (tx.category?.budgetGroup) {
      case "NEEDS":
        needsSpent += amount;
        break;
      case "WANTS":
        wantsSpent += amount;
        break;
      case "SAVINGS":
        savingsSpent += amount;
        break;
    }
  }

  // Safe to Spend = total balance - remaining needs obligation - remaining savings obligation
  const needsRemaining = Math.max(0, needsLimit - needsSpent);
  const savingsRemaining = Math.max(0, savingsLimit - savingsSpent);
  const safeToSpend = totalBalance - needsRemaining - savingsRemaining;

  return {
    safeToSpend: Math.round(safeToSpend * 100) / 100,
    totalBalance: Math.round(totalBalance * 100) / 100,
    needsLimit,
    needsSpent: Math.round(needsSpent * 100) / 100,
    needsRemaining: Math.round(needsRemaining * 100) / 100,
    wantsLimit,
    wantsSpent: Math.round(wantsSpent * 100) / 100,
    savingsLimit,
    savingsSpent: Math.round(savingsSpent * 100) / 100,
    savingsRemaining: Math.round(savingsRemaining * 100) / 100,
    periodStart: start.toISOString(),
    periodEnd: end.toISOString(),
  };
}
