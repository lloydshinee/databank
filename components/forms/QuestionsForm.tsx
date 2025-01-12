"use client";

import { z } from "zod";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import * as XLSX from "xlsx";
import { useState } from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "@/hooks/use-toast";

const questionSchema = z.object({
  content: z.string().min(1, "Question content is required"),
  correctAnswer: z.string().min(1, "Correct answer is required"),
  points: z.number().min(1, "Question points must be at least 1"),
  reviewerId: z.string(),
  choices: z
    .array(
      z.object({
        index: z.string(),
        content: z.string().min(1, "Choice content is required"),
      })
    )
    .length(4, "Exactly 4 choices are required"),
});

export const questionsFormSchema = z.object({
  questions: z.array(questionSchema),
});

export type QuestionsFormData = z.infer<typeof questionsFormSchema>;

export default function QuestionsForm({ reviewerId }: { reviewerId: string }) {
  const [questionCount, setQuestionCount] = useState(0);
  const form = useForm<QuestionsFormData>({
    defaultValues: {
      questions: [],
    },
  });

  const { append } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast({
        title: "Error",
        description: "No file selected",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets["QUESTIONS"];
        if (!worksheet) {
          toast({
            title: "Error",
            description: "No 'QUESTIONS' sheet found in the file.",
          });
          return;
        }

        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const mappedQuestions = jsonData.map((item: any) => ({
          content: item["Question"] || "",
          correctAnswer: item["Correct Answer"] || "",
          points: Number(item["Points"]) || 1,
          reviewerId,
          choices: [
            { index: "A", content: item["A"] || "" },
            { index: "B", content: item["B"] || "" },
            { index: "C", content: item["C"] || "" },
            { index: "D", content: item["D"] || "" },
          ],
        }));

        if (mappedQuestions.some((q) => !q.content || !q.correctAnswer)) {
          toast({
            title: "Error",
            description: "Some questions or answers are missing.",
          });
          return;
        }

        append(mappedQuestions);
        setQuestionCount(mappedQuestions.length);
      } catch (err) {
        console.log(err);
        toast({
          title: "Error",
          description: "Invalid file format or data.",
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async (data: QuestionsFormData) => {
    console.log("Submitted Data:", data);
    toast({
      title: "Success",
      description: "Questions submitted successfully",
    });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* File Upload Section */}
        <div>
          <Label htmlFor="file-upload" className="block text-sm font-medium">
            Upload Excel File
          </Label>
          <Input
            id="file-upload"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="block w-full text-sm border rounded-lg"
          />
        </div>

        <div className="text-lg font-semibold">
          {questionCount > 0
            ? `${questionCount} questions uploaded.`
            : "No questions uploaded yet."}
        </div>

        {/* Submit Button */}
        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  );
}
