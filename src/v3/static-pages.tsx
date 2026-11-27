/* Pricing, about, integrations, developers and contact pages. */
import { BrandLogo } from "@/components/BrandLogo";
import { AUTH_CURL, CALL_CURL, CALL_NODE, CALL_PY, CALL_RESP } from "@/content/code";
import { APP, COMPANY, DOCS, EMAIL } from "@/content/site";
import { Code, Estimator } from "./client";
import { Btn, CtaBand, Faq, Hero, Lbl, LogoStrip, Panel, Rows, Sec, SecHead, Stats, Ticks } from "./ui";

const D = DOCS;
const end = (
  <>
    <div style={{ height: "var(--sec)" }} />
    <CtaBand />
  </>
);

/* ---------------- pricing ---------------- */
export const pricingMeta = { title: "Pricing: Pay-Per-Minute Telephony for AI Voice Agents | TryVox", description: "Telephony for AI voice agents in India: ₹100 one-time setup, ₹399 a month per number and per-minute calls. No lock-in. Rate cards for volume." };
export function Pricing() {
  return (
    <main id="top">
      <Hero
        crumbs={[["Pricing", ""]]}
        label="Pricing"
        meta="No lock-in"
        chip={
          <>
            <i className="dot" /> <b>₹100</b> setup · <b>₹399</b>/month · per-minute calls
          </>
        }
        h1={
          <>
            Simple to start. <span className="hl">Fair at volume.</span>
          </>
        }
        lead="Pay a one-time setup fee and a monthly rent per number, then pay per minute for calls. Voice and messaging land on one bill."
        ctas={
          <>
            <Btn href={APP}>Start free</Btn>
            <Btn href="/contact/" line>
              Get a rate card
            </Btn>
          </>
        }
      />
      <Sec id="plans-h">
        <SecHead n="01" label="Plans" id="plans-h" split lead="Most teams start on pay as you go and move to a rate card once volume is steady.">
          Two ways to pay.
        </SecHead>
        <div className="plans" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))" }}>
          <article className="pn on">
            <div className="pn-bar">
              <span>plan / pay-as-you-go</span>
              <span className="r">Most teams start here</span>
            </div>
            <div className="pn-body">
              <h2 className="h3">Pay as you go</h2>
              <p className="v">₹399<small className="small"> / number / month</small></p>
              <p className="small">Plus a ₹100 one-time setup fee. Calls billed per minute.</p>
              <Ticks items={["Local, national or toll-free number", "Bind to any agent platform", "SIP trunks and the Voice API", "Webhooks, records and recordings", "WhatsApp and SMS on the same bill"]} />
              <Btn href={APP}>Start free</Btn>
            </div>
          </article>
          <article className="pn">
            <div className="pn-bar">
              <span>plan / volume</span>
              <span className="r">From steady volume</span>
            </div>
            <div className="pn-body">
              <h2 className="h3">Volume rate card</h2>
              <p className="v">Custom</p>
              <p className="small">Per-minute rates set for your monthly minutes and peak calls.</p>
              <Ticks items={["Everything in pay as you go", "Rates for your volume", "Help sizing numbers and channels", "Help planning outbound campaigns", "Same account and dashboard"]} />
              <Btn href="/contact/" line>
                Talk to sales
              </Btn>
            </div>
          </article>
        </div>
      </Sec>
      <Sec id="inc-h">
        <SecHead n="02" label="What's included" id="inc-h">
          Every account gets the full stack.
        </SecHead>
        <div className="cmp-w">
          <table className="cmp" style={{ minWidth: 560 }}>
            <caption className="sr-only">What each charge covers</caption>
            <thead>
              <tr>
                <th scope="col">Charge</th>
                <th scope="col">Amount</th>
                <th scope="col">What it covers</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Setup", "₹100 one time", "Business KYC and your first number"],
                ["Number rent", "₹399 a month", "Each local, national or toll-free number"],
                ["Calls", "Per minute", "Inbound and outbound, billed on one account"],
                ["Messaging", "On your rate card", "WhatsApp and DLT SMS on the same bill as voice"],
                ["Lock-in", "None", "Release numbers when you no longer need them"],
              ].map(([a, b, c]) => (
                <tr key={a}>
                  <th scope="row">{a}</th>
                  <td style={{ color: "var(--ink)" }}>{b}</td>
                  <td>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Sec>
      <Sec id="est-h">
        <SecHead n="03" label="Estimate" id="est-h" split lead="Move the sliders to size your minutes and peak calls, then send the numbers to us for a rate card.">
          Size your line.
        </SecHead>
        <Estimator />
      </Sec>
      <Faq
        n="04"
        items={[
          ["What does it cost to start?", "₹100 one time for setup, then ₹399 a month for each number. Calls are billed per minute."],
          ["Is there a lock-in?", "No. You can release numbers you no longer need."],
          ["When do I get a rate card?", "Once you know your monthly minutes and peak concurrent calls. Use the estimator and send it to us."],
          ["Is messaging billed separately?", "No. WhatsApp and SMS are on the same account and the same bill as voice. Ask us for messaging rates."],
        ]}
      />
      {end}
    </main>
  );
}

