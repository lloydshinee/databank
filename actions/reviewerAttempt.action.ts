"use server";

import { ReviewerAttemptFormData } from "@/components/forms/ReviewerAttemptForm";
import prisma from "@/lib/prisma";

export async function createReviewerAttempt(data: ReviewerAttemptFormData) {
  try {
    const { reviewerId, userId, scope, timeLimit, questionAmount } = data;

    // Calculate expiresAt
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + timeLimit);

    // Distribute questions across the scope
    const scopeDistribution = distributeQuestions(scope, questionAmount);

    // Fetch and randomly pick questions for each scope
    const questionsToAssign = [];
    for (const { topicId, subtopicId, amount } of scopeDistribution) {
      const questions = await prisma.question.findMany({
        where: {
          reviewerId,
          topicId,
          subtopicId,
        },
      });

      // Shuffle and pick the required number of questions
      const shuffled = questions.sort(() => 0.5 - Math.random());
      questionsToAssign.push(...shuffled.slice(0, amount).map((q) => q.id));
    }

    // Create the ReviewerAttempt
    const reviewerAttempt = await prisma.reviewerAttempt.create({
      data: {
        reviewerId,
        userId,
        status: "Ongoing",
        score: 0,
        questionAmount,
        timeLimit,
        expiresAt,
        ReviewerAttemptScope: {
          create: scope.map(({ topicId, subtopicId }) => ({
            topicId,
            subtopicId,
          })),
        },
        ReviewerAttemptQuestion: {
          create: questionsToAssign.map((questionId) => ({
            questionId,
          })),
        },
      },
    });

    return reviewerAttempt;
  } catch (error) {
    console.error("Error creating reviewer attempt:", error);
    throw new Error("Failed to create reviewer attempt.");
  }
}

// Helper function to distribute questions across scopes
function distributeQuestions(
  scope: { topicId: string; subtopicId?: string }[],
  totalAmount: number
) {
  const distribution = [];
  const scopeLength = scope.length;
  const baseAmount = Math.floor(totalAmount / scopeLength);
  const remainder = totalAmount % scopeLength;

  for (let i = 0; i < scopeLength; i++) {
    distribution.push({
      ...scope[i],
      amount: baseAmount + (i < remainder ? 1 : 0), // Distribute the remainder evenly
    });
  }

  return distribution;
}

export async function getReviewerAttempt(attemptId: string) {
  try {
    const reviewerAttempt = await prisma.reviewerAttempt.findUnique({
      where: { id: attemptId },
      include: {
        ReviewerAttemptScope: {
          include: {
            topic: true,
            subtopic: true,
          },
        },
        ReviewerAttemptQuestion: {
          include: {
            question: {
              include: {
                choices: true,
              },
            },
          },
        },
      },
    });

    return reviewerAttempt;
  } catch (error) {
    console.log(error);
    return null;
  }
}
