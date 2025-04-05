'use server'

import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { z } from 'zod';

// Validation schema
const FileUploadSchema = z.object({
fileName: z.string()
  .regex(/^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|gif)$/, 
         'Invalid filename format'),
base64String: z.string()
  .refine(str => str.startsWith('data:image'), 
          'Invalid base64 image data')
});
export type FileUploadFormData = z.infer<typeof FileUploadSchema>;

export async function uploadImage(formData: FileUploadFormData) {
try {
  // Extract and validate data
  const fileName = formData.fileName as string;
  const base64String = formData.base64String as string;

  const validatedData = FileUploadSchema.parse({ 
    fileName, 
    base64String 
  });

  // Decode base64 and write file
  const buffer = Buffer.from(
    validatedData.base64String.split(',')[1], 
    'base64'
  );
  
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  const filePath = join(uploadDir, validatedData.fileName);

  // Ensure upload directory exists
  await mkdir(uploadDir, { recursive: true });

  // Write file with strict permissions
  await writeFile(filePath, buffer, { mode: 0o644 });

  // Return relative path for frontend use
  return { 
    success: true, 
    path: `/uploads/${validatedData.fileName}` 
  };

} catch (error) {
  // Proper error handling
  if (error instanceof z.ZodError) {
    return { 
      success: false, 
      error: 'Invalid file upload' 
    };
  }

  return { 
    success: false, 
    error: 'File upload failed' 
  };
}
}