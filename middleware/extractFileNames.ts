import { NextFunction, Request, Response } from "express";
import { Multer } from "multer";

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

export const extractFileNames = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Type narrowing for req.files
  if (req.files && !Array.isArray(req.files)) {
    // Here, req.files is { [fieldname: string]: MulterFile[] }
    if (req.files.course_img && req.files.course_img[0]) {
      req.body.course_img = req.files.course_img[0].filename;
    }
    if (req.files.cover_img && req.files.cover_img[0]) {
      req.body.cover_img = req.files.cover_img[0].filename;
    }
  }
  next();
};
