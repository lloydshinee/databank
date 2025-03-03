"use client";

import { updateRequestStatus } from "@/actions/editRequest.action";
import { createNotification } from "@/actions/notifications";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

export function ApproveRequest({
  requestId,
  userId,
  reviewerId,
  revalidate,
}: {
  requestId: string;
  userId: string;
  reviewerId: string;
  revalidate: () => void;
}) {
  const { data: session } = useSession();
  const { toast } = useToast();

  if (session?.user.role != "Admin") return null;

  const handleApprove = async () => {
    await updateRequestStatus(requestId, "Approved");
    await createNotification(
      userId,
      "Admin approved your request.",
      `/faculty/reviewers/${reviewerId}`
    );
    toast({
      title: "Approve Request",
      description: "Request approved successfully.",
    });
    revalidate();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="outline">Approve Request</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve Edit Request</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to approve this edit request. The changes will now be
            processed. Please confirm this action.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleApprove}>
            Approve Request
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
