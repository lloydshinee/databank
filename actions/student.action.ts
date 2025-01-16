"use server";

import { StudentFormData } from "@/components/forms/StudentForm";
import prisma from "@/lib/prisma";

export async function createStudent(data: StudentFormData) {
  try {
    await prisma.user.create({
      data: { role: "Student", ...data, yearLevel: parseInt(data.yearLevel) },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getStudents({
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

    // First, get the total count of matching students
    const totalCount = await prisma.user.count({
      where: {
        role: "Student",
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
    const students = await prisma.user.findMany({
      where: {
        role: "Student",
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

    return { students, totalCount }; // Return both students and totalCount
  } catch (error) {
    console.error("Error fetching students:", error);
    return { students: [], totalCount: 0 };
  }
}
