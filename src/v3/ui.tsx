/* v3 building blocks. Server components that render to static HTML. */
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { ICONS } from "@/content/icons";
import { APP, SITE_URL } from "@/content/site";

export const Arrow = () => (
  <span className="ar" aria-hidden="true">
    →
  </span>
);

export function Ic({ name }: { name: string }) {
  return <span className="ic">{ICONS[name]}</span>;
}

/** Numbered label row: 01 —— NAME ------------- META */
export function Lbl({ n, children, meta }: { n?: string; children: ReactNode; meta?: ReactNode }) {
  return (
    <p className="lbl">
      {n && <span className="lbl-n">{n}</span>}
      {n && <span className="lbl-d" aria-hidden="true" />}
      <span>{children}</span>
      <span className="lbl-f" aria-hidden="true" />
      {meta && <span className="lbl-m">{meta}</span>}
    </p>
  );
}

/** Section heading: label row, h2, optional lead. `split` puts the lead to the right of the heading. */
export function SecHead({ n, label, meta, id, children, lead, split }: { n?: string; label: string; meta?: ReactNode; id: string; children: ReactNode; lead?: ReactNode; split?: boolean }) {
  return (
    <div className={split ? "sec-h split" : "sec-h"}>
      <Lbl n={n} meta={meta}>
        {label}
      </Lbl>
      <h2 className="h2" id={id}>
        {children}
      </h2>
      {lead && <p className="lead">{lead}</p>}
    </div>
  );
}

export function Sec({ id, children, className = "" }: { id: string; children: ReactNode; className?: string }) {
  return (
    <section className={`sec ${className}`} aria-labelledby={id}>
      <div className="wrap">{children}</div>
    </section>
  );
}

/** Bordered panel with a mono path bar. */
export function Panel({ path, right, ok, children, foot, className = "", label }: { path: string; right?: ReactNode; ok?: boolean; children: ReactNode; foot?: ReactNode; className?: string; label?: string }) {
  return (
    <div className={`pn ${className}`} role={label ? "group" : undefined} aria-label={label}>
      <div className="pn-bar">
        <span>{path}</span>
        {right && <span className={ok ? "r ok" : "r"}>{right}</span>}
      </div>
      {children}
      {foot && <div className="pn-foot">{foot}</div>}
    </div>
  );
}