/* ---------------- about ---------------- */
export const aboutMeta = { title: "About TryVox: Telephony Infrastructure for Voice AI | TryVox", description: "TryVox builds telephony infrastructure for voice AI: numbers, SIP, voice APIs and messaging. Built in India by Tryjolt Solutions." };
export function About() {
  return (
    <main id="top">
      <Hero
        crumbs={[["About", ""]]}
        label="About"
        meta="Built in India"
        h1={
          <>
            Voice AI moved fast. <span className="hl">The phone network didn't.</span>
          </>
        }
        lead="Teams can build a great voice agent in a week, then spend months on carriers, KYC and SIP. TryVox exists to close that gap."
      />
      <Sec id="why-h">
        <SecHead n="01" label="The problem" id="why-h">
          Four things that slow every voice AI launch.
        </SecHead>
        <div className="feat" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))" }}>
          {[
            ["Telephony wasn't built for agents", "Carriers, trunks and IVRs were designed for human call centres, so every team rebuilds the same plumbing."],
            ["Compliance slows launches", "KYC, consent and DLT rules turn a two-day agent launch into a month of paperwork."],
            ["Numbers get locked in", "Numbers bought inside an agent platform make it hard to switch providers or run more than one."],
            ["Calls happen in a black box", "Without events and records, teams can't see why calls drop, ring out or never connect."],
          ].map(([t, p], i) => (
            <div key={t}>
              <p className="cap">0{i + 1}</p>
              <h3 className="h3">{t}</h3>
              <p className="small">{p}</p>
            </div>
          ))}
        </div>
      </Sec>
      <Sec id="pr-h">
        <SecHead n="02" label="Principles" id="pr-h" split lead="The rules behind every TryVox product.">
          Built for production, not prototypes.
        </SecHead>
        <Panel path="/tryvox/principles">
          <Rows
            items={[
              ["Infrastructure only", "We never build agents, so platforms and builders can run on us without feeding a competitor.", "01"],
              ["India-first compliance", "KYC, consent, DLT and verified caller IDs are product requirements, not afterthoughts.", "02"],
              ["Developer control", "Numbers, calls, routing and webhooks as primitives your engineers can build on.", "03"],
              ["Observable by default", "Events, records and recordings for every call and message.", "04"],
            ]}
          />
        </Panel>
      </Sec>
      <Sec id="who-h">
        <div className="say">
          <div>
            <Lbl n="03">Who we are</Lbl>
            <h2 className="h2" id="who-h" style={{ marginTop: 32 }}>
              Built in India by {COMPANY.replace(" Pvt Ltd", "")}.
            </h2>
          </div>
          <div>
            <p className="big">We believe every AI agent deserves a real phone line, and every team should be able to give it one in minutes.</p>
            <p className="body" style={{ marginTop: 24 }}>
              We're a telephony team for voice AI, focused on reliable calls and compliance that just works. We build the phone layer and nothing else, so we're never your competitor.
            </p>
            <div style={{ marginTop: 32 }}>
              <Stats items={[["Response time", "<200 ms"], ["Platform uptime", "99.9%"], ["Support", "24/7"]]} />
            </div>
          </div>
        </div>
      </Sec>
      {end}
    </main>
  );
}

