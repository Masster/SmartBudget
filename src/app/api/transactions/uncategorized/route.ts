import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    const transactions = await prisma.transaction.findMany({
      where: { userId, status: "UNCATEGORIZED" },
      include: { account: true },
      orderBy: { date: "desc" },
    });
    return successResponse(transactions);
  } catch (e) {
    return errorResponse(String(e), 500);
  }
}
