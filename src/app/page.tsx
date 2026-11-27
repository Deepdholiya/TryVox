import type { Metadata } from "next";
import { BrandLogo } from "@/components/BrandLogo";
import { CALL_CURL, CALL_NODE, CALL_PY, SIP_HEADERS } from "@/content/code";
import { DOCS } from "@/content/site";
import { pageMeta } from "@/lib/seo";
import { CallTrace, Code, ConnectWays, Estimator, HowTabs } from "@/v3/client";
import {
  ClientLogos,
  CtaBand,
  Faq,
  Hero,
  Panel,
  Sec,
  SecHead,
} from "@/v3/ui";

export const metadata: Metadata = pageMeta({
  title: "TryVox: Telephony Infrastructure for Voice AI in India",
  description:
    "Give your AI voice agent a real Indian phone number. Numbers, SIP trunking, a Voice API, WebRTC, WhatsApp and SMS for Vapi, Retell, ElevenLabs, LiveKit, Bolna or your own code, with KYC and DLT handled.",
  path: "/",
});

const AGENTS: [string, string, string][] = [
  ["vapi", "Platform", "Bind a number to a Vapi assistant from the dashboard."],
  [
    "retell",
    "Platform",
    "Send inbound calls to a Retell agent with no SIP setup.",
  ],
  [
    "elevenlabs",
    "Platform",
    "Answer calls with an ElevenLabs conversational agent.",
  ],
  [
    "livekit",
    "Framework",
    "Give a LiveKit agent a phone number over a SIP trunk.",
  ],
  [
    "bolna",
    "Platform",
    "Run Bolna agents on Indian numbers, KYC already done.",
  ],
  ["your-code", "Transport", "Stream live call audio to your own service."],
];

const COMPARE: [string, string, string, string, string][] = [
  [
    "Infrastructure only, never sells its own agents",
    "Yes",
    "No",
    "Yes",
    "Yes",
  ],
  ["Bring any agent platform", "Yes", "Varies", "Yes", "SIP only"],
  ["Indian numbers with KYC handled online", "Yes", "Yes", "Limited", "Yes"],
  ["DLT-ready SMS on the same account", "Yes", "Yes", "Limited", "Varies"],
  ["Self-serve setup", "Yes", "Varies", "Yes", "No"],
  ["Voice, WhatsApp and SMS on one bill", "Yes", "Varies", "Yes", "No"],
];
const cell = (v: string) =>
  v === "Yes" ? (
    <span className="yes">Yes</span>
  ) : v === "No" ? (
    <span className="no">No</span>
  ) : (
    v
  );

