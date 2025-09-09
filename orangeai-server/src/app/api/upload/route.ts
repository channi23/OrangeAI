import { NextRequest, NextResponse } from "next/server";
import { getUploadPath, saveBlobToFile } from "@/lib/storage";
import { insertJob } from "@/lib/db";
import { startWorker } from "@/lib/worker";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function createCorsResponse(body: unknown, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  response.headers.set("Access-Control-Allow-Origin", process.env.CORS_ORIGIN ?? "http://localhost:5173");
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Max-Age", "86400");
  return response;
}

export async function OPTIONS() {
  return createCorsResponse({ ok: true });
}

export async function POST(request: NextRequest) {
  try {
    // Ensure background worker is running after first API call
    startWorker();
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return createCorsResponse({ error: "Expected multipart/form-data" }, { status: 400 });
    }

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof Blob)) {
      return createCorsResponse({ error: "Missing file field" }, { status: 400 });
    }

    const name = (file as any).name ?? `upload_${Date.now()}.bin`;
    const uploadPath = getUploadPath(name);
    await saveBlobToFile(file, uploadPath);

    const jobId = `job_${Date.now()}`;
    insertJob({ id: jobId, filename: name, status: "queued", input_path: uploadPath, result_path: null });
    return createCorsResponse({ jobId, filename: name, message: "Upload received; processing started" });
  } catch (error) {
    return createCorsResponse({ error: "Upload failed" }, { status: 500 });
  }
}


