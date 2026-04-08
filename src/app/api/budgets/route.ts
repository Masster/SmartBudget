import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { createBudgetSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const body = await req.json();
    const parsed = createBudgetSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message);
    }

    const budget = await prisma.budget.upsert({
      where: {
        userId_month_year: {
          userId,
          month: parsed.data.month,
          year: parsed.data.year,
        },
      },
      update: parsed.data,
      create: { ...parsed.data, userId },
    });

    return successResponse(budget, 201);
  } catch (e) {
    return errorResponse(String(e), 500);
  }
}
