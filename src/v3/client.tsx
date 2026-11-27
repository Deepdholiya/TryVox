"use client";
/* Interactive v3 pieces: the hero call trace, tabbed code panel and the sizing estimator. */
import { useEffect, useState, type ReactNode } from "react";

/* ---------- hero call trace ---------- */
type Ev = { t: string; k: string; v: string; c?: "say" | "caller" };
const TRACE: Ev[] = [
  { t: "00:00.000", k: "INVITE", v: "+91 98••• ••418 → +91 80 4718 2290" },
  { t: "00:00.180", k: "180", v: "Ringing" },
  { t: "00:02.410", k: "200 OK", v: "Answered · bound to your agent" },
  { t: "00:02.430", k: "STREAM", v: "Audio open to wss://agent.yourapp.in" },
  {
    t: "00:03.100",
    k: "Agent",
    v: "Namaste! Calling from Kirana Box about your COD order. Shall we deliver tomorrow evening?",
    c: "say",
  },
  {
    t: "00:07.820",
    k: "Caller",
    v: "Haan, kal shaam ko bhej do.",
    c: "caller",
  },
  {
    t: "00:09.040",
    k: "Agent",
    v: "Done. I've sent the slot to your WhatsApp.",
    c: "say",
  },
  { t: "00:09.600", k: "HOOK", v: "status_callback · completed · 200" },
];

export function CallTrace() {
  const [n, setN] = useState(TRACE.length);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0;
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      if (!alive) return;
      i = i >= TRACE.length ? 1 : i + 1;
      setN(i);
      timer = setTimeout(
        step,
        i >= TRACE.length ? 4200 : i === 5 || i === 6 ? 1500 : 650,
      );
    };
    setN(0);
    timer = setTimeout(step, 500);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);
  return (
    <div className="pn">
      <div className="pn-bar">
        <span>tryvox/call-trace</span>
        <span className="r ok">
          <i className="dot ok" /> Live call
        </span>
      </div>
      <ol className="trace" aria-hidden="true">
        {TRACE.map((e, i) => (
          <li className={`${e.c ?? ""}${i < n ? " on" : ""}`} key={e.t}>
            <span className="t">{e.t}</span>
            <span className="k">{e.k}</span>
            <span className="v">{e.v}</span>
          </li>
        ))}
      </ol>
      <p className="sr-only">
        Example call trace: an inbound call rings, is answered and bound to your
        AI agent, audio streams to the agent, the agent confirms a delivery slot
        with the caller in Hindi, and a status webhook reaches your server.
      </p>
      <div className="pn-foot">
        <span>SIP · WebRTC · WebSocket</span>
        <span>India region</span>
      </div>
    </div>
  );
}

/* ---------- tabbed code ---------- */
export function Code({
  path,
  tabs,
  foot,
}: {
  path: string;
  tabs: [string, string][];
  foot?: ReactNode;
}) {
  const [i, setI] = useState(0);
  const [copied, setCopied] = useState(false);
  return (
    <div className="pn">
      <div className="pn-bar">
        <span>{path}</span>
        <span className="lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className="code-tabs" role="group" aria-label="Language">
        {tabs.map(([l], k) => (
          <button key={l} aria-pressed={k === i} onClick={() => setI(k)}>
            {l}
          </button>
        ))}
        <button
          className="copy"
          onClick={() => {
            navigator.clipboard?.writeText(tabs[i][1]).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            });
          }}
        >
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <div className="term">
        <pre tabIndex={0} aria-label={`${tabs[i][0]} example`}>
          {tabs[i][1].split("\n").map((line, k) => (
            <span
              key={k}
              className={/^\s*(#|\/\/)/.test(line) ? "c" : undefined}
            >
              {line}
              {"\n"}
            </span>
          ))}
        </pre>
      </div>
      {foot && <div className="pn-foot">{foot}</div>}
    </div>
  );
}

