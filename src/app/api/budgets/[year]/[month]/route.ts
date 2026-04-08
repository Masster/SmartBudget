import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ year: string; month: string }> }
) {
  try {
    const userId = await getCurrentUserId();
    const { year, month } = await params;

    const budget = await prisma.budget.findUnique({
      where: {
        userId_month_year: {
          userId,
          month: parseInt(month, 10),
          year: parseInt(year, 10),
        },
      },
    });

    if (!budget) {
      return errorResponse("Бюджет не найден", 404);
    }

    return successResponse(budget);
  } catch (e) {
    return errorResponse(String(e), 500);
  }
}
