"use server";

import { AdminFormData } from "@/components/forms/AdminForm";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createAdmin(data: AdminFormData) {
  try {
    await prisma.user.create({
      data: {
        role: "Admin",
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });
    revalidatePath("/");
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create Admin");
  }
}

export async function getAdmins() {
  try {
    return await prisma.user.findMany({
      where: { role: "Admin" },
    });
  } catch (error) {
    console.log(error);
    return [];
  }
}
