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
import { upsertTopic } from "@/actions/topic.action";
import { Topic } from "@/lib/globals";
import { createReviewerLog } from "@/actions/log.action";

const reviewerFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  reviewerId: z.string().min(1, "Reviewer ID is required"),
});

export type TopicFormData = z.infer<typeof reviewerFormSchema>;

export function TopicForm({
  reviewerId,
  data,
}: {
  reviewerId: string;
  data?: Topic;
}) {
  const form = useForm<TopicFormData>({
    resolver: zodResolver(reviewerFormSchema),
    defaultValues: {
      id: data?.id || undefined,
      title: data?.title || "", // Use data's title if available, otherwise empty string
      description: data?.description || "", // Use data's description if available
      reviewerId,
    },
  });

  const onSubmit = async (data: TopicFormData) => {
    await upsertTopic(data);
    createReviewerLog(reviewerId, `Upserted a topic`);
    console.log("Form Data:", data);
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
                <Input placeholder="Topic Title" {...field} />
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
                <Input placeholder="Topic Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Reviewer ID Field (hidden) */}
        <input type="hidden" {...form.register("reviewerId")} />

        {/* Submit Button */}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
