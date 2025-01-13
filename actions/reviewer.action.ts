"use server";

import { ReviewerFormData } from "@/components/forms/ReviewerForm";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createReviewer(data: ReviewerFormData) {
  try {
    await prisma.reviewer.create({
      data: {
        ...data,
        status: "Closed",
      },
    });
    revalidatePath("/");
  } catch (error) {
    console.log(error);
  }
}

export async function getReviewers() {
  try {
    return await prisma.reviewer.findMany();
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getReviewer(id: string) {
  try {
    return await prisma.reviewer.findUnique({ where: { id } });
  } catch (error) {
    return null;
  }
}

export async function getCollegeReviewers(college: string) {
  try {
    return await prisma.reviewer.findMany({ where: { college } });
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getProgramReviewer(program: string) {
  try {
    return await prisma.reviewer.findUnique({ where: { program } });
  } catch (error) {
    console.log(error);
    return null;
  }
}
