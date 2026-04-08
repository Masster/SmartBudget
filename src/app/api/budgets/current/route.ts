import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const budget = await prisma.budget.findUnique({
      where: {
        userId_month_year: { userId, month, year },
      },
    });

    if (!budget) {
      return errorResponse("Бюджет на текущий месяц не найден", 404);
    }

    return successResponse(budget);
  } catch (e) {
    return errorResponse(String(e), 500);
  }
}
