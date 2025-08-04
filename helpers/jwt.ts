import jwt from "jsonwebtoken";

export const generateWebToken = (userId: number) => {
  return jwt.sign({ userId }, process.env.jwt_secret_key as string, {
    expiresIn: "24h",
  });
};
