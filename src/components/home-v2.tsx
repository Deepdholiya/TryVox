"use client";
/* Homepage v2 blocks: split hero call trace, framed "bring your agent" panel, grouped building blocks,
   four pillars and a use-case ticker. Visual language: thin framed panels with a path header bar,
   numbered section labels, quiet motion that stops for reduced-motion users. */
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { Icon } from "@/components";
import { CodePanel } from "@/components/interactive";
import { CALL_CURL, CALL_NODE, CALL_PY, SIP_HEADERS } from "@/content/code";
import { APP, DOCS, PRODUCTS, STAGES } from "@/content/site";

/* ---------- hero: live call trace card ---------- */
type Ev = { t: string; k: string; v: string; who?: "agent" | "caller" };
const TRACE: Ev[] = [
  { t: "00:00.000", k: "INVITE", v: "+91 ••••• ••418 → your number" },
  { t: "00:00.180", k: "180", v: "Ringing" },
  { t: "00:02.410", k: "200", v: "Answered, bound to your agent" },
  { t: "00:02.430", k: "STREAM", v: "wss://agent.yourapp.in/media · open" },
  { t: "00:03.100", k: "agent", v: "Namaste! This is Kirana Box about your order. Shall we deliver it tomorrow evening?", who: "agent" },
  { t: "00:07.820", k: "caller", v: "Haan, kal shaam ko bhej do.", who: "caller" },
  { t: "00:09.040", k: "agent", v: "Done. I’ve sent the slot to your WhatsApp.", who: "agent" },
  { t: "00:09.600", k: "HOOK", v: "status_callback · 200 OK" },
];

export function CallTrace() {
  const [n, setN] = useState(TRACE.length);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0, alive = true, timer = 0 as unknown as ReturnType<typeof setTimeout>;
    const step = () => {
      if (!alive) return;
      i = i >= TRACE.length ? 1 : i + 1;
      setN(i);
      timer = setTimeout(step, i >= TRACE.length ? 4200 : i === 5 || i === 6 ? 1500 : 700);
    };
    setN(0);
    timer = setTimeout(step, 600);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);
  return (
    <div className="ctrace" ref={ref}>
      <div className="fr-bar">
        <span className="fr-path">tryvox/call-trace</span>
        <span className="ctr-live">
          <i /> Live call
        </span>
      </div>
      {/* the animation is decorative; screen readers get the summary below */}
      <ol className="ctr-log" aria-hidden="true">
        {TRACE.map((e, i) => (
          <li className={`${e.who ?? "sys"}${i < n ? " on" : ""}`} key={e.t}>
            <span className="ctr-t">{e.t}</span>
            <span className="ctr-k">{e.k}</span>
            <span className="ctr-v">{e.v}</span>
          </li>
        ))}
      </ol>
      <p className="sr-only">
        Example call trace: an inbound call rings, is answered and bound to your AI agent, audio streams to your agent over a WebSocket, the agent confirms a delivery slot with the caller, and a signed status webhook reaches your server.
      </p>
      <div className="fr-foot">
        <span>SIP · WebRTC · WebSocket</span>
        <span>India region</span>
        <span>Signed webhooks</span>
      </div>
    </div>
  );
}

/* ---------- 02: bring your agent ---------- */
const AGENTS: [string, string, string][] = [
  ["vapi", "Platform", "Bind a number to a Vapi assistant in a few clicks."],
  ["retell", "Platform", "Point inbound and outbound calls at a Retell agent."],
  ["livekit", "Framework", "Give a LiveKit agent a real phone number over SIP."],
  ["bolna", "Platform", "Run Bolna agents on Indian numbers with KYC done."],
  ["sip-byoc", "Transport", "SIP trunks with credentials, IP ACLs and channel limits."],
  ["your-code", "Transport", "Stream live call audio straight to your own code."],
];

