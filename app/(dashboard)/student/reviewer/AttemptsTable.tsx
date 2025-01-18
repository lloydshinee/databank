"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // Assuming ShadCN button component
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table"; // ShadCN table components
import { getReviewerAttempts } from "@/actions/reviewerAttempt.action"; // Fetch reviewer attempts
import { ReviewerAttempt } from "@/lib/globals"; // Assuming type for ReviewerAttempt
import Link from "next/link";

export default function AttemptsTable({
  reviewerId,
  userId,
}: {
  reviewerId: string;
  userId: string;
}) {
  const [attempts, setAttempts] = useState<ReviewerAttempt[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchAttempts = async () => {
    setLoading(true);
    try {
      const { reviewerAttempts, totalCount } = await getReviewerAttempts({
        reviewerId,
        search: userId,
        page,
        limit: 5,
      });
      setAttempts(reviewerAttempts);
      setTotalPages(Math.ceil(totalCount / 5)); // Correctly calculate total pages
    } catch (error) {
      console.error("Error fetching reviewer attempts:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAttempts();
  }, [page, reviewerId, userId]);

  return (
    <div className="space-y-5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Student</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Score</TableCell>
            <TableCell>Grade</TableCell>
            <TableCell>Time Limit</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : attempts.length > 0 ? (
            attempts.map((attempt: ReviewerAttempt) => (
              <TableRow key={attempt.id}>
                <TableCell>
                  {attempt.user?.firstName} {attempt.user?.lastName}
                </TableCell>
                <TableCell>{attempt.status}</TableCell>
                <TableCell>{attempt.score}</TableCell>
                <TableCell>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      attempt.score >=
                      (2 * (attempt.questions?.length as number)) / 2
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {attempt.score >=
                    (2 * (attempt.questions?.length as number)) / 2
                      ? "Passed"
                      : "Failed"}
                  </span>
                </TableCell>
                <TableCell>{attempt.timeLimit} min</TableCell>
                <TableCell className="flex gap-4">
                  <Link href={`/attempt?attemptId=${attempt.id}`}>
                    <Button variant="link">View</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No attempts found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
