import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types/request";
import { NextFunction, Response } from "express";
const prisma = new PrismaClient();

export const authorize = (roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = await prisma.user.findFirst({
      where: {
        id: req.userId,
      },
    });

    if (!user) {
      res.status(401).json({
        isSuccess: false,
        message: "anAuthorized",
      });
      return;
    }

    if (roles.includes(user.role)) {
      next();
      return;
    }
    res.status(400).json({
      isSuccess: false,
      message: "Access denied. you are not admin!!",
    });
    return;
  };
};
