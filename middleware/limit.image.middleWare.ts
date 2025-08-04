import { ErrorRequestHandler } from "express";
import multer from "multer";

export const multerErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({
        isSuccess: false,
        message: "File too large. Max 5MB allowed.",
      });
      return; // just return void
    }
    // other multer error cases...
    res.status(400).json({ isSuccess: false, message: err.message });
    return;
  }

  if ((err as any).code === "LIMIT_FIELD_SIZE") {
    res.status(400).json({
      isSuccess: false,
      message: "Field value too long.",
    });
    return;
  }

  next(err);
};
