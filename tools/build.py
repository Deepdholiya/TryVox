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
def mega(title, items, base):
    links = "".join(
        f'<a href="/{base}/{slug}/"><span class="mi">{ICON[icon]}</span><span><span class="mt">{E(name)}</span><span class="md">{E(desc)}</span></span></a>'
        for slug, name, icon, desc in items)
    return links

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
        <div class="mega"><p>Telephony for voice AI</p>{mega("Products", PRODUCTS, "products")}</div></li>
      <li class="has-mega"><button class="nl" aria-expanded="false">Solutions {CHEV}</button>
        <div class="mega"><p>By industry</p>{mega("Solutions", SOLUTIONS, "solutions")}</div></li>
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

def page_product(slug):
    D = P[slug]
    name = next(n for s, n, _, _ in PRODUCTS if s == slug)
    body = hero3([("Products", None), (name, None)], D["tag"], D["h1"], D["sub"], D["hero"])
    body += partners()
    body += problem(D["ptag"], D["ph2"], D["pcols"], D["pwide"])
    body += rowsec(D["rows"])
    body += steps3("How it works", "Live in <em>three steps.</em>", D["steps"])
    body += results("Built for production", D["rh2"], D["res"])
    if D.get("code"):
        body += devsec(D["code"], D["note"])
    body += faq(D["faq"])
    body += related_products(slug)
    return D["title"], D["desc"], body

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

def page_solution(slug):
    D = S[slug]
    name = next(n for s, n, _, _ in SOLUTIONS if s == slug)
    hero = pm([name, "Live call"], feed(D["hero"]), pill("Live"))
    wide = pm([name, "Call"], duo("Conversation", feed(D["convo"]), "What TryVox did", did(D["did"], D["result"])), pill("Completed"))
    body = hero3([("Solutions", None), (name, None)], name, D["h1"], D["sub"], hero)
    body += partners()
    body += problem("The challenge", D["ph2"], D["pcols"], wide)
    body += rowsec([(t, h, p, None, pm([name, t], feed(lines))) for t, h, p, lines in D["uses"]])
    body += steps3("Call flow", "One call, <em>start to finish.</em>", [(f"{k}", v) for k, v in D["flow"]])
    body += results("Built for production", "Infrastructure your customers <em>never notice.</em>", STD_RESULTS)
    body += faq(D["faq"])
    prods = [next(p for p in PRODUCTS if p[0] == ps) for ps in D["prods"]]
    body += related("What you'll <em>use.</em>", [(i, n, d, f"/products/{s}/") for s, n, i, d in prods])
    return D["title"], D["sub"], body