/* Why TryVox cards. Line art only, so it reads on the dark glass panels. */
const FEATS: { k: string; t: string; p: string; tags: string[]; href: string; art: React.ReactNode }[] = [
  {
    k: "Media path",
    t: "A short, direct audio path",
    p: "Calls go from the carrier through TryVox straight to your agent over SIP, WebRTC or WebSocket.",
    tags: ["SIP", "WebRTC", "WebSocket"],
    href: "/products/sip-trunking/",
    art: (
      <svg viewBox="0 0 320 140">
        <rect x="16" y="52" width="64" height="36" rx="6" />
        <rect x="128" y="44" width="64" height="52" rx="6" className="hot" />
        <rect x="240" y="52" width="64" height="36" rx="6" />
        <path d="M80 70H128M192 70H240" className="d" />
        <circle r="4" className="pkt">
          <animateMotion dur="2.4s" repeatCount="indefinite" path="M80 70H240" />
        </circle>
        <path d="M30 66h30M30 74h18M142 60h36M142 70h24M142 80h30M254 66h30M254 74h20" className="ln" />
      </svg>
    ),
  },
  {
    k: "Agent binding",
    t: "Any agent, a few clicks",
    p: "Bind a number to Vapi, Retell, ElevenLabs, LiveKit or Bolna, and switch without changing the number.",
    tags: ["Vapi", "Retell", "LiveKit", "Bolna"],
    href: "/products/ai-agents/",
    art: (
      <svg viewBox="0 0 220 140">
        {[34, 56, 78, 100].map((y) => (
          <g key={y}>
            <circle cx="30" cy={y} r="5" />
            <path d={`M35 ${y} C 90 ${y}, 100 70, 140 70`} className="wire" />
          </g>
        ))}
        <rect x="140" y="40" width="20" height="60" rx="10" className="hot" />
        <path d="M160 70H200" />
        <circle cx="200" cy="70" r="2.5" className="fill" />
      </svg>
    ),
  },
  {
    k: "Answer rates",
    t: "Calls people actually pick up",
    p: "Your verified business name on caller ID, health tracked per number, and tired numbers rested before they lose answers.",
    tags: ["Caller ID", "Number health", "Rotation"],
    href: "/products/number-reputation/",
    art: (
      <svg viewBox="0 0 260 140">
        <rect x="104" y="18" width="52" height="104" rx="10" />
        <path d="M120 30h20" />
        <rect x="112" y="48" width="36" height="22" rx="3" className="hot" />
        <path d="M118 80h24M118 88h16" className="ln" />
        <circle cx="130" cy="70" r="46" className="ring r1" />
        <circle cx="130" cy="70" r="62" className="ring r2" />
        <circle cx="130" cy="70" r="78" className="ring r3" />
      </svg>
    ),
  },
  {
    k: "Compliance",
    t: "Compliance that's built in",
    p: "Business KYC during number setup, DLT-ready SMS and consent kept with every campaign, with a record of each.",
    tags: ["KYC", "DLT", "Consent", "Verified ID"],
    href: "/products/compliance/",
    art: (
      <svg viewBox="0 0 280 140">
        <path d="M140 20 L230 52 L140 84 L50 52 Z" className="hot lay l1" />
        <path d="M140 44 L230 76 L140 108 L50 76 Z" className="lay l2" />
        <path d="M140 68 L230 100 L140 132 L50 100 Z" className="lay l3" />
        <path d="M126 50l10 9 18-18" className="ck" />
      </svg>
    ),
  },
  {
    k: "Visibility",
    t: "A reason for every call",
    p: "Ring, answer and hangup webhooks, recordings on request, and a clear reason when a call didn't connect.",
    tags: ["Webhooks", "Recordings", "Call records"],
    href: "/products/voice-api/",
    art: (
      <svg viewBox="0 0 280 140">
        <path d="M20 110H260" className="d" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((j) => (
          <rect key={j} x={30 + j * 23} y={110 - [40, 64, 30, 82, 54, 70, 26, 60, 46, 76][j]} width="12" height={[40, 64, 30, 82, 54, 70, 26, 60, 46, 76][j]} rx="2" className="bar" style={{ ["--j" as string]: j }} />
        ))}
      </svg>
    ),
  },
  {
    k: "One account",
    t: "Voice and messaging together",
    p: "Follow a call with WhatsApp or SMS from the same account, with one balance and one bill.",
    tags: ["WhatsApp", "SMS", "RCS"],
    href: "/products/whatsapp/",
    art: (
      <svg viewBox="0 0 260 140">
        <rect x="40" y="24" width="130" height="44" rx="10" className="b1" />
        <path d="M60 68v14l14-14" className="b1" />
        <path d="M58 40h80M58 52h54" className="ln b1" />
        <rect x="100" y="80" width="120" height="38" rx="10" className="hot b2" />
        <path d="M200 118v12l-12-12" className="b2" />
        <path d="M118 94h70M118 104h40" className="ln b2" />
      </svg>
    ),
  },
];

const FAQ: [string, string][] = [
  [
    "What is TryVox?",
    "TryVox is telephony infrastructure for voice AI. It gives your AI agent Indian phone numbers, SIP trunks, a Voice API, WebRTC and messaging, with KYC, consent and DLT handled on one account.",
  ],
  [
    "Do you build AI voice agents?",
    "No. You bring the agent you already run on Vapi, Retell, ElevenLabs, LiveKit, Bolna or your own code. TryVox connects it to the phone network and never competes with you.",
  ],
  [
    "How do I connect a number to Vapi or Retell?",
    "Open AI Agents in the dashboard, pick your provider, choose a TryVox number and an agent, and confirm. The agent answers calls on that number straight away. No SIP setup is needed.",
  ],
  [
    "Can my agent make outbound calls?",
    "Inbound calls through agent bindings work today. Outbound calls placed by agents through bindings are in progress. You can already place outbound calls with the Voice API or a SIP trunk.",
  ],
  [
    "How is TryVox priced?",
    "A one-time ₹100 setup fee, ₹399 a month for each number and calls billed per minute, with no lock-in. For larger volumes, ask for a rate card.",
  ],
  [
    "Is TryVox an alternative to Exotel, Plivo or Twilio?",
    "For teams running AI voice agents in India, yes. TryVox puts Indian numbers, SIP trunking, a Voice API, agent bindings and DLT-ready messaging on one account.",
  ],
];

