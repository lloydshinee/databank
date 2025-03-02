"use server";

import prisma from "@/lib/prisma";

export async function createEditRequest(questionId: string, userId: string) {
  try {
    const existingRequest = await prisma.reviewerEditRequest.findFirst({
      where: {
        questionId,
        status: "Pending",
      },
    });
    if (existingRequest) {
      return {
        success: false,
        message: "A pending request for this question already exists.",
      };
    }
    // Create a new edit request if no pending request exists
    const newRequest = await prisma.reviewerEditRequest.create({
      data: {
        questionId,
        userId,
        status: "Pending", // Default status for new requests
      },
    });

    return {
      success: true,
      message: "Edit request created successfully.",
      request: newRequest,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while creating the edit request.",
    };
  }
}

export async function getEditRequests({
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

    // First, get the total count of matching edit requests
    const totalCount = await prisma.reviewerEditRequest.count({
      where: {
        question: {
          reviewerId,
        },
        status: { in: ["Pending", "Approved"] }, // Filter only Pending and Approved
        ...(search && {
          OR: [
            {
              question: { content: { contains: search, mode: "insensitive" } },
            }, // Search in question content
            { status: { contains: search, mode: "insensitive" } }, // Search in request status
          ],
        }),
      },
    });

    // Get the paginated edit requests data
    const editRequests = await prisma.reviewerEditRequest.findMany({
      where: {
        question: {
          reviewerId,
        },
        status: { in: ["Pending", "Approved"] }, // Filter only Pending and Approved
        ...(search && {
          OR: [
            {
              question: { content: { contains: search, mode: "insensitive" } },
            }, // Search in question content
            { status: { contains: search, mode: "insensitive" } }, // Search in request status
          ],
        }),
      },
      skip,
      take: limit,
      orderBy: [
        { status: "desc" }, // Order by status, assuming "Approved" > "Pending"
        { dateRequested: "desc" }, // Secondary ordering by most recent
      ],
      include: {
        question: {
          include: { choices: true, Topic: true, subtopic: true }, // Include question choices in the result
        },
        user: true, // Include the user who made the request
      },
    });

    return { editRequests, totalCount }; // Return both editRequests and totalCount
  } catch (error) {
    console.error("Error fetching edit requests:", error);
    return { editRequests: [], totalCount: 0 };
  }
}

export async function updateRequestStatus(requestId: string, status: string) {
  try {
    const request = await prisma.reviewerEditRequest.update({
      where: { id: requestId },
      data: { status },
    });

    await prisma.question.update({
      where: { id: request.questionId },
      data: { status: status == "Approved" ? "Unlocked" : "Locked" },
    });
  } catch (error) {
    console.log(error);
  }
}
