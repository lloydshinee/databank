"use server";

import prisma from "@/lib/prisma";

export async function notifyAdmin(message: string, link: string) {
  try {
    const admins = await prisma.user.findMany({
      where: { role: "Admin" },
    });
    // Create a notification for each admin
    const notifications = admins.map((admin) => ({
      message,
      link,
      userId: admin.id,
    }));
    // Insert notifications into the database
    await prisma.notification.createMany({
      data: notifications,
    });

    console.log("Admins notified");
  } catch (error) {
    console.log(error);
  }
}

export async function createNotification(
  userId: string,
  message: string,
  link: string
) {
  try {
    await prisma.notification.create({
      data: {
        message,
        link,
        userId,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function fetchNotifications(userId: string) {
  try {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function updateNotification(notificationId: string) {
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { viewed: true },
    });
  } catch (error) {
    console.log(error);
  }
}