export default function Home() {
  return (
    <main id="top">
      <Hero
        label="Telephony for voice AI"
        meta="India · Inbound + outbound"
        chip={
          <>
            <i className="dot" /> Indian numbers from <b>₹399/month</b>
          </>
        }
        h1={
          <>
            Give your voice agent a{" "}
            <span className="hl">real phone number</span>.
          </>
        }
        lead="Numbers, SIP trunks and a Voice API for the AI agent you already built. KYC, consent and DLT are handled, so your agent can take its first call today."
        note="₹100 one-time setup · per-minute billing · no lock-in"
        stats={[
          [
            "Response time",
            <>
              &lt;200<small>ms</small>
            </>,
          ],
          [
            "Platform uptime",
            <>
              99.9<small>%</small>
            </>,
          ],
          ["Support", <>24/7</>],
        ]}
        visual={<CallTrace />}
      />
      <ClientLogos />

      {/* 01 connect */}
      <Sec id="connect-h">
        <SecHead
          n="01"
          label="Bring your agent"
          meta="3 ways in"
          id="connect-h"
          lead="Keep the agent you already built. Bind it to a number in a few clicks, point a SIP trunk at your stack, or place calls from your own code."
        >
          Any agent, any stack. One phone line.
        </SecHead>
        <ConnectWays
          ways={[
            {
              k: "No SIP setup",
              t: "Agent binding",
              p: "Connect a number to Vapi, Retell, ElevenLabs, LiveKit or Bolna from the dashboard.",
              panel: (
                <Panel path="/ai-agents/connect-number" right="Bound" ok>
                  <div className="bind dots">
                    <div className="bind-num">
                      <span className="cap">TryVox number</span>
                      <b>+91 80 4718 2290</b>
                      <span className="tag ok">KYC verified</span>
                    </div>
                    <div className="bind-line" aria-hidden="true" />
                    <ul className="bind-pl">
                      {["vapi", "retell", "elevenlabs", "livekit", "bolna"].map(
                        (id, k) => (
                          <li key={id} className={k === 0 ? "on" : undefined}>
                            <BrandLogo id={id} size={20} />
                            {k === 0 && <span className="tag ok">Bound</span>}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </Panel>
              ),
            },
            {
              k: "Any SIP stack",
              t: "SIP trunk",
              p: "Point LiveKit, a PBX or your own SIP client at a TryVox trunk.",
              panel: (
                <Panel
                  path="/sip-trunking/trunks/livekit-prod"
                  right="Active"
                  ok
                >
                  <dl className="kv">
                    {[
                      ["Directions", "Inbound + outbound"],
                      ["Authentication", "Credentials + IP ACL"],
                      ["Channel limit", "Set per trunk"],
                      ["Carrier", "TryVox or BYOC"],
                      ["Numbers", "+91 80 4718 2290"],
                      ["Events", "ring · answer · hangup"],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="k">{k}</dt>
                        <dd className="v">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </Panel>
              ),
            },
            {
              k: "Your own code",
              t: "Voice API",
              p: "Place and control calls with REST, VoxML and webhooks.",
              panel: (
                <Code
                  path="POST /v1/voice/accounts/{auth_id}/calls"
                  tabs={[
                    ["cURL", CALL_CURL],
                    ["Node", CALL_NODE],
                    ["Python", CALL_PY],
                    ["SIP headers", SIP_HEADERS],
                  ]}
                />
              ),
            },
          ]}
        />
      </Sec>

      {/* 02 why */}
      <section className="sec feats" aria-labelledby="why-h">
        <div className="wrap">
          <SecHead n="02" label="Why TryVox" meta="6 reasons" id="why-h" lead="The six things a phone line for an AI agent needs, built into one account. Hover a card to see how each one works.">
            What a phone line for an <span className="grad">AI agent needs.</span>
          </SecHead>
          <ul className="bento">
            {FEATS.map((f, i) => (
              <li key={f.k} className={`bx bx${i + 1}`}>
                <a href={f.href}>
                  <span className="bx-k">
                    0{i + 1} · {f.k}
                  </span>
                  <span className="bx-art" aria-hidden="true">
                    {f.art}
                  </span>
                  <span className="bx-t">{f.t}</span>
                  <span className="bx-more">
                    <span className="bx-p">{f.p}</span>
                    <span className="bx-tags">
                      {f.tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </span>
                    <span className="bx-go">
                      Learn more <span aria-hidden="true">→</span>
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 03 how */}
      <section className="sec how" aria-labelledby="how-h">
        <div className="wrap">
          <SecHead
            n="03"
            label="How it works"
            meta="Most teams go live the same day"
            id="how-h"
            lead="Bring numbers, trunks and carriers together, connect your agent and watch every call it takes."
          >
            Turn any agent into a <span className="grad">phone line.</span>
          </SecHead>
          <HowTabs
            docs={`${DOCS}/`}
            steps={[
              {
                k: "Number",
                t: "Pick a number, finish KYC once",
                p: "Search, buy and configure numbers with KYC done online.",
                ui: (
                  <div className="fl-ui">
                    <p className="fl-big">+91 80 4718 2290</p>
                    <p className="fl-row">
                      <span>Local · Bengaluru</span>
                      <span className="tag acc">₹399/mo</span>
                    </p>
                    <p className="fl-row">
                      <span>Business KYC</span>
                      <span className="tag ok">Verified</span>
                    </p>
                    <p className="fl-row">
                      <span>Toll-free · National</span>
                      <span className="m">available</span>
                    </p>
                  </div>
                ),
              },
              {
                k: "Connect",
                t: "Bind it to your agent",
                p: "Bind the number to your Vapi, Retell, LiveKit or Bolna agent in the dashboard.",
                ui: (
                  <div className="fl-ui">
                    <p className="fl-bind">
                      <span>+91 80 •••• 2290</span>
                      <i />
                      <span className="us">Vapi</span>
                    </p>
                    <p className="fl-row">
                      <span>Agent</span>
                      <span className="m">support-agent</span>
                    </p>
                    <p className="fl-row">
                      <span>Binding</span>
                      <span className="tag ok">Live</span>
                    </p>
                  </div>
                ),
              },
              {
                k: "Stream",
                t: "Audio flows both ways",
                p: "Live audio flows both ways while your agent talks.",
                ui: (
                  <div className="fl-ui">
                    <div className="wavev">
                      {Array.from({ length: 28 }, (_, j) => (
                        <i key={j} style={{ ["--j" as string]: j }} />
                      ))}
                    </div>
                    <p className="fl-row">
                      <span>Caller</span>
                      <span className="m">Haan, kal shaam ko bhej do.</span>
                    </p>
                    <p className="fl-row">
                      <span>Agent</span>
                      <span className="m">Done. Slot sent to WhatsApp.</span>
                    </p>
                  </div>
                ),
              },
              {
                k: "Observe",
                t: "See every call",
                p: "Webhooks, recordings and call records for every call.",
                ui: (
                  <div className="fl-ui">
                    <p className="fl-log">
                      <span>ring_url</span>
                      <b>200</b>
                    </p>
                    <p className="fl-log">
                      <span>answer_url</span>
                      <b>VoxML</b>
                    </p>
                    <p className="fl-log">
                      <span>status_callback</span>
                      <b>200</b>
                    </p>
                    <p className="fl-log">
                      <span>hangup_url</span>
                      <b>200</b>
                    </p>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>

      {/* 06 compare */}
      <Sec id="vs-h" className="tint">
        <SecHead
          n="04"
          label="Compare"
          meta="Voice AI in India"
          id="vs-h"
          lead="Built for teams that already have an agent and need the phone side done properly."
        >
          How TryVox compares.
        </SecHead>
        <div
          className="cmp-w"
          tabIndex={0}
          role="region"
          aria-label="Comparison table, scrolls sideways on small screens"
        >
          <table className="cmp">
            <caption className="sr-only">
              TryVox compared with telephony providers that sell their own AI
              agents, global CPaaS and local telcos
            </caption>
            <thead>
              <tr>
                <th scope="col">Capability</th>
                <th scope="col" className="us">
                  TryVox
                </th>
                <th scope="col">Telephony + own agents</th>
                <th scope="col">Global CPaaS</th>
                <th scope="col">Local telcos</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(([label, ...v]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td className="us">{cell(v[0])}</td>
                  <td>{cell(v[1])}</td>
                  <td>{cell(v[2])}</td>
                  <td>{cell(v[3])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Sec>

      {/* 07 pricing */}
      <Sec id="price-h">
        <SecHead
          n="05"
          label="Pricing"
          meta="No lock-in"
          id="price-h"
          lead="Simple to start, with rate cards for volume. Voice and messaging land on the same bill."
        >
          Pay for the line, then pay per minute.
        </SecHead>
        <div className="price">
          <div>
            <span className="cap">Setup</span>
            <span className="v">
              ₹100<small>one time</small>
            </span>
            <p className="small">Business KYC and your first number.</p>
          </div>
          <div>
            <span className="cap">Number rent</span>
            <span className="v">
              ₹399<small>/ month</small>
            </span>
            <p className="small">Local, national or toll-free.</p>
          </div>
          <div>
            <span className="cap">Calls</span>
            <span className="v">
              Per min<small>on one bill</small>
            </span>
            <p className="small">
              Billed on one account. Rate cards for volume.
            </p>
          </div>
        </div>
        <div style={{ marginTop: 24 }}>
          <Estimator
            cta={["See full pricing", "/pricing/"] as [string, string]}
          />
        </div>
      </Sec>

      <Faq items={FAQ} n="06" />
      <div style={{ height: "var(--sec)" }} />
      <CtaBand />
    </main>
  );
}
