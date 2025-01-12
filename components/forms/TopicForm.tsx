"use client";

import { useForm, useFieldArray } from "react-hook-form";
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
import { createTopic } from "@/actions/topic.action";
import { Topic } from "@/lib/globals";

const subtopicSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable().optional(), // Allow null in description
});

const reviewerFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  reviewerId: z.string().min(1, "Reviewer ID is required"),
  subtopics: z.array(subtopicSchema).optional(),
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
      title: data?.title || "", // Use data's title if available, otherwise empty string
      description: data?.description || "", // Use data's description if available
      reviewerId,
      subtopics: data?.Subtopic || [], // Pre-fill subtopics if available
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subtopics",
  });

  const onSubmit = async (data: TopicFormData) => {
    await createTopic(data);
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

        {/* Subtopics */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Subtopics</h3>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-4">
              {/* Subtopic Title */}
              <FormField
                control={form.control}
                name={`subtopics.${index}.title`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Subtopic Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Subtopic Description */}
              <FormField
                control={form.control}
                name={`subtopics.${index}.description`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Subtopic Description"
                        {...field}
                        value={field.value ?? ""} // Ensure the value is not null
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Remove Subtopic Button */}
              <Button type="button" onClick={() => remove(index)}>
                Remove
              </Button>
            </div>
          ))}
        </div>

        {/* Add Subtopic Button */}
        <Button
          type="button"
          className="mr-5"
          onClick={() =>
            append({
              title: "",
              description: "",
            })
          }
        >
          Add Subtopic
        </Button>

        {/* Submit Button */}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
