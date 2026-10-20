/* Shared building blocks. Server components: they render to static HTML. */
import { Children, Fragment, cloneElement, isValidElement, type CSSProperties, type ReactElement, type ReactNode } from "react";
import { ICONS } from "@/content/icons";
import { SITE_URL, type QA } from "@/content/site";

/* ---------- logo (gradient defs live once in the layout, see <LogoDefs/>) ---------- */
const MARK = (
  <>
    <path d="M0 18.6669V28.0003H9.33343L18.6669 18.6669H9.33343V9.33343L0 18.6669Z" fill="#00B900" />
    <path d="M28.0003 0H18.6669L9.33343 9.33343L18.6669 9.33343V18.6669L28.0003 9.33343V0Z" fill="#00B900" />
    <path d="M9.33343 9.33343H0V0H9.33343V9.33343Z" fill="url(#tvg0)" />
    <path d="M18.667 18.6672H28.0004V28.0007H18.667V18.6672Z" fill="url(#tvg1)" />
  </>
);

export function LogoDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="tvg0" x1="0" y1="0" x2="9.05892" y2="9.05892" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00B900" />
          <stop offset="1" stopColor="#00B900" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="tvg1" x1="28.0004" y1="28.0007" x2="18.667" y2="18.6672" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00B900" />
          <stop offset="1" stopColor="#00B900" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** The square mark, in a 32×32 box. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <g transform="translate(2 2)">{MARK}</g>
    </svg>
  );
}

/** Mark plus wordmark. */
export function LogoFull() {
  return (
    <svg className="lgf" viewBox="0 0 112 28" role="img" aria-label="TryVox">
      {MARK}
      <g fill="currentColor">
        <path d="M99.3232 21.3285L103.674 15.18L99.5553 9.40845H102.804L105.53 13.4688L108.256 9.40845H111.533L107.415 15.18L111.794 21.3285H108.546L105.53 16.9491L102.572 21.3285H99.3232Z" />
        <path d="M92.3131 21.6186C90.9983 21.6186 89.8866 21.3575 88.9778 20.8355C88.0884 20.3134 87.4213 19.598 86.9766 18.6893C86.5319 17.7612 86.3096 16.7074 86.3096 15.528C86.3096 14.3292 86.5319 13.2755 86.9766 12.3667C87.4213 11.4386 88.0884 10.7136 88.9778 10.1915C89.8866 9.66947 91.008 9.40845 92.3421 9.40845C94.295 9.40845 95.7741 9.96916 96.7795 11.0906C97.8043 12.212 98.3167 13.6912 98.3167 15.528C98.3167 16.6688 98.104 17.7032 97.6786 18.6313C97.2532 19.5594 96.5958 20.2941 95.7064 20.8355C94.817 21.3575 93.6859 21.6186 92.3131 21.6186ZM92.3131 19.1243C93.1832 19.1243 93.8406 18.9406 94.2853 18.5733C94.7493 18.2059 95.0587 17.7419 95.2134 17.1811C95.3681 16.6011 95.4454 16.021 95.4454 15.441C95.4454 14.8223 95.3681 14.2325 95.2134 13.6718C95.0587 13.1111 94.7493 12.6471 94.2853 12.2797C93.8406 11.893 93.1832 11.6997 92.3131 11.6997C91.4624 11.6997 90.805 11.893 90.3409 12.2797C89.8962 12.6471 89.5869 13.1111 89.4129 13.6718C89.2582 14.2325 89.1808 14.8223 89.1808 15.441C89.1808 16.021 89.2582 16.6011 89.4129 17.1811C89.5869 17.7419 89.8962 18.2059 90.3409 18.5733C90.805 18.9406 91.4624 19.1243 92.3131 19.1243Z" />
        <path d="M83.3627 5.00024H86.611L81.2165 21.3287H76.2861L70.8916 5.00024H74.1109L78.7223 20.0816L83.3627 5.00024Z" />
        <path d="M57.8291 26.868V24.5768H59.6563C59.9463 24.5768 60.1976 24.5478 60.4103 24.4898C60.6424 24.4318 60.8647 24.2771 61.0774 24.0258C61.2901 23.7937 61.5221 23.407 61.7735 22.8657L62.5565 21.1255L57.9161 9.40845H60.9614L64.0067 18.0802L67.284 9.40845H70.3292L64.4707 23.1557C64.1227 23.9678 63.794 24.6155 63.4846 25.0989C63.1946 25.6016 62.8949 25.9786 62.5855 26.23C62.2762 26.4813 61.9185 26.6457 61.5124 26.723C61.1064 26.8197 60.6327 26.868 60.0913 26.868H57.8291Z" />
        <path d="M48.8516 21.3285V9.40845H51.6068L51.8388 12.8888L51.8098 15.441V21.3285H48.8516ZM51.8098 16.1951L51.7228 13.5558C51.7228 13.1498 51.8002 12.7147 51.9548 12.2507C52.1095 11.7673 52.3609 11.313 52.7089 10.8876C53.0763 10.4622 53.55 10.1142 54.13 9.84349C54.7101 9.55346 55.4255 9.40845 56.2762 9.40845H56.7113V12.7147H56.2762C55.4448 12.7147 54.7391 12.7824 54.159 12.9178C53.579 13.0338 53.1149 13.2271 52.7669 13.4978C52.4382 13.7685 52.1965 14.1262 52.0419 14.5709C51.8872 15.0156 51.8098 15.557 51.8098 16.1951Z" />
        <path d="M43.7727 5.52229V21.3287H40.8144V5.52229H43.7727ZM36 7.55248V5.00024H48.6161V7.55248H36Z" />
      </g>
    </svg>
  );
}

