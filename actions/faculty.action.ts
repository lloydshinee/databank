"use server";

import prisma from "@/lib/prisma";

export async function getFacultys({
  college,
  search,
  page = 1,
  limit = 10,
}: {
  college: string | null;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const skip = (page - 1) * limit;

    // First, get the total count of matching faculty
    const totalCount = await prisma.user.count({
      where: {
        role: "Faculty",
        ...(college && { college }),
        ...(search && {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { schoolId: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
    });

    // Get the paginated student data
    const faculty = await prisma.user.findMany({
      where: {
        role: "Faculty",
        ...(college && { college }),
        ...(search && {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { schoolId: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      skip,
      take: limit,
    });

    return { faculty, totalCount }; // Return both faculty and totalCount
  } catch (error) {
    console.error("Error fetching faculty:", error);
    return { faculty: [], totalCount: 0 };
  }
}
