/* Security, FAQ, legal and careers pages.
   Anything TryVox has not confirmed yet is shown with a visible "To confirm" tag rather than a claim. */
import { EMAIL, PRODUCTS, SOLUTIONS } from "@/content/site";
import { PRODUCT_PAGES } from "@/content/v3/products";
import { SOLUTION_PAGES } from "@/content/v3/solutions";
import { ClientLogos, CtaBand, Faq, PageHero, Panel, Rows, Sec, SecHead, Ticks } from "./ui";

const end = (
  <>
    <div style={{ height: "var(--sec)" }} />
    <CtaBand />
  </>
);
const Tbc = () => <span className="tbc">To confirm</span>;

/* ---------------- security ---------------- */
export const securityMeta = {
  title: "Security and Trust: How TryVox Protects Calls and Data | TryVox",
  description: "How TryVox secures numbers, trunks, calls and messages: business KYC, consent records, DLT, verified caller IDs, trunk credentials and IP lists, and call records.",
};
export function Security() {
  return (
    <main id="top">
      <PageHero
        variant="light"
        icons={["key", "shield", "id", "eye", "rec", "doc", "users"]}
        crumbs={[["Security", ""]]}
        chip={
          <>
            <i className="dot" /> Trust centre
          </>
        }
        h1={
          <>
            Security built into <span className="hl">every call path.</span>
          </>
        }
        lead="How TryVox controls who can call, what is recorded, and how your account is protected. Ask us for anything you need for a security review."
        ctas={
          <>
            <a className="btn" href={`mailto:${EMAIL}?subject=${encodeURIComponent("Security review request")}`}>
              Request security documents <span className="ar" aria-hidden="true">→</span>
            </a>
            <a className="btn line" href="/contact/">
              Talk to sales
            </a>
          </>
        }
      />
      <ClientLogos />
      <Sec id="ctl-h">
        <SecHead n="01" label="Controls" id="ctl-h" lead="What is in place on the platform today, as described across our product pages.">
          Who can call, and from where.
        </SecHead>
        <div className="feat">
          {[
            ["Identity", "Verified businesses only", ["Business KYC before numbers go live", "One check covers every number", "Calls go out under a verified caller ID"]],
            ["Access", "Locked trunks and logins", ["SIP trunks with credentials, IP lists or both", "Channel limits per trunk", "One WebRTC endpoint per person or device"]],
            ["Records", "Every call accounted for", ["Webhooks at every stage of a call", "Recordings only when you ask for them", "Consent kept next to the contacts you dial"]],
          ].map(([cap, t, pts]) => (
            <div key={cap as string}>
              <p className="cap">{cap}</p>
              <h3 className="h3">{t}</h3>
              <Ticks items={pts as string[]} />
            </div>
          ))}
        </div>
      </Sec>
      <Sec id="cert-h" className="tint">
        <SecHead n="02" label="Certifications and documents" id="cert-h" lead="We are confirming the status of each item below. Write to us and we will share what is available for your review.">
          Documents for your security review.
        </SecHead>
        <Panel path="/trust/documents">
          <ul className="tdocs">
            {[
              ["Information security certification", "Certification status for the platform."],
              ["Independent audit report", "Third-party report on security controls."],
              ["Penetration test summary", "Latest external test of the platform."],
              ["Data processing agreement", "Terms for how we process data on your behalf."],
              ["Sub-processor list", "Services that process data for TryVox."],
              ["Data residency", "Where call, message and recording data is stored."],
              ["Encryption", "How signalling, media and stored data are encrypted."],
              ["Status page and uptime commitment", "Live platform status and the service level we commit to."],
              ["Responsible disclosure", "How to report a security issue to us."],
            ].map(([t, p]) => (
              <li key={t}>
                <span>
                  <b>{t}</b>
                  <small>{p}</small>
                </span>
                <Tbc />
              </li>
            ))}
          </ul>
        </Panel>
      </Sec>
      <Sec id="rep-h">
        <SecHead n="03" label="Report an issue" id="rep-h">
          Found a security issue?
        </SecHead>
        <p className="body" style={{ maxWidth: "64ch" }}>
          Email <a className="tl" href={`mailto:${EMAIL}?subject=${encodeURIComponent("Security issue")}`}>{EMAIL}</a> with the details and steps to reproduce. Please don't test against other customers' numbers or data.
        </p>
      </Sec>
      {end}
    </main>
  );
}

