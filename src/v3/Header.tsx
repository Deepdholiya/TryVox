"use client";
/* Sticky white header. Nav items separated by "/", two disclosure menus that work with mouse and keyboard,
   a full-screen sheet under 1020px. Gains a hairline once the page scrolls. */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ICONS } from "@/content/icons";
import { APP, PRODUCTS, SOLUTIONS, STAGES } from "@/content/site";
import { LogoMark } from "@/components/ui";

const Chev = () => (
  <svg viewBox="0 0 10 10" aria-hidden="true">
    <path d="M2 3.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

function Drop({ id, label, open, setOpen, children }: { id: string; label: string; open: string | null; setOpen: (v: string | null) => void; children: React.ReactNode }) {
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  const isOpen = open === id;
  return (
    <li
      onMouseEnter={() => {
        clearTimeout(t.current);
        setOpen(id);
      }}
      onMouseLeave={() => {
        t.current = setTimeout(() => setOpen(null), 120);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(null);
      }}
    >
      <button className="nav-a" aria-expanded={isOpen} aria-controls={`menu-${id}`} onClick={() => setOpen(isOpen ? null : id)}>
        {label} <Chev />
      </button>
      {children}
    </li>
  );
}

export function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [sheet, setSheet] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();

  useEffect(() => {
    setOpen(null);
    setSheet(false);
  }, [path]);
  useEffect(() => {
    const on = () => setScrolled(scrollY > 8);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = sheet ? "hidden" : "";
  }, [sheet]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const menu = (document.activeElement as HTMLElement | null)?.closest<HTMLElement>("[id^='menu-']");
      if (menu) document.querySelector<HTMLElement>(`[aria-controls="${menu.id}"]`)?.focus();
      if (sheet) document.querySelector<HTMLElement>(".burger")?.focus();
      setOpen(null);
      setSheet(false);
    };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [sheet]);

  const cur = (href: string) => (path === href ? "page" : undefined);

  return (
    <header className={scrolled ? "hdr scrolled" : "hdr"}>
      <div className="wrap hdr-in">
        <Link className="logo" href="/" aria-label="TryVox home">
          <LogoMark />
          <span aria-hidden="true">TryVox</span>
        </Link>
        <nav aria-label="Main">
          <ul className="nav">
            <Drop id="p" label="Products" open={open} setOpen={setOpen}>
              <div className="menu" id="menu-p" hidden={open !== "p"}>
                {STAGES.map((g) => (
                  <div className="menu-g" key={g.id}>
                    <p>
                      {g.label} · {g.note}
                    </p>
                    {PRODUCTS.filter((p) => p.group === g.id).map((p) => (
                      <Link href={`/products/${p.slug}/`} key={p.slug} onClick={() => setOpen(null)}>
                        <span className="ic" aria-hidden="true">
                          {ICONS[p.icon]}
                        </span>
                        <span>
                          <b>{p.name}</b>
                          <small>{p.desc}</small>
                        </span>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </Drop>
            <Drop id="s" label="Solutions" open={open} setOpen={setOpen}>
              <div className="menu sol" id="menu-s" hidden={open !== "s"}>
                <div className="menu-g">
                  <p>By industry</p>
                  {SOLUTIONS.map((s) => (
                    <Link href={`/solutions/${s.slug}/`} key={s.slug} onClick={() => setOpen(null)}>
                      <span className="ic" aria-hidden="true">
                        {ICONS[s.icon]}
                      </span>
                      <span>
                        <b>{s.name}</b>
                        <small>{s.desc}</small>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </Drop>
            {[
              ["/pricing/", "Pricing"],
              ["/developers/", "Developers"],
              ["/integrations/", "Integrations"],
            ].map(([h, t]) => (
              <li key={h}>
                <Link className="nav-a" href={h} aria-current={cur(h)}>
                  {t}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hdr-r">
          <a className="si" href={APP}>
            Sign in
          </a>
          <a className="btn line sm" href="/contact/">
            Contact sales
          </a>
          <a className="btn sm" href={APP}>
            Start free <span className="ar" aria-hidden="true">→</span>
          </a>
          <button className="burger" aria-expanded={sheet} aria-controls="sheet" aria-label="Menu" onClick={() => setSheet(!sheet)}>
            <span />
          </button>
        </div>
      </div>
      <div className="sheet" id="sheet" hidden={!sheet}>
        <nav aria-label="Mobile">
          <p>Products</p>
          {PRODUCTS.map((p) => (
            <Link href={`/products/${p.slug}/`} key={p.slug}>
              {p.name}
            </Link>
          ))}
          <p>Solutions</p>
          {SOLUTIONS.map((s) => (
            <Link href={`/solutions/${s.slug}/`} key={s.slug}>
              {s.name}
            </Link>
          ))}
          <p>Company</p>
          {[
            ["/pricing/", "Pricing"],
            ["/developers/", "Developers"],
            ["/integrations/", "Integrations"],
            ["/about/", "About"],
            ["/contact/", "Contact"],
          ].map(([h, t]) => (
            <Link href={h} key={h}>
              {t}
            </Link>
          ))}
          <div className="btns">
            <a className="btn" href={APP}>
              Start free <span className="ar" aria-hidden="true">→</span>
            </a>
            <a className="btn line" href={APP}>
              Sign in
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
