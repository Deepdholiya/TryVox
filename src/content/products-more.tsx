/* Product pages added in the call-lifecycle redesign: WebRTC, WhatsApp, SMS & RCS, Smart Campaign Manager and
   Number Reputation. Same shape as products.tsx, merged into PRODUCT_PAGES there. */
import type { CSSProperties } from "react";
import type { Product } from "./products";

const Head = ({ a, b, pill, warn }: { a: string; b: string; pill?: string; warn?: boolean }) => (
  <div className="pm-h">
    <span className="pm-c">
      <span>{a}</span>
      <span className="sep">›</span>
      <span>{b}</span>
    </span>
    {pill && (
      <span className="pm-b">
        <span className={`pill${warn ? " w" : ""}`}>{pill}</span>
      </span>
    )}
  </div>
);
const Rows = ({ rows }: { rows: [string, string][] }) => (
  <>
    {rows.map(([k, v]) => (
      <div className="mrow" key={k}>
        <span>{k}</span>
        <span>
          <b>{v}</b>
        </span>
      </div>
    ))}
  </>
);
const Checks = ({ items }: { items: string[] }) => (
  <ul className="did">
    {items.map((t) => (
      <li key={t}>
        <span>{t}</span>
      </li>
    ))}
  </ul>
);
const cols = (v: string) => ({ "--cols": v }) as CSSProperties;

