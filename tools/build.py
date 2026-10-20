#!/usr/bin/env python3
"""Build TryVox inner pages from shared partials.

Run from the repo root:  python3 tools/build.py
- Writes every inner page to <slug>/index.html (clean URLs on Vercel).
- Rewrites the header and footer in index.html between the @header / @footer markers,
  so the homepage and every inner page share one navigation and one footer.
Copy is limited to what docs.tryvox.io and the current site state.
"""
import html, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
E = html.escape
LOGO = '<path fill="#00B900" d="M0 0H10L0 10Z M21 0H32V11H10.5Z M21 11H31L21 21Z M11 11V21H1Z M0 21H21L10.5 32H0Z M32 21V32H21Z"/>'
APP = "https://app.tryvox.io/"
DOCS = "https://docs.tryvox.io"

# ---------------------------------------------------------------- icons (duotone, one family)
def _s(inner, fill=False):
    a = 'fill="currentColor"' if fill else 'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"'
    return f'<svg viewBox="0 0 24 24" {a} aria-hidden="true">{inner}</svg>'
T = 'fill="currentColor" fill-opacity=".14"'
ICON = {
 "phone": _s(f'<path d="M5 3.5h3.6l1.9 4.8-2.4 1.5a11 11 0 005.6 5.6l1.5-2.4 4.8 1.9V18a2.5 2.5 0 01-2.5 2.5A16.5 16.5 0 012.5 6 2.5 2.5 0 015 3.5z" {T}/><path d="M15 3.5a5.5 5.5 0 015.5 5.5M15 7a2 2 0 012 2"/>'),
 "sip": _s(f'<rect x="3" y="3.5" width="18" height="7" rx="2.2" {T}/><rect x="3" y="13.5" width="18" height="7" rx="2.2" {T}/><circle cx="7" cy="7" r="1" fill="currentColor" stroke="none"/><circle cx="7" cy="17" r="1" fill="currentColor" stroke="none"/><path d="M11 7h6M11 17h6"/>'),
 "wave": _s('<rect x="2.5" y="10" width="2.6" height="4" rx="1.3" opacity=".45"/><rect x="6.6" y="6.5" width="2.6" height="11" rx="1.3" opacity=".75"/><rect x="10.7" y="3" width="2.6" height="18" rx="1.3"/><rect x="14.8" y="7.5" width="2.6" height="9" rx="1.3" opacity=".75"/><rect x="18.9" y="10" width="2.6" height="4" rx="1.3" opacity=".45"/>', True),
 "bot": _s(f'<rect x="4" y="7" width="16" height="12.5" rx="3.5" {T}/><path d="M12 3.5V7M2 12v3M22 12v3"/><circle cx="9" cy="12.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="15" cy="12.5" r="1.3" fill="currentColor" stroke="none"/><path d="M9.5 16h5"/>'),
 "chat": _s(f'<path d="M4 19.5l1.4-3.6A8 8 0 1112 20a8 8 0 01-3.9-1z" {T}/><circle cx="8.5" cy="12" r="1.1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="12" r="1.1" fill="currentColor" stroke="none"/>'),
 "shield": _s(f'<path d="M12 2.8l7.5 3v5.4c0 4.9-3.2 8.6-7.5 10-4.3-1.4-7.5-5.1-7.5-10V5.8z" {T}/><path d="M8.6 12l2.4 2.4 4.4-4.6"/>'),
 "route": _s(f'<circle cx="6" cy="6" r="2.5" {T}/><circle cx="18" cy="18" r="2.5" {T}/><path d="M8.5 6H15a3 3 0 010 6H9a3 3 0 000 6h6.5"/>'),
 "search": _s(f'<circle cx="11" cy="11" r="6.5" {T}/><path d="M16 16l4.5 4.5"/>'),
 "id": _s(f'<rect x="3" y="5" width="18" height="14" rx="3" {T}/><circle cx="9" cy="11" r="2"/><path d="M6 16c.6-1.6 1.7-2.4 3-2.4s2.4.8 3 2.4M14.5 10h4M14.5 13.5h3"/>'),
 "key": _s(f'<circle cx="8" cy="14" r="4" {T}/><path d="M11 11l8.5-8.5M16 6l2.5 2.5M14 8l2 2"/>'),
 "flow": _s(f'<rect x="3" y="3.5" width="7" height="6" rx="1.8" {T}/><rect x="14" y="14.5" width="7" height="6" rx="1.8" {T}/><path d="M6.5 9.5v3.5a2 2 0 002 2H14"/>'),
 "rec": _s(f'<circle cx="12" cy="12" r="8.5" {T}/><circle cx="12" cy="12" r="3.2" fill="currentColor" stroke="none"/>'),
 "users": _s(f'<circle cx="9" cy="8.5" r="3.2" {T}/><path d="M3.5 19c.8-3 2.9-4.6 5.5-4.6s4.7 1.6 5.5 4.6"/><circle cx="17" cy="9.5" r="2.4"/><path d="M16.5 14.6c2 .2 3.4 1.6 4 4.1"/>'),
 "bolt": _s(f'<path d="M13 2.5L5 13.5h6l-1 8 8-11h-6z" {T}/>'),
 "hook": _s(f'<path d="M6 15a4 4 0 117.5-2" /><path d="M12.5 12.5L16 19" /><circle cx="17.5" cy="19" r="2" {T}/><path d="M18 9a4 4 0 00-7.6 1.6"/>'),
 "doc": _s(f'<path d="M6 3h8l4 4v14H6z" {T}/><path d="M14 3v4h4M9 12h6M9 16h6"/>'),
 "globe": _s(f'<circle cx="12" cy="12" r="8.5" {T}/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.6 5.5 3.6 8.5s-1.1 5.9-3.6 8.5c-2.5-2.6-3.6-5.5-3.6-8.5S9.5 6.1 12 3.5z"/>'),
 "eye": _s(f'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" {T}/><circle cx="12" cy="12" r="2.8"/>'),
 "mail": _s(f'<rect x="3" y="5" width="18" height="14" rx="3" {T}/><path d="M4 7l8 6 8-6"/>'),
 "rupee": _s(f'<circle cx="12" cy="12" r="8.5" {T}/><path d="M9 8h6M9 10.5h6M9 8c2.6 0 3.6 1.2 3.6 2.6S11.5 13 9 13l4.5 4"/>'),
 "heart": _s(f'<path d="M12 20s-7.5-4.5-7.5-10A4.3 4.3 0 0112 7.6 4.3 4.3 0 0119.5 10c0 5.5-7.5 10-7.5 10z" {T}/><path d="M7.5 12h2.2l1.2-2 2 4 1.2-2h2.4"/>'),
 "cart": _s(f'<path d="M3 4h2.5l2.2 10.5h10l2-7.5H7" {T}/><circle cx="9.5" cy="19" r="1.4"/><circle cx="16.5" cy="19" r="1.4"/>'),
 "truck": _s(f'<path d="M2.5 6.5h11v9h-11z" {T}/><path d="M13.5 9.5h4l3 3v3h-7"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>'),
 "home": _s(f'<path d="M3.5 11L12 4l8.5 7v9h-5.5v-5.5h-6V20H3.5z" {T}/>'),
 "plane": _s(f'<path d="M21 4L3 11l6.5 2.5L12 20l3-6.5z" {T}/><path d="M9.5 13.5L21 4"/>'),
 "code": _s(f'<rect x="3" y="4" width="18" height="16" rx="3" {T}/><path d="M9.5 9.5L7 12l2.5 2.5M14.5 9.5L17 12l-2.5 2.5"/>'),
}
def ic(name): return f'<span class="ic">{ICON[name]}</span>'

PRODUCTS = [
 ("phone-numbers", "Phone Numbers", "phone", "Local, national and toll-free numbers with KYC."),
 ("sip-trunking", "SIP Trunking", "sip", "Trunks, credentials and channel limits."),
 ("voice-api", "Voice API", "wave", "Calls, conferences and VoxML call flows."),
 ("ai-agents", "AI Agents", "bot", "Bind a number to Vapi, Retell, LiveKit or Bolna."),
 ("messaging", "Messaging", "chat", "WhatsApp and SMS on the same account."),
 ("compliance", "Compliance", "shield", "Consent, DLT and verified caller IDs."),
]
SOLUTIONS = [
 ("financial-services", "Financial services", "rupee", "Collections, reminders, KYC follow-ups."),
 ("healthcare", "Healthcare", "heart", "Appointments and patient reminders."),
 ("ecommerce", "E-commerce", "cart", "COD confirmation and order support."),
 ("logistics", "Logistics", "truck", "Delivery slots and masked calling."),
 ("real-estate", "Real estate", "home", "Instant callbacks on new leads."),
 ("travel-hospitality", "Travel & hospitality", "plane", "24/7 booking and guest lines."),
]

# ---------------------------------------------------------------- partials
PV = {
 "phone-numbers": '<div class="pv"><i class="pv-bar"></i><div class="pv-s"><i></i><b>Bengaluru</b></div><div class="pv-r"><b>+91 80 4718 2290</b><em class="g"></em></div><div class="pv-r"><b>+91 80 4718 3301</b><em class="g"></em></div><div class="pv-r"><b>1800 xxx xxxx</b><em></em></div></div>',
 "sip-trunking": '<div class="pv"><i class="pv-bar"></i><div class="pv-r"><b>trunk-prod</b><em class="g"></em></div><div class="pv-m"><i style="--h:40%"></i><i style="--h:70%"></i><i style="--h:55%"></i><i style="--h:85%"></i><i style="--h:60%"></i><i style="--h:75%"></i><i style="--h:45%"></i></div><div class="pv-r"><b>30 channels</b><em class="p"></em></div></div>',
 "voice-api": '<div class="pv"><i class="pv-bar"></i><div class="pv-code"><b>POST</b> /calls</div><div class="pv-chip">201 · queued</div><div class="pv-w"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>',
 "ai-agents": '<div class="pv"><i class="pv-bar"></i><div class="pv-pr"><span class="on">Vapi</span><span>Retell</span><span>Bolna</span></div><div class="pv-r"><b>+91 80 4718 2290</b><em class="g"></em></div><div class="pv-tg"><i></i>Connected</div></div>',
 "messaging": '<div class="pv"><i class="pv-bar"></i><div class="pv-b a">Here is your payment link</div><div class="pv-b c">Paid, thanks!</div><div class="pv-chip">read</div></div>',
 "compliance": '<div class="pv"><i class="pv-bar"></i><div class="pv-k"><i></i>Business KYC</div><div class="pv-k"><i></i>Consent</div><div class="pv-k"><i></i>DLT entity</div></div>',
}
RCHEV = '<svg class="rch" viewBox="0 0 10 10" aria-hidden="true"><path d="M3.5 2l3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>'
def mega(title, items, base):
    if base == "products":
        return "".join(f'<a class="mc" href="/{base}/{slug}/"><span class="mc-h"><span class="mc-i">{ICON[icon]}</span><b>{E(name)}</b>{RCHEV}</span><span class="mc-d">{E(desc)}</span><span class="mc-pv">{PV[slug]}</span></a>' for slug, name, icon, desc in items)
    return "".join(f'<a class="mc so" href="/{base}/{slug}/"><span class="mc-i">{ICON[icon]}</span><span class="mc-h"><b>{E(name)}</b>{RCHEV}</span><span class="mc-d">{E(desc)}</span></a>' for slug, name, icon, desc in items)

CHEV = '<svg class="chev" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>'
SUN = '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.2M12 19.8V22M2 12h2.2M19.8 12H22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"/></svg>'
MOON = '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z"/></svg>'

def header():
    sheet_p = "".join(f'<a href="/products/{s}/">{E(n)}</a>' for s, n, _, _ in PRODUCTS)
    sheet_s = "".join(f'<a href="/solutions/{s}/">{E(n)}</a>' for s, n, _, _ in SOLUTIONS)
    return f'''<header class="hdr" id="hdr">
  <div class="hdr-in">
    <a class="logo" href="/" aria-label="TryVox home"><svg viewBox="0 0 32 32" aria-hidden="true">{LOGO}</svg>TryVox</a>
    <ul class="nav">
      <li class="has-mega"><button class="nl" aria-expanded="false">Products {CHEV}</button>
        <div class="mega mega-p">{mega("Products", PRODUCTS, "products")}</div></li>
      <li class="has-mega"><button class="nl" aria-expanded="false">Solutions {CHEV}</button>
        <div class="mega mega-s">{mega("Solutions", SOLUTIONS, "solutions")}</div></li>
      <li><a class="nl" href="/integrations/">Integrations</a></li>
      <li><a class="nl" href="/developers/">Developers</a></li>
      <li><a class="nl" href="/pricing/">Pricing</a></li>
    </ul>
    <div class="hdr-r">
      <button class="theme-t" id="themeT" aria-label="Switch light or dark theme">{SUN}{MOON}</button>
      <a class="signin" href="{APP}">Sign in</a>
      <a class="kbtn" href="{APP}">Start free</a>
      <button class="burger" id="burger" aria-label="Open menu" aria-expanded="false"><span></span></button>
    </div>
  </div>
</header>
<nav class="sheet" aria-label="Mobile">
  <details><summary>Products<i>+</i></summary><div>{sheet_p}</div></details>
  <details><summary>Solutions<i>+</i></summary><div>{sheet_s}</div></details>
  <a href="/integrations/">Integrations</a><a href="/developers/">Developers</a><a href="/pricing/">Pricing</a><a href="/about/">About</a><a href="/contact/">Contact</a>
  <div class="sheet-cta"><a class="obtn" href="{APP}">Sign in</a><a class="kbtn" href="{APP}">Start free</a></div>
</nav>'''

def footer():
    col = lambda title, links: f'<div><h4>{title}</h4><ul>' + "".join(f'<li><a href="{h}">{E(t)}</a></li>' for t, h in links) + '</ul></div>'
    bars = "<i></i>" * 16
    return f'''<footer class="wrap">
  <div class="fcta rv">
    <div>
      <p class="tag" style="color:#F3F0F9"><i></i>Start in minutes</p>
      <h2 class="hd" style="margin-top:18px">Your agent is ready. Give it a <em>line.</em></h2>
      <p class="sub">Get a number, connect your agent and take your first call today.</p>
      <div class="cta"><a class="kbtn" href="{APP}">Start free</a><a class="obtn" href="/contact/">Talk to us</a></div>
    </div>
    <div class="fdial" aria-hidden="true">
      <span class="stt" id="fStt">Ringing your agent</span>
      <span class="lcd">+91 80 4718 2290</span>
      <span class="bars">{bars}</span>
    </div>
  </div>
  <div class="ft">
    <div class="about">
      <a class="logo" href="/"><svg viewBox="0 0 32 32" aria-hidden="true">{LOGO}</svg>TryVox</a>
      <p>Telephony infrastructure that connects AI voice agents to real phone networks. Built in India.</p>
      <div class="badges"><span>KYC</span><span>DLT</span><span>Consent</span></div>
      <p class="mail">team@tryvox.io</p>
      <div class="social"><a href="https://x.com/TryvoxTeam" aria-label="TryVox on X"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.8 3h3.1l-6.8 7.8L22 21h-6.3l-4.9-6.4L5.2 21H2.1l7.3-8.3L2 3h6.4l4.4 5.9zm-1.1 16.2h1.7L7.4 4.7H5.6z"/></svg></a><a href="https://www.linkedin.com/company/tryvox" aria-label="TryVox on LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zm7 0h3.8v1.7h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.2 1.5-2.2 2.9V21h-4z"/></svg></a><a href="{DOCS}/" aria-label="TryVox docs"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 4h9a2 2 0 012 2v14H8a3 3 0 01-3-3V7a3 3 0 013-3z"/><path d="M5 17a3 3 0 013-3h11"/></svg></a></div>
    </div>
    {col("Products", [(n, f"/products/{s}/") for s, n, _, _ in PRODUCTS])}
    {col("Solutions", [(n, f"/solutions/{s}/") for s, n, _, _ in SOLUTIONS])}
    {col("Developers", [("Developer hub", "/developers/"), ("Integrations", "/integrations/"), ("Docs ↗", f"{DOCS}/"), ("Quickstart ↗", f"{DOCS}/getting-started/quickstart")])}
    {col("Company", [("About", "/about/"), ("Contact", "/contact/"), ("Pricing", "/pricing/"), ("Sign in", APP)])}
  </div>
  <div class="giant" id="giant" aria-hidden="true"><div class="w"><svg viewBox="0 0 32 32">{LOGO}</svg>TryVox</div></div>
  <div class="legal"><span>© 2026 Tryjolt Solutions Pvt Ltd</span><nav><a href="https://tryvox.io/privacy">Privacy</a><a href="https://tryvox.io/terms">Terms</a><a href="#top">Back to top ↑</a></nav></div>
</footer>'''

def head(title, desc, path):
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{E(title)}</title>
<meta name="description" content="{E(desc)}">
<link rel="canonical" href="https://tryvoxinternal.vercel.app{path}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:title" content="{E(title)}">
<meta property="og:description" content="{E(desc)}">
<meta property="og:type" content="website">
<meta name="theme-color" content="#FFFFFF">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300..700&family=Geist+Mono:wght@400;500&family=Doto:wght@800&family=Instrument+Serif:ital@0;1&display=swap">
<link rel="stylesheet" href="/assets/css/site.css">
<script src="/assets/js/site.js" defer></script>
</head>
<body>
<div class="gridlines" aria-hidden="true"><div><i></i><i></i><i></i><i></i><i></i><i></i></div></div>
'''

# ---------------------------------------------------------------- components
def crumb(parts):
    out = ['<a href="/">Home</a>']
    for label, href in parts:
        out.append('<span aria-hidden="true">/</span>')
        out.append(f'<a href="{href}">{E(label)}</a>' if href else f'<span>{E(label)}</span>')
    return f'<nav class="crumb" aria-label="Breadcrumb">{"".join(out)}</nav>'

def phero(crumbs, tag, h1, sub, visual, primary=("Start free", APP), secondary=("Talk to us", "/contact/"), micro=("No lock-in", "Pay as you go", "Live in minutes")):
    m = "".join(f"<span>{E(x)}</span>" for x in micro)
    return f'''<section class="phero wrap">
  <div class="phero-grid">
    <div>
      {crumb(crumbs)}
      <p class="tag"><i></i>{E(tag)}</p>
      <h1 class="hd">{h1}</h1>
      <p class="sub">{E(sub)}</p>
      <div class="cta"><a class="kbtn" href="{primary[1]}">{E(primary[0])}</a><a class="obtn" href="{secondary[1]}">{E(secondary[0])}</a></div>
      <div class="micro">{m}</div>
    </div>
    <div class="rv">{visual}</div>
  </div>
