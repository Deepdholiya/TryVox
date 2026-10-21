/* Ported from the original static site. Edit freely: this file is now the source of truth. */
import { AboutProblems, Breadcrumb, HeroFx, Integrations, Split } from "@/components";

export const meta = { title: "About TryVox: Telephony Infrastructure for Voice AI | TryVox", description: "TryVox builds telephony infrastructure for voice AI: numbers, SIP, voice APIs and messaging. Built in India by Tryjolt Solutions." };

export function Body() {
  return (
    <>
      <Breadcrumb items={[["About", null]]} path="/about/" />
      <div className="abx">
        <section className="th ab-h">
          <HeroFx />
          <div className="wrap">
            <p className="tag">
              <i />
              Why TryVox
            </p>
            <Split as="h1" className="hd split">
              Voice AI moved fast.
              {" "}
              <em>The phone network didn’t.</em>
            </Split>
            <p className="sub rv">
              Teams can build a great voice agent in a week, then spend months on carriers, KYC and SIP. TryVox exists to close that gap for every agent, in India and beyond.
            </p>
            <div className="cta rv">
              <a className="kbtn" href="https://app.tryvox.io/">Start free</a>
              <a className="obtn" href="/contact/">Contact us</a>
            </div>
          </div>
        </section>
        <AboutProblems as="section" className="abp" style={{ "--n": "4" } as React.CSSProperties}>
          <div className="abp-st">
            <div className="wrap">
              <div className="brk abf">
                <i className="b1" />
                <i className="b2" />
                <i className="b3" />
                <i className="b4" />
                <div className="abp-g">
                  <div className="abp-l">
                    <div className="ab-p on" data-i="0"><h3 className="hd">Telephony wasn't built for agents</h3><p className="ab-pd"><span>Carriers, trunks and IVRs were designed for human call centres, so every voice AI team rebuilds the same plumbing.</span></p></div>
                    <div className="ab-p" data-i="1"><h3 className="hd">Compliance slows every launch</h3><p className="ab-pd"><span>KYC, consent and DLT rules turn a two-day agent launch into a month of paperwork.</span></p></div>
                    <div className="ab-p" data-i="2"><h3 className="hd">Numbers get locked in</h3><p className="ab-pd"><span>Numbers bought inside an agent platform make it painful to switch providers or run more than one.</span></p></div>
                    <div className="ab-p" data-i="3"><h3 className="hd">Calls happen in a black box</h3><p className="ab-pd"><span>Without events and records, teams can't see why calls drop, ring out or never connect.</span></p></div>
                  </div>
                  <div className="abp-t" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                  <div className="abp-r">
                    <p className="ab-d on" data-i="0">
                      Carriers, trunks and IVRs were designed for human call centres, so every voice AI team rebuilds the same plumbing.
                    </p>
                    <p className="ab-d" data-i="1">
                      KYC, consent and DLT rules turn a two-day agent launch into a month of paperwork.
                    </p>
                    <p className="ab-d" data-i="2">
                      Numbers bought inside an agent platform make it painful to switch providers or run more than one.
                    </p>
                    <p className="ab-d" data-i="3">
                      Without events and records, teams can't see why calls drop, ring out or never connect.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AboutProblems>
        <section className="wrap sect tight">
          <div className="shd c rv">
            <p className="tag">
              <i />
              What we build
            </p>
            <h2 className="hd h2">
              Designed for production,
              {" "}
              <em>not prototypes.</em>
            </h2>
            <p className="sub">Four principles behind every TryVox product.</p>
          </div>
          <div className="ab-cs">
            <div className="ab-c rv">
              <span className="cr-i">
                <div className="brk">
                  <i className="b1" />
                  <i className="b2" />
                  <i className="b3" />
                  <i className="b4" />
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="6" cy="6" r="2.5" fill="currentColor" fillOpacity=".14" />
                    <circle cx="18" cy="18" r="2.5" fill="currentColor" fillOpacity=".14" />
                    <path d="M8.5 6H15a3 3 0 010 6H9a3 3 0 000 6h6.5" />
                  </svg>
                </div>
              </span>
              <h3>Infrastructure only</h3>
              <p>
                We never build agents, so platforms and builders can run on us without feeding a competitor.
              </p>
            </div>
            <div className="ab-c rv">
              <span className="cr-i">
                <div className="brk">
                  <i className="b1" />
                  <i className="b2" />
                  <i className="b3" />
                  <i className="b4" />
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 2.8l7.5 3v5.4c0 4.9-3.2 8.6-7.5 10-4.3-1.4-7.5-5.1-7.5-10V5.8z" fill="currentColor" fillOpacity=".14" />
                    <path d="M8.6 12l2.4 2.4 4.4-4.6" />
                  </svg>
                </div>
              </span>
              <h3>India-first compliance</h3>
              <p>
                KYC, consent, DLT and verified caller IDs are product requirements, not afterthoughts.
              </p>
            </div>
            <div className="ab-c rv">
              <span className="cr-i">
                <div className="brk">
                  <i className="b1" />
                  <i className="b2" />
                  <i className="b3" />
                  <i className="b4" />
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="16" rx="3" fill="currentColor" fillOpacity=".14" />
                    <path d="M9.5 9.5L7 12l2.5 2.5M14.5 9.5L17 12l-2.5 2.5" />
                  </svg>
                </div>
              </span>
              <h3>Developer control</h3>
              <p>
                Numbers, calls, routing and webhooks as primitives your engineers can build on.
              </p>
            </div>
            <div className="ab-c rv">
              <span className="cr-i">
                <div className="brk">
                  <i className="b1" />
                  <i className="b2" />
                  <i className="b3" />
                  <i className="b4" />
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" fill="currentColor" fillOpacity=".14" />
                    <circle cx="12" cy="12" r="2.8" />
                  </svg>
                </div>
              </span>
              <h3>Observable by default</h3>
              <p>Events, records and recordings for every call and message.</p>
            </div>
          </div>
        </section>
        <section className="wrap sect tight">
          <div className="ab-rg">
            <div>
              <div className="shd rv">
                <p className="tag">
                  <i />
                  Roadmap
                </p>
                <h2 className="hd h2">
                  From first number
                  {" "}
                  <em>to full scale.</em>
                </h2>
                <p className="sub">How teams go live on TryVox.</p>
              </div>
              <div className="ab-rl">
                <div className="ab-r rv">
                  <span className="mono">01</span>
                  <div>
                    <h3>Sign up and verify</h3>
                    <p>Create an account and complete business KYC online.</p>
                  </div>
                </div>
                <div className="ab-r rv">
                  <span className="mono">02</span>
                  <div>
                    <h3>Get a number</h3>
                    <p>Pick local, national or toll-free numbers in the cities you call.</p>
                  </div>
                </div>
                <div className="ab-r rv">
                  <span className="mono">03</span>
                  <div>
                    <h3>Connect your agent</h3>
                    <p>Bind Vapi, Retell, ElevenLabs, LiveKit or Bolna, or any SIP stack.</p>
                  </div>
                </div>
                <div className="ab-r rv">
                  <span className="mono">04</span>
                  <div>
                    <h3>Scale with volume</h3>
                    <p>Add numbers, trunks and channels, and move to volume rates.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="ab-fc rv">
              <div className="ab-fw">
                <div className="ab-fb" style={{ "--i": "0" } as React.CSSProperties}>
                  <span className="ab-fi">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="11" cy="11" r="6.5" fill="currentColor" fillOpacity=".14" />
                      <path d="M16 16l4.5 4.5" />
                    </svg>
                  </span>
                  <span>
                    <b>Verify</b>
                    <small>Business KYC online</small>
                  </span>
                </div>
                <div className="ab-fb" style={{ "--i": "1" } as React.CSSProperties}>
                  <span className="ab-fi">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 3.5h3.6l1.9 4.8-2.4 1.5a11 11 0 005.6 5.6l1.5-2.4 4.8 1.9V18a2.5 2.5 0 01-2.5 2.5A16.5 16.5 0 012.5 6 2.5 2.5 0 015 3.5z" fill="currentColor" fillOpacity=".14" />
                      <path d="M15 3.5a5.5 5.5 0 015.5 5.5M15 7a2 2 0 012 2" />
                    </svg>
                  </span>
                  <span>
                    <b>Number</b>
                    <small>Local, national, toll-free</small>
                  </span>
                </div>
                <div className="ab-fb" style={{ "--i": "2" } as React.CSSProperties}>
                  <span className="ab-fi">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="4" y="7" width="16" height="12.5" rx="3.5" fill="currentColor" fillOpacity=".14" />
                      <path d="M12 3.5V7M2 12v3M22 12v3" />
                      <circle cx="9" cy="12.5" r="1.3" fill="currentColor" stroke="none" />
                      <circle cx="15" cy="12.5" r="1.3" fill="currentColor" stroke="none" />
                      <path d="M9.5 16h5" />
                    </svg>
                  </span>
                  <span>
                    <b>Agent</b>
                    <small>Bind in a few clicks</small>
                  </span>
                </div>
                <div className="ab-fb" style={{ "--i": "3" } as React.CSSProperties}>
                  <span className="ab-fi">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <rect x="2.5" y="10" width="2.6" height="4" rx="1.3" opacity=".45" />
                      <rect x="6.6" y="6.5" width="2.6" height="11" rx="1.3" opacity=".75" />
                      <rect x="10.7" y="3" width="2.6" height="18" rx="1.3" />
                      <rect x="14.8" y="7.5" width="2.6" height="9" rx="1.3" opacity=".75" />
                      <rect x="18.9" y="10" width="2.6" height="4" rx="1.3" opacity=".45" />
                    </svg>
                  </span>
                  <span>
                    <b>Calls</b>
                    <small>Events for every call</small>
                  </span>
                </div>
                <div className="ab-fb" style={{ "--i": "4" } as React.CSSProperties}>
                  <span className="ab-fi">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="8.5" fill="currentColor" fillOpacity=".14" />
                      <path d="M9 8h6M9 10.5h6M9 8c2.6 0 3.6 1.2 3.6 2.6S11.5 13 9 13l4.5 4" />
                    </svg>
                  </span>
                  <span>
                    <b>Scale</b>
                    <small>Volume rates as you grow</small>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="wrap sect tight">
          <div className="shd c rv">
            <p className="tag">
              <i />
              Who we are
            </p>
            <h2 className="hd h2">
              Built in India by
              {" "}
              <em>Tryjolt Solutions.</em>
            </h2>
            <p className="sub">
              A telephony team for voice AI, focused on reliable calls and compliance that just works.
            </p>
          </div>
          <div className="ab-bg">
            <p className="ab-st hd">
              We believe every AI agent deserves a real phone line, and every team should be able to give it one in minutes.
            </p>
            <div>
              <div className="ab-b rv">
                <div className="ab-art">
                  <div className="brk">
                    <i className="b1" />
                    <i className="b2" />
                    <i className="b3" />
                    <i className="b4" />
                    <svg viewBox="0 0 200 120" aria-hidden="true">
                      <path className="a-wave" d="M10 60 C 35 -10, 60 130, 85 60 S 135 -10, 160 60 S 190 100, 190 60" />
                      <line x1="10" y1="60" x2="190" y2="60" className="a-dot" />
                      <circle cx="10" cy="60" r="3" />
                      <circle cx="190" cy="60" r="3" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3>We stay infrastructure</h3>
                  <p>
                    We build the phone layer and nothing else, so we are never your competitor.
                  </p>
                </div>
              </div>
              <div className="ab-b rv">
                <div className="ab-art">
                  <div className="brk">
                    <i className="b1" />
                    <i className="b2" />
                    <i className="b3" />
                    <i className="b4" />
                    <svg viewBox="0 0 200 120" aria-hidden="true">
                      <rect x="40" y="5" width="120" height="110" className="a-sq" />
                      <rect x="65" y="28" width="70" height="64" className="a-sq s2" />
                      <rect x="88" y="49" width="24" height="22" className="a-sq s3" />
                      <path d="M40 5 L88 49 M160 5 L112 49 M40 115 L88 71 M160 115 L112 71" className="a-dot" />
                      <circle cx="100" cy="60" r="3" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3>We move fast</h3>
                  <p>
                    Self-serve numbers, online KYC and docs that match the product mean you ship in days.
                  </p>
                </div>
              </div>
              <div className="ab-b rv">
                <div className="ab-art">
                  <div className="brk">
                    <i className="b1" />
                    <i className="b2" />
                    <i className="b3" />
                    <i className="b4" />
                    <svg viewBox="0 0 200 120" aria-hidden="true">
                      <ellipse cx="100" cy="70" rx="85" ry="40" className="a-el" />
                      <ellipse cx="100" cy="72" rx="62" ry="29" className="a-el e2" />
                      <ellipse cx="100" cy="74" rx="40" ry="19" className="a-el e3" />
                      <line x1="100" y1="0" x2="100" y2="120" className="a-dot" />
                      <circle cx="100" cy="76" r="3" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3>We go deep on telecom</h3>
                  <p>
                    Routing, compliance and call quality in India are our day job, not a side project.
                  </p>
                </div>
              </div>
              <div className="ab-b rv">
                <div className="ab-art">
                  <div className="brk">
                    <i className="b1" />
                    <i className="b2" />
                    <i className="b3" />
                    <i className="b4" />
                    <svg viewBox="0 0 200 120" aria-hidden="true">
                      <circle cx="100" cy="42" r="34" className="a-c" />
                      <circle cx="78" cy="80" r="34" className="a-c c2" />
                      <circle cx="122" cy="80" r="34" className="a-c c3" />
                      <path d="M100 8 L66 104 L134 104 Z" className="a-dot" />
                      <circle cx="100" cy="68" r="3" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3>We own reliability</h3>
                  <p>
                    Every call produces events and records, so problems are visible and fixable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Integrations />
      <div className="abx">
        <section className="ab-cta">
          <svg className="ab-orb" viewBox="0 0 1000 440" aria-hidden="true">
            <ellipse cx="500" cy="220" rx="480" ry="200" />
            <ellipse className="d" cx="500" cy="220" rx="410" ry="160" />
            <circle r="5">
              <animateMotion dur="14s" repeatCount="indefinite" path="M20,220 a480,200 0 1,0 960,0 a480,200 0 1,0 -960,0" />
            </circle>
            <circle className="s" r="3">
              <animateMotion dur="10s" repeatCount="indefinite" path="M910,220 a410,160 0 1,0 -820,0 a410,160 0 1,0 820,0" />
            </circle>
          </svg>
          <div className="wrap">
            <p className="tag">
              <i />
              Get started
            </p>
            <h2 className="hd h2">
              Give every agent
              {" "}
              <em>a real phone line.</em>
            </h2>
            <div className="cta">
              <a className="kbtn" href="https://app.tryvox.io/">Start free</a>
              <a className="obtn" href="/contact/">Contact us</a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
