import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { iCreatedPayment } from "../../types/payment.interface";
const prisma = new PrismaClient();

export const createPayment = async (req: Request, res: Response) => {
  try {
    const userPayment = req.body as iCreatedPayment;
    if (!userPayment) {
      res.status(400).json({
        isSuccess: false,
        message: "payment needs valid requirements",
      });
      return;
    }

    const data: iCreatedPayment = req.body;

    const userId = await prisma.user.findFirst({
      where: {
        id: data.userId,
      },
    });
    if (!userId) {
      res.status(404).json({
        isSuccess: false,
        message: "no user found!",
      });
      return;
    }
    const courseId = await prisma.course.findFirst({
      where: {
        id: data.courseId,
      },
    });
    if (!courseId) {
      res.status(404).json({
        isSuccess: false,
        message: "no course found!",
      });
      return;
    }

    const payment = await prisma.payment.create({
      data: {
        userId: data.userId,
        courseId: data.courseId,
        price: data.price,
      },
    });

    res.status(201).json({
      isSuccess: true,
      message: "successfully created payment",
      payment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to create payment",
    });
  }
};

export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    const payment = await prisma.payment.findUnique({
      where: {
        id: paymentId,
      },
    });
    if (!payment) {
      res.status(404).json({
        isSuccess: false,
        message: "no payment found!",
      });
      return;
    }
    res.status(200).json({
      isSuccess: true,
      message: "success",
      payment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to retrieve payment",
    });
  }
};

export const getAllPayments = async (_req: Request, res: Response) => {
  try {
    const payments = await prisma.payment.findMany();
    if (!payments) {
      res.status(400).json({
        isSuccess: false,
        message: "no payment found yet!",
      });
      return;
    }
    res.status(200).json({
      isSuccess: true,
      message: "success",
      payments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to retrieve payments",
    });
  }
};

export const deletePayment = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    const payment = await prisma.payment.findUnique({
      where: {
        id: paymentId,
      },
    });
    if (!payment) {
      res.status(404).json({
        isSuccess: false,
        message: "no payment found!",
      });
      return;
    }
    const deletingPayment = await prisma.payment.delete({
      where: {
        id: paymentId,
      },
    });
    res.status(200).json({
      isSuccess: false,
      message: "successfully deleted payment!",
      deletingPayment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to delete payment",
    });
  }
};
