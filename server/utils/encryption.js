import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const encryptionKey = process.env.ENCRYPTION_KEY || "your-secret-key";
const algorithm = "aes-256-cbc";
const iv = crypto.randomBytes(16);

export const encrypt = (data) => {
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(encryptionKey, "utf-8"),
    iv
  );
  let encrypted = cipher.update(data, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
};

export const decrypt = (data) => {
  const [ivHex, encrypted] = data.split(":");
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(encryptionKey, "utf-8"),
    Buffer.from(ivHex, "hex")
  );
  let decrypted = decipher.update(encrypted, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
};
