import { Estimator, Faq, HeroFx, Icon, Integrations, LogoMark } from "@/components";
import { CodePanel } from "@/components/interactive";
import { HeroRig, HowItWorks, Industries, LayerStack } from "@/components/home";
import { CALL_CURL, CALL_NODE, CALL_PY, SIP_HEADERS } from "@/content/code";
import { APP, DOCS, PRODUCTS, type QA } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "TryVox: Telephony Infrastructure for AI Voice Agents in India",
  description:
    "Indian phone numbers, SIP trunking and a programmable Voice API for AI voice agents. Bind Vapi, Retell, ElevenLabs, LiveKit or Bolna in a few clicks. KYC, consent and DLT built in. Pay per minute.",
  path: "/",
});

const MQ: [kind: "img" | "imgt" | "t", src: string, name: string][] = [
  ["img", "/assets/logos/vapi.svg", "Vapi"],
  ["img", "/assets/logos/retell.svg", "Retell AI"],
  ["imgt", "/assets/logos/livekit.svg", "LiveKit"],
  ["img", "/assets/logos/bolna.svg", "Bolna"],
  ["t", "", "ElevenLabs"],
  ["t", "", "Deepgram"],
  ["t", "", "Amazon Polly"],
  ["t", "", "WhatsApp"],
  ["t", "", "Webhooks"],
];

const STACK: { slug: string; k: string; h: string; p: string; go: string }[] = [
  { slug: "phone-numbers", k: "Numbers", h: "Phone numbers callers pick up", p: "Search, buy and configure local, national and toll-free numbers. Verified caller IDs for every campaign.", go: "Get a number" },
  { slug: "sip-trunking", k: "SIP", h: "SIP trunking, set up for you", p: "Create trunks, manage credentials and IP ACLs, and set channel limits. Or bring your own carrier.", go: "Create a trunk" },
  { slug: "voice-api", k: "Voice API", h: "Voice API & VoxML", p: "Place calls, run conferences and build call flows with Say, Gather, Dial and Stream.", go: "See the API" },
  { slug: "ai-agents", k: "AI Agents", h: "Connect any AI agent", p: "Bind a number to a Vapi, Retell, ElevenLabs, LiveKit or Bolna agent. No SIP setup needed.", go: "Connect an agent" },
  { slug: "messaging", k: "Messaging", h: "WhatsApp and SMS", p: "Follow up every AI call with a confirmation, summary or payment link, including WhatsApp calling.", go: "Explore messaging" },
  { slug: "compliance", k: "Compliance", h: "Consent and DLT, built in", p: "Consent records, DLT registration and verified caller IDs, so India's rules are handled.", go: "See compliance" },
];

const COMPARE: [string, string, string, string, string][] = [
  ["Infrastructure only, never competes with you", "y", "n", "y", "y"],
  ["Bring any agent platform", "y", "Varies", "y", "SIP only"],
  ["Indian numbers with KYC handled", "y", "y", "Limited", "y"],
  ["DLT-ready messaging", "y", "y", "Limited", "Varies"],
  ["Self-serve setup in minutes", "y", "Varies", "y", "n"],
  ["Voice, WhatsApp and SMS on one account", "y", "Varies", "y", "n"],
];
const cellOf = (v: string) => (v === "y" ? <span className="cy">Yes</span> : v === "n" ? <span className="cn" aria-label="No" /> : v);

const FAQ: QA[] = [
  ["What is TryVox?", "TryVox is telephony infrastructure for voice AI. We provide phone numbers, SIP trunking, programmable voice APIs, call routing and real-time call events that connect any AI voice agent to the phone network."],
  ["Do you provide an AI voice agent?", "No. You bring your own agent, built on Vapi, Retell, ElevenLabs, LiveKit, Bolna or your own code, and we connect it to real phone calls."],
  ["Can I get Indian phone numbers for my AI agent?", "Yes. Local, national and toll-free numbers, with business KYC and India's telecom requirements handled during setup."],
  ["How do I connect TryVox to Vapi or Retell?", "Open AI Agents in the dashboard, pick your provider and click Connect number. Choose a TryVox number and an agent, confirm, and the agent answers calls on that number straight away. No SIP setup needed."],
  ["Is TryVox only for voice AI?", "No. The same account covers SIP, programmable voice, WhatsApp, SMS and alerts."],
  ["How is TryVox priced?", "Pay as you go, billed per minute, with no setup fee, no monthly minimum and no lock-in. Use the estimator above and ask for a rate card for your volume."],
  ["Is TryVox an alternative to Exotel, Plivo or Twilio for voice AI?", "Yes, for teams running AI voice agents in India. TryVox puts Indian numbers, SIP trunking, a Voice API, agent bindings and DLT-ready messaging on one account, and never sells its own agents."],
];

