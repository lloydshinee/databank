"use server";

import { QuestionsFormData } from "@/components/forms/QuestionsForm";
import prisma from "@/lib/prisma";

export async function createQuestions(data: QuestionsFormData) {
  try {
    // Create questions with nested choices
    const questionData = data.questions.map((question) => ({
      content: question.content,
      correctAnswer: question.correctAnswer,
      reviewerId: question.reviewerId,
      QuestionChoices: {
        create: question.choices.map((choice) => ({
          content: choice.content,
          index: choice.index,
        })),
      },
    }));

    // Use Prisma's `createMany` for bulk creation
    await prisma.$transaction(
      questionData.map((question) =>
        prisma.question.create({
          data: question,
        })
      )
    );

    console.log("Questions created successfully.");
  } catch (error) {
    console.error("Error creating questions:", error);
    throw new Error("Failed to create questions.");
  }
}
