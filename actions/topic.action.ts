"use server";

import { TopicFormData } from "@/components/forms/TopicForm";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function upsertTopic(data: TopicFormData) {
  try {
    await prisma.topic.upsert({
      where: {
        id: data.id || "", // Use `id` as the unique identifier. Provide an empty string if `id` is undefined.
      },
      create: {
        title: data.title,
        description: data.description,
        reviewerId: data.reviewerId,
      },
      update: {
        title: data.title,
        description: data.description,
        reviewerId: data.reviewerId,
      },
    });
    console.log("Topic upserted successfully!");
    revalidatePath("/");
  } catch (error) {
    console.error("Error upserting topic:", error);
  }
}

export async function getTopics(reviewerId: string) {
  try {
    return await prisma.topic.findMany({
      where: { reviewerId },
      include: { subtopics: true },
    });
  } catch (error) {
    console.log(error);
    return [];
  }
}
