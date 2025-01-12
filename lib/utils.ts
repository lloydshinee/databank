import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { colleges } from "./globals";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCollege(collegeName: string) {
  return (
    colleges.find(
      (college) => college.name.toLowerCase() === collegeName.toLowerCase()
    ) || null
  );
}
