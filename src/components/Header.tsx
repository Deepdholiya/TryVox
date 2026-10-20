"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { PREVIEWS } from "@/content/nav-previews";
import { APP, PRODUCTS, SOLUTIONS } from "@/content/site";
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

function toggleTheme(e: MouseEvent<HTMLButtonElement>) {
  const root = document.documentElement;
  const dark = root.dataset.theme === "dark" || (!root.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);
  const next = dark ? "light" : "dark";
  const apply = () => {
    root.dataset.theme = next;
    try {
      localStorage.setItem("tv-theme", next);
    } catch {}
  };
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
  if (doc.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    doc
      .startViewTransition(apply)
      .ready.then(() =>
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
          { duration: 700, easing: "cubic-bezier(.22,1,.36,1)", pseudoElement: "::view-transition-new(root)" },
        ),
      )
      .catch(() => {});
  } else apply();
}

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
  const path = usePathname();

  useEffect(() => {
    setOpen(null);
    setSheet(false);
  }, [path]);
  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", sheet);
  }, [sheet]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
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
                <div className="mega mega-p" id="mega-p">
                  {PRODUCTS.map((p) => (
                    <Link className="mc" href={`/products/${p.slug}/`} key={p.slug} onClick={() => setOpen(null)}>
                      <span className="mc-h">
                        <span className="mc-i">
                          <Icon name={p.icon} bare />
                        </span>
                        <b>{p.name}</b>
                        <RChev />
                      </span>
                      <span className="mc-d">{p.desc}</span>
                      <span className="mc-pv" aria-hidden="true">
                        {PREVIEWS[p.slug]}
                      </span>
                    </Link>
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
            <button className="theme-t" id="themeT" aria-label="Switch light or dark theme" onClick={toggleTheme}>
              <svg className="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <circle cx="12" cy="12" r="4.2" />
                <path d="M12 2v2.2M12 19.8V22M2 12h2.2M19.8 12H22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
              </svg>
              <svg className="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z" />
              </svg>
            </button>
            <a className="signin" href={APP}>Sign in</a>
            <a className="kbtn" href={APP}>Start free</a>
            <button className="burger" id="burger" aria-label={sheet ? "Close menu" : "Open menu"} aria-expanded={sheet} aria-controls="sheet" onClick={() => setSheet(!sheet)}>
              <span />
            </button>
          </div>
        </div>
      </header>
      <nav className="sheet" id="sheet" aria-label="Mobile">
        <details>
          <summary>
            Products<i aria-hidden="true">+</i>
          </summary>
          <div>
            {PRODUCTS.map((p) => (
              <Link href={`/products/${p.slug}/`} key={p.slug} onClick={() => setSheet(false)}>{p.name}</Link>
            ))}
          </div>
        </details>
        <details>
          <summary>
            Solutions<i aria-hidden="true">+</i>
          </summary>
          <div>
            {SOLUTIONS.map((s) => (
              <Link href={`/solutions/${s.slug}/`} key={s.slug} onClick={() => setSheet(false)}>{s.name}</Link>
            ))}
          </div>
        </details>
        {[["Integrations", "/integrations/"], ["Developers", "/developers/"], ["Pricing", "/pricing/"], ["About", "/about/"], ["Contact", "/contact/"]].map(([t, h]) => (
          <Link href={h} key={h} onClick={() => setSheet(false)}>{t}</Link>
        ))}
        <div className="sheet-cta">
          <a className="obtn" href={APP}>Sign in</a>
          <a className="kbtn" href={APP}>Start free</a>
        </div>
      </nav>
    </>
  );
}
