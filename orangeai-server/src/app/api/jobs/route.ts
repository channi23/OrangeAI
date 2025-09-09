import { NextResponse } from "next/server";
import { listJobs } from "@/lib/db";
import { startWorker } from "@/lib/worker";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function withCors(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", process.env.CORS_ORIGIN ?? "http://localhost:5173");
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Max-Age", "86400");
  return response;
}

export async function OPTIONS() {
  return withCors(NextResponse.json({ ok: true }));
}

export async function GET() {
  startWorker();
  const jobs = listJobs().map((j) => ({ id: j.id, status: j.status, resultPath: j.result_path }));
  return withCors(NextResponse.json({ jobs }));
}


