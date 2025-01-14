"use server";

import { SubtopicFormData } from "@/components/forms/SubtopicForm";
import prisma from "@/lib/prisma";

export async function upsertSubtopic(data: SubtopicFormData) {
  try {
    // Validate the data against the schema
    await prisma.subtopic.upsert({
      where: {
        id: data.id || "", // Use an empty string if id is undefined to avoid errors
      },
      update: {
        title: data.title,
        description: data.description,
        topicId: data.topicId,
      },
      create: {
        title: data.title,
        description: data.description,
        topicId: data.topicId,
      },
    });
  } catch (error) {
    console.error("Failed to upsert subtopic:", error);
  }
}
