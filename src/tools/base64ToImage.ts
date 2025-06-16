import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Prisma } from "../generated/prisma";

type Image = Partial<Prisma.ImageGetPayload<{}>>;

export async function base64ToImage(base64: string): Promise<Image> {
  const extension = "png";
  const buffer = Buffer.from(base64, "base64");

  const fileName = `${uuidv4()}.${extension}`;

  const mediaDir = path.join(__dirname, "..", "..", "media");

  if (!fs.existsSync(mediaDir)) {
    fs.mkdirSync(mediaDir, { recursive: true });
  }

  const filePath = path.join(mediaDir, fileName);

  await fs.promises.writeFile(filePath, buffer);

  return {
    filename: fileName,
    file: fileName,
  };
}
