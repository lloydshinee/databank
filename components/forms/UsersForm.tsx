"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as XLSX from "xlsx"; // Import the xlsx package

import { Form } from "@/components/ui/form";
import { Button } from "../ui/button";
import { createUsers } from "@/actions/user.action";

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

const usersFormSchema = z.object({
  users: z.array(userFormSchema),
});

export type UsersFormData = z.infer<typeof usersFormSchema>;

interface UsersFormProps {
  role: string;
}

export default function UsersForm({ role }: UsersFormProps) {
  const [userCount, setUserCount] = useState(0);

  const form = useForm<UsersFormData>({
    resolver: zodResolver(usersFormSchema),
    defaultValues: {
      users: [],
    },
  });

  const { append } = useFieldArray({
    control: form.control,
    name: "users",
  });

  // Function to read and parse the Excel file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        // Assuming the data is in the first sheet
        const worksheet = workbook.Sheets[role.toUpperCase()];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Map the Excel data to the expected format
        const mappedUsers = jsonData.map((item: any) => ({
          email: item["Email"] || "",
          contactNumber: item["Contact Number"]
            ? String(item["Contact Number"])
            : "",
          password: item["Password"] || "",
          role: role || "",
          firstName: item["First Name"] || "",
          lastName: item["Last Name"] || "",
          college: item["College"] || "",
          program: item["Program"] || "",
          yearLevel: item["Year Level"]
            ? Number(item["Year Level"])
            : undefined,
          schoolId: item["School ID"] ? String(item["School ID"]) : "",
        }));

        // Append the parsed users to the form
        append(mappedUsers);

        // Update the user count
        setUserCount(mappedUsers.length);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleSubmit = async (data: UsersFormData) => {
    await createUsers(data);
    console.log("Submitted Data:", data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div>
          <label
            htmlFor="file-upload"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Upload Excel File
          </label>
          <input
            type="file"
            id="file-upload"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer"
          />
        </div>

        <div className="text-lg font-semibold">
          {userCount > 0
            ? `${userCount} users total.`
            : "No users uploaded yet."}
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
