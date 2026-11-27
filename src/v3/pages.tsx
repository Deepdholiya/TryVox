/* Product and solution page templates. */
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { PRODUCTS, SOLUTIONS } from "@/content/site";
import { PRODUCT_EXTRA } from "@/content/v3/product-extra";
import type { Product, Visual } from "@/content/v3/products";
import type { Solution } from "@/content/v3/solutions";
import { Code } from "./client";
import { ClientLogos, ComplianceBlock, CtaBand, Faq, Ic, PageHero, Panel, Sec, SecHead, Ticks } from "./ui";

/** "Words with [highlight]" → ReactNode */
export function hl(s: string): ReactNode {
  return s.split(/(\[[^\]]+\])/).map((t, i) => (t.startsWith("[") ? <span className="hl" key={i}>{t.slice(1, -1)}</span> : t));
}

export function HeroVisual({ v }: { v: Visual }) {
  return (
    <Panel path={v.path} right={v.right} ok={v.kind === "kv"} foot={v.foot.map((f) => <span key={f}>{f}</span>)}>
      {v.kind === "seq" ? (
        <div className="seq dots">
          <div className="seq-h" aria-hidden="true">
            {v.cols.map((c, i) => (
              <span key={c} className={i === 1 ? "us" : undefined}>
                <i>{i === 1 ? "T" : c[0]}</i>
                {c}
              </span>
            ))}
          </div>
          <div className="seq-b" aria-hidden="true">
            {v.rows.map(([seg, dir, label, ok], i) => (
              <div className="seq-r" key={i}>
                <span className={`${seg} ${dir}${ok ? " ok" : ""}`}>
                  <b>{label}</b>
                </span>
              </div>
            ))}
          </div>
          <ol className="sr-only">
            {v.rows.map(([seg, dir, label], i) => {
              const [a, b] = seg === "a" ? [0, 1] : seg === "b" ? [1, 2] : [0, 2];
              const [from, to] = dir === "lr" ? [v.cols[a], v.cols[b]] : [v.cols[b], v.cols[a]];
              return <li key={i}>{`${from} to ${to}: ${label}`}</li>;
            })}
          </ol>
        </div>
      ) : (
        <dl className="kv">
          {v.rows.map(([k, val]) => (
            <div key={k}>
              <dt className="k">{k}</dt>
              <dd className="v">{val}</dd>
            </div>
          ))}
        </dl>
      )}
    </Panel>
  );
}

