import { Link, NavLink } from "react-router-dom";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Navbar() {
  const bar = useRef(null);
  useLayoutEffect(() => {
    gsap.fromTo(
      bar.current,
      { y: -20, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out" }
    );
  }, []);

  const link = ({ isActive }) =>
    `px-3 py-1 rounded-full text-sm transition ${
      isActive ? "bg-white/15" : "hover:bg-white/10"
    }`;

  return (
    <nav
      ref={bar}
      className="sticky top-0 z-40 backdrop-blur-xl bg-black/30 border-b border-white/10"
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-black tracking-tight">ORANGEAI</Link>
        <div className="flex items-center gap-1">
          <NavLink to="/" className={link} end>Home</NavLink>
          <NavLink to="/upload" className={link}>Upload</NavLink>
          <NavLink to="/results" className={link}>Results</NavLink>
        </div>
      </div>
    </nav>
  );
}