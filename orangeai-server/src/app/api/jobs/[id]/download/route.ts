import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/lib/db";
import fs from "node:fs";

export async function GET(_request: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  const job = getJob(id);
  if (!job || job.status !== "completed" || !job.result_path) {
    return NextResponse.json({ error: "Result not ready" }, { status: 404 });
  }
  const data = await fs.promises.readFile(job.result_path);
  return new NextResponse(data, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename=\"${id}.json\"`,
      "Access-Control-Allow-Origin": process.env.CORS_ORIGIN ?? "http://localhost:5173",
    },
  });
}


