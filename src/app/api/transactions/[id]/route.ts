import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { updateTransactionSchema } from "@/lib/validators";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getCurrentUserId();
    const { id } = await params;
    const body = await req.json();
    const parsed = updateTransactionSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message);
    }

    const existing = await prisma.transaction.findFirst({ where: { id, userId } });
    if (!existing) {
      return errorResponse("Транзакция не найдена", 404);
    }

    const updateData: Record<string, unknown> = { ...parsed.data };
    if (updateData.date) updateData.date = new Date(updateData.date as string);
    if (updateData.categoryId) updateData.status = "CATEGORIZED";

    const updated = await prisma.transaction.update({
      where: { id },
      data: updateData,
      include: { category: true, account: true },
    });
    return successResponse(updated);
  } catch (e) {
    return errorResponse(String(e), 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getCurrentUserId();
    const { id } = await params;

    const existing = await prisma.transaction.findFirst({ where: { id, userId } });
    if (!existing) {
      return errorResponse("Транзакция не найдена", 404);
    }

    // Atomic: delete transaction + reverse balance
    await prisma.$transaction(async (tx) => {
      await tx.transaction.delete({ where: { id } });

      const balanceChange = existing.type === "INCOME"
        ? -Math.abs(Number(existing.amount))
        : Math.abs(Number(existing.amount));
      await tx.account.update({
        where: { id: existing.accountId },
        data: { balance: { increment: balanceChange } },
      });
    });

    return successResponse({ success: true });
  } catch (e) {
    return errorResponse(String(e), 500);
  }
}
