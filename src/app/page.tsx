import type { Metadata } from "next";
import { BrandLogo } from "@/components/BrandLogo";
import { CALL_CURL, CALL_NODE, CALL_PY, SIP_HEADERS } from "@/content/code";
import { APP, DOCS, PRODUCTS, STAGES } from "@/content/site";
import { pageMeta } from "@/lib/seo";
import { CallTrace, Code, Estimator } from "@/v3/client";
import { Btn, ComplianceBlock, CtaBand, Faq, Hero, Ic, LogoStrip, Panel, Sec, SecHead, Ticks } from "@/v3/ui";

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
        below={<LogoStrip />}
      />

      {/* 01 connect */}
      <Sec id="connect-h">
        <SecHead n="01" label="Bring your agent" meta="No SIP setup needed" id="connect-h" split lead="Bind a number in a few clicks, point a SIP trunk at your stack, or drive calls from code. Switch agent platforms without moving numbers.">
          Any agent, any stack. One phone line.
        </SecHead>
        <Panel path="/connect/your-agent" right="6 ways in">
          <div className="cn-g dots">
            <ul className="cards">
              {AGENTS.map(([id, k, p]) => (
                <li className="cd" key={id}>
                  <span className="cd-h">
                    <BrandLogo id={id} size={22} />
                    <span className="k">{k}</span>
                  </span>
                  <p>{p}</p>
                </li>
              ))}
            </ul>
            <Code
              path="POST /v1/voice/accounts/{auth_id}/calls"
              tabs={[
                ["cURL", CALL_CURL],
                ["Node", CALL_NODE],
                ["Python", CALL_PY],
                ["SIP headers", SIP_HEADERS],
              ]}
            />
          </div>
          <div className="cn-foot">
            <div>
              <h3 className="h3">
                Programmable telephony for voice AI <small>REST · VoxML · Webhooks</small>
              </h3>
              <p className="body">One REST API with an Auth ID and Auth Token, VoxML for call flows, and a webhook at every stage of the call.</p>
            </div>
            <Ticks items={["Numbers live once business KYC clears", "Webhooks for ring, answer, status and hangup", "Hand a live AI call to a person with context"]} />
            <div className="btns">
              <Btn href={`${DOCS}/getting-started/quickstart`} line>
                Quickstart
              </Btn>
            </div>
          </div>
          <div className="langs" aria-label="Works from">
            <span>cURL</span>
            <span>Node.js</span>
            <span>Python</span>
            <span>Any HTTP client</span>
            <span>Any SIP stack</span>
          </div>
        </Panel>
      </Sec>

      {/* 02 stack */}
      <Sec id="stack-h">
        <SecHead n="02" label="The stack" meta="10 products · 1 account" id="stack-h" split lead="Every building block around an AI call is on one account and one bill, from the number your agent calls from to the WhatsApp that follows up.">
          Everything around the call, in one place.
        </SecHead>
        <div className="stage">
          {STAGES.map((st) => (
            <div key={st.id}>
              <p className="stage-h">
                <b>{st.label}</b>
                <span>{st.note}</span>
              </p>
              <ul>
                {PRODUCTS.filter((p) => p.group === st.id).map((p) => (
                  <li key={p.slug}>
                    <a href={`/products/${p.slug}/`}>
                      <Ic name={p.icon} />
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
      </Sec>

      {/* 03 how */}
      <Sec id="how-h">
        <SecHead n="03" label="How it works" meta="Same day" id="how-h">
          From sign-up to a live call in four steps.
        </SecHead>
        <ol className="steps">
          {STEPS.map(([t, p], i) => (
            <li key={t}>
              <span className="n">0{i + 1}</span>
              <h3 className="h3">{t}</h3>
              <p className="small">{p}</p>
            </li>
          ))}
        </ol>
      </Sec>

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
      <Sec id="vs-h">
        <SecHead n="06" label="Compare" meta="Voice AI in India" id="vs-h" split lead="Built for teams that already have an agent and need the phone side done properly.">
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
        <SecHead n="07" label="Pricing" meta="No lock-in" id="price-h" split lead="Simple to start, with rate cards for volume. Voice and messaging land on the same bill.">
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
