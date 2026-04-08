export type {
  User,
  Account,
  Category,
  Transaction,
  Budget,
  UserSettings,
  RecurringTransaction,
  Session,
} from "../generated/prisma/client";

export {
  AccountType,
  BudgetGroup,
  TransactionType,
  SwipeStatus,
} from "../generated/prisma/enums";

export interface SafeToSpendData {
  safeToSpend: number;
  totalBalance: number;
  needsRemaining: number;
  wantsSpent: number;
  wantsLimit: number;
  savingsRemaining: number;
  needsLimit: number;
  savingsLimit: number;
  needsSpent: number;
  savingsSpent: number;
  periodStart: string;
  periodEnd: string;
}

export interface BudgetProgress {
  group: "NEEDS" | "WANTS" | "SAVINGS";
  label: string;
  spent: number;
  limit: number;
  percent: number;
}

export interface SpendingByCategory {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  budgetGroup: string;
  total: number;
}

export interface MonthComparison {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface RecurringPayment {
  description: string;
  amount: number;
  frequency: string;
  lastDate: string;
  categoryName?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
