import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { updateCategorySchema } from "@/lib/validators";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getCurrentUserId();
    const { id } = await params;
    const body = await req.json();
    const parsed = updateCategorySchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message);
    }

    const result = await prisma.category.updateMany({
      where: { id, userId },
      data: parsed.data,
    });
    if (result.count === 0) {
      return errorResponse("Категория не найдена", 404);
    }

    const updated = await prisma.category.findUnique({ where: { id } });
    return successResponse(updated);
  } catch (e) {
    return errorResponse(String(e), 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getCurrentUserId();
    const { id } = await params;

    const category = await prisma.category.findFirst({ where: { id, userId } });
    if (!category) {
      return errorResponse("Категория не найдена", 404);
    }
    if (category.isSystem) {
      return errorResponse("Нельзя удалить системную категорию");
    }

    await prisma.category.delete({ where: { id } });
    return successResponse({ success: true });
  } catch (e) {
    return errorResponse(String(e), 500);
  }
}
