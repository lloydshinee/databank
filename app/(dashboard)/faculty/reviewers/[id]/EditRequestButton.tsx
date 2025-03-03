"use client";

import { createEditRequest } from "@/actions/editRequest.action";
import { notifyAdmin } from "@/actions/notifications";
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

export function EditRequest({
  questionId,
  reviewerId,
}: {
  questionId: string;
  reviewerId: string;
}) {
  const { data: session } = useSession();
  const { toast } = useToast();

  if (session?.user.role != "Faculty") return null;

  const handleRequest = async () => {
    const res = await createEditRequest(questionId, session.user.id as string);
    await notifyAdmin(
      `A faculty member from College of ${session.user.college} has requested to edit a question. Please review the request.`,
      `/admin/reviewers/${reviewerId}`
    );
    toast({
      title: "Edit Request",
      description: res.message,
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="outline">Request Edit</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Request Question Edit</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to submit a request to the admin to edit the question.
            Please confirm your request. An admin will review it shortly.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleRequest}>
            Submit Request
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
