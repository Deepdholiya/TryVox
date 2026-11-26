/* Site-wide constants and navigation data. Every page, the sitemap and llms.txt read from here. */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://tryvoxinternal.vercel.app").replace(/\/$/, "");
export const SITE_NAME = "TryVox";
export const APP = "https://app.tryvox.io/";
export const DOCS = "https://docs.tryvox.io";
export const EMAIL = "team@tryvox.io";
export const COMPANY = "Tryjolt Solutions Pvt Ltd";
export const TAGLINE = "Telephony infrastructure for voice AI";
export const ONE_LINER =
  "TryVox is telephony infrastructure for voice AI. It gives AI voice agents Indian phone numbers, SIP trunking, a programmable Voice API, WebRTC, WhatsApp, SMS and RCS, outbound campaign tooling and number reputation management, with KYC, consent and DLT compliance built in. TryVox does not build AI agents; it connects the agent you already use (Vapi, Retell, ElevenLabs, LiveKit, Bolna or your own code) to the real phone network.";

export type NavItem = { slug: string; name: string; icon: string; desc: string; group?: string };

/** Products, grouped by the stage of a call they serve. The header mega menu, footer, sitemap and llms.txt read this list. */
export const STAGES: { id: string; label: string; note: string }[] = [
  { id: "reach", label: "Reach", note: "Before the call" },
  { id: "connect", label: "Connect", note: "The call path" },
  { id: "control", label: "Control", note: "During the call" },
  { id: "engage", label: "Engage", note: "Around the call" },
];

export const PRODUCTS: NavItem[] = [
  { slug: "phone-numbers", name: "Phone Numbers", icon: "phone", group: "reach", desc: "Local, national, toll-free and 140/160 series numbers." },
  { slug: "number-reputation", name: "Number Reputation", icon: "eye", group: "reach", desc: "Keep caller IDs trusted and off spam lists." },
  { slug: "compliance", name: "Compliance", icon: "shield", group: "reach", desc: "KYC, consent, DLT and verified caller IDs." },
  { slug: "sip-trunking", name: "SIP Trunking", icon: "sip", group: "connect", desc: "Trunks, credentials, failover and BYOC." },
  { slug: "webrtc", name: "WebRTC", icon: "globe", group: "connect", desc: "Calls from a browser tab or app." },
  { slug: "ai-agents", name: "Agent Connect", icon: "bot", group: "connect", desc: "Bind a number to Vapi, Retell, LiveKit or Bolna." },
  { slug: "voice-api", name: "Voice API", icon: "wave", group: "control", desc: "Call control, VoxML and live audio streams." },
  { slug: "whatsapp", name: "WhatsApp", icon: "chat", group: "engage", desc: "WhatsApp messages and calls on one account." },
  { slug: "sms-rcs", name: "SMS & RCS", icon: "mail", group: "engage", desc: "DLT-ready SMS and rich RCS messages." },
  { slug: "campaign-manager", name: "Smart Campaign Manager", icon: "flow", group: "engage", desc: "Outbound campaigns that keep their answer rate." },
];

export const SOLUTIONS: NavItem[] = [
  { slug: "financial-services", name: "Financial services", icon: "rupee", desc: "Collections, reminders, KYC follow-ups." },
  { slug: "healthcare", name: "Healthcare", icon: "heart", desc: "Appointments and patient reminders." },
  { slug: "ecommerce", name: "E-commerce", icon: "cart", desc: "COD confirmation and order support." },
  { slug: "logistics", name: "Logistics", icon: "truck", desc: "Delivery slots and masked calling." },
  { slug: "real-estate", name: "Real estate", icon: "home", desc: "Instant callbacks on new leads." },
  { slug: "travel-hospitality", name: "Travel & hospitality", icon: "plane", desc: "24/7 booking and guest lines." },
];


export const THF = [
  "call_8f2a19 · ringing",
  "201 · status: queued",
  "+91 80 4718 2290",
  "KYC · verified",
  "X-TryVox-Route: ai-agent",
  "consent · recorded",
  "answer_url · VoxML",
  "whatsapp · read",
];

export const IG: [string, string[]][] = [
  ["Agent platforms", ["vapi", "retell", "livekit", "bolna", "elevenlabs"]],
  ["Voice stack", ["deepgram", "amazon-polly", "asterisk", "freeswitch", "any-sip-pbx"]],
  ["Channels", ["whatsapp", "dlt-sms", "toll-free", "local-numbers", "sip-trunks"]],
  ["Developer tools", ["webhooks", "voxml", "rest-api", "recordings", "signed-callbacks"]],
];

export type QA = [string, string];
