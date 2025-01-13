"use server";

import { TopicFormData } from "@/components/forms/TopicForm";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTopic(data: TopicFormData) {
  try {
    await prisma.topic.create({
      data,
    });
    console.log("Topic and subtopics created successfully!");
    revalidatePath("/");
  } catch (error) {
    console.error("Error creating topic:", error);
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