/* ---------------- integrations ---------------- */
export const integrationsMeta = { title: "Integrations: Vapi, Retell, ElevenLabs, LiveKit, Bolna and SIP | TryVox", description: "Bind a TryVox number to Vapi, Retell, ElevenLabs, LiveKit or Bolna in a few clicks, or connect any SIP stack. No deployment and no SIP configuration." };
const INTEG: [string, string, string, string][] = [
  ["vapi", "Vapi", "Bind a TryVox number to your Vapi assistant.", `${D}/ai-agents/vapi`],
  ["retell", "Retell", "Send calls on a TryVox number to your Retell agent.", `${D}/ai-agents/retell`],
  ["elevenlabs", "ElevenLabs", "Answer calls with an ElevenLabs conversational agent.", `${D}/ai-agents/elevenlabs`],
  ["livekit", "LiveKit", "Connect a LiveKit agent to a TryVox number.", `${D}/ai-agents/livekit`],
  ["bolna", "Bolna", "Run Bolna agents on Indian numbers.", `${D}/ai-agents/bolna`],
  ["sip-byoc", "Any SIP stack", "Connect your PBX, or bring your own carrier.", `${D}/byoc`],
];
export function Integrations() {
  return (
    <main id="top">
      <Hero
        crumbs={[["Integrations", ""]]}
        label="Integrations"
        meta="5 platforms + any SIP"
        h1={
          <>
            Connect any agent to <span className="hl">a real phone line</span>.
          </>
        }
        lead="Bind a TryVox number to Vapi, Retell, ElevenLabs, LiveKit or Bolna in a few clicks, or connect any SIP stack. No deployment and no SIP configuration."
        ctas={
          <>
            <Btn href={APP}>Start free</Btn>
            <Btn href={`${D}/ai-agents`} line>
              Read the guides
            </Btn>
          </>
        }
        below={<LogoStrip ids={["vapi", "retell", "elevenlabs", "livekit", "bolna", "sip-byoc"]} caption="Setup guides for every provider" />}
      />
      <Sec id="ag-h">
        <SecHead n="01" label="Agent platforms" id="ag-h">
          Setup guides for every provider.
        </SecHead>
        <ul className="cards" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))" }}>
          {INTEG.map(([id, n, p, href]) => (
            <li key={id} style={{ display: "grid" }}>
              <a className="cd" href={href}>
                <span className="cd-h">
                  <span className="t">
                    <BrandLogo id={id} size={22} />
                    {n}
                  </span>
                  <span className="k" aria-hidden="true">
                    Guide ↗
                  </span>
                </span>
                <p>{p}</p>
              </a>
            </li>
          ))}
        </ul>
      </Sec>
      <Sec id="bind-h">
        <div className="split2">
          <div>
            <Lbl n="02">How binding works</Lbl>
            <h2 className="h2" id="bind-h" style={{ marginTop: 32 }}>
              Pick, connect, answer.
            </h2>
            <p className="lead" style={{ marginTop: 16 }}>
              Choose a provider, pick a number and an agent, and confirm. Inbound calls to that number go straight to the agent, with context in SIP headers.
            </p>
            <div style={{ marginTop: 32 }}>
              <Ticks items={["One number binds to one agent", "No deployment or SIP configuration", "Remove the binding to fall back", "Outbound through bindings is in progress"]} />
            </div>
          </div>
          <Panel path="/ai-agents/connect-number" right="Connected" ok>
            <dl className="kv">
              {[
                ["Provider", "Vapi"],
                ["Number", "+91 80 4718 2290"],
                ["Agent", "support-agent"],
                ["X-TryVox-Direction", "inbound"],
                ["X-TryVox-Route", "ai-agent"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="k">{k}</dt>
                  <dd className="v">{v}</dd>
                </div>
              ))}
            </dl>
          </Panel>
        </div>
      </Sec>
      <Sec id="stack-h">
        <SecHead n="03" label="Voice stack" id="stack-h" split lead="Anything that speaks SIP, WebSocket or HTTP works with TryVox.">
          Works with the rest of your stack too.
        </SecHead>
        <ul className="logos" aria-label="Voice stack">
          {["deepgram", "amazon-polly", "asterisk", "freeswitch", "any-sip-pbx", "whatsapp"].map((id) => (
            <li key={id}>
              <BrandLogo id={id} size={26} />
            </li>
          ))}
        </ul>
      </Sec>
      {end}
    </main>
  );
}

