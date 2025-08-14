import { Link } from "react-router-dom";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Home() {
  const scope = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-title", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out" });
      gsap.fromTo(".hero-sub",   { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, delay: 0.1, ease: "power3.out" });
      gsap.fromTo(".cta",        { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, delay: 0.2 });
      gsap.to(".blob", { scale: 1.06, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }, scope);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={scope} className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-20 -right-20 w-[50rem] h-[50rem] rounded-full bg-cyan-500/30 blur-3xl blob" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 w-[40rem] h-[40rem] rounded-full bg-fuchsia-500/20 blur-3xl blob" />

      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <h1 className="hero-title text-5xl md:text-7xl font-black leading-tight">
          Dub like a film studio.
        </h1>
        <p className="hero-sub mt-4 text-white/70 max-w-2xl">
          OrangeAI transforms speech across languages while preserving performance—pitch,
          emotion, and lip‑sync—automatically.
        </p>
        <div className="cta mt-8 flex gap-3">
          <Link to="/upload" className="btn-primary">Start a Session</Link>
          <a href="#pipeline" className="btn-ghost">See the Magic</a>
        </div>
      </div>

      <div id="pipeline" className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-xl tracking-widest text-white/60">HOLOGRAPHIC UPLOAD CONSOLE</h2>
        <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <p className="text-white/60">
            Drag in a video or click to choose. We’ll detect language, diarize speakers, and prep for dubbing.
          </p>
          <Link to="/upload" className="btn-primary mt-4 inline-block">Upload your first video</Link>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-semibold mb-4">The Pipeline, Visualized</h3>
          <ol className="space-y-3 text-white/75">
            <li>1. Transcribe (Whisper) + smart chunking</li>
            <li>2. Translate (context‑aware transforms)</li>
            <li>3. VoiceTTS (timbre & prosody match)</li>
            <li>4. Lip‑Sync (Wav2Lip temporal align)</li>
            <li>5. Mix & QC (noise gate, loudness, fades)</li>
          </ol>
        </div>
      </div>
    </section>
  );
}