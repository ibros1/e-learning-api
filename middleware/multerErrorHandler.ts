import { ErrorRequestHandler } from "express";
import multer from "multer";

export const multerErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  if (err instanceof multer.MulterError) {
    // Handle Multer-specific errors
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        res.status(400).json({
          isSuccess: false,
          message: "File too large. Max 5MB allowed.",
        });
        return;
      case "LIMIT_UNEXPECTED_FILE":
        res.status(400).json({
          isSuccess: false,
          message: "Unexpected file field",
        });
        return;
      default:
        res.status(400).json({
          isSuccess: false,
          message: err.message,
        });
        return;
    }
  } else if (err) {
    // Handle other errors
    res.status(400).json({
      isSuccess: false,
      message: err.message || "File upload error",
    });
    return;
  }

  // No errors, proceed to next middleware
  next();
};