export function BringAgent() {
  return (
    <section className="wrap sect v2" id="connect" aria-labelledby="connect-h">
      <div className="v2-head rv">
        <p className="tag">
          <i />
          Bring your agent
        </p>
        <h2 className="hd h2" id="connect-h">
          Any agent, any stack. <em>One phone line.</em>
        </h2>
      </div>
      <div className="fr rv">
        <div className="fr-bar">
          <span className="fr-path">/connect/your-agent</span>
          <span className="fr-meta">No SIP setup needed</span>
        </div>
        <div className="ba-grid">
          <ul className="ba-cards">
            {AGENTS.map(([id, k, p]) => (
              <li className="ba-c" key={id}>
                <span className="ba-top">
                  <BrandLogo id={id} size={22} />
                  <small>{k}</small>
                </span>
                <span className="ba-p">{p}</span>
              </li>
            ))}
          </ul>
          <div className="ba-code">
            <CodePanel code={{ curl: ["cURL", CALL_CURL], node: ["Node", CALL_NODE], py: ["Python", CALL_PY], sip: ["Agent SIP headers", SIP_HEADERS] }}>
              Based on <a href={`${DOCS}/voice/make-call`}>Make a call</a> and <a href={`${DOCS}/ai-agents/connect-number`}>Connect a number</a> in the TryVox docs.
            </CodePanel>
          </div>
        </div>
        <div className="ba-foot">
          <div>
            <h3>Programmable telephony for voice AI</h3>
            <p>
              Use a one-click agent binding, a SIP trunk or the Voice API. A REST API with Auth ID and Auth Token, VoxML for call flows, and webhooks for every call event.
            </p>
          </div>
          <ul className="chk">
            <li>Indian numbers, live after business KYC</li>
            <li>Switch agent platforms without porting</li>
            <li>Webhooks for ring, answer, status and hangup</li>
            <li>Hand a live AI call to a human with context</li>
          </ul>
          <div className="ba-cta">
            <a className="kbtn" href={APP}>Start free</a>
            <a className="tlink" href={`${DOCS}/getting-started/quickstart`}>
              Read the quickstart <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 03: building blocks by stage ---------- */
export function Blocks() {
  return (
    <section className="wrap sect v2" id="stack" aria-labelledby="stack-h">
      <div className="v2-head rv">
        <p className="tag">
          <i />
          The stack
        </p>
        <h2 className="hd h2" id="stack-h">
          Everything around the call, <em>on one account.</em>
        </h2>
        <p className="sub">Every building block on one bill, from the number your agent dials from to the WhatsApp that follows up.</p>
      </div>
      <div className="fr bl rv">
        {STAGES.map((st) => (
          <div className="bl-col" key={st.id}>
            <p className="bl-h">
              <b>{st.label}</b>
              <span>{st.note}</span>
            </p>
            <ul>
              {PRODUCTS.filter((p) => p.group === st.id).map((p) => (
                <li key={p.slug}>
                  <a href={`/products/${p.slug}/`}>
                    <Icon name={p.icon} />
                    <span>
                      <b>{p.name}</b>
                      <small>{p.desc}</small>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- 05: four pillars ---------- */
export function Pillars() {
  return (
    <section className="wrap sect v2" id="pillars" aria-labelledby="pil-h">
      <div className="v2-head rv">
        <p className="tag">
          <i />
          Why TryVox
        </p>
        <h2 className="hd h2" id="pil-h">
          What a phone line for an <em>AI agent</em> needs.
        </h2>
      </div>
      <div className="pil">
        <article className="fr pl rv">
          <div className="fr-bar">
            <span className="fr-path">need / 01</span>
            <span className="fr-meta">media path</span>
          </div>
          <div className="pl-vis" aria-hidden="true">
            <div className="hops">
              {["Caller", "Carrier", "TryVox", "Your agent"].map((h, i) => (
                <span className={i === 2 ? "hop us" : "hop"} key={h}>
                  {h}
                </span>
              ))}
              <i className="hop-dot" />
            </div>
          </div>
          <h3>A short, direct audio path</h3>
          <ul className="chk">
            <li>SIP, WebRTC or WebSocket stream</li>
            <li>Any agent platform or your own code</li>
            <li>Events for every leg of the call</li>
            <li>Live handover to a human</li>
          </ul>
        </article>
        <article className="fr pl rv">
          <div className="fr-bar">
            <span className="fr-path">need / 02</span>
            <span className="fr-meta">answer rates</span>
          </div>
          <div className="pl-vis" aria-hidden="true">
            <div className="cid">
              <span className="cid-av">KB</span>
              <span className="cid-t">
                <b>Kirana Box</b>
                <small>Verified business · Delivery update</small>
              </span>
              <span className="cid-ok">Verified</span>
            </div>
            <div className="hl">
              <span>Number health</span>
              <span className="hl-bar"><i /></span>
              <span>Good</span>
            </div>
          </div>
          <h3>Calls people actually pick up</h3>
          <ul className="chk">
            <li>Verified business names on caller ID</li>
            <li>Health tracking for every number</li>
            <li>Automatic rest for tired numbers</li>
            <li>Local, national and toll-free numbers</li>
          </ul>
        </article>
        <article className="fr pl rv">
          <div className="fr-bar">
            <span className="fr-path">need / 03</span>
            <span className="fr-meta">compliance</span>
          </div>
          <div className="pl-vis" aria-hidden="true">
            <ul className="v2cl">
              {["Business KYC", "Consent records", "DLT registration", "Verified caller ID"].map((c) => (
                <li key={c}>
                  <span>{c}</span>
                  <b>Done</b>
                </li>
              ))}
            </ul>
          </div>
          <h3>Compliance that’s built in</h3>
          <ul className="chk">
            <li>KYC handled during number setup</li>
            <li>DLT-ready SMS and templates</li>
            <li>Consent kept with every campaign</li>
            <li>An audit trail that writes itself</li>
          </ul>
        </article>
        <article className="fr pl rv">
          <div className="fr-bar">
            <span className="fr-path">need / 04</span>
            <span className="fr-meta">visibility</span>
          </div>
          <div className="pl-vis" aria-hidden="true">
            <ul className="v2rs">
              <li><span className="rs-d ok" />answered<small>agent handled</small></li>
              <li><span className="rs-d" />no-answer<small>retry scheduled</small></li>
              <li><span className="rs-d" />busy<small>retry scheduled</small></li>
              <li><span className="rs-d warn" />number rested<small>health rule</small></li>
            </ul>
          </div>
          <h3>A reason for every call</h3>
          <ul className="chk">
            <li>Webhooks for ring, answer and hangup</li>
            <li>Why each call didn’t connect</li>
            <li>Pre-launch checks for campaigns</li>
            <li>Live number rules while you dial</li>
          </ul>
        </article>
      </div>
    </section>
  );
}

/* ---------- use-case ticker ---------- */
const USES = ["Lead qualification", "COD confirmation", "Appointment reminders", "Payment collection", "Order tracking", "Feedback surveys", "KYC verification", "Support callbacks"];
export function UseTicker() {
  return (
    <div className="tick" aria-label="Calls teams run on TryVox" role="region">
      <ul className="sr-only">
        {USES.map((u) => (
          <li key={u}>{u}</li>
        ))}
      </ul>
      <div className="tick-t" aria-hidden="true">
        {[0, 1].map((r) => USES.map((u) => <span key={`${r}${u}`}>{u}</span>))}
      </div>
    </div>
  );
}
