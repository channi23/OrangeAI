import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "orangeai.db");
export const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  input_path TEXT,
  result_path TEXT
);
`);

export type JobRow = {
  id: string;
  filename: string;
  status: "queued" | "processing" | "completed" | "failed";
  created_at: number;
  updated_at: number;
  input_path: string | null;
  result_path: string | null;
};

export function insertJob(job: Omit<JobRow, "created_at" | "updated_at">) {
  const now = Date.now();
  db.prepare(
    `INSERT INTO jobs (id, filename, status, created_at, updated_at, input_path, result_path)
     VALUES (@id, @filename, @status, @created_at, @updated_at, @input_path, @result_path)`
  ).run({ ...job, created_at: now, updated_at: now });
}

export function updateJobStatus(id: string, status: JobRow["status"], result_path?: string | null) {
  db.prepare(
    `UPDATE jobs SET status = @status, updated_at = @updated_at, result_path = COALESCE(@result_path, result_path) WHERE id = @id`
  ).run({ id, status, updated_at: Date.now(), result_path: result_path ?? null });
}

export function getJob(id: string): JobRow | undefined {
  return db.prepare(`SELECT * FROM jobs WHERE id = ?`).get(id) as JobRow | undefined;
}

export function listJobs(): JobRow[] {
  return db.prepare(`SELECT * FROM jobs ORDER BY created_at DESC LIMIT 50`).all() as JobRow[];
}


