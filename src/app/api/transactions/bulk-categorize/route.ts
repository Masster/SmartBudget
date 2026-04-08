import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { bulkCategorizeSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const body = await req.json();
    const parsed = bulkCategorizeSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message);
    }

    await prisma.$transaction(
      parsed.data.transactions.map((tx) =>
        prisma.transaction.updateMany({
          where: { id: tx.id, userId },
          data: { categoryId: tx.categoryId, status: "CATEGORIZED" },
        })
      )
    );

    return successResponse({ success: true, count: parsed.data.transactions.length });
  } catch (e) {
    return errorResponse(String(e), 500);
  }
}
