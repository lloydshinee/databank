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
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { createAdmin } from "@/actions/admin.action";

const schema = z.object({
  email: z.string().min(2, "Email is required").max(50, "Email is too long"),
  password: z.string().min(8, "Password is weak"),
  firstName: z.string().min(2, "Firstname is required"),
  lastName: z.string().min(2, "Lastname is required"),
});

export type AdminFormData = z.infer<typeof schema>;

export function AdminForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // React Hook Form setup with Zod validation
  const form = useForm<AdminFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  async function onSubmit(values: AdminFormData) {
    let message;
    setLoading(true);
    try {
      await createAdmin(values);
      message = "Admin Created Succesfully";
    } catch (err) {
      message = "Failed to create Admin";
      console.log(err);
    } finally {
      toast({
        title: "Create Admin",
        description: message,
      });
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Firstname</FormLabel>
              <FormControl>
                <Input placeholder="Firstname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lastname</FormLabel>
              <FormControl>
                <Input placeholder="Lastname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          Create Admin
        </Button>
      </form>
    </Form>
  );
}
