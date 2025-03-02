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
import { getEditRequests } from "@/actions/editRequest.action"; // Assuming you have the `getEditRequests` function
import QuestionHover from "./QuestionHover";
import CancelRequestButton from "./CancelRequestButton";
import { ApproveRequest } from "@/app/(dashboard)/admin/reviewers/[id]/ApproveRequestButton";
import EditButton from "./EditButton";

export default function EditRequestsTable({
  reviewerId,
}: {
  reviewerId: string;
}) {
  const [editRequests, setEditRequests] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchEditRequests = async () => {
    setLoading(true);
    try {
      const { editRequests, totalCount } = await getEditRequests({
        reviewerId,
        page,
        limit: 5, // Define the limit per page
      });
      setEditRequests(editRequests);
      setTotalPages(Math.ceil(totalCount / 5)); // Calculate the total pages
    } catch (error) {
      console.error("Error fetching edit requests:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEditRequests();
  }, [page]);

  return (
    <div className="space-y-5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Question Content</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Requested By</TableCell>
            <TableCell>Date Requested</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : editRequests.length > 0 ? (
            editRequests.map((request: any) => (
              <TableRow key={request.id}>
                <TableCell>
                  <QuestionHover question={request.question} />
                </TableCell>
                <TableCell>{request.status}</TableCell>
                <TableCell>{`${request.user.firstName} ${request.user.lastName}`}</TableCell>
                <TableCell>
                  {new Date(request.dateRequested).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {request.status == "Pending" ? (
                    <>
                      <CancelRequestButton
                        requestId={request.id}
                        revalidate={fetchEditRequests}
                      />
                      <ApproveRequest
                        requestId={request.id}
                        revalidate={fetchEditRequests}
                      />
                    </>
                  ) : (
                    <>
                      <p className="text-black/70">Will Auto-Lock in 5 days.</p>
                      <EditButton question={request.question} />
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No edit requests found.
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
