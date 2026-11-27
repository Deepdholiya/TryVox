"use client";
/* Homepage hero band: many call paths (carriers, networks, numbers) stream in from the left, converge into one
   line at the centre (TryVox), and leave to the right as a voice wave (the call your agent hears).
   Canvas 2D, pauses off-screen and in hidden tabs, draws one still frame for reduced motion. Decorative: aria-hidden. */
import { useEffect, useRef } from "react";

type Strand = { y0: number; bend: number; speed: number; offs: number[]; len: number; w: number; tone: number };

const smooth = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

export function StrandField() {
  const host = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = host.current;
    const canvas = cv.current;
    const ctx = canvas?.getContext("2d");
    if (!el || !canvas || !ctx) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, raf = 0, visible = true, strands: Strand[] = [];
    const t0 = performance.now();

    const build = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = W < 700 ? 80 : 170;
      strands = Array.from({ length: n }, () => ({
        y0: (Math.random() * 2 - 1) * H * 0.62 * (0.3 + 0.7 * Math.random()),
        bend: 0.55 + Math.random() * 0.7,
        speed: 0.05 + Math.random() * 0.11,
        offs: [Math.random(), Math.random(), Math.random()],
        len: 0.05 + Math.random() * 0.08,
        w: 0.6 + Math.random() * 0.9,
        tone: Math.random(),
      }));
    };
    const yAt = (s: Strand, u: number, cy: number) => cy + s.y0 * (1 - smooth(Math.pow(u, s.bend)));

    const draw = (now: number) => {
      const time = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      const cx = W * 0.5, cy = H * 0.55;
      ctx.lineCap = "round";
      for (const s of strands) {
        ctx.beginPath();
        for (let j = 0; j <= 24; j++) {
          const u = j / 24;
          j ? ctx.lineTo(u * cx, yAt(s, u, cy)) : ctx.moveTo(0, yAt(s, 0, cy));
        }
        ctx.strokeStyle = "rgba(109,46,230,0.06)";
        ctx.lineWidth = 0.6;
        ctx.stroke();
        for (const o of s.offs) {
          const head = (o + time * s.speed) % 1;
          const tail = Math.max(0, head - s.len);
          ctx.beginPath();
          for (let j = 0; j <= 10; j++) {
            const u = tail + ((head - tail) * j) / 10;
            j ? ctx.lineTo(u * cx, yAt(s, u, cy)) : ctx.moveTo(u * cx, yAt(s, u, cy));
          }
          const g = ctx.createLinearGradient(tail * cx, 0, head * cx, 0);
          const rgb = s.tone < 0.55 ? "109,46,230" : "15,13,20";
          g.addColorStop(0, `rgba(${rgb},0)`);
          g.addColorStop(1, `rgba(${rgb},${0.18 + head * 0.5})`);
          ctx.strokeStyle = g;
          ctx.lineWidth = s.w;
          ctx.stroke();
        }
      }
      // the single line
      const lg = ctx.createLinearGradient(cx - 70, 0, cx + W * 0.09, 0);
      lg.addColorStop(0, "rgba(15,13,20,0)");
      lg.addColorStop(0.35, "rgba(15,13,20,1)");
      lg.addColorStop(1, "rgba(15,13,20,.85)");
      ctx.beginPath();
      ctx.moveTo(cx - 70, cy);
      ctx.lineTo(cx + W * 0.07, cy);
      ctx.strokeStyle = lg;
      ctx.lineWidth = 1.6;
      ctx.stroke();
      // the voice wave
      const sx = cx + W * 0.05, ex = W, lines = 14;
      for (let l = 0; l < lines; l++) {
        ctx.beginPath();
        for (let x = sx; x <= ex; x += 4) {
          const p = (x - sx) / (ex - sx);
          const env = Math.sin(Math.PI * Math.min(1, p * 1.12)) * (0.25 + 0.75 * smooth(p * 1.6));
          const y = cy + H * 0.13 * env * (1 - (l / lines) * 0.35) * Math.sin(p * 9.5 - time * 1.5 + l * 0.22) + H * 0.05 * smooth(p) * (l / lines);
          x === sx ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        const a = 0.15 + 0.65 * (1 - l / lines);
        const wg = ctx.createLinearGradient(sx, 0, ex, 0);
        wg.addColorStop(0, `rgba(15,13,20,${a})`);
        wg.addColorStop(0.6, `rgba(109,46,230,${a})`);
        wg.addColorStop(1, `rgba(109,46,230,${a * 0.3})`);
        ctx.strokeStyle = wg;
        ctx.lineWidth = l ? 0.8 : 1.4;
        ctx.stroke();
      }
      const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 46);
      rg.addColorStop(0, "rgba(109,46,230,.12)");
      rg.addColorStop(1, "rgba(109,46,230,0)");
      ctx.fillStyle = rg;
      ctx.fillRect(cx - 46, cy - 46, 92, 92);
      if (!reduce && visible && !document.hidden) raf = requestAnimationFrame(draw);
    };

    const restart = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };
    build();
    draw(t0 + 4000);
    el.classList.add("on");
    const ro = new ResizeObserver(() => {
      build();
      reduce ? draw(t0 + 4000) : restart();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduce) restart();
    });
    io.observe(el);
    const vis = () => !document.hidden && visible && !reduce && restart();
    document.addEventListener("visibilitychange", vis);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
    };
  }, []);

  return (
    <div className="strand-band" ref={host} aria-hidden="true">
      <canvas ref={cv} />
      <div className="strand-tag" style={{ top: "calc(55% - 22px)" }}>
        <i />
        Every network, every carrier
        <br />
        <b>one phone layer</b>
        <br />
        for your agent.
      </div>
    </div>
  );
}
