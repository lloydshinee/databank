"use server";

import { ReviewerAttemptFormData } from "@/components/forms/ReviewerAttemptForm";
import prisma from "@/lib/prisma";
import { checkAttemptAnswers } from "./attemptQuestion.action";

export async function createReviewerAttempt(data: ReviewerAttemptFormData) {
  try {
    const { reviewerId, userId, scope, timeLimit, questionAmount } = data;

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
        scopes: {
          create: scope.map(({ topicId, subtopicId }) => ({
            topicId,
            subtopicId,
          })),
        },
        questions: {
          create: questionsToAssign.map((questionId, i) => ({
            number: i,
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
        scopes: {
          include: {
            topic: true,
            subtopic: true,
          },
        },
        user: true,
        questions: {
          include: {
            question: {
              include: {
                choices: true,
              },
            },
          },
          orderBy: {
            number: "asc",
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

export async function getOngoingAttempt(userId: string) {
  try {
    // Fetch the ongoing attempt
    const attempt = await prisma.reviewerAttempt.findFirst({
      where: {
        userId, // Ensure the attempt belongs to the provided userId
        status: "Ongoing",
      },
    });
    // If no ongoing attempt exists, return null
    if (!attempt) {
      return null;
    }
    // Check if the attempt has expired
    const now = new Date();
    if (new Date(attempt.expiresAt) <= now) {
      // If expired, update the status to "Expired"
      await checkAttemptAnswers(attempt.id);

      return null; // Return null for expired attempts
    }
    // If not expired, return the attempt
    return attempt;
  } catch (error) {
    console.log(error);
    return null; // Handle errors gracefully
  }
}

export async function getReviewerAttempts({
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

    // First, get the total count of matching reviewer attempts
    const totalCount = await prisma.reviewerAttempt.count({
      where: {
        reviewerId,
        ...(search && {
          user: {
            OR: [
              { schoolId: { contains: search } },
              { firstName: { contains: search } },
              { lastName: { contains: search } },
            ],
          },
        }),
      },
    });

    // Get the paginated reviewer attempts data
    const reviewerAttempts = await prisma.reviewerAttempt.findMany({
      where: {
        reviewerId,
        ...(search && {
          user: {
            OR: [
              { schoolId: { contains: search } },
              { firstName: { contains: search } },
              { lastName: { contains: search } },
            ],
          },
        }),
      },
      skip,
      take: limit,
      orderBy: {
        dateCreated: "desc",
      },
      include: {
        user: true,
        questions: {
          include: { question: { include: { choices: true } } },
        },
        scopes: {
          include: {
            topic: true,
            subtopic: true,
          },
        },
      },
    });

    return { reviewerAttempts, totalCount }; // Return both reviewerAttempts and totalCount
  } catch (error) {
    console.error("Error fetching reviewer attempts:", error);
    return { reviewerAttempts: [], totalCount: 0 };
  }
}

export async function getUserReviewerAttempts(userId: string) {
  try {
    return await prisma.reviewerAttempt.findMany({
      where: { userId },
      orderBy: {
        dateCreated: "desc",
      },
    });
  } catch (error) {
    console.log(error);
    return [];
  }
}