</section>'''

def mock(label, body, live="Live"):
    lv = f'<span class="live">{E(live)}</span>' if live else ""
    return f'<div class="mock"><div class="mock-bar"><span class="dots"><i></i><i></i><i></i></span><span>{E(label)}</span>{lv}</div><div class="mock-body">{body}</div></div>'

def shead(tag, h2, sub=None):
    s = f'<p class="sub">{E(sub)}</p>' if sub else ""
    return f'<div class="shead rv"><p class="tag"><i></i>{E(tag)}</p><h2 class="hd h2" style="margin-top:20px">{h2}</h2>{s}</div>'

def features(items, label=None):
    cells = "".join(
        f'<div class="cell rv"><span class="k">{ic(i)}<span>{E(k)}</span></span><h3>{E(t)}</h3><p>{E(d)}</p></div>'
        for i, k, t, d in items)
    return f'<div class="grid3">{cells}</div>'

def steps(items, n=None):
    n = n or len(items)
    cells = ""
    for idx, it in enumerate(items, 1):
        t, d = it[0], it[1]
        link = f'<a href="{it[2]}">Docs ↗</a>' if len(it) > 2 and it[2] else ""
        cells += f'<div class="st3 rv"><span class="n">{idx:02d}</span><h3>{E(t)}</h3><p>{E(d)}</p>{link}</div>'
    return f'<div class="steps3" style="--n:{min(n,4)}">{cells}</div>'

def frow(h3, p, ticks, visual, flip=False):
    t = "".join(f"<li>{E(x)}</li>" for x in ticks)
    return f'<div class="frow{" flip" if flip else ""}"><div class="rv"><h3 class="hd">{h3}</h3><p>{E(p)}</p><ul class="ticks">{t}</ul></div><div class="rv">{visual}</div></div>'

def code_panel(code, note_html):
    tabs = "".join(f'<button role="tab" aria-selected="{"true" if i == 0 else "false"}" data-lang="{k}">{E(lbl)}</button>' for i, (k, (lbl, _)) in enumerate(code.items()))
    data = json.dumps({k: v for k, (_, v) in code.items()}).replace("</", "<\\/")
    return f'''<div class="code"><div class="code-top" role="tablist" aria-label="Code example">{tabs}<button class="copy" id="copy">Copy</button></div><pre id="codeBox" tabindex="0"></pre></div>
<p class="note">{note_html}</p>
<script type="application/json" id="codeData">{data}</script>'''

def faq(items):
    d = "".join(f"<details{' open' if i == 0 else ''}><summary>{E(q)}<i>+</i></summary><p>{E(a)}</p></details>" for i, (q, a) in enumerate(items))
    ld = json.dumps({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in items]}).replace("</", "<\\/")
    return f'''<section class="wrap sect tight"><div class="faq"><div class="rv"><p class="tag"><i></i>FAQ</p><h2 class="hd h2" style="margin-top:20px">Questions teams <em>ask first.</em></h2><p class="sub" style="margin-top:16px">Something else? <a href="/contact/" style="text-decoration:underline">Talk to the team</a>.</p></div><div class="rv">{d}</div></div></section>
<script type="application/ld+json">{ld}</script>'''

def related(title, links):
    cards = "".join(f'<a class="ccard rv" href="{h}">{ic(i)}<h3>{E(t)}</h3><p>{E(d)}</p><span class="go">Learn more →</span></a>' for i, t, d, h in links)
    return f'<section class="wrap sect tight">{shead("Keep exploring", title)}<div class="ccards">{cards}</div></section>'

def partners():
    return '''<section class="logos wrap" aria-label="Integrations"><div class="row"><p class="lbl">Works with the voice stack you already trust</p><div class="marquee"><div class="mq" id="mq"></div></div></div></section>'''

def stats():
    return '<section class="wrap" style="padding-block:8px 24px"><div class="sband rv"><div><b>&lt;200ms</b><span>Response time</span></div><div><b>99.9%</b><span>Platform uptime</span></div><div><b>24/7</b><span>Always available</span></div></div></section>'

def related_products(exclude):
    picks = [p for p in PRODUCTS if p[0] != exclude][:3]
    return related("Build the rest of your <em>phone layer.</em>", [(i, n, d, f"/products/{s}/") for s, n, i, d in picks])

def msg(cls, text): return f'<div class="msg {cls}">{E(text)}</div>'

# ---------------------------------------------------------------- shared code samples (from docs.tryvox.io)
CALL_CURL = '''# Place an outbound call
curl -X POST https://api.tryvox.io/v1/voice/accounts/$TRYVOX_AUTH_ID/calls \\
  -u $TRYVOX_AUTH_ID:$TRYVOX_AUTH_TOKEN \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "+918047182290",
    "to": "+919812345678",
    "answer_url": "https://example.com/answer",
    "hangup_url": "https://example.com/hangup",
    "status_callback_url": "https://example.com/status",
    "ring_timeout": 30,
    "time_limit": 3600
  }\''''
CALL_NODE = '''// Place an outbound call
const { TRYVOX_AUTH_ID: id, TRYVOX_AUTH_TOKEN: token } = process.env;

const res = await fetch(`https://api.tryvox.io/v1/voice/accounts/${id}/calls`, {
  method: "POST",
  headers: {
    Authorization: "Basic " + Buffer.from(`${id}:${token}`).toString("base64"),
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from: "+918047182290",
    to: "+919812345678",
    answer_url: "https://example.com/answer",
    hangup_url: "https://example.com/hangup",
  }),
});
const { data } = await res.json(); // data.status === "queued"'''
CALL_PY = '''# Place an outbound call
import os, requests

auth_id = os.environ["TRYVOX_AUTH_ID"]
call = requests.post(
    f"https://api.tryvox.io/v1/voice/accounts/{auth_id}/calls",
    auth=(auth_id, os.environ["TRYVOX_AUTH_TOKEN"]),
    json={
        "from": "+918047182290",
        "to": "+919812345678",
        "answer_url": "https://example.com/answer",
        "hangup_url": "https://example.com/hangup",
    },
).json()["data"]'''
SIP_HEADERS = '''# Headers your agent receives on an inbound call
# after you bind a TryVox number to it

X-TryVox-Direction:    inbound
X-TryVox-Route:        ai-agent
X-TryVox-AI-Provider:  vapi | elevenlabs | retell
X-TryVox-From:         <E.164 caller>
X-TryVox-To:           <E.164 TryVox number>'''
AUTH_CURL = '''# Every request uses HTTP Basic auth:
# username = Auth ID, password = Auth Token (both from the dashboard)

curl -u $TRYVOX_AUTH_ID:$TRYVOX_AUTH_TOKEN \\
  https://api.tryvox.io/v1/account/$TRYVOX_AUTH_ID/numbers'''
CALL_RESP = '''// 201 Created
{
  "data": {
    "request_uuid": "…",
    "from": "+918047182290",
    "to": "+919812345678",
    "direction": "outbound",
    "status": "queued",
    "duration": 0,
    "billsec": 0
  }
}'''
NOTE_CALL = f'Based on <a href="{DOCS}/voice/make-call">Make a call</a> in the TryVox docs.'

# ---------------------------------------------------------------- v3: one clean template for products and one for solutions
ON = ' class="on"'
def pm(crumbs, body, badge="", cls=""):
    c = '<span class="sep">›</span>'.join(f"<span>{E(x)}</span>" for x in crumbs)
    b = f'<span class="pm-b">{badge}</span>' if badge else ""
    return f'<div class="pm{(" " + cls) if cls else ""}"><div class="pm-h"><span class="pm-c">{c}</span>{b}</div><div class="pm-body">{body}</div></div>'
def pill(t, k=""): return f'<span class="pill{(" " + k) if k else ""}">{E(t)}</span>'
def tbl(cols, rows, tmpl, hide=()):
    def cell(i, v):
        h = ' class="hs"' if i in hide else ""
        return f'<span{h}>{v}</span>'
    head = "".join(cell(i, E(c)) for i, c in enumerate(cols))
    body = "".join('<div class="tr">' + "".join(cell(i, v) for i, v in enumerate(r)) + "</div>" for r in rows)
    return f'<div class="tbl" style="--cols:{tmpl}"><div class="tr th">{head}</div>{body}</div>'
def spark(pts, label, tags=()):
    w, h = 600, 130
    mx = max(pts); n = len(pts) - 1
    xy = [(round(i * w / n, 1), round(h - 12 - (v / mx) * (h - 30), 1)) for i, v in enumerate(pts)]
    d = "M" + " L".join(f"{x},{y}" for x, y in xy)
    marks = "".join(f'<circle cx="{xy[i][0]}" cy="{xy[i][1]}" r="4" fill="#B48AFF"/>' for i, _ in tags)
    lab = "".join(f'<span style="left:{round(xy[i][0] / w * 100, 1)}%">{E(t)}</span>' for i, t in tags)
    return f'''<div class="spark"><span class="mlabel">{E(label)}</span><div class="sp-w"><div class="sp-tags">{lab}</div><svg viewBox="0 0 {w} {h}" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3EDB5A" stop-opacity=".22"/><stop offset="1" stop-color="#3EDB5A" stop-opacity="0"/></linearGradient></defs><path d="{d} L{w},{h} L0,{h} Z" fill="url(#sg)"/><path class="sl" d="{d}" fill="none" stroke="#3EDB5A" stroke-width="2" vector-effect="non-scaling-stroke"/>{marks}</svg></div></div>'''
def chips(items, on=0):
    return '<div class="mchips">' + "".join(f'<span{ON if i == on else ""}>{E(x)}</span>' for i, x in enumerate(items)) + "</div>"
def mono(text): return f'<pre class="mcode">{E(text)}</pre>'
def feed(lines): return '<div class="mfeed">' + "".join(msg(c, t) for c, t in lines) + "</div>"
def rows(pairs): return "".join(f'<div class="mrow"><span>{a}</span><span>{b}</span></div>' for a, b in pairs)
def did(items, result=None):
    li = "".join(f"<li><span>{x}</span></li>" for x in items)
    r = f'<div class="did-r">{pill("Done")}<p>{result}</p></div>' if result else ""
    return f'<ul class="did">{li}</ul>{r}'
def duo(lt, lh, rt, rh): return f'<div class="duo"><div><p class="duo-t">{E(lt)}</p>{lh}</div><div><p class="duo-t">{E(rt)}</p>{rh}</div></div>'
def code(t): return f"<code>{E(t)}</code>"

LOGOIMG = {"vapi": ("Vapi", 55), "retell": ("Retell AI", 65), "livekit": ("LiveKit", 18), "bolna": ("Bolna", 28)}
def provgrid(on="vapi"):
    out = ""
    for k in ["vapi", "retell", "elevenlabs", "livekit", "bolna", "more"]:
        cls = ON if k == on else ""
        if k in LOGOIMG:
            n, w = LOGOIMG[k]
            out += f'<span{cls}><img src="/assets/logos/{k}.svg" alt="{n}" width="{w}" height="18"></span>'
        else:
            out += f'<span{cls}><em>{"ElevenLabs" if k == "elevenlabs" else "+ more"}</em></span>'
    return f'<div class="mprov">{out}</div>'

def hero3(crumbs, tag, h1, sub, visual, primary=("Start free", APP), secondary=("Talk to sales", "/contact/"), micro=("No lock-in", "Pay per minute", "Live in minutes")):
    m = "".join(f"<span>{E(x)}</span>" for x in micro)
    return f'''<section class="h3 wrap">
  <div class="h3-grid">
    <div class="h3-copy">
      {crumb(crumbs)}
      <p class="tag"><i></i>{E(tag)}</p>
      <h1 class="hd">{h1}</h1>
      <p class="sub">{E(sub)}</p>
      <div class="cta"><a class="kbtn" href="{primary[1]}">{E(primary[0])}</a><a class="obtn" href="{secondary[1]}">{E(secondary[0])}</a></div>
      <div class="micro">{m}</div>
    </div>
    <div class="h3-vis rv">{visual}</div>
  </div>
</section>'''

def problem(tag, h2, cols, wide):
    c = "".join(f'<div class="pc rv"><h3>{E(t)}</h3><p>{E(d)}</p></div>' for t, d in cols)
    return f'<section class="wrap sect tight"><div class="ctr rv"><p class="tag"><i></i>{E(tag)}</p><h2 class="hd h2">{h2}</h2></div><div class="pcols">{c}</div>' + (f'<div class="wide rv">{wide}</div>' if wide else '') + '</section>'

def rowsec(items):
    out = ""
    for i, it in enumerate(items):
        tag, h3, p, ticks, vis = it
        t = ("<ul class=\"ticks\">" + "".join(f"<li>{E(x)}</li>" for x in ticks) + "</ul>") if ticks else ""
        out += f'<div class="r3{" flip" if i % 2 else ""}"><div class="r3-copy rv"><p class="tag"><i></i>{E(tag)}</p><h2 class="hd">{h3}</h2><p>{E(p)}</p>{t}</div><div class="r3-vis rv">{vis}</div></div>'
    return f'<section class="wrap r3s">{out}</section>'

def steps3(tag, h2, items):
    cells = ""
    for idx, it in enumerate(items, 1):
        link = f'<a href="{it[2]}">Read the guide ↗</a>' if len(it) > 2 and it[2] else ""
        cells += f'<div class="s3 rv"><span class="n">{idx:02d}</span><h3>{E(it[0])}</h3><p>{E(it[1])}</p>{link}</div>'
    return f'<section class="wrap sect tight"><div class="ctr rv"><p class="tag"><i></i>{E(tag)}</p><h2 class="hd h2">{h2}</h2></div><div class="s3s" style="--n:{len(items)}"><i class="s3-line"></i>{cells}</div></section>'

def results(tag, h2, items, wide=""):
    c = "".join(f'<div class="rs rv"><p class="mlab">{E(l)}</p><b>{E(v)}</b><p>{E(d)}</p></div>' for l, v, d in items)
    w = f'<div class="wide rv">{wide}</div>' if wide else ""
    return f'<section class="wrap sect tight"><div class="ctr rv"><p class="tag"><i></i>{E(tag)}</p><h2 class="hd h2">{h2}</h2></div><div class="rss">{c}</div>{w}</section>'

def ctaband(h2, sub):
    return f'<section class="wrap"><div class="cband rv"><div><h2 class="hd">{h2}</h2><p>{E(sub)}</p></div><div class="cta"><a class="kbtn" href="{APP}">Start free</a><a class="obtn" href="/contact/">Talk to sales</a></div></div></section>'

def devsec(code_, note):
    return f'<section class="wrap sect tight"><div class="devgrid"><div class="rv"><p class="tag"><i></i>For developers</p><h2 class="hd h2" style="margin-top:20px">Straight from <em>the docs.</em></h2><p class="sub">A REST API at api.tryvox.io with HTTP Basic auth. Every example on this page matches the documentation.</p><div class="cta"><a class="obtn" href="/developers/">Developer hub</a><a class="obtn" href="{DOCS}/">Read the docs ↗</a></div></div><div class="rv" style="min-width:0">{code_panel(code_, note)}</div></div></section>'

STD_RESULTS = [("Response time", "<200ms", "Platform response time, so callers never wait on the line."),
               ("Platform uptime", "99.9%", "Telephony that stays up while your campaigns run."),
               ("Availability", "24/7", "Your agent answers at 3 AM the same way it does at noon.")]

