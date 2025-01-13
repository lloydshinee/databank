"use client";

import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "@/hooks/use-toast";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Question } from "@/lib/globals";
import { upsertQuestion } from "@/actions/question.action";

export const questionSchema = z.object({
  id: z.string().optional(),
  content: z.string().min(1, "Question content is required"),
  correctAnswer: z.string().min(1, "Correct answer is required"),
  points: z.number().min(1, "Question points are required"),
  reviewerId: z.string(),
  QuestionChoices: z
    .array(
      z.object({
        index: z.string(),
        content: z.string().min(1, "Choice content is required"),
      })
    )
    .length(4, "Exactly 4 choices are required"),
});

export type QuestionFormData = z.infer<typeof questionSchema>;

export default function QuestionForm({
  reviewerId,
  data,
}: {
  reviewerId: string;
  data?: Question;
}) {
  const form = useForm<QuestionFormData>({
    defaultValues: {
      id: data?.id || undefined,
      content: data?.content || "",
      correctAnswer: data?.correctAnswer || "",
      reviewerId: reviewerId,
      points: data?.points || 1,
      QuestionChoices: data?.choices
        ? data?.choices.map((choice) => ({
            index: choice.index || "",
            content: choice.content || "",
          }))
        : [
            { index: "A", content: "" },
            { index: "B", content: "" },
            { index: "C", content: "" },
            { index: "D", content: "" },
          ],
    },
  });

  const handleSubmit = async (data: QuestionFormData) => {
    console.log("Submitted Data:", data);
    await upsertQuestion(data);
    toast({
      title: "Success",
      description: "Question submitted successfully",
    });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="space-y-4 border p-4 rounded-md">
          <h3 className="text-lg font-semibold">Question</h3>

          {/* Question Content */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question Content</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter the question"
                    className="block w-full text-sm border rounded-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Correct Answer */}
          <FormField
            control={form.control}
            name="correctAnswer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correct Answer</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter correct answer"
                    className="block w-full text-sm border rounded-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Question Points */}
          <FormField
            control={form.control}
            name="points"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question Points</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Enter points"
                    className="block w-full text-sm border rounded-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Choices */}
          <div className="space-y-2">
            {form.getValues("QuestionChoices").map((choice, choiceIndex) => (
              <FormField
                key={choiceIndex}
                control={form.control}
                name={`QuestionChoices.${choiceIndex}.content`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{choice.index}. Choice Content</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={`Choice ${choice.index}`}
                        className="block w-full text-sm border rounded-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  );
}
