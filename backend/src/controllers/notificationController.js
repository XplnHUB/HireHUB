import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createNotification = async (req, res) => {
  try {
    const { studentId, message, isRead } = req.body;
    const notification = await prisma.notification.create({
      data: { studentId, message, isRead },
    });
    res.status(201).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send notification", error: error.message });
  }
};

export const getNotificationsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const notifications = await prisma.notification.findMany({
      where: { studentId },
    });
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
    res.json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update notification", error: error.message });
  }
};
