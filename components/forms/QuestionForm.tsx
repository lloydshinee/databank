"use client";

import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "@/hooks/use-toast";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Question } from "@/lib/globals";
import { upsertQuestion } from "@/actions/question.action";
import { createReviewerLog } from "@/actions/log.action";
import { useState } from "react";
import { FileUploadFormData, uploadImage } from "@/actions/upload.action";

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        resolve(reader.result as string);
      } else {
        reject("File conversion failed, no result");
      }
    };
    reader.onerror = (err) => reject(`Error reading file: ${err}`);
    try {
      reader.readAsDataURL(file);
    } catch (err) {
      reject(`Error initiating read: ${err}`);
    }
  });
};

export const questionSchema = z.object({
  id: z.string().optional(),
  content: z.string().min(0, "Question content is required").optional(),
  image: z.string().optional(),
  correctAnswer: z.string().min(1, "Correct answer is required"),
  points: z.number().min(1, "Question points are required"),
  reviewerId: z.string(),
  QuestionChoices: z
    .array(
      z.object({
        index: z.string(),
        content: z.string().min(1, "Choice content is required").optional(),
        image: z.string().optional(),
      })
    )
    .length(4, "Exactly 4 choices are required"),
});

export type QuestionFormData = z.infer<typeof questionSchema>;

export default function QuestionForm({
  reviewerId,
  data,
}: {
  reviewerId: string;
  data?: Question;
}) {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [choiceFiles, setChoiceFiles] = useState<(File | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  const form = useForm<QuestionFormData>({
    defaultValues: {
      id: data?.id || undefined,
      content: data?.content || "",
      image: data?.image || "",
      correctAnswer: data?.correctAnswer || "",
      reviewerId: reviewerId,
      points: data?.points || 1,
      QuestionChoices: data?.choices
        ? data?.choices.map((choice) => ({
            index: choice.index || "",
            content: choice.content || "",
            image: choice.image || "",
          }))
        : [
            { index: "A", content: "" },
            { index: "B", content: "" },
            { index: "C", content: "" },
            { index: "D", content: "" },
          ],
    },
  });

  const handleSubmit = async (formData: QuestionFormData) => {
    try {
      setLoading(true);
      console.log("Plain object check:", formData);
      console.log("Selected File:", selectedFile);

      if (selectedFile) {
        setIsUploading(true);

        formData.image = `uploads/${selectedFile.name}`;
        setIsUploading(false);
      }
      console.log("UPDATED Plain object check:", formData);

      await upsertQuestion({
        ...formData,
      });

      await createReviewerLog(reviewerId, "Upserted a question");
      if (selectedFile) {
        const base64String = await fileToBase64(selectedFile);
        console.log("UPLOAD IMAGE TO FOLDER");
        const form: FileUploadFormData = {
          fileName: selectedFile.name,
          base64String: base64String,
        };
        await uploadImage(form);
      }
      toast({
        title: "Success",
        description: "Question submitted successfully",
      });
    } catch (error) {
      console.error("Error submitting question:", error);
      toast({
        title: "Error",
        description: "Failed to submit question",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8 max-h-[90vh] w-full overflow-auto"
      >
        <div className="space-y-4 border p-4 rounded-md">
          <h3 className="text-lg font-semibold">Question</h3>

          {/* Question Content */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Question Content</FormLabel>
                </div>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter the question"
                    className="block w-full text-sm border rounded-lg"
                    onChange={(e) => {
                      form.setValue("content", e.target.value); // Update content when typing
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Question Figure</FormLabel>
                </div>
                <FormControl>
                  <Input
                    {...field}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                    className="block w-full text-sm border rounded-lg"
                  />
                </FormControl>
                {isUploading ? (
                  <p>Uploading file</p>
                ) : (
                  selectedFile && <p>Selected File: {selectedFile.name}</p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Correct Answer */}
          <FormField
            control={form.control}
            name="correctAnswer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correct Answer</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter correct answer"
                    className="block w-full text-sm border rounded-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Question Points */}
          <FormField
            control={form.control}
            name="points"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question Points</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Enter points"
                    className="block w-full text-sm border rounded-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Choices */}
          <div className="space-y-2  flex flex-wrap justify-between flex-1">
            {form.getValues("QuestionChoices").map((choice, choiceIndex) => (
              <div
                key={choiceIndex}
                className="space-y-2 border rounded-md p-2 w-[48%]"
              >
                <FormField
                  control={form.control}
                  name={`QuestionChoices.${choiceIndex}.content`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{choice.index}. Choice Content</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={`Choice ${choice.index}`}
                          className="block w-full text-sm border rounded-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Choice Image Upload */}
                <FormItem>
                  <FormLabel>Figure for Choice {choice.index}</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        const updatedFiles = [...choiceFiles];
                        updatedFiles[choiceIndex] = file;
                        setChoiceFiles(updatedFiles);
                      }}
                      className="block w-full text-sm border rounded-lg"
                    />
                  </FormControl>
                  {choiceFiles[choiceIndex] && (
                    <p>Selected File: {choiceFiles[choiceIndex]?.name}</p>
                  )}
                </FormItem>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        {loading ? (
          <Button type="submit" className="cursor-not-allowed opacity-60">
            Submit
          </Button>
        ) : (
          <Button type="submit">Submit</Button>
        )}
      </form>
    </FormProvider>
  );
}
