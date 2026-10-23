/* One logo component for every integration spot on the site.
   Wordmarks are sized by their proportions so a long mark (ElevenLabs) and a compact one (AWS) read
   at the same visual weight. Brands without a usable wordmark, and non-brand capabilities, render
   as a mark + name lockup built the same way. Dark ink flips to light on dark surfaces.
   Logo sources: SVG Logos (CC0), Simple Icons (CC0), bolna.ai. Trademarks belong to their owners. */
import type { CSSProperties } from "react";
import { ICONS } from "@/content/icons";

type Word = { kind: "word"; name: string; src: string; ratio: number; ink?: boolean; srcOnDark?: string; boost?: number };
type Lock = { kind: "lock"; name: string; label: string; mark?: string; markRatio?: number; icon?: string; ink?: boolean };
type Logo = Word | Lock;

const L = (f: string) => `/assets/logos/${f}`;

export const BRAND_LOGOS: Record<string, Logo> = {
  vapi: { kind: "word", name: "Vapi", src: L("vapi.svg"), ratio: 3.12, ink: true },
  retell: { kind: "word", name: "Retell AI", src: L("retell.svg"), ratio: 3.58, ink: true },
  livekit: { kind: "word", name: "LiveKit", src: L("livekit.svg"), ratio: 4.34, ink: true },
  bolna: { kind: "word", name: "Bolna", src: L("bolna.svg"), srcOnDark: L("bolna-on-dark.svg"), ratio: 1.57, boost: 1.55 },
  elevenlabs: { kind: "word", name: "ElevenLabs", src: L("elevenlabs.svg"), ratio: 7.64, ink: true },
  deepgram: { kind: "word", name: "Deepgram", src: L("deepgram.svg"), ratio: 5.17, ink: true },
  "amazon-polly": { kind: "lock", name: "Amazon Polly", label: "Polly", mark: L("aws.svg"), markRatio: 1.67, ink: true },
  asterisk: { kind: "lock", name: "Asterisk", label: "Asterisk", mark: L("asterisk.svg"), markRatio: 1 },
  whatsapp: { kind: "lock", name: "WhatsApp", label: "WhatsApp", mark: L("whatsapp.svg"), markRatio: 0.99 },
  webhooks: { kind: "lock", name: "Webhooks", label: "Webhooks", mark: L("webhooks.svg"), markRatio: 1.07 },
  freeswitch: { kind: "lock", name: "FreeSWITCH", label: "FreeSWITCH", icon: "sip" },
  "any-sip-pbx": { kind: "lock", name: "Any SIP PBX", label: "Any SIP PBX", icon: "sip" },
  "sip-byoc": { kind: "lock", name: "SIP / BYOC", label: "SIP / BYOC", icon: "globe" },
  "sip-trunks": { kind: "lock", name: "SIP trunks", label: "SIP trunks", icon: "sip" },
  "dlt-sms": { kind: "lock", name: "DLT SMS", label: "DLT SMS", icon: "mail" },
  "toll-free": { kind: "lock", name: "Toll-free numbers", label: "Toll-free", icon: "phone" },
  "local-numbers": { kind: "lock", name: "Local numbers", label: "Local numbers", icon: "phone" },
  voxml: { kind: "lock", name: "VoxML", label: "VoxML", icon: "flow" },
  "rest-api": { kind: "lock", name: "REST API", label: "REST API", icon: "code" },
  recordings: { kind: "lock", name: "Recordings", label: "Recordings", icon: "rec" },
  "signed-callbacks": { kind: "lock", name: "Signed callbacks", label: "Signed callbacks", icon: "shield" },
  "your-code": { kind: "lock", name: "Your own code", label: "Your code", icon: "code" },
};

/** Optical height for a wordmark: equal visual area, clamped so very wide marks stay legible. */
const wordHeight = (h: number, ratio: number, boost = 1) => Math.round(h * Math.min(1.3, Math.max(0.62, Math.sqrt(2.6 / ratio))) * boost);

export function BrandLogo({ id, size = 24, onDark = false, className }: { id: string; size?: number; onDark?: boolean; className?: string }) {
  const d = BRAND_LOGOS[id];
  if (!d) return <span className="blogo blogo-lock">{id}</span>;
  const cls = `blogo${d.ink ? " ink" : ""}${onDark ? " on-dark" : ""}${className ? " " + className : ""}`;
  if (d.kind === "word") {
    const h = wordHeight(size, d.ratio, d.boost);
    const src = onDark && d.srcOnDark ? d.srcOnDark : d.src;
    return (
      <span className={`${cls} blogo-word${d.srcOnDark && !onDark ? " has-dark" : ""}`} style={{ "--bh": `${h}px` } as CSSProperties}>
        <img src={src} alt={d.name} width={Math.round(h * d.ratio)} height={h} loading="lazy" decoding="async" />
        {d.srcOnDark && !onDark && <img className="dk" src={d.srcOnDark} alt="" aria-hidden="true" width={Math.round(h * d.ratio)} height={h} loading="lazy" decoding="async" />}
      </span>
    );
  }
  const mh = Math.round(size * 0.92);
  return (
    <span className={`${cls} blogo-lock`} style={{ "--bs": `${size}px` } as CSSProperties} role="img" aria-label={d.name}>
      {d.mark ? (
        <img className="mk" src={d.mark} alt="" width={Math.round(mh * (d.markRatio || 1))} height={mh} loading="lazy" decoding="async" />
      ) : (
        <span className="ic-mk" aria-hidden="true">{ICONS[d.icon || "phone"]}</span>
      )}
      <span className="lb" aria-hidden="true">{d.label}</span>
    </span>
  );
}
