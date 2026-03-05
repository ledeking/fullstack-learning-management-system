import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
import { UserRole } from "@prisma/client";

export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  if (!user) return null;

  // Sync user with database
  const dbUser = await db.user.upsert({
    where: { clerkId: userId },
    update: {
      email: user.emailAddresses[0]?.emailAddress || "",
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      imageUrl: user.imageUrl || null,
    },
    create: {
      clerkId: userId,
      email: user.emailAddresses[0]?.emailAddress || "",
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      imageUrl: user.imageUrl || null,
      role: UserRole.STUDENT,
    },
  });

  return dbUser;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireRole(role: UserRole) {
  const user = await requireAuth();
  if (user.role !== role && user.role !== UserRole.ADMIN) {
    throw new Error("Forbidden");
  }
  return user;
}
