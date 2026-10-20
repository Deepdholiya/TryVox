/* Product page layout (Arrakis platform rhythm). Server component; motion comes from ./behaviors. */
import { Fragment, type CSSProperties } from "react";
import { APP, DOCS } from "@/content/site";
import type { Product } from "@/content/products";
import { ComplianceChecks, Panels, StackPin, Story } from "./behaviors";
import { CodePanel, HeroFx } from "./interactive";
import { Bracket, Icon, Split } from "./ui";

/* ---------- isometric layer stack (SVG) ---------- */
function IsoStack({ n = 5 }: { n?: number }) {
  const s = 150, t = 14, gap = 16, E = 64;
  const c = Math.cos(Math.PI / 6), sn = Math.sin(Math.PI / 6);
  const P = (x: number, y: number, z: number) => [(x - y) * c * s, (x + y) * sn * s - z];
  const pts = (L: [number, number, number][]) => L.map((p) => P(...p).map((v) => v.toFixed(1)).join(",")).join(" ");
  const slabs = [];
  for (let k = 0; k < n; k++) {
    const z0 = k * gap, z1 = z0 + t;
    const top = pts([[0, 0, z1], [1, 0, z1], [1, 1, z1], [0, 1, z1]]);
    const left = pts([[0, 1, z1], [1, 1, z1], [1, 1, z0], [0, 1, z0]]);
    const right = pts([[1, 0, z1], [1, 1, z1], [1, 1, z0], [1, 0, z0]]);
    const extra = [];
    if (k === n - 1) {
      for (const q of [1 / 3, 2 / 3]) {
        let a = P(q, 0.04, z1), b = P(q, 0.96, z1);
        extra.push(<line key={`a${q}`} x1={a[0].toFixed(1)} y1={a[1].toFixed(1)} x2={b[0].toFixed(1)} y2={b[1].toFixed(1)} className="gl" />);
        a = P(0.04, q, z1); b = P(0.96, q, z1);
        extra.push(<line key={`b${q}`} x1={a[0].toFixed(1)} y1={a[1].toFixed(1)} x2={b[0].toFixed(1)} y2={b[1].toFixed(1)} className="gl" />);
      }
      const [cx, cy] = P(0.5, 0.5, z1);
      extra.push(<polygon key="core" points={pts([[0.38, 0.38, z1], [0.62, 0.38, z1], [0.62, 0.62, z1], [0.38, 0.62, z1]])} className="core" />);
      extra.push(<ellipse key="orb" cx={cx.toFixed(1)} cy={cy.toFixed(1)} rx={(s * 0.62).toFixed(1)} ry={(s * 0.36).toFixed(1)} className="orb" />);
      for (let ang = 0; ang < 360; ang += 60) {
        const r = (ang * Math.PI) / 180;
        extra.push(<circle key={`o${ang}`} cx={(cx + Math.cos(r) * s * 0.62).toFixed(1)} cy={(cy + Math.sin(r) * s * 0.36).toFixed(1)} r="3" className="od" style={{ "--d": `${ang * 8}ms` } as CSSProperties} />);
      }
    } else {
      extra.push(<polygon key="pip" points={pts([[0.44, 0.44, z1], [0.56, 0.44, z1], [0.56, 0.56, z1], [0.44, 0.56, z1]])} className="pip" />);
    }
    slabs.push(
      <g className="sl" data-i={k} key={k}>
        <polygon points={left} className="fl" />
        <polygon points={right} className="fr" />
        <polygon points={top} className="ft" />
        {extra}
      </g>,
    );
  }
  const w = 2 * c * s + 20, topY = (n - 1) * (gap + E) + t + 20, h = s + topY + 16;
  return (
    <svg className="stk-svg" viewBox={`${Math.round(-w / 2)} ${Math.round(-topY)} ${Math.round(w)} ${Math.round(h)}`} data-e={E} aria-hidden="true">
      {slabs}
    </svg>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

export function ProductHero({ d }: { d: Product }) {
  const n = d.layers.length;
  const order = Array.from({ length: n }, (_, j) => n - 1 - j);
  return (
    <>
      <section className="ah ah6 th">
        <HeroFx />
        <div className="wrap ah-in">
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
      </section>
      <StackPin as="section" className="ahp" style={{ "--n": n } as CSSProperties} aria-label={`${d.name}: how the layers fit together`}>
        <div className="ahp-st">
          <div className="ahp-cap mono">
            <span>Scroll to open the stack</span>
            <span className="ahp-c">
              <b>{pad(n)}</b> / {pad(n)}
            </span>
          </div>
          <div className="ah-stage">
            <ul className="ah-l" aria-hidden="true">
              {order.map((i, j) => (
                <li data-i={i} key={i}>
                  <svg viewBox="0 0 64 30" aria-hidden="true">
                    <polygon points="32,2 62,15 32,28 2,15" />
                  </svg>
                  <span>{pad(n - j)}</span>
                </li>
              ))}
            </ul>
            <Bracket className="stk">
              <IsoStack n={n} />
            </Bracket>
            <ul className="ah-r">
              {order.map((i) => (
                <li data-i={i} key={i}>
                  <b>{d.layers[i]}</b>
                  <small>{d.layerNotes[i]}</small>
                </li>
              ))}
            </ul>
          </div>
          <div className="ahp-bar">
            <i />
          </div>
        </div>
      </StackPin>
      <div className="ahp-fade" aria-hidden="true" />
    </>
  );
}

export function ProductStory({ lines }: { lines: string[] }) {
  const ticks = Array.from({ length: 8 }, (_, i) => <i key={i} />);
  return (
    <Story as="section" className="rvs">
      <div className="rvs-t l" aria-hidden="true">{ticks}</div>
      <div className="wrap rvs-in">
        <div className="revp">
          {lines.map((ln, i) => (
            <p key={i}>
              {ln.split(" ").map((w, j) => (
                <Fragment key={j}>
                  {j > 0 && " "}
                  <span>{w}</span>
                </Fragment>
              ))}
            </p>
          ))}
        </div>
      </div>
      <div className="rvs-t r" aria-hidden="true">{ticks}</div>
    </Story>
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