# ---------------------------------------------------------------- product content
P = {}
P["phone-numbers"] = dict(
 title="Virtual Phone Numbers in India for AI Voice Agents | TryVox",
 desc="Buy local, national and toll-free Indian phone numbers with online KYC and route them to Vapi, Retell, ElevenLabs, LiveKit, Bolna or your SIP trunk. Pay per minute.",
 tag="Phone numbers",
 h1="Indian phone numbers for <em>your AI agent.</em>",
 sub="Get local, national and toll-free numbers with online business KYC, then route each one to your voice agent, a SIP trunk or your own code. Live in minutes, billed per minute.",
 hero=pm(["Numbers", "Search"], f'<div class="msearch">{ICON["search"]}<span>Search <b>Bengaluru</b></span>{chips(["Local", "National", "Toll-free"])}</div>' + tbl(["Number", "Type", "Status"], [['<b class="mono">+91 80 4718 2290</b>', "Local", pill("Available")], ['<b class="mono">+91 80 4718 3301</b>', "Local", pill("Available")], ['<b class="mono">+91 80 4718 5528</b>', "Local", pill("Available")], ['<b class="mono">1800 xxx xxxx</b>', "Toll-free", pill("On request", "w")]], "1.6fr 1fr 1fr"), "Live"),
 ptag="Why numbers matter", ph2="People pick up numbers <em>they recognise.</em>",
 pcols=[("Unknown numbers get screened", "An unfamiliar or out-of-state number lowers pickup before your agent says a word."),
        ("Paperwork slows every launch", "Legacy providers need forms, emails and days of back-and-forth before a number goes live."),
        ("Routing is stuck in tickets", "Moving a number from an IVR to an AI agent usually means raising a carrier request.")],
 pwide=pm(["Numbers", "+91 80 4718 2290"], duo("Configuration", rows([("Type", "Local · Bengaluru"), ("KYC", pill("Verified")), ("Routed to", "AI agent · Vapi"), ("Caller ID", pill("Verified"))]),
        "What TryVox did", did(["Reserved <b>+91 80 4718 2290</b> in Bengaluru", "Ran business KYC online and marked it verified", "Bound the number to your Vapi agent " + code("Collections · Riya"), "Started sending call events to " + code("status_callback_url")], "Number live and answering inbound calls through your agent.")), pill("Active")),
 rows=[("Search and buy", "Pick a number in the city <em>you call most.</em>", "Search by city or number type and buy instantly from the dashboard or the Numbers API. Give every region, brand or campaign its own line.", ["Local, national and toll-free numbers", "Buy from the dashboard or the API", "Release numbers you no longer need"],
        pm(["Numbers", "Search"], f'<div class="msearch">{ICON["search"]}<span>Search <b>Mumbai · local</b></span></div>' + rows([('<span class="mono">+91 22 6120 4471</span>', '<span class="mbtn">Buy</span>'), ('<span class="mono">+91 22 6120 5180</span>', '<span class="mbtn">Buy</span>'), ('<span class="mono">+91 22 6120 7702</span>', '<span class="mbtn">Buy</span>')]))),
       ("Online KYC", "Verify once. <em>Go live fast.</em>", "Business KYC happens online, the way India's telecom rules require, so you are not chasing documents over email before launch.", ["One verification for your business", "Status visible in the dashboard", "Numbers go live as soon as you're verified"],
        pm(["Compliance", "Business KYC"], did(["Business details submitted", "Documents uploaded", "Review complete", "Numbers released for use"]), pill("Verified"))),
       ("Flexible routing", "Point any number <em>anywhere, any time.</em>", "Send a number to an AI agent, a SIP trunk or a VoxML call flow, and switch it whenever you like. No carrier ticket, no downtime.", ["Bind to Vapi, Retell, ElevenLabs, LiveKit or Bolna", "Or route to a SIP trunk or your own answer_url", "One number binds to one agent at a time"],
        pm(["Numbers", "Routing"], provgrid() + rows([("Number", '<span class="mono">+91 80 4718 2290</span>'), ("Route", "AI agent · Vapi")]), pill("Saved")))],
 steps=[("Search", "Find a local, national or toll-free number by city or type.", f"{DOCS}/numbers/search"),
        ("Verify", "Complete business KYC online, once.", f"{DOCS}/numbers/purchase"),
        ("Route", "Point the number at your agent, trunk or call flow.", f"{DOCS}/numbers/configure")],
 rh2="Numbers that are <em>ready for production.</em>",
 res=[("Number types", "3 line types", "Local, national and toll-free, for every kind of Indian voice line."), ("Time to live", "Minutes", "Online KYC and instant routing, not days of email."), ("Pricing", "Pay per minute", "No lock-in and no monthly minimums.")],
 code={"curl": ("List numbers", AUTH_CURL)}, note=f'Based on <a href="{DOCS}/getting-started/authentication">Authentication</a> in the TryVox docs.',
 faq=[("What kinds of phone numbers can I buy in India?", "Local, national and toll-free numbers. Search by city or type in the dashboard or through the Numbers API."),
      ("Do I need KYC to buy an Indian virtual number?", "Yes. India's telecom rules require business verification. TryVox runs business KYC online before numbers go live."),
      ("Can I use the same number for my AI agent and my team?", "A number binds to one AI agent at a time. You can re-point it to a SIP trunk, a call flow or a different agent whenever you need."),
      ("How fast can I get a number live?", "Most teams search, verify and route a number in minutes once business KYC is complete."),
      ("Is TryVox an alternative to Exotel or Plivo for phone numbers?", "Yes, for teams running AI voice agents. TryVox gives you Indian numbers, SIP, a Voice API and agent bindings in one account, priced per minute.")])

P["sip-trunking"] = dict(
 title="SIP Trunking for AI Voice Agents in India | TryVox",
 desc="Elastic SIP trunks for LiveKit, PBX and AI voice agents in India. Credentials, IP ACLs, channel limits and Bring Your Own Carrier. Pay per minute.",
 tag="SIP trunking",
 h1="SIP trunking built <em>for voice AI.</em>",
 sub="Connect LiveKit, your PBX or any SIP stack to the Indian phone network. Create trunks in minutes, lock them with credentials and IP access lists, set channel limits, or bring your own carrier.",
 hero=pm(["SIP trunks", "trunk-prod"], rows([("Domain", '<span class="mono">trunk.tryvox.io</span>'), ("Direction", "Inbound + outbound"), ("Credentials", pill("2 active")), ("IP ACL", "2 ranges allowed"), ("Channels", "30 concurrent")]), pill("Active")),
 ptag="Why teams switch", ph2="Carrier setup <em>shouldn't take weeks.</em>",
 pcols=[("Slow carrier onboarding", "Traditional trunks mean contracts, IP whitelists over email and weeks of testing before a single call."),
        ("Open trunks invite fraud", "Without credentials and IP controls, a leaked trunk becomes a toll-fraud bill."),
        ("Capacity is guesswork", "With no channel limits, one campaign spike can starve every other workload.")],
 pwide=pm(["SIP trunks", "trunk-prod"], duo("Configuration", rows([("Name", "trunk-prod"), ("Direction", "Inbound + outbound"), ("Auth", "Credentials + IP ACL"), ("Channel limit", "30")]),
        "What TryVox did", did(["Created " + code("trunk-prod") + " on " + code("trunk.tryvox.io"), "Issued SIP credentials " + code("agent-prod"), "Allowed calls only from " + code("203.0.113.0/28"), "Capped concurrency at 30 channels"], "Trunk ready for your LiveKit agent and PBX.")), pill("Active")),
 rows=[("Create", "A production trunk <em>in one form.</em>", "Name it, choose inbound, outbound or both, and point your SIP client at it. Works with LiveKit, Asterisk, FreeSWITCH or any standards-based stack.", ["Inbound and outbound on one trunk", "Create from the dashboard or the API", "Works with any SIP client"],
        pm(["SIP trunks", "New trunk"], rows([("Name", "trunk-prod"), ("Direction", pill("Inbound + outbound", "p")), ("Domain", '<span class="mono">trunk.tryvox.io</span>')]))),
       ("Secure", "Only the traffic <em>you trust.</em>", "Lock every trunk with SIP credentials, IP access lists, or both, and rotate credentials without downtime.", ["Credentials per trunk", "IP allow-lists", "Rotate without dropping calls"],
        pm(["trunk-prod", "Security"], rows([('<span class="mono">agent-prod</span>', pill("Credential")), ('<span class="mono">203.0.113.0/28</span>', pill("Allowed")), ('<span class="mono">198.51.100.4</span>', pill("Allowed")), ("Everything else", pill("Denied", "w"))]))),
       ("Scale or BYOC", "Set the capacity. <em>Keep your carrier.</em>", "Choose how many concurrent calls each trunk carries. Already have a carrier? Bring Your Own Carrier keeps your routes and rates while TryVox handles routing and events.", ["Channel limits per trunk", "Bring Your Own Carrier", "Same call events on every route"],
        pm(["Routing", "BYOC"], did(["Your carrier · SIP", "TryVox routing and call events", "Your agent or PBX"]), pill("Healthy")))],
 steps=[("Create the trunk", "Name it and choose the call direction.", f"{DOCS}/sip-trunking/create-trunk"),
        ("Secure it", "Add credentials, an IP ACL, or both.", f"{DOCS}/sip-trunking/credentials"),
        ("Set capacity", "Choose concurrent channels, or bring your carrier.", f"{DOCS}/sip-trunking/channels")],
 rh2="Trunks your agents <em>can rely on.</em>",
 res=[("Directions", "Inbound + outbound", "One trunk carries both, so routing stays simple."), ("Security", "Credentials + IP ACL", "Use either or both on every trunk."), ("Carrier", "TryVox or BYOC", "Start with ours or keep the routes you already have.")],
 code=None, note="",
 faq=[("What is SIP trunking?", "A SIP trunk carries phone calls over the internet between the public phone network and your systems, such as a voice agent, LiveKit or a PBX."),
      ("Can I use TryVox SIP trunks with LiveKit?", "Yes. Point LiveKit or any standards-based SIP client at your TryVox trunk domain with your credentials."),
      ("How do I stop unauthorised use of my trunk?", "Use SIP credentials, IP access lists, or both. Rotate credentials any time."),
      ("How many concurrent calls can a trunk carry?", "You set a channel limit per trunk. Talk to us if you need more capacity."),
      ("Can I bring my own carrier?", "Yes. Bring Your Own Carrier keeps your routes and rates while you use TryVox routing and call events on top.")])

P["voice-api"] = dict(
 title="Programmable Voice API and VoxML for India | TryVox",
 desc="Place and control calls with one REST API. Webhooks at every stage, recordings, conferences and VoxML call flows for AI voice agents in India.",
 tag="Voice API",
 h1="A voice API your agent <em>can build on.</em>",
 sub="Place and control calls with one REST API at api.tryvox.io. Get a webhook at every stage, record calls, run conferences and build call flows with VoxML.",
 hero=pm(["Calls", "call_8f2a19"], feed([("ev", "POST /v1/voice/accounts/{auth_id}/calls"), ("ev ok", "201 · status: queued"), ("ev", "ring_url · ringing"), ("ev ok", "answer_url · VoxML returned"), ("a", "Hi, this is Riya from Acme Finance."), ("ev", "hangup_url · call record sent")]), pill("In progress")),
 ptag="Why teams switch", ph2="Calls shouldn't be <em>a black box.</em>",
 pcols=[("No visibility mid-call", "When you can't see ringing, answer and hangup, you can't fix drop-offs or bill accurately."),
        ("IVRs locked in a console", "Menus hard-coded in a vendor UI can't change as fast as your product does."),
        ("Glue code everywhere", "Stitching carriers, recordings and webhooks together eats weeks of engineering time.")],
 pwide=pm(["Calls", "call_8f2a19"], duo("Request", mono('POST /v1/voice/accounts/{auth_id}/calls\n{\n  "from": "+918047182290",\n  "to": "+919812345678",\n  "answer_url": "https://example.com/answer"\n}'),
        "What TryVox did", did(["Queued the call and returned " + code("201"), "Called " + code("ring_url") + " while it rang", "Fetched VoxML from " + code("answer_url"), "Sent the final record to " + code("hangup_url")], "Call completed in 3:08 with every event delivered.")), pill("Completed")),
 rows=[("Make calls", "One request <em>starts the call.</em>", "POST from, to and answer_url. TryVox replies 201 with status queued and calls your webhooks as the call moves. Place calls one by one or in bulk.", ["ring_timeout and time_limit per call", "Bulk calls on the same endpoint", "HTTP Basic auth with Auth ID and Token"],
        pm(["Calls", "Today"], tbl(["Call", "Status", "Duration"], [['<b class="mono">call_8f2a19</b>', pill("In progress"), '<span class="mono">01:42</span>'], ['<b class="mono">call_7c11e0</b>', pill("Ringing", "p"), '<span class="mono">00:00</span>'], ['<b class="mono">call_6b90d4</b>', pill("Completed", "w"), '<span class="mono">03:08</span>']], "1.4fr 1fr .8fr"))),
       ("Webhooks", "Every stage, <em>in your system.</em>", "Ring, answer, status and hangup callbacks reach your endpoint as they happen, signed with your webhook secret.", ["ring_url, answer_url, hangup_url", "status_callback_url for progress", "Signed with webhook_secret"],
        pm(["Webhooks", "Log"], feed([("ev", "POST ring_url · 200"), ("ev ok", "POST answer_url · VoxML"), ("ev", "POST status_callback_url · 200"), ("ev", "POST hangup_url · 200")]), pill("Signed"))),
       ("VoxML", "Build the call flow <em>in VoxML.</em>", "When a call is answered, TryVox asks your answer_url what to do. Reply with VoxML verbs and TryVox runs them on the call.", ["Say, Play and Gather for menus", "Dial and Conference to bring people in", "Stream to send live audio to your agent"],
        pm(["VoxML", "answer_url"], did(["Say a greeting", "Gather a keypress", "Stream audio to the agent", "Dial a person on request"])))],
 steps=[("Authenticate", "Use your Auth ID and Auth Token from the dashboard.", f"{DOCS}/getting-started/authentication"),
        ("Place a call", "POST from, to and answer_url to the calls endpoint.", f"{DOCS}/voice/make-call"),
        ("Return VoxML", "Answer with VoxML to say, gather, dial or stream.", f"{DOCS}/voxml")],
 rh2="An API that <em>stays out of your way.</em>",
 res=[("Auth", "HTTP Basic", "Auth ID and Auth Token. Nothing else to manage."), ("Events", "Every stage", "Ring, answer, status and hangup, delivered to you."), ("Call flows", "VoxML", "Say, Gather, Dial, Stream, Record and Conference.")],
 code={"curl": ("cURL", CALL_CURL), "node": ("Node", CALL_NODE), "py": ("Python", CALL_PY), "resp": ("Response", CALL_RESP)}, note=NOTE_CALL,
 faq=[("How do I authenticate with the TryVox Voice API?", "HTTP Basic auth. Your Auth ID is the username and your Auth Token is the password. Both are in the dashboard."),
      ("What does answer_url need to return?", "VoxML. TryVox calls answer_url when the call is answered and runs the VoxML verbs you return."),
      ("Can I place outbound calls in bulk?", "Yes. The same calls endpoint accepts a list of calls."),
      ("Can I record calls?", "Yes. Record calls and fetch recordings through the API."),
      ("Is answering machine detection available?", "Not yet. The parameter is accepted but has no effect today, so don't rely on it.")])

P["ai-agents"] = dict(
 title="Connect Vapi, Retell, ElevenLabs, LiveKit and Bolna to Indian Numbers | TryVox",
 desc="Bind an Indian phone number to your Vapi, Retell, ElevenLabs, LiveKit or Bolna voice agent in a few clicks. No SIP configuration or deployment needed.",
 tag="AI agents",
 h1="Put your AI agent on <em>a real phone number.</em>",
 sub="Pick your provider, choose a TryVox number and an agent, and confirm. Your Vapi, Retell, ElevenLabs, LiveKit or Bolna agent answers calls straight away, with no SIP setup.",
 hero=pm(["AI agents", "Connect number"], provgrid() + rows([("Number", '<span class="mono">+91 80 4718 2290</span>'), ("Agent", "Collections · Riya"), ("Status", pill("Connected"))])),
 ptag="Why teams switch", ph2="Your agent is ready. <em>Telephony shouldn't hold it back.</em>",
 pcols=[("Telephony stalls the launch", "Agents get built in days, then wait weeks for numbers, trunks and carrier approvals."),
        ("Locked to one provider", "Numbers bought inside an agent platform make switching providers painful."),
        ("No context on the call", "Without caller and route details, the agent starts every conversation blind.")],
 pwide=pm(["AI agents", "+91 80 4718 2290"], duo("Incoming call", feed([("ev", "Inbound · +91 98•• ••5678"), ("a", "Hi, you've reached Acme support. How can I help?"), ("c", "I want to check my order."), ("a", "Sure, can you share the order number?")]),
        "What TryVox did", did(["Matched the number to its binding " + code("Vapi · Support"), "Sent " + code("X-TryVox-Direction: inbound") + " and caller headers", "Streamed audio to the agent", "Logged the call record and events"], "Agent answered on the first ring.")), pill("Live")),
 rows=[("Bring any agent", "Keep the platform <em>you already chose.</em>", "Vapi, Retell, ElevenLabs, LiveKit and Bolna work today. TryVox is only the phone layer, so you never feed a competitor or get locked in.", ["Five providers today, more coming", "Switch providers without changing numbers", "No lock-in"],
        pm(["AI agents", "Providers"], provgrid("retell"))),
       ("Bind in clicks", "One number, <em>one agent.</em>", "Choose an active number and an agent and confirm. Calls arrive at the agent immediately, with no deployment or SIP configuration.", ["Each number binds to one agent", "Remove a binding to fall back", "Don't also set it inbound in your provider"],
        pm(["AI agents", "Bindings"], tbl(["Number", "Provider", "Agent"], [['<b class="mono">+91 80 4718 2290</b>', "Vapi", "Riya"], ['<b class="mono">+91 22 6120 4471</b>', "Retell", "Arjun"], ['<b class="mono">1800 xxx xxxx</b>', "Bolna", "Meera"]], "1.5fr .9fr .9fr"))),
       ("Context headers", "Every call arrives <em>with context.</em>", "Your agent receives the direction, route, provider, caller and number in SIP headers, so it can greet and route correctly.", ["X-TryVox-Direction and Route", "X-TryVox-From and To", "Same call records as every call"],
        pm(["SIP headers", "Inbound"], mono(SIP_HEADERS)))],
 steps=[("Choose a provider", "Open AI Agents and pick your integration.", f"{DOCS}/ai-agents/connect-provider"),
        ("Pick number and agent", "Choose an active number and an agent from your provider.", f"{DOCS}/ai-agents/connect-number"),
        ("Confirm", "The agent answers calls on that number right away.", None)],
 rh2="The fastest way to <em>a live agent line.</em>",
 res=[("Providers", "5 and counting", "Vapi, Retell, ElevenLabs, LiveKit and Bolna."), ("Setup", "No SIP config", "Bind a number in a few clicks."), ("Routing", "1 number, 1 agent", "Predictable routing you can reason about.")],
 code={"sip": ("Agent SIP headers", SIP_HEADERS)}, note=f'From <a href="{DOCS}/ai-agents/connect-number">Connect a number</a> in the TryVox docs.',
 faq=[("Which AI voice agent platforms work with TryVox?", "Vapi, Retell, ElevenLabs, LiveKit and Bolna."),
      ("Do I need to configure SIP to connect my agent?", "No. Binding a number to an agent needs no deployment or SIP configuration."),
      ("Can my agent make outbound calls through TryVox?", "Inbound calls to a bound number go straight to the agent. Outbound calls from agents are still in progress, so don't rely on them for production yet."),
      ("Can one number go to two agents?", "No. A number binds to one agent at a time."),
      ("Should I also set the number as inbound in my provider?", "No. Doing both can make calls conflict. Let TryVox route the number to the agent.")])