/* ---------- sizing estimator ---------- */
const nf = (n: number) => Math.round(n).toLocaleString("en-IN");
export function Estimator() {
  const [calls, setCalls] = useState(50000);
  const [mins, setMins] = useState(2.5);
  const [hrs, setHrs] = useState(9);
  const perHr = calls / (22 * hrs);
  const conc = Math.max(1, Math.ceil(((perHr * mins) / 60) * 2.5));
  const body = `Hi TryVox team,\n\nWe expect about ${nf(calls * mins)} minutes a month (${nf(calls)} calls, ${mins} min average) and around ${conc} peak concurrent calls. Could you share a rate card?`;
  return (
    <div className="pn">
      <div className="pn-bar">
        <span>/estimate/your-volume</span>
        <span className="r">Estimate only</span>
      </div>
      <div className="est">
        <div className="est-in">
          <label htmlFor="eCalls">
            <span>
              Calls per month <b>{nf(calls)}</b>
            </span>
            <input
              type="range"
              id="eCalls"
              min={1000}
              max={1000000}
              step={1000}
              value={calls}
              onChange={(e) => setCalls(+e.target.value)}
            />
          </label>
          <label htmlFor="eMin">
            <span>
              Average call length <b>{mins} min</b>
            </span>
            <input
              type="range"
              id="eMin"
              min={0.5}
              max={10}
              step={0.5}
              value={mins}
              onChange={(e) => setMins(+e.target.value)}
            />
          </label>
          <label htmlFor="eHrs">
            <span>
              Calling hours a day <b>{hrs} h</b>
            </span>
            <input
              type="range"
              id="eHrs"
              min={4}
              max={24}
              step={1}
              value={hrs}
              onChange={(e) => setHrs(+e.target.value)}
            />
          </label>
          <div className="btns">
            <a
              className="btn"
              href={`mailto:team@tryvox.io?subject=${encodeURIComponent("Rate card request")}&body=${encodeURIComponent(body)}`}
            >
              Get a rate card{" "}
              <span className="ar" aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </div>
        <div className="est-out" aria-live="polite">
          <div>
            <span className="cap">Minutes a month</span>
            <b>{nf(calls * mins)}</b>
          </div>
          <div>
            <span className="cap">Peak concurrent calls</span>
            <b>{conc}</b>
          </div>
          <div>
            <span className="cap">Calls an hour</span>
            <b>{nf(perHr)}</b>
          </div>
          <div>
            <span className="cap">Minutes a working day</span>
            <b>{nf((calls * mins) / 22)}</b>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- home: three ways to connect an agent ---------- */
type Way = {
  k: string;
  t: string;
  p: string;
  pts: string[];
  link: [string, string];
  panel: ReactNode;
};
export function ConnectWays({ ways }: { ways: Way[] }) {
  const [i, setI] = useState(0);
  const key = (e: React.KeyboardEvent, k: number) => {
    const n = ways.length;
    const to =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? (k + 1) % n
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? (k - 1 + n) % n
          : -1;
    if (to < 0) return;
    e.preventDefault();
    setI(to);
    document.getElementById(`way-${to}`)?.focus();
  };
  return (
    <div className="ways">
      <div className="ways-l">
        <div
          role="tablist"
          aria-orientation="vertical"
          aria-label="Ways to connect"
        >
          {ways.map((w, k) => (
            <button
              key={w.k}
              id={`way-${k}`}
              role="tab"
              aria-selected={k === i}
              aria-controls={`wayp-${k}`}
              tabIndex={k === i ? 0 : -1}
              className="way"
              onClick={() => setI(k)}
              onKeyDown={(e) => key(e, k)}
            >
              <span className="way-n">0{k + 1}</span>
              <span className="way-b">
                <span className="way-k">{w.k}</span>
                <span className="way-t">{w.t}</span>
                <span className="way-p">{w.p}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="way-more">
          <ul className="ticks">
            {ways[i].pts.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <a className="tl" href={ways[i].link[1]}>
            {ways[i].link[0]} →
          </a>
        </div>
      </div>
      {ways.map((w, k) => (
        <div
          key={w.k}
          id={`wayp-${k}`}
          role="tabpanel"
          aria-labelledby={`way-${k}`}
          hidden={k !== i}
          className="ways-r"
        >
          {w.panel}
        </div>
      ))}
    </div>
  );
}
