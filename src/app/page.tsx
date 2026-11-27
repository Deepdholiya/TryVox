import type { Metadata } from "next";
import { BrandLogo } from "@/components/BrandLogo";
import { CALL_CURL, CALL_NODE, CALL_PY, SIP_HEADERS } from "@/content/code";
import { APP, DOCS, PRODUCTS, STAGES } from "@/content/site";
import { pageMeta } from "@/lib/seo";
import { CallTrace, Code, ConnectWays, Estimator } from "@/v3/client";
import { Btn, ClientLogos, ComplianceBlock, CtaBand, Faq, Hero, Ic, LogoStrip, Panel, Sec, SecHead, Ticks } from "@/v3/ui";

export const metadata: Metadata = pageMeta({
  title: "TryVox: Telephony Infrastructure for Voice AI in India",
  description:
    "Give your AI voice agent a real Indian phone number. Numbers, SIP trunking, a Voice API, WebRTC, WhatsApp and SMS for Vapi, Retell, ElevenLabs, LiveKit, Bolna or your own code, with KYC and DLT handled.",
  path: "/",
});

const AGENTS: [string, string, string][] = [
  ["vapi", "Platform", "Bind a number to a Vapi assistant from the dashboard."],
  ["retell", "Platform", "Send inbound calls to a Retell agent with no SIP setup."],
  ["elevenlabs", "Platform", "Answer calls with an ElevenLabs conversational agent."],
  ["livekit", "Framework", "Give a LiveKit agent a phone number over a SIP trunk."],
  ["bolna", "Platform", "Run Bolna agents on Indian numbers, KYC already done."],
  ["your-code", "Transport", "Stream live call audio to your own service."],
];

const STEPS: [string, string][] = [
  ["Verify your business", "Finish KYC online with your company documents. It's a one-time check for every number on the account."],
  ["Pick a number", "Choose a local, national or toll-free Indian number. It's yours from ₹399 a month."],
  ["Bind your agent", "Connect the number to Vapi, Retell, ElevenLabs, LiveKit, Bolna, a SIP trunk or your own code."],
  ["Watch every call", "Get webhooks for ring, answer, status and hangup, plus recordings and a reason for each missed call."],
];

const COMPARE: [string, string, string, string, string][] = [
  ["Infrastructure only, never sells its own agents", "Yes", "No", "Yes", "Yes"],
  ["Bring any agent platform", "Yes", "Varies", "Yes", "SIP only"],
  ["Indian numbers with KYC handled online", "Yes", "Yes", "Limited", "Yes"],
  ["DLT-ready SMS on the same account", "Yes", "Yes", "Limited", "Varies"],
  ["Self-serve setup", "Yes", "Varies", "Yes", "No"],
  ["Voice, WhatsApp and SMS on one bill", "Yes", "Varies", "Yes", "No"],
];
const cell = (v: string) => (v === "Yes" ? <span className="yes">Yes</span> : v === "No" ? <span className="no">No</span> : v);