/* ---------------- developers ---------------- */
export const developersMeta = { title: "Developers: Voice API, VoxML and Webhooks | TryVox", description: "A REST API at api.tryvox.io with HTTP Basic auth, VoxML for call flows and signed webhooks for every call event. Place your first call in minutes." };
const DOC_LINKS: [string, [string, string][]][] = [
  ["Getting started", [["Quickstart", "getting-started/quickstart"], ["Authentication", "getting-started/authentication"], ["Webhooks", "getting-started/webhooks"], ["Errors", "getting-started/errors"]]],
  ["Voice", [["Make a call", "voice/make-call"], ["List calls", "voice/list-calls"], ["Hang up", "voice/hangup"], ["Conferences", "voice/conferences"]]],
  ["VoxML", [["Say", "voxml/say"], ["Gather", "voxml/gather"], ["Dial", "voxml/dial"], ["Stream", "voxml/stream"]]],
  ["Numbers and SIP", [["Search numbers", "numbers/search"], ["Buy a number", "numbers/purchase"], ["Create a trunk", "sip-trunking/create-trunk"], ["IP access lists", "sip-trunking/ip-acl"]]],
];
export function Developers() {
  return (
    <main id="top">
      <Hero
        crumbs={[["Developers", ""]]}
        label="Developers"
        meta="REST · VoxML · Webhooks"
        chip={
          <>
            <i className="dot" /> api.tryvox.io
          </>
        }
        h1={
          <>
            Your first call <span className="hl">in minutes</span>.
          </>
        }
        lead="A REST API with HTTP Basic auth, VoxML for call flows and signed webhooks for every call event."
        ctas={
          <>
            <Btn href={`${D}/getting-started/quickstart`}>Read the quickstart</Btn>
            <Btn href={APP} line>
              Get API keys
            </Btn>
          </>
        }
        visual={<Code path="POST /v1/voice/accounts/{auth_id}/calls" tabs={[["cURL", CALL_CURL], ["Node", CALL_NODE], ["Python", CALL_PY]]} />}
      />
      <Sec id="qs-h">
        <SecHead n="01" label="Quickstart" id="qs-h">
          Four steps to a live call.
        </SecHead>
        <ol className="steps">
          {[
            ["Get your keys", "Copy your Auth ID and Auth Token from the dashboard.", "getting-started/authentication"],
            ["Buy a number", "Search and buy a number to call from.", "numbers/purchase"],
            ["Place a call", "POST from, to and answer_url to the calls endpoint.", "voice/make-call"],
            ["Handle webhooks", "Receive ring, answer, status and hangup callbacks.", "getting-started/webhooks"],
          ].map(([t, p, h], i) => (
            <li key={t}>
              <span className="n">0{i + 1}</span>
              <h3 className="h3">{t}</h3>
              <p className="small">{p}</p>
              <a className="tl" href={`${D}/${h}`}>
                Read the guide ↗
              </a>
            </li>
          ))}
        </ol>
      </Sec>
      <Sec id="io-h">
        <SecHead n="02" label="Auth and responses" id="io-h" split lead="Every request uses HTTP Basic auth. Every call returns a request_uuid and a status you can follow through webhooks.">
          Predictable in, predictable out.
        </SecHead>
        <div className="opts">
          <Code path="auth" tabs={[["cURL", AUTH_CURL]]} />
          <Code path="201 Created" tabs={[["JSON", CALL_RESP]]} />
        </div>
      </Sec>
      <Sec id="wh-h">
        <div className="split2">
          <div>
            <Lbl n="03">Webhooks</Lbl>
            <h2 className="h2" id="wh-h" style={{ marginTop: 32 }}>
              Every stage, in your system.
            </h2>
            <p className="lead" style={{ marginTop: 16 }}>
              Ring, answer, status and hangup callbacks, signed with your webhook secret.
            </p>
          </div>
          <Panel path="/webhooks/log" right="Signed" ok>
            <Rows
              items={[
                ["POST ring_url", "The call is ringing.", "200"],
                ["POST answer_url", "The call was answered. Return VoxML.", "VoxML"],
                ["POST status_callback_url", "Progress updates while the call runs.", "200"],
                ["POST hangup_url", "The call ended, with duration and billsec.", "200"],
              ]}
            />
          </Panel>
        </div>
      </Sec>
      <Sec id="docs-h">
        <SecHead n="04" label="Documentation" id="docs-h">
          Everything else is in the docs.
        </SecHead>
        <div className="feat" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
          {DOC_LINKS.map(([h, links]) => (
            <div key={h}>
              <h3 className="h3">{h}</h3>
              <ul className="ticks">
                {links.map(([t, p]) => (
                  <li key={p}>
                    <a className="tl" href={`${D}/${p}`} style={{ color: "var(--ink)" }}>
                      {t}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Sec>
      {end}
    </main>
  );
}

/* ---------------- contact ---------------- */
export const contactMeta = { title: "Contact TryVox: Sales, Rate Cards and Demos | TryVox", description: `Talk to the TryVox team about numbers, SIP, AI agent bindings and rates for your volume. Email ${EMAIL}.` };
export function Contact() {
  const ways: [string, string, string, string][] = [
    ["Email the team", "Questions about TryVox, partnerships or anything else.", `mailto:${EMAIL}`, EMAIL],
    ["Get a rate card", "Tell us your monthly calls and average call length, and we'll share rates for your volume.", `mailto:${EMAIL}?subject=Rate%20card%20request`, "Request rates"],
    ["Book a demo", "See numbers, agents and call events working together.", `mailto:${EMAIL}?subject=Demo%20request`, "Request a demo"],
    ["Start free", "Create an account and get a number the same day.", APP, "Open the dashboard"],
    ["Read the docs", "API reference, VoxML, numbers, SIP and agent guides.", `${D}/`, "docs.tryvox.io"],
    ["Developer hub", "Quickstart steps and code samples.", "/developers/", "Go to developers"],
  ];
  return (
    <main id="top">
      <Hero
        crumbs={[["Contact", ""]]}
        label="Contact"
        meta="Replies by email"
        h1={
          <>
            Talk to <span className="hl">the team</span>.
          </>
        }
        lead="Tell us what you're building and how many calls you run. We'll help you get your agent on the phone and share rates for your volume."
        ctas={
          <>
            <Btn href={`mailto:${EMAIL}`}>Email {EMAIL}</Btn>
            <Btn href={APP} line>
              Start free
            </Btn>
          </>
        }
        visual={
          <Panel path="mail / new message" right="Draft">
            <dl className="kv">
              {[
                ["To", EMAIL],
                ["Subject", "Rate card request"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="k">{k}</dt>
                  <dd className="v">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="body" style={{ padding: "16px", borderTop: "1px solid var(--line)" }}>
              Hi TryVox team, we run about 50,000 calls a month at 2.5 minutes on average with a Vapi agent. Could you share a rate card?
            </p>
          </Panel>
        }
      />
      <Sec id="ways-h">
        <SecHead n="01" label="Ways to reach us" id="ways-h">
          Pick what you need.
        </SecHead>
        <ul className="cards" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))" }}>
          {ways.map(([t, p, href, l]) => (
            <li key={t} style={{ display: "grid" }}>
              <a className="cd" href={href}>
                <span className="cd-h">
                  <span className="t">{t}</span>
                </span>
                <p>{p}</p>
                <span className="tl">{l} →</span>
              </a>
            </li>
          ))}
        </ul>
      </Sec>
      {end}
    </main>
  );
}

/* ---------------- 404 ---------------- */
export function NotFoundView() {
  return (
    <main id="top">
      <Hero
        label="404"
        meta="Page not found"
        h1={
          <>
            This line is <span className="hl">not in service</span>.
          </>
        }
        lead="The page you were looking for has moved or never existed. Try one of these instead."
        ctas={
          <>
            <Btn href="/">Go home</Btn>
            <Btn href="/contact/" line>
              Contact us
            </Btn>
          </>
        }
      />
      <div style={{ height: "var(--sec)" }} />
    </main>
  );
}
