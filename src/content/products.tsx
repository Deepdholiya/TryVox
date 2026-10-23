/* Ported from the original static site. Edit freely: this file is now the source of truth. */
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { SIP_HEADERS, type CodeSet } from "./code";
import type { QA } from "./site";

export type Panel = { tag: string; heading: ReactNode; body: string; points: string[]; visual: ReactNode };
export type Product = {
  name: string; title: string; description: string; h1: ReactNode; sub: string;
  layers: string[]; layerNotes: string[]; story: string[]; results: [string, string, string][];
  panels: Panel[]; code: CodeSet | null; note: ReactNode; faq: QA[];
};

export const PRODUCT_PAGES: Record<string, Product> = {
  "phone-numbers": {
    name: "Phone Numbers",
    title: "Virtual Phone Numbers in India for AI Voice Agents | TryVox",
    description: "Buy local, national and toll-free Indian phone numbers with online KYC and route them to Vapi, Retell, ElevenLabs, LiveKit, Bolna or your SIP trunk. Pay per minute.",
    h1: <>Indian phone numbers for{" "}<em>your AI agent.</em></>,
    sub: "Get local, national and toll-free numbers with online business KYC, then route each one to your voice agent, a SIP trunk or your own code. Live in minutes, billed per minute.",
    layers: ["Carrier network", "Number inventory", "Business KYC", "Routing", "Your AI agent"],
    layerNotes: ["Tier-1 routes to every Indian network", "Local, national and toll-free inventory", "Business verification, done online", "Agent, SIP trunk or VoxML, switch any time", "Your Vapi, Retell or LiveKit agent answers"],
    story: ["Every agent needs a number people trust.", "TryVox gives you local, national and toll-free Indian numbers, verified online and routed in a click.", "Point them at an AI agent, a SIP trunk or your own code, and change your mind any time."],
    results: [["Number types", "3 line types", "Local, national and toll-free, for every kind of Indian voice line."], ["Time to live", "Minutes", "Online KYC and instant routing, not days of email."], ["Pricing", "Pay per minute", "No lock-in, calls billed per minute."]],
    panels: [
      {
        tag: "Search and buy",
        heading: <>Pick a number in the city{" "}<em>you call most.</em></>,
        body: "Search by city or number type and buy instantly from the dashboard or the Numbers API. Give every region, brand or campaign its own line.",
        points: ["Local, national and toll-free numbers", "Buy from the dashboard or the API", "Release numbers you no longer need"],
        visual: (
          <div className="pm">
            <div className="pm-h">
              <span className="pm-c">
                <span>Numbers</span>
                <span className="sep">›</span>
                <span>Search</span>
              </span>
            </div>
            <div className="pm-body">
              <div className="msearch">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="6.5" fill="currentColor" fillOpacity=".14" />
                  <path d="M16 16l4.5 4.5" />
                </svg>
                <span>
                  Search
                  {" "}
                  <b>Mumbai · local</b>
                </span>
              </div>
              <div className="mrow">
                <span><span className="mono">+91 22 6120 4471</span></span>
                <span><span className="mbtn">Buy</span></span>
              </div>
              <div className="mrow">
                <span><span className="mono">+91 22 6120 5180</span></span>
                <span><span className="mbtn">Buy</span></span>
              </div>
              <div className="mrow">
                <span><span className="mono">+91 22 6120 7702</span></span>
                <span><span className="mbtn">Buy</span></span>
              </div>
            </div>
          </div>
        ),
      },
      {
        tag: "Online KYC",
        heading: <>Verify once.{" "}<em>Go live fast.</em></>,
        body: "Business KYC happens online, the way India's telecom rules require, so you are not chasing documents over email before launch.",
        points: ["One verification for your business", "Status visible in the dashboard", "Numbers go live as soon as you're verified"],
        visual: (
          <div className="pm">
            <div className="pm-h">
              <span className="pm-c">
                <span>Compliance</span>
                <span className="sep">›</span>
                <span>Business KYC</span>
              </span>
              <span className="pm-b"><span className="pill">Verified</span></span>
            </div>
            <div className="pm-body">
              <ul className="did">
                <li><span>Business details submitted</span></li>
                <li><span>Documents uploaded</span></li>
                <li><span>Review complete</span></li>
                <li><span>Numbers released for use</span></li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        tag: "Flexible routing",
        heading: <>Point any number{" "}<em>anywhere, any time.</em></>,
        body: "Send a number to an AI agent, a SIP trunk or a VoxML call flow, and switch it whenever you like. No carrier ticket, no downtime.",
        points: ["Bind to Vapi, Retell, ElevenLabs, LiveKit or Bolna", "Or route to a SIP trunk or your own answer_url", "One number binds to one agent at a time"],
        visual: (
          <div className="pm">
            <div className="pm-h">
              <span className="pm-c">
                <span>Numbers</span>
                <span className="sep">›</span>
                <span>Routing</span>
              </span>
              <span className="pm-b"><span className="pill">Saved</span></span>
            </div>
            <div className="pm-body">
              <div className="mprov">
                <span className="on">
                  <BrandLogo id="vapi" size={16} onDark />
                </span>
                <span>
                  <BrandLogo id="retell" size={16} onDark />
                </span>
                <span><BrandLogo id="elevenlabs" size={16} onDark /></span>
                <span>
                  <BrandLogo id="livekit" size={16} onDark />
                </span>
                <span>
                  <BrandLogo id="bolna" size={16} onDark />
                </span>
                <span><em>+ more</em></span>
              </div>
              <div className="mrow">
                <span>Number</span>
                <span><span className="mono">+91 80 4718 2290</span></span>
              </div>
              <div className="mrow">
                <span>Route</span>
                <span>AI agent · Vapi</span>
              </div>
            </div>
          </div>
        ),
      },
      {
        tag: "Results",
        heading: <>Numbers that are{" "}<em>ready for production.</em></>,
        body: "Local, national and toll-free, for every kind of Indian voice line. No lock-in, calls billed per minute.",
        points: ["Number types: 3 line types", "Time to live: Minutes", "Pricing: Pay per minute"],
        visual: (
          <div className="pm">
            <div className="pm-h">
              <span className="pm-c">
                <span>Phone Numbers</span>
                <span className="sep">›</span>
                <span>Overview</span>
              </span>
              <span className="pm-b"><span className="pill">Live</span></span>
            </div>
            <div className="pm-body">
              <div className="mrow">
                <span>Number types</span>
                <span><b>3 line types</b></span>
              </div>
              <div className="mrow">
                <span>Time to live</span>
                <span><b>Minutes</b></span>
              </div>
              <div className="mrow">
                <span>Pricing</span>
                <span><b>Pay per minute</b></span>
              </div>
            </div>
          </div>
        ),
      }
    ],
    code: { "curl": ["List numbers", "# Every request uses HTTP Basic auth:\n# username = Auth ID, password = Auth Token (both from the dashboard)\n\ncurl -u $TRYVOX_AUTH_ID:$TRYVOX_AUTH_TOKEN \\\n  https://api.tryvox.io/v1/account/$TRYVOX_AUTH_ID/numbers"] },
    note: <>Based on{" "}<a href="https://docs.tryvox.io/getting-started/authentication">Authentication</a>{" "}in the TryVox docs.</>,
    faq: [["What kinds of phone numbers can I buy in India?", "Local, national and toll-free numbers. Search by city or type in the dashboard or through the Numbers API."], ["Do I need KYC to buy an Indian virtual number?", "Yes. India's telecom rules require business verification. TryVox runs business KYC online before numbers go live."], ["Can I use the same number for my AI agent and my team?", "A number binds to one AI agent at a time. You can re-point it to a SIP trunk, a call flow or a different agent whenever you need."], ["How fast can I get a number live?", "Most teams search, verify and route a number in minutes once business KYC is complete."], ["Is TryVox an alternative to Exotel or Plivo for phone numbers?", "Yes, for teams running AI voice agents. TryVox gives you Indian numbers, SIP, a Voice API and agent bindings in one account, priced per minute."]],
  },
  "sip-trunking": {
    name: "SIP Trunking",
    title: "SIP Trunking for AI Voice Agents in India | TryVox",
    description: "Elastic SIP trunks for LiveKit, PBX and AI voice agents in India. Credentials, IP ACLs, channel limits and Bring Your Own Carrier. Pay per minute.",
    h1: <>SIP trunking built{" "}<em>for voice AI.</em></>,
    sub: "Connect LiveKit, your PBX or any SIP stack to the Indian phone network. Create trunks in minutes, lock them with credentials and IP access lists, set channel limits, or bring your own carrier.",
    layers: ["Phone network", "Carrier or BYOC", "Credentials + IP ACL", "Channel limits", "Your SIP stack"],
    layerNotes: ["The public phone network", "Use TryVox routes or bring your carrier", "Lock trunks to credentials and IP ranges", "Cap concurrency per trunk", "LiveKit, Asterisk, FreeSWITCH or your PBX"],
    story: ["Your voice stack speaks SIP. The phone network should too.", "TryVox trunks connect LiveKit, Asterisk or your PBX to Indian numbers with credentials, IP allow-lists and channel limits.", "Bring your own carrier or use ours, and get the same call events either way."],
    results: [["Directions", "Inbound + outbound", "One trunk carries both, so routing stays simple."], ["Security", "Credentials + IP ACL", "Use either or both on every trunk."], ["Carrier", "TryVox or BYOC", "Start with ours or keep the routes you already have."]],
    panels: [
      {
        tag: "Create",
        heading: <>A production trunk{" "}<em>in one form.</em></>,
        body: "Name it, choose inbound, outbound or both, and point your SIP client at it. Works with LiveKit, Asterisk, FreeSWITCH or any standards-based stack.",
        points: ["Inbound and outbound on one trunk", "Create from the dashboard or the API", "Works with any SIP client"],
        visual: (
          <div className="pm">
            <div className="pm-h">
              <span className="pm-c">
                <span>SIP trunks</span>
                <span className="sep">›</span>
                <span>New trunk</span>
              </span>
            </div>
            <div className="pm-body">
              <div className="mrow">
                <span>Name</span>
                <span>trunk-prod</span>
              </div>
              <div className="mrow">
                <span>Direction</span>
                <span><span className="pill p">Inbound + outbound</span></span>
              </div>
              <div className="mrow">
                <span>Domain</span>
                <span><span className="mono">trunk.tryvox.io</span></span>
              </div>
            </div>
          </div>
        ),
      },
      {
        tag: "Secure",
        heading: <>Only the traffic{" "}<em>you trust.</em></>,
        body: "Lock every trunk with SIP credentials, IP access lists, or both, and rotate credentials without downtime.",
        points: ["Credentials per trunk", "IP allow-lists", "Rotate without dropping calls"],
        visual: (
          <div className="pm">
            <div className="pm-h">
              <span className="pm-c">
                <span>trunk-prod</span>
                <span className="sep">›</span>
                <span>Security</span>
              </span>
            </div>
            <div className="pm-body">
              <div className="mrow">
                <span><span className="mono">agent-prod</span></span>
                <span><span className="pill">Credential</span></span>
              </div>
              <div className="mrow">
                <span><span className="mono">203.0.113.0/28</span></span>
                <span><span className="pill">Allowed</span></span>
              </div>
              <div className="mrow">
                <span><span className="mono">198.51.100.4</span></span>
                <span><span className="pill">Allowed</span></span>
              </div>
              <div className="mrow">
                <span>Everything else</span>
                <span><span className="pill w">Denied</span></span>
              </div>
            </div>
          </div>
        ),
      },
      {
        tag: "Scale or BYOC",
        heading: <>Set the capacity.{" "}<em>Keep your carrier.</em></>,
        body: "Choose how many concurrent calls each trunk carries. Already have a carrier? Bring Your Own Carrier keeps your routes and rates while TryVox handles routing and events.",
        points: ["Channel limits per trunk", "Bring Your Own Carrier", "Same call events on every route"],
        visual: (
          <div className="pm">
            <div className="pm-h">
              <span className="pm-c">
                <span>Routing</span>
                <span className="sep">›</span>
                <span>BYOC</span>
              </span>
              <span className="pm-b"><span className="pill">Healthy</span></span>
            </div>
            <div className="pm-body">
              <ul className="did">
                <li><span>Your carrier · SIP</span></li>
                <li><span>TryVox routing and call events</span></li>
                <li><span>Your agent or PBX</span></li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        tag: "Results",
        heading: <>Trunks your agents{" "}<em>can rely on.</em></>,
        body: "One trunk carries both, so routing stays simple. Start with ours or keep the routes you already have.",
        points: ["Directions: Inbound + outbound", "Security: Credentials + IP ACL", "Carrier: TryVox or BYOC"],
        visual: (
          <div className="pm">
            <div className="pm-h">
              <span className="pm-c">
                <span>SIP Trunking</span>
                <span className="sep">›</span>
                <span>Overview</span>
              </span>
              <span className="pm-b"><span className="pill">Live</span></span>
            </div>
            <div className="pm-body">
              <div className="mrow">
                <span>Directions</span>
                <span><b>Inbound + outbound</b></span>
              </div>
              <div className="mrow">
                <span>Security</span>
                <span><b>Credentials + IP ACL</b></span>
              </div>
              <div className="mrow">
                <span>Carrier</span>
                <span><b>TryVox or BYOC</b></span>
              </div>
            </div>
          </div>
        ),
      }
    ],
    code: null,
    note: null,
    faq: [["What is SIP trunking?", "A SIP trunk carries phone calls over the internet between the public phone network and your systems, such as a voice agent, LiveKit or a PBX."], ["Can I use TryVox SIP trunks with LiveKit?", "Yes. Point LiveKit or any standards-based SIP client at your TryVox trunk domain with your credentials."], ["How do I stop unauthorised use of my trunk?", "Use SIP credentials, IP access lists, or both. Rotate credentials any time."], ["How many concurrent calls can a trunk carry?", "You set a channel limit per trunk. Talk to us if you need more capacity."], ["Can I bring my own carrier?", "Yes. Bring Your Own Carrier keeps your routes and rates while you use TryVox routing and call events on top."]],
  },
  "voice-api": {
    name: "Voice API",
    title: "Programmable Voice API and VoxML for India | TryVox",
    description: "Place and control calls with one REST API. Webhooks at every stage, recordings, conferences and VoxML call flows for AI voice agents in India.",
    h1: <>A voice API your agent{" "}<em>can build on.</em></>,
    sub: "Place and control calls with one REST API at api.tryvox.io. Get a webhook at every stage, record calls, run conferences and build call flows with VoxML.",
    layers: ["Phone network", "Calls API", "Webhooks", "VoxML flows", "Your code"],
    layerNotes: ["The public phone network", "Place and list calls with one request", "Ring, answer, status and hangup callbacks", "Say, Gather, Dial and Stream", "Your app decides what happens next"],
    story: ["Calls should be as programmable as the rest of your stack.", "One REST API places calls, a webhook reports every stage, and VoxML tells each call what to do.", "Recordings, conferences and live control are one request away."],
    results: [["Auth", "HTTP Basic", "Auth ID and Auth Token. Nothing else to manage."], ["Events", "Every stage", "Ring, answer, status and hangup, delivered to you."], ["Call flows", "VoxML", "Say, Gather, Dial, Stream, Record and Conference."]],
    panels: [
      {
        tag: "Make calls",
        heading: <>One request{" "}<em>starts the call.</em></>,
        body: "POST from, to and answer_url. TryVox replies 201 with status queued and calls your webhooks as the call moves. Place calls one by one or in bulk.",
        points: ["ring_timeout and time_limit per call", "Bulk calls on the same endpoint", "HTTP Basic auth with Auth ID and Token"],
        visual: (
          <div className="pm">
            <div className="pm-h">
              <span className="pm-c">
                <span>Calls</span>
                <span className="sep">›</span>
                <span>Today</span>
              </span>
            </div>
            <div className="pm-body">
              <div className="tbl" style={{ "--cols": "1.4fr 1fr .8fr" } as React.CSSProperties}>
                <div className="tr th">
                  <span>Call</span>
                  <span>Status</span>
                  <span>Duration</span>
                </div>
                <div className="tr">
                  <span><b className="mono">call_8f2a19</b></span>
                  <span><span className="pill">In progress</span></span>
                  <span><span className="mono">01:42</span></span>
                </div>
                <div className="tr">
                  <span><b className="mono">call_7c11e0</b></span>
                  <span><span className="pill p">Ringing</span></span>
                  <span><span className="mono">00:00</span></span>
                </div>
                <div className="tr">
                  <span><b className="mono">call_6b90d4</b></span>
                  <span><span className="pill w">Completed</span></span>
                  <span><span className="mono">03:08</span></span>
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        tag: "Webhooks",
        heading: <>Every stage,{" "}<em>in your system.</em></>,
        body: "Ring, answer, status and hangup callbacks reach your endpoint as they happen, signed with your webhook secret.",
        points: ["ring_url, answer_url, hangup_url", "status_callback_url for progress", "Signed with webhook_secret"],
        visual: (
          <div className="pm">
            <div className="pm-h">
              <span className="pm-c">
                <span>Webhooks</span>
                <span className="sep">›</span>
                <span>Log</span>
              </span>
              <span className="pm-b"><span className="pill">Signed</span></span>
            </div>
            <div className="pm-body">
              <div className="mfeed">
                <div className="msg ev">POST ring_url · 200</div>
                <div className="msg ev ok">POST answer_url · VoxML</div>
                <div className="msg ev">POST status_callback_url · 200</div>
                <div className="msg ev">POST hangup_url · 200</div>
              </div>
            </div>
          </div>
        ),
      },
      {
        tag: "VoxML",
        heading: <>Build the call flow{" "}<em>in VoxML.</em></>,
        body: "When a call is answered, TryVox asks your answer_url what to do. Reply with VoxML verbs and TryVox runs them on the call.",
        points: ["Say, Play and Gather for menus", "Dial and Conference to bring people in", "Stream to send live audio to your agent"],
        visual: (
          <div className="pm">
            <div className="pm-h">
              <span className="pm-c">
                <span>VoxML</span>
                <span className="sep">›</span>
                <span>answer_url</span>
              </span>
            </div>
            <div className="pm-body">
              <ul className="did">
                <li><span>Say a greeting</span></li>
                <li><span>Gather a keypress</span></li>
                <li><span>Stream audio to the agent</span></li>
                <li><span>Dial a person on request</span></li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        tag: "Results",
        heading: <>An API that{" "}<em>stays out of your way.</em></>,
        body: "Auth ID and Auth Token. Nothing else to manage. Say, Gather, Dial, Stream, Record and Conference.",
        points: ["Auth: HTTP Basic", "Events: Every stage", "Call flows: VoxML"],
        visual: (
          <div className="pm">
            <div className="pm-h">
              <span className="pm-c">
                <span>Voice API</span>
                <span className="sep">›</span>
                <span>Overview</span>
              </span>
              <span className="pm-b"><span className="pill">Live</span></span>
            </div>
            <div className="pm-body">
              <div className="mrow">
                <span>Auth</span>
                <span><b>HTTP Basic</b></span>
              </div>
              <div className="mrow">
                <span>Events</span>
                <span><b>Every stage</b></span>
              </div>
              <div className="mrow">
                <span>Call flows</span>
                <span><b>VoxML</b></span>
              </div>
            </div>
          </div>
        ),
      }
    ],
    code: { "curl": ["cURL", "# Place an outbound call\ncurl -X POST https://api.tryvox.io/v1/voice/accounts/$TRYVOX_AUTH_ID/calls \\\n  -u $TRYVOX_AUTH_ID:$TRYVOX_AUTH_TOKEN \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"from\": \"+918047182290\",\n    \"to\": \"+919812345678\",\n    \"answer_url\": \"https://example.com/answer\",\n    \"hangup_url\": \"https://example.com/hangup\",\n    \"status_callback_url\": \"https://example.com/status\",\n    \"ring_timeout\": 30,\n    \"time_limit\": 3600\n  }'"], "node": ["Node", "// Place an outbound call\nconst { TRYVOX_AUTH_ID: id, TRYVOX_AUTH_TOKEN: token } = process.env;\n\nconst res = await fetch(`https://api.tryvox.io/v1/voice/accounts/${id}/calls`, {\n  method: \"POST\",\n  headers: {\n    Authorization: \"Basic \" + Buffer.from(`${id}:${token}`).toString(\"base64\"),\n    \"Content-Type\": \"application/json\",\n  },\n  body: JSON.stringify({\n    from: \"+918047182290\",\n    to: \"+919812345678\",\n    answer_url: \"https://example.com/answer\",\n    hangup_url: \"https://example.com/hangup\",\n  }),\n});\nconst { data } = await res.json(); // data.status === \"queued\""], "py": ["Python", "# Place an outbound call\nimport os, requests\n\nauth_id = os.environ[\"TRYVOX_AUTH_ID\"]\ncall = requests.post(\n    f\"https://api.tryvox.io/v1/voice/accounts/{auth_id}/calls\",\n    auth=(auth_id, os.environ[\"TRYVOX_AUTH_TOKEN\"]),\n    json={\n        \"from\": \"+918047182290\",\n        \"to\": \"+919812345678\",\n        \"answer_url\": \"https://example.com/answer\",\n        \"hangup_url\": \"https://example.com/hangup\",\n    },\n).json()[\"data\"]"], "resp": ["Response", "// 201 Created\n{\n  \"data\": {\n    \"request_uuid\": \"…\",\n    \"from\": \"+918047182290\",\n    \"to\": \"+919812345678\",\n    \"direction\": \"outbound\",\n    \"status\": \"queued\",\n    \"duration\": 0,\n    \"billsec\": 0\n  }\n}"] },
    note: <>Based on{" "}<a href="https://docs.tryvox.io/voice/make-call">Make a call</a>{" "}in the TryVox docs.</>,
    faq: [["How do I authenticate with the TryVox Voice API?", "HTTP Basic auth. Your Auth ID is the username and your Auth Token is the password. Both are in the dashboard."], ["What does answer_url need to return?", "VoxML. TryVox calls answer_url when the call is answered and runs the VoxML verbs you return."], ["Can I place outbound calls in bulk?", "Yes. The same calls endpoint accepts a list of calls."], ["Can I record calls?", "Yes. Record calls and fetch recordings through the API."], ["Is answering machine detection available?", "Not yet. The parameter is accepted but has no effect today, so don't rely on it."]],
  },
  "ai-agents": {
    name: "AI Agents",
    title: "Connect Vapi, Retell, ElevenLabs, LiveKit and Bolna to Indian Numbers | TryVox",
    description: "Bind an Indian phone number to your Vapi, Retell, ElevenLabs, LiveKit or Bolna voice agent in a few clicks. No SIP configuration or deployment needed.",
    h1: <>Put your AI agent on{" "}<em>a real phone number.</em></>,
    sub: "Pick your provider, choose a TryVox number and an agent, and confirm. Your Vapi, Retell, ElevenLabs, LiveKit or Bolna agent answers calls straight away, with no SIP setup.",
    layers: ["Phone network", "TryVox numbers", "Agent bindings", "SIP context headers", "Your AI agent"],
    layerNotes: ["The public phone network", "Indian numbers ready to bind", "One number, one agent, a few clicks", "Direction, caller and route on every call", "Your agent answers on the first ring"],
    story: ["You built the agent. Now give it a phone line.", "Bind any TryVox number to Vapi, Retell, ElevenLabs, LiveKit or Bolna in a few clicks, with no SIP configuration.", "Calls arrive with full context, and you can switch providers without changing numbers."],
    results: [["Providers", "5 and counting", "Vapi, Retell, ElevenLabs, LiveKit and Bolna."], ["Setup", "No SIP config", "Bind a number in a few clicks."], ["Routing", "1 number, 1 agent", "Predictable routing you can reason about."]],
    panels: [
      {
        tag: "Bring any agent",
        heading: <>Keep the platform{" "}<em>you already chose.</em></>,
        body: "Vapi, Retell, ElevenLabs, LiveKit and Bolna work today. TryVox is only the phone layer, so you never feed a competitor or get locked in.",
        points: ["Five providers today, more coming", "Switch providers without changing numbers", "No lock-in"],
        visual: (
          <div className="pm">
            <div className="pm-h">
              <span className="pm-c">
                <span>AI agents</span>
                <span className="sep">›</span>
                <span>Providers</span>
              </span>
            </div>
            <div className="pm-body">
              <div className="mprov">
                <span>
                  <BrandLogo id="vapi" size={16} onDark />
                </span>
                <span className="on">
                  <BrandLogo id="retell" size={16} onDark />
                </span>
                <span><BrandLogo id="elevenlabs" size={16} onDark /></span>
                <span>
                  <BrandLogo id="livekit" size={16} onDark />
                </span>
                <span>
                  <BrandLogo id="bolna" size={16} onDark />
                </span>
                <span><em>+ more</em></span>
              </div>
            </div>
          </div>
        ),
      },
      {
        tag: "Bind in clicks",
        heading: <>One number,{" "}<em>one agent.</em></>,
        body: "Choose an active number and an agent and confirm. Calls arrive at the agent immediately, with no deployment or SIP configuration.",
        points: ["Each number binds to one agent", "Remove a binding to fall back", "Don't also set it inbound in your provider"],
        visual: (
          <div className="pm">
            <div className="pm-h">
              <span className="pm-c">
                <span>AI agents</span>
                <span className="sep">›</span>
                <span>Bindings</span>
              </span>
            </div>
            <div className="pm-body">
              <div className="tbl" style={{ "--cols": "1.5fr .9fr .9fr" } as React.CSSProperties}>
                <div className="tr th">
                  <span>Number</span>
                  <span>Provider</span>
                  <span>Agent</span>
                </div>
                <div className="tr">
                  <span><b className="mono">+91 80 4718 2290</b></span>
                  <span>Vapi</span>
                  <span>Riya</span>
                </div>
                <div className="tr">
                  <span><b className="mono">+91 22 6120 4471</b></span>
                  <span>Retell</span>
                  <span>Arjun</span>
                </div>
                <div className="tr">
                  <span><b className="mono">1800 xxx xxxx</b></span>
                  <span>Bolna</span>
                  <span>Meera</span>
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        tag: "Context headers",
        heading: <>Every call arrives{" "}<em>with context.</em></>,
        body: "Your agent receives the direction, route, provider, caller and number in SIP headers, so it can greet and route correctly.",
        points: ["X-TryVox-Direction and Route", "X-TryVox-From and To", "Same call records as every call"],
        visual: (
          <div className="pm">
            <div className="pm-h">
              <span className="pm-c">
                <span>SIP headers</span>
                <span className="sep">›</span>
                <span>Inbound</span>
              </span>
            </div>
            <div className="pm-body">
              <pre className="mcode">
                {SIP_HEADERS}
              </pre>
            </div>
          </div>
        ),
      },
      {
        tag: "Results",
        heading: <>The fastest way to{" "}<em>a live agent line.</em></>,
        body: "Vapi, Retell, ElevenLabs, LiveKit and Bolna. Predictable routing you can reason about.",
        points: ["Providers: 5 and counting", "Setup: No SIP config", "Routing: 1 number, 1 agent"],
        visual: (
          <div className="pm">
            <div className="pm-h">
              <span className="pm-c">
                <span>AI Agents</span>
                <span className="sep">›</span>
                <span>Overview</span>
              </span>
              <span className="pm-b"><span className="pill">Live</span></span>
            </div>
            <div className="pm-body">
              <div className="mrow">
                <span>Providers</span>
                <span><b>5 and counting</b></span>
              </div>
              <div className="mrow">
                <span>Setup</span>
                <span><b>No SIP config</b></span>
              </div>
              <div className="mrow">
                <span>Routing</span>
                <span><b>1 number, 1 agent</b></span>
              </div>
            </div>
          </div>
        ),
      }
    ],
    code: { "sip": ["Agent SIP headers", "# Headers your agent receives on an inbound call\n# after you bind a TryVox number to it\n\nX-TryVox-Direction:    inbound\nX-TryVox-Route:        ai-agent\nX-TryVox-AI-Provider:  vapi | elevenlabs | retell\nX-TryVox-From:         <E.164 caller>\nX-TryVox-To:           <E.164 TryVox number>"] },
    note: <>From{" "}<a href="https://docs.tryvox.io/ai-agents/connect-number">Connect a number</a>{" "}in the TryVox docs.</>,
    faq: [["Which AI voice agent platforms work with TryVox?", "Vapi, Retell, ElevenLabs, LiveKit and Bolna."], ["Do I need to configure SIP to connect my agent?", "No. Binding a number to an agent needs no deployment or SIP configuration."], ["Can my agent make outbound calls through TryVox?", "Inbound calls to a bound number go straight to the agent. Outbound calls from agents are still in progress, so don't rely on them for production yet."], ["Can one number go to two agents?", "No. A number binds to one agent at a time."], ["Should I also set the number as inbound in my provider?", "No. Doing both can make calls conflict. Let TryVox route the number to the agent."]],
  },
  "messaging": {
    name: "Messaging",
    title: "WhatsApp Business API and DLT SMS for Voice AI Teams | TryVox",
    description: "Send WhatsApp messages, take WhatsApp calls and send DLT-compliant SMS from the same account as your Indian phone numbers. Follow up the moment a call ends.",
    h1: <>Follow every call with{" "}<em>WhatsApp or SMS.</em></>,
    sub: "Send WhatsApp messages, take WhatsApp calls and send DLT-ready SMS from the same account as your numbers. Confirm, remind and share links the moment a call ends.",
    layers: ["Phone numbers", "WhatsApp Business", "DLT SMS", "Templates", "Your follow-ups"],
    layerNotes: ["The numbers your customers know", "Messages and WhatsApp calling", "DLT-ready SMS for India", "Approved templates, ready to send", "Follow up the moment a call ends"],
    story: ["The best follow-up lands while the call is still fresh.", "Send WhatsApp messages, take WhatsApp calls and send DLT-ready SMS from the same account as your numbers.", "Track delivered and read events, and keep voice and messaging on one bill."],
    results: [["Channels", "WhatsApp + SMS", "Plus WhatsApp calling, next to your phone numbers."], ["Compliance", "DLT-ready", "Entity and template workflows for India."], ["Billing", "One bill", "Voice and messaging, pay as you go."]],
    panels: [
      {
        tag: "WhatsApp",
        heading: <>WhatsApp messages{" "}<em>and calls.</em></>,
        body: "Send and receive WhatsApp messages and take WhatsApp calls alongside your phone numbers, all from one account.",
        points: ["WhatsApp messaging", "WhatsApp calling", "Delivery and read events"],
        visual: (
          <div className="pm">
            <div className="pm-h">
              <span className="pm-c">
                <span>WhatsApp</span>
                <span className="sep">›</span>
                <span>Conversation</span>
              </span>
            </div>
            <div className="pm-body">
              <div className="mfeed">
                <div className="msg a">Your appointment is confirmed for Thursday at 4 PM.</div>
                <div className="msg c">Can I bring a family member?</div>
                <div className="msg a">Of course. See you Thursday.</div>
              </div>
            </div>
          </div>
        ),
      },
      {
        tag: "Templates",
        heading: <>Approved templates,{" "}<em>ready to send.</em></>,
        body: "Manage the templates your campaigns use and see which are approved before you send.",
        points: ["Template management", "Approval status at a glance", "Reuse across campaigns"],
        visual: (
          <div className="pm">
            <div className="pm-h">
              <span className="pm-c">
                <span>Messaging</span>
                <span className="sep">›</span>
                <span>Templates</span>
              </span>
            </div>
            <div className="pm-body">
              <div className="tbl" style={{ "--cols": "1.6fr 1fr .9fr" } as React.CSSProperties}>
                <div className="tr th">
                  <span>Template</span>
                  <span>Channel</span>
                  <span>Status</span>
                </div>
                <div className="tr">
                  <span><b className="mono">payment_reminder</b></span>
                  <span>WhatsApp</span>
                  <span><span className="pill">Approved</span></span>
                </div>
                <div className="tr">
                  <span><b className="mono">otp_login</b></span>
                  <span>SMS · DLT</span>
                  <span><span className="pill">Approved</span></span>
                </div>
                <div className="tr">
                  <span><b className="mono">delivery_slot</b></span>
                  <span>WhatsApp</span>
                  <span><span className="pill w">Pending</span></span>
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        tag: "DLT SMS",
        heading: <>SMS that follows{" "}<em>India's DLT rules.</em></>,
        body: "Send OTPs, reminders and alerts with your DLT entity and templates linked, so messages are delivered rather than blocked.",
        points: ["DLT entity and templates", "OTPs, alerts and reminders", "Same account as your numbers"],
        visual: (
          <div className="pm">
            <div className="pm-h">
              <span className="pm-c">
                <span>SMS</span>
                <span className="sep">›</span>
                <span>DLT</span>
              </span>
              <span className="pm-b"><span className="pill">Ready</span></span>
            </div>
            <div className="pm-body">
              <ul className="did">
                <li><span>DLT entity linked</span></li>
                <li>
                  <span>
                    Template
                    {" "}
                    <code>otp_login</code>
                    {" "}
                    approved
                  </span>
                </li>
                <li><span>Header registered</span></li>
                <li><span>Ready to send</span></li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        tag: "Results",
        heading: <>Voice and messaging,{" "}<em>one account.</em></>,
        body: "Plus WhatsApp calling, next to your phone numbers. Voice and messaging, pay as you go.",
        points: ["Channels: WhatsApp + SMS", "Compliance: DLT-ready", "Billing: One bill"],
        visual: (
          <div className="pm">
            <div className="pm-h">
              <span className="pm-c">
                <span>Messaging</span>
                <span className="sep">›</span>
                <span>Overview</span>
              </span>
              <span className="pm-b"><span className="pill">Live</span></span>
            </div>
            <div className="pm-body">
              <div className="mrow">
                <span>Channels</span>
                <span><b>WhatsApp + SMS</b></span>
              </div>
              <div className="mrow">
                <span>Compliance</span>
                <span><b>DLT-ready</b></span>
              </div>
              <div className="mrow">
                <span>Billing</span>
                <span><b>One bill</b></span>
              </div>
            </div>
          </div>
        ),
      }
    ],
    code: null,
    note: null,
    faq: [["Can I send a WhatsApp message after an AI call?", "Yes. Messaging runs on the same account as your numbers, so you can follow up when a call ends."], ["Does TryVox support WhatsApp calling?", "Yes. Take WhatsApp calls alongside your phone numbers."], ["Is TryVox SMS DLT-compliant?", "Yes. DLT registration is part of compliance in TryVox."], ["Do I need a separate account for messaging?", "No. Voice and messaging share one account and one bill."]],
  },
  "compliance": {
    name: "Compliance",
    title: "Telecom Compliance for AI Calling in India: KYC, DLT, Consent | TryVox",
    description: "Business KYC, consent records, DLT registration, verified caller IDs and signed webhooks, built into TryVox for AI voice calling in India.",
    h1: <>Stay compliant{" "}<em>on every call.</em></>,
    sub: "Business KYC, consent records, DLT registration and verified caller IDs are built into TryVox, so compliance isn't a project you run on the side.",
    layers: ["Business KYC", "Consent records", "DLT registration", "Verified caller IDs", "Signed webhooks"],
    layerNotes: ["Business KYC before numbers go live", "Consent stored per contact", "DLT entity and templates for SMS", "Verify the numbers you call from", "Trust every callback you receive"],
    story: ["In India, compliance is part of every call.", "TryVox builds business KYC, consent records, DLT registration and verified caller IDs into the product.", "Your team ships campaigns, and the audit trail writes itself."],
    results: [["KYC", "Online", "Verification before any number goes live."], ["SMS", "DLT-ready", "Entity and template workflows."], ["Webhooks", "Signed", "Trust every callback you receive."]],
    panels: [
      {
        tag: "Business KYC",
        heading: <>Verify{" "}<em>once, online.</em></>,
        body: "Business verification happens online before numbers are issued, as India's telecom rules require.",
        points: ["Online, no paperwork loop", "Status in the dashboard", "Required for every number"],
        visual: (
          <div className="pm">
            <div className="pm-h">
              <span className="pm-c">
                <span>Compliance</span>
                <span className="sep">›</span>
                <span>KYC</span>
              </span>
              <span className="pm-b"><span className="pill">Verified</span></span>
            </div>
            <div className="pm-body">
              <ul className="did">
                <li><span>Business details</span></li>
                <li><span>Documents</span></li>
                <li><span>Review complete</span></li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        tag: "Consent",
        heading: <>Consent,{" "}<em>on record.</em></>,
        body: "Store consent for the people you call and respect it when they withdraw.",
        points: ["Consent per contact", "Withdrawals respected", "Records you can export"],
        visual: (
          <div className="pm">
            <div className="pm-h">
              <span className="pm-c">
                <span>Compliance</span>
                <span className="sep">›</span>
                <span>Consent</span>
              </span>
            </div>
            <div className="pm-body">
              <div className="tbl" style={{ "--cols": "1.6fr 1fr" } as React.CSSProperties}>
                <div className="tr th">
                  <span>Contact</span>
                  <span>Status</span>
                </div>
                <div className="tr">
                  <span><span className="mono">+91 98•• ••5678</span></span>
                  <span><span className="pill">Consented</span></span>
                </div>
                <div className="tr">
                  <span><span className="mono">+91 99•• ••0412</span></span>
                  <span><span className="pill">Consented</span></span>
                </div>
                <div className="tr">
                  <span><span className="mono">+91 97•• ••2231</span></span>
                  <span><span className="pill w">Withdrawn</span></span>
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        tag: "DLT and caller ID",
        heading: <>Register, verify,{" "}<em>send.</em></>,
        body: "Link your DLT entity for SMS, verify the numbers you call from, and receive webhooks signed with your secret.",
        points: ["DLT entity and templates", "Verified caller IDs", "Signed webhooks"],
        visual: (
          <div className="pm">
            <div className="pm-h">
              <span className="pm-c">
                <span>Compliance</span>
                <span className="sep">›</span>
                <span>DLT · Caller IDs</span>
              </span>
              <span className="pm-b"><span className="pill">Ready</span></span>
            </div>
            <div className="pm-body">
              <ul className="did">
                <li><span>DLT entity linked</span></li>
                <li>
                  <span>
                    Template
                    {" "}
                    <code>otp_login</code>
                    {" "}
                    approved
                  </span>
                </li>
                <li>
                  <span>
                    Caller ID
                    {" "}
                    <code>+91 80 4718 2290</code>
                    {" "}
                    verified
                  </span>
                </li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        tag: "Results",
        heading: <>Compliance built in,{" "}<em>not bolted on.</em></>,
        body: "Verification before any number goes live. Trust every callback you receive.",
        points: ["KYC: Online", "SMS: DLT-ready", "Webhooks: Signed"],
        visual: (
          <div className="pm">
            <div className="pm-h">
              <span className="pm-c">
                <span>Compliance</span>
                <span className="sep">›</span>
                <span>Overview</span>
              </span>
              <span className="pm-b"><span className="pill">Live</span></span>
            </div>
            <div className="pm-body">
              <div className="mrow">
                <span>KYC</span>
                <span><b>Online</b></span>
              </div>
              <div className="mrow">
                <span>SMS</span>
                <span><b>DLT-ready</b></span>
              </div>
              <div className="mrow">
                <span>Webhooks</span>
                <span><b>Signed</b></span>
              </div>
            </div>
          </div>
        ),
      }
    ],
    code: null,
    note: null,
    faq: [["Why does TryVox need business KYC?", "India's telecom rules require business verification before numbers are issued."], ["What is DLT registration?", "Distributed Ledger Technology registration, required in India for commercial SMS. TryVox links your DLT entity and templates."], ["How do verified caller IDs work?", "You verify that you own a number, then use it as the caller ID on outbound calls."], ["Can I record consent for the people I call?", "Yes. Store consent per contact and respect withdrawals."]],
  }
};