export const MORE_PRODUCTS: Record<string, Product> = {
  webrtc: {
    name: "WebRTC",
    title: "WebRTC Voice API for Browser Calling and AI-to-Human Handoff | TryVox",
    description: "Make and take phone calls from a browser tab or mobile app, and hand an AI agent's live call to a human with context. Same numbers, call records and account as TryVox voice.",
    h1: <>Phone calls from{" "}<em>a browser tab.</em></>,
    sub: "Put a browser or mobile app on the phone network. Call any number with a real caller ID, ring a tab on inbound calls, and move a live AI call to a human without the caller noticing.",
    layers: ["Phone network", "TryVox numbers", "WebRTC gateway", "Endpoints", "Browser or app"],
    layerNotes: ["The public phone network", "Real caller IDs, inbound and outbound", "TryVox runs the media relay and codecs", "One login per agent, customer or device", "No softphone to install"],
    story: ["Your support team already lives in the browser.", "TryVox WebRTC lets a tab or app make and take real phone calls on your TryVox numbers.", "When your AI agent needs a human, the call moves to a tab with the context already on screen."],
    results: [["Install", "Nothing", "Callers and agents use the browser they already have."], ["Handoff", "AI to human", "Warm transfer with context, and back again."], ["Records", "Same as voice", "Every browser call gets the same call record."]],
    panels: [
      {
        tag: "Endpoints",
        heading: <>One login{" "}<em>per person.</em></>,
        body: "Create an endpoint for each agent, customer or device. Each one gets its own credentials, so you can revoke a single login without touching the rest.",
        points: ["Create endpoints from the dashboard or the API", "Credentials per endpoint", "Revoke instantly"],
        visual: (
          <div className="pm">
            <Head a="WebRTC" b="Endpoints" />
            <div className="pm-body">
              <div className="tbl" style={cols("1.4fr 1fr .8fr")}>
                <div className="tr th"><span>Endpoint</span><span>Team</span><span>Status</span></div>
                <div className="tr"><span><b className="mono">agent.riya</b></span><span>Support</span><span><span className="pill">Online</span></span></div>
                <div className="tr"><span><b className="mono">agent.arjun</b></span><span>Collections</span><span><span className="pill">Online</span></span></div>
                <div className="tr"><span><b className="mono">kiosk.blr-02</b></span><span>Store</span><span><span className="pill w">Offline</span></span></div>
              </div>
            </div>
          </div>
        ),
      },
      {
        tag: "AI to human",
        heading: <>The caller stays.{" "}<em>The human picks up.</em></>,
        body: "When your agent needs a person, transfer the live call to a browser endpoint in one request. A summary travels with the call, so the human starts with context.",
        points: ["Warm transfer on a live call", "Context passed with the call", "Hand back to the agent the same way"],
        visual: (
          <div className="pm">
            <Head a="Call" b="Transfer" pill="Connected" />
            <div className="pm-body">
              <div className="mfeed">
                <div className="msg a">I&rsquo;ll connect you to a colleague who can approve that.</div>
                <div className="msg c">Okay, thanks.</div>
              </div>
              <Rows rows={[["From", "AI agent · Vapi"], ["To", "agent.riya · browser"], ["Context", "Refund over ₹5,000"]]} />
            </div>
          </div>
        ),
      },
      {
        tag: "In and out",
        heading: <>Real numbers,{" "}<em>both directions.</em></>,
        body: "Dial any phone number from the browser with your TryVox number as caller ID, or point a number at an endpoint so inbound calls ring in the tab.",
        points: ["Outbound with a real caller ID", "Inbound rings in the browser", "Encrypted media and signalling"],
        visual: (
          <div className="pm">
            <Head a="Dialer" b="Outbound" pill="Ringing" />
            <div className="pm-body">
              <Rows rows={[["From", "+91 80 4718 2290"], ["To", "+91 98•• ••5678"], ["Media", "Browser ⇄ phone network"]]} />
            </div>
          </div>
        ),
      },
      {
        tag: "Results",
        heading: <>A phone line{" "}<em>in every tab.</em></>,
        body: "No desk phones, no softphone installs. Browser calls share numbers, billing and call records with the rest of your TryVox account.",
        points: ["Install: Nothing", "Handoff: AI to human", "Records: Same as voice"],
        visual: (
          <div className="pm">
            <Head a="WebRTC" b="Overview" pill="Live" />
            <div className="pm-body">
              <Rows rows={[["Install", "Nothing"], ["Handoff", "AI to human"], ["Records", "Same as voice"]]} />
            </div>
          </div>
        ),
      },
    ],
    code: null,
    note: null,
    faq: [
      ["What is WebRTC calling?", "WebRTC lets a web browser or mobile app send and receive live audio. TryVox connects that audio to the phone network, so a browser tab can call and receive real phone numbers."],
      ["Do my callers need to install anything?", "No. People call your TryVox numbers as usual. Your team answers in the browser."],
      ["Can an AI agent hand a call to a human in the browser?", "Yes. Transfer the live call to a browser endpoint and pass context with it, so the human knows what the agent already covered."],
      ["Is browser call audio encrypted?", "Yes. Media and signalling between the browser and TryVox are encrypted."],
    ],
  },

  whatsapp: {
    name: "WhatsApp",
    title: "WhatsApp Business API and WhatsApp Calling for Voice AI | TryVox",
    description: "Send WhatsApp templates and replies, receive messages as webhooks, and take WhatsApp voice calls on the same TryVox account as your phone numbers and AI calls.",
    h1: <>Keep the conversation{" "}<em>going on WhatsApp.</em></>,
    sub: "Send approved templates and free-form replies, get every inbound message and delivery status as a webhook, and take WhatsApp calls on the same account that runs your voice agent.",
    layers: ["WhatsApp network", "Business number", "Templates", "Webhooks", "Your agent or backend"],
    layerNotes: ["Where your customers already are", "A TryVox number or your own", "Approved templates, ready to send", "Messages, status and call events", "Reply from the same code that answers calls"],
    story: ["Most customers would rather read a link than hear one.", "Send a payment link, booking or summary on WhatsApp the moment an AI call ends.", "Replies come back to the same backend, and customers can call you on WhatsApp too."],
    results: [["Channels", "Messages + calls", "WhatsApp messaging and voice on one number."], ["Events", "Every status", "Sent, delivered, read and failed, as webhooks."], ["Account", "Shared with voice", "One login, one API key, one bill."]],
    panels: [
      {
        tag: "After the call",
        heading: <>The follow-up lands{" "}<em>while it&rsquo;s fresh.</em></>,
        body: "When a call ends, send the confirmation, payment link or summary on WhatsApp from the same flow that handled the call.",
        points: ["Trigger on call outcome", "Template or free-form reply", "Links, media and documents"],
        visual: (
          <div className="pm">
            <Head a="WhatsApp" b="Conversation" />
            <div className="pm-body">
              <div className="mfeed">
                <div className="msg a">Thanks for your time on the call. Here is your payment link for ₹4,250.</div>
                <div className="msg c">Paid, thank you.</div>
                <div className="msg a">Received. Your receipt is on its way.</div>
              </div>
            </div>
          </div>
        ),
      },
      {
        tag: "Templates",
        heading: <>Approved before{" "}<em>you hit send.</em></>,
        body: "Create templates for marketing, utility and one-time codes, submit them for approval, and see each one's status before a campaign goes out.",
        points: ["Marketing, utility and authentication templates", "Approval status at a glance", "Reply free-form inside the 24-hour window"],
        visual: (
          <div className="pm">
            <Head a="WhatsApp" b="Templates" />
            <div className="pm-body">
              <div className="tbl" style={cols("1.6fr 1fr .9fr")}>
                <div className="tr th"><span>Template</span><span>Category</span><span>Status</span></div>
                <div className="tr"><span><b className="mono">payment_link</b></span><span>Utility</span><span><span className="pill">Approved</span></span></div>
                <div className="tr"><span><b className="mono">login_code</b></span><span>Auth</span><span><span className="pill">Approved</span></span></div>
                <div className="tr"><span><b className="mono">festive_offer</b></span><span>Marketing</span><span><span className="pill w">In review</span></span></div>
              </div>
            </div>
          </div>
        ),
      },
      {
        tag: "WhatsApp calling",
        heading: <>Customers call you{" "}<em>on WhatsApp.</em></>,
        body: "Answer WhatsApp voice calls on the same number and route them to your AI agent or your team, with the same call events as a phone call.",
        points: ["Inbound WhatsApp calls", "Route to an agent or a person", "Call events as webhooks"],
        visual: (
          <div className="pm">
            <Head a="WhatsApp" b="Calls" pill="Live" />
            <div className="pm-body">
              <Rows rows={[["Caller", "+91 98•• ••0412"], ["Route", "AI agent · Retell"], ["Status", "In progress · 01:12"]]} />
            </div>
          </div>
        ),
      },
      {
        tag: "Results",
        heading: <>Voice and WhatsApp,{" "}<em>one account.</em></>,
        body: "Messages, calls and status events sit next to your phone numbers, on one bill.",
        points: ["Channels: Messages + calls", "Events: Every status", "Account: Shared with voice"],
        visual: (
          <div className="pm">
            <Head a="WhatsApp" b="Overview" pill="Live" />
            <div className="pm-body">
              <Rows rows={[["Channels", "Messages + calls"], ["Events", "Every status"], ["Account", "Shared with voice"]]} />
            </div>
          </div>
        ),
      },
    ],
    code: null,
    note: null,
    faq: [
      ["Can I send a WhatsApp message after an AI call?", "Yes. WhatsApp runs on the same account as your numbers, so the flow that handled the call can send the follow-up."],
      ["Does TryVox support WhatsApp calling?", "Yes. Take WhatsApp voice calls on the same number and route them to your agent or team."],
      ["Do I need templates?", "To start a conversation, yes: WhatsApp requires an approved template. Inside 24 hours of the customer's last message you can reply free-form."],
      ["Do I need a separate account for WhatsApp?", "No. Voice and WhatsApp share one account, one API key and one bill."],
    ],
  },

  "sms-rcs": {
    name: "SMS & RCS",
    title: "DLT SMS and RCS Business Messaging for Voice AI in India | TryVox",
    description: "Send DLT-ready SMS and rich RCS messages with buttons from the same TryVox account as your AI calls. Automatic fallback to SMS, delivery and read events.",
    h1: <>Text from the number{" "}<em>your agent calls from.</em></>,
    sub: "Send OTPs, reminders and links over DLT-ready SMS, or rich RCS messages with buttons that fall back to SMS when a phone can't show them.",
    layers: ["Mobile networks", "DLT registration", "SMS and RCS", "Events", "Your agent or backend"],
    layerNotes: ["Every Indian mobile network", "Entity, headers and templates linked", "Plain text or rich cards with buttons", "Delivered, read and button taps", "Reply or call back from your code"],
    story: ["Some messages are better as a text.", "Send DLT-ready SMS for OTPs and alerts, or RCS cards your customers can tap.", "If a phone can't show RCS, the message goes as SMS automatically."],
    results: [["Channels", "SMS + RCS", "Plain or rich, from one endpoint."], ["Compliance", "DLT-ready", "Entity, headers and templates linked."], ["Fallback", "Automatic", "RCS falls back to SMS when needed."]],
    panels: [
      {
        tag: "DLT SMS",
        heading: <>SMS that gets{" "}<em>delivered, not blocked.</em></>,
        body: "Link your DLT entity, headers and templates once. OTPs, reminders and alerts then go out under India's rules.",
        points: ["DLT entity, headers and templates", "OTPs, alerts and reminders", "Delivery status per message"],
        visual: (
          <div className="pm">
            <Head a="SMS" b="DLT" pill="Ready" />
            <div className="pm-body">
              <Checks items={["DLT entity linked", "Header TRYVOX registered", "Template otp_login approved", "Ready to send"]} />
            </div>
          </div>
        ),
      },
      {
        tag: "RCS",
        heading: <>Messages people{" "}<em>can tap.</em></>,
        body: "Send rich cards with images and buttons: reschedule, pay, call back or open a link. Every tap comes back to you as an event.",
        points: ["Images, cards and buttons", "Read receipts", "Button taps as events"],
        visual: (
          <div className="pm">
            <Head a="RCS" b="Preview" />
            <div className="pm-body">
              <div className="mfeed">
                <div className="msg a">Your delivery is out today. Pick a slot that suits you.</div>
              </div>
              <div className="mprov">
                <span className="on"><em>2 to 4 PM</em></span>
                <span><em>6 to 8 PM</em></span>
                <span><em>Call us</em></span>
              </div>
            </div>
          </div>
        ),
      },
      {
        tag: "Fallback",
        heading: <>Every phone{" "}<em>gets the message.</em></>,
        body: "TryVox checks whether a phone can receive RCS. If it can't, the same message goes as SMS, so nobody misses it.",
        points: ["Capability check before sending", "Automatic SMS fallback", "One request, either channel"],
        visual: (
          <div className="pm">
            <Head a="Message" b="Route" pill="Delivered" />
            <div className="pm-body">
              <Rows rows={[["To", "+91 97•• ••2231"], ["RCS capable", "No"], ["Sent as", "SMS · DLT"]]} />
            </div>
          </div>
        ),
      },
      {
        tag: "Results",
        heading: <>Plain or rich,{" "}<em>one account.</em></>,
        body: "SMS and RCS run next to your voice and WhatsApp, with one balance for everything.",
        points: ["Channels: SMS + RCS", "Compliance: DLT-ready", "Fallback: Automatic"],
        visual: (
          <div className="pm">
            <Head a="SMS & RCS" b="Overview" pill="Live" />
            <div className="pm-body">
              <Rows rows={[["Channels", "SMS + RCS"], ["Compliance", "DLT-ready"], ["Fallback", "Automatic"]]} />
            </div>
          </div>
        ),
      },
    ],
    code: null,
    note: null,
    faq: [
      ["Is TryVox SMS DLT-compliant?", "Yes. Link your DLT entity, headers and templates, and messages go out under India's DLT rules."],
      ["What is RCS?", "RCS is the rich version of SMS: messages can carry images, cards and buttons, and show read receipts, on phones that support it."],
      ["What happens if a phone can't receive RCS?", "TryVox sends the message as SMS instead, automatically."],
      ["Can my AI agent send a text during a call?", "Yes. The same backend that handles the call can send an SMS or RCS message mid-conversation, such as a payment or booking link."],
    ],
  },

  "campaign-manager": {
    name: "Smart Campaign Manager",
    title: "Smart Campaign Manager for AI Outbound Calling in India | TryVox",
    description: "Plan, run and review AI outbound calling campaigns on TryVox. Pre-launch checks, number health rules that rest or replace failing numbers, and a report on every missed call.",
    h1: <>Outbound campaigns that{" "}<em>keep their answer rate.</em></>,
    sub: "Run AI outbound calling campaigns on TryVox numbers. Campaign Manager checks your list and numbers before launch, watches every number while it runs, and explains every call that didn't connect.",
    layers: ["Contact list", "Pre-launch checks", "Number pool", "Live number rules", "Your AI agent"],
    layerNotes: ["Who you are calling and why", "Consent, duplicates and pool size", "Healthiest numbers dial first", "Tired numbers rest, failing ones are replaced", "Your agent talks, TryVox handles the dialing"],
    story: ["Campaigns lose answers while they run.", "Numbers pick up spam labels mid-campaign, and reports arrive after the calls are made.", "Campaign Manager watches every number as it dials and fixes problems before they cost you a day."],
    results: [["Before", "Checked", "List, consent and number pool checked before launch."], ["During", "Watched", "Every number tracked against rules you set."], ["After", "Explained", "Every unconnected call has a reason."]],
    panels: [
      {
        tag: "Before you dial",
        heading: <>A plan you approve{" "}<em>before it dials.</em></>,
        body: "Pick a use case and its defaults come with it: calls per number, retries and calling hours. Checks flag a thin number pool, invalid contacts and people you already called today.",
        points: ["Presets for reminders, collections, lead follow-up and surveys", "Consent and duplicate checks", "Pace and finish time shown before launch"],
        visual: (
          <div className="pm">
            <Head a="Campaigns" b="New plan" pill="Ready" />
            <div className="pm-body">
              <Rows rows={[["Use case", "EMI reminders"], ["Contacts", "2,400"], ["Numbers", "4 healthy of 6"], ["Calling hours", "9 AM to 7 PM"]]} />
            </div>
          </div>
        ),
      },
      {
        tag: "While it runs",
        heading: <>Failing numbers{" "}<em>step aside.</em></>,
        body: "Every number is watched against your rules. One that carriers keep rejecting, or that people hang up on within seconds, is rested or replaced, so the pace holds.",
        points: ["Rules you can see and change", "Rest at daily limits", "Replace from a backup pool"],
        visual: (
          <div className="pm">
            <Head a="Campaign" b="Numbers" pill="Running" />
            <div className="pm-body">
              <div className="tbl" style={cols("1.5fr 1fr 1fr")}>
                <div className="tr th"><span>Number</span><span>Answered</span><span>State</span></div>
                <div className="tr"><span><b className="mono">+91 80 4718 2290</b></span><span>High</span><span><span className="pill">Dialing</span></span></div>
                <div className="tr"><span><b className="mono">+91 22 6120 4471</b></span><span>High</span><span><span className="pill">Dialing</span></span></div>
                <div className="tr"><span><b className="mono">+91 140 XXX 6120</b></span><span>Low</span><span><span className="pill w">Resting</span></span></div>
              </div>
            </div>
          </div>
        ),
      },
      {
        tag: "After it ends",
        heading: <>Every missed call{" "}<em>has a reason.</em></>,
        body: "The report says why each call didn't connect, what that means and what TryVox already did about it, so the next campaign starts better.",
        points: ["Reasons per call", "Actions already taken", "Retry lists in one click"],
        visual: (
          <div className="pm">
            <Head a="Campaign" b="Report" />
            <div className="pm-body">
              <Rows rows={[["No answer", "Retried at 6 PM"], ["Busy", "Retried after 30 min"], ["Number rested", "Replaced from pool"]]} />
            </div>
          </div>
        ),
      },
      {
        tag: "Results",
        heading: <>Plan, run and review{" "}<em>in one place.</em></>,
        body: "Campaign Manager runs on TryVox numbers and Number Reputation, with India's calling-hour and series rules applied for you.",
        points: ["Before: Checked", "During: Watched", "After: Explained"],
        visual: (
          <div className="pm">
            <Head a="Campaign Manager" b="Overview" pill="Live" />
            <div className="pm-body">
              <Rows rows={[["Before", "Checked"], ["During", "Watched"], ["After", "Explained"]]} />
            </div>
          </div>
        ),
      },
    ],
    code: null,
    note: null,
    faq: [
      ["What does Smart Campaign Manager do?", "It runs AI outbound calling campaigns on TryVox: it checks your list and numbers before launch, watches every number while the campaign runs, and explains every call that didn't connect."],
      ["Does it work with my AI agent platform?", "Yes. Your agent on Vapi, Retell, ElevenLabs, LiveKit, Bolna or your own code takes the calls. Campaign Manager handles who is dialed, when and from which number."],
      ["How does it protect answer rates?", "It dials from your healthiest numbers first and rests or replaces numbers that carriers start rejecting, using the same rules as Number Reputation."],
      ["Does it follow India's calling rules?", "Campaigns apply calling hours, consent checks and the right number series for the type of call."],
    ],
  },

  "number-reputation": {
    name: "Number Reputation",
    title: "Number Reputation Management for AI Calling in India | TryVox",
    description: "Keep your outbound caller IDs trusted. TryVox tracks how each number is treated, shows your verified business name, and rests or replaces numbers before spam labels cost you answers.",
    h1: <>Stay off{" "}<em>the spam list.</em></>,
    sub: "Your agent can't save a call nobody answers. Number Reputation shows your verified business name, tracks how every number is treated, and takes tired numbers out of rotation before they cost you answers.",
    layers: ["Phone networks", "Caller ID apps", "Number health", "Rotation rules", "Your campaigns"],
    layerNotes: ["Every Indian network", "Where spam labels appear", "Answered, cut short or rejected, per number", "Rest, park or replace automatically", "Calls go out from healthy numbers"],
    story: ["A spam label can appear without warning.", "Once it does, answer rates fall no matter how good the agent is.", "Number Reputation spots the signs early and moves traffic to healthy numbers."],
    results: [["Caller ID", "Verified name", "Your KYC-verified business behind every number."], ["Tracking", "Per number", "How each number is being treated, call by call."], ["Rotation", "Automatic", "Tired numbers rest, healthy ones carry the load."]],
    panels: [
      {
        tag: "Business caller ID",
        heading: <>Your name{" "}<em>on the screen.</em></>,
        body: "Every TryVox number is tied to your KYC-verified business, so the people you call can see who is calling instead of an unknown number.",
        points: ["Verified owner on every number", "Business name for caller ID display", "Right series for each type of call"],
        visual: (
          <div className="pm">
            <Head a="Number" b="Caller ID" pill="Verified" />
            <div className="pm-body">
              <Rows rows={[["Number", "+91 80 4718 2290"], ["Shows as", "Acme Finance"], ["Series", "160 · service"]]} />
            </div>
          </div>
        ),
      },
      {
        tag: "Health tracking",
        heading: <>See trouble{" "}<em>before it spreads.</em></>,
        body: "Every call shows how a number is being treated: answered, cut short, rejected or flagged. You can tell a struggling number from a struggling agent.",
        points: ["Health per number", "Spam-label monitoring", "Alerts when a number slips"],
        visual: (
          <div className="pm">
            <Head a="Reputation" b="Numbers" />
            <div className="pm-body">
              <div className="tbl" style={cols("1.5fr 1fr")}>
                <div className="tr th"><span>Number</span><span>Health</span></div>
                <div className="tr"><span><b className="mono">+91 80 4718 2290</b></span><span><span className="pill">Healthy</span></span></div>
                <div className="tr"><span><b className="mono">+91 22 6120 4471</b></span><span><span className="pill">Healthy</span></span></div>
                <div className="tr"><span><b className="mono">+91 140 XXX 6120</b></span><span><span className="pill w">Watch</span></span></div>
              </div>
            </div>
          </div>
        ),
      },
      {
        tag: "Rotation",
        heading: <>Tired numbers{" "}<em>get a rest.</em></>,
        body: "A number that hits its daily limit rests until tomorrow. One that starts getting blocked is parked until it checks clean. A healthy backup takes over, so your pace doesn't drop.",
        points: ["Rest at daily limits", "Park and recheck blocked numbers", "Backup pool takes over"],
        visual: (
          <div className="pm">
            <Head a="Reputation" b="Rotation" pill="Auto" />
            <div className="pm-body">
              <Checks items={["+91 140 XXX 6120 rested · daily limit", "+91 80 4718 3301 joined from backup", "Pace unchanged"]} />
            </div>
          </div>
        ),
      },
      {
        tag: "Results",
        heading: <>Numbers people{" "}<em>still answer.</em></>,
        body: "Number Reputation is built into Smart Campaign Manager and works on every TryVox-managed number.",
        points: ["Caller ID: Verified name", "Tracking: Per number", "Rotation: Automatic"],
        visual: (
          <div className="pm">
            <Head a="Number Reputation" b="Overview" pill="Live" />
            <div className="pm-body">
              <Rows rows={[["Caller ID", "Verified name"], ["Tracking", "Per number"], ["Rotation", "Automatic"]]} />
            </div>
          </div>
        ),
      },
    ],
    code: null,
    note: null,
    faq: [
      ["What is number reputation?", "It is how phone networks and caller ID apps judge a number from the way it calls. A number with a poor reputation gets shown as spam or blocked, and almost nobody answers."],
      ["How does TryVox protect my numbers?", "It ties every number to your verified business, tracks how each number is treated call by call, and rests or replaces numbers before they lose answers."],
      ["Does it work on numbers from my own carrier?", "Reputation tracking and rotation work on TryVox-managed numbers. On numbers you bring from another carrier, that carrier's controls apply."],
      ["Is it included in campaigns?", "Yes. Smart Campaign Manager uses the same rules to choose and swap numbers while a campaign runs."],
    ],
  },
};
