"use client";
/* Scroll-driven and timed motion for individual sections. Each export is a React component that renders
   its section element and attaches the motion to it, cleaning up on unmount. The markup itself stays
   server-rendered, so all copy is in the HTML for search engines and LLM crawlers. */
import type { CSSProperties, ReactNode } from "react";
import { all, clamp, mmss, one, pad2, useDom, type Ctx } from "@/lib/dom";

type Props = {
  as?: string;
  className?: string;
  style?: CSSProperties;
  id?: string;
  children?: ReactNode;
  [k: `data-${string}`]: string | undefined;
  [k: `aria-${string}`]: string | undefined;
};

function behavior(name: string, setup: (el: HTMLElement, c: Ctx) => void) {
  const C = ({ as = "div", children, ...rest }: Props) => {
    const ref = useDom<HTMLElement>(setup);
    const Tag = as as any;
    return (
      <Tag ref={ref} {...rest}>
        {children}
      </Tag>
    );
  };
  C.displayName = name;
  return C;
}

/* ---------- product: the layer stack opens one layer at a time as you scroll ---------- */
export const StackPin = behavior("StackPin", (sec, c) => {
  const svg = one<SVGSVGElement>(sec, ".stk-svg");
  const E = +(svg.dataset.e || 64);
  const sl = all<SVGGElement>(svg, ".sl");
  const n = sl.length;
  const lb = all(sec, "li[data-i]");
  const cnt = one(sec, ".ahp-c b");
  const bar = one(sec, ".ahp-bar");
  const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  c.frame(() => {
    const r = sec.getBoundingClientRect();
    const p = c.reduce ? 1 : clamp(-r.top / (r.height - innerHeight), 0, 1);
    let off = 0;
    let opened = 0;
    for (let k = 0; k < n; k++) {
      if (k > 0) {
        const o = ease(clamp(p * (n - 1) * 1.12 - (n - 1 - k), 0, 1));
        off += E * o;
        if (o > 0.5) opened++;
      }
      sl[k].style.transform = `translateY(${-off}px)`;
    }
    const act = Math.max(0, n - 1 - opened);
    sl.forEach((g) => g.classList.toggle("hi", +g.dataset.i! === act));
    lb.forEach((l) => l.classList.toggle("on", +l.dataset.i! === act));
    cnt.textContent = pad2(act + 1);
    bar.style.setProperty("--sp", (p * 100).toFixed(1) + "%");
    const vb = svg.viewBox.baseVal.height;
    const sc = svg.clientHeight / vb;
    svg.style.transform = `translateY(${(-((n - 1) * E - off) / 2) * sc}px)`;
  });
});

/* ---------- product: statement words light up as you scroll ---------- */
export const Story = behavior("Story", (sec, c) => {
  const rp = one(sec, ".revp");
  const ws = all(rp, "span");
  c.frame(() => {
    const r = rp.getBoundingClientRect();
    const p = c.reduce ? 1 : clamp((innerHeight * 0.78 - r.top) / (r.height + innerHeight * 0.15), 0, 1);
    const k = Math.round(p * ws.length);
    ws.forEach((w, j) => w.classList.toggle("on", j < k));
  });
});

/* ---------- product: feature panels with a sticky index ---------- */
export const Panels = behavior("Panels", (pp, c) => {
  const ps = all(pp, ".ppn");
  const ns = all(pp, ".pp-nav a");
  c.watch(ps, (v, t) => v && t.classList.add("on"), { threshold: 0.35 });
  c.frame(() => {
    const mid = innerHeight * 0.5;
    let a = 0;
    ps.forEach((x, j) => {
      if (x.getBoundingClientRect().top < mid) a = j;
    });
    ns.forEach((x, j) => x.classList.toggle("on", j === a));
  });
});

/* ---------- compliance block: checks tick as it scrolls in ---------- */
export const ComplianceChecks = behavior("ComplianceChecks", (cp, c) => {
  const cs = all(cp, ".c7-c");
  const nb = one(cp, ".c7-pill b");
  const bd = one(cp, ".c7-badge");
  let last = -1;
  c.frame(() => {
    const r = cp.getBoundingClientRect();
    const p = c.reduce ? 1 : clamp((innerHeight * 0.9 - r.top) / (r.height * 0.7), 0, 1);
    const k = Math.min(4, Math.floor(p * 5));
    if (k === last) return;
    last = k;
    cs.forEach((x, j) => x.classList.toggle("ck", j < k));
    nb.textContent = String(k);
    bd.classList.toggle("full", k === 4);
  });
});

/* ---------- solution hero: live console ---------- */
export const LiveConsole = behavior("LiveConsole", (h, c) => {
  const st = one(h, ".lvb");
  const bars = all(h, ".lv-wave i");
  const t = one(h, ".lv-t");
  let s = 0;
  if (c.reduce) return;
  c.every(160, () => bars.forEach((b) => (b.style.height = 10 + Math.random() * 85 + "%")));
  c.every(1000, () => {
    s++;
    t.textContent = mmss(s);
  });
  c.frame(() => {
    const r = st.getBoundingClientRect();
    const p = clamp((innerHeight - r.top) / (innerHeight * 0.7), 0, 1);
    st.style.setProperty("--tl", (12 * (1 - p)).toFixed(2) + "deg");
  });
});

