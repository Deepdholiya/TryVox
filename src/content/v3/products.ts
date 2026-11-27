/* Product page content. Every product page renders from one entry here, and llms.txt reads the same data.
   In h1 strings, [square brackets] mark the words that get the highlight bar. */
import { CALL_CURL, CALL_NODE, CALL_PY, SIP_HEADERS } from "@/content/code";

export type SeqRow = [seg: "a" | "b" | "ab", dir: "lr" | "rl", label: string, ok?: boolean];
export type Visual =
  | { kind: "seq"; path: string; right: string; cols: [string, string, string]; rows: SeqRow[]; foot: string[] }
  | { kind: "kv"; path: string; right: string; rows: [string, string][]; foot: string[] };
export type Option = { path: string; tag: string; title: string; body: string; points: string[] };
export type Product = {
  name: string; title: string; description: string;
  label: string; meta: string; chip: string; h1: string; lead: string;
  stats: [string, string][]; visual: Visual;
  two: { label: string; heading: string; lead: string; items: [Option, Option] };
  feat: { heading: string; lead: string; groups: [string, string, string[]][] };
  code?: { path: string; tabs: [string, string][] };
  faq: [string, string][];
};

const SEQ_INBOUND: SeqRow[] = [
  ["a", "lr", "INVITE"],
  ["b", "lr", "route to agent"],
  ["b", "rl", "200 OK", true],
  ["ab", "lr", "RTP audio"],
  ["a", "lr", "BYE"],
];

