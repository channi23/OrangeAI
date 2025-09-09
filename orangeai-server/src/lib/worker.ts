import { db, updateJobStatus, JobRow } from "@/lib/db";
import { getResultPath } from "@/lib/storage";
import fs from "node:fs";

function processNextJob() {
  const job = db.prepare<JobRow>(
    `SELECT * FROM jobs WHERE status IN ('queued','processing') ORDER BY created_at ASC LIMIT 1`
  ).get() as JobRow | undefined;
  if (!job) return;
  if (job.status === "queued") {
    updateJobStatus(job.id, "processing");
  }
  // Simulate processing: write a small JSON as result
  const resultPath = getResultPath(`${job.id}.json`);
  const resultData = { id: job.id, filename: job.filename, message: "Processing complete" };
  fs.writeFileSync(resultPath, JSON.stringify(resultData, null, 2));
  updateJobStatus(job.id, "completed", resultPath);
}

let started = false;
export function startWorker() {
  if (started) return;
  started = true;
  setInterval(processNextJob, 1500);
}


