"use server";

import { StudentFormData } from "@/components/forms/StudentForm";
import prisma from "@/lib/prisma";

export async function createStudent(data: StudentFormData) {
  try {
    await prisma.user.create({
      data: { role: "STUDENT", ...data, yearLevel: parseInt(data.yearLevel) },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getStudents(college?: string) {
  try {
    return await prisma.user.findMany({
      where: {
        role: "STUDENT",
        ...(college ? { college } : {}),
      },
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
}