/* ---------- icons ---------- */
export function Icon({ name, bare }: { name: string; bare?: boolean }) {
  const svg = ICONS[name];
  return bare ? svg : <span className="ic">{svg}</span>;
}

/* ---------- headline whose words rise in (pure CSS, so it renders on the server) ---------- */
function splitWords(node: ReactNode, n: { i: number }, key = "w"): ReactNode {
  if (typeof node === "string") {
    return node.split(/(\s+)/).map((t, k) => {
      if (!t) return null;
      if (/^\s+$/.test(t)) return t;
      return (
        <span className="w" key={`${key}-${k}`}>
          <span style={{ "--i": n.i++ } as CSSProperties}>{t}</span>
        </span>
      );
    });
  }
  if (Array.isArray(node)) return node.map((c, k) => splitWords(c, n, `${key}.${k}`));
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>;
    return cloneElement(el, { key }, ...Children.toArray(splitWords(el.props.children, n, key + "c")));
  }
  return node;
}

export function Split({ as = "h1", className = "hd split", children, ...rest }: { as?: string; className?: string; children: ReactNode; [k: string]: unknown }) {
  const Tag = as as any;
  return (
    <Tag className={className} {...rest}>
      {splitWords(children, { i: 0 })}
    </Tag>
  );
}

/* ---------- structured data ---------- */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

/* ---------- breadcrumb bar (top-left, under the nav) + BreadcrumbList schema ---------- */
export function Breadcrumb({ items, path }: { items: [string, string | null][]; path?: string }) {
  const last = items[items.length - 1][0];
  const ld = path
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
          { "@type": "ListItem", position: 2, name: last, item: SITE_URL + path },
        ],
      }
    : null;
  return (
    <div className="crumbbar">
      <div className="wrap">
        <nav className="crumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          {items.map(([label, href], i) => (
            <Fragment key={i}>
              <span aria-hidden="true">/</span>
              {href ? <a href={href}>{label}</a> : <span aria-current={i === items.length - 1 ? "page" : undefined}>{label}</span>}
            </Fragment>
          ))}
        </nav>
      </div>
      {ld && <JsonLd data={ld} />}
    </div>
  );
}

/* ---------- FAQ + FAQPage schema ---------- */
export function Faq({ items, heading }: { items: QA[]; heading?: ReactNode }) {
  return (
    <section className="wrap sect tight" aria-labelledby="faq-h">
      <div className="faq">
        <div className="rv">
          <p className="tag">
            <i />
            FAQ
          </p>
          <h2 className="hd h2" id="faq-h" style={{ marginTop: 20 }}>
            {heading ?? (
              <>
                Questions teams <em>ask first.</em>
              </>
            )}
          </h2>
        </div>
        <div className="rv">
          {items.map(([q, a], i) => (
            <details key={q} open={i === 0}>
              <summary>
                {q}
                <i aria-hidden="true">+</i>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
        }}
      />
    </section>
  );
}

/* ---------- section head: green-dot tag, heading, body ---------- */
export function SectionHead({ tag, children, sub, center, dark }: { tag: string; children: ReactNode; sub?: ReactNode; center?: boolean; dark?: boolean }) {
  return (
    <div className={`shd${center ? " c" : ""}${dark ? " dk" : ""} rv`}>
      <p className="tag">
        <i />
        {tag}
      </p>
      <h2 className="hd h2">{children}</h2>
      {sub && <p className="sub">{sub}</p>}
    </div>
  );
}

/** Corner-bracket frame used around visuals. */
export function Bracket({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`brk${className ? " " + className : ""}`}>
      <i className="b1" />
      <i className="b2" />
      <i className="b3" />
      <i className="b4" />
      {children}
    </div>
  );
}

export function Pill({ children, kind }: { children: ReactNode; kind?: string }) {
  return <span className={`pill${kind ? " " + kind : ""}`}>{children}</span>;
}

/** Chat/event lines used in call mocks. */
export function Feed({ lines, className = "mfeed" }: { lines: [string, string][]; className?: string }) {
  return (
    <div className={className}>
      {lines.map(([k, t], i) => (
        <div className={`msg ${k}`} key={i}>
          {t}
        </div>
      ))}
    </div>
  );
}
