import { LogoMark } from "@/components/ui";
import { APP, COMPANY, DOCS, EMAIL, PRODUCTS, SOLUTIONS } from "@/content/site";

export function Footer() {
  const cols: [string, [string, string][]][] = [
    ["Products", PRODUCTS.map((p) => [p.name, `/products/${p.slug}/`])],
    ["Solutions", SOLUTIONS.map((s) => [s.name, `/solutions/${s.slug}/`])],
    [
      "Developers",
      [
        ["Developer hub", "/developers/"],
        ["Documentation", `${DOCS}/`],
        ["Quickstart", `${DOCS}/getting-started/quickstart`],
        ["Integrations", "/integrations/"],
        ["API reference", `${DOCS}/`],
        ["FAQ", "/faq/"],
        ["llms.txt", "/llms.txt"],
      ],
    ],
    [
      "Company",
      [
        ["About", "/about/"],
        ["Pricing", "/pricing/"],
        ["Contact", "/contact/"],
        ["Careers", "/careers/"],
        ["Dashboard", APP],
      ],
    ],
    [
      "Trust",
      [
        ["Security", "/security/"],
        ["Compliance", "/products/compliance/"],
        ["Terms of service", "/legal/#terms"],
        ["Privacy policy", "/legal/#privacy"],
        ["Acceptable use", "/legal/#acceptable-use"],
      ],
    ],
  ];
  return (
    <footer className="dk ft">
      <div className="wrap">
        <div className="ft-g">
          <div>
            <a className="logo" href="/" aria-label="TryVox home">
              <LogoMark />
              <span aria-hidden="true">TryVox</span>
            </a>
            <p className="small ft-about">Telephony infrastructure for voice AI in India. Numbers, SIP, Voice API and messaging for the agent you already run.</p>
            <p className="small" style={{ marginTop: 16 }}>
              <a href={`mailto:${EMAIL}`} style={{ color: "#fff" }}>
                {EMAIL}
              </a>
            </p>
          </div>
          {cols.map(([h, links]) => (
            <div key={h}>
              <h2>{h}</h2>
              <ul>
                {links.map(([t, href]) => (
                  <li key={href}>
                    <a href={href}>{t}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="ft-b">
          <span>
            © {new Date().getFullYear()} {COMPANY}. Built in India.
          </span>
          <nav aria-label="Social">
            <a href="https://x.com/TryvoxTeam">X</a>
            <a href="https://www.linkedin.com/company/tryvox">LinkedIn</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
