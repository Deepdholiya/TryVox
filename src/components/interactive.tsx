"use client";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { IG, LOGOIMG, THF } from "@/content/site";
import { all, makeCtx, prefersReduced, useDom } from "@/lib/dom";
import { ThreeField } from "./ThreeField";

/* ---------- hero backdrop: typed telemetry snippets + Three.js field ---------- */
export function HeroFx({ variant = "wave" }: { variant?: "globe" | "wave" }) {
  const ref = useDom<HTMLDivElement>((el, c) => {
    all(el, "span").forEach((sp, idx) => {
      const t = sp.dataset.t || "";
      if (c.reduce) {
        sp.textContent = t;
        return;
      }
      let i = 0;
      let dir = 1;
      const step = () => {
        i += dir;
        sp.textContent = t.slice(0, i);
        if (i >= t.length) {
          dir = -1;
          c.after(2600 + Math.random() * 2000, step);
          return;
        }
        if (i <= 0) {
          dir = 1;
          c.after(600 + Math.random() * 1500, step);
          return;
        }
        c.after(dir > 0 ? 55 : 25, step);
      };
      c.after(idx * 450, step);
    });
  });
  return (
    <>
      <ThreeField variant={variant} />
      <div className="th-f" aria-hidden="true" ref={ref}>
        {THF.map((t, i) => (
          <span className="mono" style={{ "--i": i } as CSSProperties} data-t={t} key={t} />
        ))}
      </div>
    </>
  );
}

