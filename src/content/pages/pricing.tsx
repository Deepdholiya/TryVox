/* Ported from the original static site. Edit freely: this file is now the source of truth. */
import { Breadcrumb, Estimator, Faq, HeroFx, Integrations, Split, VolumeTiles } from "@/components";

export const meta = { title: "Pricing: Pay-Per-Minute Telephony for AI Voice Agents | TryVox", description: "Telephony for AI voice agents in India: ₹100 setup fee, ₹399 monthly rent and per-minute calls. No lock-in. Volume rate cards on request." };

export function Body() {
  return (
    <>
      <Breadcrumb items={[["Pricing", null]]} path="/pricing/" />
      <section className="th gxh">
        <HeroFx />
        <div className="wrap gx-in">
          <p className="tag">
            <i />
            Pricing
          </p>
          <Split as="h1" className="hd split">
            Pricing for every stage.
            {" "}
            <em>Pay per minute, scale with volume.</em>
          </Split>
          <p className="sub rv">
            See how TryVox pricing works below. Get in touch for a rate card that fits your volume.
          </p>
          <div className="cta rv">
            <a className="kbtn" href="/contact/">Let’s chat</a>
            <a className="obtn" href="https://app.tryvox.io/">Start free</a>
          </div>
        </div>
      </section>
      <section className="gx">
        <p className="lg-lbl mono">Works with your voice stack</p>
        <div className="lgrid rv">
          <div className="lgc">
            <img src="/assets/logos/vapi.svg" alt="Vapi" width="55" height="20" />
          </div>
          <div className="lgc">
            <img src="/assets/logos/retell.svg" alt="Retell AI" width="65" height="20" />
          </div>
          <div className="lgc">
            <img src="/assets/logos/livekit.svg" alt="LiveKit" width="18" height="20" />
          </div>
          <div className="lgc">
            <img src="/assets/logos/bolna.svg" alt="Bolna" width="28" height="20" />
          </div>
          <div className="lgc"><em>ElevenLabs</em></div>
          <div className="lgc"><em>Deepgram</em></div>
          <div className="lgc"><em>WhatsApp</em></div>
          <div className="lgc"><em>Amazon Polly</em></div>
          <div className="lgc"><em>SIP / BYOC</em></div>
          <div className="lgc"><em>VoxML</em></div>
        </div>
        <div className="wrap gsec">
          <div className="shd c rv">
            <p className="tag">
              <i />
              Start
            </p>
            <h2 className="hd h2">Pay as you go</h2>
            <p className="sub">Everything you need to put your first agent on the phone.</p>
          </div>
          <div className="gcard rv">
            <div className="gch">
              <h3>Everything to go live</h3>
              <a className="kbtn" href="https://app.tryvox.io/">Get started</a>
            </div>
            <div className="grow">
              <span>Setup fee</span>
              <b>₹100</b>
            </div>
            <div className="grow">
              <span>Monthly rent</span>
              <b>₹399</b>
            </div>
            <div className="grow">
              <span>Billing</span>
              <b>Per minute, one account</b>
            </div>
            <div className="grow">
              <span>Lock-in</span>
              <b>None</b>
            </div>
          </div>
          <p className="gnote">Voice and messaging on one bill. Numbers require business KYC.</p>
        </div>
        <div className="wrap gsec">
          <div className="shd c rv">
            <p className="tag">
              <i />
              Scale
            </p>
            <h2 className="hd h2">Rates that grow with you</h2>
            <p className="sub">Three steps from your first call to committed volume.</p>
          </div>
          <div className="gcard rv">
            <div className="gch">
              <h3>
                <span className="gn mono">01</span>
                Go live on pay as you go
              </h3>
              <span className="gside">₹100 setup · ₹399/month</span>
            </div>
            <p className="gp1">
              <b>Live in minutes.</b>
              {" "}
              Buy a number, bind your agent and take your first call.
            </p>
          </div>
          <div className="gcard rv">
            <div className="gch">
              <h3>
                <span className="gn mono">02</span>
                Choose your monthly volume
              </h3>
            </div>
            <p className="gp1">
              <b>Select your monthly minutes.</b>
              {" "}
              Unlock volume rates as you grow.
            </p>
            <VolumeTiles as="div" className="gts">
              <button type="button" className="gt on" data-i="0" data-msg="₹399 a month plus per-minute calls. No lock-in.">
                <b>Up to 10k</b>
                <small>minutes a month</small>
              </button>
              <button type="button" className="gt" data-i="1" data-msg="Volume rates. Ask for a rate card.">
                <b>10k – 1L</b>
                <small>minutes a month</small>
              </button>
              <button type="button" className="gt" data-i="2" data-msg="Committed volume. Best rates for scale.">
                <b>1L+</b>
                <small>minutes a month</small>
              </button>
              <button type="button" className="gt" data-i="3" data-msg="Custom terms, partner and multi-account setups.">
                <b>Enterprise</b>
                <small>Custom</small>
              </button>
            </VolumeTiles>
            <p className="gmsg" aria-live="polite">₹399 a month plus per-minute calls. No lock-in.</p>
          </div>
          <div className="gcard rv">
            <div className="gch">
              <h3>
                <span className="gn mono">03</span>
                Use it across the stack
              </h3>
            </div>
            <p className="gp1">
              <b>One balance covers every product.</b>
              {" "}
              Numbers, SIP, calls, agents, messaging and compliance.
            </p>
            <div className="gps">
              <a className="gp" href="/products/phone-numbers/">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 3.5h3.6l1.9 4.8-2.4 1.5a11 11 0 005.6 5.6l1.5-2.4 4.8 1.9V18a2.5 2.5 0 01-2.5 2.5A16.5 16.5 0 012.5 6 2.5 2.5 0 015 3.5z" fill="currentColor" fillOpacity=".14" />
                  <path d="M15 3.5a5.5 5.5 0 015.5 5.5M15 7a2 2 0 012 2" />
                </svg>
                Phone Numbers
              </a>
              <a className="gp" href="/products/sip-trunking/">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3.5" width="18" height="7" rx="2.2" fill="currentColor" fillOpacity=".14" />
                  <rect x="3" y="13.5" width="18" height="7" rx="2.2" fill="currentColor" fillOpacity=".14" />
                  <circle cx="7" cy="7" r="1" fill="currentColor" stroke="none" />
                  <circle cx="7" cy="17" r="1" fill="currentColor" stroke="none" />
                  <path d="M11 7h6M11 17h6" />
                </svg>
                SIP Trunking
              </a>
              <a className="gp" href="/products/voice-api/">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="2.5" y="10" width="2.6" height="4" rx="1.3" opacity=".45" />
                  <rect x="6.6" y="6.5" width="2.6" height="11" rx="1.3" opacity=".75" />
                  <rect x="10.7" y="3" width="2.6" height="18" rx="1.3" />
                  <rect x="14.8" y="7.5" width="2.6" height="9" rx="1.3" opacity=".75" />
                  <rect x="18.9" y="10" width="2.6" height="4" rx="1.3" opacity=".45" />
                </svg>
                Voice API
              </a>
              <a className="gp" href="/products/ai-agents/">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="4" y="7" width="16" height="12.5" rx="3.5" fill="currentColor" fillOpacity=".14" />
                  <path d="M12 3.5V7M2 12v3M22 12v3" />
                  <circle cx="9" cy="12.5" r="1.3" fill="currentColor" stroke="none" />
                  <circle cx="15" cy="12.5" r="1.3" fill="currentColor" stroke="none" />
                  <path d="M9.5 16h5" />
                </svg>
                AI Agents
              </a>
              <a className="gp" href="/products/messaging/">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 19.5l1.4-3.6A8 8 0 1112 20a8 8 0 01-3.9-1z" fill="currentColor" fillOpacity=".14" />
                  <circle cx="8.5" cy="12" r="1.1" fill="currentColor" stroke="none" />
                  <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
                  <circle cx="15.5" cy="12" r="1.1" fill="currentColor" stroke="none" />
                </svg>
                Messaging
              </a>
              <a className="gp" href="/products/compliance/">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2.8l7.5 3v5.4c0 4.9-3.2 8.6-7.5 10-4.3-1.4-7.5-5.1-7.5-10V5.8z" fill="currentColor" fillOpacity=".14" />
                  <path d="M8.6 12l2.4 2.4 4.4-4.6" />
                </svg>
                Compliance
              </a>
            </div>
          </div>
          <div className="gcard rv gcalc">
            <div className="gch">
              <h3>Estimate your monthly minutes</h3>
              <a className="obtn" href="#estimate">Calculate</a>
            </div>
          </div>
          <p className="gnote">
            Rate cards are shared by email for your volume.
            {" "}
            <a href="/contact/">Talk to sales</a>
            .
          </p>
        </div>
      </section>
      <Estimator />
      <Integrations />
      <Faq items={[["What does TryVox cost?", "A one-time ₹100 setup fee, ₹399 monthly rent, and calls billed per minute on one account. Volume rate cards are available on request."], ["Is there a contract or lock-in?", "No. There is no lock-in, so you can stop any time."], ["How do I get volume rates?", "Use the estimator, then ask for a rate card from the contact page."], ["Is messaging billed separately?", "Voice and messaging run on one account and one bill."]]} />
    </>
  );
}