P["messaging"] = dict(
 title="WhatsApp Business API and DLT SMS for Voice AI Teams | TryVox",
 desc="Send WhatsApp messages, take WhatsApp calls and send DLT-compliant SMS from the same account as your Indian phone numbers. Follow up the moment a call ends.",
 tag="Messaging",
 h1="Follow every call with <em>WhatsApp or SMS.</em>",
 sub="Send WhatsApp messages, take WhatsApp calls and send DLT-ready SMS from the same account as your numbers. Confirm, remind and share links the moment a call ends.",
 hero=pm(["Messaging", "WhatsApp"], feed([("ev ok", "call.completed · 02:41"), ("a", "Thanks for your time today. Here is your payment link for Friday's EMI."), ("c", "Paid. Thank you!"), ("ev", "payment_reminder · delivered · read")]), pill("Read")),
 ptag="Why teams switch", ph2="The call ends. <em>The follow-up shouldn't.</em>",
 pcols=[("Links get lost on calls", "Customers can't write down a payment link or an address while they're on the phone."),
        ("Two vendors, two bills", "Separate voice and messaging providers mean double integration and messy reporting."),
        ("SMS rules are strict", "In India, commercial SMS needs DLT registration and approved templates.")],
 pwide=pm(["Messaging", "After the call"], duo("Conversation", feed([("a", "Shall I send the payment link on WhatsApp?"), ("c", "Yes please."), ("ev ok", "call.completed"), ("a", "Here's your link for ₹4,250.")]),
        "What TryVox did", did(["Received " + code("call.completed") + " for the call", "Sent WhatsApp template " + code("payment_reminder"), "Tracked delivered and read events", "Billed voice and messaging on one account"], "Payment link read 40 seconds after the call.")), pill("Read")),
 rows=[("WhatsApp", "WhatsApp messages <em>and calls.</em>", "Send and receive WhatsApp messages and take WhatsApp calls alongside your phone numbers, all from one account.", ["WhatsApp messaging", "WhatsApp calling", "Delivery and read events"],
        pm(["WhatsApp", "Conversation"], feed([("a", "Your appointment is confirmed for Thursday at 4 PM."), ("c", "Can I bring a family member?"), ("a", "Of course. See you Thursday.")]))),
       ("Templates", "Approved templates, <em>ready to send.</em>", "Manage the templates your campaigns use and see which are approved before you send.", ["Template management", "Approval status at a glance", "Reuse across campaigns"],
        pm(["Messaging", "Templates"], tbl(["Template", "Channel", "Status"], [['<b class="mono">payment_reminder</b>', "WhatsApp", pill("Approved")], ['<b class="mono">otp_login</b>', "SMS · DLT", pill("Approved")], ['<b class="mono">delivery_slot</b>', "WhatsApp", pill("Pending", "w")]], "1.6fr 1fr .9fr"))),
       ("DLT SMS", "SMS that follows <em>India's DLT rules.</em>", "Send OTPs, reminders and alerts with your DLT entity and templates linked, so messages are delivered rather than blocked.", ["DLT entity and templates", "OTPs, alerts and reminders", "Same account as your numbers"],
        pm(["SMS", "DLT"], did(["DLT entity linked", "Template " + code("otp_login") + " approved", "Header registered", "Ready to send"]), pill("Ready")))],
 steps=[("Add a channel", "Connect WhatsApp and SMS to your account.", f"{DOCS}/messaging/channels"),
        ("Set up templates", "Prepare and approve the templates you'll send.", f"{DOCS}/messaging/templates"),
        ("Send", "Send from the API or right after each call.", f"{DOCS}/messaging/send")],
 rh2="Voice and messaging, <em>one account.</em>",
 res=[("Channels", "WhatsApp + SMS", "Plus WhatsApp calling, next to your phone numbers."), ("Compliance", "DLT-ready", "Entity and template workflows for India."), ("Billing", "One bill", "Voice and messaging, pay as you go.")],
 code=None, note="",
 faq=[("Can I send a WhatsApp message after an AI call?", "Yes. Messaging runs on the same account as your numbers, so you can follow up when a call ends."),
      ("Does TryVox support WhatsApp calling?", "Yes. Take WhatsApp calls alongside your phone numbers."),
      ("Is TryVox SMS DLT-compliant?", "Yes. DLT registration is part of compliance in TryVox."),
      ("Do I need a separate account for messaging?", "No. Voice and messaging share one account and one bill.")])

P["compliance"] = dict(
 title="Telecom Compliance for AI Calling in India: KYC, DLT, Consent | TryVox",
 desc="Business KYC, consent records, DLT registration, verified caller IDs and signed webhooks, built into TryVox for AI voice calling in India.",
 tag="Compliance",
 h1="Stay compliant <em>on every call.</em>",
 sub="Business KYC, consent records, DLT registration and verified caller IDs are built into TryVox, so compliance isn't a project you run on the side.",
 hero=pm(["Compliance", "Readiness"], did(["Business KYC · verified", "Consent records · per contact", "DLT entity · linked", "Caller IDs · 2 verified"]), pill("Ready")),
 ptag="Why it matters", ph2="AI calling is regulated. <em>Your stack should be too.</em>",
 pcols=[("Rules change, fines don't", "KYC, consent and DLT rules apply to every commercial call and SMS in India."),
        ("Records live everywhere", "Consent in a spreadsheet and calls in another tool make audits slow and risky."),
        ("Spoofed caller IDs hurt trust", "Unverified numbers get flagged, and customers stop answering.")],
 pwide=pm(["Compliance", "Audit"], duo("Call record", rows([("Call", '<span class="mono">call_6b90d4</span>'), ("Caller ID", '<span class="mono">+91 80 4718 2290</span>'), ("Consent", pill("Recorded")), ("Duration", '<span class="mono">03:08</span>')]),
        "What TryVox checked", did(["Business KYC verified before the number went live", "Consent found for the contact", "Caller ID verified for outbound", "Signed webhook sent with the call record"], "Call fully auditable.")), pill("Compliant")),
 rows=[("Business KYC", "Verify <em>once, online.</em>", "Business verification happens online before numbers are issued, as India's telecom rules require.", ["Online, no paperwork loop", "Status in the dashboard", "Required for every number"],
        pm(["Compliance", "KYC"], did(["Business details", "Documents", "Review complete"]), pill("Verified"))),
       ("Consent", "Consent, <em>on record.</em>", "Store consent for the people you call and respect it when they withdraw.", ["Consent per contact", "Withdrawals respected", "Records you can export"],
        pm(["Compliance", "Consent"], tbl(["Contact", "Status"], [['<span class="mono">+91 98•• ••5678</span>', pill("Consented")], ['<span class="mono">+91 99•• ••0412</span>', pill("Consented")], ['<span class="mono">+91 97•• ••2231</span>', pill("Withdrawn", "w")]], "1.6fr 1fr"))),
       ("DLT and caller ID", "Register, verify, <em>send.</em>", "Link your DLT entity for SMS, verify the numbers you call from, and receive webhooks signed with your secret.", ["DLT entity and templates", "Verified caller IDs", "Signed webhooks"],
        pm(["Compliance", "DLT · Caller IDs"], did(["DLT entity linked", "Template " + code("otp_login") + " approved", "Caller ID " + code("+91 80 4718 2290") + " verified"]), pill("Ready")))],
 steps=[("Complete KYC", "Verify your business once, online.", None),
        ("Record consent", "Store consent for the contacts you call.", f"{DOCS}/compliance/consent"),
        ("Register for DLT", "Link your DLT entity for SMS.", f"{DOCS}/compliance/dlt")],
 rh2="Compliance built in, <em>not bolted on.</em>",
 res=[("KYC", "Online", "Verification before any number goes live."), ("SMS", "DLT-ready", "Entity and template workflows."), ("Webhooks", "Signed", "Trust every callback you receive.")],
 code=None, note="",
 faq=[("Why does TryVox need business KYC?", "India's telecom rules require business verification before numbers are issued."),
      ("What is DLT registration?", "Distributed Ledger Technology registration, required in India for commercial SMS. TryVox links your DLT entity and templates."),
      ("How do verified caller IDs work?", "You verify that you own a number, then use it as the caller ID on outbound calls."),
      ("Can I record consent for the people I call?", "Yes. Store consent per contact and respect withdrawals.")])

# ---------------------------------------------------------------- solution content
S = {}
S["financial-services"] = dict(title="AI Voice Calling for Banks, NBFCs and Fintech in India | TryVox",
 h1="AI calling for <em>lenders and fintechs.</em>",
 sub="Run EMI reminders, collections, KYC follow-ups and loan servicing with your AI agent on local Indian numbers, with consent records, call events and WhatsApp payment links built in.",
 hero=[("ev", "Outbound · EMI due in 3 days"), ("a", "Hi, this is Riya from Acme Finance. Is this a good time?"), ("c", "Yes, go ahead."), ("a", "Your EMI of ₹4,250 is due on Friday. Shall I send a payment link on WhatsApp?"), ("ev ok", "Promise to pay · Friday · link sent")],
 ph2="Collections calls that don't connect <em>cost you twice.</em>",
 pcols=[("Borrowers screen unknown numbers", "Reminders from an unfamiliar number go unanswered, so dues roll over."),
        ("Every call is regulated", "Consent, calling hours and records have to be right before a single reminder goes out."),
        ("Promises without follow-up", "A promise to pay means little without a payment link sent before the call ends.")],
 convo=[("a", "Your EMI of ₹4,250 is due Friday. Can you pay by then?"), ("c", "Yes, Friday works."), ("a", "Great. I'm sending a payment link on WhatsApp now.")],
 did=["Called from a local Bengaluru number " + code("+91 80 4718 2290"), "Checked consent before dialling", "Streamed audio to your Vapi agent", "Posted the outcome to " + code("status_callback_url"), "Sent WhatsApp template " + code("payment_reminder")], result="Promise to pay logged and payment link delivered.",
 uses=[("EMI reminders", "Remind borrowers <em>before the due date.</em>", "Call ahead of every EMI from a local number, log promises to pay and send the link on WhatsApp in the same flow.", [("ev", "Outbound · EMI due in 3 days"), ("a", "Your EMI of ₹4,250 is due on Friday."), ("c", "I'll pay on Friday."), ("ev ok", "Promise to pay logged")]),
       ("KYC follow-ups", "Finish KYC <em>without the chase.</em>", "Call customers with pending KYC, explain what's missing and send an upload link while they're still on the line.", [("ev", "Outbound · KYC pending"), ("a", "We still need your address proof to finish KYC."), ("c", "Can you send me the link?"), ("ev ok", "Upload link sent on WhatsApp")]),
       ("Loan servicing", "Answer servicing calls <em>any hour.</em>", "Let your agent handle balance, schedule and foreclosure questions on a dedicated line, with a person one transfer away.", [("ev", "Inbound · servicing line"), ("c", "What's my outstanding balance?"), ("a", "It's ₹1,12,400 with 26 EMIs left."), ("ev", "Transfer offered · Dial")])],
 flow=[("Trigger", "EMI due in 3 days"), ("Call", "Agent calls from a local number"), ("Outcome", "Promise to pay: Friday"), ("Follow-up", "WhatsApp payment link sent")],
 prods=["phone-numbers", "ai-agents", "messaging"],
 faq=[("Can collection calls come from a local number?", "Yes. Buy local numbers per region and use verified caller IDs so borrowers recognise the call."),
      ("How does TryVox handle consent for financial calls?", "Store consent per contact in TryVox and respect withdrawals before your agent dials."),
      ("Can a human take over a collections call?", "Yes. Bring a person into the call with Dial or a conference."),
      ("Can I send a payment link after the call?", "Yes. Send a WhatsApp or SMS template from the same account when the call ends.")])
S["healthcare"] = dict(title="AI Phone Agents for Clinics and Hospitals in India | TryVox",
 h1="Patient calls answered <em>on the first ring.</em>",
 sub="Let your AI agent answer patient calls on each clinic's own number, book and move appointments, and send reminders, while staff handle the cases that need a person.",
 hero=[("ev", "Inbound · Indiranagar clinic"), ("c", "Hi, I'd like to move my appointment."), ("a", "Sure. I have Thursday at 4 PM or Friday at 11 AM."), ("c", "Thursday works."), ("ev ok", "Booked · Thursday 4 PM · SMS reminder set")],
 ph2="Every missed call is <em>a missed appointment.</em>",
 pcols=[("Front desks are overloaded", "Staff juggle walk-ins and phones, so calls ring out during the busiest hours."),
        ("No-shows cost revenue", "Without reminders, booked slots go empty and waiting lists grow."),
        ("After-hours calls go nowhere", "Patients who call at night get voicemail and book elsewhere.")],
 convo=[("c", "Do you have a slot tomorrow with Dr. Rao?"), ("a", "Yes, 10:30 AM is free. Shall I book it?"), ("c", "Please do.")],
 did=["Answered on the clinic's local number " + code("+91 80 4718 2290"), "Routed the call to your Retell agent", "Sent the booking to your system via " + code("status_callback_url"), "Scheduled an SMS reminder for the day before"], result="Appointment booked and reminder scheduled.",
 uses=[("Inbound booking", "Every clinic, <em>its own number.</em>", "Give each location a local number bound to your agent, so patients always reach the right clinic.", [("ev", "Inbound · Indiranagar clinic"), ("c", "Do you have a slot tomorrow?"), ("a", "Yes, 10:30 AM with Dr. Rao."), ("ev ok", "Booked · 10:30 AM")]),
       ("Rescheduling", "Move appointments <em>any hour.</em>", "Patients reschedule by phone at night or on weekends, and the slot opens up for someone else.", [("ev", "Inbound · 9:40 PM"), ("c", "I need to move Monday's visit."), ("a", "I can do Wednesday at 5 PM."), ("ev ok", "Rescheduled · Wednesday 5 PM")]),
       ("Reminders", "Fewer no-shows <em>with reminders.</em>", "Send SMS or WhatsApp reminders before every visit from the same account.", [("ev", "24 hours before visit"), ("ev ok", "SMS · appointment_confirm · delivered"), ("c", "CONFIRM"), ("ev ok", "Visit confirmed")])],
 flow=[("Inbound", "Patient calls the clinic"), ("Agent", "Checks open slots"), ("Booked", "Thursday, 4 PM"), ("Reminder", "SMS 24 hours before")],
 prods=["phone-numbers", "ai-agents", "messaging"],
 faq=[("Can each clinic have its own phone number?", "Yes. Buy a local number per clinic and bind each to an agent."),
      ("Can staff take over a patient call?", "Yes. Transfer to a person with Dial."),
      ("Can I send appointment reminders?", "Yes. Send SMS or WhatsApp from the same account."),
      ("Does the agent answer after hours?", "Yes. A bound number reaches your agent 24/7.")])
S["ecommerce"] = dict(title="AI Calling for E-commerce: COD Confirmation and Order Support | TryVox",
 h1="Confirm COD orders <em>before they ship.</em>",
 sub="Confirm cash-on-delivery orders, recover abandoned carts and answer where-is-my-order calls with your AI agent, even on your biggest sale days.",
 hero=[("ev", "Outbound · COD order 48213"), ("a", "Hi! Calling to confirm your order of ₹1,899. Press 1 to confirm."), ("ev", "dtmf · 1"), ("a", "Thanks, your order ships tomorrow."), ("ev ok", "Order released to ship")],
 ph2="Unconfirmed COD orders <em>come back as RTO.</em>",
 pcols=[("Fake and impulse COD orders", "Orders nobody confirmed turn into return-to-origin costs and lost inventory time."),
        ("Sale-day spikes", "Support lines can't scale when order volume jumps tenfold overnight."),
        ("Abandoned carts go cold", "Shoppers who left items behind rarely come back without a nudge.")],
 convo=[("a", "Calling to confirm your ₹1,899 order. Press 1 to confirm."), ("ev", "dtmf · 1"), ("a", "Confirmed. It ships tomorrow.")],
 did=["Placed the call in bulk via the Voice API", "Collected the keypress with VoxML " + code("Gather"), "Posted " + code("confirmed") + " to your order system", "Sent a WhatsApp order summary"], result="Order released to ship.",
 uses=[("COD confirmation", "Cut RTO with <em>one call.</em>", "Call every cash-on-delivery order and confirm with a keypress before it leaves the warehouse.", [("ev", "Outbound · COD order 48213"), ("a", "Press 1 to confirm your ₹1,899 order."), ("ev", "dtmf · 1"), ("ev ok", "Released to ship")]),
       ("Cart recovery", "Bring shoppers <em>back to checkout.</em>", "Call shoppers who left items behind, answer their questions and send a checkout link.", [("ev", "Outbound · cart left 2h ago"), ("a", "Your sneakers are still in your cart."), ("c", "Is there a size 9?"), ("ev ok", "Size 9 reserved · link sent")]),
       ("Order status", "Answer <em>where-is-my-order</em> instantly.", "Let your agent answer order status calls on a toll-free line, so your team handles the exceptions.", [("ev", "Inbound · support line"), ("c", "Where is my order?"), ("a", "It's out for delivery and arrives by 6 PM."), ("ev ok", "Resolved on the call")])],
 flow=[("Trigger", "COD order placed"), ("Call", "Agent confirms the order"), ("Keypad", "Customer presses 1"), ("Outcome", "Order released to ship")],
 prods=["voice-api", "ai-agents", "messaging"],
 faq=[("Can customers confirm an order with a keypress?", "Yes. Collect input with VoxML Gather."),
      ("Can I place confirmation calls in bulk?", "Yes. The calls endpoint accepts a list of calls."),
      ("Can I follow up on WhatsApp?", "Yes, from the same account."),
      ("Will it scale on sale days?", "Calls run on TryVox infrastructure with 99.9% platform uptime. Talk to us before big events so we can plan capacity with you.")])
