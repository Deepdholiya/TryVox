/* Builds llms.txt (index) and llms-full.txt (all page content as Markdown) from the same content the pages render. */
import { PRODUCT_PAGES } from "@/content/products";
import { SOLUTION_PAGES } from "@/content/solutions";
import { APP, DOCS, EMAIL, ONE_LINER, PRODUCTS, SITE_URL, SOLUTIONS } from "@/content/site";
import { text } from "./text";

const KEY_FACTS = [
  "TryVox is infrastructure only. It does not build or sell AI voice agents, so it never competes with the agent platforms and builders that use it.",
  "Works with Vapi, Retell, ElevenLabs, LiveKit and Bolna, plus any standards-based SIP stack (Asterisk, FreeSWITCH, PBX).",
  "Indian local, national and toll-free numbers, with business KYC done online.",
  "Compliance built in: business KYC, consent records, DLT registration for SMS, verified caller IDs and signed webhooks.",
  "Voice API: REST at api.tryvox.io with HTTP Basic auth (Auth ID + Auth Token), webhooks for ring, answer, status and hangup, and VoxML call flows (Say, Gather, Dial, Stream, Record, Conference).",
  "Messaging: WhatsApp messages, WhatsApp calling and DLT-ready SMS on the same account as voice.",
  "Pricing: one-time ₹100 setup fee, ₹399 monthly rent, calls billed per minute on one account. No lock-in. Volume rate cards on request.",
  "Platform: under 200 ms response time, 99.9% platform uptime, 24/7.",
  "Current limits: outbound calls placed by AI agents through bindings are still in progress (inbound works today); answering machine detection is not yet active.",
  "Built in India by Tryjolt Solutions Pvt Ltd.",
];

export function llmsIndex() {
  const l = [
    "# TryVox",
    "",
    `> ${ONE_LINER}`,
    "",
    "## Key facts",
    ...KEY_FACTS.map((f) => `- ${f}`),
    "",
    "## Products",
    ...PRODUCTS.map((p) => `- [${p.name}](${SITE_URL}/products/${p.slug}/): ${PRODUCT_PAGES[p.slug].description}`),
    "",
    "## Solutions by industry",
    ...SOLUTIONS.map((s) => `- [${s.name}](${SITE_URL}/solutions/${s.slug}/): ${SOLUTION_PAGES[s.slug].description}`),
    "",
    "## Company and pricing",
    `- [Pricing](${SITE_URL}/pricing/): ₹100 setup, ₹399 a month, calls billed per minute. No lock-in.`,
    `- [Integrations](${SITE_URL}/integrations/): Vapi, Retell, ElevenLabs, LiveKit, Bolna and any SIP stack.`,
    `- [Developers](${SITE_URL}/developers/): Quickstart, code samples and webhooks.`,
    `- [About](${SITE_URL}/about/): Why TryVox exists and how it works.`,
    `- [Contact](${SITE_URL}/contact/): Sales, rate cards and demos. Email ${EMAIL}.`,
    "",
    "## Optional",
    `- [Full site content](${SITE_URL}/llms-full.txt): every page as plain Markdown.`,
    `- [API documentation](${DOCS}/): reference for numbers, calls, VoxML, SIP trunking and AI agents.`,
    `- [Dashboard](${APP}): sign up and start free.`,
  ];
  return l.join("\n") + "\n";
}

const faqMd = (faq: [string, string][]) => ["### FAQ", ...faq.flatMap(([q, a]) => [`**${q}**`, a, ""])];

export function llmsFull() {
  const out: string[] = [llmsIndex(), "---", ""];
  for (const p of PRODUCTS) {
    const d = PRODUCT_PAGES[p.slug];
    out.push(`## Product: ${d.name}`, `URL: ${SITE_URL}/products/${p.slug}/`, "", `# ${text(d.h1)}`, d.sub, "", d.story.join(" "), "");
    out.push("### How it fits together", ...d.layers.map((x, i) => `- ${x}: ${d.layerNotes[i]}`), "");
    for (const pn of d.panels) out.push(`### ${pn.tag}: ${text(pn.heading)}`, pn.body, ...pn.points.map((x) => `- ${x}`), "");
    out.push(...faqMd(d.faq), "---", "");
  }
  for (const s of SOLUTIONS) {
    const d = SOLUTION_PAGES[s.slug];
    out.push(`## Solution: ${d.name}`, `URL: ${SITE_URL}/solutions/${s.slug}/`, "", `# ${d.h1Text}`, d.sub, "");
    out.push(`### The challenge: ${text(d.challenge)}`, ...d.pains.map(([t, x]) => `- ${t}: ${x}`), "");
    out.push("### Use cases", ...d.uses.map((u) => `- ${u.tag}: ${text(u.heading)} ${u.body}`), "");
    out.push("### Example call flow", ...d.flow.map(([k, v], i) => `${i + 1}. ${k}: ${v}. ${text(d.did[i] ?? "")}`), `Outcome: ${text(d.result)}`, "");
    out.push(`Products used: ${d.products.map((x) => PRODUCTS.find((p) => p.slug === x)?.name).join(", ")}`, "", ...faqMd(d.faq), "---", "");
  }
  return out.join("\n") + "\n";
}
