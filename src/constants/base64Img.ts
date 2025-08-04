import fs from "fs";
import path from "path";
export const saveBase64Image = (base64: string, filename: string): string => {
  const matches = base64.match(/^data:.+\/(.+);base64,(.*)$/);
  const ext = matches?.[1];
  const data = matches?.[2];

  if (!ext || !data) {
    throw new Error("Invalid base64 image data");
  }

  const buffer = Buffer.from(data, "base64");
  const uploadDir = path.join(__dirname, "../../uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, `${filename}.${ext}`);
  fs.writeFileSync(filePath, buffer);

  return `${filename}.${ext}`;
};
