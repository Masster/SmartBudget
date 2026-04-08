import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { createAccountSchema } from "@/lib/validators";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    const accounts = await prisma.account.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: "asc" },
    });
    return successResponse(accounts);
  } catch (e) {
    return errorResponse(String(e), 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const body = await req.json();
    const parsed = createAccountSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message);
    }

    const account = await prisma.account.create({
      data: { ...parsed.data, userId },
    });
    return successResponse(account, 201);
  } catch (e) {
    return errorResponse(String(e), 500);
  }
}
