/* Ported from the original static site. Edit freely: this file is now the source of truth. */
import { Breadcrumb, Faq, HeroFx, Integrations } from "@/components";

export const meta = { title: "Integrations: Vapi, Retell, ElevenLabs, LiveKit, Bolna | TryVox", description: "Connect TryVox Indian phone numbers to Vapi, Retell, ElevenLabs, LiveKit and Bolna voice agents, or any SIP stack." };

export function Body() {
  return (
    <>
      <Breadcrumb items={[["Integrations", null]]} path="/integrations/" />
      <section className="th h3t">
        <HeroFx />
        <div className="h3 wrap">
          <div className="h3-grid">
            <div className="h3-copy">
              <p className="tag">
                <i />
                Integrations
              </p>
              <h1 className="hd">
                Connect any agent to
                {" "}
                <em>a real phone line.</em>
              </h1>
              <p className="sub">
                Bind a TryVox number to Vapi, Retell, ElevenLabs, LiveKit or Bolna in a few clicks, or connect any SIP stack. No deployment, no SIP configuration.
              </p>
              <div className="cta">
                <a className="kbtn" href="https://app.tryvox.io/">Start free</a>
                <a className="obtn" href="https://docs.tryvox.io/ai-agents">Read the docs</a>
              </div>
              <div className="micro">
                <span>No lock-in</span>
                <span>Pay per minute</span>
                <span>Live in minutes</span>
              </div>
            </div>
            <div className="h3-vis rv">
              <div className="pm">
                <div className="pm-h">
                  <span className="pm-c">
                    <span>AI agents</span>
                    <span className="sep">›</span>
                    <span>Connect number</span>
                  </span>
                </div>
                <div className="pm-body">
                  <div className="mprov">
                    <span className="on">
                      <img src="/assets/logos/vapi.svg" alt="Vapi" width="55" height="18" />
                    </span>
                    <span>
                      <img src="/assets/logos/retell.svg" alt="Retell AI" width="65" height="18" />
                    </span>
                    <span><em>ElevenLabs</em></span>
                    <span>
                      <img src="/assets/logos/livekit.svg" alt="LiveKit" width="18" height="18" />
                    </span>
                    <span>
                      <img src="/assets/logos/bolna.svg" alt="Bolna" width="28" height="18" />
                    </span>
                    <span><em>+ more</em></span>
                  </div>
                  <div className="mrow">
                    <span>Number</span>
                    <span><span className="mono">+91 80 4718 2290</span></span>
                  </div>
                  <div className="mrow">
                    <span>Status</span>
                    <span><span className="pill">Connected</span></span>
                  </div>
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
            Agent platforms
          </p>
          <h2 className="hd h2">
            Setup guides for
            {" "}
            <em>every provider.</em>
          </h2>
        </div>
        <div className="tiles">
          <a className="tile rv" href="https://docs.tryvox.io/ai-agents/vapi">
            <span className="tl-i"><img src="/assets/logos/vapi.svg" alt="" width="55" height="20" /></span>
            <b>Vapi</b>
            <small>Bind a TryVox number to your Vapi agent.</small>
            <span className="go">↗</span>
          </a>
          <a className="tile rv" href="https://docs.tryvox.io/ai-agents/retell">
            <span className="tl-i"><img src="/assets/logos/retell.svg" alt="" width="65" height="20" /></span>
            <b>Retell</b>
            <small>Bind a TryVox number to your Retell agent.</small>
            <span className="go">↗</span>
          </a>
          <a className="tile rv" href="https://docs.tryvox.io/ai-agents/elevenlabs">
            <span className="tl-i"><em>ElevenLabs</em></span>
            <b>ElevenLabs</b>
            <small>Bind a TryVox number to your ElevenLabs agent.</small>
            <span className="go">↗</span>
          </a>
          <a className="tile rv" href="https://docs.tryvox.io/ai-agents/livekit">
            <span className="tl-i"><img src="/assets/logos/livekit.svg" alt="" width="18" height="20" /></span>
            <b>LiveKit</b>
            <small>Bind a TryVox number to your LiveKit agent.</small>
            <span className="go">↗</span>
          </a>
          <a className="tile rv" href="https://docs.tryvox.io/ai-agents/bolna">
            <span className="tl-i"><img src="/assets/logos/bolna.svg" alt="" width="28" height="20" /></span>
            <b>Bolna</b>
            <small>Bind a TryVox number to your Bolna agent.</small>
            <span className="go">↗</span>
          </a>
          <a className="tile rv" href="https://docs.tryvox.io/byoc">
            <span className="tl-i">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3.5" width="18" height="7" rx="2.2" fill="currentColor" fillOpacity=".14" />
                <rect x="3" y="13.5" width="18" height="7" rx="2.2" fill="currentColor" fillOpacity=".14" />
                <circle cx="7" cy="7" r="1" fill="currentColor" stroke="none" />
                <circle cx="7" cy="17" r="1" fill="currentColor" stroke="none" />
                <path d="M11 7h6M11 17h6" />
              </svg>
            </span>
            <b>Any SIP stack</b>
            <small>Connect your PBX, or bring your own carrier.</small>
            <span className="go">↗</span>
          </a>
        </div>
      </section>
      <section className="wrap r3s">
        <div className="r3">
          <div className="r3-copy rv">
            <p className="tag">
              <i />
              Bind
            </p>
            <h2 className="hd">
              Pick, connect,
              {" "}
              <em>answer.</em>
            </h2>
            <p>
              Choose a provider, pick a number and an agent, and confirm. Inbound calls to that number go straight to the agent.
            </p>
            <ul className="ticks">
              <li>One number binds to one agent</li>
              <li>No deployment or SIP configuration</li>
              <li>Remove the binding to fall back</li>
            </ul>
          </div>
          <div className="r3-vis rv">
            <div className="pm">
              <div className="pm-h">
                <span className="pm-c">
                  <span>AI agents</span>
                  <span className="sep">›</span>
                  <span>Connect number</span>
                </span>
              </div>
              <div className="pm-body">
                <div className="mprov">
                  <span className="on">
                    <img src="/assets/logos/vapi.svg" alt="Vapi" width="55" height="18" />
                  </span>
                  <span>
                    <img src="/assets/logos/retell.svg" alt="Retell AI" width="65" height="18" />
                  </span>
                  <span><em>ElevenLabs</em></span>
                  <span>
                    <img src="/assets/logos/livekit.svg" alt="LiveKit" width="18" height="18" />
                  </span>
                  <span>
                    <img src="/assets/logos/bolna.svg" alt="Bolna" width="28" height="18" />
                  </span>
                  <span><em>+ more</em></span>
                </div>
                <div className="mrow">
                  <span>Number</span>
                  <span><span className="mono">+91 80 4718 2290</span></span>
                </div>
                <div className="mrow">
                  <span>Status</span>
                  <span><span className="pill">Connected</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="r3 flip">
          <div className="r3-copy rv">
            <p className="tag">
              <i />
              Context
            </p>
            <h2 className="hd">
              Calls arrive
              {" "}
              <em>with context.</em>
            </h2>
            <p>
              Your agent receives direction, route, provider, caller and number in SIP headers.
            </p>
            <ul className="ticks">
              <li>X-TryVox-Direction and Route</li>
              <li>X-TryVox-From and To</li>
              <li>Outbound from agents: in progress</li>
            </ul>
          </div>
          <div className="r3-vis rv">
            <div className="pm">
              <div className="pm-h">
                <span className="pm-c">
                  <span>SIP headers</span>
                  <span className="sep">›</span>
                  <span>Inbound</span>
                </span>
              </div>
              <div className="pm-body">
                <pre className="mcode">
                  {"# Headers your agent receives on an inbound call # after you bind a TryVox number to it X-TryVox-Direction: inbound X-TryVox-Route: ai-agent X-TryVox-AI-Provider: vapi | elevenlabs | retell X-TryVox-From: <E.164 caller> X-TryVox-To: <E.164 TryVox number>"}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Integrations />
      <Faq items={[["Which agent platforms work with TryVox?", "Vapi, Retell, ElevenLabs, LiveKit and Bolna, plus any standards-based SIP stack."], ["Do I need to configure SIP for agent platforms?", "No. Binding a number to an agent needs no deployment or SIP configuration."], ["Can agents call out through TryVox?", "Outbound calls from agents are still in progress. Inbound calls work today."]]} />
    </>
  );
}