function OptionCards({ items }: { items: { path: string; tag: string; title: string; body: string; points: string[] }[] }) {
  return (
    <div className="opts" style={items.length === 3 ? { gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" } : undefined}>
      {items.map((o) => (
        <article className="pn" key={o.path}>
          <div className="pn-bar">
            <span>{o.path}</span>
            <span className="r">{o.tag}</span>
          </div>
          <div className="pn-body">
            <h3 className="h3">{o.title}</h3>
            <p className="body">{o.body}</p>
            <Ticks items={o.points} />
          </div>
        </article>
      ))}
    </div>
  );
}

function Related({ slugs, n }: { slugs: string[]; n: string }) {
  const items = PRODUCTS.filter((p) => slugs.includes(p.slug));
  return (
    <Sec id="rel-h">
      <SecHead n={n} label="Built with" id="rel-h">
        The TryVox products behind it.
      </SecHead>
      <div className="stage" style={{ gridTemplateColumns: `repeat(auto-fit,minmax(220px,1fr))` }}>
        {items.map((p) => (
          <div key={p.slug}>
            <ul>
              <li>
                <a href={`/products/${p.slug}/`}>
                  <Ic name={p.icon} />
                  <span>
                    <b>{p.name}</b>
                    <small>{p.desc}</small>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </Sec>
  );
}

export function ProductView({ d, slug }: { d: Product; slug: string }) {
  const me = PRODUCTS.find((p) => p.slug === slug)!;
  const sib = PRODUCTS.filter((p) => p.slug !== slug && p.group === me.group);
  const tags = [...sib, ...PRODUCTS.filter((p) => p.slug !== slug && p.group !== me.group)].slice(0, 3).map((p) => [p.icon, p.name] as [string, string]);
  const x = PRODUCT_EXTRA[slug];
  let n = 0;
  const nx = () => String(++n).padStart(2, "0");
  return (
    <main id="top">
      <PageHero
        variant="light"
        tags={tags}
        crumbs={[["Products", "/#stack"], [d.name, ""]]}
        chip={
          <>
            <i className="dot" /> {d.chip}
          </>
        }
        h1={hl(d.h1)}
        lead={d.lead}
        stats={d.stats}
        visual={<HeroVisual v={d.visual} />}
      />
      <ClientLogos />
      {x && (
        <Sec id="how-h">
          <SecHead n={nx()} label="How it works" id="how-h" lead={`From sign-up to a working setup with ${d.name}.`}>
            Live in three steps.
          </SecHead>
          <ol className="how3">
            {x.how.map(([t, p], i) => (
              <li key={t}>
                <span className="how3-n">0{i + 1}</span>
                <h3 className="h3">{t}</h3>
                <p className="small">{p}</p>
              </li>
            ))}
          </ol>
        </Sec>
      )}
      <Sec id="two-h" className={x ? "tint" : undefined}>
        <SecHead n={nx()} label={d.two.label} id="two-h" lead={d.two.lead}>
          {d.two.heading}
        </SecHead>
        <OptionCards items={d.two.items} />
      </Sec>
      <Sec id="feat-h" className={x ? undefined : "tint"}>
        <SecHead n={nx()} label="Capabilities" id="feat-h" lead={d.feat.lead}>
          {d.feat.heading}
        </SecHead>
        <div className="feat">
          {d.feat.groups.map(([cap, t, pts]) => (
            <div key={cap}>
              <p className="cap">{cap}</p>
              <h3 className="h3">{t}</h3>
              <Ticks items={pts} />
            </div>
          ))}
        </div>
      </Sec>
      {x && (
        <Sec id="fit-h" className="tint">
          <SecHead n={nx()} label="Where it fits" id="fit-h" lead="Works with the agent platform you already use, in the industries that call the most.">
            Your stack, your industry.
          </SecHead>
          <div className="fit">
            <div className="fit-l">
              <p className="cap">Works with</p>
              <ul>
                {x.works.map((w) => (
                  <li key={w}>
                    <BrandLogo id={w} size={22} />
                  </li>
                ))}
                <li className="fit-any">Any SIP stack</li>
              </ul>
              <a className="tl" href="/integrations/">
                All integrations →
              </a>
            </div>
            <div className="fit-r">
              <p className="cap">Used for</p>
              <ul>
                {x.uses.map((u) => {
                  const so = SOLUTIONS.find((v) => v.slug === u)!;
                  return (
                    <li key={u}>
                      <a href={`/solutions/${u}/`}>
                        <Ic name={so.icon} />
                        <span>
                          <b>{so.name}</b>
                          <small>{so.desc}</small>
                        </span>
                        <span aria-hidden="true">→</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Sec>
      )}
      {d.code && (
        <Sec id="code-h">
          <SecHead n={nx()} label="For developers" id="code-h" lead="Copy, paste, and swap in your Auth ID and Auth Token from the dashboard.">
            See it in code.
          </SecHead>
          <Code path={d.code.path} tabs={d.code.tabs} foot={<a href="https://docs.tryvox.io">Full reference on docs.tryvox.io ↗</a>} />
        </Sec>
      )}
      <ComplianceBlock n={nx()} />
      <Faq items={d.faq} n={nx()} title={`${d.name}: common questions`} />
      <div style={{ height: "var(--sec)" }} />
      <CtaBand />
    </main>
  );
}

export function SolutionView({ d, slug }: { d: Solution; slug: string }) {
  const me = SOLUTIONS.find((x) => x.slug === slug)!;
  const tags = d.products.slice(0, 3).map((x) => PRODUCTS.find((p) => p.slug === x)!).map((p) => [p.icon, p.name] as [string, string]);
  return (
    <main id="top">
      <PageHero
        variant="dark"
        tags={tags}
        crumbs={[["Solutions", "/#stack"], [d.name, ""]]}
        chip={
          <>
            <i className="dot" /> {d.chip}
          </>
        }
        h1={hl(d.h1)}
        lead={d.lead}
        visual={
          <Panel path={d.call.path} right={d.call.right}>
            <ol className="trace">
              {d.call.lines.map(([w, t], i) => (
                <li key={i} className={`on ${w === "a" ? "say" : w === "c" ? "caller" : ""}`}>
                  <span className="t">{w === "ev" || w === "ok" ? "event" : "speech"}</span>
                  <span className="k" style={w === "ok" ? { color: "var(--ok)" } : undefined}>
                    {w === "a" ? "Agent" : w === "c" ? "Caller" : w === "ok" ? "Done" : "Call"}
                  </span>
                  <span className="v">{t}</span>
                </li>
              ))}
            </ol>
          </Panel>
        }
      />
      <ClientLogos />
      <Sec id="pain-h">
        <SecHead n="01" label="The problem" id="pain-h">
          Where calls go wrong today.
        </SecHead>
        <div className="feat">
          {d.pains.map(([t, p], i) => (
            <div key={t}>
              <p className="cap">Problem {String(i + 1).padStart(2, "0")}</p>
              <h3 className="h3">{t}</h3>
              <p className="small">{p}</p>
            </div>
          ))}
        </div>
      </Sec>
      <Sec id="use-h" className="tint">
        <SecHead n="02" label="Use cases" id="use-h" lead="Your agent runs the conversation. TryVox handles the line, the rules and the follow-up.">
          What teams run on TryVox.
        </SecHead>
        <OptionCards items={d.uses} />
      </Sec>
      <Sec id="flow-h">
        <SecHead n="03" label="Example flow" id="flow-h">
          One call, start to finish.
        </SecHead>
        <ol className="steps">
          {d.flow.map(([k, v], i) => (
            <li key={k}>
              <span className="n">
                0{i + 1} · {k}
              </span>
              <h3 className="h3">{v}</h3>
            </li>
          ))}
        </ol>
      </Sec>
      <Related slugs={d.products} n="04" />
      <ComplianceBlock n="05" />
      <Faq items={d.faq} n="06" title={`${d.name}: common questions`} />
      <div style={{ height: "var(--sec)" }} />
      <CtaBand />
    </main>
  );
}
