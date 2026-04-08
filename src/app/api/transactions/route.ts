import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { successResponse, errorResponse, parseSearchParams } from "@/lib/api-helpers";
import { createTransactionSchema } from "@/lib/validators";
import type { Prisma } from "@/generated/prisma/client";

export async function GET(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const { page, limit, search, categoryId, accountId, type, dateFrom, dateTo } =
      parseSearchParams(req.url);

    const where: Prisma.TransactionWhereInput = { userId };
    if (search) where.description = { contains: search, mode: "insensitive" };
    if (categoryId) where.categoryId = categoryId;
    if (accountId) where.accountId = accountId;
    if (type) where.type = type as Prisma.EnumTransactionTypeFilter;
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) (where.date as Prisma.DateTimeFilter).gte = new Date(dateFrom);
      if (dateTo) (where.date as Prisma.DateTimeFilter).lte = new Date(dateTo);
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: { category: true, account: true },
        orderBy: { date: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    return successResponse({
      data: transactions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (e) {
    return errorResponse(String(e), 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const body = await req.json();
    const parsed = createTransactionSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message);
    }

    const { accountId, amount, type, date, ...rest } = parsed.data;

    // Atomic: create transaction + update account balance
    const transaction = await prisma.$transaction(async (tx) => {
      const txn = await tx.transaction.create({
        data: {
          ...rest,
          accountId,
          amount,
          type,
          date: new Date(date),
          userId,
          status: rest.categoryId ? "CATEGORIZED" : "UNCATEGORIZED",
        },
        include: { category: true, account: true },
      });

      // Update account balance
      const balanceChange = type === "INCOME" ? Math.abs(amount) : -Math.abs(amount);
      await tx.account.update({
        where: { id: accountId },
        data: { balance: { increment: balanceChange } },
      });

      return txn;
    });

    return successResponse(transaction, 201);
  } catch (e) {
    return errorResponse(String(e), 500);
  }
}
