/* Ported from the original static site. Edit freely: this file is now the source of truth. */
import { Breadcrumb, CodePanel, Faq, HeroFx, Integrations } from "@/components";
import { CALL_RESP } from "@/content/code";

export const meta = { title: "Voice API Docs and Quickstart for Developers | TryVox", description: "Build on TryVox: REST API with HTTP Basic auth, VoxML call flows and webhooks for every call event. Place your first call in minutes." };

export function Body() {
  return (
    <>
      <Breadcrumb items={[["Developers", null]]} path="/developers/" />
      <section className="th h3t">
        <HeroFx />
        <div className="h3 wrap">
          <div className="h3-grid">
            <div className="h3-copy">
              <p className="tag">
                <i />
                Developers
              </p>
              <h1 className="hd">
                Build on
                {" "}
                <em>TryVox.</em>
              </h1>
              <p className="sub">
                A REST API at api.tryvox.io with HTTP Basic auth, VoxML for call flows and webhooks for every call event. Your first call takes minutes.
              </p>
              <div className="cta">
                <a className="kbtn" href="https://docs.tryvox.io/getting-started/quickstart">
                  Read the quickstart
                </a>
                <a className="obtn" href="https://app.tryvox.io/">Get API keys</a>
              </div>
              <div className="micro">
                <span>REST + JSON</span>
                <span>Signed webhooks</span>
                <span>VoxML</span>
              </div>
            </div>
            <div className="h3-vis rv">
              <div style={{ minWidth: "0" } as React.CSSProperties}>
                <CodePanel code={{"curl": ["cURL", "# Place an outbound call\ncurl -X POST https://api.tryvox.io/v1/voice/accounts/$TRYVOX_AUTH_ID/calls \\\n  -u $TRYVOX_AUTH_ID:$TRYVOX_AUTH_TOKEN \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"from\": \"+918047182290\",\n    \"to\": \"+919812345678\",\n    \"answer_url\": \"https://example.com/answer\",\n    \"hangup_url\": \"https://example.com/hangup\",\n    \"status_callback_url\": \"https://example.com/status\",\n    \"ring_timeout\": 30,\n    \"time_limit\": 3600\n  }'"], "node": ["Node", "// Place an outbound call\nconst { TRYVOX_AUTH_ID: id, TRYVOX_AUTH_TOKEN: token } = process.env;\n\nconst res = await fetch(`https://api.tryvox.io/v1/voice/accounts/${id}/calls`, {\n  method: \"POST\",\n  headers: {\n    Authorization: \"Basic \" + Buffer.from(`${id}:${token}`).toString(\"base64\"),\n    \"Content-Type\": \"application/json\",\n  },\n  body: JSON.stringify({\n    from: \"+918047182290\",\n    to: \"+919812345678\",\n    answer_url: \"https://example.com/answer\",\n    hangup_url: \"https://example.com/hangup\",\n  }),\n});\nconst { data } = await res.json(); // data.status === \"queued\""], "py": ["Python", "# Place an outbound call\nimport os, requests\n\nauth_id = os.environ[\"TRYVOX_AUTH_ID\"]\ncall = requests.post(\n    f\"https://api.tryvox.io/v1/voice/accounts/{auth_id}/calls\",\n    auth=(auth_id, os.environ[\"TRYVOX_AUTH_TOKEN\"]),\n    json={\n        \"from\": \"+918047182290\",\n        \"to\": \"+919812345678\",\n        \"answer_url\": \"https://example.com/answer\",\n        \"hangup_url\": \"https://example.com/hangup\",\n    },\n).json()[\"data\"]"], "auth": ["Auth", "# Every request uses HTTP Basic auth:\n# username = Auth ID, password = Auth Token (both from the dashboard)\n\ncurl -u $TRYVOX_AUTH_ID:$TRYVOX_AUTH_TOKEN \\\n  https://api.tryvox.io/v1/account/$TRYVOX_AUTH_ID/numbers"]}}>
                  Based on
                  {" "}
                  <a href="https://docs.tryvox.io/voice/make-call">Make a call</a>
                  {" "}
                  in the TryVox docs.
                </CodePanel>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="wrap sect tight">
        <div className="ctr rv">
          <p className="tag">
            <i />
            Quickstart
          </p>
          <h2 className="hd h2">
            Your first call in
            {" "}
            <em>four steps.</em>
          </h2>
        </div>
        <div className="s3s" style={{ "--n": "4" } as React.CSSProperties}>
          <i className="s3-line" />
          <div className="s3 rv">
            <span className="n">01</span>
            <h3>Get your keys</h3>
            <p>Copy your Auth ID and Auth Token from the dashboard.</p>
            <a href="https://docs.tryvox.io/getting-started/authentication">
              Read the guide ↗
            </a>
          </div>
          <div className="s3 rv">
            <span className="n">02</span>
            <h3>Buy a number</h3>
            <p>Search and buy a number to call from.</p>
            <a href="https://docs.tryvox.io/numbers/purchase">Read the guide ↗</a>
          </div>
          <div className="s3 rv">
            <span className="n">03</span>
            <h3>Place a call</h3>
            <p>POST from, to and answer_url to the calls endpoint.</p>
            <a href="https://docs.tryvox.io/voice/make-call">Read the guide ↗</a>
          </div>
          <div className="s3 rv">
            <span className="n">04</span>
            <h3>Handle webhooks</h3>
            <p>Receive ring, answer, status and hangup callbacks.</p>
            <a href="https://docs.tryvox.io/getting-started/webhooks">Read the guide ↗</a>
          </div>
        </div>
      </section>
      <section className="wrap r3s">
        <div className="r3">
          <div className="r3-copy rv">
            <p className="tag">
              <i />
              Webhooks
            </p>
            <h2 className="hd">
              Every stage,
              {" "}
              <em>in your system.</em>
            </h2>
            <p>
              Ring, answer, status and hangup callbacks, signed with your webhook secret.
            </p>
            <ul className="ticks">
              <li>ring_url, answer_url, hangup_url</li>
              <li>status_callback_url</li>
              <li>Signed with webhook_secret</li>
            </ul>
          </div>
          <div className="r3-vis rv">
            <div className="pm">
              <div className="pm-h">
                <span className="pm-c">
                  <span>Webhooks</span>
                  <span className="sep">›</span>
                  <span>Log</span>
                </span>
                <span className="pm-b"><span className="pill">Signed</span></span>
              </div>
              <div className="pm-body">
                <div className="mfeed">
                  <div className="msg ev">POST ring_url · 200</div>
                  <div className="msg ev ok">POST answer_url · VoxML</div>
                  <div className="msg ev">POST status_callback_url · 200</div>
                  <div className="msg ev">POST hangup_url · 200</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="r3 flip">
          <div className="r3-copy rv">
            <p className="tag">
              <i />
              Response
            </p>
            <h2 className="hd">
              Predictable
              {" "}
              <em>JSON responses.</em>
            </h2>
            <p>
              Every call returns a request_uuid and a status you can track through your webhooks.
            </p>
            <ul className="ticks">
              <li>201 Created with status queued</li>
              <li>request_uuid for every call</li>
              <li>Clear error codes</li>
            </ul>
          </div>
          <div className="r3-vis rv">
            <div className="pm">
              <div className="pm-h">
                <span className="pm-c">
                  <span>POST</span>
                  <span className="sep">›</span>
                  <span>/calls</span>
                </span>
                <span className="pm-b"><span className="pill">201</span></span>
              </div>
              <div className="pm-body">
                <pre className="mcode">
                  {CALL_RESP}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="wrap sect tight">
        <div className="ctr rv">
          <p className="tag">
            <i />
            Documentation
          </p>
          <h2 className="hd h2">
            Everything in
            {" "}
            <em>the docs.</em>
          </h2>
        </div>
        <div className="dmap">
          <div className="dgrp rv">
            <h3>
              <span className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M13 2.5L5 13.5h6l-1 8 8-11h-6z" fill="currentColor" fillOpacity=".14" />
                </svg>
              </span>
              Getting started
            </h3>
            <ul>
              <li>
                <a href="https://docs.tryvox.io/getting-started/quickstart">
                  Quickstart
                  <span>↗</span>
                </a>
              </li>
              <li>
                <a href="https://docs.tryvox.io/getting-started/authentication">
                  Authentication
                  <span>↗</span>
                </a>
              </li>
              <li>
                <a href="https://docs.tryvox.io/getting-started/errors">
                  Errors
                  <span>↗</span>
                </a>
              </li>
              <li>
                <a href="https://docs.tryvox.io/getting-started/webhooks">
                  Webhooks
                  <span>↗</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="dgrp rv">
            <h3>
              <span className="ic">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="2.5" y="10" width="2.6" height="4" rx="1.3" opacity=".45" />
                  <rect x="6.6" y="6.5" width="2.6" height="11" rx="1.3" opacity=".75" />
                  <rect x="10.7" y="3" width="2.6" height="18" rx="1.3" />
                  <rect x="14.8" y="7.5" width="2.6" height="9" rx="1.3" opacity=".75" />
                  <rect x="18.9" y="10" width="2.6" height="4" rx="1.3" opacity=".45" />
                </svg>
              </span>
              Voice API
            </h3>
            <ul>
              <li>
                <a href="https://docs.tryvox.io/voice/make-call">
                  Make a call
                  <span>↗</span>
                </a>
              </li>
              <li>
                <a href="https://docs.tryvox.io/voice/list-calls">
                  List calls
                  <span>↗</span>
                </a>
              </li>
              <li>
                <a href="https://docs.tryvox.io/voice/hangup">
                  Hang up
                  <span>↗</span>
                </a>
              </li>
              <li>
                <a href="https://docs.tryvox.io/voice/conferences">
                  Conferences
                  <span>↗</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="dgrp rv">
            <h3>
              <span className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3.5" width="7" height="6" rx="1.8" fill="currentColor" fillOpacity=".14" />
                  <rect x="14" y="14.5" width="7" height="6" rx="1.8" fill="currentColor" fillOpacity=".14" />
                  <path d="M6.5 9.5v3.5a2 2 0 002 2H14" />
                </svg>
              </span>
              VoxML
            </h3>
            <ul>
              <li>
                <a href="https://docs.tryvox.io/voxml/say">
                  Say
                  <span>↗</span>
                </a>
              </li>
              <li>
                <a href="https://docs.tryvox.io/voxml/gather">
                  Gather
                  <span>↗</span>
                </a>
              </li>
              <li>
                <a href="https://docs.tryvox.io/voxml/dial">
                  Dial
                  <span>↗</span>
                </a>
              </li>
              <li>
                <a href="https://docs.tryvox.io/voxml/stream">
                  Stream
                  <span>↗</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="dgrp rv">
            <h3>
              <span className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 3.5h3.6l1.9 4.8-2.4 1.5a11 11 0 005.6 5.6l1.5-2.4 4.8 1.9V18a2.5 2.5 0 01-2.5 2.5A16.5 16.5 0 012.5 6 2.5 2.5 0 015 3.5z" fill="currentColor" fillOpacity=".14" />
                  <path d="M15 3.5a5.5 5.5 0 015.5 5.5M15 7a2 2 0 012 2" />
                </svg>
              </span>
              Numbers
            </h3>
            <ul>
              <li>
                <a href="https://docs.tryvox.io/numbers/search">
                  Search
                  <span>↗</span>
                </a>
              </li>
              <li>
                <a href="https://docs.tryvox.io/numbers/purchase">
                  Purchase
                  <span>↗</span>
                </a>
              </li>
              <li>
                <a href="https://docs.tryvox.io/numbers/configure">
                  Configure
                  <span>↗</span>
                </a>
              </li>
              <li>
                <a href="https://docs.tryvox.io/caller-ids">
                  Verified caller IDs
                  <span>↗</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="dgrp rv">
            <h3>
              <span className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3.5" width="18" height="7" rx="2.2" fill="currentColor" fillOpacity=".14" />
                  <rect x="3" y="13.5" width="18" height="7" rx="2.2" fill="currentColor" fillOpacity=".14" />
                  <circle cx="7" cy="7" r="1" fill="currentColor" stroke="none" />
                  <circle cx="7" cy="17" r="1" fill="currentColor" stroke="none" />
                  <path d="M11 7h6M11 17h6" />
                </svg>
              </span>
              SIP trunking
            </h3>
            <ul>
              <li>
                <a href="https://docs.tryvox.io/sip-trunking/create-trunk">
                  Create a trunk
                  <span>↗</span>
                </a>
              </li>
              <li>
                <a href="https://docs.tryvox.io/sip-trunking/credentials">
                  Credentials
                  <span>↗</span>
                </a>
              </li>
              <li>
                <a href="https://docs.tryvox.io/sip-trunking/ip-acl">
                  IP ACL
                  <span>↗</span>
                </a>
              </li>
              <li>
                <a href="https://docs.tryvox.io/byoc">
                  BYOC
                  <span>↗</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="dgrp rv">
            <h3>
              <span className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="4" y="7" width="16" height="12.5" rx="3.5" fill="currentColor" fillOpacity=".14" />
                  <path d="M12 3.5V7M2 12v3M22 12v3" />
                  <circle cx="9" cy="12.5" r="1.3" fill="currentColor" stroke="none" />
                  <circle cx="15" cy="12.5" r="1.3" fill="currentColor" stroke="none" />
                  <path d="M9.5 16h5" />
                </svg>
              </span>
              AI agents
            </h3>
            <ul>
              <li>
                <a href="https://docs.tryvox.io/ai-agents/connect-provider">
                  Connect a provider
                  <span>↗</span>
                </a>
              </li>
              <li>
                <a href="https://docs.tryvox.io/ai-agents/connect-number">
                  Connect a number
                  <span>↗</span>
                </a>
              </li>
              <li>
                <a href="https://docs.tryvox.io/ai-agents/vapi">
                  Vapi
                  <span>↗</span>
                </a>
              </li>
              <li>
                <a href="https://docs.tryvox.io/ai-agents/retell">
                  Retell
                  <span>↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <Integrations />
      <Faq items={[["How does authentication work?", "HTTP Basic auth. Your Auth ID is the username and your Auth Token is the password."], ["Where do callbacks go?", "To the URLs you set on each call, such as answer_url, ring_url, hangup_url and status_callback_url."], ["Are webhooks signed?", "Yes. Set a webhook secret and TryVox signs callback requests with it."], ["Where is the full reference?", "At docs.tryvox.io."]]} />
    </>
  );
}
