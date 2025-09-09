import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import PreviewPlayer from "../components/previewplayer.jsx";
import ProgressBar from "../components/progressbar.jsx";
import { apiUrl } from "../lib/api.js";

export default function Results() {
  const { state } = useLocation();
  const name = state?.name || "demo.mp4";
  const jobId = state?.jobId;
  const [progress, setProgress] = useState({
    transcribe: 0,
    translate: 0,
    tts: 0,
    lipsync: 0,
    mix: 0,
  });
  const [status, setStatus] = useState(jobId ? "processing" : "completed");
  const download = () => {
    if (!jobId || status !== "completed") return;
    window.location.href = apiUrl(`/api/jobs/${jobId}/download`);
  };

  useEffect(() => {
    if (!jobId) {
      setProgress({ transcribe: 100, translate: 100, tts: 100, lipsync: 100, mix: 100 });
      return;
    }
    let cancelled = false;
    const timer = setInterval(async () => {
      try {
        const res = await fetch(apiUrl(`/api/jobs/${jobId}`));
        const data = await res.json();
        if (cancelled) return;
        if (data.status === "completed") {
          setStatus("completed");
          setProgress({ transcribe: 100, translate: 100, tts: 100, lipsync: 100, mix: 100 });
          clearInterval(timer);
        } else {
          setStatus("processing");
          setProgress((p) => {
            const inc = (v) => Math.min(95, v + Math.ceil(Math.random() * 10));
            return { transcribe: inc(p.transcribe), translate: inc(p.translate), tts: inc(p.tts), lipsync: inc(p.lipsync), mix: inc(p.mix) };
          });
        }
      } catch {
        // ignore transient errors
      }
    }, 1200);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [jobId]);

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl md:text-4xl font-black">Results Preview</h1>
      <p className="text-white/60 mt-2">{name} processed — preview below.</p>

      <div className="mt-6 grid md:grid-cols-5 gap-6">
        <div className="md:col-span-3">
          <PreviewPlayer />
        </div>
        <div className="md:col-span-2 space-y-4">
          <ProgressBar label="Transcribe" value={progress.transcribe} />
          <ProgressBar label="Translate" value={progress.translate} />
          <ProgressBar label="VoiceTTS" value={progress.tts} />
          <ProgressBar label="Lip‑Sync" value={progress.lipsync} />
          <ProgressBar label="Mix & QC" value={progress.mix} />
          <div className="flex gap-3 pt-2">
            <button className="btn-primary" disabled={status !== "completed"} onClick={download}>
              {status === "completed" ? "Download Dub" : "Processing..."}
            </button>
            <Link to="/upload" className="btn-ghost">Process another</Link>
          </div>
        </div>
      </div>
    </section>
  );
}