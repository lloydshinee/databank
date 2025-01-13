"use server";

import { SubtopicFormData } from "@/components/forms/SubtopicForm";
import prisma from "@/lib/prisma";

export async function createSubtopic(data: SubtopicFormData) {
  try {
    await prisma.subtopic.create({ data });
  } catch (error) {
    console.log(error);
  }
}
