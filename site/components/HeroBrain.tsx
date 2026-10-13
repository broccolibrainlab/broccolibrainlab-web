"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import graph from "@/assets/data/brain-graph.json";
import heroBrain from "@/assets/images/hero-brain.png";
import { mountBrain, readCssPalette, type RawGraph } from "@/lib/brainEngine";

// The traced artwork is drawn on a canvas. The static image lives in <noscript> so it
// only appears for visitors without JavaScript and is never shown alongside the canvas.
export default function HeroBrain() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const brain = mountBrain(el, graph as RawGraph, mq.matches, readCssPalette());
    if (!brain) return;
    const onChange = () => brain.setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      brain.destroy();
    };
  }, []);

  return (
    <div className="hero-art brain-art" aria-hidden="true">
      <canvas ref={canvas} className="brain-canvas" />
      <noscript>
        <Image src={heroBrain} alt="" loading="eager" />
      </noscript>
    </div>
  );
}
