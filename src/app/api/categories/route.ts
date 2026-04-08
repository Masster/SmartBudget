import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { createCategorySchema } from "@/lib/validators";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    const categories = await prisma.category.findMany({
      where: { userId },
      orderBy: { sortOrder: "asc" },
    });
    return successResponse(categories);
  } catch (e) {
    return errorResponse(String(e), 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const body = await req.json();
    const parsed = createCategorySchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message);
    }

    const category = await prisma.category.create({
      data: { ...parsed.data, userId },
    });
    return successResponse(category, 201);
  } catch (e) {
    return errorResponse(String(e), 500);
  }
}
