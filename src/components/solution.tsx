/* Solution page layout (Arrakis industry rhythm). Server component; motion comes from ./behaviors. */
import type { CSSProperties, ReactNode } from "react";
import { APP, SOLUTIONS } from "@/content/site";
import type { Solution } from "@/content/solutions";
import { HorizontalCards, LiveConsole, ScrollFlow } from "./behaviors";
import { HeroFx, IndustrySelect } from "./interactive";
import { Bracket, Feed, Icon, SectionHead, Split } from "./ui";

const pad = (n: number) => String(n).padStart(2, "0");

export function SolutionHero({ d }: { d: Solution }) {
  const talk = d.call.filter((l) => l[0] !== "ev").slice(0, 3);
  return (
    <LiveConsole as="section" className="sh6 th">
      <HeroFx />
      <div className="wrap sh6-in">
        <p className="tag">
          <i />
          {d.name}
        </p>
        <Split as="h1">{d.h1}</Split>
        <p className="sub rv">{d.sub}</p>
        <div className="cta rv">
          <a className="kbtn" href={APP}>Start free</a>
          <a className="obtn" href="/contact/">Talk to sales</a>
        </div>
        <IndustrySelect current={d.name} items={SOLUTIONS} />
      </div>
      <div className="wrap sh6-stage rv">
        <Bracket className="lvb">
          <div className="lv" role="img" aria-label={`Example ${d.name.toLowerCase()} call handled by a voice agent on TryVox`}>
            <div className="lv-top">
              <span className="dot" />
              <b>{d.name} voice agent</b>
              <span className="live mono">Live</span>
              <span className="lv-t mlcd">00:00</span>
            </div>
            <div className="lv-steps">
              {d.flow.map(([k], i) => (
                <span className="lv-s" style={{ "--i": i } as CSSProperties} key={k}>
                  <i />
                  <b>{pad(i + 1)}</b>
                  {k}
                </span>
              ))}
            </div>
            <div className="lv-g">
              <div>
                <div className="lv-wave">
                  {Array.from({ length: 40 }, (_, i) => (
                    <i key={i} />
                  ))}
                </div>
                <Feed lines={talk} className="mfeed lv-feed" />
              </div>
              <div className="lv-ev">
                {d.flow.map(([k, v], i) => (
                  <div className="lv-e" style={{ "--i": i } as CSSProperties} key={k}>
                    <span className="mono">{k.toUpperCase()}</span>
                    <b>{v}</b>
                  </div>
                ))}
              </div>
            </div>
            <div className="lv-ft">
              <span className="mono">Outcome</span>
              <p>{d.result}</p>
            </div>
          </div>
        </Bracket>
      </div>
    </LiveConsole>
  );
}

export function Challenge({ d }: { d: Solution }) {
  const cards: [string, ReactNode][] = [
    ["phone", d.uses[0].body],
    ["route", d.uses[1].body],
    ["mail", d.uses[2].body],
    ["eye", "Every call logged with events, records and optional recordings"],
    ["shield", "Compliance built in: business KYC, consent records and DLT-ready SMS"],
  ];
  return (
    <HorizontalCards as="section" className="hx" style={{ "--n": cards.length } as CSSProperties}>
      <div className="hx-st">
        <div className="wrap hx-h">
          <SectionHead tag="The challenge" sub="What changes when every call runs on TryVox. Keep scrolling.">
            {d.challenge}
          </SectionHead>
          <span className="mono hx-c" aria-hidden="true">
            <b>01</b> / {pad(cards.length)}
          </span>
        </div>
        <div className="hx-v">
          <div className="hx-t">
            {cards.map(([ic, t], i) => (
              <div className="hc" key={i}>
                <span className="mono hc-n">{pad(i + 1)}</span>
                <span className="cr-i">
                  <Bracket>
                    <Icon name={ic} bare />
                  </Bracket>
                </span>
                <p>{t}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="wrap">
          <div className="hx-bar">
            <i />
          </div>
        </div>
      </div>
    </HorizontalCards>
  );
}

export function CallFlow({ d }: { d: Solution }) {
  const counts = [1, 3, 5, 8];
  return (
    <ScrollFlow as="section" className="c6" style={{ "--n": d.flow.length } as CSSProperties}>
      <div className="c6-st">
        <div className="wrap cl-g">
          <div>
            <SectionHead tag="Call flow" sub="Scroll through one call, from the trigger to the follow-up." dark>
              From first call <em>to full scale.</em>
            </SectionHead>
            <div className="c6-acc">
              <div className="c6-rail" aria-hidden="true">
                <i />
              </div>
              {d.flow.map(([k, v], i) => (
                <div className={`c6-i${i === 0 ? " on" : ""}`} data-i={i} key={k}>
                  <span className="c6-n mono">{pad(i + 1)}</span>
                  <div>
                    <b>{k}</b>
                    <p>
                      <span>{v}.</span> {d.did[i]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="cl-chart" aria-hidden="true">
            <span className="cl-y mono">Value</span>
            <div className="cl-cols">
              {d.flow.map(([k], i) => (
                <div className="cl-col" data-i={i} key={k}>
                  <span className="cl-t">{k}</span>
                  <div className="cl-st">
                    {Array.from({ length: counts[i % 4] }, (_, j) => (
                      <i style={{ "--j": j } as CSSProperties} key={j} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="c6-pct mono">
              <b>0</b>% of the flow complete
            </div>
          </div>
        </div>
      </div>
    </ScrollFlow>
  );
}