/* ---------- integrations: category list + vertical logo carousel ---------- */
export function Integrations({ id }: { id?: string }) {
  const [g, setG] = useState(0);
  const [k, setK] = useState(0);
  const hold = useRef(false);
  const sets = useRef<(HTMLDivElement | null)[]>([]);
  const tracks = useRef<(HTMLDivElement | null)[]>([]);
  const [shift, setShift] = useState(0);

  useEffect(() => {
    const place = () => {
      const set = sets.current[g];
      const tr = tracks.current[g];
      const card = tr?.children[k] as HTMLElement | undefined;
      if (!set || !card) return;
      setShift(set.clientHeight / 2 - (card.offsetTop + card.offsetHeight / 2));
    };
    place();
    addEventListener("resize", place);
    return () => removeEventListener("resize", place);
  }, [g, k]);

  useEffect(() => {
    if (prefersReduced()) return;
    const id = setInterval(() => {
      if (hold.current) return;
      setK((kk) => {
        if (kk + 1 >= IG[g][1].length) {
          setG((gg) => (gg + 1) % IG.length);
          return 0;
        }
        return kk + 1;
      });
    }, 2200);
    return () => clearInterval(id);
  }, [g]);

  const pick = (i: number) => {
    hold.current = true;
    setG(i);
    setK(0);
    setTimeout(() => (hold.current = false), 8000);
  };

  return (
    <section className="wrap sect intg" id={id} aria-labelledby="ig-h">
      <div className="ig rv" onMouseEnter={() => (hold.current = true)} onMouseLeave={() => (hold.current = false)}>
        <div className="ig-l">
          <div>
            <p className="tag">
              <i />
              Integrations
            </p>
            <h2 className="hd h2" id="ig-h">
              Connect with everything <em>you already run.</em>
            </h2>
            <p className="sub">Your agent platform, your voice stack and your channels, on one phone layer.</p>
          </div>
          <ul className="ig-cats mono">
            {IG.map(([name], i) => (
              <li key={name}>
                <button type="button" className={i === g ? "on" : undefined} aria-pressed={i === g} onClick={() => pick(i)}>
                  <i />
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="ig-t" aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
        <div className="ig-r">
          {IG.map(([name, items], i) => (
            <div className={`ig-set${i === g ? " on" : ""}`} key={name} ref={(n) => void (sets.current[i] = n)} aria-label={name} role="list">
              <div className="ig-tr" ref={(n) => void (tracks.current[i] = n)} style={i === g ? { transform: `translateY(${shift}px)` } : undefined}>
                {items.map((it, j) => {
                  const cls = `ig-c${i === g && j === k ? " on" : ""}${i === g && Math.abs(j - k) === 1 ? " near" : ""}`;
                  const logo = LOGOIMG[it];
                  return (
                    <div className={cls} key={it} role="listitem">
                      {logo ? <img src={`/assets/logos/${it}.svg`} alt={logo[0]} width={logo[1]} height={26} loading="lazy" /> : <em>{it}</em>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <i className="ig-glow" aria-hidden="true" />
      </div>
    </section>
  );
}

/* ---------- code panel: tabs, typed reveal, copy ---------- */
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const highlight = (src: string) =>
  esc(src)
    .split("\n")
    .map((l) =>
      /^\s*(#|\/\/)/.test(l)
        ? `<span class="c">${l}</span>`
        : l
            .replace(/("[^"]*"|'[^']*'|`[^`]*`)/g, '<span class="s">$1</span>')
            .replace(/\b(const|await|import|curl|X-TryVox-[A-Za-z-]+)\b/g, '<span class="k">$1</span>')
            .replace(/(\/\/ .*)$/, '<span class="c">$1</span>'),
    )
    .join("\n");

export function CodePanel({ code, children }: { code: Record<string, [string, string]>; children?: ReactNode }) {
  const keys = Object.keys(code);
  const [lang, setLang] = useState(keys[0]);
  const [shown, setShown] = useState<number | null>(null); // chars shown while typing; null = all
  const [copied, setCopied] = useState("Copy");
  const src = code[lang][1];

  useEffect(() => {
    if (shown === null) return;
    if (shown >= src.length) return setShown(null);
    const t = setTimeout(() => setShown(shown + 8), 16);
    return () => clearTimeout(t);
  }, [shown, src]);

  const html = useMemo(() => highlight(shown === null ? src : src.slice(0, shown)), [src, shown]);
  const choose = (k: string) => {
    setLang(k);
    setShown(prefersReduced() ? null : 0);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(src);
      setCopied("Copied");
    } catch {
      setCopied("Press ⌘C");
    }
    setTimeout(() => setCopied("Copy"), 1500);
  };

  return (
    <>
      <div className="code">
        <div className="code-top" role="tablist" aria-label="Code example">
          {keys.map((k) => (
            <button role="tab" key={k} aria-selected={k === lang} onClick={() => choose(k)}>
              {code[k][0]}
            </button>
          ))}
          <button className="copy" type="button" onClick={copy}>
            {copied}
          </button>
        </div>
        <pre tabIndex={0} aria-label={`${code[lang][0]} example`} dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      {children && <p className="note">{children}</p>}
    </>
  );
}

/* ---------- estimator: size your line ---------- */
const nf = (n: number) => Math.round(n).toLocaleString("en-IN");
export function Estimator() {
  const [calls, setCalls] = useState(50000);
  const [mins, setMins] = useState(2.5);
  const [hrs, setHrs] = useState(9);
  const [msg, setMsg] = useState<ReactNode>(null);
  const perHr = calls / (22 * hrs);
  const conc = Math.max(1, Math.ceil(((perHr * mins) / 60) * 2.5));
  const pct = (v: number, a: number, b: number) => ({ "--p": ((v - a) / (b - a)) * 100 + "%" }) as CSSProperties;
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const em = e.currentTarget.elements.namedItem("email") as HTMLInputElement;
    if (!em.value || !em.checkValidity()) {
      setMsg("Enter a valid work email.");
      em.focus();
      return;
    }
    const body = `Hi TryVox team,\n\nWe estimate ${nf(calls * mins)} minutes a month (${nf(calls)} calls, ${mins} min average) with about ${conc} peak concurrent calls. Could you share a rate card?\n\n${em.value}`;
    setMsg(
      <>
        Your sizing: {nf(calls * mins)} min a month, {conc} peak calls.{" "}
        <a href={`mailto:team@tryvox.io?subject=${encodeURIComponent("Rate card request")}&body=${encodeURIComponent(body)}`}>Email it to the team ↗</a>
      </>,
    );
  };
  return (
    <section className="wrap sect est" id="estimate" style={{ paddingTop: 20 }} aria-labelledby="est-h">
      <p className="tag rv">
        <i />
        Size your line
      </p>
      <h2 className="hd h2 rv" id="est-h">
        See what your calls <em>need.</em>
      </h2>
      <p className="sub rv">Move the sliders to estimate minutes and peak concurrent calls, then get a rate card for your volume.</p>
      <div className="sliders rv">
        <div className="sl">
          <label htmlFor="eCalls">
            Calls per month <output>{nf(calls)}</output>
          </label>
          <input type="range" id="eCalls" min={1000} max={1000000} step={1000} value={calls} style={pct(calls, 1000, 1000000)} onChange={(e) => setCalls(+e.target.value)} />
        </div>
        <div className="sl">
          <label htmlFor="eMin">
            Average call length <output>{mins} min</output>
          </label>
          <input type="range" id="eMin" min={0.5} max={10} step={0.5} value={mins} style={pct(mins, 0.5, 10)} onChange={(e) => setMins(+e.target.value)} />
        </div>
        <div className="sl">
          <label htmlFor="eHrs">
            Calling hours per day <output>{hrs} h</output>
          </label>
          <input type="range" id="eHrs" min={4} max={24} step={1} value={hrs} style={pct(hrs, 4, 24)} onChange={(e) => setHrs(+e.target.value)} />
        </div>
      </div>
      <div className="readout rv" aria-live="polite">
        <div>
          <b>{nf(calls * mins)}</b>
          <span>Minutes per month</span>
        </div>
        <div>
          <b>{conc}</b>
          <span>Peak concurrent calls</span>
        </div>
        <div>
          <b>{nf(perHr)}</b>
          <span>Calls per hour</span>
        </div>
        <div>
          <b>{Math.max(1, Math.ceil(conc / 10))}</b>
          <span>Numbers to start</span>
        </div>
      </div>
      <form className="est-cta rv" noValidate onSubmit={submit}>
        <input type="email" name="email" placeholder="you@company.com" aria-label="Work email" autoComplete="email" required />
        <button className="kbtn" type="submit">
          Get rate card
        </button>
      </form>
      <p className="est-msg" aria-live="polite">
        {msg}
      </p>
      <p className="fine">Assumes 22 calling days a month, a 2.5× peak over the hourly average and about 10 concurrent calls per number.</p>
    </section>
  );
}

/* ---------- industry picker (solution heroes) ---------- */
export function IndustrySelect({ current, items }: { current: string; items: { slug: string; name: string }[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const out = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("click", out);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("click", out);
      document.removeEventListener("keydown", esc);
    };
  }, []);
  return (
    <div className={`isel rv${open ? " open" : ""}`} ref={ref}>
      <span className="isel-k mono">Industry</span>
      <button type="button" className="isel-b mono" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen(!open)}>
        <i />
        {current}
        <svg className="chev" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M2 3.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>
      <div className="isel-m">
        {items.map((s) => (
          <a href={`/solutions/${s.slug}/`} className={s.name === current ? "on" : undefined} aria-current={s.name === current ? "page" : undefined} key={s.slug}>
            <i />
            {s.name}
          </a>
        ))}
      </div>
    </div>
  );
}

/* ---------- global: reveal on scroll, button press, card spotlight, header over dark bands ---------- */
export function SiteEffects() {
  const path = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");
    const [c, dispose] = makeCtx();
    // reveal
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        }),
      { rootMargin: "0px 0px -6% 0px" },
    );
    all(document, ".rv:not(.in)").forEach((n) => (n.getBoundingClientRect().top < innerHeight ? n.classList.add("in") : io.observe(n)));
    c.cleanup(() => io.disconnect());
    // header goes dark over dark bands and the top half of purple heroes
    const DK = ".cl,.c6,.how,.ahp";
    let was: boolean | null = null;
    c.frame(() => {
      const hd = document.getElementById("hdr");
      const y = (hd ? hd.offsetHeight : 60) + 2;
      const el = document.elementFromPoint(innerWidth / 2, y);
      let dk = false;
      if (el && !el.closest(".hdr,.mega,.sheet")) {
        const t = el.closest(".th");
        if (t) {
          const r = t.getBoundingClientRect();
          dk = (y - r.top) / r.height < 0.5;
        } else dk = !!el.closest(DK);
      }
      if (dk !== was) {
        was = dk;
        root.classList.toggle("hdr-dk", dk);
      }
    });
    return dispose;
  }, [path]);

  useEffect(() => {
    // press state on primary buttons, spotlight on cards (delegated once)
    const down = (e: PointerEvent) => (e.target as Element).closest?.(".kbtn")?.classList.add("down");
    const up = () => all(document, ".kbtn.down").forEach((b) => b.classList.remove("down"));
    const move = (e: PointerEvent) => {
      const cell = (e.target as Element).closest?.(".cell") as HTMLElement | null;
      if (!cell) return;
      const r = cell.getBoundingClientRect();
      cell.style.setProperty("--x", e.clientX - r.left + "px");
      cell.style.setProperty("--y", e.clientY - r.top + "px");
    };
    document.addEventListener("pointerdown", down);
    document.addEventListener("pointerup", up);
    document.addEventListener("pointercancel", up);
    document.addEventListener("pointermove", move, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerup", up);
      document.removeEventListener("pointercancel", up);
      document.removeEventListener("pointermove", move);
    };
  }, []);
  return null;
}

