import { prisma } from "./prisma";

const MULTI_USER = process.env.MULTI_USER === "true";

export async function getCurrentUserId(): Promise<string> {
  if (!MULTI_USER) {
    const user = await prisma.user.findFirst();
    if (!user) {
      throw new Error("No default user found. Run prisma db seed first.");
    }
    return user.id;
  }

  // TODO: Multi-user mode — extract from session/JWT
  throw new Error("Multi-user auth not implemented yet");
}
