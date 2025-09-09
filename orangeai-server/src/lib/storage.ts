import path from "node:path";
import fs from "node:fs";

const dataDir = path.join(process.cwd(), "data");
const uploadsDir = path.join(dataDir, "uploads");
const resultsDir = path.join(dataDir, "results");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });

export function getUploadPath(filename: string) {
  return path.join(uploadsDir, filename);
}

export function getResultPath(filename: string) {
  return path.join(resultsDir, filename);
}

export async function saveBlobToFile(blob: Blob, filePath: string) {
  const arrayBuffer = await blob.arrayBuffer();
  await fs.promises.writeFile(filePath, Buffer.from(arrayBuffer));
}


