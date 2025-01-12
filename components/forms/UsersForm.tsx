"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as XLSX from "xlsx"; // Import the xlsx package

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
import { createUsers } from "@/actions/user.action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { colleges } from "@/lib/globals";

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
  const form = useForm<UsersFormData>({
    resolver: zodResolver(usersFormSchema),
    defaultValues: {
      users: [
        // {
        //   idnum: "",
        //   first_name: "",
        //   last_name: "",
        //   year_level: undefined,
        //   college_id: "",
        //   program_id: "",
        //   email: "",
        //   password: "",
        //   password_confirmation: "",
        //   phone_number: "",
        //   role: role || "",
        // },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
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
          contactNumber: item["Contact Number"] || "",
          password: item["Password"] || "",
          role: role || "",
          firstName: item["First Name"] || "",
          lastName: item["Last Name"] || "",
          college: item["College"] || "",
          program: item["Program"] || "",
          yearLevel: item["Year Level"] || undefined,
          studentId: item["Student ID"] || "",
        }));

        // Append the parsed users to the form
        append(mappedUsers);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  function isFieldVisible(field: string): boolean {
    if (
      role === "admin" &&
      ["year_level", "college_id", "program_id"].includes(field)
    ) {
      return false;
    }
    if ((role === "faculty" || role === "dean") && field === "year_level") {
      return false;
    }
    return true;
  }

  const handleAddUser = () => {
    append({
      id: "",
      firstName: "",
      lastName: "",
      yearLevel: undefined,
      college: "",
      program: "",
      email: "",
      password: "",
      contactNumber: "",
      role: role || "",
    });
  };

  const handleRemoveUser = (index: number) => {
    remove(index);
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

        {fields.map((field, index) => {
          // Compute selected college and programs for current user
          const selectedCollege = form.watch(`users.${index}.college`) || null;
          const programsForSelectedCollege =
            colleges.find((college) => college.name === selectedCollege)
              ?.programs || [];

          return (
            <div key={field.id} className="space-y-4 border p-4 rounded-md">
              <h3>User {index + 1}</h3>

              {/* ID Number Field */}
              {isFieldVisible("idnum") && (
                <FormField
                  control={form.control}
                  name={`users.${index}.id` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Number</FormLabel>
                      <FormControl>
                        <Input placeholder="ID Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* First Name Field */}
              <FormField
                control={form.control}
                name={`users.${index}.firstName` as const}
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
                name={`users.${index}.lastName` as const}
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
              {isFieldVisible("year_level") && (
                <FormField
                  control={form.control}
                  name={`users.${index}.yearLevel` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year Level</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Year Level"
                          {...field}
                        />
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
                  name={`users.${index}.college` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>College</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue(`users.${index}.program`, ""); // Reset program
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
                            <SelectItem
                              key={college.shortname}
                              value={college.name}
                            >
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
                  name={`users.${index}.program` as const}
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

              {/* Email Field */}
              <FormField
                control={form.control}
                name={`users.${index}.email` as const}
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
                name={`users.${index}.password` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number Field */}
              <FormField
                control={form.control}
                name={`users.${index}.contactNumber` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remove User Button */}
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleRemoveUser(index)}
              >
                Remove User
              </Button>
            </div>
          );
        })}

        <Button type="button" onClick={handleAddUser}>
          Add New User
        </Button>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