/* ---------- solution: horizontal cards driven by vertical scroll ---------- */
export const HorizontalCards = behavior("HorizontalCards", (hx, c) => {
  const tr = one(hx, ".hx-t");
  const cs = Array.from(tr.children) as HTMLElement[];
  const cnt = one(hx, ".hx-c b");
  const bar = one(hx, ".hx-bar");
  c.frame(() => {
    const r = hx.getBoundingClientRect();
    const p = clamp(-r.top / (r.height - innerHeight), 0, 1);
    const last = cs[cs.length - 1];
    const max = Math.max(0, last.offsetLeft + last.offsetWidth + parseFloat(getComputedStyle(tr).paddingLeft) - innerWidth);
    tr.style.setProperty("--tx", (-p * max).toFixed(1) + "px");
    bar.style.setProperty("--hb", (p * 100).toFixed(1) + "%");
    const a = Math.min(cs.length - 1, Math.round(p * (cs.length - 1)));
    cs.forEach((x, j) => x.classList.toggle("on", j === a));
    cnt.textContent = pad2(a + 1);
  });
});

/* ---------- solution: call flow advances with scroll ---------- */
export const ScrollFlow = behavior("ScrollFlow", (c6, c) => {
  const it = all(c6, ".c6-i");
  const cols = all(c6, ".cl-col");
  const rail = one(c6, ".c6-rail");
  const pc = one(c6, ".c6-pct b");
  const stick = one(c6, ".c6-st");
  const n = it.length;
  c.frame(() => {
    const r = c6.getBoundingClientRect();
    const pin = getComputedStyle(stick).position === "sticky";
    const p = c.reduce ? 1 : pin ? clamp(-r.top / (r.height - innerHeight), 0, 1) : clamp((innerHeight * 0.7 - r.top) / (r.height * 0.8), 0, 1);
    const a = Math.min(n - 1, Math.floor(p * n * 0.999));
    it.forEach((x, j) => {
      x.classList.toggle("on", j === a);
      x.classList.toggle("done", j < a);
    });
    cols.forEach((x, j) => x.classList.toggle("on", j <= a));
    rail.style.setProperty("--cr", (p * 100).toFixed(1) + "%");
    pc.textContent = String(Math.round(p * 100));
  });
});

/* ---------- about: problem list advances with scroll ---------- */
export const AboutProblems = behavior("AboutProblems", (ab, c) => {
  const ps = all(ab, ".ab-p");
  const ds = all(ab, ".ab-d");
  const l = one(ab, ".abp-l");
  const g = one(ab, ".abp-g");
  const n = ps.length;
  c.frame(() => {
    const r = ab.getBoundingClientRect();
    const p = clamp(-r.top / (r.height - innerHeight), 0, 1);
    const a = Math.min(n - 1, Math.floor(p * n * 0.999));
    ps.forEach((x, j) => x.classList.toggle("on", j === a));
    ds.forEach((x, j) => x.classList.toggle("on", j === a));
    if (innerWidth > 1000) {
      const e = ps[a];
      l.style.setProperty("--ly", g.clientHeight / 2 - e.offsetTop - e.offsetHeight / 2 + "px");
    } else l.style.setProperty("--ly", "0px");
  });
});

/* ---------- pricing: volume tiles ---------- */
export const VolumeTiles = behavior("VolumeTiles", (g, c) => {
  const bs = Array.from(g.children) as HTMLElement[];
  const m = g.parentElement!.querySelector(".gmsg")!;
  bs.forEach((b) =>
    c.on(b, "click", () => {
      bs.forEach((x) => {
        x.classList.toggle("on", x === b);
        x.setAttribute("aria-pressed", String(x === b));
      });
      m.textContent = b.dataset.msg || "";
    }),
  );
});

/* ---------- footer: status line + giant wordmark fill ---------- */
export const FooterMotion = behavior("FooterMotion", (f, c) => {
  const st = f.querySelector<HTMLElement>(".stt");
  const states = ["Ringing your agent", "Connected · streaming", "Call completed · events sent"];
  let i = 0;
  if (st && !c.reduce)
    c.every(2600, () => {
      i = (i + 1) % states.length;
      st.textContent = states[i];
    });
  all(f, ".fdial .bars i").forEach((b, k) => (b.style.animationDelay = k * 0.07 + "s"));
  const giant = f.querySelector<HTMLElement>(".giant .w");
  if (giant)
    c.frame(() => {
      const r = giant.getBoundingClientRect();
      giant.style.setProperty("--fill", (clamp((innerHeight - r.top) / (r.height + 40), 0, 1) * 100).toFixed(1) + "%");
    });
});
