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
import { Button } from "../ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { colleges } from "@/lib/globals";
import { createStudent } from "@/actions/student.action";

const schema = z.object({
  email: z
    .string()
    .email("Invalid email")
    .min(2, "Email is required")
    .max(50, "Email is too long"),
  password: z.string().min(8, "Password is weak"),
  firstName: z.string().min(2, "Firstname is required"),
  lastName: z.string().min(2, "Lastname is required"),
  yearLevel: z.string().min(1, "Year Level is required"),
  college: z.string().min(1, "College is required"),
  program: z.string().min(1, "Program is required"),
});

export type StudentFormData = z.infer<typeof schema>;

export function StudentForm({ college }: { college?: string }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [selectedCollege, setSelectedCollege] = useState<string | null>(
    college || null
  );

  const programsForSelectedCollege =
    colleges.find((college) => college.name === selectedCollege)?.programs ||
    [];

  const form = useForm<StudentFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      yearLevel: "",
      college: college || "",
      program: "",
    },
  });

  async function onSubmit(values: StudentFormData) {
    let message;
    setLoading(true);
    try {
      message = "Student Created Successfully";
      await createStudent(values);
    } catch (error) {
      message = "Failed to create Student";
    } finally {
      toast({
        title: "Create Student",
        description: message,
      });
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* First Name Field */}
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="First Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Last Name Field */}
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Last Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Year Level Field */}
        <FormField
          control={form.control}
          name="yearLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year Level</FormLabel>
              <FormControl>
                <Input placeholder="Year Level" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* College Select */}
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
        {/* Program Select */}
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
        <Button type="submit" disabled={loading}>
          Create Student
        </Button>
      </form>
    </Form>
  );
}