export function Ticks({ items, two }: { items: ReactNode[]; two?: boolean }) {
  return (
    <ul className={two ? "ticks two" : "ticks"}>
      {items.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  );
}

export function Stats({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="stats">
      {items.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Btn({ href, children, line, sm }: { href: string; children: ReactNode; line?: boolean; sm?: boolean }) {
  return (
    <a className={`btn${line ? " line" : ""}${sm ? " sm" : ""}`} href={href}>
      {children}
      {!line && <Arrow />}
    </a>
  );
}

/** Breadcrumb row plus BreadcrumbList schema. */
export function Crumbs({ items }: { items: [string, string][] }) {
  const all: [string, string][] = [["Home", "/"], ...items];
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, ...(path ? { item: SITE_URL + path } : {}) })),
  };
  return (
    <nav aria-label="Breadcrumb">
      <ol className="crumbs">
        {all.map(([name, path], i) => (
          <li key={name}>{i === all.length - 1 ? <span aria-current="page">{name}</span> : <a href={path}>{name}</a>}</li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
    </nav>
  );
}

/** Framed hero: dashed rails, corner ticks, label row, two columns. */
export function Hero({ label, meta, crumbs, chip, h1, lead, ctas, note, stats, visual, below }: {
  label: string; meta?: ReactNode; crumbs?: [string, string][]; chip?: ReactNode; h1: ReactNode; lead: ReactNode;
  ctas?: ReactNode; note?: ReactNode; stats?: [string, ReactNode][]; visual?: ReactNode; below?: ReactNode;
}) {
  return (
    <>
    <section className="hero" aria-labelledby="hero-h">
      <div className="wrap">
        <div className="frame">
          {crumbs && <Crumbs items={crumbs} />}
          <Lbl meta={meta}>{label}</Lbl>
          <div className="hero-g" style={visual ? undefined : { gridTemplateColumns: "1fr" }}>
            <div>
              {chip && <p className="chip">{chip}</p>}
              <h1 className="h1" id="hero-h">
                {h1}
              </h1>
              <p className="lead">{lead}</p>
              <div className="btns">
                {ctas ?? (
                  <>
                    <Btn href={APP}>Start free</Btn>
                    <Btn href="/contact/" line>
                      Talk to sales
                    </Btn>
                  </>
                )}
              </div>
              {note && <p className="note" style={{ marginTop: 12 }}>{note}</p>}
              {stats && <Stats items={stats} />}
            </div>
            {visual}
          </div>
        </div>
      </div>
    </section>
    {below && <div className="wrap hero-below">{below}</div>}
    </>
  );
}

export const LOGO_IDS = ["vapi", "retell", "livekit", "elevenlabs", "bolna", "deepgram"];
export function LogoStrip({ ids = LOGO_IDS, caption = "Works with the agent platform you already use" }: { ids?: string[]; caption?: string }) {
  return (
    <div>
      <div className="logos-cap">
        <p className="cap">{caption}</p>
        <a className="cap" href="/integrations/" style={{ color: "var(--ink)" }}>
          All integrations →
        </a>
      </div>
      <ul className="logos" aria-label="Integrations">
        {ids.map((id) => (
          <li key={id}>
            <BrandLogo id={id} size={26} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Faq({ items, n, id = "faq-h", title = "Questions teams ask before they switch" }: { items: [string, string][]; n?: string; id?: string; title?: string }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
  return (
    <Sec id={id}>
      <div className="faq">
        <div>
          <Lbl n={n}>FAQ</Lbl>
          <h2 className="h2" id={id} style={{ marginTop: 32 }}>
            {title}
          </h2>
          <p className="body" style={{ marginTop: 16 }}>
            Something else? Write to <a className="tl" href="mailto:team@tryvox.io">team@tryvox.io</a>
          </p>
        </div>
        <div className="faq-l">
          {items.map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
    </Sec>
  );
}

/** Rows with a check mark, title, text and a right-hand meta label. */
export function Rows({ items }: { items: [string, string, string?][] }) {
  return (
    <ul className="rows">
      {items.map(([t, p, m]) => (
        <li key={t}>
          <span className="ck" aria-hidden="true">
            ✓
          </span>
          <span>
            <b>{t}</b>
            <p>{p}</p>
          </span>
          {m ? <span className="m">{m}</span> : <span />}
        </li>
      ))}
    </ul>
  );
}

/** Indian telecom compliance block, shared by home and product pages. */
export function ComplianceBlock({ n }: { n?: string }) {
  return (
    <Sec id="cmp-h" className="dark">
      <div className="split2">
        <div>
          <Lbl n={n}>Compliance</Lbl>
          <h2 className="h2" id="cmp-h" style={{ marginTop: 32 }}>
            Indian telecom rules, <span className="grad">handled for you.</span>
          </h2>
          <p className="lead" style={{ marginTop: 16 }}>
            KYC, consent and DLT are part of setting up a number, not a project you run on the side. Every record stays on your account if anyone asks.
          </p>
          <div className="btns" style={{ marginTop: 32 }}>
            <a className="tl" href="/products/compliance/">
              How compliance works →
            </a>
          </div>
        </div>
        <Panel path="/account/compliance" right="All checks passing" ok>
          <div className="badges" aria-hidden="true">
            {[
              ["id", "Business KYC"],
              ["doc", "DLT ready"],
              ["key", "Signed hooks"],
              ["shield", "Verified ID"],
            ].map(([i, t]) => (
              <div key={t}>
                {ICONS[i]}
                {t}
              </div>
            ))}
          </div>
          <Rows
            items={[
              ["Business KYC, done online", "Upload your documents once. Numbers go live when the check clears.", "Onboarding"],
              ["Consent kept with every campaign", "Record where each contact's consent came from, next to the calls you make.", "Outbound"],
              ["DLT registration for SMS", "Entity, header and template IDs on file, so messages are delivered.", "Messaging"],
              ["Verified caller ID and signed webhooks", "Your business name on the screen, and events your server can trust.", "Every call"],
            ]}
          />
        </Panel>
      </div>
    </Sec>
  );
}

/** Dark closing band with a terminal. */
export function CtaBand({ title = "Put your agent on a real phone line today.", lead = "Pick a number, finish KYC online and bind it to your agent. Most teams take their first call the same day." }: { title?: string; lead?: string }) {
  return (
    <section className="dk cta-band" aria-labelledby="cta-h">
      <div className="wrap">
        <Lbl meta="Live in India">Get started</Lbl>
        <div className="cta-g">
          <div>
            <h2 className="h2" id="cta-h">
              {title}
            </h2>
            <p className="lead">{lead}</p>
            <div className="btns">
              <Btn href={APP}>Start free</Btn>
              <Btn href="/contact/" line>
                Talk to sales
              </Btn>
            </div>
            <ul className="ticks">
              <li>₹100 one-time setup</li>
              <li>₹399 a month per number</li>
              <li>No lock-in</li>
            </ul>
          </div>
          <Panel path="api.tryvox.io" right="REST · Basic auth">
            <div className="term">
              <pre tabIndex={0} aria-label="Example API request">
                <span className="c"># place a call from your TryVox number</span>
                {"\n"}
                <span className="p">$ </span>curl -u $AUTH_ID:$AUTH_TOKEN \{"\n"}
                {"    "}api.tryvox.io/v1/voice/accounts/$AUTH_ID/calls \{"\n"}
                {"    "}-d <span className="k">{`'{"from":"+9180…","to":"+9198…"}'`}</span>
                {"\n\n"}
                <span className="s">  201 Created</span>
                <span className="c">  status: queued</span>
                {"\n"}
                <span className="c">  ringing → answered → streaming to your agent</span>
              </pre>
            </div>
          </Panel>
        </div>
      </div>
    </section>
  );
}

/* ---------- client logos (placeholders until real logos are supplied) ---------- */
const CLIENT_SLOTS = 6;
export function ClientLogos({ caption = "Trusted by teams building voice AI in India" }: { caption?: string }) {
  return (
    <section className="clients" aria-label="Customers">
      <div className="wrap clients-in">
        <p className="clients-cap">{caption}</p>
        {/* Placeholder marks. Swap each <li> for a customer's logo once approved for use. */}
        <ul className="clients-l">
          {Array.from({ length: CLIENT_SLOTS }, (_, i) => (
            <li key={i}>
              <span className="cl-mk" aria-hidden="true" />
              <span>Client logo</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- internal page hero ----------
   Split layout: copy on the left, a blueprint "stage" on the right holding the page's visual
   (or an icon constellation when there is none), with a spec row underneath.
   light: products and company pages. dark: solutions. */
const CELLS = [1, 3, 5, 7, 0, 8, 2, 6]; // 3x3 grid minus the centre: edges first, then corners
function Constellation({ icons }: { icons: string[] }) {
  const mid = Math.floor(icons.length / 2);
  const others = icons.filter((_, i) => i !== mid);
  const at = (c: number) => [50 + (c % 3) * 100, 50 + Math.floor(c / 3) * 100];
  return (
    <div className="ph-con" aria-hidden="true">
      <svg viewBox="0 0 300 300">
        {CELLS.map((c, i) => {
          const [x, y] = at(c);
          return <line key={c} x1="150" y1="150" x2={x} y2={y} className={i < others.length ? undefined : "off"} />;
        })}
        <circle cx="150" cy="150" r="118" />
      </svg>
      {CELLS.map((c, i) => (
        <span key={c} className={`ph-con-t${others[i] ? "" : " empty"}`} style={{ gridArea: `${Math.floor(c / 3) + 1} / ${(c % 3) + 1}` }}>
          {others[i] ? ICONS[others[i]] : null}
        </span>
      ))}
      <span className="ph-con-t on" style={{ gridArea: "2 / 2" }}>
        {ICONS[icons[mid]]}
      </span>
    </div>
  );
}

export function PageHero({ variant = "light", icons, tags, crumbs, chip, h1, lead, ctas, note, stats, visual }: {
  variant?: "light" | "dark"; icons?: string[]; tags?: [string, string][]; label?: string; meta?: ReactNode; crumbs?: [string, string][]; chip?: ReactNode; h1: ReactNode; lead: ReactNode;
  ctas?: ReactNode; note?: ReactNode; stats?: [string, ReactNode][]; visual?: ReactNode; below?: ReactNode;
}) {
  const stage = visual ?? (icons?.length ? <Constellation icons={icons} /> : null);
  return (
    <section className={`ph ph-${variant}${stage ? "" : " solo"}`} aria-labelledby="hero-h">
      <div className="wrap ph-in">
        <div className="ph-copy">
          {crumbs && <Crumbs items={crumbs} />}
          {chip && <p className="ph-chip">{chip}</p>}
          <h1 className="h1" id="hero-h">
            {h1}
          </h1>
          <p className="lead">{lead}</p>
          <div className="btns">
            {ctas ?? (
              <>
                <Btn href={APP}>Start free</Btn>
                <Btn href="/contact/" line>
                  Talk to sales
                </Btn>
              </>
            )}
          </div>
          {note && <p className="ph-note">{note}</p>}
        </div>
        {stage && (
          <div className={`ph-stage${visual ? " has-vis" : ""}`}>
            <span className="ph-corner tl" aria-hidden="true" />
            <span className="ph-corner br" aria-hidden="true" />
            {tags?.length ? (
              <ul className="ph-tags" aria-label="Works with">
                {tags.slice(0, 3).map(([ic, t], i) => (
                  <li key={t} className={`t${i}`}>
                    <span aria-hidden="true">{ICONS[ic]}</span>
                    {t}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="ph-vis">{stage}</div>
          </div>
        )}
      </div>
      {stats && (
        <div className="wrap">
          <dl className="ph-stats">
            {stats.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}
