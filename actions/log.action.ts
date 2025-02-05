"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function createReviewerLog(reviewerId: string, action: string) {
  try {
    const session = await auth();
    if (!session?.user) return;

    await prisma.reviewerLog.create({
      data: { reviewerId, action, userId: session.user.id as string },
    });
  } catch (error) {
    console.log(error);
  }
}
