"use client";
/* Small animation runtime for React components.
   - one shared, rAF-throttled scroll/resize loop (frame)
   - useDom(): runs a DOM setup against a component's root element and tears every
     listener, timer, observer and frame subscription down when the component unmounts. */
import { useEffect, useRef } from "react";

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const pad2 = (n: number) => String(n).padStart(2, "0");
export const mmss = (s: number) => pad2(Math.floor(s / 60)) + ":" + pad2(s % 60);
export const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const subs = new Set<() => void>();
let ticking = false;
let bound = false;
const runAll = () => {
  ticking = false;
  subs.forEach((f) => f());
};
const schedule = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(runAll);
};
/** Subscribe to the shared scroll/resize frame. Runs once immediately. Returns an unsubscribe. */
export function onFrame(fn: () => void) {
  subs.add(fn);
  if (!bound) {
    bound = true;
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
  }
  fn();
  return () => void subs.delete(fn);
}

export type Ctx = {
  reduce: boolean;
  alive: () => boolean;
  on: <K extends string>(t: EventTarget, type: K, fn: (e: any) => void, opts?: AddEventListenerOptions) => void;
  every: (ms: number, fn: () => void) => void;
  after: (ms: number, fn: () => void) => void;
  frame: (fn: () => void) => void;
  watch: (nodes: Element[], cb: (visible: boolean, el: Element) => void, opts?: IntersectionObserverInit) => void;
  loop: (fn: (now: number) => void) => { start: () => void; stop: () => void };
  cleanup: (fn: () => void) => void;
};

export function makeCtx(): [Ctx, () => void] {
  const fns: (() => void)[] = [];
  let live = true;
  const c: Ctx = {
    reduce: prefersReduced(),
    alive: () => live,
    on: (t, type, fn, opts) => {
      t.addEventListener(type, fn, opts);
      fns.push(() => t.removeEventListener(type, fn, opts));
    },
    every: (ms, fn) => {
      const id = setInterval(fn, ms);
      fns.push(() => clearInterval(id));
    },
    after: (ms, fn) => {
      const id = setTimeout(() => live && fn(), ms);
      fns.push(() => clearTimeout(id));
    },
    frame: (fn) => fns.push(onFrame(fn)),
    watch: (nodes, cb, opts) => {
      const io = new IntersectionObserver((es) => es.forEach((e) => cb(e.isIntersecting, e.target)), opts || { threshold: 0.25 });
      nodes.forEach((n) => io.observe(n));
      fns.push(() => io.disconnect());
    },
    loop: (fn) => {
      let id = 0;
      let running = false;
      const tick = (now: number) => {
        if (!running || !live) return;
        fn(now);
        id = requestAnimationFrame(tick);
      };
      const ctl = {
        start: () => {
          if (running) return;
          running = true;
          id = requestAnimationFrame(tick);
        },
        stop: () => {
          running = false;
          cancelAnimationFrame(id);
        },
      };
      fns.push(ctl.stop);
      return ctl;
    },
    cleanup: (fn) => fns.push(fn),
  };
  return [c, () => {
    live = false;
    fns.splice(0).forEach((f) => f());
  }];
}

/** Attach imperative motion to a component's root element. */
export function useDom<T extends HTMLElement = HTMLElement>(setup: (el: T, c: Ctx) => void, deps: unknown[] = []) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const [c, dispose] = makeCtx();
    setup(el, c);
    return dispose;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

export const all = <T extends Element = HTMLElement>(root: ParentNode, sel: string) => Array.from(root.querySelectorAll<T & Element>(sel)) as T[];
export const one = <T extends Element = HTMLElement>(root: ParentNode, sel: string) => root.querySelector(sel) as T;
