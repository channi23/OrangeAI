# OrangeAI — AI Voice Dubbing (Frontend + Backend)

## Overview
OrangeAI is an AI voice dubbing app with:
- Frontend: `orangeai-web` (Vite + React + Tailwind) for upload, progress, preview, and download.
- Backend: `orangeai-server` (Next.js App Router, TypeScript) providing upload, job tracking, and artifact download.

The current backend uses a lightweight SQLite job queue and a background worker that simulates processing. It is structured to let you plug in real ML pipelines for speech processing (ASR → MT → TTS → Lip-sync → Mix).

## Run Locally
1) Backend
```
cd orangeai-server
npm run dev
```
Starts Next.js on `http://localhost:3000`.

2) Frontend
```
cd orangeai-web
npm run dev
```
Serves the UI on `http://localhost:5173`.

Optional: set Vite API base in `orangeai-web/.env`:
```
VITE_API_BASE=http://localhost:3000
```

## High-Level Flow
1. User uploads a video in the frontend (`/upload`).
2. Frontend POSTs `multipart/form-data` to backend `/api/upload`.
3. Backend persists the file, creates a `job` in SQLite with status `queued`, and returns `jobId`.
4. Frontend navigates to `/results` with `{ jobId }` and begins polling `/api/jobs/[id]`.
5. Background worker detects queued jobs, processes them, and writes a result artifact. Status transitions to `processing` → `completed`.
6. Frontend detects `completed` and enables the Download button, which calls `/api/jobs/[id]/download`.

## Frontend
- Tech: React 19, React Router, Tailwind.
- Key screens:
  - Upload (`src/pages/upload.jsx`): handles drag/drop or browse, sends POST to backend, shows loading/error state.
  - Results (`src/pages/results.jsx`): polls job status and updates progress bars; enables download when complete.
- Config: `src/lib/api.js` centralizes API base URL.

## Backend
- Tech: Next.js (App Router), TypeScript.
- Storage:
  - SQLite (better-sqlite3): `orangeai-server/data/orangeai.db`.
  - Filesystem: uploads in `data/uploads/`, results in `data/results/`.
- Background worker: `src/lib/worker.ts` polls DB periodically and completes jobs (simulation).
- CORS: Allowed origin `http://localhost:5173` via middleware and route headers.

### API Endpoints
- `POST /api/upload`
  - Accepts `multipart/form-data` with `file`.
  - Persists upload to disk, creates a job with status `queued`.
  - Response: `{ jobId, filename, message }`.

- `GET /api/jobs`
  - Lists recent jobs: `{ jobs: [{ id, status, resultPath }] }`.

- `GET /api/jobs/[id]`
  - Returns job status: `{ id, status, resultPath }`.

- `GET /api/jobs/[id]/download`
  - Downloads the result artifact when status is `completed`.

## ML Pipeline Integration (AI Voice Dubbing)
Replace the simulated worker with real steps. Recommended stages and integration points:

1) Ingestion
- File arrives at `data/uploads/<filename>`.
- Generate a stable media ID or normalize container if needed (ffmpeg).

2) ASR (Automatic Speech Recognition)
- Suggested models: Whisper (open-source), faster-whisper (CTranslate2), or cloud ASR.
- Output: time-stamped transcription (e.g., WebVTT, SRT, JSON w/ segments).
- Integration point: in `src/lib/worker.ts`, after setting job to `processing`, run ASR and write intermediate artifacts to `data/results/<jobId>/asr.json`.

3) MT (Machine Translation)
- Suggested: MarianMT, NLLB, M2M100, or cloud translation APIs.
- Input: ASR segments; Output: translated segments preserving timestamps.
- Integration point: `worker.ts` after ASR; store `translation.json`.

4) TTS (Text-To-Speech)
- Suggested: Coqui TTS, Bark, XTTS-v2, or cloud TTS providers.
- Input: translated segments; Output: synthesized audio chunks (per segment) and a manifest.
- Integration point: `worker.ts` after MT; write audio chunks under `data/results/<jobId>/tts/` and `tts_manifest.json`.

5) Voice Cloning / Speaker Embeddings (optional)
- Extract speaker embeddings from source and condition TTS for voice similarity.
- Tools: speaker verification models (ECAPA-TDNN, x-vectors), retrieval-based voice conversion.

6) Lip-Sync / Video Re-timing (optional for true dubbing)
- Tools: Wav2Lip, SadTalker variants, or alignment-only if you’re not modifying lip movements.
- Align synthesized audio with original video; produce muxed output.

7) Mixing & QC
- Mix background track and synthesized speech; normalize loudness.
- Validate duration alignment and loudness (EBU R128, LUFS targets).
- Final output: `data/results/<jobId>/final.mp4` (or `.wav/.mp3` for audio-only use-cases).

8) Status Updates
- Update `jobs.status` across stages and store paths to intermediate artifacts. Consider a `job_events` table for audit/logging.

### Worker Structure (example)
In `src/lib/worker.ts`, replace the simulation with real steps:
```
// Pseudocode
setStatus(id, 'processing')
const asr = await runASR(inputPath)
save(asr, resultsDir/asr.json)
emitStage(id, 'asr')

const tr = await runMT(asr)
save(tr, resultsDir/translation.json)
emitStage(id, 'mt')

const ttsOut = await runTTS(tr)
saveManifest(ttsOut, resultsDir/tts_manifest.json)
emitStage(id, 'tts')

const finalPath = await muxAndAlign(inputPath, ttsOut)
setResultPath(id, finalPath)
setStatus(id, 'completed')
```

## Extensibility & Next Steps
- Add `/api/jobs/[id]/events` to stream stage updates (SSE/WebSocket) for real-time progress.
- Persist user sessions and ownership of jobs.
- Swap local FS for S3 (uploads/results) and use a proper job queue (BullMQ/Redis) for scale.
- Add a Job History UI to list and inspect artifacts.

## Repo Structure
```
OrangeAI/
  orangeai-web/            # Frontend (Vite)
  orangeai-server/         # Backend (Next.js)
    data/
      uploads/
      results/
      orangeai.db          # SQLite database
```

