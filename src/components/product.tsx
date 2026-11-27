/* Product page layout (Arrakis platform rhythm). Server component; motion comes from ./behaviors. */
import { APP, DOCS } from "@/content/site";
import type { Product } from "@/content/products";
import { ComplianceChecks, Panels } from "./behaviors";
import { CodePanel } from "./interactive";
import { Icon, Split } from "./ui";

const pad = (n: number) => String(n).padStart(2, "0");

export function ProductHero({ d }: { d: Product }) {
  const n = d.layers.length;
  const order = Array.from({ length: n }, (_, j) => n - 1 - j);
  return (
    <section className="ah ah6 th">
      <div className="wrap h2g">
        <div className="h2g-l ah-in">
          <p className="tag">
            <i />
            {d.name}
          </p>
          <Split as="h1">{d.h1}</Split>
          <p className="sub rv">{d.sub}</p>
          <div className="cta rv">
            <a className="kbtn" href={APP}>Start free</a>
            <a className="obtn" href="/contact/">Talk to sales</a>
          </div>
        </div>
        <div className="h2g-r rv">
          <div className="fr ply" role="group" aria-label={`${d.name}: how the layers fit together`}>
            <div className="fr-bar">
              <span className="fr-path">How it fits</span>
              <span className="fr-meta">{pad(n)} layers</span>
            </div>
            <ol className="ply-l">
              {order.map((i, j) => (
                <li className={j === 0 ? "top" : undefined} key={i}>
                  <span className="ply-n">{pad(n - j)}</span>
                  <span className="ply-t">
                    <b>{d.layers[i]}</b>
                    <small>{d.layerNotes[i]}</small>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProductStory({ lines }: { lines: string[] }) {
  return (
    <section className="wrap sect v2 pst" aria-label="In short">
      <div className="pst-in rv">
        {lines.map((ln, i) => (
          <p className={i === 0 ? "pst-a" : undefined} key={i}>
            {ln}
          </p>
        ))}
      </div>
    </section>
  );
}

function Isob({ children }: { children: React.ReactNode }) {
  return (
    <div className="isob">
      <svg className="isob-w" viewBox="0 0 520 420" preserveAspectRatio="none" aria-hidden="true">
        <path d="M260 70 L470 190 L260 310 L50 190 Z" />
        <path d="M50 190 L50 250 L260 370 L470 250 L470 190" />
        <path d="M260 310 L260 370" />
        <path d="M260 0 V70 M260 370 V420 M50 250 V420 M470 250 V420" className="dash" />
      </svg>
      <div className="isob-c">{children}</div>
      <i className="isob-g" aria-hidden="true" />
    </div>
  );
}

export function ProductPanels({ d }: { d: Product }) {
  return (
    <Panels as="section" className="pp">
      <div className="pp-in">
        <nav className="pp-nav mono" aria-label="On this page">
          {d.panels.map((p, i) => (
            <a href={`#pp-${i}`} data-i={i} className={i === 0 ? "on" : undefined} key={i}>
              {p.tag}
            </a>
          ))}
        </nav>
        <div className="pp-list">
          {d.panels.map((p, i) => (
            <article className="ppn" id={`pp-${i}`} data-i={i} key={i}>
              <div className="ppn-b t" />
              <div className="ppn-g">
                <Isob>{p.visual}</Isob>
                <div className="ppn-c">
                  <div>
                    <p className="tag">
                      <i />
                      {p.tag}
                    </p>
                    <h2 className="hd">{p.heading}</h2>
                  </div>
                  <div>
                    <p>{p.body}</p>
                    <ul className="ticks">
                      {p.points.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="ppn-b b" />
            </article>
          ))}
        </div>
      </div>
    </Panels>
  );
}

const SHIELD = (
  <svg viewBox="0 0 120 140" aria-hidden="true">
    <defs>
      <linearGradient id="shg7" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#E9DDFF" />
        <stop offset=".45" stopColor="#9D61FF" />
        <stop offset="1" stopColor="#3B1C86" />
      </linearGradient>
    </defs>
    <path d="M60 6 L110 24 V66 C110 100 88 124 60 134 C32 124 10 100 10 66 V24 Z" fill="url(#shg7)" />
    <path d="M60 6 L60 134 C32 124 10 100 10 66 V24 Z" fill="#fff" opacity=".14" />
    <path className="ck" d="M40 70 l14 14 28-30" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function Compliance() {
  const checks: [string, string][] = [["id", "Business KYC"], ["mail", "DLT-ready SMS"], ["users", "Consent records"], ["phone", "Verified caller IDs"]];
  return (
    <ComplianceChecks as="section" className="cp7" aria-labelledby="cp7-h">
      <div className="wrap">
        <div className="c7-frame rv">
          <div className="c7-in">
            <div className="c7-badge">
              <span className="c7-ring r1"><b /></span>
              <span className="c7-ring r2"><b /></span>
              <i />
              <i />
              {SHIELD}
            </div>
            <p className="c7-pill">
              <span className="c7-st">✓</span>
              <b className="mono">0</b>/4 checks · India-ready
            </p>
            <p className="tag">
              <i />
              Compliance
            </p>
            <h2 className="hd h2" id="cp7-h">
              Compliance and control, <em>built in.</em>
            </h2>
            <p className="sub">India&rsquo;s telecom rules are part of the product, not a project you run on the side.</p>
            <div className="c7-cs">
              {checks.map(([ic, t], i) => (
                <span className="c7-c" data-i={i} key={t}>
                  <Icon name={ic} bare />
                  {t}
                </span>
              ))}
            </div>
            <div className="cta">
              <a className="kbtn" href="/products/compliance/">Explore compliance</a>
              <a className="obtn" href="/contact/">Talk to sales</a>
            </div>
          </div>
          <svg className="c7-notch" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 1 H180 L220 39 H780 L820 1 H1000" />
          </svg>
          <i className="c7-k l" />
          <i className="c7-k r" />
        </div>
      </div>
    </ComplianceChecks>
  );
}

export function DevSection({ code, note }: { code: Record<string, [string, string]>; note: React.ReactNode }) {
  return (
    <section className="wrap sect tight">
      <div className="devgrid">
        <div className="rv">
          <p className="tag">
            <i />
            For developers
          </p>
          <h2 className="hd h2" style={{ marginTop: 20 }}>
            Straight from <em>the docs.</em>
          </h2>
          <p className="sub">A REST API at api.tryvox.io with HTTP Basic auth. Every example on this page matches the documentation.</p>
          <div className="cta">
            <a className="obtn" href="/developers/">Developer hub</a>
            <a className="obtn" href={`${DOCS}/`}>Read the docs ↗</a>
          </div>
        </div>
        <div className="rv" style={{ minWidth: 0 }}>
          <CodePanel code={code}>{note}</CodePanel>
        </div>
      </div>
    </section>
  );
}