const FAQ: [string, string][] = [
  ["What is TryVox?", "TryVox is telephony infrastructure for voice AI. It gives your AI agent Indian phone numbers, SIP trunks, a Voice API, WebRTC and messaging, with KYC, consent and DLT handled on one account."],
  ["Do you build AI voice agents?", "No. You bring the agent you already run on Vapi, Retell, ElevenLabs, LiveKit, Bolna or your own code. TryVox connects it to the phone network and never competes with you."],
  ["How do I connect a number to Vapi or Retell?", "Open AI Agents in the dashboard, pick your provider, choose a TryVox number and an agent, and confirm. The agent answers calls on that number straight away. No SIP setup is needed."],
  ["Can my agent make outbound calls?", "Inbound calls through agent bindings work today. Outbound calls placed by agents through bindings are in progress. You can already place outbound calls with the Voice API or a SIP trunk."],
  ["How is TryVox priced?", "A one-time ₹100 setup fee, ₹399 a month for each number and calls billed per minute, with no lock-in. For larger volumes, ask for a rate card."],
  ["Is TryVox an alternative to Exotel, Plivo or Twilio?", "For teams running AI voice agents in India, yes. TryVox puts Indian numbers, SIP trunking, a Voice API, agent bindings and DLT-ready messaging on one account."],
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
            Give your voice agent a <span className="hl">real phone number</span>.
          </>
        }
        lead="Numbers, SIP trunks and a Voice API for the AI agent you already built. KYC, consent and DLT are handled, so your agent can take its first call today."
        note="₹100 one-time setup · per-minute billing · no lock-in"
        stats={[
          ["Response time", <>&lt;200<small>ms</small></>],
          ["Platform uptime", <>99.9<small>%</small></>],
          ["Support", <>24/7</>],
        ]}
        visual={<CallTrace />}
      />
      <ClientLogos />

      {/* 01 connect */}
      <Sec id="connect-h">
        <SecHead n="01" label="Bring your agent" meta="3 ways in" id="connect-h" lead="Keep the agent you already built. Bind it to a number in a few clicks, point a SIP trunk at your stack, or place calls from your own code.">
          Any agent, any stack. One phone line.
        </SecHead>
        <ConnectWays
          ways={[
            {
              k: "No SIP setup",
              t: "Agent binding",
              p: "Connect a number to Vapi, Retell, ElevenLabs, LiveKit or Bolna from the dashboard.",
              pts: ["Answers calls the moment you confirm", "Switch platforms, keep the number", "Inbound today, outbound through bindings in progress"],
              link: ["Connect a number", `${DOCS}/ai-agents/connect-number`],
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
                      {["vapi", "retell", "elevenlabs", "livekit", "bolna"].map((id, k) => (
                        <li key={id} className={k === 0 ? "on" : undefined}>
                          <BrandLogo id={id} size={20} />
                          {k === 0 && <span className="tag ok">Bound</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Panel>
              ),
            },
            {
              k: "Any SIP stack",
              t: "SIP trunk",
              p: "Point LiveKit, a PBX or your own SIP client at a TryVox trunk.",
              pts: ["Credentials and IP allow-lists per trunk", "Channel limits you set", "Bring your own carrier"],
              link: ["Create a trunk", `${DOCS}/sip-trunking/create-trunk`],
              panel: (
                <Panel path="/sip-trunking/trunks/livekit-prod" right="Active" ok>
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
              pts: ["HTTP Basic auth with Auth ID and Token", "VoxML: Say, Gather, Dial, Stream", "Signed webhooks for every stage"],
              link: ["Make your first call", `${DOCS}/voice/make-call`],
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

      {/* 02 stack */}
      <Sec id="stack-h" className="tint">
        <SecHead n="02" label="The stack" meta="10 products · 1 account" id="stack-h" lead="One account and one bill, from the number your agent calls from to the WhatsApp that follows up.">
          Everything around the call, in one place.
        </SecHead>
        <div className="stage2">
          {STAGES.map((st, i) => (
            <div key={st.id}>
              <p className="stage2-h">
                <span className="n">0{i + 1}</span>
                <b>{st.label}</b>
                <span className="m">{st.note}</span>
              </p>
              <ul>
                {PRODUCTS.filter((p) => p.group === st.id).map((p) => (
                  <li key={p.slug}>
                    <a href={`/products/${p.slug}/`}>
                      <Ic name={p.icon} />
                      <span>{p.name}</span>
                      <span className="go" aria-hidden="true">
                        →
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Sec>

      {/* 03 how */}
      <section className="sec how" aria-labelledby="how-h">
        <div className="wrap">
          <SecHead n="03" label="How it works" meta="Most teams go live the same day" id="how-h" lead="Four steps from sign-up to your agent's first real call. Each one happens in the dashboard or through the API.">
            From sign-up to a <span className="grad">live call</span> in four steps.
          </SecHead>
          <ol className="flow4">
            {STEPS.map(([t, p], i) => (
              <li key={t}>
                <div className="fl-top" aria-hidden="true">
                  <span className="fl-n">0{i + 1}</span>
                  <i />
                </div>
                <h3 className="h3">{t}</h3>
                <p className="small">{p}</p>
                <div className="fl-ui" aria-hidden="true">
                  {i === 0 && (
                    <>
                      <p className="fl-row">
                        <span>Business details</span>
                        <b className="ok">✓</b>
                      </p>
                      <p className="fl-row">
                        <span>Documents uploaded</span>
                        <b className="ok">✓</b>
                      </p>
                      <p className="fl-row">
                        <span>KYC status</span>
                        <span className="tag ok">Verified</span>
                      </p>
                    </>
                  )}
                  {i === 1 && (
                    <>
                      <p className="fl-big">+91 80 4718 2290</p>
                      <p className="fl-row">
                        <span>Local · Bengaluru</span>
                        <span className="tag acc">₹399/mo</span>
                      </p>
                      <p className="fl-row">
                        <span>Toll-free · National</span>
                        <span className="m">available</span>
                      </p>
                    </>
                  )}
                  {i === 2 && (
                    <>
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
                    </>
                  )}
                  {i === 3 && (
                    <>
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
                    </>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 04 pillars */}
      <Sec id="pil-h">
        <SecHead n="04" label="Why TryVox" meta="4 pillars" id="pil-h">
          What a phone line for an AI agent needs.
        </SecHead>
        <div className="pil">
          <article className="pn">
            <div className="pn-bar">
              <span>pillar / 01</span>
              <span className="r">Media path</span>
            </div>
            <div className="pil-v dots" aria-hidden="true">
              <div className="hops">
                {["Caller", "Carrier", "TryVox", "Your agent"].map((h, i) => (
                  <span key={h} style={{ display: "contents" }}>
                    {i > 0 && <i className="hop-l" />}
                    <span className={i === 2 ? "hop us" : "hop"}>{h}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="pil-c">
              <h3 className="h3">A short, direct audio path</h3>
              <Ticks two items={["SIP, WebRTC or WebSocket", "Any platform or your code", "Events for every leg", "Live handover to a person"]} />
            </div>
          </article>
          <article className="pn">
            <div className="pn-bar">
              <span>pillar / 02</span>
              <span className="r">Answer rates</span>
            </div>
            <div className="pil-v dots" aria-hidden="true">
              <div>
                <div className="cid">
                  <span className="av">KB</span>
                  <span>
                    <b>Kirana Box</b>
                    <small>Verified business · Delivery update</small>
                  </span>
                  <span className="tag ok">Verified</span>
                </div>
                <div className="meter">
                  <span>Number health</span>
                  <i>
                    <b />
                  </i>
                  <span>Good</span>
                </div>
              </div>
            </div>
            <div className="pil-c">
              <h3 className="h3">Calls people actually pick up</h3>
              <Ticks two items={["Business name on caller ID", "Health tracked per number", "Tired numbers rested", "Local, national, toll-free"]} />
            </div>
          </article>
          <article className="pn">
            <div className="pn-bar">
              <span>pillar / 03</span>
              <span className="r">Compliance</span>
            </div>
            <div className="pil-v dots" aria-hidden="true">
              <ul className="mini">
                {["Business KYC", "Consent records", "DLT registration", "Verified caller ID"].map((c) => (
                  <li key={c}>
                    <span className="l">{c}</span>
                    <span className="tag ok">Done</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pil-c">
              <h3 className="h3">Compliance that's built in</h3>
              <Ticks two items={["KYC during number setup", "DLT-ready SMS", "Consent kept per campaign", "An audit trail by default"]} />
            </div>
          </article>
          <article className="pn">
            <div className="pn-bar">
              <span>pillar / 04</span>
              <span className="r">Visibility</span>
            </div>
            <div className="pil-v dots" aria-hidden="true">
              <ul className="mini">
                {[
                  ["ok", "answered", "agent handled"],
                  ["", "no-answer", "retry scheduled"],
                  ["", "busy", "retry scheduled"],
                  ["warn", "number rested", "health rule"],
                ].map(([k, t, m]) => (
                  <li key={t}>
                    <span className="l">
                      <i className="dot" style={k === "ok" ? { background: "#16A34A" } : k === "warn" ? { background: "#D97706" } : { background: "var(--line-3)" }} />
                      {t}
                    </span>
                    <span className="m">{m}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pil-c">
              <h3 className="h3">A reason for every call</h3>
              <Ticks two items={["Ring, answer, hangup hooks", "Why a call didn't connect", "Checks before a campaign", "Number rules while dialling"]} />
            </div>
          </article>
        </div>
      </Sec>

      {/* 05 compliance */}
      <ComplianceBlock n="05" />

      {/* 06 compare */}
      <Sec id="vs-h" className="tint">
        <SecHead n="06" label="Compare" meta="Voice AI in India" id="vs-h" lead="Built for teams that already have an agent and need the phone side done properly.">
          How TryVox compares.
        </SecHead>
        <div className="cmp-w" tabIndex={0} role="region" aria-label="Comparison table, scrolls sideways on small screens">
          <table className="cmp">
            <caption className="sr-only">TryVox compared with telephony providers that sell their own AI agents, global CPaaS and local telcos</caption>
            <thead>
              <tr>
                <th scope="col">Capability</th>
                <th scope="col" className="us">TryVox</th>
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
        <SecHead n="07" label="Pricing" meta="No lock-in" id="price-h" lead="Simple to start, with rate cards for volume. Voice and messaging land on the same bill.">
          Pay for the line, then pay per minute.
        </SecHead>
        <div className="price">
          <div>
            <span className="cap">Setup</span>
            <span className="v">₹100<small>one time</small></span>
            <p className="small">Business KYC and your first number.</p>
          </div>
          <div>
            <span className="cap">Number rent</span>
            <span className="v">₹399<small>/ month</small></span>
            <p className="small">Local, national or toll-free.</p>
          </div>
          <div>
            <span className="cap">Calls</span>
            <span className="v">Per min<small>on one bill</small></span>
            <p className="small">Billed on one account. Rate cards for volume.</p>
          </div>
        </div>
        <div style={{ marginTop: 24 }}>
          <Estimator />
        </div>
        <div className="btns" style={{ marginTop: 24 }}>
          <Btn href="/pricing/" line>
            See full pricing
          </Btn>
          <Btn href={APP}>Start free</Btn>
        </div>
      </Sec>

      <Faq items={FAQ} n="08" />
      <div style={{ height: "var(--sec)" }} />
      <CtaBand />
    </main>
  );
}
