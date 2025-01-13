"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Subtopic } from "@/lib/globals";
import { createSubtopic } from "@/actions/subtopic.action";

// Subtopic validation schema
const subtopicSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(), // Allow null for description
  topicId: z.string().min(1, "Topic ID is required"), // Ensure topicId is provided
});

export type SubtopicFormData = z.infer<typeof subtopicSchema>;

export default function SubtopicForm({
  topicId,
  data,
}: {
  topicId: string;
  data?: Subtopic;
}) {
  const form = useForm<SubtopicFormData>({
    resolver: zodResolver(subtopicSchema),
    defaultValues: {
      id: data?.id || undefined,
      title: data?.title || "", // Pre-fill with existing title if editing
      description: data?.description || "", // Pre-fill with existing description if editing
      topicId, // Always associate with the provided topicId
    },
  });

  const onSubmit = async (data: SubtopicFormData) => {
    try {
      await createSubtopic(data); // Replace with your API call for subtopics
      console.log("Subtopic saved:", data);
    } catch (error) {
      console.error("Error saving subtopic:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Subtopic Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Subtopic Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit">Save Subtopic</Button>
      </form>
    </Form>
  );
}
