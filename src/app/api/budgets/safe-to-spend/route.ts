import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { calculateSafeToSpend } from "@/lib/safe-to-spend";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    const result = await calculateSafeToSpend(userId);
    return successResponse(result);
  } catch (e) {
    return errorResponse(String(e), 500);
  }
}
