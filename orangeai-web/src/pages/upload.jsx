import { useRef, useState, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { Link, useNavigate } from "react-router-dom";

export default function Upload() {
  const boxRef = useRef(null);
  const [file, setFile] = useState(null);
  const nav = useNavigate();

  useLayoutEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(".upl-title", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5 })
      .fromTo(boxRef.current, { scale: 0.96, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.6, ease: "power3.out" }, "-=0.2");
  }, []);

  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer?.files?.[0];
    if (f) setFile(f);
  };

  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const start = () => {
    nav("/results", { state: { demo: true, name: file?.name || "demo.mp4" } });
  };

  return (
    <section className="min-h-[calc(100vh-56px)] grid place-items-center px-6 py-10">
      <div className="max-w-5xl w-full">
        <h1 className="upl-title text-4xl md:text-5xl font-black">Upload & Configure</h1>
        <div
          ref={boxRef}
          className="mt-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm mb-2 text-white/70">Video</label>
              <div className="h-44 rounded-2xl border border-dashed border-white/15 grid place-items-center">
                {!file ? (
                  <div className="text-center text-white/50">
                    Drag & drop a file here
                    <div className="my-3">or</div>
                    <label className="btn-ghost cursor-pointer">
                      Browse
                      <input type="file" accept="video/*" className="hidden" onChange={onPick} />
                    </label>
                  </div>
                ) : (
                  <div className="text-white/80">{file.name}</div>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-white/70">Source Language</label>
                <select className="select">
                  <option>Auto-detect</option>
                  <option>English</option>
                  <option>Hindi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1 text-white/70">Target Language</label>
                <select className="select">
                  <option>Hindi</option>
                  <option>English</option>
                </select>
              </div>
              <button className="btn-primary w-full" onClick={start}>Process</button>
              <Link to="/" className="text-xs opacity-70 hover:opacity-100">← back to home</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}