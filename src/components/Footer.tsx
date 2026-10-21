import Link from "next/link";
import { APP, COMPANY, DOCS, EMAIL, PRODUCTS, SOLUTIONS } from "@/content/site";
import { FooterMotion } from "./behaviors";
import { LogoFull, LogoMark } from "./ui";

const COLS: [string, [string, string][]][] = [
  ["Products", PRODUCTS.map((p) => [p.name, `/products/${p.slug}/`])],
  ["Solutions", SOLUTIONS.map((s) => [s.name, `/solutions/${s.slug}/`])],
  ["Developers", [["Developer hub", "/developers/"], ["Integrations", "/integrations/"], ["Docs ↗", `${DOCS}/`], ["Quickstart ↗", `${DOCS}/getting-started/quickstart`]]],
  ["Company", [["About", "/about/"], ["Contact", "/contact/"], ["Pricing", "/pricing/"], ["Sign in", APP]]],
];

const L = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) =>
  href.startsWith("/") ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <a href={href} className={className}>
      {children}
    </a>
  );

export function Footer() {
  return (
    <FooterMotion as="footer" className="wrap">
      <div className="fcta rv">
        <div>
          <p className="tag" style={{ color: "#F3F0F9" }}>
            <i />
            Start in minutes
          </p>
          <h2 className="hd" style={{ marginTop: 18 }}>
            Your agent is ready. Give it a <em>line.</em>
          </h2>
          <p className="sub">Get a number, connect your agent and take your first call today. Live in minutes, no lock-in.</p>
          <div className="cta">
            <a className="kbtn" href={APP}>Start free</a>
            <Link className="obtn" href="/contact/">Talk to us</Link>
          </div>
        </div>
        <div className="fdial" aria-hidden="true">
          <span className="stt">Ringing your agent</span>
          <span className="lcd">+91 80 4718 2290</span>
          <span className="bars">
            {Array.from({ length: 16 }, (_, i) => (
              <i key={i} />
            ))}
          </span>
        </div>
      </div>
      <div className="ft">
        <div className="about">
          <Link className="logo" href="/" aria-label="TryVox home">
            <LogoFull />
          </Link>
          <p>Telephony infrastructure that connects AI voice agents to real phone networks. Built in India.</p>
          <div className="badges">
            <span>KYC</span>
            <span>DLT</span>
            <span>Consent</span>
          </div>
          <p className="mail">
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </p>
          <div className="social">
            <a href="https://x.com/TryvoxTeam" aria-label="TryVox on X" rel="me">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.8 3h3.1l-6.8 7.8L22 21h-6.3l-4.9-6.4L5.2 21H2.1l7.3-8.3L2 3h6.4l4.4 5.9zm-1.1 16.2h1.7L7.4 4.7H5.6z" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/tryvox" aria-label="TryVox on LinkedIn" rel="me">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zm7 0h3.8v1.7h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.2 1.5-2.2 2.9V21h-4z" />
              </svg>
            </a>
            <a href={`${DOCS}/`} aria-label="TryVox docs">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M8 4h9a2 2 0 012 2v14H8a3 3 0 01-3-3V7a3 3 0 013-3z" />
                <path d="M5 17a3 3 0 013-3h11" />
              </svg>
            </a>
          </div>
        </div>
        {COLS.map(([title, links]) => (
          <nav key={title} aria-label={title}>
            <h4>{title}</h4>
            <ul>
              {links.map(([t, h]) => (
                <li key={h}>
                  <L href={h}>{t}</L>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="giant" aria-hidden="true">
        <div className="w">
          <LogoMark />
          TryVox
        </div>
      </div>
      <div className="legal">
        <span>© {new Date().getFullYear()} {COMPANY}</span>
        <nav aria-label="Legal">
          <a href="https://tryvox.io/privacy">Privacy</a>
          <a href="https://tryvox.io/terms">Terms</a>
          <a href="#top">Back to top ↑</a>
        </nav>
      </div>
    </FooterMotion>
  );
}