S["logistics"] = dict(title="AI Calling for Logistics and Last-Mile Delivery | TryVox",
 h1="Delivery calls that <em>reach the doorstep.</em>",
 sub="Confirm delivery slots, reschedule in one call and keep drivers and customers in sync, with every outcome pushed to your systems by webhook.",
 hero=[("ev", "Outbound · out for delivery"), ("a", "Hi, your package arrives today. Is 2 to 4 PM okay?"), ("c", "Can you come after 6?"), ("a", "Done. I've moved it to 6 PM and told the driver."), ("ev ok", "Slot updated · driver app synced")],
 ph2="Failed deliveries <em>start with a missed call.</em>",
 pcols=[("Customers aren't home", "Without a slot confirmation, drivers arrive at locked doors and try again tomorrow."),
        ("Changes don't reach drivers", "A new time agreed on the phone often never makes it to the driver app."),
        ("Ops teams drown in calls", "Dispatch spends its day on status calls instead of exceptions.")],
 convo=[("a", "Is 2 to 4 PM okay for delivery today?"), ("c", "Can you come after 6?"), ("a", "Done. Moved to 6 PM.")],
 did=["Called from a local number before dispatch", "Agent agreed a new slot with the customer", "Sent the outcome to " + code("hangup_url"), "Your TMS updated the driver app"], result="Delivery rescheduled to 6 PM. Driver informed.",
 uses=[("Slot confirmation", "Confirm the window <em>before dispatch.</em>", "Call ahead of every delivery so drivers only go where someone is home.", [("ev", "Outbound · before dispatch"), ("a", "Is 2 to 4 PM okay for delivery?"), ("c", "Yes, that works."), ("ev ok", "Slot confirmed")]),
       ("Rescheduling", "Move a delivery <em>in one call.</em>", "Customers change the slot on the phone and the new time flows straight to your systems.", [("ev", "Outbound · out for delivery"), ("c", "I won't be home until 6."), ("a", "Moved to 6 PM."), ("ev ok", "Driver app updated")]),
       ("Status updates", "Outcomes <em>in your systems.</em>", "Status and hangup callbacks push every result to your TMS or order system.", [("ev", "hangup_url · call record"), ("ev ok", "Order 7731 · slot 18:00"), ("ev", "status_callback_url · completed"), ("ev ok", "TMS updated")])],
 flow=[("Trigger", "Out for delivery"), ("Call", "Agent confirms the slot"), ("Change", "Customer asks for 6 PM"), ("Update", "Driver app updated")],
 prods=["voice-api", "phone-numbers", "ai-agents"],
 faq=[("Can call outcomes update my delivery systems?", "Yes. Use status and hangup callbacks to update orders and driver apps."),
      ("Can I connect a driver to the customer?", "Yes. Bring a driver into the call with Dial or a conference."),
      ("Can I use a toll-free number for support?", "Yes, for inbound support lines."),
      ("Can I call in bulk before dispatch?", "Yes. The calls endpoint accepts a list of calls.")])
S["real-estate"] = dict(title="AI Calling for Real Estate Leads and Site Visits | TryVox",
 h1="Call every lead back <em>in minutes.</em>",
 sub="Call new property leads the moment they land, qualify budget and location, and book site visits while interest is high, from a local number buyers trust.",
 hero=[("ev", "Outbound · new lead · 10:03"), ("a", "Hi, you asked about 2BHK homes in Whitefield. What's your budget?"), ("c", "Around 90 lakh."), ("a", "I can book a site visit on Sunday at 11. Works?"), ("ev ok", "Site visit booked · Sunday 11 AM")],
 ph2="Leads go cold <em>while they wait.</em>",
 pcols=[("Slow callbacks lose buyers", "Portal leads enquire with several builders. The first to call usually wins the visit."),
        ("Sales teams can't keep up", "Weekend and late-night enquiries sit until Monday morning."),
        ("Unqualified visits waste time", "Site visits without budget and timeline checks burn your team's weekend.")],
 convo=[("a", "What budget are you looking at?"), ("c", "Around 90 lakh."), ("a", "Sunday 11 AM for a site visit?")],
 did=["Called the lead within a minute of the enquiry", "Used a local Bengaluru caller ID", "Captured budget and timeline in your CRM via webhook", "Sent the site location on WhatsApp"], result="Qualified lead with a site visit booked.",
 uses=[("Instant callback", "Be the <em>first builder to call.</em>", "Trigger a call the moment a portal or website form comes in, any time of day.", [("ev", "Lead · portal form · 10:02"), ("ev ok", "Outbound call · 10:03"), ("a", "Thanks for your enquiry about Whitefield."), ("c", "Yes, I'm interested.")]),
       ("Qualification", "Know the budget <em>before the visit.</em>", "Your agent captures budget, location and timeline and pushes them to your CRM.", [("a", "What budget are you looking at?"), ("c", "Around 90 lakh."), ("a", "And when do you plan to move?"), ("ev ok", "Qualified · 90L · 3 months")]),
       ("Site visits", "Book the visit <em>on the call.</em>", "Lock in a site visit while interest is high and send the location by WhatsApp.", [("a", "Sunday at 11 for a site visit?"), ("c", "Yes."), ("ev ok", "Visit booked · Sunday 11 AM"), ("ev", "WhatsApp · location sent")])],
 flow=[("Lead", "Form filled on a portal"), ("Call", "Agent calls back in a minute"), ("Qualify", "Budget and location"), ("Booked", "Site visit on Sunday")],
 prods=["phone-numbers", "ai-agents", "messaging"],
 faq=[("How quickly can the agent call a new lead?", "As soon as your system triggers the call through the Voice API or your agent platform."),
      ("Can calls come from a local number?", "Yes. Use a local number per city."),
      ("Can my sales team take over?", "Yes. Transfer to a person when the lead is ready."),
      ("Can I send a confirmation after the call?", "Yes. Send WhatsApp or SMS from the same account.")])
S["travel-hospitality"] = dict(title="AI Phone Agents for Hotels and Travel Companies | TryVox",
 h1="Guest calls answered <em>around the clock.</em>",
 sub="Handle booking changes, check-in questions and confirmations at any hour on local or toll-free lines, with SMS and WhatsApp confirmations from the same account.",
 hero=[("ev", "Inbound · toll-free · 11:40 PM"), ("c", "Can I get a late check-out tomorrow?"), ("a", "Yes, I can extend it to 1 PM for your room."), ("c", "Perfect."), ("ev ok", "Late check-out added · SMS sent")],
 ph2="Guests call at every hour. <em>Your desk can't.</em>",
 pcols=[("Night calls go unanswered", "Travellers in other time zones call when your reservations team is offline."),
        ("Peak seasons overflow", "Holiday weeks bring more calls than any desk can staff for."),
        ("Changes need confirming", "A booking change without a written confirmation leads to disputes at check-in.")],
 convo=[("c", "Can I change my dates to the 14th?"), ("a", "Yes, moved to the 14th to the 16th."), ("c", "Great, thanks.")],
 did=["Answered on your toll-free line", "Routed to your ElevenLabs agent", "Updated the booking through your webhook", "Sent a WhatsApp " + code("booking_confirm")], result="Booking changed and confirmation delivered.",
 uses=[("24/7 lines", "Every call answered, <em>any hour.</em>", "Your agent picks up at 2 AM the same way it does at noon.", [("ev", "Inbound · 2:14 AM"), ("c", "Is the airport shuttle running?"), ("a", "Yes, every 30 minutes from 5 AM."), ("ev ok", "Resolved")]),
       ("Toll-free numbers", "A free number <em>for every guest.</em>", "Give guests a toll-free line for bookings, changes and questions.", [("ev", "Inbound · 1800 line"), ("c", "I need to change my booking dates."), ("a", "Moved to the 14th to the 16th."), ("ev ok", "Booking updated")]),
       ("Confirmations", "Confirm every change <em>in writing.</em>", "Send SMS or WhatsApp confirmations the moment a booking changes.", [("ev ok", "Booking updated"), ("ev", "WhatsApp · booking_confirm"), ("ev ok", "Delivered · read"), ("c", "Got it, thanks!")])],
 flow=[("Inbound", "Guest calls the hotel"), ("Agent", "Finds the booking"), ("Change", "Late check-out added"), ("Confirm", "SMS sent to guest")],
 prods=["phone-numbers", "ai-agents", "messaging"],
 faq=[("Can I offer guests a toll-free number?", "Yes. Buy toll-free numbers for inbound lines."),
      ("Can staff take over a call?", "Yes. Transfer to a person when needed."),
      ("Can I confirm bookings by message?", "Yes, by SMS or WhatsApp from the same account."),
      ("Does the agent work at night?", "Yes. Calls to a bound number reach your agent 24/7.")])

# ---------------------------------------------------------------- v4 product layout: interactive product tour
FEAT = {
 "phone-numbers": [("search", "Search", "Search and buy instantly", "Find numbers by city or type from the dashboard or the API."), ("id", "KYC", "Online business KYC", "Verification before numbers go live, without paperwork loops."), ("route", "Routing", "Route anywhere", "AI agent, SIP trunk or VoxML call flow, switched any time."), ("phone", "Caller ID", "Verified caller IDs", "Outbound calls that show a number people trust."), ("bot", "Agents", "Bind to an AI agent", "Vapi, Retell, ElevenLabs, LiveKit or Bolna in a few clicks."), ("eye", "Events", "Call events per number", "Status callbacks and call records for every line.")],
 "sip-trunking": [("sip", "Trunks", "Inbound + outbound trunks", "Both directions on one trunk, from the dashboard or API."), ("key", "Credentials", "Credentials you control", "Generate and rotate SIP credentials per trunk."), ("shield", "IP ACL", "IP access lists", "Accept calls only from the ranges you trust."), ("flow", "Channels", "Channel limits", "Cap concurrent calls so one campaign can't starve another."), ("globe", "BYOC", "Bring your own carrier", "Keep existing routes and rates with TryVox on top."), ("bot", "Any stack", "Works with any SIP stack", "LiveKit, Asterisk, FreeSWITCH or your PBX.")],
 "voice-api": [("wave", "Calls", "Make and list calls", "One request per call, or a list for bulk."), ("hook", "Webhooks", "Webhooks for every stage", "Ring, answer, status and hangup, signed."), ("flow", "VoxML", "VoxML call flows", "Say, Gather, Dial, Stream and more."), ("users", "Conference", "Conferences", "Callers, agents and people on one call."), ("rec", "Record", "Recordings", "Record calls and fetch them through the API."), ("bolt", "Control", "Live call control", "Act on calls in progress, or hang up.")],
 "ai-agents": [("bot", "Providers", "Five agent platforms", "Vapi, Retell, ElevenLabs, LiveKit and Bolna."), ("bolt", "Setup", "No SIP to configure", "Bind a number in a few clicks."), ("route", "Routing", "One number, one agent", "Predictable routing you can reason about."), ("code", "Headers", "Context in SIP headers", "Direction, provider, caller and number."), ("flow", "Fallback", "Clean fallback", "Remove a binding and other routing takes over."), ("eye", "Records", "Same call records", "Agent calls get the same events and recordings.")],
 "messaging": [("chat", "WhatsApp", "WhatsApp messaging", "Send and receive messages in one place."), ("phone", "Calling", "WhatsApp calling", "Take WhatsApp calls next to your numbers."), ("doc", "Templates", "Templates", "Manage and track approved templates."), ("mail", "SMS", "DLT-ready SMS", "OTPs, alerts and reminders under DLT rules."), ("hook", "Events", "Delivery events", "Know what was delivered and read."), ("rupee", "Billing", "One account, one bill", "Voice and messaging, pay as you go.")],
 "compliance": [("id", "KYC", "Business KYC", "Online verification before numbers go live."), ("users", "Consent", "Consent records", "Consent stored per contact."), ("mail", "DLT", "DLT registration", "Entity and template workflows for SMS."), ("phone", "Caller ID", "Verified caller IDs", "Verify the numbers you call from."), ("eye", "Audit", "Audit trail", "An event record for every call and message."), ("shield", "Security", "Signed webhooks", "Callbacks signed with your secret.")],
}
VS = {
 "phone-numbers": [("Days of KYC emails", "Online KYC, live in minutes"), ("A carrier ticket to re-route", "Re-route from the dashboard"), ("An unfamiliar caller ID", "A local number in every city"), ("One vendor per number type", "Local, national and toll-free together")],
 "sip-trunking": [("Weeks of carrier onboarding", "A trunk created in one form"), ("Open trunks and toll fraud", "Credentials and IP access lists"), ("No cap on concurrency", "Channel limits per trunk"), ("Locked into one carrier", "Bring your own carrier")],
 "voice-api": [("Calls you can't see", "A webhook at every stage"), ("An IVR stuck in a vendor console", "Call flows in VoxML"), ("Glue code for recordings", "Recordings through the API"), ("Custom auth schemes", "HTTP Basic with two keys")],
 "ai-agents": [("Weeks waiting on telephony", "Agent live in a few clicks"), ("Numbers locked in one platform", "Switch providers, keep numbers"), ("SIP setup for every agent", "No SIP configuration"), ("The agent starts blind", "Caller context in SIP headers")],
 "messaging": [("Links read out on the call", "Link on WhatsApp as the call ends"), ("Two vendors, two bills", "Voice and messaging, one bill"), ("SMS blocked for DLT", "DLT-ready templates"), ("No idea if it was read", "Delivered and read events")],
 "compliance": [("Consent in spreadsheets", "Consent stored per contact"), ("Paper KYC loops", "Online business KYC"), ("Unverified caller IDs", "Verified caller IDs"), ("Unsigned callbacks", "Webhooks signed with your secret")],
}

def tilt(inner): return f'<div class="tilt"><div class="tilt-in">{inner}<i class="glare" aria-hidden="true"></i></div></div>'

def prhero(crumbs, tag, h1, sub, visual):
    return f'''<section class="ph4 wrap">
  <div class="ph4-grid">
    <div class="ph4-copy">
      {crumb(crumbs)}
      <p class="tag"><i></i>{E(tag)}</p>
      <h1 class="hd split">{h1}</h1>
      <p class="sub rv">{{sub}}</p>
      <div class="cta rv"><a class="kbtn" href="{APP}">Start free</a><a class="obtn" href="/contact/">Talk to sales</a></div>
      <div class="micro rv"><span>No lock-in</span><span>Pay per minute</span><span>Live in minutes</span></div>
    </div>
    <div class="ph4-vis rv">{tilt(visual)}</div>
  </div>
</section>'''.replace("{sub}", E(sub))

def tour(tag, h2, items):
    txt = ""
    vis = ""
    for i, (t, h3, p, ticks, v) in enumerate(items):
        tk = "".join(f"<li>{E(x)}</li>" for x in (ticks or []))
        txt += f'<div class="tr4{" on" if i == 0 else ""}" data-i="{i}"><span class="tr4-n">{i + 1:02d}</span><p class="tag"><i></i>{E(t)}</p><h3 class="hd">{h3}</h3><p class="tr4-p">{E(p)}</p><ul class="ticks">{tk}</ul><div class="tr4-m">{v}</div></div>'
        vis += f'<div class="tv4{" on" if i == 0 else ""}" data-i="{i}">{v}</div>'
    return f'''<section class="wrap sect tight tour4">
  <div class="ctr rv"><p class="tag"><i></i>{E(tag)}</p><h2 class="hd h2">{h2}</h2></div>
  <div class="t4-grid">
    <div class="t4-stage"><div class="t4-sticky"><div class="t4-frame">{vis}</div><div class="t4-prog"><b></b></div></div></div>
    <div class="t4-list">{txt}</div>
  </div>
</section>'''

def vs4(items, name):
    li = "".join(f'<li style="--d:{i * 70}ms"><span class="vs-a">{E(a)}</span><span class="vs-b">{E(b)}</span></li>' for i, (a, b) in enumerate(items))
    return f'''<section class="wrap sect tight"><div class="vs4 with rv">
  <div class="vs-copy"><p class="tag"><i></i>Before and after</p><h2 class="hd h2">Flip the switch on <em>{E(name)}.</em></h2><p class="sub">See what changes when your phone layer runs on TryVox.</p>
  <button class="vs-t" type="button" role="switch" aria-checked="true"><span class="vs-l">Without</span><span class="vs-k"><i></i></span><span class="vs-r">With TryVox</span></button></div>
  <ul class="vs-list">{li}</ul>
</div></section>'''

def featgrid(tag, h2, items):
    cells = "".join(f'<div class="cell rv" style="transition-delay:{(i % 3) * 80}ms"><span class="k">{ic(icn)}<span>{E(k)}</span></span><h3>{E(t)}</h3><p>{E(d)}</p></div>' for i, (icn, k, t, d) in enumerate(items))
    return f'<section class="wrap sect tight"><div class="ctr rv"><p class="tag"><i></i>{E(tag)}</p><h2 class="hd h2">{h2}</h2></div><div class="grid3 g4">{cells}</div></section>'

def counters(items):
    out = ""
    for lbl, v, d in items:
        import re as _re
        m = _re.match(r"^([^0-9]*)([0-9.]+)(.*)$", v)
        if m:
            b = f'<b class="cnt" data-pre="{E(m.group(1))}" data-to="{m.group(2)}" data-suf="{E(m.group(3))}">{E(v)}</b>'
        else:
            b = f"<b>{E(v)}</b>"
        out += f'<div class="ct4 rv"><p class="mlab">{E(lbl)}</p>{b}<p>{E(d)}</p></div>'
    return f'<div class="ct4s">{out}</div>'

# ---------------------------------------------------------------- v4 solution layout: a call, start to finish
def live_call(name, D):
    data = json.dumps({"msgs": D["hero"], "events": D["did"]}).replace("</", "<\\/")
    bars = "<i></i>" * 24
    return f'''<div class="lc rv" data-live>
  <div class="lc-call">
    <div class="lc-top"><span class="lc-av"><svg viewBox="0 0 32 32" aria-hidden="true">{LOGO}</svg></span><span class="lc-who"><b>{E(name)} line</b><small>+91 80 4718 2290</small></span><span class="lc-t mlcd">00:00</span></div>
    <div class="lc-wave" aria-hidden="true">{bars}</div>
    <div class="lc-feed mfeed" aria-live="polite"></div>
    <button class="lc-re" type="button">Replay call</button>
  </div>
  <div class="lc-log"><p class="duo-t">What TryVox did</p><ul class="did lc-ev"></ul><div class="lc-done">{pill("Done")}<p>{D["result"]}</p></div></div>
  <script type="application/json" class="lc-data">{data}</script>
</div>'''

def shero(crumbs, tag, h1, sub, stage):
    return f'''<section class="sh4">
  <div class="wrap sh4-in">
    {crumb(crumbs)}
    <p class="tag"><i></i>{E(tag)}</p>
    <h1 class="hd split">{h1}</h1>
    <p class="sub rv">{E(sub)}</p>
    <div class="cta rv"><a class="kbtn" href="{APP}">Start free</a><a class="obtn" href="/contact/">Talk to sales</a></div>
  </div>
  <div class="wrap sh4-stage">{stage}</div>
</section>'''

