/* Site-wide constants and navigation data. Every page, the sitemap and llms.txt read from here. */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://tryvoxinternal.vercel.app").replace(/\/$/, "");
export const SITE_NAME = "TryVox";
export const APP = "https://app.tryvox.io/";
export const DOCS = "https://docs.tryvox.io";
export const EMAIL = "team@tryvox.io";
export const COMPANY = "Tryjolt Solutions Pvt Ltd";
export const TAGLINE = "Telephony infrastructure for voice AI";
export const ONE_LINER =
  "TryVox is telephony infrastructure for voice AI. It gives AI voice agents Indian phone numbers, SIP trunking, a programmable Voice API, WhatsApp and DLT SMS, with KYC, consent and DLT compliance built in. TryVox does not build AI agents; it connects the agent you already use (Vapi, Retell, ElevenLabs, LiveKit, Bolna or your own code) to the real phone network.";

export type NavItem = { slug: string; name: string; icon: string; desc: string };

export const PRODUCTS: NavItem[] = [
  { slug: "phone-numbers", name: "Phone Numbers", icon: "phone", desc: "Local, national and toll-free numbers with KYC." },
  { slug: "sip-trunking", name: "SIP Trunking", icon: "sip", desc: "Trunks, credentials and channel limits." },
  { slug: "voice-api", name: "Voice API", icon: "wave", desc: "Calls, conferences and VoxML call flows." },
  { slug: "ai-agents", name: "AI Agents", icon: "bot", desc: "Bind a number to Vapi, Retell, LiveKit or Bolna." },
  { slug: "messaging", name: "Messaging", icon: "chat", desc: "WhatsApp and SMS on the same account." },
  { slug: "compliance", name: "Compliance", icon: "shield", desc: "Consent, DLT and verified caller IDs." },
];

export const SOLUTIONS: NavItem[] = [
  { slug: "financial-services", name: "Financial services", icon: "rupee", desc: "Collections, reminders, KYC follow-ups." },
  { slug: "healthcare", name: "Healthcare", icon: "heart", desc: "Appointments and patient reminders." },
  { slug: "ecommerce", name: "E-commerce", icon: "cart", desc: "COD confirmation and order support." },
  { slug: "logistics", name: "Logistics", icon: "truck", desc: "Delivery slots and masked calling." },
  { slug: "real-estate", name: "Real estate", icon: "home", desc: "Instant callbacks on new leads." },
  { slug: "travel-hospitality", name: "Travel & hospitality", icon: "plane", desc: "24/7 booking and guest lines." },
];

export const LOGOIMG: Record<string, [string, number]> = {
  vapi: ["Vapi", 55],
  retell: ["Retell AI", 65],
  livekit: ["LiveKit", 18],
  bolna: ["Bolna", 28],
};

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
  ["Agent platforms", ["vapi", "retell", "livekit", "bolna", "ElevenLabs"]],
  ["Voice stack", ["Deepgram", "Amazon Polly", "Asterisk", "FreeSWITCH", "Any SIP PBX"]],
  ["Channels", ["WhatsApp", "DLT SMS", "Toll-free", "Local numbers", "SIP trunks"]],
  ["Developer tools", ["Webhooks", "VoxML", "REST API", "Recordings", "Signed callbacks"]],
];

export type QA = [string, string];
