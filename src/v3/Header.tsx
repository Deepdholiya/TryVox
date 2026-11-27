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
    <path
      d="M2 3.5l3 3 3-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    />
  </svg>
);

function Drop({
  id,
  label,
  open,
  setOpen,
  children,
}: {
  id: string;
  label: string;
  open: string | null;
  setOpen: (v: string | null) => void;
  children: React.ReactNode;
}) {
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
      <button
        className="nav-a"
        aria-expanded={isOpen}
        aria-controls={`menu-${id}`}
        onClick={() => setOpen(isOpen ? null : id)}
      >
        {label} <Chev />
      </button>
      {children}
    </li>
  );
}

/* Line-art vectors at the foot of each product menu card. Decorative only. */
function MenuArt({ kind }: { kind: string }) {
  const art: Record<string, React.ReactNode> = {
    reach: (
      <>
        <circle cx="70" cy="62" r="10" />
        <circle cx="70" cy="62" r="24" className="d" />
        <circle cx="70" cy="62" r="40" className="d" />
        <circle cx="70" cy="62" r="56" />
      </>
    ),
    connect: (
      <>
        <rect x="14" y="44" width="30" height="30" rx="4" />
        <rect x="96" y="44" width="30" height="30" rx="4" />
        <path d="M44 59 C 64 20, 76 98, 96 59" className="d" />
        <path d="M29 44V20h82v24" className="d" />
      </>
    ),
    control: (
      <>
        <path d="M0 60 Q 17 20 35 60 T 70 60 T 105 60 T 140 60" />
        <path d="M0 60 Q 17 90 35 60 T 70 60 T 105 60 T 140 60" className="d" />
        <path d="M0 60h140" className="d" />
      </>
    ),
    engage: (
      <>
        <rect x="12" y="24" width="72" height="34" rx="8" />
        <path d="M24 58v12l12-12" />
        <rect x="56" y="64" width="72" height="30" rx="8" className="d" />
        <path d="M24 36h48M24 46h30" className="d" />
      </>
    ),
  };
  return (
    <svg className="mcard-art" viewBox="0 0 140 100" aria-hidden="true">
      {art[kind]}
    </svg>
  );
}

function MenuFoot({ sales }: { sales?: boolean }) {
  if (sales)
    return (
      <div className="menu-foot">
        <span className="mf-ic" aria-hidden="true">
          {ICONS.users}
        </span>
        <span>
          <b>Planning a rollout?</b>
          <small>
            Tell us your call volume and industry. We will help you size numbers
            and channels.
          </small>
        </span>
        <Link className="btn line sm" href="/contact/">
          Talk to sales →
        </Link>
      </div>
    );
  return (
    <div className="menu-foot">
      <span className="mf-ic" aria-hidden="true">
        {ICONS.doc}
      </span>
      <span>
        <b>API documentation</b>
        <small>
          Numbers, calls, VoxML, SIP trunks and agent bindings, with code you
          can copy.
        </small>
      </span>
      <a className="btn line sm" href="https://docs.tryvox.io/">
        Read docs →
      </a>
    </div>
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
      const menu = (
        document.activeElement as HTMLElement | null
      )?.closest<HTMLElement>("[id^='menu-']");
      if (menu)
        document
          .querySelector<HTMLElement>(`[aria-controls="${menu.id}"]`)
          ?.focus();
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
                <div className="menu-cards">
                  {STAGES.map((g) => (
                    <div className="mcard" key={g.id}>
                      <p className="mcard-h">
                        {g.label}
                        <span>{g.note}</span>
                      </p>
                      <ul>
                        {PRODUCTS.filter((p) => p.group === g.id).map((p) => (
                          <li key={p.slug}>
                            <Link
                              href={`/products/${p.slug}/`}
                              onClick={() => setOpen(null)}
                            >
                              <b>{p.name}</b>
                              <small>{p.desc}</small>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <MenuArt kind={g.id} />
                    </div>
                  ))}
                </div>
                <MenuFoot />
              </div>
            </Drop>
            <Drop id="s" label="Solutions" open={open} setOpen={setOpen}>
              <div className="menu sol" id="menu-s" hidden={open !== "s"}>
                <div className="menu-cards">
                  {SOLUTIONS.map((x) => (
                    <Link
                      className="mcard sc"
                      href={`/solutions/${x.slug}/`}
                      key={x.slug}
                      onClick={() => setOpen(null)}
                    >
                      <span className="sc-art" aria-hidden="true">
                        <svg viewBox="0 0 120 60">
                          <circle cx="60" cy="30" r="26" />
                          <circle cx="60" cy="30" r="17" className="d" />
                          <path d="M0 30h30M90 30h30" className="d" />
                        </svg>
                        <span className="sc-ic">{ICONS[x.icon]}</span>
                      </span>
                      <b>{x.name}</b>
                      <small>{x.desc}</small>
                    </Link>
                  ))}
                </div>
                <MenuFoot sales />
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
            Start free{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </a>
          <button
            className="burger"
            aria-expanded={sheet}
            aria-controls="sheet"
            aria-label="Menu"
            onClick={() => setSheet(!sheet)}
          >
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
              Start free{" "}
              <span className="ar" aria-hidden="true">
                →
              </span>
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
