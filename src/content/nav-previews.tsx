/* Ported from the original static site. Edit freely: this file is now the source of truth. */
import type { ReactElement } from "react";

/** Mini product previews shown in the Products mega menu. */
export const PREVIEWS: Record<string, ReactElement> = {
  "phone-numbers": (
    <div className="pv">
      <i className="pv-bar" />
      <div className="pv-s">
        <i />
        <b>Bengaluru</b>
      </div>
      <div className="pv-r">
        <b>+91 80 4718 2290</b>
        <em className="g" />
      </div>
      <div className="pv-r">
        <b>+91 80 4718 3301</b>
        <em className="g" />
      </div>
      <div className="pv-r">
        <b>1800 xxx xxxx</b>
        <em />
      </div>
    </div>
  ),
  "sip-trunking": (
    <div className="pv">
      <i className="pv-bar" />
      <div className="pv-r">
        <b>trunk-prod</b>
        <em className="g" />
      </div>
      <div className="pv-m">
        <i style={{ "--h": "40%" } as React.CSSProperties} />
        <i style={{ "--h": "70%" } as React.CSSProperties} />
        <i style={{ "--h": "55%" } as React.CSSProperties} />
        <i style={{ "--h": "85%" } as React.CSSProperties} />
        <i style={{ "--h": "60%" } as React.CSSProperties} />
        <i style={{ "--h": "75%" } as React.CSSProperties} />
        <i style={{ "--h": "45%" } as React.CSSProperties} />
      </div>
      <div className="pv-r">
        <b>30 channels</b>
        <em className="p" />
      </div>
    </div>
  ),
  "voice-api": (
    <div className="pv">
      <i className="pv-bar" />
      <div className="pv-code">
        <b>POST</b>
        {" "}
        /calls
      </div>
      <div className="pv-chip">201 · queued</div>
      <div className="pv-w">
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>
  ),
  "ai-agents": (
    <div className="pv">
      <i className="pv-bar" />
      <div className="pv-pr">
        <span className="on">Vapi</span>
        <span>Retell</span>
        <span>Bolna</span>
      </div>
      <div className="pv-r">
        <b>+91 80 4718 2290</b>
        <em className="g" />
      </div>
      <div className="pv-tg">
        <i />
        Connected
      </div>
    </div>
  ),
  "messaging": (
    <div className="pv">
      <i className="pv-bar" />
      <div className="pv-b a">Here is your payment link</div>
      <div className="pv-b c">Paid, thanks!</div>
      <div className="pv-chip">read</div>
    </div>
  ),
  "compliance": (
    <div className="pv">
      <i className="pv-bar" />
      <div className="pv-k">
        <i />
        Business KYC
      </div>
      <div className="pv-k">
        <i />
        Consent
      </div>
      <div className="pv-k">
        <i />
        DLT entity
      </div>
    </div>
  ),
};