def pains(h2, cols):
    c = "".join(f'<div class="pn4 rv" style="transition-delay:{i * 90}ms"><span class="pn4-n">0{i + 1}</span><h3>{E(t)}</h3><p>{E(d)}</p></div>' for i, (t, d) in enumerate(cols))
    return f'<section class="wrap sect tight"><div class="pn4-head rv"><p class="tag"><i></i>The challenge</p><h2 class="hd h2">{h2}</h2></div><div class="pn4s">{c}</div></section>'

def hpin(h2, flow, events):
    cards = ""
    for i, (k, v) in enumerate(flow):
        ev = events[i] if i < len(events) else ""
        cards += f'<div class="hp-c" data-i="{i}"><span class="hp-n">{i + 1:02d}</span><p class="tag"><i></i>{E(k)}</p><h3>{E(v)}</h3><div class="hp-ev">{ev}</div></div>'
    return f'''<section class="hp" style="--n:{len(flow)}">
  <div class="hp-stick">
    <div class="wrap hp-head"><div><p class="tag"><i></i>Call flow</p><h2 class="hd h2">{h2}</h2></div><span class="hp-count mono"><b>01</b> / {len(flow):02d}</span></div>
    <div class="hp-rail wrap"><div class="hp-line"><i></i></div></div>
    <div class="hp-view"><div class="hp-track">{cards}</div></div>
  </div>
</section>'''

def utabs(name, uses):
    tabs = "".join(f'<button type="button" role="tab" class="ut-b{" on" if i == 0 else ""}" data-i="{i}"><span>{E(t)}</span><i class="ut-p"></i></button>' for i, (t, h, p, lines) in enumerate(uses))
    panes = ""
    for i, (t, h, p, lines) in enumerate(uses):
        panes += f'<div class="ut-v{" on" if i == 0 else ""}" data-i="{i}"><div class="ut-copy"><h3 class="hd">{h}</h3><p>{E(p)}</p></div><div class="ut-vis">{pm([name, t], feed(lines), pill("Live"))}</div></div>'
    return f'<section class="wrap sect tight ut"><div class="ctr rv"><p class="tag"><i></i>Use cases</p><h2 class="hd h2">Calls you can put on <em>autopilot.</em></h2></div><div class="ut-tabs rv" role="tablist">{tabs}</div><div class="ut-panes rv">{panes}</div></section>'

# ---------------------------------------------------------------- v5: Arrakis-style product + solution layouts
import math as _m

LAYERS = {
 "phone-numbers": ["Carrier network", "Number inventory", "Business KYC", "Routing", "Your AI agent"],
 "sip-trunking": ["Phone network", "Carrier or BYOC", "Credentials + IP ACL", "Channel limits", "Your SIP stack"],
 "voice-api": ["Phone network", "Calls API", "Webhooks", "VoxML flows", "Your code"],
 "ai-agents": ["Phone network", "TryVox numbers", "Agent bindings", "SIP context headers", "Your AI agent"],
 "messaging": ["Phone numbers", "WhatsApp Business", "DLT SMS", "Templates", "Your follow-ups"],
 "compliance": ["Business KYC", "Consent records", "DLT registration", "Verified caller IDs", "Signed webhooks"],
}
STORY = {
 "phone-numbers": ["Every agent needs a number people trust.", "TryVox gives you local, national and toll-free Indian numbers, verified online and routed in a click.", "Point them at an AI agent, a SIP trunk or your own code, and change your mind any time."],
 "sip-trunking": ["Your voice stack speaks SIP. The phone network should too.", "TryVox trunks connect LiveKit, Asterisk or your PBX to Indian numbers with credentials, IP allow-lists and channel limits.", "Bring your own carrier or use ours, and get the same call events either way."],
 "voice-api": ["Calls should be as programmable as the rest of your stack.", "One REST API places calls, a webhook reports every stage, and VoxML tells each call what to do.", "Recordings, conferences and live control are one request away."],
 "ai-agents": ["You built the agent. Now give it a phone line.", "Bind any TryVox number to Vapi, Retell, ElevenLabs, LiveKit or Bolna in a few clicks, with no SIP configuration.", "Calls arrive with full context, and you can switch providers without changing numbers."],
 "messaging": ["The best follow-up lands while the call is still fresh.", "Send WhatsApp messages, take WhatsApp calls and send DLT-ready SMS from the same account as your numbers.", "Track delivered and read events, and keep voice and messaging on one bill."],
 "compliance": ["In India, compliance is part of every call.", "TryVox builds business KYC, consent records, DLT registration and verified caller IDs into the product.", "Your team ships campaigns, and the audit trail writes itself."],
}

def iso_stack(n=5):
    s, t, gap = 150, 14, 42
    c, sn = _m.cos(_m.pi / 6), _m.sin(_m.pi / 6)
    P = lambda x, y, z: ((x - y) * c * s, (x + y) * sn * s - z)
    pts = lambda L: " ".join(f"{P(*p)[0]:.1f},{P(*p)[1]:.1f}" for p in L)
    g = ""
    for k in range(n):
        z0 = k * gap; z1 = z0 + t
        top = pts([(0, 0, z1), (1, 0, z1), (1, 1, z1), (0, 1, z1)])
        left = pts([(0, 1, z1), (1, 1, z1), (1, 1, z0), (0, 1, z0)])
        right = pts([(1, 0, z1), (1, 1, z1), (1, 1, z0), (1, 0, z0)])
        extra = ""
        if k == n - 1:
            for q in (1 / 3, 2 / 3):
                a, b = P(q, 0.04, z1), P(q, 0.96, z1); extra += f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}" class="gl"/>'
                a, b = P(0.04, q, z1), P(0.96, q, z1); extra += f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}" class="gl"/>'
            core = pts([(.38, .38, z1), (.62, .38, z1), (.62, .62, z1), (.38, .62, z1)])
            cx, cy = P(.5, .5, z1)
            extra += f'<polygon points="{core}" class="core"/><ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{s * .62:.1f}" ry="{s * .36:.1f}" class="orb"/>'
            for ang in range(0, 360, 60):
                r = _m.radians(ang); ox, oy = cx + _m.cos(r) * s * .62, cy + _m.sin(r) * s * .36
                extra += f'<circle cx="{ox:.1f}" cy="{oy:.1f}" r="3" class="od" style="--d:{ang * 8}ms"/>'
        g += f'<g class="sl" data-i="{k}"><polygon points="{left}" class="fl"/><polygon points="{right}" class="fr"/><polygon points="{top}" class="ft"/>{extra}</g>'
    w = 2 * c * s + 20; h = s + (n - 1) * gap + t + 30
    return f'<svg class="stk-svg" viewBox="{-w / 2:.0f} {-(n - 1) * gap - t - 14:.0f} {w:.0f} {h:.0f}" aria-hidden="true">{g}</svg>'

def bracket(inner, cls=""):
    return f'<div class="brk{(" " + cls) if cls else ""}"><i class="b1"></i><i class="b2"></i><i class="b3"></i><i class="b4"></i>{inner}</div>'

def ahero(name, h1, sub, layers):
    n = len(layers)
    left = "".join(f'<li data-i="{n - 1 - j}"><svg viewBox="0 0 64 30" aria-hidden="true"><polygon points="32,2 62,15 32,28 2,15"/></svg><span>{n - j:02d}</span></li>' for j in range(n))
    right = "".join(f'<li data-i="{n - 1 - j}">{E(layers[n - 1 - j])}</li>' for j in range(n))
    return f'''<section class="ah">
  <div class="ah-sky" aria-hidden="true"><i></i><i></i></div>
  <div class="wrap ah-in">
    {crumb([("Products", None), (name, None)])}
    <p class="ah-k mono">{E(name)}</p>
    <h1 class="hd split">{h1}</h1>
    <p class="sub rv">{E(sub)}</p>
    <div class="cta rv"><a class="kbtn" href="{APP}">Start free</a><a class="obtn ghost" href="/contact/">Talk to sales</a></div>
  </div>
  <div class="ah-stage">
    <ul class="ah-l">{left}</ul>
    {bracket(iso_stack(n), "stk")}
    <ul class="ah-r">{right}</ul>
  </div>
  <div class="wrap ah-rule" aria-hidden="true"></div>
</section>'''

def revp(lines):
    p = "".join("<p>" + " ".join(f"<span>{E(w)}</span>" for w in ln.split()) + "</p>" for ln in lines)
    ticks = "<i></i>" * 8
    return f'<section class="rvs"><div class="rvs-t l" aria-hidden="true">{ticks}</div><div class="wrap rvs-in"><div class="revp">{p}</div></div><div class="rvs-t r" aria-hidden="true">{ticks}</div></section>'

def isob(vis):
    return f'''<div class="isob"><svg class="isob-w" viewBox="0 0 520 420" preserveAspectRatio="none" aria-hidden="true"><path d="M260 70 L470 190 L260 310 L50 190 Z"/><path d="M50 190 L50 250 L260 370 L470 250 L470 190"/><path d="M260 310 L260 370"/><path d="M260 0 V70 M260 370 V420 M50 250 V420 M470 250 V420" class="dash"/></svg><div class="isob-c">{vis}</div><i class="isob-g" aria-hidden="true"></i></div>'''

def panels(items):
    nav = "".join(f'<a href="#pp-{i}" data-i="{i}"{ON if i == 0 else ""}>{E(t)}</a>' for i, (t, h, p, ticks, v) in enumerate(items))
    out = ""
    for i, (t, h, p, ticks, v) in enumerate(items):
        tk = "".join(f"<li>{E(x)}</li>" for x in (ticks or []))
        out += f'''<article class="ppn" id="pp-{i}" data-i="{i}"><div class="ppn-b t"></div><div class="ppn-g">{isob(v)}<div class="ppn-c"><h2 class="hd">{h}</h2><div><p>{E(p)}</p><ul class="ticks">{tk}</ul></div></div></div><div class="ppn-b b"></div></article>'''
    return f'<section class="pp"><div class="pp-in"><nav class="pp-nav mono" aria-label="On this page">{nav}</nav><div class="pp-list">{out}</div></div></section>'

def trust(h2):
    cells = [("01", "Business KYC"), ("02", "DLT-ready SMS"), ("03", "Consent records")]
    c = "".join(f'<div><span>{a}</span><b class="mono">{E(b)}</b></div>' for a, b in cells)
    shield = '<svg viewBox="0 0 120 140" aria-hidden="true"><defs><linearGradient id="shg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E9DDFF"/><stop offset=".45" stop-color="#9D61FF"/><stop offset="1" stop-color="#3B1C86"/></linearGradient><linearGradient id="shh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><path d="M60 6 L110 24 V66 C110 100 88 124 60 134 C32 124 10 100 10 66 V24 Z" fill="url(#shg)"/><path d="M60 6 L60 134 C32 124 10 100 10 66 V24 Z" fill="url(#shh)" opacity=".35"/><path d="M40 70 l14 14 28-30" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    return f'<section class="tr5"><div class="wrap"><h2 class="hd h2 rv">{h2}</h2><div class="tr5-s rv">{shield}</div><div class="tr5-cells rv">{c}<a href="/products/compliance/"><span class="arr">[→]</span>Learn about compliance</a></div></div></section>'

# ---------------------------------------------------------------- solutions (chemicals-style)
def sel(name):
    opts = "".join(f'<a href="/solutions/{s}/"{ON if n == name else ""}><i></i>{E(n)}</a>' for s, n, _, _ in SOLUTIONS)
    return f'<div class="isel rv"><span class="isel-k mono">Industry</span><button type="button" class="isel-b mono" aria-expanded="false"><i></i>{E(name)}{CHEV}</button><div class="isel-m">{opts}</div></div>'

def sx_hero(name, D):
    parts = D["h1"].split("<em>")
    h1 = f'<span class="mut">{parts[0]}</span><em>{parts[1]}' if len(parts) > 1 else D["h1"]
    rd = "".join(f'<span>{E(k.upper())}:</span><b>{E(v)}</b>' for k, v in D["flow"])
    ticks = "<i></i>" * 10
    vis = f'''<div class="sx-alert"><span class="dot"></span><b>{E(name)} voice agent</b><span class="rev mono">Review</span><p><span class="live mono">Live</span>{D["result"]}</p></div>
<div class="sx-frame">{bracket('<div class="sx-read mono">' + rd + '</div><div class="sxo" aria-hidden="true"><i></i><i></i><i></i><span class="ball"><svg viewBox="0 0 32 32">' + LOGO + '</svg></span></div>')}</div>'''
    return f'''<section class="sx">
  <div class="wrap sx-box"><div class="sx-grid">
    <div class="sx-l">{crumb([("Solutions", None), (name, None)])}<h1 class="hd split">{h1}</h1><p class="sub rv">{E(D["sub"])}</p><div class="cta rv"><a class="kbtn" href="{APP}">Start free</a><a class="obtn" href="/contact/">Talk to sales</a></div>{sel(name)}</div>
    <div class="sx-rule" aria-hidden="true">{ticks}</div>
    <div class="sx-r rv">{vis}</div>
  </div></div>
</section>'''

def carousel(h2, cards):
    cs = "".join(f'<div class="cr-c"><span class="cr-i">{bracket(i)}</span><p>{t}</p></div>' for i, t in cards)
    bars = "".join(f'<button type="button" aria-label="Card {k + 1}"{ON if k == 0 else ""}></button>' for k in range(len(cards)))
    return f'<section class="cr"><div class="wrap"><h2 class="hd cr-h rv">{h2}</h2></div><div class="cr-view"><div class="cr-track">{cs}</div></div><div class="wrap cr-nav"><span class="cr-bars">{bars}</span><span class="mono cr-n"><b>01</b> / {len(cards):02d}</span></div></section>'

def climb(flow, did_):
    acc = ""
    for i, (k, v) in enumerate(flow):
        ev = did_[i] if i < len(did_) else ""
        acc += f'<div class="cl-i{" on" if i == 0 else ""}" data-i="{i}"><button type="button"><span class="mono">{i + 1:02d}</span>{E(k)}</button><div class="cl-d"><p><b>{E(v)}.</b> {ev}</p><i class="cl-p"></i></div></div>'
    counts = [1, 3, 5, 8]
    cols = ""
    for i, (k, v) in enumerate(flow):
        blocks = "".join(f'<i style="--j:{j}"></i>' for j in range(counts[i % 4]))
        cols += f'<div class="cl-col" data-i="{i}"><span class="cl-t">{E(k)}</span><div class="cl-st">{blocks}</div></div>'
    return f'''<section class="cl" data-step="0"><div class="wrap cl-g">
  <div><h2 class="hd h2">From first call <em>to full scale.</em></h2><div class="cl-acc">{acc}</div></div>
  <div class="cl-chart"><span class="cl-y mono">Value</span><div class="cl-cols">{cols}</div></div>
</div></section>'''

def logos5():
    def lg(k):
        if k in LOGOIMG:
            n, w = LOGOIMG[k]
            return f'<span class="lg-c"><img src="/assets/logos/{k}.svg" alt="{n}" width="{w}" height="22"></span>'
        return f'<span class="lg-c"><em>{E(k)}</em></span>'
    groups = [("Agent platforms", ["vapi", "retell", "livekit", "bolna", "ElevenLabs"]), ("Voice stack", ["Deepgram", "Amazon Polly", "ElevenLabs", "LiveKit SIP", "Any PBX"]), ("Channels", ["WhatsApp", "DLT SMS", "Toll-free", "SIP trunks", "VoxML"])]
    tabs = "".join(f'<button type="button" data-g="{i}"{ON if i == 0 else ""}><i></i>{E(n)}</button>' for i, (n, _) in enumerate(groups))
    sets = "".join(f'<div class="lg-set{" on" if i == 0 else ""}" data-g="{i}"><div class="lg-run">' + "".join(lg(k) for k in ks * 2) + "</div></div>" for i, (n, ks) in enumerate(groups))
    return f'<section class="wrap sect tight lg5"><div class="lg5-g"><div class="lg-frame rv">{bracket(sets)}</div><div class="rv"><h2 class="hd h2">TryVox works with <em>the stack you already run.</em></h2><div class="lg-tabs mono">{tabs}</div></div></div></section>'

