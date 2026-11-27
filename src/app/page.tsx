import { Estimator, Faq, HeroFx, LogoMark } from "@/components";
import { BrandLogo } from "@/components/BrandLogo";
import { StrandField } from "@/components/StrandField";
import { Industries, LayerStack } from "@/components/home";
import { BringAgent, Blocks, CallTrace, Pillars, UseTicker } from "@/components/home-v2";
import { APP, type QA } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "TryVox: Telephony Infrastructure for AI Voice Agents in India",
  description:
    "Indian phone numbers, SIP trunking and a programmable Voice API for AI voice agents. Bind Vapi, Retell, ElevenLabs, LiveKit or Bolna in a few clicks. KYC, consent and DLT built in. Pay per minute.",
  path: "/",
});

const MQ = ["vapi", "retell", "livekit", "bolna", "elevenlabs", "deepgram", "amazon-polly", "whatsapp", "sip-byoc", "voxml"];

const COMPARE: [string, string, string, string, string][] = [
  ["Infrastructure only, never competes with you", "y", "n", "y", "y"],
  ["Bring any agent platform", "y", "Varies", "y", "SIP only"],
  ["Indian numbers with KYC handled", "y", "y", "Limited", "y"],
  ["DLT-ready messaging", "y", "y", "Limited", "Varies"],
  ["Self-serve setup in minutes", "y", "Varies", "y", "n"],
  ["Voice, WhatsApp and SMS on one account", "y", "Varies", "y", "n"],
];
const cellOf = (v: string) => (v === "y" ? <span className="cy">Yes</span> : v === "n" ? <span className="cn" role="img" aria-label="No" /> : v);

const FAQ: QA[] = [
  ["What is TryVox?", "TryVox is telephony infrastructure for voice AI. We provide phone numbers, SIP trunking, programmable voice APIs, call routing and real-time call events that connect any AI voice agent to the phone network."],
  ["Do you provide an AI voice agent?", "No. You bring your own agent, built on Vapi, Retell, ElevenLabs, LiveKit, Bolna or your own code, and we connect it to real phone calls."],
  ["Can I get Indian phone numbers for my AI agent?", "Yes. Local, national and toll-free numbers, with business KYC and India's telecom requirements handled during setup."],
  ["How do I connect TryVox to Vapi or Retell?", "Open AI Agents in the dashboard, pick your provider and click Connect number. Choose a TryVox number and an agent, confirm, and the agent answers calls on that number straight away. No SIP setup needed."],
  ["Is TryVox only for voice AI?", "No. The same account covers SIP, programmable voice, WhatsApp, SMS and alerts."],
  ["How is TryVox priced?", "A one-time ₹100 setup fee, ₹399 monthly rent and calls billed per minute, with no lock-in. Use the estimator above and ask for a rate card for your volume."],
  ["Is TryVox an alternative to Exotel, Plivo or Twilio for voice AI?", "Yes, for teams running AI voice agents in India. TryVox puts Indian numbers, SIP trunking, a Voice API, agent bindings and DLT-ready messaging on one account, and never sells its own agents."],
];

const ORBIT: [string, string, string][] = [
  ["50%", "4%", "vapi"],
  ["93.7%", "35.8%", "retell"],
  ["77%", "87.2%", "livekit"],
  ["23%", "87.2%", "bolna"],
  ["6.3%", "35.8%", "your-code"],
];
const SPOKES = [[50, 4], [93.7, 35.8], [77, 87.2], [23, 87.2], [6.3, 35.8]];

export default function Home() {
  return (
    <main id="top">
      {/* ---------- 01 hero ---------- */}
      <div className="th hsky v2h" id="hsky">
        <HeroFx variant="none" />
        <section className="hero wrap" aria-labelledby="hero-h">
          <div className="h2g">
            <div className="h2g-l">
              <p className="tag">
                <i />
                Telephony infrastructure for voice AI
              </p>
              <h1 className="hd h1" id="hero-h">
                <span className="ln">Give your agent</span> <span className="ln">a <em>phone line.</em></span>
              </h1>
              <p className="sub">
                Indian phone numbers, SIP trunking and carrier-grade calling APIs that connect any AI voice agent to real phone networks. We don&rsquo;t build agents, so we never compete with yours.
              </p>
              <div className="cta">
                <a className="kbtn" href={APP}>Start free</a>
                <a className="obtn" href="/contact/">Book a demo</a>
              </div>
              <dl className="hstat">
                <div>
                  <dt>Response time</dt>
                  <dd>&lt;200ms</dd>
                </div>
                <div>
                  <dt>Platform uptime</dt>
                  <dd>99.9%</dd>
                </div>
                <div>
                  <dt>Always on</dt>
                  <dd>24/7</dd>
                </div>
              </dl>
            </div>
            <div className="h2g-r">
              <CallTrace />
            </div>
          </div>
          <StrandField />
        </section>
      </div>

      {/* ---------- partners: hairline logo grid ---------- */}
      <section className="wrap lgx-w" id="works" aria-labelledby="works-h">
        <div className="lgx">
          <div className="lgx-l">
            <p id="works-h">
              <b>Works with the voice stack</b> you already trust.
            </p>
            <a className="tlink" href="/integrations/">
              All integrations <span aria-hidden="true">→</span>
            </a>
          </div>
          <ul className="lgx-g">
            {MQ.map((id) => (
              <li key={id}>
                <BrandLogo id={id} size={24} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <BringAgent />
      <Blocks />
      <LayerStack />
      <Pillars />

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
            {ORBIT.map(([l, t, id]) => (
              <span className="pt" style={{ left: l, top: t }} key={id}>
                <span className="chip">
                  <BrandLogo id={id} size={20} />
                </span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- comparison ---------- */}
      <section className="wrap" id="compare" aria-label="How TryVox compares">
        <div className="cmpw rv" tabIndex={0} role="region" aria-label="Comparison table (scrolls sideways on small screens)">
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

      <Industries />
      <UseTicker />

      <Estimator />
      <Faq items={FAQ} />
    </main>
  );
}
