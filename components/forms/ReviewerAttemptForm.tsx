"use client";

import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "@/hooks/use-toast";
import { Topic } from "@/lib/globals";
import { getTopics } from "@/actions/topic.action";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { createReviewerAttempt } from "@/actions/reviewerAttempt.action";
import { useRouter } from "next/navigation";

export const attemptSchema = z.object({
  reviewerId: z.string(),
  userId: z.string(),
  scope: z.array(
    z.object({
      topicId: z.string(),
      subtopicId: z.string().optional(),
    })
  ),
  timeLimit: z
    .number()
    .int()
    .positive()
    .min(30, "Time limit must be at least 30"),
  questionAmount: z
    .number()
    .int()
    .positive()
    .min(30, "Question Amount must be at least 30"),
});

export type ReviewerAttemptFormData = z.infer<typeof attemptSchema>;

export function ReviewerAttemptForm({ reviewerId }: { reviewerId: string }) {
  const [availableTopics, setAvailableTopics] = useState<Topic[]>([]);
  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm<ReviewerAttemptFormData>({
    defaultValues: {
      reviewerId,
      userId: session?.user.id,
      scope: [],
      timeLimit: 30,
      questionAmount: 30,
    },
  });

  const { handleSubmit, setValue, watch } = form;

  const fetchTopics = async () => {
    const fetchedTopics = await getTopics(reviewerId);
    setAvailableTopics(fetchedTopics);
  };

  useEffect(() => {
    fetchTopics();
  }, [reviewerId]);

  const onSubmit = async (data: ReviewerAttemptFormData) => {
    console.log(data);
    const attempt = await createReviewerAttempt(data);

    if (attempt) {
      router.push(`/attempt?attemptId=${attempt.id}`);
    }
    toast({
      title: "Form Submitted",
      description: "Your form was submitted successfully!",
    });
  };

  const scope = watch("scope");

  const handleTopicSelection = (topicId: string) => {
    const isTopicSelected = scope.some((s) => s.topicId === topicId);
    if (isTopicSelected) {
      setValue(
        "scope",
        scope.filter((s) => s.topicId !== topicId)
      );
    } else {
      setValue("scope", [...scope, { topicId, subtopicId: undefined }]);
    }
  };

  const handleSubtopicSelection = (topicId: string, subtopicId: string) => {
    const isSubtopicSelected = scope.some(
      (s) => s.topicId === topicId && s.subtopicId === subtopicId
    );
    const updatedScope = isSubtopicSelected
      ? scope.filter(
          (s) => !(s.topicId === topicId && s.subtopicId === subtopicId)
        )
      : [...scope, { topicId, subtopicId }];
    setValue("scope", updatedScope);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="questionAmount">Question Amount</Label>
          <Input
            id="questionAmount"
            {...form.register("questionAmount", { valueAsNumber: true })}
            className="w-24 p-2 text-sm"
          />
        </div>

        <div>
          <Label htmlFor="timeLimit">Time Limit (in minutes)</Label>
          <Input
            type="number"
            id="timeLimit"
            {...form.register("timeLimit", { valueAsNumber: true })}
            className="w-24 p-2 text-sm"
          />
        </div>

        <div>
          <Label>Topics</Label>
          {availableTopics.map((topic) => {
            const isTopicSelected = scope.some((s) => s.topicId === topic.id);

            return (
              <div key={topic.id} className="mb-4">
                <div
                  className={`cursor-pointer p-3 border-2 rounded-lg transition-all duration-300 ${
                    isTopicSelected
                      ? "bg-blue-100 border-blue-600"
                      : "bg-gray-100 border-gray-300 hover:bg-blue-50"
                  }`}
                  onClick={() => {
                    if (topic.subtopics.length === 0) {
                      handleTopicSelection(topic.id);
                    }
                  }}
                >
                  <span className="font-semibold text-sm">{topic.title}</span>
                </div>

                {topic.subtopics.length > 0 && (
                  <div className="ml-4 mt-2">
                    <Label>Subtopics</Label>
                    {topic.subtopics.map((subtopic) => {
                      const isSubtopicSelected = scope.some(
                        (s) =>
                          s.topicId === topic.id && s.subtopicId === subtopic.id
                      );
                      return (
                        <div
                          key={subtopic.id}
                          className={`cursor-pointer p-3 border-2 rounded-lg transition-all duration-300 mb-2 ${
                            isSubtopicSelected
                              ? "bg-blue-100 border-blue-600"
                              : "bg-gray-100 border-gray-300 hover:bg-blue-50"
                          }`}
                          onClick={() =>
                            handleSubtopicSelection(topic.id, subtopic.id)
                          }
                        >
                          <span className="text-sm">{subtopic.title}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <Button type="submit" className="px-4 py-2 text-sm">
          Submit
        </Button>
      </form>
    </FormProvider>
  );
}