# ---------------------------------------------------------------- pricing
# ---------------------------------------------------------------- developers
DOC_MAP = [
 ("bolt", "Getting started", [("Quickstart", "/getting-started/quickstart"), ("Authentication", "/getting-started/authentication"), ("Errors", "/getting-started/errors"), ("Webhooks", "/getting-started/webhooks")]),
 ("wave", "Voice API", [("Make a call", "/voice/make-call"), ("List calls", "/voice/list-calls"), ("Hang up", "/voice/hangup"), ("Conferences", "/voice/conferences")]),
 ("flow", "VoxML", [("Say", "/voxml/say"), ("Gather", "/voxml/gather"), ("Dial", "/voxml/dial"), ("Stream", "/voxml/stream")]),
 ("phone", "Numbers", [("Search", "/numbers/search"), ("Purchase", "/numbers/purchase"), ("Configure", "/numbers/configure"), ("Verified caller IDs", "/caller-ids")]),
 ("sip", "SIP trunking", [("Create a trunk", "/sip-trunking/create-trunk"), ("Credentials", "/sip-trunking/credentials"), ("IP ACL", "/sip-trunking/ip-acl"), ("BYOC", "/byoc")]),
 ("bot", "AI agents", [("Connect a provider", "/ai-agents/connect-provider"), ("Connect a number", "/ai-agents/connect-number"), ("Vapi", "/ai-agents/vapi"), ("Retell", "/ai-agents/retell")]),
]
def page_developers():
    groups = "".join(f'<div class="dgrp rv"><h3>{ic(i)}{E(t)}</h3><ul>' + "".join(f'<li><a href="{DOCS}{h}">{E(n)}<span>↗</span></a></li>' for n, h in links) + "</ul></div>" for i, t, links in DOC_MAP)
    code_ = {"curl": ("cURL", CALL_CURL), "node": ("Node", CALL_NODE), "py": ("Python", CALL_PY), "auth": ("Auth", AUTH_CURL)}
    body = hero3([("Developers", None)], "Developers", "Build on <em>TryVox.</em>", "A REST API at api.tryvox.io with HTTP Basic auth, VoxML for call flows and webhooks for every call event. Your first call takes minutes.", f'<div style="min-width:0">{code_panel(code_, NOTE_CALL)}</div>',
                  primary=("Read the quickstart", f"{DOCS}/getting-started/quickstart"), secondary=("Get API keys", APP), micro=("REST + JSON", "Signed webhooks", "VoxML"))
    body += steps3("Quickstart", "Your first call in <em>four steps.</em>", [("Get your keys", "Copy your Auth ID and Auth Token from the dashboard.", DOCS + "/getting-started/authentication"), ("Buy a number", "Search and buy a number to call from.", DOCS + "/numbers/purchase"), ("Place a call", "POST from, to and answer_url to the calls endpoint.", DOCS + "/voice/make-call"), ("Handle webhooks", "Receive ring, answer, status and hangup callbacks.", DOCS + "/getting-started/webhooks")])
    body += rowsec([("Webhooks", "Every stage, <em>in your system.</em>", "Ring, answer, status and hangup callbacks, signed with your webhook secret.", ["ring_url, answer_url, hangup_url", "status_callback_url", "Signed with webhook_secret"], pm(["Webhooks", "Log"], feed([("ev", "POST ring_url · 200"), ("ev ok", "POST answer_url · VoxML"), ("ev", "POST status_callback_url · 200"), ("ev", "POST hangup_url · 200")]), pill("Signed"))),
                    ("Response", "Predictable <em>JSON responses.</em>", "Every call returns a request_uuid and a status you can track through your webhooks.", ["201 Created with status queued", "request_uuid for every call", "Clear error codes"], pm(["POST", "/calls"], mono(CALL_RESP), pill("201")))])
    body += f'<section class="wrap sect tight"><div class="ctr rv"><p class="tag"><i></i>Documentation</p><h2 class="hd h2">Everything in <em>the docs.</em></h2></div><div class="dmap">{groups}</div></section>'
    body += faq([("How does authentication work?", "HTTP Basic auth. Your Auth ID is the username and your Auth Token is the password."),
                 ("Where do callbacks go?", "To the URLs you set on each call, such as answer_url, ring_url, hangup_url and status_callback_url."),
                 ("Are webhooks signed?", "Yes. Set a webhook secret and TryVox signs callback requests with it."),
                 ("Where is the full reference?", "At docs.tryvox.io.")])
    return "Voice API Docs and Quickstart for Developers | TryVox", "Build on TryVox: REST API with HTTP Basic auth, VoxML call flows and webhooks for every call event. Place your first call in minutes.", body

# ---------------------------------------------------------------- integrations
def page_integrations():
    idx = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
    i = idx.index('<section class="integ" id="integrations"'); j = idx.index("</section>", i) + 10
    wall = idx[i:j].replace('<h2 class="hd h2" style="margin-top:20px">', '<h1 class="hd h2" style="margin-top:20px">', 1).replace("</em></h2>", "</em></h1>", 1)
    wall = wall.replace('<a class="obtn" href="/integrations/">See all integrations</a>', f'<a class="obtn" href="{DOCS}/ai-agents">Browse integration docs ↗</a>')
    wall = wall.replace('<div class="integ-copy rv">', '<div class="integ-copy rv">' + crumb([("Integrations", None)]), 1)
    provs = [("Vapi", "vapi"), ("Retell", "retell"), ("ElevenLabs", "elevenlabs"), ("LiveKit", "livekit"), ("Bolna", "bolna")]
    def lg(s, n):
        if s in LOGOIMG:
            return f'<img src="/assets/logos/{s}.svg" alt="" width="{LOGOIMG[s][1]}" height="20">'
        return f"<em>{n}</em>"
    t = "".join(f'<a class="tile rv" href="{DOCS}/ai-agents/{s}"><span class="tl-i">{lg(s, n)}</span><b>{n}</b><small>Bind a TryVox number to your {n} agent.</small><span class="go">↗</span></a>' for n, s in provs)
    t += f'<a class="tile rv" href="{DOCS}/byoc"><span class="tl-i">{ICON["sip"]}</span><b>Any SIP stack</b><small>Connect your PBX, or bring your own carrier.</small><span class="go">↗</span></a>'
    body = wall
    body += f'<section class="wrap sect tight"><div class="ctr rv"><p class="tag"><i></i>Agent platforms</p><h2 class="hd h2">Setup guides for <em>every provider.</em></h2></div><div class="tiles">{t}</div></section>'
    body += rowsec([("Bind", "Pick, connect, <em>answer.</em>", "Choose a provider, pick a number and an agent, and confirm. Inbound calls to that number go straight to the agent.", ["One number binds to one agent", "No deployment or SIP configuration", "Remove the binding to fall back"], pm(["AI agents", "Connect number"], provgrid() + rows([("Number", '<span class="mono">+91 80 4718 2290</span>'), ("Status", pill("Connected"))]))),
                    ("Context", "Calls arrive <em>with context.</em>", "Your agent receives direction, route, provider, caller and number in SIP headers.", ["X-TryVox-Direction and Route", "X-TryVox-From and To", "Outbound from agents: in progress"], pm(["SIP headers", "Inbound"], mono(SIP_HEADERS)))])
    body += faq([("Which agent platforms work with TryVox?", "Vapi, Retell, ElevenLabs, LiveKit and Bolna, plus any standards-based SIP stack."),
                 ("Do I need to configure SIP for agent platforms?", "No. Binding a number to an agent needs no deployment or SIP configuration."),
                 ("Can agents call out through TryVox?", "Outbound calls from agents are still in progress. Inbound calls work today.")])
    return "Integrations: Vapi, Retell, ElevenLabs, LiveKit, Bolna | TryVox", "Connect TryVox Indian phone numbers to Vapi, Retell, ElevenLabs, LiveKit and Bolna voice agents, or any SIP stack.", body

# ---------------------------------------------------------------- about / contact
def page_contact():
    cards = [("mail", "Email the team", "Questions about TryVox, partnerships or anything else.", "mailto:team@tryvox.io", "team@tryvox.io"),
             ("rupee", "Get a rate card", "Tell us your monthly calls and average call length, and we'll share rates for your volume.", "mailto:team@tryvox.io?subject=Rate%20card%20request", "Request rates"),
             ("users", "Book a demo", "See numbers, agents and call events working together.", "mailto:team@tryvox.io?subject=Demo%20request", "Request a demo"),
             ("bolt", "Start free", "Create an account and get a number in minutes.", APP, "Open the dashboard"),
             ("doc", "Read the docs", "API reference, VoxML, numbers, SIP and agent guides.", f"{DOCS}/", "docs.tryvox.io"),
             ("code", "Developer hub", "Quickstart steps and code samples.", "/developers/", "Go to developers")]
    c = "".join(f'<a class="ccard rv" href="{h}">{ic(i)}<h3>{E(t)}</h3><p>{E(d)}</p><span class="go">{E(l)} →</span></a>' for i, t, d, h, l in cards)
    vis = pm(["Email", "New message"], rows([("To", "team@tryvox.io"), ("Subject", "Rate card request")]) + '<p class="cp-text">Hi TryVox team, we run about 50,000 calls a month at 2.5 minutes on average with a Vapi agent. Could you share a rate card?</p>')
    body = hero3([("Contact", None)], "Contact", "Talk to <em>the team.</em>", "Tell us what you're building and how many calls you run. We'll help you get your agent on the phone and share rates for your volume.", vis,
                 primary=("Email team@tryvox.io", "mailto:team@tryvox.io"), secondary=("Start free", APP), micro=("Built in India", "Replies by email", "No sales pressure"))
    body += f'<section class="wrap sect tight"><div class="ctr rv"><p class="tag"><i></i>Ways to reach us</p><h2 class="hd h2">Pick what <em>you need.</em></h2></div><div class="ccards">{c}</div></section>'
    return "Contact TryVox Sales and Support | TryVox", "Talk to the TryVox team about Indian phone numbers, SIP trunking, AI agents and rate cards. Email team@tryvox.io.", body

# ---------------------------------------------------------------- v6
def sh(tag, h2, sub=None, center=False, dark=False):
    s = f'<p class="sub">{sub}</p>' if sub else ""
    return f'<div class="shd{" c" if center else ""}{" dk" if dark else ""} rv"><p class="tag"><i></i>{E(tag)}</p><h2 class="hd h2">{h2}</h2>{s}</div>'

def iso_stack6(n=5):
    s, t, gap, E_ = 150, 14, 16, 64
    c, sn = _m.cos(_m.pi / 6), _m.sin(_m.pi / 6)
    P = lambda x, y, z: ((x - y) * c * s, (x + y) * sn * s - z)
    pts = lambda L: " ".join(f"{P(*p)[0]:.1f},{P(*p)[1]:.1f}" for p in L)
    g = ""
    for k in range(n):
        z0 = k * gap; z1 = z0 + t
        top = pts([(0, 0, z1), (1, 0, z1), (1, 1, z1), (0, 1, z1)])
        left = pts([(0, 1, z1), (1, 1, z1), (1, 1, z0), (0, 1, z0)])
        right = pts([(1, 0, z1), (1, 1, z1), (1, 1, z0), (1, 0, z0)])
        extra = ""
        if k == n - 1:
            for q in (1 / 3, 2 / 3):
                a, b = P(q, 0.04, z1), P(q, 0.96, z1); extra += f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}" class="gl"/>'
                a, b = P(0.04, q, z1), P(0.96, q, z1); extra += f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}" class="gl"/>'
            core = pts([(.38, .38, z1), (.62, .38, z1), (.62, .62, z1), (.38, .62, z1)])
            cx, cy = P(.5, .5, z1)
            extra += f'<polygon points="{core}" class="core"/><ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{s * .62:.1f}" ry="{s * .36:.1f}" class="orb"/>'
            for ang in range(0, 360, 60):
                r = _m.radians(ang); ox, oy = cx + _m.cos(r) * s * .62, cy + _m.sin(r) * s * .36
                extra += f'<circle cx="{ox:.1f}" cy="{oy:.1f}" r="3" class="od" style="--d:{ang * 8}ms"/>'
        else:
            mx, my = P(.5, .5, z1)
            extra += f'<polygon points="{pts([(.44, .44, z1), (.56, .44, z1), (.56, .56, z1), (.44, .56, z1)])}" class="pip"/>'
        g += f'<g class="sl" data-i="{k}"><polygon points="{left}" class="fl"/><polygon points="{right}" class="fr"/><polygon points="{top}" class="ft"/>{extra}</g>'
    w = 2 * c * s + 20; top_ = (n - 1) * (gap + E_) + t + 20; h = s + top_ + 16
    return f'<svg class="stk-svg" viewBox="{-w / 2:.0f} {-top_:.0f} {w:.0f} {h:.0f}" data-e="{E_}" aria-hidden="true">{g}</svg>'

LAYER_D = {
 "phone-numbers": ["Tier-1 routes to every Indian network", "Local, national and toll-free inventory", "Business verification, done online", "Agent, SIP trunk or VoxML, switch any time", "Your Vapi, Retell or LiveKit agent answers"],
 "sip-trunking": ["The public phone network", "Use TryVox routes or bring your carrier", "Lock trunks to credentials and IP ranges", "Cap concurrency per trunk", "LiveKit, Asterisk, FreeSWITCH or your PBX"],
 "voice-api": ["The public phone network", "Place and list calls with one request", "Ring, answer, status and hangup callbacks", "Say, Gather, Dial and Stream", "Your app decides what happens next"],
 "ai-agents": ["The public phone network", "Indian numbers ready to bind", "One number, one agent, a few clicks", "Direction, caller and route on every call", "Your agent answers on the first ring"],
 "messaging": ["The numbers your customers know", "Messages and WhatsApp calling", "DLT-ready SMS for India", "Approved templates, ready to send", "Follow up the moment a call ends"],
 "compliance": ["Business KYC before numbers go live", "Consent stored per contact", "DLT entity and templates for SMS", "Verify the numbers you call from", "Trust every callback you receive"],
}

def ahero6(name, h1, sub, layers, descs):
    n = len(layers)
    left = "".join(f'<li data-i="{n - 1 - j}"><svg viewBox="0 0 64 30" aria-hidden="true"><polygon points="32,2 62,15 32,28 2,15"/></svg><span>{n - j:02d}</span></li>' for j in range(n))
    right = "".join(f'<li data-i="{n - 1 - j}"><b>{E(layers[n - 1 - j])}</b><small>{E(descs[n - 1 - j])}</small></li>' for j in range(n))
    return f'''<section class="ah ah6">
  <div class="ah-sky" aria-hidden="true"><i></i><i></i></div>
  <div class="wrap ah-in">
    <p class="tag"><i></i>{E(name)}</p>
    <h1 class="hd split">{h1}</h1>
    <p class="sub rv">{E(sub)}</p>
    <div class="cta rv"><a class="kbtn" href="{APP}">Start free</a><a class="obtn ghost" href="/contact/">Talk to sales</a></div>
  </div>
</section>
<section class="ahp" style="--n:{n}">
  <div class="ahp-st">
    <div class="ahp-cap mono"><span>Scroll to open the stack</span><span class="ahp-c"><b>05</b> / {n:02d}</span></div>
    <div class="ah-stage">
      <ul class="ah-l">{left}</ul>
      {bracket(iso_stack6(n), "stk")}
      <ul class="ah-r">{right}</ul>
    </div>
    <div class="ahp-bar"><i></i></div>
  </div>
</section>'''

def panels6(items):
    nav = "".join(f'<a href="#pp-{i}" data-i="{i}"{ON if i == 0 else ""}>{E(t)}</a>' for i, (t, h, p, ticks, v) in enumerate(items))
    out = ""
    for i, (t, h, p, ticks, v) in enumerate(items):
        tk = "".join(f"<li>{E(x)}</li>" for x in (ticks or []))
        out += f'''<article class="ppn" id="pp-{i}" data-i="{i}"><div class="ppn-b t"></div><div class="ppn-g">{isob(v)}<div class="ppn-c"><div><p class="tag"><i></i>{E(t)}</p><h2 class="hd">{h}</h2></div><div><p>{E(p)}</p><ul class="ticks">{tk}</ul></div></div></div><div class="ppn-b b"></div></article>'''
    return f'<section class="pp"><div class="pp-in"><nav class="pp-nav mono" aria-label="On this page">{nav}</nav><div class="pp-list">{out}</div></div></section>'

def comp6():
    items = [("id", "Business KYC", "Verified online before any number goes live.", ["Business details submitted", "Documents uploaded", "Review complete"]),
             ("mail", "DLT-ready SMS", "Entity and templates linked, so messages are delivered, not blocked.", ["DLT entity linked", "Template otp_login approved", "Header registered"]),
             ("users", "Consent records", "Consent stored per contact and respected when withdrawn.", ["+91 98•• ••5678 · consented", "+91 99•• ••0412 · consented", "+91 97•• ••2231 · withdrawn"]),
             ("phone", "Verified caller IDs", "Outbound calls show a number people can trust.", ["+91 80 4718 2290 · verified", "+91 22 6120 4471 · verified", "Spoofed IDs blocked"])]
    lst = "".join(f'<button type="button" class="cp-i{" on" if i == 0 else ""}" data-i="{i}"><span class="cp-ck"></span><span class="cp-ic">{ICON[ic_]}</span><span><b>{E(t)}</b><small>{E(d)}</small></span></button>' for i, (ic_, t, d, _) in enumerate(items))
    det = "".join(f'<div class="cp-d{" on" if i == 0 else ""}" data-i="{i}">{pm(["Compliance", t], did([E(x) for x in xs]), pill("Verified"))}</div>' for i, (_, t, _, xs) in enumerate(items))
    shield = '<svg viewBox="0 0 120 140" aria-hidden="true"><defs><linearGradient id="shg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E9DDFF"/><stop offset=".45" stop-color="#9D61FF"/><stop offset="1" stop-color="#3B1C86"/></linearGradient></defs><path d="M60 6 L110 24 V66 C110 100 88 124 60 134 C32 124 10 100 10 66 V24 Z" fill="url(#shg)"/><path d="M60 6 L60 134 C32 124 10 100 10 66 V24 Z" fill="#fff" opacity=".12"/><path class="ck" d="M40 70 l14 14 28-30" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    return f'''<section class="cp6"><div class="wrap">
  {sh("Compliance", "Compliance and control, <em>built in.</em>", "India's telecom rules are part of the product. Scroll to run the checks, or pick one to see how it works.", center=True)}
  <div class="cp-g">
    <div class="cp-l">{lst}<a class="obtn" href="/products/compliance/">Explore compliance</a></div>
    <div class="cp-r"><div class="cp-sh"><div class="cp-ring" style="--p:0"></div>{shield}<span class="cp-n mono"><b>0</b>/4 checks</span></div>{det}</div>
  </div>
</div></section>'''

def page_product(slug):
    D = P[slug]
    name = next(n for s, n, _, _ in PRODUCTS if s == slug)
    body = crumb([("Products", None), (name, None)])
    body += ahero6(name, D["h1"], D["sub"], LAYERS[slug], LAYER_D[slug])
    body += revp(STORY[slug])
    body += panels6(D["rows"] + [("Results", D["rh2"], D["res"][0][2] + " " + D["res"][2][2], [r[0] + ": " + r[1] for r in D["res"]], pm([name, "Overview"], rows([(E(r[0]), f'<b>{E(r[1])}</b>') for r in D["res"]]), pill("Live")))])
    body += comp6()
    if D.get("code"):
        body += devsec(D["code"], D["note"])
    body += faq(D["faq"])
    return D["title"], D["desc"], body

# ---------------------------------------------------------------- solutions v6
def sh6_hero(name, D):
    rd = "".join(f'<div class="lv-e" style="--i:{i}"><span class="mono">{E(k.upper())}</span><b>{E(v)}</b></div>' for i, (k, v) in enumerate(D["flow"]))
    talk = "".join(msg(c, t) for c, t in [l for l in D["hero"] if l[0] != "ev"][:3])
    bars = "<i></i>" * 40
    chips = "".join(f'<span class="fl-c c{i}"><i></i>{E(k)}</span>' for i, (k, v) in enumerate(D["flow"]))
    return f'''<section class="sh6">
  <div class="ah-sky" aria-hidden="true"><i></i><i></i></div>
  <div class="wrap sh6-in">
    <p class="tag"><i></i>{E(name)}</p>
    <h1 class="hd split">{D["h1"]}</h1>
    <p class="sub rv">{E(D["sub"])}</p>
    <div class="cta rv"><a class="kbtn" href="{APP}">Start free</a><a class="obtn ghost" href="/contact/">Talk to sales</a></div>
    {sel(name)}
  </div>
  <div class="wrap sh6-stage rv">
    {bracket(f"""<div class="lv">
      <div class="lv-top"><span class="dot"></span><b>{E(name)} voice agent</b><span class="live mono">Live</span><span class="lv-t mlcd">00:00</span></div>
      <div class="lv-g"><div><div class="lv-wave">{bars}</div><div class="mfeed lv-feed">{talk}</div></div><div class="lv-ev">{rd}</div></div>
      <div class="lv-ft"><span class="mono">Outcome</span><p>{D["result"]}</p></div>
    </div>{chips}""", "lvb")}
  </div>
