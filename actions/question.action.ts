"use server";

import { QuestionFormData } from "@/components/forms/QuestionForm";
import { QuestionsFormData } from "@/components/forms/QuestionsForm";
import prisma from "@/lib/prisma";

export async function createQuestions(data: QuestionsFormData) {
  try {
    // Create questions with nested choices
    const questionData = data.questions.map((question) => ({
      content: String(question.content),
      image: String(question.image),
      correctAnswer: String(question.correctAnswer),
      reviewerId: String(question.reviewerId),
      points: Number(question.points),
      choices: {
        create: question.choices.map((choice) => ({
          content: String(choice.content),
          index: String(choice.index),
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

export async function upsertQuestion(data: QuestionFormData) {
  try {
    await prisma.question.upsert({
      where: { id: data.id || "" }, // Use the `id` if provided; otherwise fallback to an empty string
      update: {
        content: data.content,
        image: data.image,
        correctAnswer: data.correctAnswer,
        reviewerId: data.reviewerId,
        points: data.points,
        choices: {
          deleteMany: {}, // Clear existing choices for the data
          create: data.QuestionChoices.map((choice) => ({
            content: choice.content,
            index: choice.index,
          })),
        },
      },
      create: {
        content: data.content,
        image: data.image,
        correctAnswer: data.correctAnswer,
        reviewerId: data.reviewerId,
        points: data.points,
        choices: {
          create: data.QuestionChoices.map((choice) => ({
            content: choice.content,
            index: choice.index,
          })),
        },
      },
    });
    console.log("Questions upserted successfully.");
  } catch (error) {
    console.error("Error upserting questions:", error);
    throw new Error("Failed to upsert questions.");
  }
}

export async function getQuestions({
  reviewerId,
  search,
  page = 1,
  limit = 10,
}: {
  reviewerId: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const skip = (page - 1) * limit;

    // First, get the total count of matching questions
    const totalCount = await prisma.question.count({
      where: {
        reviewerId,
        ...(search && {
          OR: [{ content: { contains: search, mode: "insensitive" } }],
        }),
      },
    });

    // Get the paginated questions data
    const questions = await prisma.question.findMany({
      where: {
        reviewerId,
        ...(search && {
          OR: [{ content: { contains: search, mode: "insensitive" } }],
        }),
      },
      skip,
      take: limit,
      include: {
        choices: true, // Include question choices in the result
      },
    });

    return { questions, totalCount }; // Return both questions and totalCount
  } catch (error) {
    console.error("Error fetching questions:", error);
    return { questions: [], totalCount: 0 };
  }
}

export async function assignTopic(
  questionId: string,
  data: { topicId: string | undefined; subtopicId: string | undefined }
) {
  try {
    await prisma.question.update({
      where: { id: questionId },
      data: {
        topicId: data.topicId,
        subtopicId: data.subtopicId ? data.subtopicId : null,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function updateQuestionStatus(questionId: string, status: string) {
  try {
    await prisma.question.update({
      where: { id: questionId },
      data: { status },
    });
    console.log("Updated");
  } catch (error) {
    console.log(error);
  }
}
