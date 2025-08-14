import { useLocation, Link } from "react-router-dom";
import PreviewPlayer from "../components/previewplayer.jsx";
import ProgressBar from "../components/progressbar.jsx";

export default function Results() {
  const { state } = useLocation();
  const name = state?.name || "demo.mp4";

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl md:text-4xl font-black">Results Preview</h1>
      <p className="text-white/60 mt-2">{name} processed — preview below.</p>

      <div className="mt-6 grid md:grid-cols-5 gap-6">
        <div className="md:col-span-3">
          <PreviewPlayer />
        </div>
        <div className="md:col-span-2 space-y-4">
          <ProgressBar label="Transcribe" value={100} />
          <ProgressBar label="Translate" value={100} />
          <ProgressBar label="VoiceTTS" value={100} />
          <ProgressBar label="Lip‑Sync" value={100} />
          <ProgressBar label="Mix & QC" value={100} />
          <div className="flex gap-3 pt-2">
            <button className="btn-primary">Download Dub</button>
            <Link to="/upload" className="btn-ghost">Process another</Link>
          </div>
        </div>
      </div>
    </section>
  );
}