/* ---------------- FAQ hub ---------------- */
export const faqMeta = {
  title: "FAQ: Numbers, SIP Trunks, Compliance and Pricing | TryVox",
  description: "Answers to common questions about TryVox phone numbers, SIP trunking, agent binding, Voice API, WhatsApp, SMS, compliance and pricing.",
};
export function FaqHub() {
  const groups = PRODUCTS.filter((p) => PRODUCT_PAGES[p.slug]?.faq?.length).map((p) => ({ id: p.slug, name: p.name, items: PRODUCT_PAGES[p.slug].faq }));
  const sol = SOLUTIONS.flatMap((s) => SOLUTION_PAGES[s.slug]?.faq ?? []);
  return (
    <main id="top">
      <PageHero
        variant="light"
        icons={["phone", "sip", "shield", "doc", "bot", "chat", "rupee"]}
        crumbs={[["FAQ", ""]]}
        h1={
          <>
            Questions, <span className="hl">answered.</span>
          </>
        }
        lead="Everything teams ask about numbers, trunks, agents, messaging and compliance, in one place. Pick a topic below."
      />
      <Sec id="topics-h">
        <SecHead n="01" label="Topics" id="topics-h">
          Jump to a topic.
        </SecHead>
        <ul className="faq-jump">
          {groups.map((g) => (
            <li key={g.id}>
              <a href={`#faq-${g.id}`}>{g.name}</a>
            </li>
          ))}
          {sol.length ? (
            <li>
              <a href="#faq-industries">By industry</a>
            </li>
          ) : null}
        </ul>
      </Sec>
      {groups.map((g, i) => (
        <Faq key={g.id} id={`faq-${g.id}`} n={String(i + 2).padStart(2, "0")} title={g.name} items={g.items} />
      ))}
      {sol.length ? <Faq id="faq-industries" n={String(groups.length + 2).padStart(2, "0")} title="By industry" items={sol} /> : null}
      {end}
    </main>
  );
}

/* ---------------- legal ---------------- */
export const legalMeta = {
  title: "Legal: Terms, Privacy and Policies | TryVox",
  description: "TryVox terms of service, privacy policy, acceptable use and other policies.",
};
const DOCS_LEGAL: [string, string, string][] = [
  ["terms", "Terms of service", "The agreement that covers your use of TryVox."],
  ["privacy", "Privacy policy", "What personal data we collect, why, and your rights."],
  ["acceptable-use", "Acceptable use policy", "What you may and may not do on the platform, including calling and messaging rules."],
  ["cookies", "Cookie policy", "The cookies this website uses."],
  ["dpa", "Data processing agreement", "How we process data on your behalf."],
  ["refunds", "Billing and refunds", "How billing, prepaid balance and refunds work."],
];
export function Legal() {
  return (
    <main id="top">
      <PageHero
        variant="light"
        crumbs={[["Legal", ""]]}
        h1={
          <>
            Terms and <span className="hl">policies.</span>
          </>
        }
        lead="The documents that govern how TryVox works with you. While we publish them here, write to us for a copy."
        ctas={
          <a className="btn" href={`mailto:${EMAIL}?subject=${encodeURIComponent("Legal documents")}`}>
            Request a copy <span className="ar" aria-hidden="true">→</span>
          </a>
        }
      />
      <Sec id="docs-h">
        <SecHead n="01" label="Documents" id="docs-h">
          Every policy, in one list.
        </SecHead>
        <Panel path="/legal">
          <ul className="tdocs">
            {DOCS_LEGAL.map(([id, t, p]) => (
              <li key={id} id={id}>
                <span>
                  <b>{t}</b>
                  <small>{p}</small>
                </span>
                <span className="tbc">Being published</span>
              </li>
            ))}
          </ul>
        </Panel>
      </Sec>
      {end}
    </main>
  );
}

/* ---------------- careers ---------------- */
export const careersMeta = {
  title: "Careers at TryVox | TryVox",
  description: "Work on telephony infrastructure for voice AI at TryVox.",
};
export function Careers() {
  return (
    <main id="top">
      <PageHero
        variant="light"
        icons={["users", "code", "sip", "bolt", "wave", "hook", "globe"]}
        crumbs={[["Careers", ""]]}
        h1={
          <>
            Build the phone layer <span className="hl">for voice AI.</span>
          </>
        }
        lead="We are a small team working on numbers, SIP and compliance so voice agents can take real calls. If that sounds like your kind of problem, we'd like to hear from you."
        ctas={
          <a className="btn" href={`mailto:${EMAIL}?subject=${encodeURIComponent("Careers")}`}>
            Write to us <span className="ar" aria-hidden="true">→</span>
          </a>
        }
      />
      <Sec id="how-h">
        <SecHead n="01" label="How we work" id="how-h">
          What we care about.
        </SecHead>
        <Panel path="/careers/values">
          <Rows
            items={[
              ["Infrastructure first", "We build the phone layer and nothing else, so we sweat reliability.", "01"],
              ["Compliance is product", "KYC, consent and DLT are features, not paperwork.", "02"],
              ["Developers are customers", "If it isn't clear in the docs, it isn't done.", "03"],
            ]}
          />
        </Panel>
      </Sec>
      <Sec id="open-h" className="tint">
        <SecHead n="02" label="Open roles" id="open-h" lead="Roles will be listed here when they open. You can always send us a note.">
          Open roles.
        </SecHead>
        <div className="pn">
          <div className="pn-body">
            <p className="body">
              No roles are listed yet. Send your CV and a few lines about what you'd like to work on to{" "}
              <a className="tl" href={`mailto:${EMAIL}?subject=${encodeURIComponent("Careers")}`}>
                {EMAIL}
              </a>
              .
            </p>
          </div>
        </div>
      </Sec>
      {end}
    </main>
  );
}
