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

export async function getLogs({
  reviewerId,
  search,
  page = 1,
  limit = 10,
}: {
  reviewerId: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const skip = (page - 1) * limit;

    // Get the total count of matching logs
    const totalCount = await prisma.reviewerLog.count({
      where: {
        reviewerId,
        ...(search && {
          OR: [{ action: { contains: search } }],
        }),
      },
    });

    // Get the paginated logs data
    const logs = await prisma.reviewerLog.findMany({
      where: {
        reviewerId,
        ...(search && {
          OR: [{ action: { contains: search } }],
        }),
      },
      skip,
      take: limit,
      include: {
        reviewer: true, // Include reviewer details
        user: true, // Include user details
      },
    });

    return { logs, totalCount }; // Return both logs and totalCount
  } catch (error) {
    console.error("Error fetching logs:", error);
    return { logs: [], totalCount: 0 };
  }
}
