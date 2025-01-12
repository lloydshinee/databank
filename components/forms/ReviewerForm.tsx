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
import { Textarea } from "@/components/ui/textarea"; // Assuming ShadCN Textarea component
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { colleges } from "@/lib/globals"; // Assuming colleges is an array of college objects
import { useState } from "react";
import { createReviewer } from "@/actions/reviewer.action";

const schema = z.object({
  id: z.string().optional(), // ID is auto-generated
  title: z.string(),
  description: z.string().optional(),
  college: z.string(),
  program: z.string(),
});

export type ReviewerFormData = z.infer<typeof schema>;

export default function ReviewerForm() {
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);
  const programsForSelectedCollege =
    colleges.find((college) => college.name === selectedCollege)?.programs ||
    [];

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      college: "",
      program: "",
    },
  });

  const handleSubmit = async (data: any) => {
    console.log("Form submitted:", data);
    await createReviewer(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
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
                <Textarea placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* College Field */}
        <FormField
          control={form.control}
          name="college"
          render={({ field }) => (
            <FormItem>
              <FormLabel>College</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedCollege(value);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select College" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {colleges.map((college) => (
                    <SelectItem key={college.shortname} value={college.name}>
                      {college.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Program Field */}
        <FormField
          control={form.control}
          name="program"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Program</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={!selectedCollege}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Program" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {programsForSelectedCollege.length > 0 ? (
                    programsForSelectedCollege.map((program) => (
                      <SelectItem key={program.shortname} value={program.name}>
                        {program.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none">No programs available</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Submit Button */}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