</section>'''

def hcards(h2, cards):
    cs = "".join(f'<div class="hc"><span class="mono hc-n">{i + 1:02d}</span><span class="cr-i">{bracket(ic_)}</span><p>{t}</p></div>' for i, (ic_, t) in enumerate(cards))
    return f'''<section class="hx" style="--n:{len(cards)}"><div class="hx-st">
  <div class="wrap hx-h">{sh("The challenge", h2, "What changes when every call runs on TryVox. Keep scrolling.", dark=True)}<span class="mono hx-c"><b>01</b> / {len(cards):02d}</span></div>
  <div class="hx-v"><div class="hx-t">{cs}</div></div>
  <div class="wrap"><div class="hx-bar"><i></i></div></div>
</div></section>'''

def climb6(flow, did_):
    acc = ""
    for i, (k, v) in enumerate(flow):
        ev = did_[i] if i < len(did_) else ""
        acc += f'<div class="c6-i{" on" if i == 0 else ""}" data-i="{i}"><span class="c6-n mono">{i + 1:02d}</span><div><b>{E(k)}</b><p><span>{E(v)}.</span> {ev}</p></div></div>'
    counts = [1, 3, 5, 8]
    cols = ""
    for i, (k, v) in enumerate(flow):
        blocks = "".join(f'<i style="--j:{j}"></i>' for j in range(counts[i % 4]))
        cols += f'<div class="cl-col" data-i="{i}"><span class="cl-t">{E(k)}</span><div class="cl-st">{blocks}</div></div>'
    return f'''<section class="c6" style="--n:{len(flow)}"><div class="c6-st"><div class="wrap cl-g">
  <div>{sh("Call flow", "From first call <em>to full scale.</em>", "Scroll through one call, from the trigger to the follow-up.", dark=True)}<div class="c6-acc"><div class="c6-rail"><i></i></div>{acc}</div></div>
  <div class="cl-chart"><span class="cl-y mono">Value</span><div class="cl-cols">{cols}</div><div class="c6-pct mono"><b>0</b>% of the flow complete</div></div>
</div></div></section>'''

def logos6():
    return logos5().replace('<div class="rv"><h2 class="hd h2">TryVox works with <em>the stack you already run.</em></h2>', '<div>' + sh("Integrations", "TryVox works with <em>the stack you already run.</em>", "Bind a number to your agent platform in a click, or connect any SIP stack."))

def page_solution(slug):
    D = S[slug]
    name = next(n for s, n, _, _ in SOLUTIONS if s == slug)
    body = crumb([("Solutions", None), (name, None)])
    body += sh6_hero(name, D)
    cards = [(ICON["phone"], E(D["uses"][0][2])), (ICON["route"], E(D["uses"][1][2])), (ICON["mail"], E(D["uses"][2][2])), (ICON["eye"], "Every call logged with events, records and optional recordings"), (ICON["shield"], "Compliance built in: business KYC, consent records and DLT-ready SMS")]
    body += hcards(D["ph2"], cards)
    body += climb6(D["flow"], D["did"])
    body += logos6()
    body += faq(D["faq"])
    return D["title"], D["sub"], body

# ---------------------------------------------------------------- pricing (Griffin rhythm)
def page_pricing():
    logos = [("vapi", None), ("retell", None), (None, "TRUSTED STACK"), ("livekit", None), ("bolna", None), (None, "ElevenLabs"), (None, "Deepgram"), (None, "WhatsApp"), (None, "Amazon Polly"), (None, "SIP / BYOC"), (None, "VoxML")]
    cells = ""
    for k, t in logos:
        if t == "TRUSTED STACK":
            cells += '<div class="lgc wide mono">WORKS WITH <b>YOUR VOICE STACK</b></div>'
        elif k:
            n, w = LOGOIMG[k]; cells += f'<div class="lgc"><img src="/assets/logos/{k}.svg" alt="{n}" width="{w}" height="20"></div>'
        else:
            cells += f'<div class="lgc"><em>{E(t)}</em></div>'
    tiles = [("Up to 10k", "minutes a month", "Pay as you go. Start free, no minimums."), ("10k – 1L", "minutes a month", "Volume rates. Ask for a rate card."), ("1L+", "minutes a month", "Committed volume. Best rates for scale."), ("Enterprise", "Custom", "Custom terms, partner and multi-account setups.")]
    tl = "".join(f'<button type="button" class="gt{" on" if i == 0 else ""}" data-i="{i}" data-msg="{E(m)}"><b>{E(a)}</b><small>{E(b)}</small></button>' for i, (a, b, m) in enumerate(tiles))
    prods = "".join(f'<a class="gp" href="/products/{s}/">{ICON[i]}{E(n)}</a>' for s, n, i, d in PRODUCTS)
    est = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
    i = est.index('<section class="wrap sect est" id="estimate"'); j = est.index("</section>", i) + 10
    body = crumb([("Pricing", None)])
    body += f'''<section class="gx">
  <div class="wrap gx-in">
    <p class="gpill mono">Pricing</p>
    <h1 class="hd split">Pricing for every stage. <em>Pay per minute, scale with volume.</em></h1>
    <p class="sub rv">See how TryVox pricing works below. Get in touch for a rate card that fits your volume.</p>
    <div class="cta rv"><a class="obtn gbtn" href="/contact/">Let&rsquo;s chat <span>→</span></a></div>
  </div>
  <div class="lgrid rv">{cells}</div>
  <div class="wrap gsec">
    {sh("Start", "Pay as you go", "Everything you need to put your first agent on the phone.", center=True, dark=True)}
    <div class="gcard rv"><div class="gch"><h3>Start free</h3><a class="obtn gbtn" href="{APP}">Start free <span>→</span></a></div>
      <div class="grow"><span>Setup fee</span><b>None</b></div><div class="grow"><span>Monthly minimum</span><b>None</b></div><div class="grow"><span>Billing</span><b>Per minute, one account</b></div><div class="grow"><span>Lock-in</span><b>None</b></div></div>
    <p class="gnote">Voice and messaging on one bill. Numbers require business KYC.</p>
  </div>
  <div class="wrap gsec">
    {sh("Scale", "Rates that grow with you", "Three steps from your first call to committed volume.", center=True, dark=True)}
    <div class="gcard rv"><div class="gch"><h3><span class="gn mono">01</span>Go live on pay as you go</h3><span class="gside">No setup fee</span></div><p class="gp1"><b>Live in minutes.</b> Buy a number, bind your agent and take your first call.</p></div>
    <div class="gcard rv"><div class="gch"><h3><span class="gn mono">02</span>Choose your monthly volume</h3></div><p class="gp1"><b>Select your monthly minutes.</b> Unlock volume rates as you grow.</p><div class="gts">{tl}</div><p class="gmsg" aria-live="polite">{E(tiles[0][2])}</p></div>
    <div class="gcard rv"><div class="gch"><h3><span class="gn mono">03</span>Use it across the stack</h3></div><p class="gp1"><b>One balance covers every product.</b> Numbers, SIP, calls, agents, messaging and compliance.</p><div class="gps">{prods}</div></div>
    <div class="gcard rv gcalc"><div class="gch"><h3>Estimate your monthly minutes</h3><a class="obtn gbtn" href="#estimate">Calculate <span>↓</span></a></div></div>
    <p class="gnote">Rate cards are shared by email for your volume. <a href="/contact/">Talk to sales</a>.</p>
  </div>
</section>'''
    body += est[i:j]
    body += faq([("Is there a free way to start?", "Yes. Start free from the dashboard and pay as you go."),
                 ("Are there minimums or contracts?", "No. Pay as you go has no lock-in and no minimums."),
                 ("How do I get volume rates?", "Use the estimator, then ask for a rate card from the contact page."),
                 ("Is messaging billed separately?", "Voice and messaging run on one account and one bill.")])
    return "Pricing: Pay-Per-Minute Telephony for AI Voice Agents | TryVox", "Pay-as-you-go telephony for AI voice agents in India. No lock-in, no monthly minimums. Volume rate cards on request.", body

# ---------------------------------------------------------------- about (Arrakis about rhythm)
ART = [
 '<svg viewBox="0 0 200 120" aria-hidden="true"><path class="a-wave" d="M10 60 C 35 -10, 60 130, 85 60 S 135 -10, 160 60 S 190 100, 190 60"/><line x1="10" y1="60" x2="190" y2="60" class="a-dot"/><circle cx="10" cy="60" r="3"/><circle cx="190" cy="60" r="3"/></svg>',
 '<svg viewBox="0 0 200 120" aria-hidden="true"><rect x="40" y="5" width="120" height="110" class="a-sq"/><rect x="65" y="28" width="70" height="64" class="a-sq s2"/><rect x="88" y="49" width="24" height="22" class="a-sq s3"/><path d="M40 5 L88 49 M160 5 L112 49 M40 115 L88 71 M160 115 L112 71" class="a-dot"/><circle cx="100" cy="60" r="3"/></svg>',
 '<svg viewBox="0 0 200 120" aria-hidden="true"><ellipse cx="100" cy="70" rx="85" ry="40" class="a-el"/><ellipse cx="100" cy="72" rx="62" ry="29" class="a-el e2"/><ellipse cx="100" cy="74" rx="40" ry="19" class="a-el e3"/><line x1="100" y1="0" x2="100" y2="120" class="a-dot"/><circle cx="100" cy="76" r="3"/></svg>',
 '<svg viewBox="0 0 200 120" aria-hidden="true"><circle cx="100" cy="42" r="34" class="a-c"/><circle cx="78" cy="80" r="34" class="a-c c2"/><circle cx="122" cy="80" r="34" class="a-c c3"/><path d="M100 8 L66 104 L134 104 Z" class="a-dot"/><circle cx="100" cy="68" r="3"/></svg>',
]
def page_about():
    probs = [("Telephony wasn't built for agents", "Carriers, trunks and IVRs were designed for human call centres, so every voice AI team rebuilds the same plumbing."),
             ("Compliance slows every launch", "KYC, consent and DLT rules turn a two-day agent launch into a month of paperwork."),
             ("Numbers get locked in", "Numbers bought inside an agent platform make it painful to switch providers or run more than one."),
             ("Calls happen in a black box", "Without events and records, teams can't see why calls drop, ring out or never connect.")]
    pl = "".join(f'<div class="ab-p{" on" if i == 0 else ""}" data-i="{i}"><h3 class="hd">{E(t)}</h3></div>' for i, (t, d) in enumerate(probs))
    pd = "".join(f'<p class="ab-d{" on" if i == 0 else ""}" data-i="{i}">{E(d)}</p>' for i, (t, d) in enumerate(probs))
    pillars = [("route", "Infrastructure only", "We never build agents, so platforms and builders can run on us without feeding a competitor."), ("shield", "India-first compliance", "KYC, consent, DLT and verified caller IDs are product requirements, not afterthoughts."), ("code", "Developer control", "Numbers, calls, routing and webhooks as primitives your engineers can build on."), ("eye", "Observable by default", "Events, records and recordings for every call and message.")]
    pc = "".join(f'<div class="ab-c rv"><span class="cr-i">{bracket(ICON[i])}</span><h3>{E(t)}</h3><p>{E(d)}</p></div>' for i, t, d in pillars)
    road = [("Sign up and verify", "Create an account and complete business KYC online."), ("Get a number", "Pick local, national or toll-free numbers in the cities you call."), ("Connect your agent", "Bind Vapi, Retell, ElevenLabs, LiveKit or Bolna, or any SIP stack."), ("Scale with volume", "Add numbers, trunks and channels, and move to volume rates.")]
    rl = "".join(f'<div class="ab-r rv"><span class="mono">{i + 1:02d}</span><div><h3>{E(t)}</h3><p>{E(d)}</p></div></div>' for i, (t, d) in enumerate(road))
    flow = [("search", "Verify", "Business KYC online"), ("phone", "Number", "Local, national, toll-free"), ("bot", "Agent", "Bind in a few clicks"), ("wave", "Calls", "Events for every call"), ("rupee", "Scale", "Volume rates as you grow")]
    fl = "".join(f'<div class="ab-fb" style="--i:{i}"><span class="ab-fi">{ICON[ic_]}</span><span><b>{E(t)}</b><small>{E(d)}</small></span></div>' for i, (ic_, t, d) in enumerate(flow))
    beliefs = [("We stay infrastructure", "We build the phone layer and nothing else, so we are never your competitor."), ("We move fast", "Self-serve numbers, online KYC and docs that match the product mean you ship in days."), ("We go deep on telecom", "Routing, compliance and call quality in India are our day job, not a side project."), ("We own reliability", "Every call produces events and records, so problems are visible and fixable.")]
    bl = "".join(f'<div class="ab-b rv"><div class="ab-art">{bracket(ART[i])}</div><div><h3>{E(t)}</h3><p>{E(d)}</p></div></div>' for i, (t, d) in enumerate(beliefs))
    body = crumb([("About", None)])
    body += f'''<div class="abx">
<section class="wrap ab-h"><p class="bk mono">[ Why TryVox ]</p><h1 class="hd split">Voice AI moved fast. <em>The phone network didn&rsquo;t.</em></h1><p class="sub rv">Teams can build a great voice agent in a week, then spend months on carriers, KYC and SIP. TryVox exists to close that gap for every agent, in India and beyond.</p></section>
<section class="abp" style="--n:{len(probs)}"><div class="abp-st"><div class="wrap">{bracket(f'<div class="abp-g"><div class="abp-l">{pl}</div><div class="abp-t" aria-hidden="true">{"<i></i>" * 8}</div><div class="abp-r">{pd}</div></div>', "abf")}</div></div></section>
<section class="wrap sect tight">{sh("What we build", "Designed for production, <em>not prototypes.</em>", "Four principles behind every TryVox product.", center=True, dark=True)}<div class="ab-cs">{pc}</div></section>
<section class="wrap sect tight"><div class="ab-rg"><div>{sh("Roadmap", "From first number <em>to full scale.</em>", "How teams go live on TryVox.", dark=True)}<div class="ab-rl">{rl}</div></div><div class="ab-fc rv"><div class="ab-fw">{fl}</div></div></div></section>
<section class="wrap sect tight">{sh("Who we are", "Built in India by <em>Tryjolt Solutions.</em>", "A telephony team for voice AI, focused on reliable calls and compliance that just works.", center=True, dark=True)}<div class="ab-bg"><p class="ab-st hd">We believe every AI agent deserves a real phone line, and every team should be able to give it one in minutes.</p><div>{bl}</div></div></section>
<section class="ab-cta"><div class="ab-orb" aria-hidden="true"><i></i><i></i><b></b></div><div class="wrap"><p class="bk mono">[ Get started ]</p><h2 class="hd h2">Give every agent <em>a real phone line.</em></h2><div class="cta"><a class="kbtn" href="{APP}">Start free</a><a class="obtn ghost" href="/contact/">Contact us</a></div></div></section>
</div>'''
    return "About TryVox: Telephony Infrastructure for Voice AI | TryVox", "TryVox builds telephony infrastructure for voice AI: numbers, SIP, voice APIs and messaging. Built in India by Tryjolt Solutions.", body

# ---------------------------------------------------------------- write
def write(path, title, desc, body):
    m = re.search(r'<nav class="crumb".*?</nav>', body, flags=re.S)
    cb = ""
    if m:
        body = body[:m.start()] + body[m.end():]
        cb = '<div class="crumbbar"><div class="wrap">' + m.group(0) + '</div></div>\n'
    dark = ' class="mdk"' if path in ("/pricing/", "/about/") else ""
    out = head(title, desc, path) + "<!-- @header -->\n" + header() + "\n<!-- /@header -->\n<main id=\"top\"" + dark + ">\n" + cb + body + "\n</main>\n<!-- @footer -->\n" + footer() + "\n<!-- /@footer -->\n</body>\n</html>\n"
    fp = os.path.join(ROOT, path.strip("/"), "index.html")
    os.makedirs(os.path.dirname(fp), exist_ok=True)
    open(fp, "w", encoding="utf-8").write(out)
    return fp

def sync_home():
    fp = os.path.join(ROOT, "index.html")
    s = open(fp, encoding="utf-8").read()
    s = re.sub(r"<!-- @header -->.*?<!-- /@header -->", lambda m: "<!-- @header -->\n" + header() + "\n<!-- /@header -->", s, flags=re.S)
    s = re.sub(r"<!-- @footer -->.*?<!-- /@footer -->", lambda m: "<!-- @footer -->\n" + footer() + "\n<!-- /@footer -->", s, flags=re.S)
    open(fp, "w", encoding="utf-8").write(s)

if __name__ == "__main__":
    sync_home()
    pages = []
    for slug, *_ in PRODUCTS:
        pages.append(write(f"/products/{slug}/", *page_product(slug)))
    for slug, *_ in SOLUTIONS:
        pages.append(write(f"/solutions/{slug}/", *page_solution(slug)))
    pages.append(write("/pricing/", *page_pricing()))
    pages.append(write("/developers/", *page_developers()))
    pages.append(write("/integrations/", *page_integrations()))
    pages.append(write("/about/", *page_about()))
    pages.append(write("/contact/", *page_contact()))
    print(f"built {len(pages)} pages + synced index.html")