# ---------------------------------------------------------------- pricing
def page_pricing():
    plans = [("Pay as you go", "Free to start", "For teams putting their first agent on the phone.", ["All products on one account", "No lock-in, no minimums", "Docs and email support"], ("Start free", APP, "obtn"), False),
             ("Scale", "Volume rates", "For teams running thousands of calls a day.", ["Rates for your volume", "Help planning concurrency", "Priority support"], ("Get a rate card", "/contact/", "kbtn"), True),
             ("Enterprise", "Custom", "For platforms and large operations.", ["Custom terms", "Partner and multi-account setups", "Dedicated contact"], ("Talk to sales", "/contact/", "obtn"), False)]
    cards = ""
    for name, price, d, ticks, (cta, href, cls), hl in plans:
        t = "".join(f"<li>{E(x)}</li>" for x in ticks)
        badge = '<span class="badge-top">Most teams</span>' if hl else ""
        cards += f'<div class="plan rv{" hl" if hl else ""}">{badge}<h3>{E(name)}</h3><div class="pr">{E(price)}</div><p>{E(d)}</p><ul class="ticks">{t}</ul><a class="{cls}" href="{href}">{E(cta)}</a></div>'
    est = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
    i = est.index('<section class="wrap sect est" id="estimate"'); j = est.index("</section>", i) + 10
    vis = pm(["Billing", "This month"], rows([("Calls", "50,000"), ("Average call", "2.5 min"), ("Minutes", '<span class="mlcd" style="font-size:22px">1,25,000</span>'), ("Monthly minimum", "None")]), pill("Example", "w"))
    body = hero3([("Pricing", None)], "Pricing", "Pay for minutes, <em>not seats.</em>", "Pay-as-you-go telephony for AI voice agents with no lock-in and no monthly minimums. When your volume grows, get a rate card that fits it.", vis, secondary=("Get a rate card", "/contact/"))
    body += f'<section class="wrap sect tight"><div class="ctr rv"><p class="tag"><i></i>Plans</p><h2 class="hd h2">Simple plans that <em>grow with you.</em></h2></div><div class="plans">{cards}</div></section>'
    body += problem("Included in every plan", "The full stack, <em>on every plan.</em>", [("Numbers and SIP", "Local, national and toll-free numbers, plus SIP trunks and BYOC."), ("Voice API and agents", "Calls, webhooks, VoxML and bindings for Vapi, Retell, ElevenLabs, LiveKit and Bolna."), ("Messaging and compliance", "WhatsApp, DLT SMS, KYC, consent and verified caller IDs.")], "")
    body += est[i:j]
    body += faq([("Is there a free way to start?", "Yes. Start free from the dashboard and pay as you go."),
                 ("Are there minimums or contracts?", "No. Pay as you go has no lock-in and no minimums."),
                 ("How do I get volume rates?", "Use the estimator above, then ask for a rate card from the contact page."),
                 ("Is messaging billed separately?", "Voice and messaging run on one account and one bill.")])
    return "Pricing: Pay-Per-Minute Telephony for AI Voice Agents | TryVox", "Pay-as-you-go telephony for AI voice agents in India. No lock-in, no monthly minimums. Volume rate cards on request.", body

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
def page_about():
    vis = pm(["Company", "TryVox"], rows([("Company", "Tryjolt Solutions Pvt Ltd"), ("Product", "TryVox"), ("Built in", "India"), ("Focus", "Telephony for voice AI"), ("Contact", "team@tryvox.io")]))
    body = hero3([("About", None)], "About TryVox", "We build the <em>phone layer</em> for voice AI.", "TryVox gives AI voice teams numbers, SIP trunking, a Voice API, messaging and compliance in one account, so any agent can take a real call in India and beyond.", vis, secondary=("Contact us", "/contact/"))
    body += problem("What we believe", "Communications should be <em>easy to trust.</em>", [("Infrastructure only", "We don't build agents. Platforms and builders run on TryVox without feeding a competitor."), ("India-first", "KYC, consent, DLT and caller ID verification are product requirements, not afterthoughts."), ("Developer control", "Voice, messaging, routing and webhooks as primitives your engineers can build on.")],
                     pm(["TryVox", "How it fits"], duo("Your side", did(["Your AI agent: Vapi, Retell, ElevenLabs, LiveKit, Bolna", "Your systems: CRM, order, booking"]), "TryVox", did(["Numbers, SIP and Voice API", "WhatsApp and DLT SMS", "KYC, consent and caller IDs"]))))
    body += results("Our promise", "Infrastructure that <em>stays up.</em>", STD_RESULTS)
    body += related("Start <em>building.</em>", [("bolt", "Products", "Numbers, SIP, Voice API, agents and messaging.", "/products/phone-numbers/"), ("code", "Developers", "Quickstart, code samples and docs.", "/developers/"), ("mail", "Contact", "Talk to the team at team@tryvox.io.", "/contact/")])
    return "About TryVox: Telephony Infrastructure for Voice AI | TryVox", "TryVox builds telephony infrastructure for voice AI: numbers, SIP, voice APIs and messaging. Built in India by Tryjolt Solutions.", body

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

# ---------------------------------------------------------------- write
def write(path, title, desc, body):
    out = head(title, desc, path) + "<!-- @header -->\n" + header() + "\n<!-- /@header -->\n<main id=\"top\">\n" + body + "\n</main>\n<!-- @footer -->\n" + footer() + "\n<!-- /@footer -->\n</body>\n</html>\n"
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
