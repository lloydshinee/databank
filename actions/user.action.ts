"use server";

import { signIn } from "@/auth";
import { LoginFormData } from "@/components/forms/LoginForm";
import { UsersFormData } from "@/components/forms/UsersForm";
import prisma from "@/lib/prisma";

export async function verifyUser(email: string, password: string) {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  // If user doesn't exist, return null
  if (!user) {
    return null;
  }

  // Compare the password (assuming no hashing)
  if (user.password === password) {
    return user; // Return the user if the password matches
  }

  return null; // Return null if password doesn't match
}

export async function login(data: LoginFormData) {
  await signIn("credentials", { redirect: false, ...data });
}

export async function getAccount(id: string) {
  try {
    return await prisma.user.findUnique({ where: { id } });
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function createUsers(data: UsersFormData) {
  try {
  } catch (error) {
    console.log(error);
  }
}
