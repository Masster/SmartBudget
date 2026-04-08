import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { updateAccountSchema } from "@/lib/validators";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getCurrentUserId();
    const { id } = await params;
    const body = await req.json();
    const parsed = updateAccountSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message);
    }

    const account = await prisma.account.updateMany({
      where: { id, userId },
      data: parsed.data,
    });
    if (account.count === 0) {
      return errorResponse("Счёт не найден", 404);
    }

    const updated = await prisma.account.findUnique({ where: { id } });
    return successResponse(updated);
  } catch (e) {
    return errorResponse(String(e), 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getCurrentUserId();
    const { id } = await params;

    const result = await prisma.account.updateMany({
      where: { id, userId },
      data: { isActive: false },
    });
    if (result.count === 0) {
      return errorResponse("Счёт не найден", 404);
    }

    return successResponse({ success: true });
  } catch (e) {
    return errorResponse(String(e), 500);
  }
}
