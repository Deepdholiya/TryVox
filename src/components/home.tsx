"use client";
/* Homepage interactive sections. */
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { APP } from "@/content/site";
import { all, clamp, mmss, one, prefersReduced, useDom } from "@/lib/dom";

/* ================================================================ hero call rig */
const SCRIPT: [string, string][] = [
  ["a", "Hi, this is Riya calling from Acme Finance. Is this a good time?"],
  ["c", "Yes, go ahead."],
  ["a", "Your EMI of ₹4,250 is due on Friday. Shall I send a payment link on WhatsApp?"],
  ["c", "Yes please."],
  ["ev ok", "Call completed · 6 events sent to your webhook"],
];

let audio: AudioContext | null = null;
function tone(fs: number[], dur: number, vol: number) {
  try {
    audio = audio || new (window.AudioContext || (window as any).webkitAudioContext)();
    const g = audio.createGain();
    g.connect(audio.destination);
    const n = audio.currentTime;
    g.gain.setValueAtTime(0, n);
    g.gain.linearRampToValueAtTime(vol, n + 0.03);
    g.gain.setValueAtTime(vol, n + dur - 0.05);
    g.gain.linearRampToValueAtTime(0, n + dur);
    fs.forEach((f) => {
      const o = audio!.createOscillator();
      o.frequency.value = f;
      o.connect(g);
      o.start(n);
      o.stop(n + dur + 0.02);
    });
  } catch {}
}

