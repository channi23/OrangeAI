import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/lib/db";
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

export async function GET(_request: NextRequest, context: { params: { id: string } }) {
  startWorker();
  const { id } = context.params;
  const row = getJob(id);
  if (!row) return withCors(NextResponse.json({ error: "Not found" }, { status: 404 }));
  return withCors(NextResponse.json({ id: row.id, status: row.status, resultPath: row.result_path }));
}


