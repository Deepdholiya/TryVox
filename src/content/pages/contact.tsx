/* Ported from the original static site. Edit freely: this file is now the source of truth. */
import { Breadcrumb, HeroFx, Integrations } from "@/components";

export const meta = { title: "Contact TryVox Sales and Support | TryVox", description: "Talk to the TryVox team about Indian phone numbers, SIP trunking, AI agents and rate cards. Email team@tryvox.io." };

export function Body() {
  return (
    <>
      <Breadcrumb items={[["Contact", null]]} path="/contact/" />
      <section className="th h3t">
        <HeroFx />
        <div className="h3 wrap">
          <div className="h3-grid">
            <div className="h3-copy">
              <p className="tag">
                <i />
                Contact
              </p>
              <h1 className="hd">
                Talk to
                {" "}
                <em>the team.</em>
              </h1>
              <p className="sub">
                Tell us what you're building and how many calls you run. We'll help you get your agent on the phone and share rates for your volume.
              </p>
              <div className="cta">
                <a className="kbtn" href="mailto:team@tryvox.io">Email team@tryvox.io</a>
                <a className="obtn" href="https://app.tryvox.io/">Start free</a>
              </div>
              <div className="micro">
                <span>Built in India</span>
                <span>Replies by email</span>
                <span>No sales pressure</span>
              </div>
            </div>
            <div className="h3-vis rv">
              <div className="pm">
                <div className="pm-h">
                  <span className="pm-c">
                    <span>Email</span>
                    <span className="sep">›</span>
                    <span>New message</span>
                  </span>
                </div>
                <div className="pm-body">
                  <div className="mrow">
                    <span>To</span>
                    <span>team@tryvox.io</span>
                  </div>
                  <div className="mrow">
                    <span>Subject</span>
                    <span>Rate card request</span>
                  </div>
                  <p className="cp-text">
                    Hi TryVox team, we run about 50,000 calls a month at 2.5 minutes on average with a Vapi agent. Could you share a rate card?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="wrap sect tight">
        <div className="ctr rv">
          <p className="tag">
            <i />
            Ways to reach us
          </p>
          <h2 className="hd h2">
            Pick what
            {" "}
            <em>you need.</em>
          </h2>
        </div>
        <div className="ccards">
          <a className="ccard rv" href="mailto:team@tryvox.io">
            <span className="ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="3" fill="currentColor" fillOpacity=".14" />
                <path d="M4 7l8 6 8-6" />
              </svg>
            </span>
            <h3>Email the team</h3>
            <p>Questions about TryVox, partnerships or anything else.</p>
            <span className="go">team@tryvox.io →</span>
          </a>
          <a className="ccard rv" href="mailto:team@tryvox.io?subject=Rate%20card%20request">
            <span className="ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="8.5" fill="currentColor" fillOpacity=".14" />
                <path d="M9 8h6M9 10.5h6M9 8c2.6 0 3.6 1.2 3.6 2.6S11.5 13 9 13l4.5 4" />
              </svg>
            </span>
            <h3>Get a rate card</h3>
            <p>
              Tell us your monthly calls and average call length, and we'll share rates for your volume.
            </p>
            <span className="go">Request rates →</span>
          </a>
          <a className="ccard rv" href="mailto:team@tryvox.io?subject=Demo%20request">
            <span className="ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="9" cy="8.5" r="3.2" fill="currentColor" fillOpacity=".14" />
                <path d="M3.5 19c.8-3 2.9-4.6 5.5-4.6s4.7 1.6 5.5 4.6" />
                <circle cx="17" cy="9.5" r="2.4" />
                <path d="M16.5 14.6c2 .2 3.4 1.6 4 4.1" />
              </svg>
            </span>
            <h3>Book a demo</h3>
            <p>See numbers, agents and call events working together.</p>
            <span className="go">Request a demo →</span>
          </a>
          <a className="ccard rv" href="https://app.tryvox.io/">
            <span className="ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M13 2.5L5 13.5h6l-1 8 8-11h-6z" fill="currentColor" fillOpacity=".14" />
              </svg>
            </span>
            <h3>Start free</h3>
            <p>Create an account and get a number in minutes.</p>
            <span className="go">Open the dashboard →</span>
          </a>
          <a className="ccard rv" href="https://docs.tryvox.io/">
            <span className="ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 3h8l4 4v14H6z" fill="currentColor" fillOpacity=".14" />
                <path d="M14 3v4h4M9 12h6M9 16h6" />
              </svg>
            </span>
            <h3>Read the docs</h3>
            <p>API reference, VoxML, numbers, SIP and agent guides.</p>
            <span className="go">docs.tryvox.io →</span>
          </a>
          <a className="ccard rv" href="/developers/">
            <span className="ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="16" rx="3" fill="currentColor" fillOpacity=".14" />
                <path d="M9.5 9.5L7 12l2.5 2.5M14.5 9.5L17 12l-2.5 2.5" />
              </svg>
            </span>
            <h3>Developer hub</h3>
            <p>Quickstart steps and code samples.</p>
            <span className="go">Go to developers →</span>
          </a>
        </div>
      </section>
      <Integrations />
    </>
  );
}