export function HeroRig() {
  const [status, setStatus] = useState("ready");
  const [secs, setSecs] = useState(0);
  const [live, setLive] = useState(false);
  const [led, setLed] = useState<[boolean, boolean]>([true, false]);
  const [feed, setFeed] = useState<{ id: number; k: string; t: string }[]>([
    { id: -2, k: "ev", t: "Number provisioned · SIP trunk attached" },
    { id: -1, k: "ev ok", t: "Agent connected · waiting for a call" },
  ]);
  const [down, setDown] = useState(false);
  const [done, setDone] = useState(false);
  const [emailHint, setEmailHint] = useState("you@company.com");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clock = useRef<ReturnType<typeof setInterval>>(undefined);
  const typer = useRef<ReturnType<typeof setInterval>>(undefined);
  const uid = useRef(0);
  const rig = useRef<HTMLDivElement>(null);

  const later = (f: () => void, ms: number) => timers.current.push(setTimeout(f, ms));
  const add = (k: string, t: string) => setFeed((f) => [...f, { id: uid.current++, k, t }].slice(-6));
  const type = (word: string) => {
    clearInterval(typer.current);
    if (prefersReduced()) return setStatus(word);
    let i = 0;
    setStatus("");
    typer.current = setInterval(() => {
      setStatus(word.slice(0, ++i));
      if (i >= word.length) clearInterval(typer.current);
    }, 45);
  };
  const stopAll = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    clearInterval(clock.current);
  };
  const end = (finished: boolean) => {
    stopAll();
    setLive(false);
    type(finished ? "call ended" : "ready");
  };
  const start = () => {
    stopAll();
    setFeed([]);
    setLive(true);
    setLed([false, false]);
    setSecs(0);
    type("dialing");
    tone([350, 440], 0.25, 0.03);
    later(() => {
      setLed([true, false]);
      add("ev", "Outbound from +91 80 4718 2290");
    }, 400);
    later(() => {
      type("ringing");
      add("ev", "Routed · carrier primary · in-south");
      tone([440, 480], 1, 0.025);
    }, 1000);
    later(() => {
      setLed([true, true]);
      type("connected");
      add("ev ok", "Answered · audio streaming to your agent");
      clock.current = setInterval(() => setSecs((s) => s + 1), 1000);
      SCRIPT.forEach(([k, t], i) => later(() => add(k, t), 900 + i * 1700));
      later(() => end(true), 900 + SCRIPT.length * 1700);
    }, 2600);
  };
  useEffect(() => () => {
    stopAll();
    clearInterval(typer.current);
  }, []);

  useEffect(() => {
    const el = rig.current;
    if (!el || prefersReduced() || !matchMedia("(hover:hover)").matches) return;
    el.style.transition = "transform .6s cubic-bezier(.22,1,.36,1)";
    const mv = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(1600px) rotateY(${x * 2.4}deg) rotateX(${-y * 2.4}deg)`;
    };
    const lv = () => (el.style.transform = "");
    el.addEventListener("mousemove", mv);
    el.addEventListener("mouseleave", lv);
    return () => {
      el.removeEventListener("mousemove", mv);
      el.removeEventListener("mouseleave", lv);
    };
  }, []);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const em = e.currentTarget.elements.namedItem("email") as HTMLInputElement;
    if (!em.value || !em.checkValidity()) {
      em.value = "";
      setEmailHint("Enter a valid work email");
      em.focus();
      return;
    }
    setDone(true);
  };

  return (
    <div className="rig" id="rig" ref={rig}>
      <div className="glass">
        <div className="g-status">
          <span>{status}</span>
          <small>
            Line 01 · <b>{mmss(secs)}</b>
          </small>
        </div>
        <div className="g-lcd">+91 80 4718 2290</div>
        <div className="g-feed" aria-live="polite">
          {feed.map((m) => (
            <div className={`msg ${m.k}`} key={m.id}>
              {m.t}
            </div>
          ))}
        </div>
        {done ? (
          <p className="g-done">
            Next, create your account. <a href={APP}>Continue to sign-up ↗</a>
          </p>
        ) : (
          <form noValidate onSubmit={submit}>
            <p className="g-hint">
              Press <b style={{ color: "var(--glass-ink)", fontWeight: 500 }}>Call</b> to hear a call flow through TryVox. Then start free with your work email.
            </p>
            <div className="g-form">
              <input name="email" type="email" placeholder={emailHint} aria-label="Work email" autoComplete="email" required />
              <button type="submit">Continue</button>
            </div>
            <p className="g-fine">Used to set up your free account and test number.</p>
          </form>
        )}
      </div>
      <div className="pad">
        <div className="grille" aria-hidden="true">
          {Array.from({ length: 14 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
        <div className="qd q1">
          <span className="mark">TRYVOX</span>
        </div>
        <div className="qd q2" />
        <div className="qd q3">
          <span className={`led${led[0] ? " on" : ""}`}>
            <i />
            Number
          </span>
        </div>
        <div className="qd q4">
          <span className={`led${led[1] ? " on" : ""}`}>
            <i />
            SIP · Stream
          </span>
        </div>
        <button
          className={`dial${live ? " live" : ""}${down ? " down" : ""}`}
          aria-label={live ? "End the demo call" : "Start the demo call"}
          onClick={() => {
            setDown(true);
            setTimeout(() => setDown(false), 150);
            live ? end(false) : start();
          }}
        >
          <span className="dial-face">
            <span className="dash" />
            <span>{live ? "END" : "CALL"}</span>
          </span>
        </button>
      </div>
    </div>
  );
}

/* ================================================================ industries */
const IND = [
  { slug: "financial-services", n: "Financial services", c: "#3B2A63", h: "Collections and reminders that connect.", s: "Local caller ID, payment links on WhatsApp and a human one transfer away.", f: [["Trigger", "EMI due in 3 days"], ["Call", "Agent calls from a local number"], ["Outcome", "Promise to pay: Friday"], ["Follow-up", "WhatsApp payment link sent"]], big: "EMI collected on time" },
  { slug: "healthcare", n: "Healthcare", c: "#24485A", h: "Appointments booked without hold music.", s: "Inbound lines per clinic, rescheduling by phone and reminders by SMS.", f: [["Inbound", "Patient calls the clinic"], ["Agent", "Checks open slots"], ["Booked", "Thursday, 4 PM"], ["Reminder", "SMS 24 hours before"]], big: "Appointment booked" },
  { slug: "ecommerce", n: "E-commerce", c: "#5B2B4E", h: "Order confirmations at checkout speed.", s: "COD checks, cart recovery and order-status calls at sale-day volume.", f: [["Trigger", "COD order placed"], ["Call", "Agent confirms address"], ["Keypad", "Customer presses 1"], ["Outcome", "Order released to ship"]], big: "COD order confirmed" },
  { slug: "logistics", n: "Logistics", c: "#4A3A22", h: "Delivery calls that reach the doorstep.", s: "Slot confirmations and rescheduling, with numbers masked on both sides.", f: [["Trigger", "Out for delivery"], ["Call", "Agent confirms the slot"], ["Change", "Customer asks for 6 PM"], ["Update", "Driver app updated"]], big: "Delivery rescheduled" },
  { slug: "real-estate", n: "Real estate", c: "#283D33", h: "Every enquiry called back in minutes.", s: "Qualify leads the moment they land and book site visits while interest is high.", f: [["Lead", "Form filled on a portal"], ["Call", "Agent calls back in 60 seconds"], ["Qualify", "Budget and location"], ["Booked", "Site visit on Sunday"]], big: "Site visit booked" },
  { slug: "travel-hospitality", n: "Travel & hospitality", c: "#2D3360", h: "Bookings and changes, around the clock.", s: "24/7 lines, toll-free numbers and confirmations by SMS.", f: [["Inbound", "Guest calls the hotel"], ["Agent", "Finds the booking"], ["Change", "Late check-out added"], ["Confirm", "SMS sent to guest"]], big: "Booking updated" },
];

function SlabArt({ i }: { i: number }) {
  return (
    <svg className="art" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id={`ig${i}`} cx={`${30 + i * 9}%`} cy={`${70 - i * 6}%`} r="80%">
          <stop offset="0" stopColor="#B98BFF" stopOpacity=".55" />
          <stop offset=".55" stopColor="#B98BFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill={`url(#ig${i})`} />
      {Array.from({ length: 14 }, (_, k) => (
        <path key={k} d={`M${-20 + k * 4} ${80 + k * 18} C 140 ${40 + k * 20}, 260 ${200 + k * 6}, 420 ${120 + k * 16}`} stroke="#fff" strokeOpacity={(0.05 + k * 0.012).toFixed(3)} fill="none" />
      ))}
    </svg>
  );
}

export function Industries() {
  const [cur, setCur] = useState(0);
  const set = (i: number) => setCur((i + IND.length) % IND.length);
  const d = IND[cur];
  return (
    <section className="ind wrap" id="industries" aria-labelledby="ind-h">
      <div className="ind-head rv">
        <div>
          <p className="tag">
            <i />
            Use cases
          </p>
          <h2 className="hd h2" id="ind-h" style={{ marginTop: 20 }}>
            Built for AI calling in <em>every</em> industry.
          </h2>
          <p className="sub">Swap call-centre queues for agents that pick up on the first ring, in the industries where calls matter most.</p>
        </div>
        <div className="arrows">
          <button aria-label="Previous industry" onClick={() => set(cur - 1)}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M10 3L5 8l5 5" />
            </svg>
          </button>
          <button aria-label="Next industry" onClick={() => set(cur + 1)}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M6 3l5 5-5 5" />
            </svg>
          </button>
        </div>
      </div>
      <div className="ind-card rv">
        <div className="ind-copy" aria-live="polite">
          <h3>
            {d.h} <span>{d.s}</span>
          </h3>
          <div className="ind-flow">
            {d.f.map(([k, v]) => (
              <div key={k}>
                <b>{k}</b>
                <span>{v}</span>
              </div>
            ))}
          </div>
          <div className="row">
            <a href={`/solutions/${d.slug}/`}>
              {String(cur + 1).padStart(2, "0")} / 06 · {d.n} →
            </a>
            <a className="kbtn" href={APP}>Start free</a>
          </div>
        </div>
        <div className="acc" role="tablist" aria-label="Industries">
          {IND.map((x, i) => (
            <div
              key={x.n}
              className={`slab${i === cur ? " on" : ""}`}
              style={{ "--bgc": x.c } as CSSProperties}
              role="tab"
              tabIndex={0}
              aria-selected={i === cur}
              aria-label={x.n}
              onClick={() => set(i)}
              onMouseEnter={() => matchMedia("(hover:hover)").matches && set(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  set(i);
                }
              }}
            >
              <SlabArt i={i} />
              <span className="vert">{x.n}</span>
              <span className="big">{x.big}</span>
              <span className="lbl">
                {String(i + 1).padStart(2, "0")} · {x.n}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================ isometric layer stack (pinned) */
const NS = "http://www.w3.org/2000/svg";
const LAYERS = [
  { k: "01 · Your agent", p: "The voice agent you built, on any platform. It listens, thinks and talks." },
  { k: "02 · Your stack", p: "Vapi, Retell, LiveKit, Bolna or your own code. Keep the tools you already use." },
  { k: "03 · Our platform", p: "TryVox numbers, SIP trunks, live audio streaming, call control and webhooks." },
  { k: "04 · Our carrier network", p: "Licensed carrier routes, KYC-verified Indian numbers, consent and DLT compliance." },
];

export function LayerStack() {
  const ref = useDom<HTMLElement>((sec, c) => {
    const iso = one<SVGSVGElement>(sec, "svg.iso");
    iso.replaceChildren();
    const el = (tag: string, attrs: Record<string, string | number>, parent?: Element) => {
      const n = document.createElementNS(NS, tag);
      for (const k in attrs) n.setAttribute(k, String(attrs[k]));
      if (parent) parent.append(n);
      return n;
    };
    const S = 200, cx0 = 290, TH = 10;
    const P = (x: number, y: number) => [cx0 + (x - y) * 0.866 * S, (x + y) * 0.5 * S];
    const pts = (a: number[][]) => a.map((p) => p.join(",")).join(" ");
    const quad = (x0: number, y0: number, x1: number, y1: number) => [P(x0, y0), P(x1, y0), P(x1, y1), P(x0, y1)];
    const txt = (g: Element, x: number, y: number, s: string) => {
      const p = P(x, y);
      el("text", { class: "tx", transform: `translate(${p[0]} ${p[1]}) rotate(30)` }, g).textContent = s;
    };
    const draw: ((g: Element) => void)[] = [
      (g) => {
        el("polygon", { class: "soft", points: pts(quad(0.08, 0.08, 0.92, 0.22)) }, g);
        [0.3, 0.4, 0.5].forEach((y, i) => el("polygon", { class: "ink", points: pts(quad(0.12, y, 0.12 + [0.62, 0.48, 0.56][i], y + 0.05)) }, g));
        el("polygon", { class: "soft", points: pts(quad(0.12, 0.64, 0.88, 0.88)) }, g);
        for (let k = 0; k < 9; k++) {
          const h = [0.06, 0.12, 0.18, 0.1, 0.2, 0.14, 0.08, 0.16, 0.1][k];
          el("polygon", { class: "ink", points: pts(quad(0.2 + k * 0.07, 0.76 - h / 2, 0.24 + k * 0.07, 0.76 + h / 2)) }, g);
        }
        txt(g, 0.1, 0.12, "RUN:AGENT");
      },
      (g) => {
        ["VAPI", "RETELL", "LIVEKIT", "BOLNA"].forEach((n, i) => {
          const x = 0.08 + (i % 2) * 0.44, y = 0.1 + Math.floor(i / 2) * 0.42;
          el("polygon", { class: "face", points: pts(quad(x, y, x + 0.4, y + 0.36)), style: "stroke-dasharray:3 3" }, g);
          txt(g, x + 0.06, y + 0.2, n);
        });
      },
      (g) => {
        for (let k = 0; k < 14; k++) {
          const a = P(0.06 + k * 0.028, 0.08), b = P(0.06 + k * 0.028, 0.92);
          el("line", { class: "hatch", x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, g);
        }
        ([["NUMBERS", 0.5, 0.08], ["SIP", 0.5, 0.3], ["STREAM", 0.5, 0.52], ["EVENTS", 0.5, 0.74]] as [string, number, number][]).forEach(([n, x, y]) => {
          el("polygon", { class: "soft", points: pts(quad(x, y, x + 0.42, y + 0.18)) }, g);
          txt(g, x + 0.04, y + 0.11, n);
        });
        txt(g, 0.09, 0.5, "TRYVOX");
      },
      (g) => {
        for (let k = 0; k < 22; k++) {
          const w = [0.02, 0.035, 0.015, 0.03][k % 4], x = 0.1 + k * 0.036;
          el("polygon", { class: "ink", points: pts(quad(x, 0.62, x + w * 0.8, 0.9)) }, g);
        }
        for (let r = 0; r < 3; r++)
          for (let k = 0; k < 6; k++) {
            const a = P(0.12 + k * 0.13, 0.12 + r * 0.14);
            el("path", { class: "ln", d: `M${a[0] - 5} ${a[1]} l10 0 M${a[0]} ${a[1] - 3} l0 6` }, g);
          }
        txt(g, 0.1, 0.52, "PSTN · +91 · DLT");
      },
    ];
    const guides = el("g", {}, iso);
    const gds = [[0, 0], [1, 0], [1, 1], [0, 1]].map((p) => ({ c: P(p[0], p[1]), l: el("line", { class: "gd" }, guides) }));
    const lyG: Element[] = [];
    for (let i = LAYERS.length - 1; i >= 0; i--) {
      const g = el("g", { class: "ly" }, iso);
      const b = el("g", { class: "bob", style: `animation-delay:${-i * 1.3}s` }, g);
      const base = quad(0, 0, 1, 1);
      el("polygon", { class: "side", points: pts([base[1], base[2], [base[2][0], base[2][1] + TH], [base[1][0], base[1][1] + TH]]) }, b);
      el("polygon", { class: "side", points: pts([base[2], base[3], [base[3][0], base[3][1] + TH], [base[2][0], base[2][1] + TH]]) }, b);
      el("polygon", { class: "face", points: pts(base) }, b);
      draw[i](b);
      const rc = P(1, 0);
      el("line", { class: "lead", x1: rc[0] + 6, y1: rc[1], x2: rc[0] + 34, y2: rc[1] }, b);
      el("text", { class: "num", x: rc[0] + 40, y: rc[1] + 4 }, b).textContent = "0" + (i + 1);
      lyG[i] = g;
    }
    const pkts = [0, 1, 2].map((k) => el("circle", { class: "pk" + (k === 1 ? " g" : ""), r: 4, cx: cx0, cy: -20 }, iso));
    const ltrack = one(sec, ".ltrack"), lstage = one(sec, ".lstage"), lis = all(sec, ".layers li"), capK = one(sec, ".lcap b"), capP = one(sec, ".lcap p");
    let lcur = -1, lTop = 0, lYs = [0, 0, 0, 0];
    const OPEN = 116, CLOSED = 14;
    const ease = (t: number) => t * t * (3 - 2 * t);
    const layout = (p: number) => {
      const a = Math.min(3, Math.floor(p * 4));
      const e = [1, 1, 2, 3].map((k, i) => (i === 0 ? 1 : ease(clamp(p * 4 - k + 0.9, 0, 1))));
      const ys = [0];
      for (let k = 1; k < 4; k++) ys[k] = ys[k - 1] + CLOSED + e[k] * (OPEN - CLOSED);
      lYs = ys;
      lTop = (640 - (ys[3] + S + TH)) / 2;
      lyG.forEach((g, i) => {
        (g as SVGGElement).style.transform = `translateY(${lTop + ys[i] - (i === a ? 14 : 0)}px)`;
        g.classList.toggle("shut", i > 0 && e[i] < 0.35);
      });
      gds.forEach(({ c: pt, l }) => {
        l.setAttribute("x1", String(pt[0]));
        l.setAttribute("x2", String(pt[0]));
        l.setAttribute("y1", String(lTop + pt[1]));
        l.setAttribute("y2", String(lTop + ys[3] + pt[1]));
      });
      if (a !== lcur) {
        lcur = a;
        lyG.forEach((g, i) => {
          g.classList.toggle("on", i === a);
          g.classList.toggle("dim", i !== a);
        });
        lis.forEach((li, i) => li.classList.toggle("on", i === a));
        capK.textContent = LAYERS[a].k;
        capP.textContent = LAYERS[a].p;
      }
    };
    const progress = () => {
      const r = ltrack.getBoundingClientRect();
      const stick = parseFloat(getComputedStyle(lstage).top) || 0;
      return clamp((stick - r.top) / Math.max(1, ltrack.offsetHeight - lstage.offsetHeight), 0, 1);
    };
    layout(0);
    c.frame(() => layout(progress()));
    const loop = c.loop((now) => {
      const y0 = lTop + S / 2, y1 = lTop + lYs[Math.max(lcur, 0)] + S / 2, on = lcur > 0;
      pkts.forEach((cc, k) => {
        const u = (now / 2600 + k / 3) % 1;
        cc.setAttribute("cy", String(y0 + (y1 - y0) * u));
        cc.setAttribute("opacity", on ? Math.sin(u * Math.PI).toFixed(2) : "0");
      });
    });
    if (c.reduce) pkts.forEach((cc) => cc.setAttribute("opacity", "0"));
    else c.watch([ltrack], (v) => (v ? loop.start() : loop.stop()), { threshold: 0 });
    lis.forEach((li) =>
      c.on(li, "click", () => {
        const range = ltrack.offsetHeight - lstage.offsetHeight;
        const stick = parseFloat(getComputedStyle(lstage).top) || 0;
        scrollTo({ top: ltrack.getBoundingClientRect().top + scrollY - stick + range * ((+li.dataset.i! + 0.55) / 4), behavior: c.reduce ? "auto" : "smooth" });
      }),
    );
  });

  return (
    <section aria-labelledby="ly-h" ref={ref}>
      <div className="ltrack" id="ltrack">
        <div className="lstage" id="lstage">
          <div className="lleft">
            <p className="tag">
              <i />
              Calls that keep connecting
            </p>
            <h2 className="hd h2" id="ly-h" style={{ marginTop: 20 }}>
              Telephony infrastructure built to <em>connect</em>
            </h2>
            <p className="sub">Your agent and your stack sit on top. Our platform and carrier network do the hard part underneath: numbers, routing, live audio and compliance.</p>
            <ol className="layers">
              {["Your agent", "Your stack", "Our platform", "Our carrier network"].map((t, i) => (
                <li className={i === 0 ? "on" : undefined} data-i={i} key={t}>
                  <span className="rd" />
                  <b>0{i + 1}</b>
                  {t}
                </li>
              ))}
            </ol>
          </div>
          <div className="lright">
            <svg className="iso" viewBox="0 0 600 640" preserveAspectRatio="xMidYMid meet" aria-hidden="true" />
            <div className="lcap" aria-live="polite">
              <b>{LAYERS[0].k}</b>
              <p>{LAYERS[0].p}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================ how it works: strands canvas */
const HT: [string, string][] = [
  ["Number.", "Search, buy and configure numbers with KYC done online."],
  ["Connect.", "Bind the number to your Vapi, Retell, LiveKit or Bolna agent in the dashboard."],
  ["Stream.", "Live audio flows both ways while your agent talks."],
  ["Observe.", "Webhooks, recordings and call records for every call."],
];

export function HowItWorks() {
  const [step, setStep] = useState(0);
  const [swap, setSwap] = useState(false);
  const shown = useRef(0);
  const ref = useDom<HTMLElement>((how, c) => {
    const cv = one<HTMLCanvasElement>(how, "canvas");
    const cx = cv.getContext("2d")!;
    const ht = one(how, ".htrack"), hs = one(how, ".hstage");
    const railB = all(how, ".seg .grp button");
    let hp = 0, W = 0, H = 0;
    const t0 = performance.now();
    const size = () => {
      const d = Math.min(2, devicePixelRatio || 1);
      W = hs.clientWidth;
      H = hs.clientHeight;
      cv.width = Math.max(1, W * d);
      cv.height = Math.max(1, H * d);
      cx.setTransform(d, 0, 0, d, 0, 0);
    };
    size();
    c.on(window, "resize", size);
    const groups = [{ label: "Phone numbers", y: 0.34, n: 12 }, { label: "SIP trunks", y: 0.52, n: 10 }, { label: "Carriers", y: 0.7, n: 12 }];
    const bez = (p0: number, p1: number, p2: number, p3: number, t: number) => {
      const u = 1 - t;
      return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
    };
    const draw = (now: number) => {
      const t = (now - t0) / 1000;
      cx.clearRect(0, 0, W, H);
      const col = "255,255,255";
      const mob = W < 700, nx = W * 0.62, ny = H * (mob ? 0.6 : 0.56);
      groups.forEach((g, gi) => {
        const active = gi === 0 || hp > 0.2;
        const reach = gi === 0 ? clamp(0.35 + hp * 2.2, 0, 1) : clamp((hp - 0.2) * 2.6, 0, 1);
        const sp = H * (mob ? 0.007 : 0.009);
        for (let k = 0; k < g.n; k++) {
          const sx = W * 0.03 + ((k * 37) % 11) * W * 0.004, sy = H * g.y + (k - g.n / 2) * sp + Math.sin(t * 0.6 + k) * 2;
          const c1x = W * 0.28, c1y = sy + (k - g.n / 2) * 3, c2x = nx - W * 0.18, c2y = ny + (k - g.n / 2) * 1.2, steps = 60, lim = Math.floor(steps * reach);
          cx.beginPath();
          cx.moveTo(sx, sy);
          for (let s = 1; s <= lim; s++) {
            const u = s / steps;
            cx.lineTo(bez(sx, c1x, c2x, nx, u), bez(sy, c1y, c2y, ny, u));
          }
          const lead = k === Math.floor(g.n / 2);
          cx.strokeStyle = `rgba(${col},${lead ? 0.95 : active ? 0.28 : 0.1})`;
          cx.lineWidth = lead ? 1.4 : 1;
          cx.stroke();
          cx.fillStyle = `rgba(${col},.7)`;
          cx.fillRect(sx - 1, sy - 1, 2, 2);
          if (hp > 0.48 && k % 3 === 0)
            for (let m = 0; m < 2; m++) {
              const u = (t * 0.18 + k * 0.07 + m * 0.5) % 1;
              cx.fillStyle = "rgba(124,255,138,.95)";
              cx.beginPath();
              cx.arc(bez(sx, c1x, c2x, nx, u), bez(sy, c1y, c2y, ny, u), 1.8, 0, 7);
              cx.fill();
            }
        }
        cx.fillStyle = `rgba(${col},${active ? 0.85 : 0.45})`;
        cx.font = "13px Geist, system-ui, sans-serif";
        cx.fillText(g.label, W * 0.03, H * g.y - (sp * g.n) / 2 - 12);
      });
      const lbl = hp > 0.72 ? "Your agent, on every call" : hp > 0.48 ? "Your agent, live" : "Your agent";
      cx.font = "500 15px Geist, system-ui, sans-serif";
      const pw = cx.measureText(lbl).width + 24, ph = 32;
      const lx = mob ? clamp(nx - pw / 2, 12, W - pw - 12) : nx + 18, ly = mob ? ny + 20 : ny - ph / 2;
      if (hp > 0.72) {
        const x0 = mob ? nx + 14 : lx + pw + 14, r = clamp((hp - 0.72) * 4, 0, 1), ex = x0 + (W - x0 - 24) * r;
        if (ex > x0) {
          cx.strokeStyle = `rgba(${col},.5)`;
          cx.lineWidth = 1;
          cx.setLineDash([2, 5]);
          cx.beginPath();
          cx.moveTo(x0, ny);
          cx.lineTo(ex, ny);
          cx.stroke();
          cx.setLineDash([]);
          for (let i = 1; i < 5; i++) {
            const x = x0 + ((W - x0 - 24) * i) / 5;
            if (x < ex) {
              cx.fillStyle = `rgba(${col},.8)`;
              cx.fillRect(x - 1, ny - 5, 2, 10);
            }
          }
        }
      }
      cx.fillStyle = "#121016";
      cx.strokeStyle = "rgba(255,255,255,.9)";
      cx.lineWidth = 1.5;
      cx.beginPath();
      if (cx.roundRect) cx.roundRect(nx - 9, ny - 9, 18, 18, 4);
      else cx.rect(nx - 9, ny - 9, 18, 18);
      cx.fill();
      cx.stroke();
      cx.fillStyle = "#00B900";
      cx.fillRect(nx - 5, ny - 5, 10, 10);
      cx.beginPath();
      if (cx.roundRect) cx.roundRect(lx, ly, pw, ph, ph / 2);
      else cx.rect(lx, ly, pw, ph);
      cx.fillStyle = "rgba(24,8,58,.62)";
      cx.fill();
      cx.strokeStyle = "rgba(255,255,255,.22)";
      cx.lineWidth = 1;
      cx.stroke();
      cx.fillStyle = "#FFFFFF";
      cx.fillText(lbl, lx + 12, ly + 21);
    };
    const loop = c.loop(draw);
    c.watch([ht], (v) => (v && !c.reduce ? loop.start() : loop.stop()), { threshold: 0 });
    draw(performance.now());
    c.frame(() => {
      const r = ht.getBoundingClientRect();
      const stick = parseFloat(getComputedStyle(hs).top) || 0;
      hp = clamp((stick - r.top) / Math.max(1, ht.offsetHeight - hs.offsetHeight), 0, 1);
      const s = Math.min(3, Math.floor(hp * 4));
      railB.forEach((b, k) => {
        const v = clamp(hp * 4 - k, 0, 1);
        (b.querySelector(".pf") as HTMLElement).style.setProperty("--p", v.toFixed(3));
        b.classList.toggle("done", v >= 0.999 && k < 3);
      });
      how.style.setProperty("--hd", hp.toFixed(3));
      if (s !== shown.current) {
        shown.current = s;
        setSwap(true);
        c.after(c.reduce ? 0 : 260, () => {
          setStep(s);
          setSwap(false);
        });
      }
      if (c.reduce) draw(performance.now());
    });
    railB.forEach((b) =>
      c.on(b, "click", () => {
        const range = ht.offsetHeight - hs.offsetHeight;
        const stick = parseFloat(getComputedStyle(hs).top) || 0;
        scrollTo({ top: ht.getBoundingClientRect().top + scrollY - stick + range * ((+b.dataset.go! + 0.55) / 4), behavior: c.reduce ? "auto" : "smooth" });
      }),
    );
  });

  return (
    <section className="how" aria-labelledby="how-h" ref={ref}>
      <div className="wrap how-intro rv">
        <p className="tag">
          <i />
          How it works
        </p>
        <h2 className="hd h2" id="how-h" style={{ marginTop: 20 }}>
          Turn any agent into a <em>phone line.</em>
        </h2>
        <p className="sub">Bring numbers, trunks and carriers together, connect your agent and watch every call it takes.</p>
      </div>
      <div className="htrack" id="htrack">
        <div className="hstage" id="hstage">
          <canvas aria-hidden="true" />
          <div className="vig" aria-hidden="true" />
          <div className={`htitle${swap ? " swap" : ""}`} aria-live="polite">
            <h3>{HT[step][0]}</h3>
            <p>{HT[step][1]}</p>
          </div>
          <div className="seg">
            <span className="cnt">
              <b>0{step + 1}</b> / 04
            </span>
            <div className="grp">
              {HT.map(([t], i) => (
                <button className={i === step ? "on" : undefined} data-go={i} key={t}>
                  {t.replace(".", "")}
                  <i className="pf" />
                </button>
              ))}
            </div>
            <a href="https://docs.tryvox.io/">Read the docs ↗</a>
          </div>
        </div>
      </div>
      {/* every step stays in the HTML for crawlers and screen readers */}
      <ol className="sr-only">
        {HT.map(([t, p]) => (
          <li key={t}>
            {t} {p}
          </li>
        ))}
      </ol>
    </section>
  );
}

