"use server";

import prisma from "@/lib/prisma";

export async function updateAttemptQuestionAnswer(
  questionId: string,
  answer: string | null
) {
  try {
    await prisma.reviewerAttemptQuestion.update({
      where: { id: questionId },
      data: { userAnswer: answer },
    });
  } catch (error) {
    console.log(error);
  }
}
