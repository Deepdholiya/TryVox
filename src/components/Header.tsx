"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { APP, PRODUCTS, SOLUTIONS, STAGES } from "@/content/site";
import { Icon, LogoFull } from "./ui";

const Chev = () => (
  <svg className="chev" viewBox="0 0 10 10" aria-hidden="true">
    <path d="M2 3.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);
const RChev = () => (
  <svg className="rch" viewBox="0 0 10 10" aria-hidden="true">
    <path d="M3.5 2l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

function Mega({ id, label, open, setOpen, children }: { id: string; label: string; open: string | null; setOpen: (v: string | null) => void; children: React.ReactNode }) {
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  const isOpen = open === id;
  return (
    <li
      className={`has-mega${isOpen ? " open" : ""}`}
      onMouseEnter={() => {
        clearTimeout(t.current);
        setOpen(id);
      }}
      onMouseLeave={() => {
        t.current = setTimeout(() => setOpen(null), 140);
      }}
    >
      <button className="nl" aria-expanded={isOpen} aria-controls={`mega-${id}`} onClick={() => setOpen(isOpen ? null : id)}>
        {label} <Chev />
      </button>
      {children}
    </li>
  );
}

export function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [sheet, setSheet] = useState(false);
  const [acc, setAcc] = useState<string | null>(null);
  const path = usePathname();

  useEffect(() => {
    setOpen(null);
    setSheet(false);
  }, [path]);
  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", sheet);
    if (!sheet) setAcc(null);
  }, [sheet]);
  useEffect(() => {
    const root = document.documentElement;
    const on = () => root.classList.toggle("hdr-float", scrollY > 24);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // return focus to the menu's own button so keyboard users don't land on <body>
        const panel = (document.activeElement as HTMLElement | null)?.closest<HTMLElement>("[id^='mega-']");
        if (panel) document.querySelector<HTMLElement>(`[aria-controls="${panel.id}"]`)?.focus();
        setOpen(null);
        setSheet(false);
      }
    };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, []);

  return (
    <>
      <header className="hdr" id="hdr">
        <div className="hdr-in">
          <Link className="logo" href="/" aria-label="TryVox home">
            <LogoFull />
          </Link>
          <nav aria-label="Main" style={{ display: "contents" }}>
            <ul className="nav">
              <Mega id="p" label="Products" open={open} setOpen={setOpen}>
                <div className="mega mega-p mega-g" id="mega-p">
                  {STAGES.map((g) => (
                    <div className="mg-col" key={g.id}>
                      <p className="mg-h">
                        <b>{g.label}</b>
                        <span>{g.note}</span>
                      </p>
                      {PRODUCTS.filter((p) => p.group === g.id).map((p) => (
                        <Link className="mg-it" href={`/products/${p.slug}/`} key={p.slug} onClick={() => setOpen(null)}>
                          <span className="mi">
                            <Icon name={p.icon} bare />
                          </span>
                          <span>
                            <span className="mt">{p.name}</span>
                            <span className="md">{p.desc}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </Mega>
              <Mega id="s" label="Solutions" open={open} setOpen={setOpen}>
                <div className="mega mega-s" id="mega-s">
                  {SOLUTIONS.map((s) => (
                    <Link className="mc so" href={`/solutions/${s.slug}/`} key={s.slug} onClick={() => setOpen(null)}>
                      <span className="mc-i">
                        <Icon name={s.icon} bare />
                      </span>
                      <span className="mc-h">
                        <b>{s.name}</b>
                        <RChev />
                      </span>
                      <span className="mc-d">{s.desc}</span>
                    </Link>
                  ))}
                </div>
              </Mega>
              <li>
                <Link className="nl" href="/integrations/">Integrations</Link>
              </li>
              <li>
                <Link className="nl" href="/developers/">Developers</Link>
              </li>
              <li>
                <Link className="nl" href="/pricing/">Pricing</Link>
              </li>
            </ul>
          </nav>
          <div className="hdr-r">
            <a className="signin" href={APP}>Sign in</a>
            <a className="kbtn" href={APP}>Start free</a>
            <button className="burger" id="burger" aria-label={sheet ? "Close menu" : "Open menu"} aria-expanded={sheet} aria-controls="sheet" onClick={() => setSheet(!sheet)}>
              <span />
            </button>
          </div>
        </div>
      </header>
      <nav className="sheet" id="sheet" aria-label="Mobile" aria-hidden={!sheet}>
        {([["p", "Products", PRODUCTS, "products"], ["s", "Solutions", SOLUTIONS, "solutions"]] as const).map(([id, label, items, base]) => (
          <div className={`sh-g${acc === id ? " open" : ""}`} key={id}>
            <button type="button" className="sh-row" aria-expanded={acc === id} aria-controls={`sh-${id}`} onClick={() => setAcc(acc === id ? null : id)}>
              {label}
              <Chev />
            </button>
            <div className="sh-list" id={`sh-${id}`}>
              <div>
                {items.map((it) => (
                  <Link href={`/${base}/${it.slug}/`} key={it.slug} className="sh-item" onClick={() => setSheet(false)}>
                    <span className="sh-i">
                      <Icon name={it.icon} bare />
                    </span>
                    {it.name}
                    <RChev />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
        {[["Integrations", "/integrations/"], ["Developers", "/developers/"], ["Pricing", "/pricing/"], ["About", "/about/"], ["Contact", "/contact/"]].map(([t, h]) => (
          <Link href={h} key={h} className="sh-row" onClick={() => setSheet(false)}>
            {t}
          </Link>
        ))}
        <div className="sh-foot">
          <a className="obtn" href={APP}>Sign in</a>
        </div>
      </nav>
    </>
  );
}