export const PRODUCT_PAGES: Record<string, Product> = {
  "phone-numbers": {
    name: "Phone Numbers",
    title: "Virtual Phone Numbers in India for AI Voice Agents | TryVox",
    description: "Buy local, national and toll-free Indian phone numbers with online KYC and route them to Vapi, Retell, ElevenLabs, LiveKit, Bolna or a SIP trunk. ₹399 a month per number.",
    label: "Phone numbers", meta: "Local · National · Toll-free",
    chip: "Numbers from ₹399/month",
    h1: "Indian numbers your [agent can answer].",
    lead: "Pick local, national or toll-free numbers, finish business KYC online once, and route each number to your voice agent, a SIP trunk or your own code.",
    stats: [["Line types", "3"], ["Setup", "₹100"], ["Rent", "₹399/mo"]],
    visual: {
      kind: "kv", path: "/numbers/+91 80 4718 2290", right: "Active",
      rows: [["Type", "Local · Bengaluru"], ["KYC", "Verified"], ["Routed to", "Vapi · support-agent"], ["Caller ID", "Kirana Box"], ["Webhooks", "ring · answer · hangup"]],
      foot: ["Bought from the dashboard", "Live in minutes"],
    },
    two: {
      label: "Number types", heading: "Two ways callers reach you.", lead: "Choose by how people should find you. You can hold both on one account.",
      items: [
        { path: "/numbers/local", tag: "Local and national", title: "A number in the city you call most", body: "Local numbers look familiar to the people you call, so more of them pick up. National numbers work across the country.", points: ["Search by city or series", "Buy from the dashboard or the API", "Release numbers you no longer need"] },
        { path: "/numbers/toll-free", tag: "Toll-free", title: "One line customers call for free", body: "A toll-free number for support and sales lines, answered by your agent at any hour and passed to a person when needed.", points: ["Free for the caller", "Answered by an agent 24/7", "Same routing and events as local"] },
      ],
    },
    feat: {
      heading: "Everything a production number needs.", lead: "Buying the number is the easy part. These are the parts that keep it working.",
      groups: [
        ["Onboarding", "Business KYC, once", ["Upload documents online", "Status shown in the dashboard", "Numbers go live when it clears", "One check for every number"]],
        ["Routing", "Point it anywhere", ["Bind to Vapi, Retell or ElevenLabs", "Or LiveKit and Bolna", "Or a SIP trunk or answer_url", "Change the route any time"]],
        ["Operations", "See what happens", ["Webhooks on every call", "Recordings on request", "Verified caller ID", "Health tracked per number"]],
      ],
    },
    faq: [
      ["What kinds of phone numbers can I buy in India?", "Local, national and toll-free numbers. Search by city or type in the dashboard or through the Numbers API."],
      ["Do I need KYC to buy a number?", "Yes. India's telecom rules require business verification. TryVox runs business KYC online during setup, and your numbers go live once it clears."],
      ["How much does a number cost?", "A one-time ₹100 setup fee and ₹399 a month per number. Calls are billed per minute on the same account."],
      ["Can I move a number between agent platforms?", "Yes. Change the binding from one provider to another and the number stays the same."],
    ],
  },

  "number-reputation": {
    name: "Number Reputation",
    title: "Number Reputation Management for AI Calling in India | TryVox",
    description: "Keep outbound caller IDs trusted. TryVox tracks how each number is treated, shows your verified business name, and rests or replaces numbers before spam labels cost you answers.",
    label: "Number reputation", meta: "Caller ID · Health · Rotation",
    chip: "Included with TryVox numbers",
    h1: "Calls people still [pick up].",
    lead: "Your agent can't save a call nobody answers. TryVox shows your verified business name, tracks how each number is treated, and rests tired numbers before they cost you answers.",
    stats: [["Caller ID", "Verified"], ["Tracking", "Per number"], ["Rotation", "Automatic"]],
    visual: {
      kind: "kv", path: "/numbers/health", right: "4 numbers",
      rows: [["+91 80 •••• ••90", "Good"], ["+91 80 •••• ••14", "Good"], ["+91 22 •••• ••07", "Resting · daily limit"], ["+91 11 •••• ••52", "Backup pool"]],
      foot: ["Rules you can see and change", "Same rules as campaigns"],
    },
    two: {
      label: "Before and after", heading: "Protect the number, then the answer rate.", lead: "Reputation is earned by how a number calls. TryVox watches that for you.",
      items: [
        { path: "/reputation/caller-id", tag: "Business caller ID", title: "Your name on the screen", body: "Every number is tied to your verified business, so the person you call sees who is calling instead of an unknown number.", points: ["Verified owner on every number", "Business name for caller ID display", "Right series for each type of call"] },
        { path: "/reputation/rotation", tag: "Rotation", title: "Tired numbers get a rest", body: "When a number reaches its daily limit or starts getting rejected, it steps aside and a healthy number takes over.", points: ["Rest at daily limits", "Park and recheck blocked numbers", "Backup pool takes over"] },
      ],
    },
    feat: {
      heading: "Signals you can act on.", lead: "No black box. Every rule and every change is shown on the number.",
      groups: [
        ["Tracking", "Health per number", ["How carriers treat each call", "Spam-label monitoring", "Alerts when a number slips", "History you can review"]],
        ["Rules", "Rotation you control", ["Daily limits per number", "Rest and recheck", "Backup pool", "Pause a number by hand"]],
        ["Campaigns", "Built into outbound", ["Healthiest numbers dial first", "Swaps while a campaign runs", "Reasons for every swap", "Shared with Campaign Manager"]],
      ],
    },
    faq: [
      ["What is number reputation?", "It is how phone networks and caller ID apps judge a number from the way it calls. A number with a poor reputation gets shown as spam or blocked, and almost nobody answers."],
      ["How does TryVox protect my numbers?", "It ties every number to your verified business, tracks how each number is treated call by call, and rests or replaces numbers before they lose answers."],
      ["Does it work on numbers from my own carrier?", "Tracking and rotation work on TryVox-managed numbers. On numbers you bring from another carrier, that carrier's controls apply."],
      ["Is it part of campaigns?", "Yes. Smart Campaign Manager uses the same rules to choose and swap numbers while a campaign runs."],
    ],
  },

  compliance: {
    name: "Compliance",
    title: "Telecom Compliance for AI Calling in India: KYC, DLT, Consent | TryVox",
    description: "Business KYC, consent records, DLT registration, verified caller IDs and signed webhooks, built into TryVox for AI voice calling in India.",
    label: "Compliance", meta: "KYC · Consent · DLT",
    chip: "Included on every account",
    h1: "Compliance that's [built in], not bolted on.",
    lead: "Business KYC, consent records, DLT registration and verified caller IDs are part of setting up TryVox, so compliance isn't a project you run on the side.",
    stats: [["KYC", "Online"], ["SMS", "DLT-ready"], ["Webhooks", "Signed"]],
    visual: {
      kind: "kv", path: "/account/compliance", right: "All checks passing",
      rows: [["Business KYC", "Verified"], ["Consent records", "Kept per contact"], ["DLT entity", "Linked"], ["Caller ID", "Verified"], ["Webhook signing", "webhook_secret set"]],
      foot: ["Exportable records", "Shown in the dashboard"],
    },
    two: {
      label: "Voice and messaging", heading: "One set of records for every channel.", lead: "The checks that cover your calls also cover the messages that follow them.",
      items: [
        { path: "/compliance/calls", tag: "Calls", title: "Know who you may call, and from where", body: "Business KYC covers every number on the account. Consent sits next to the contacts your campaigns dial.", points: ["Business KYC, once", "Consent per contact", "Withdrawals respected"] },
        { path: "/compliance/messages", tag: "SMS and WhatsApp", title: "Messages that reach the phone", body: "Link your DLT entity, headers and templates so SMS is delivered, and send WhatsApp from approved templates.", points: ["DLT entity and templates", "Approved WhatsApp templates", "Delivery status per message"] },
      ],
    },
    feat: {
      heading: "What's covered.", lead: "These are handled on your account from day one.",
      groups: [
        ["Identity", "Business KYC", ["Online, no paperwork loop", "Status in the dashboard", "Required for every number", "Verified caller ID"]],
        ["Outbound", "Consent", ["Source recorded per contact", "Withdrawals respected", "Calling-hours checks", "Records you can export"]],
        ["Security", "Signed events", ["Webhooks signed with webhook_secret", "HTTP Basic auth on the API", "Credentials per SIP trunk", "IP allow-lists"]],
      ],
    },
    faq: [
      ["Why does TryVox need business KYC?", "India's telecom rules require business verification before numbers are issued. TryVox runs it online during setup."],
      ["What is DLT registration?", "Distributed Ledger Technology registration is required in India for commercial SMS. TryVox links your DLT entity, headers and templates so messages are delivered."],
      ["How are consent records kept?", "Campaigns record where each contact's consent came from and respect withdrawals. You can export the records at any time."],
      ["How do I know a webhook came from TryVox?", "Webhooks are signed with your webhook_secret, so your server can check each one before acting on it."],
    ],
  },

  "sip-trunking": {
    name: "SIP Trunking",
    title: "SIP Trunking for AI Voice Agents in India | TryVox",
    description: "Elastic SIP trunks for LiveKit, PBX and AI voice agents in India. Credentials, IP access lists, channel limits and Bring Your Own Carrier. Billed per minute.",
    label: "SIP trunking", meta: "Inbound + outbound",
    chip: "Billed per minute · no lock-in",
    h1: "SIP trunks for [voice agents] in India.",
    lead: "Connect LiveKit, your PBX or any SIP stack to the Indian phone network. Create a trunk in minutes, lock it with credentials and IP lists, set channel limits, or bring your own carrier.",
    stats: [["Directions", "In + out"], ["Security", "Creds + ACL"], ["Carrier", "Ours or BYOC"]],
    visual: { kind: "seq", path: "sip-trunk.session", right: "Inbound", cols: ["Caller", "TryVox", "Your agent"], rows: SEQ_INBOUND, foot: ["Credentials + IP ACL", "Channel limits per trunk"] },
    two: {
      label: "Two trunks", heading: "Two trunks cover every call.", lead: "Outbound for calls your agent places, inbound for calls it answers. Both can live on one trunk.",
      items: [
        { path: "/trunks/outbound", tag: "Outbound", title: "Your stack calls the world", body: "Send calls from LiveKit, a PBX or your own SIP client to any Indian number, with a TryVox caller ID.", points: ["Credentials per trunk", "Channel limits you set", "Caller ID from your numbers"] },
        { path: "/trunks/inbound", tag: "Inbound", title: "Calls ring your stack", body: "Calls to your TryVox numbers are delivered to your SIP URI, with the call details your agent needs.", points: ["Route by number", "IP allow-lists", "Same events as every call"] },
      ],
    },
    feat: {
      heading: "Everything agents need from a trunk.", lead: "The controls you'd expect, without a carrier contract.",
      groups: [
        ["Network", "Built for live audio", ["India region", "Inbound and outbound", "Any standards-based SIP client", "Bring Your Own Carrier"]],
        ["Security", "Only traffic you trust", ["Credentials per trunk", "IP allow-lists", "Rotate without dropping calls", "Signed webhooks"]],
        ["Live calls", "Capacity and visibility", ["Channel limits per trunk", "Call records and recordings", "Status webhooks", "Per-minute billing"]],
      ],
    },
    faq: [
      ["What is SIP trunking?", "A SIP trunk carries phone calls over the internet between the public phone network and your systems, such as a voice agent, LiveKit or a PBX."],
      ["Can I use TryVox SIP trunks with LiveKit?", "Yes. Point LiveKit or any standards-based SIP client at your TryVox trunk and it can place and receive calls on your numbers."],
      ["Can I bring my own carrier?", "Yes. With Bring Your Own Carrier you keep your carrier and still get TryVox call events and controls."],
      ["How are trunks secured?", "Each trunk has its own credentials and an IP allow-list. You can rotate credentials without dropping calls."],
    ],
  },

  webrtc: {
    name: "WebRTC",
    title: "WebRTC Voice API for Browser Calling and AI-to-Human Handoff | TryVox",
    description: "Make and take phone calls from a browser tab or mobile app, and hand an AI agent's live call to a person with context. Same numbers, call records and account as TryVox voice.",
    label: "WebRTC", meta: "Browser · App · Handoff",
    chip: "Nothing to install",
    h1: "A phone line in [every browser tab].",
    lead: "Call any number with a real caller ID, ring a tab on inbound calls, and move a live AI call to a person without the caller noticing.",
    stats: [["Install", "Nothing"], ["Handoff", "AI → person"], ["Records", "Same as voice"]],
    visual: {
      kind: "seq", path: "webrtc.handoff", right: "Warm transfer", cols: ["Caller", "AI agent", "Your team"],
      rows: [["a", "lr", "call answered"], ["a", "rl", "agent speaks"], ["b", "lr", "transfer + context"], ["b", "rl", "accepted", true], ["ab", "lr", "caller ↔ person"]],
      foot: ["Encrypted media", "Context passed"],
    },
    two: {
      label: "Two jobs", heading: "Calls in the browser, and a person when it matters.", lead: "Use WebRTC as a softphone for your team, or as the handover point for your agent.",
      items: [
        { path: "/webrtc/endpoints", tag: "Endpoints", title: "One login per person", body: "Create an endpoint for each person or device. They call out with a real caller ID and receive calls in the tab.", points: ["Create from the dashboard or API", "Credentials per endpoint", "Revoke instantly"] },
        { path: "/webrtc/handoff", tag: "AI to human", title: "The caller stays, a person picks up", body: "Transfer a live AI call to a browser endpoint and pass along what the agent already covered.", points: ["Warm transfer on a live call", "Context passed with the call", "Hand back to the agent"] },
      ],
    },
    feat: {
      heading: "Same numbers, same records.", lead: "Browser calls are ordinary TryVox calls, so everything else keeps working.",
      groups: [
        ["Calling", "Both directions", ["Outbound with a real caller ID", "Inbound rings in the browser", "Mobile apps too", "Indian numbers"]],
        ["Security", "Private by default", ["Encrypted media", "Encrypted signalling", "Credentials per endpoint", "Revoke any time"]],
        ["Records", "Nothing separate", ["Same call records", "Same webhooks", "Same recordings", "Same bill"]],
      ],
    },
    faq: [
      ["What is WebRTC calling?", "WebRTC lets a browser or mobile app send and receive live audio. TryVox connects that audio to the phone network, so a browser tab can call and receive real phone numbers."],
      ["Do callers need to install anything?", "No. People call your TryVox numbers as usual. Your team answers in the browser."],
      ["Can an AI agent hand a call to a person?", "Yes. Transfer the live call to a browser endpoint and pass context with it, so the person knows what the agent already covered."],
      ["Is browser call audio encrypted?", "Yes. Media and signalling between the browser and TryVox are encrypted."],
    ],
  },

  "ai-agents": {
    name: "Agent Connect",
    title: "Connect Vapi, Retell, ElevenLabs, LiveKit and Bolna to Indian Numbers | TryVox",
    description: "Bind an Indian phone number to your Vapi, Retell, ElevenLabs, LiveKit or Bolna voice agent in a few clicks. No SIP configuration or deployment needed.",
    label: "Agent connect", meta: "5 providers · No SIP",
    chip: "Vapi · Retell · ElevenLabs · LiveKit · Bolna",
    h1: "Bind a number to your agent [in a few clicks].",
    lead: "Pick your provider, choose a TryVox number and an agent, and confirm. Your agent answers calls on that number straight away, with no SIP setup.",
    stats: [["Providers", "5"], ["Setup", "No SIP"], ["Routing", "1 number : 1 agent"]],
    visual: {
      kind: "kv", path: "/ai-agents/bindings", right: "Bound",
      rows: [["Provider", "Vapi"], ["Number", "+91 80 4718 2290"], ["Agent", "support-agent"], ["X-TryVox-Route", "ai-agent"], ["Direction", "Inbound"]],
      foot: ["Switch providers any time", "Number stays the same"],
    },
    two: {
      label: "What you get", heading: "Keep your platform. Get a real line.", lead: "TryVox never builds agents, so it never competes with the platform you chose.",
      items: [
        { path: "/ai-agents/bind", tag: "Bind", title: "One number, one agent", body: "Each number binds to one agent at a time. Remove the binding and the number falls back to its normal route.", points: ["Bind from the dashboard", "Switch providers, keep the number", "Don't also set it inbound in your provider"] },
        { path: "/ai-agents/context", tag: "Context", title: "Every call arrives with context", body: "Your agent receives SIP headers with the direction, route, caller and called number, so it knows who is on the line.", points: ["X-TryVox-Direction and Route", "X-TryVox-From and To", "Same call records as every call"] },
      ],
    },
    feat: {
      heading: "What works today.", lead: "We'd rather be clear about this than surprise you later.",
      groups: [
        ["Live", "Inbound calls", ["Bind to any of 5 providers", "No deployment needed", "Context headers on every call", "Webhooks and records"]],
        ["In progress", "Outbound through bindings", ["Agents placing calls via bindings", "Use the Voice API meanwhile", "Or a SIP trunk", "Same numbers either way"]],
        ["Not yet", "Answering machine detection", ["AMD isn't active yet", "Calls still get status events", "Reasons for missed calls", "Retries from Campaign Manager"]],
      ],
    },
    code: { path: "inbound call · SIP headers", tabs: [["Headers", SIP_HEADERS]] },
    faq: [
      ["Which agent platforms work with TryVox?", "Vapi, Retell, ElevenLabs, LiveKit and Bolna. Any other SIP-capable stack works through a SIP trunk."],
      ["Do I need to configure SIP to connect my agent?", "No. Binding a number to an agent needs no deployment or SIP configuration."],
      ["Can my agent make outbound calls through a binding?", "Inbound works today. Outbound calls placed by agents through bindings are in progress. Until then, place outbound calls with the Voice API or a SIP trunk."],
      ["Can I switch providers later?", "Yes. Change the binding to another provider and the number stays the same."],
    ],
  },

  "voice-api": {
    name: "Voice API",
    title: "Programmable Voice API and VoxML for India | TryVox",
    description: "Place and control calls with one REST API. Webhooks at every stage, recordings, conferences and VoxML call flows for AI voice agents in India.",
    label: "Voice API", meta: "REST · VoxML · Webhooks",
    chip: "api.tryvox.io · HTTP Basic auth",
    h1: "One request [starts the call].",
    lead: "Place and control calls with one REST API. Get a webhook at every stage, record calls, run conferences and build call flows with VoxML.",
    stats: [["Auth", "Basic"], ["Events", "Every stage"], ["Flows", "VoxML"]],
    visual: {
      kind: "seq", path: "voice-api.call", right: "Outbound", cols: ["Your app", "TryVox", "Phone"],
      rows: [["a", "lr", "POST /calls"], ["a", "rl", "201 queued", true], ["b", "lr", "dial"], ["a", "rl", "answer_url"], ["ab", "lr", "VoxML <Stream>"]],
      foot: ["ring_timeout 30", "time_limit 3600"],
    },
    two: {
      label: "Two halves", heading: "Start the call, then steer it.", lead: "A REST call starts it. Webhooks and VoxML decide what happens next.",
      items: [
        { path: "/v1/voice/accounts/{id}/calls", tag: "Calls API", title: "Place and control calls", body: "One POST with from, to and answer_url places a call. Set ring_timeout and time_limit per call, or send many at once.", points: ["HTTP Basic auth with Auth ID and Token", "ring_timeout and time_limit", "Bulk calls on the same endpoint"] },
        { path: "answer_url → VoxML", tag: "VoxML", title: "Build the call flow", body: "When the call is answered, TryVox fetches your answer_url and runs the VoxML it returns.", points: ["Say, Play and Gather for menus", "Dial and Conference to bring people in", "Stream live audio to your agent"] },
      ],
    },
    feat: {
      heading: "Every stage, in your system.", lead: "Nothing happens on a call without your server hearing about it.",
      groups: [
        ["Webhooks", "Events you can trust", ["ring_url and answer_url", "hangup_url", "status_callback_url", "Signed with webhook_secret"]],
        ["Media", "Live audio and records", ["Stream to a WebSocket", "Record calls", "Conferences", "Play audio files"]],
        ["Control", "Change a live call", ["Transfer", "Hang up", "Time limits", "Ring timeouts"]],
      ],
    },
    code: { path: "POST /v1/voice/accounts/{auth_id}/calls", tabs: [["cURL", CALL_CURL], ["Node", CALL_NODE], ["Python", CALL_PY]] },
    faq: [
      ["How do I authenticate?", "HTTP Basic auth. Your Auth ID is the username and your Auth Token is the password. Both are in the dashboard."],
      ["What does answer_url need to return?", "VoxML. TryVox calls answer_url when the call is answered and runs the VoxML verbs you return, such as Say, Gather, Dial, Stream, Record and Conference."],
      ["Which webhooks are there?", "ring_url, answer_url, hangup_url and status_callback_url, signed with your webhook_secret."],
      ["Can I stream call audio to my own agent?", "Yes. Use the Stream verb in VoxML to send live call audio to your WebSocket."],
    ],
  },

  whatsapp: {
    name: "WhatsApp",
    title: "WhatsApp Business API and WhatsApp Calling for Voice AI | TryVox",
    description: "Send WhatsApp templates and replies, receive messages as webhooks, and take WhatsApp voice calls on the same TryVox account as your phone numbers and AI calls.",
    label: "WhatsApp", meta: "Messages + calls",
    chip: "Same account as your numbers",
    h1: "The follow-up lands [while it's fresh].",
    lead: "Send approved templates and replies, get every inbound message and delivery status as a webhook, and take WhatsApp calls on the account that runs your voice agent.",
    stats: [["Channels", "Msg + calls"], ["Events", "Every status"], ["Account", "Shared"]],
    visual: {
      kind: "seq", path: "whatsapp.follow-up", right: "After the call", cols: ["Agent", "TryVox", "Customer"],
      rows: [["a", "lr", "call completed"], ["a", "lr", "send template"], ["b", "lr", "delivery slot"], ["b", "rl", "read", true], ["b", "rl", "reply → webhook"]],
      foot: ["Templates approved", "24-hour window"],
    },
    two: {
      label: "Two directions", heading: "Message them, or let them call you.", lead: "WhatsApp messaging and WhatsApp calling on one business number.",
      items: [
        { path: "/whatsapp/messages", tag: "Messages", title: "Confirm, remind and share links", body: "Trigger a message on the call outcome: a delivery slot, a payment link or a document, sent from an approved template.", points: ["Template or free-form reply", "Links, media and documents", "Delivery and read events"] },
        { path: "/whatsapp/calls", tag: "Calling", title: "Customers call you on WhatsApp", body: "Take WhatsApp voice calls and route them to your agent or to a person, with the same call events as phone calls.", points: ["Inbound WhatsApp calls", "Route to an agent or a person", "Call events as webhooks"] },
      ],
    },
    feat: {
      heading: "Run WhatsApp next to voice.", lead: "No second vendor, no second bill.",
      groups: [
        ["Templates", "Approved before you send", ["Marketing, utility and auth", "Approval status at a glance", "Reuse across campaigns", "Free-form inside 24 hours"]],
        ["Events", "Everything as a webhook", ["Inbound messages", "Sent, delivered, read", "Button replies", "Call events"]],
        ["Account", "Shared with voice", ["Same API key", "Same dashboard", "Same bill", "Same compliance records"]],
      ],
    },
    faq: [
      ["Can I send a WhatsApp message after an AI call?", "Yes. WhatsApp runs on the same account as your numbers, so the flow that handled the call can send the follow-up."],
      ["Does TryVox support WhatsApp calling?", "Yes. Take WhatsApp voice calls and route them to your agent or your team."],
      ["Do I need templates?", "To start a conversation, yes. WhatsApp requires an approved template. Within 24 hours of the customer's last message you can reply free-form."],
      ["Do I need a separate account?", "No. Voice and WhatsApp share one account, one API key and one bill."],
    ],
  },

  "sms-rcs": {
    name: "SMS & RCS",
    title: "DLT SMS and RCS Business Messaging for Voice AI in India | TryVox",
    description: "Send DLT-ready SMS and rich RCS messages with buttons from the same TryVox account as your AI calls. Automatic fallback to SMS, delivery and read events.",
    label: "SMS & RCS", meta: "DLT-ready · Fallback",
    chip: "DLT entity, headers and templates linked",
    h1: "Plain or rich, [every phone gets it].",
    lead: "Send OTPs, reminders and links over DLT-ready SMS, or rich RCS messages with buttons that fall back to SMS when a phone can't show them.",
    stats: [["Channels", "SMS + RCS"], ["Compliance", "DLT"], ["Fallback", "Automatic"]],
    visual: {
      kind: "seq", path: "message.send", right: "RCS → SMS", cols: ["Your app", "TryVox", "Phone"],
      rows: [["a", "lr", "send message"], ["b", "lr", "RCS check"], ["b", "rl", "not supported"], ["b", "lr", "SMS (DLT)"], ["b", "rl", "delivered", true]],
      foot: ["One request", "Either channel"],
    },
    two: {
      label: "Two formats", heading: "Text for every phone, rich where it works.", lead: "Pick one request. TryVox picks the channel the phone can show.",
      items: [
        { path: "/sms", tag: "DLT SMS", title: "SMS that's delivered, not blocked", body: "Link your DLT entity, headers and templates once. OTPs, alerts and reminders then go out under India's rules.", points: ["DLT entity, headers, templates", "OTPs, alerts and reminders", "Delivery status per message"] },
        { path: "/rcs", tag: "RCS", title: "Messages people can tap", body: "Images, cards and buttons with read receipts, on phones that support RCS, and SMS for the rest.", points: ["Images, cards and buttons", "Read receipts", "Button taps as events"] },
      ],
    },
    feat: {
      heading: "Messages your agent can send mid-call.", lead: "The backend that handles the call can text a link while the caller is still on the line.",
      groups: [
        ["During the call", "Send a link now", ["Payment links", "Booking links", "OTPs", "Addresses"]],
        ["Delivery", "Know it arrived", ["Capability check first", "Automatic SMS fallback", "Delivery and read events", "Button taps"]],
        ["Account", "Next to voice", ["Same account", "Same bill", "Same DLT records", "Same webhooks"]],
      ],
    },
    faq: [
      ["Is TryVox SMS DLT-compliant?", "Yes. Link your DLT entity, headers and templates, and messages go out under India's DLT rules."],
      ["What is RCS?", "RCS is the rich version of SMS. Messages can carry images, cards and buttons and show read receipts, on phones that support it."],
      ["What if a phone can't receive RCS?", "TryVox sends the message as SMS instead, automatically."],
      ["Can my agent send a text during a call?", "Yes. The same backend that handles the call can send an SMS or RCS message mid-conversation, such as a payment or booking link."],
    ],
  },

  "campaign-manager": {
    name: "Smart Campaign Manager",
    title: "Smart Campaign Manager for AI Outbound Calling in India | TryVox",
    description: "Plan, run and review AI outbound calling campaigns on TryVox. Pre-launch checks, number health rules that rest or replace failing numbers, and a reason for every missed call.",
    label: "Campaign manager", meta: "Before · During · After",
    chip: "Works with any agent platform",
    h1: "Outbound campaigns that [keep their answer rate].",
    lead: "Campaign Manager checks your list and numbers before launch, watches every number while it runs, and explains every call that didn't connect.",
    stats: [["Before", "Checked"], ["During", "Watched"], ["After", "Explained"]],
    visual: {
      kind: "kv", path: "/campaigns/emi-reminders-nov", right: "Running",
      rows: [["Contacts", "Consent checked"], ["Duplicates", "Removed"], ["Calling hours", "09:00–21:00"], ["Numbers", "3 active · 1 resting"], ["Missed calls", "Reason on each"]],
      foot: ["Pace shown before launch", "Retry list in one click"],
    },
    two: {
      label: "Plan and review", heading: "Approve the plan, then read the result.", lead: "Your agent handles the conversation. Campaign Manager handles who is dialled, when and from which number.",
      items: [
        { path: "/campaigns/new", tag: "Before you dial", title: "A plan you approve", body: "Start from a preset for reminders, collections, lead follow-up or surveys. See the pace and the finish time before anything dials.", points: ["Presets for common campaigns", "Consent and duplicate checks", "Pace and finish time"] },
        { path: "/campaigns/report", tag: "After it ends", title: "Every missed call has a reason", body: "No answer, busy, rejected or rested number. Each call shows what happened and what was already done about it.", points: ["Reasons per call", "Actions already taken", "Retry lists in one click"] },
      ],
    },
    feat: {
      heading: "While it runs.", lead: "Failing numbers step aside before they drag the whole campaign down.",
      groups: [
        ["Numbers", "Health rules", ["Healthiest numbers first", "Rest at daily limits", "Replace from a backup pool", "Rules you can change"]],
        ["Rules", "India's calling rules", ["Calling hours", "Consent checks", "Right number series", "Withdrawals respected"]],
        ["Agents", "Any platform", ["Vapi, Retell, ElevenLabs", "LiveKit and Bolna", "Or your own code", "Webhooks per call"]],
      ],
    },
    faq: [
      ["What does Smart Campaign Manager do?", "It runs AI outbound calling campaigns on TryVox. It checks your list and numbers before launch, watches every number while the campaign runs, and explains every call that didn't connect."],
      ["Does it work with my agent platform?", "Yes. Your agent takes the calls. Campaign Manager decides who is dialled, when and from which number."],
      ["How does it protect answer rates?", "It dials from your healthiest numbers first and rests or replaces numbers that carriers start rejecting, using the same rules as Number Reputation."],
      ["Does it follow India's calling rules?", "Campaigns apply calling hours, consent checks and the right number series for the type of call."],
    ],
  },
};
