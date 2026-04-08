import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { updateSettingsSchema, updateUserProfileSchema } from "@/lib/validators";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    const [user, settings] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.userSettings.findUnique({ where: { userId } }),
    ]);
    return successResponse({ user, settings });
  } catch (e) {
    return errorResponse(String(e), 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const body = await req.json();

    const profileParsed = updateUserProfileSchema.safeParse(body);
    const settingsParsed = updateSettingsSchema.safeParse(body);

    const profileData = profileParsed.success ? profileParsed.data : {};
    const settingsData = settingsParsed.success ? settingsParsed.data : {};

    const [user, settings] = await Promise.all([
      Object.keys(profileData).length > 0
        ? prisma.user.update({ where: { id: userId }, data: profileData })
        : prisma.user.findUnique({ where: { id: userId } }),
      Object.keys(settingsData).length > 0
        ? prisma.userSettings.upsert({
            where: { userId },
            update: settingsData,
            create: { userId, ...settingsData },
          })
        : prisma.userSettings.findUnique({ where: { userId } }),
    ]);

    return successResponse({ user, settings });
  } catch (e) {
    return errorResponse(String(e), 500);
  }
}
