import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/request";
import jwt from "jsonwebtoken";

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ isSuccess: false, message: "Unauthorized" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ isSuccess: false, message: "Token missing" });
      return;
    }

    const result: any = jwt.verify(token, process.env.jwt_secret_key as string);
    req.userId = result.userId; // <== Important
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ isSuccess: false, message: "Invalid token" });
  }
};