const ORBIT: [string, string, React.ReactNode][] = [
  ["50%", "4%", <img className="plogo" src="/assets/logos/vapi.svg" alt="Vapi" width={67} height={22} key="v" />],
  ["93.7%", "35.8%", <img className="plogo" src="/assets/logos/retell.svg" alt="Retell AI" width={79} height={22} key="r" />],
  ["77%", "87.2%", <><img className="plogo" src="/assets/logos/livekit.svg" alt="" width={22} height={22} />LiveKit</>],
  ["23%", "87.2%", <img className="plogo" src="/assets/logos/bolna.svg" alt="Bolna" width={41} height={26} style={{ height: 26 }} key="b" />],
];
const SPOKES = [[50, 4], [93.7, 35.8], [77, 87.2], [23, 87.2], [6.3, 35.8]];

export default function Home() {
  return (
    <main id="top">
      {/* ---------- hero ---------- */}
      <div className="th hsky" id="hsky">
        <HeroFx variant="globe" />
        <section className="hero wrap" aria-labelledby="hero-h">
          <p className="tag">
            <i />
            Telephony infrastructure for voice AI
          </p>
          <div className="hero-top">
            <h1 className="hd h1" id="hero-h">
              <span className="ln">Give your agent</span> <span className="ln">a <em>phone line.</em></span>
            </h1>
            <div className="hero-side">
              <p className="sub">
                Indian phone numbers, SIP trunking and carrier-grade calling APIs that connect any AI voice agent to real phone networks. We don&rsquo;t build agents, so we never compete with yours.
              </p>
              <div className="cta">
                <a className="kbtn" href={APP}>Start free</a>
                <a className="obtn" href="/contact/">Book a demo</a>
              </div>
              <div className="micro">
                <span>No lock-in</span>
                <span>Pay per minute</span>
                <span>Live in minutes</span>
              </div>
            </div>
          </div>
          <HeroRig />
        </section>
      </div>

      {/* ---------- partners ---------- */}
      <section className="logos wrap" id="works" aria-label="Works with">
        <div className="row">
          <p className="lbl">Works with the voice stack you already trust</p>
          <div className="marquee">
            <div className="mq">
              {[0, 1].map((r) =>
                MQ.map(([k, src, name]) => (
                  <span className={`it${k === "t" ? " t" : ""}`} aria-hidden={r ? true : undefined} key={`${r}${name}`}>
                    {k !== "t" && <img className="plogo" src={src} alt={k === "imgt" || r ? "" : name} />}
                    {k !== "img" && name}
                  </span>
                )),
              )}
            </div>
          </div>
        </div>
      </section>

      <Industries />
      <LayerStack />
      <HowItWorks />

      {/* ---------- infrastructure only ---------- */}
      <section className="wrap story" aria-labelledby="story-h">
        <div className="rv">
          <p className="tag">
            <i />
            Infrastructure only
          </p>
          <h2 className="hd h2" id="story-h" style={{ marginTop: 20 }}>
            We don&rsquo;t build agents. We <em>connect</em> them.
          </h2>
          <p className="quote">
            Some telephony providers now sell their own AI agents. TryVox is <b>only the phone layer</b>, so <b>agent platforms</b> and <b>builders</b> can run on us{" "}
            <b>without feeding a competitor</b>. Keep the voice stack you already trust, with <b>no lock-in</b>.
          </p>
          <div className="stats">
            <div>
              <strong>&lt;200ms</strong>
              <span>Response time</span>
            </div>
            <hr />
            <div>
              <strong>99.9%</strong>
              <span>Platform uptime</span>
            </div>
            <hr />
            <div>
              <strong>24/7</strong>
              <span>Always available</span>
            </div>
          </div>
          <a className="obtn" href="#compare">See how we compare</a>
        </div>
        <div className="orb rv" role="img" aria-label="Works with Vapi, Retell, LiveKit, Bolna and your own code">
          <span className="ring" />
          <span className="ring r2" />
          <span className="ring r3" />
          <span className="pulse" />
          <span className="pulse p2" />
          <span className="core">
            <LogoMark />
          </span>
          <svg className="spokes" viewBox="0 0 100 100" aria-hidden="true">
            {SPOKES.map(([x, y]) => (
              <line x1="50" y1="50" x2={x} y2={y} key={`l${x}`} />
            ))}
            {SPOKES.map(([x, y], i) => (
              <circle r=".9" key={`c${x}`}>
                <animateMotion dur={`${2.6 + i * 0.3}s`} repeatCount="indefinite" path={`M${x} ${y} L50 50`} />
              </circle>
            ))}
          </svg>
          <div className="orbit" aria-hidden="true">
            {ORBIT.map(([l, t, inner]) => (
              <span className="pt" style={{ left: l, top: t }} key={l + t}>
                <span className="chip">{inner}</span>
              </span>
            ))}
            <span className="pt" style={{ left: "6.3%", top: "35.8%" }}>
              <span className="chip code">&lt;your code/&gt;</span>
            </span>
          </div>
        </div>
      </section>

      {/* ---------- comparison ---------- */}
      <section className="wrap" id="compare" aria-label="How TryVox compares">
        <div className="cmpw rv">
          <table className="cmp">
            <caption className="sr-only">TryVox compared with telephony providers that sell their own AI agents, global CPaaS and local telcos</caption>
            <thead>
              <tr>
                <th scope="col">
                  <span className="sr-only">Capability</span>
                </th>
                <th scope="col" className="us">TryVox</th>
                <th scope="col">Telephony + own AI agents</th>
                <th scope="col">Global CPaaS</th>
                <th scope="col">Local telcos</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(([label, ...v]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td className="us">{cellOf(v[0])}</td>
                  <td>{cellOf(v[1])}</td>
                  <td>{cellOf(v[2])}</td>
                  <td>{cellOf(v[3])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Integrations id="integrations" />

      {/* ---------- the stack ---------- */}
      <section className="wrap sect" id="stack" aria-labelledby="stack-h">
        <div className="rv">
          <p className="tag">
            <i />
            The stack
          </p>
          <h2 className="hd h2" id="stack-h" style={{ marginTop: 20 }}>
            Everything your agent needs to <em>reach a phone.</em>
          </h2>
          <p className="sub">Six building blocks on one account and one bill.</p>
        </div>
        <div className="grid3">
          {STACK.map((s) => (
            <a className="cell rv" href={`/products/${s.slug}/`} key={s.slug}>
              <span className="k">
                <Icon name={PRODUCTS.find((p) => p.slug === s.slug)!.icon} />
                <span>{s.k}</span>
              </span>
              <h3>{s.h}</h3>
              <p>{s.p}</p>
              <span className="go">
                {s.go} <span aria-hidden="true">→</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ---------- developers ---------- */}
      <section className="wrap sect" id="developers" aria-labelledby="dev-h">
        <div className="devgrid">
          <div className="rv">
            <p className="tag">
              <i />
              Developers
            </p>
            <h2 className="hd h2" id="dev-h" style={{ marginTop: 20 }}>
              Your first call is a <em>few lines</em> away.
            </h2>
            <p className="sub">A REST API at api.tryvox.io with Auth ID and Auth Token, VoxML for call flows, and webhooks for every call event.</p>
            <div className="devlinks">
              {[["Quickstart", "/getting-started/quickstart"], ["Make a call", "/voice/make-call"], ["VoxML reference", "/voxml"], ["SIP trunking", "/sip-trunking"], ["AI agents", "/ai-agents"], ["Webhooks", "/getting-started/webhooks"]].map(([t, h]) => (
                <a href={DOCS + h} key={h}>
                  {t} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
          <div className="rv" style={{ minWidth: 0 }}>
            <CodePanel code={{ curl: ["cURL", CALL_CURL], node: ["Node", CALL_NODE], py: ["Python", CALL_PY], sip: ["Agent SIP headers", SIP_HEADERS] }}>
              Based on <a href={`${DOCS}/voice/make-call`}>Make a call</a> and <a href={`${DOCS}/ai-agents/connect-number`}>Connect a number</a> in the TryVox docs.
            </CodePanel>
          </div>
        </div>
      </section>

      <Estimator />
      <Faq items={FAQ} />
    </main>
  );
}
