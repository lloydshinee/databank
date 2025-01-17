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

export async function checkAttemptAnswers(attemptId: string) {
  try {
    const attempt = await prisma.reviewerAttempt.findUnique({
      where: { id: attemptId },
      include: {
        questions: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!attempt) {
      throw new Error(`Attempt with ID ${attemptId} not found.`);
    }

    let totalScore = 0;

    // Evaluate each question in the attempt
    for (const attemptQuestion of attempt.questions) {
      const { userAnswer, question } = attemptQuestion;

      // Check if the user's answer matches the correct answer
      if (userAnswer && userAnswer.trim() === question.correctAnswer.trim()) {
        totalScore += question.points; // Add the points for a correct answer
      }
    }
    // Update the attempt with the calculated score and status
    await prisma.reviewerAttempt.update({
      where: { id: attempt.id },
      data: {
        status: "Expired",
        score: totalScore,
      },
    });
  } catch (error) {
    console.error("Error checking attempt answers:", error);
    throw new Error("Failed to evaluate the attempt.");
  }
}
