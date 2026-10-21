"use client";
/* Three.js backdrop for the purple heroes.
   globe: a dotted sphere with call arcs and packets travelling between cities (homepage).
   wave:  a field of points rolling like a signal (inner pages).
   Loads three.js lazily, pauses off-screen and in hidden tabs, renders one still frame for reduced motion,
   and disposes of everything on unmount. Purely decorative: aria-hidden. */
import { useEffect, useRef } from "react";

type Variant = "globe" | "wave";

export function ThreeField({ variant = "wave" }: { variant?: Variant }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (disposed) return;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const probe = document.createElement("canvas");
      if (!(probe.getContext("webgl2") || probe.getContext("webgl"))) return; // no WebGL: the CSS gradient alone is fine
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
      } catch {
        return; // no WebGL: the CSS gradient alone is fine
      }
      renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
      const group = new THREE.Group();
      scene.add(group);
      const disposables: { dispose: () => void }[] = [];
      const track = <T extends { dispose: () => void }>(o: T) => (disposables.push(o), o);

      // round, soft point sprite
      const dot = (() => {
        const c = document.createElement("canvas");
        c.width = c.height = 64;
        const g = c.getContext("2d")!;
        const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        r.addColorStop(0, "rgba(255,255,255,1)");
        r.addColorStop(0.45, "rgba(255,255,255,.9)");
        r.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = r;
        g.fillRect(0, 0, 64, 64);
        return track(new THREE.CanvasTexture(c));
      })();

      let tick: (t: number) => void = () => {};
      let layout: (w: number, h: number) => void = () => {};

      if (variant === "globe") {
        const R = 1;
        const N = 2400;
        const pos = new Float32Array(N * 3);
        const col = new Float32Array(N * 3);
        const a = new THREE.Color("#E9E0FF");
        const b = new THREE.Color("#9D61FF");
        for (let i = 0; i < N; i++) {
          const y = 1 - (i / (N - 1)) * 2;
          const r = Math.sqrt(1 - y * y);
          const th = Math.PI * (3 - Math.sqrt(5)) * i;
          pos.set([Math.cos(th) * r * R, y * R, Math.sin(th) * r * R], i * 3);
          const c = a.clone().lerp(b, Math.random() * 0.8);
          col.set([c.r, c.g, c.b], i * 3);
        }
        const g = track(new THREE.BufferGeometry());
        g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        g.setAttribute("color", new THREE.BufferAttribute(col, 3));
        const m = track(new THREE.PointsMaterial({ size: 0.022, map: dot, vertexColors: true, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending }));
        group.add(new THREE.Points(g, m));

        // faint halo ring
        const ringG = track(new THREE.RingGeometry(1.18, 1.185, 160));
        const ringM = track(new THREE.MeshBasicMaterial({ color: 0xb69bff, transparent: true, opacity: 0.35, side: THREE.DoubleSide }));
        const ring = new THREE.Mesh(ringG, ringM);
        ring.rotation.x = Math.PI / 2.3;
        group.add(ring);

        // arcs between "cities" with travelling packets
        const ll = (lat: number, lon: number) => {
          const p = (lat * Math.PI) / 180;
          const l = (lon * Math.PI) / 180;
          return new THREE.Vector3(Math.cos(p) * Math.cos(l), Math.sin(p), Math.cos(p) * Math.sin(l)).multiplyScalar(R);
        };
        const cities = [ll(12.97, 77.59), ll(19.07, 72.87), ll(28.61, 77.2), ll(13.08, 80.27), ll(22.57, 88.36), ll(17.38, 78.48), ll(1.35, 103.8), ll(25.2, 55.27), ll(51.5, -0.12), ll(37.77, -122.4)];
        const hub = cities[0];
        const arcs: { curve: InstanceType<typeof THREE.QuadraticBezierCurve3>; packet: InstanceType<typeof THREE.Mesh>; speed: number; offset: number }[] = [];
        const lineM = track(new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.38 }));
        const pkG = track(new THREE.SphereGeometry(0.009, 8, 8));
        const pkM = track(new THREE.MeshBasicMaterial({ color: 0x7cff8a }));
        cities.slice(1).forEach((c, i) => {
          const mid = hub.clone().add(c).multiplyScalar(0.5);
          mid.normalize().multiplyScalar(R + 0.12 + hub.distanceTo(c) * 0.32);
          const curve = new THREE.QuadraticBezierCurve3(hub, mid, c);
          const lg = track(new THREE.BufferGeometry().setFromPoints(curve.getPoints(64)));
          group.add(new THREE.Line(lg, lineM));
          const packet = new THREE.Mesh(pkG, pkM);
          group.add(packet);
          arcs.push({ curve, packet, speed: 0.12 + (i % 4) * 0.035, offset: i * 0.17 });
        });
        const hubM = new THREE.Mesh(track(new THREE.SphereGeometry(0.02, 12, 12)), track(new THREE.MeshBasicMaterial({ color: 0x00b900 })));
        hubM.position.copy(hub);
        group.add(hubM);

        group.rotation.set(0.35, -1.25, 0.12); // India toward the viewer
        layout = (w) => {
          const aspect = w / Math.max(1, el.clientHeight);
          const wide = w > 1000;
          camera.position.set(0, 0, 4.4);
          group.position.set(wide ? Math.min(2.5, 1.02 * aspect) : 0.35, wide ? 0.05 : 0.55, 0);
          group.scale.setScalar(wide ? 1.6 : 1.3);
        };
        tick = (t) => {
          group.rotation.y = -1.25 + Math.sin(t * 0.00012) * 0.35 + mx * 0.12;
          group.rotation.x = 0.35 + my * 0.06;
          arcs.forEach((a) => {
            const u = (t * 0.001 * a.speed + a.offset) % 1;
            a.packet.position.copy(a.curve.getPoint(u));
            a.packet.scale.setScalar(Math.sin(u * Math.PI) * 0.9 + 0.3);
          });
        };
      } else {
        const COLS = 120;
        const ROWS = 36;
        const N = COLS * ROWS;
        const pos = new Float32Array(N * 3);
        const base = new Float32Array(N * 2);
        for (let i = 0; i < ROWS; i++)
          for (let j = 0; j < COLS; j++) {
            const k = i * COLS + j;
            const x = (j / (COLS - 1) - 0.5) * 16;
            const z = (i / (ROWS - 1)) * -9;
            base.set([x, z], k * 2);
            pos.set([x, 0, z], k * 3);
          }
        const g = track(new THREE.BufferGeometry());
        const attr = new THREE.BufferAttribute(pos, 3);
        g.setAttribute("position", attr);
        const m = track(new THREE.PointsMaterial({ size: 0.06, map: dot, color: 0xe9e0ff, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending }));
        const pts = new THREE.Points(g, m);
        group.add(pts);
        camera.position.set(0, 1.6, 4.6);
        camera.lookAt(0, -0.6, -3);
        layout = () => {};
        tick = (t) => {
          const s = t * 0.00045;
          for (let k = 0; k < N; k++) {
            const x = base[k * 2];
            const z = base[k * 2 + 1];
            pos[k * 3 + 1] = Math.sin(x * 0.55 + s * 2) * 0.22 + Math.sin(z * 0.7 + s * 1.3) * 0.18 + Math.sin((x + z) * 0.3 - s) * 0.12 - 1.1;
          }
          attr.needsUpdate = true;
          group.rotation.y = mx * 0.06;
        };
      }

      let mx = 0;
      let my = 0;
      const onMove = (e: PointerEvent) => {
        mx = e.clientX / innerWidth - 0.5;
        my = e.clientY / innerHeight - 0.5;
      };
      const size = () => {
        const w = el.clientWidth || 1;
        const h = el.clientHeight || 1;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        layout(w, h);
        if (reduce || !running) draw(performance.now());
      };
      const draw = (t: number) => {
        tick(t);
        renderer.render(scene, camera);
      };

      let running = false;
      let raf = 0;
      let visible = true;
      const loop = (t: number) => {
        if (!running) return;
        draw(t);
        raf = requestAnimationFrame(loop);
      };
      const setRun = () => {
        const want = visible && !document.hidden && !reduce;
        if (want && !running) {
          running = true;
          raf = requestAnimationFrame(loop);
        } else if (!want && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      };
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        setRun();
      });
      io.observe(el);
      const ro = new ResizeObserver(size);
      ro.observe(el);
      addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("visibilitychange", setRun);
      size();
      draw(performance.now());
      requestAnimationFrame(() => el.classList.add("on"));
      setRun();

      cleanup = () => {
        running = false;
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        removeEventListener("pointermove", onMove);
        document.removeEventListener("visibilitychange", setRun);
        disposables.forEach((d) => d.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [variant]);

  return <div ref={host} className={`th-3d th-3d-${variant}`} aria-hidden="true" />;
}
