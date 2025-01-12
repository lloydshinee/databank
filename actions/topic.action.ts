"use server";

import { TopicFormData } from "@/components/forms/TopicForm";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTopic(data: TopicFormData) {
  try {
    // Extract subtopics from the data
    const { subtopics, ...topicData } = data;

    // Create the topic with optional subtopics
    await prisma.topic.create({
      data: {
        ...topicData,
        // Use Prisma's nested writes to handle subtopics
        Subtopic:
          subtopics && subtopics.length > 0
            ? {
                create: subtopics.map((subtopic) => ({
                  title: subtopic.title,
                  description: subtopic.description || null,
                })),
              }
            : undefined,
      },
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
      include: { Subtopic: true },
    });
  } catch (error) {
    console.log(error);
    return [];
  }
}
