import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // or any folder you want
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// Add limits here to increase max field size (default is about 1MB)
export const upload = multer({
  storage,
  limits: {
    fieldSize: 10 * 1024 * 1024, // 10 MB, adjust if needed
    fileSize: 5 * 1024 * 1024, // max file size 5 MB (adjust as needed)
  },
});
