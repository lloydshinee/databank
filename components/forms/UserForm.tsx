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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { colleges } from "@/lib/globals";
import { useState } from "react";
import { User } from "@prisma/client";

const userFormSchema = z.object({
  id: z.string().optional(), // ID is auto-generated
  email: z.string().email("Invalid email address"),
  contactNumber: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().min(2, "Role is required"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  college: z.string().optional(), 
  program: z.string().optional(),
  yearLevel: z.number().optional(),
  schoolId: z.string().optional(),
});

export type UserFormData = z.infer<typeof userFormSchema>;

interface UserFormProps {
  role: string;
  data?: User;
}

export default function UserForm({ role, data }: UserFormProps) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      id: data?.id || "",
      email: data?.email || "",
      contactNumber: data?.contactNumber || "",
      password: data?.password || "",
      role,
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      college: data?.college || "",
      program: data?.program || "",
      yearLevel: data?.yearLevel || undefined,
      schoolId: data?.schoolId || "",
    },
  });

  const [selectedCollege, setSelectedCollege] = useState<string | null>(
    data?.college || null
  );
  const programsForSelectedCollege =
    colleges.find((college) => college.name === selectedCollege)?.programs ||
    [];
  function isFieldVisible(field: string): boolean {
    if (
      role === "Admin" &&
      ["yearLevel", "college", "program"].includes(field)
    ) {
      return false;
    }
    if (role === "Faculty" && (field === "yearLevel" || field === "program")) {
      return false;
    }
    return true;
  }

  const handleSubmit = async (data: UserFormData) => {
    console.log("Form submitted:", data);
    // Add form submission logic here
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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
                <Input type="password" placeholder="Password" {...field} />
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
        {isFieldVisible("yearLevel") && (
          <FormField
            control={form.control}
            name="yearLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year Level</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Year Level" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {/* College Field */}
        {isFieldVisible("college") && (
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
                    form.setValue("program", ""); // Reset program
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
        )}
        {/* Program Field */}
        {isFieldVisible("program") && (
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
                        <SelectItem
                          key={program.shortname}
                          value={program.name}
                        >
                          {program.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none">
                        No programs available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {/* Contact Number Field */}
        <FormField
          control={form.control}
          name="contactNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number</FormLabel>
              <FormControl>
                <Input placeholder="Contact Number" {...field} />
              </FormControl>
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
