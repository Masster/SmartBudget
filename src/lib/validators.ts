import { z } from "zod";

// Accounts
export const createAccountSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  type: z.enum(["CHECKING", "SAVINGS", "CREDIT", "CASH", "INVESTMENT"]),
  balance: z.number().default(0),
  currency: z.string().default("RUB"),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export const updateAccountSchema = createAccountSchema.partial();

// Categories
export const createCategorySchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  icon: z.string().min(1),
  color: z.string().min(1),
  budgetGroup: z.enum(["NEEDS", "WANTS", "SAVINGS"]),
  sortOrder: z.number().int().default(0),
});

export const updateCategorySchema = createCategorySchema.partial();

// Transactions
export const createTransactionSchema = z.object({
  accountId: z.string().min(1),
  categoryId: z.string().nullable().optional(),
  amount: z.number(),
  description: z.string().min(1, "Описание обязательно"),
  date: z.string().or(z.date()),
  type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const swipeCategorizeSchema = z.object({
  categoryId: z.string(),
  budgetGroup: z.enum(["NEEDS", "WANTS", "SAVINGS"]),
});

export const bulkCategorizeSchema = z.object({
  transactions: z.array(
    z.object({
      id: z.string(),
      categoryId: z.string(),
    })
  ),
});

// Budget
export const createBudgetSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2020),
  totalIncome: z.number().min(0),
  needsLimit: z.number().min(0),
  wantsLimit: z.number().min(0),
  savingsLimit: z.number().min(0),
});

// Settings
export const updateSettingsSchema = z.object({
  budgetMethod: z.enum(["50_30_20", "zero_based", "custom"]).optional(),
  needsPercent: z.number().int().min(0).max(100).optional(),
  wantsPercent: z.number().int().min(0).max(100).optional(),
  savingsPercent: z.number().int().min(0).max(100).optional(),
  notificationsOn: z.boolean().optional(),
  weekStartDay: z.number().int().min(0).max(6).optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
});

export const updateUserProfileSchema = z.object({
  name: z.string().optional(),
  currency: z.string().optional(),
  paydayDate: z.number().int().min(1).max(31).optional(),
});
