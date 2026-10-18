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
    return f'''<section class="wrap sect tight"><div class="faq"><div class="rv"><p class="tag"><i></i>FAQ</p><h2 class="hd h2" style="margin-top:20px">Questions teams <em>ask first.</em></h2></div><div class="rv">{d}</div></div></section>'''

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

# ---------------------------------------------------------------- product pages
def page_product(slug):
    P = {}
    if slug == "phone-numbers":
        vis = mock("Numbers · search", f'''<div class="msearch">{ICON["search"]}<span>Search <b>Bengaluru · local</b></span></div>
<div class="rv-st"><div class="mrow"><span class="mlcd">+91 80 4718 2290</span><span class="mbtn">Buy</span></div>
<div class="mrow"><span>+91 80 4718 3301</span><span class="pill w">Local</span></div>
<div class="mrow"><span>+91 80 4718 5528</span><span class="pill w">Local</span></div>
<div class="mrow"><span>1800 xxx xxxx</span><span class="pill p">Toll-free</span></div>
<div class="mrow"><span>Business KYC</span><span class="pill">Verified</span></div></div>''')
        P = dict(title="Phone Numbers for AI Voice Agents | TryVox", desc="Search, buy and configure local, national and toll-free numbers with business KYC, and bind them to your AI agent.",
            tag="Phone numbers", h1="Numbers your callers <em>actually pick up.</em>",
            sub="Search, buy and configure local, national and toll-free numbers with business KYC handled online. Point any number at your agent, your SIP trunk or your own code.",
            vis=vis,
            feat=[("search","Search","Search and buy in minutes","Find numbers by city or type and buy them from the dashboard or the API."),
                  ("id","KYC","Business KYC, online","Verification happens before numbers go live, without paperwork back-and-forth."),
                  ("route","Routing","Route anywhere","Send a number to an AI agent, a SIP trunk or a VoxML call flow, and change it any time."),
                  ("phone","Caller ID","Verified caller IDs","Verify the numbers you call from so your outbound calls show a number people trust."),
                  ("bot","Agents","Bind to an agent","Connect a number to a Vapi, Retell, ElevenLabs, LiveKit or Bolna agent in a few clicks."),
                  ("eye","Records","Every call recorded as events","Status callbacks and call records for each number, ready for your dashboards.")],
            steps=[("Search","Pick a city or number type and choose from available numbers.",f"{DOCS}/numbers/search"),
                   ("Purchase","Buy the number once your business KYC is verified.",f"{DOCS}/numbers/purchase"),
                   ("Configure","Route it to an agent, a SIP trunk or a call flow.",f"{DOCS}/numbers/configure")],
            code={"curl":("List numbers",AUTH_CURL)}, note=f'Based on <a href="{DOCS}/getting-started/authentication">Authentication</a> in the TryVox docs.',
            frows=[("Local presence in <em>every city</em> you call.","Callers are more likely to answer a local number. Give each region or campaign its own caller ID and keep it consistent.",["Local, national and toll-free numbers","Assign numbers per campaign or team","Release numbers you no longer need"], mock("Caller IDs", '<div class="mchk"><div>+91 80 4718 2290<span>Bengaluru</span></div><div>+91 22 6120 4471<span>Mumbai</span></div><div>+91 11 4910 0732<span>Delhi</span></div></div>', None))],
            faq=[("What kinds of numbers can I get?","Local, national and toll-free numbers. Search by city or type in the dashboard or through the Numbers API."),
                 ("Do I need KYC?","Yes. Business KYC is completed online before numbers go live, as India's telecom rules require."),
                 ("Can I move a number between agents?","Yes. Re-point a number to a different agent, SIP trunk or call flow at any time. A number can be bound to one agent at a time."),
                 ("Can I release a number?","Yes. Release numbers you no longer need from the dashboard or the API.")])
    elif slug == "sip-trunking":
        vis = mock("SIP trunk · production", '''<div class="rv-st"><div class="mrow"><span>Domain</span><span>trunk.tryvox.io</span></div>
<div class="mrow"><span>Credentials</span><span class="pill">Active</span></div>
<div class="mrow"><span>IP ACL</span><span>2 ranges allowed</span></div>
<div class="mrow"><span>Channels</span><span>30 concurrent</span></div>
<div class="mrow"><span>Carrier</span><span class="pill p">TryVox · or BYOC</span></div></div>''')
        P = dict(title="SIP Trunking for AI Voice Agents | TryVox", desc="Create SIP trunks, manage credentials and IP ACLs, set channel limits or bring your own carrier.",
            tag="SIP trunking", h1="SIP trunking, <em>set up for you.</em>",
            sub="Create trunks for inbound and outbound calls, manage credentials and IP access lists, and set channel limits. Or bring your own carrier and keep your existing routes.",
            vis=vis,
            feat=[("sip","Trunks","Create a trunk","Inbound and outbound on one trunk, created from the dashboard or the API."),
                  ("key","Credentials","Credentials you control","Generate and rotate SIP credentials per trunk."),
                  ("shield","IP ACL","IP access lists","Allow calls only from the IP ranges you trust."),
                  ("flow","Channels","Channel limits","Set how many concurrent calls a trunk may carry."),
                  ("globe","BYOC","Bring your own carrier","Keep an existing carrier and still use TryVox routing and events."),
                  ("bot","Agents","Works with any SIP stack","Connect LiveKit, your PBX or any standards-based SIP client.")],
            steps=[("Create the trunk","Name it and choose inbound, outbound or both.",f"{DOCS}/sip-trunking/create-trunk"),
                   ("Add credentials or IP ACL","Lock the trunk to your credentials and IP ranges.",f"{DOCS}/sip-trunking/credentials"),
                   ("Set channels","Choose the concurrency your agents need.",f"{DOCS}/sip-trunking/channels")],
            code=None,
            frows=[("Already have a carrier? <em>Bring it.</em>","Bring Your Own Carrier lets you keep the routes and rates you already have, while TryVox handles numbers, routing and call events on top.",["Keep existing carrier contracts","One dashboard for every trunk","Same events and recordings as TryVox routes"], mock("BYOC", '<div class="mflow"><div><b>01</b>Your carrier<span class="pill w">SIP</span></div><div><b>02</b>TryVox routing<span class="pill p">Events</span></div><div><b>03</b>Your agent<span class="pill">Live</span></div></div>', None))],
            faq=[("What is a SIP trunk?","A SIP trunk carries phone calls over the internet between the phone network and your systems, such as a voice agent or PBX."),
                 ("Can I restrict who uses my trunk?","Yes. Use SIP credentials, IP access lists, or both."),
                 ("How many calls can a trunk carry?","You set a channel limit per trunk. Talk to us if you need more capacity."),
                 ("Can I use my own carrier?","Yes. Bring Your Own Carrier (BYOC) keeps your carrier while using TryVox on top.")])
    elif slug == "voice-api":
        vis = mock("call_8f2a19 · events", f'''<div class="rv-st">{msg("ev","POST /v1/voice/accounts/{auth_id}/calls")}{msg("ev ok","201 · status: queued")}{msg("ev","ring_url · ringing")}{msg("ev ok","answer_url · VoxML returned")}{msg("a","Hi, this is Riya from Acme Finance.")}{msg("ev","hangup_url · final call record")}</div>''')
        P = dict(title="Programmable Voice API and VoxML | TryVox", desc="Place calls, run conferences, record and build call flows with VoxML. REST API at api.tryvox.io.",
            tag="Voice API", h1="Every call, <em>under your control.</em>",
            sub="Place calls, receive webhooks at every stage, run conferences, record and hang up from your code. Build call flows with VoxML verbs like Say, Gather, Dial and Stream.",
            vis=vis,
            feat=[("wave","Calls","Make and list calls","Create outbound calls in one request, one by one or in bulk, and look them up later."),
                  ("hook","Webhooks","Callbacks for every stage","Ring, answer, status and hangup URLs, signed with your webhook secret."),
                  ("flow","VoxML","Call flows in VoxML","Say, Play, Gather, IVR, Dial, Record, Stream, Conference and more."),
                  ("users","Conferences","Conferences","Bring callers, agents and humans into the same call."),
                  ("rec","Recordings","Recordings","Record calls and fetch recordings through the API."),
                  ("bolt","Control","Live call actions","Act on calls that are in progress, or hang them up.")],
            steps=[("Authenticate","Use your Auth ID and Auth Token from the dashboard.",f"{DOCS}/getting-started/authentication"),
                   ("Place a call","POST to the calls endpoint with from, to and answer_url.",f"{DOCS}/voice/make-call"),
                   ("Return VoxML","Answer with VoxML to say, gather, dial or stream.",f"{DOCS}/voxml")],
            code={"curl":("cURL",CALL_CURL),"node":("Node",CALL_NODE),"py":("Python",CALL_PY),"resp":("Response",CALL_RESP)}, note=NOTE_CALL,
            frows=[("Build the flow with <em>VoxML.</em>","When a call is answered, TryVox asks your answer_url what to do. Reply with VoxML verbs and TryVox runs them on the call.",["Say, Play and Gather for menus and input","Dial and Conference to bring people in","Stream to send live audio to your agent"], mock("VoxML verbs", '<div class="mflow"><div><b>1</b>Say a greeting<span class="pill w">Say</span></div><div><b>2</b>Collect a keypress<span class="pill w">Gather</span></div><div><b>3</b>Stream audio to the agent<span class="pill p">Stream</span></div><div><b>4</b>Transfer to a person<span class="pill w">Dial</span></div></div>', None))],
            faq=[("How do I authenticate?","HTTP Basic auth: your Auth ID is the username and your Auth Token is the password. Both come from the dashboard."),
                 ("What does answer_url need to return?","VoxML. TryVox POSTs to answer_url when the call is answered and runs the VoxML you return."),
                 ("Can I place calls in bulk?","Yes. The same endpoint accepts a list of calls."),
                 ("Is answering machine detection available?","Not yet. The parameter is accepted but has no effect today, so don't rely on it.")])
    elif slug == "ai-agents":
        vis = mock("AI agents · connect number", '''<div class="mprov"><span class="on"><img src="/assets/logos/vapi.svg" alt="Vapi" width="55" height="18"></span><span><img src="/assets/logos/retell.svg" alt="Retell AI" width="65" height="18"></span><span><em>ElevenLabs</em></span><span><img src="/assets/logos/livekit.svg" alt="LiveKit" width="18" height="18"></span><span><img src="/assets/logos/bolna.svg" alt="Bolna" width="28" height="18"></span><span><em>+ more</em></span></div>
<div class="rv-st"><div class="mrow"><span>Number</span><span class="mlcd" style="font-size:20px">+91 80 4718 2290</span></div><div class="mrow"><span>Agent</span><span>Collections · Riya</span></div><div class="mrow"><span>Status</span><span class="pill">Connected</span></div></div>''')
        P = dict(title="Connect AI Voice Agents to Phone Numbers | TryVox", desc="Bind a TryVox number to a Vapi, Retell, ElevenLabs, LiveKit or Bolna agent. No deployment or SIP configuration needed.",
            tag="AI agents", h1="Your agent, <em>on a real number.</em>",
            sub="Pick your provider, choose a TryVox number and an agent, and confirm. The agent answers calls on that number straight away, with no deployment or SIP configuration.",
            vis=vis,
            feat=[("bot","Providers","Bring any agent","Vapi, Retell, ElevenLabs, LiveKit and Bolna, with more on the way."),
                  ("bolt","Setup","No SIP to configure","Binding a number is a few clicks in the dashboard."),
                  ("route","Routing","One number, one agent","Each number binds to one agent, so routing stays predictable."),
                  ("code","Headers","Context in SIP headers","Your agent receives direction, provider, caller and number on every call."),
                  ("flow","Fallback","Clean fallback","Remove a binding and calls fall back to your other routing settings."),
                  ("eye","Observe","Same call records","Agent calls get the same events and recordings as every other call.")],
            steps=[("Choose a provider","Open AI Agents and pick your integration.",f"{DOCS}/ai-agents/connect-provider"),
                   ("Pick number and agent","Choose an active TryVox number and an agent from your provider.",f"{DOCS}/ai-agents/connect-number"),
                   ("Confirm","The agent is reachable on that number right away.",None)],
            code={"sip":("Agent SIP headers",SIP_HEADERS)}, note=f'From <a href="{DOCS}/ai-agents/connect-number">Connect a number</a> in the TryVox docs.',
            frows=[("We don't build agents. <em>We connect them.</em>","TryVox is only the phone layer, so agent platforms and builders can run on us without feeding a competitor.",["Keep the agent platform you chose","Switch providers without changing numbers","No lock-in"], mock("Bindings", '<div class="mchk"><div>+91 80 4718 2290 → Vapi<span>inbound</span></div><div>+91 22 6120 4471 → Retell<span>inbound</span></div><div>1800 xxx xxxx → Bolna<span>inbound</span></div></div>', None))],
            faq=[("Which providers are supported?","Vapi, Retell, ElevenLabs, LiveKit and Bolna."),
                 ("Do agents make outbound calls through TryVox?","Inbound calls to a bound number go straight to the agent. Outbound calls from the agent are still in progress, so don't rely on them for production yet."),
                 ("Can one number go to two agents?","No. A number binds to one agent at a time."),
                 ("Should I also set the number as inbound in my provider?","No. Doing both can make calls conflict. Let TryVox route the number to the agent.")])
    elif slug == "messaging":
        vis = mock("WhatsApp · after the call", f'''<div class="rv-st">{msg("ev ok","call.completed · 02:41")}{msg("a","Thanks for your time today. Here is your payment link for the EMI due on Friday.")}{msg("c","Paid. Thank you!")}{msg("ev","template: payment_reminder · delivered")}</div>''')
        P = dict(title="WhatsApp and SMS for Voice AI Teams | TryVox", desc="Send WhatsApp and DLT-ready SMS from the same account as your phone numbers, including WhatsApp calling and templates.",
            tag="Messaging", h1="Follow up on <em>the channel they read.</em>",
            sub="Send WhatsApp messages and DLT-ready SMS from the same account as your numbers. Confirm, remind and share links right after the call.",
            vis=vis,
            feat=[("chat","WhatsApp","WhatsApp messaging","Send and receive messages, and keep conversations in one place."),
                  ("phone","Calling","WhatsApp calling","Take calls on WhatsApp alongside your phone numbers."),
                  ("doc","Templates","Templates","Manage the message templates your campaigns use."),
                  ("mail","SMS","DLT-ready SMS","OTPs, reminders and alerts that follow India's DLT rules."),
                  ("hook","Events","Delivery events","Know when messages are sent, delivered and read."),
                  ("rupee","Billing","One account, one bill","Voice and messaging together, pay as you go.")],
            steps=[("Add a channel","Connect WhatsApp or SMS to your account.",f"{DOCS}/messaging/channels"),
                   ("Set up templates","Prepare the templates you'll send.",f"{DOCS}/messaging/templates"),
                   ("Send","Send from the API or after each call.",f"{DOCS}/messaging/send")],
            code=None, frows=[],
            faq=[("Can I send WhatsApp messages after an AI call?","Yes. Messaging runs on the same account, so you can follow up when a call ends."),
                 ("Is SMS DLT-ready?","Yes. DLT registration is part of compliance in TryVox."),
                 ("Is WhatsApp calling supported?","Yes. See WhatsApp calling in the docs.")])
    else:  # compliance
        vis = mock("Compliance checks", '''<div class="mchk"><div>Business KYC<span>verified</span></div><div>Consent recorded<span>per contact</span></div><div>DLT entity linked<span>SMS</span></div><div>Caller ID verified<span>outbound</span></div></div>''', "Ready")
        P = dict(title="Telecom Compliance for AI Calling in India | TryVox", desc="Business KYC, consent records, DLT registration and verified caller IDs, built into TryVox.",
            tag="Compliance", h1="India's telecom rules, <em>handled.</em>",
            sub="Business KYC, consent records, DLT registration and verified caller IDs are part of the product, not a project you run on the side.",
            vis=vis,
            feat=[("id","KYC","Business KYC","Verification before numbers go live."),
                  ("users","Consent","Consent records","Record consent for the people you call."),
                  ("mail","DLT","DLT registration","Entity and template workflows for SMS in India."),
                  ("phone","Caller ID","Verified caller IDs","Verify the numbers you call from."),
                  ("eye","Audit","Call records","An event trail for every call and message."),
                  ("shield","Security","Signed webhooks","Callbacks signed with your webhook secret.")],
            steps=[("Complete KYC","Verify your business once, online.",None),
                   ("Record consent","Store consent for the contacts you call.",f"{DOCS}/compliance/consent"),
                   ("Register for DLT","Link your DLT entity for SMS.",f"{DOCS}/compliance/dlt")],
            code=None, frows=[],
            faq=[("Why does TryVox need KYC?","India's telecom rules require business verification before numbers are issued."),
                 ("What is DLT?","Distributed Ledger Technology registration, required in India for commercial SMS."),
                 ("How do verified caller IDs work?","You verify ownership of a number, then use it as the caller ID on outbound calls.")])
    name = next(n for s, n, _, _ in PRODUCTS if s == slug)
    body = phero([("Products", None), (name, None)], P["tag"], P["h1"], P["sub"], P["vis"])
    body += partners()
    body += f'<section class="wrap sect tight">{shead("What you get", "Everything in <em>" + E(name) + "</em>", None)}{features(P["feat"])}</section>'
    if P["frows"]:
        body += '<section class="wrap sect tight">' + "".join(frow(*f[:4], flip=bool(i % 2)) for i, f in enumerate(P["frows"])) + "</section>"
    body += f'<section class="wrap sect tight">{shead("How it works", "Live in <em>three steps.</em>")}{steps(P["steps"])}</section>'
    if P.get("code"):
        body += f'<section class="wrap sect tight"><div class="devgrid"><div class="rv"><p class="tag"><i></i>Developers</p><h2 class="hd h2" style="margin-top:20px">Straight from <em>the docs.</em></h2><p class="sub">A REST API at api.tryvox.io with Auth ID and Auth Token. Every example here matches the documentation.</p><div class="cta"><a class="obtn" href="/developers/">Developer hub</a></div></div><div class="rv" style="min-width:0">{code_panel(P["code"], P["note"])}</div></div></section>'
    body += stats()
    body += faq(P["faq"])
    body += related_products(slug)
    return P["title"], P["desc"], body

# ---------------------------------------------------------------- solution pages
SOL = {
 "financial-services": dict(h1="Collections and reminders <em>that connect.</em>", sub="Run EMI reminders, KYC follow-ups and loan servicing calls with your AI agent on local numbers, then follow up on WhatsApp.",
   script=[("ev","Outbound · +91 80 4718 2290"),("a","Hi, this is Riya calling from Acme Finance. Is this a good time?"),("c","Yes, go ahead."),("a","Your EMI of ₹4,250 is due on Friday. Shall I send a payment link on WhatsApp?"),("ev ok","Promise to pay · Friday · link sent")],
   uses=[("rupee","EMI reminders","Remind borrowers before due dates and log promises to pay."),("id","KYC follow-ups","Call customers to complete or update KYC."),("users","Loan servicing","Answer balance and schedule questions, with a human one transfer away.")],
   flow=[("Trigger","EMI due in 3 days"),("Call","Agent calls from a local number"),("Outcome","Promise to pay: Friday"),("Follow-up","WhatsApp payment link sent")],
   prods=["phone-numbers","ai-agents","messaging"],
   faq=[("Can calls come from a local number?","Yes. Buy local numbers per region and use verified caller IDs."),("Can a person take over?","Yes. Bring a human into the call with Dial or a conference."),("How do I keep records?","Every call produces events, a call record and optional recordings.")]),
 "healthcare": dict(h1="Appointments booked <em>without hold music.</em>", sub="Let your agent answer patient calls on clinic numbers, confirm slots and send reminders, while staff handle the cases that need a person.",
   script=[("ev","Inbound · clinic line"),("c","Hi, I'd like to move my appointment."),("a","Sure. I have Thursday at 4 PM or Friday at 11 AM."),("c","Thursday works."),("ev ok","Booked · Thursday 4 PM · SMS reminder set")],
   uses=[("phone","Inbound booking","Answer every call on each clinic's own number."),("rec","Rescheduling","Move appointments by phone, any hour."),("mail","Reminders","SMS reminders before every visit.")],
   flow=[("Inbound","Patient calls the clinic"),("Agent","Checks open slots"),("Booked","Thursday, 4 PM"),("Reminder","SMS 24 hours before")],
   prods=["phone-numbers","ai-agents","messaging"],
   faq=[("Can each clinic have its own number?","Yes. Buy a local number per clinic and bind each to an agent."),("Can staff take over a call?","Yes. Transfer to a person with Dial."),("Can I send reminders?","Yes. Send SMS or WhatsApp from the same account.")]),
 "ecommerce": dict(h1="Order confirmations <em>at checkout speed.</em>", sub="Confirm cash-on-delivery orders, recover carts and answer where-is-my-order calls, even on sale days.",
   script=[("ev","Outbound · COD order 48213"),("a","Hi! Calling to confirm your order of ₹1,899. Press 1 to confirm."),("ev","dtmf · 1"),("a","Thanks, your order is confirmed for delivery tomorrow."),("ev ok","Order released to ship")],
   uses=[("cart","COD confirmation","Confirm orders before they ship."),("bolt","Cart recovery","Call shoppers who left items behind."),("truck","Order status","Answer where-is-my-order calls instantly.")],
   flow=[("Trigger","COD order placed"),("Call","Agent confirms address"),("Keypad","Customer presses 1"),("Outcome","Order released to ship")],
   prods=["voice-api","ai-agents","messaging"],
   faq=[("Can customers confirm with a keypress?","Yes. Collect input with VoxML Gather."),("Can I call in bulk?","Yes. The calls endpoint accepts a list of calls."),("Can I follow up on WhatsApp?","Yes, from the same account.")]),
 "logistics": dict(h1="Delivery calls that <em>reach the doorstep.</em>", sub="Coordinate pickups and delivery slots with customers and drivers, and keep everyone informed as plans change.",
   script=[("ev","Outbound · out for delivery"),("a","Hi, your package arrives today. Is 2 to 4 PM okay?"),("c","Can you come after 6?"),("a","Done. I've moved it to 6 PM and told the driver."),("ev ok","Slot updated · driver app synced")],
   uses=[("truck","Slot confirmation","Confirm delivery windows before dispatch."),("route","Rescheduling","Move deliveries in one call."),("hook","Status updates","Push call outcomes to your systems with webhooks.")],
   flow=[("Trigger","Out for delivery"),("Call","Agent confirms the slot"),("Change","Customer asks for 6 PM"),("Update","Driver app updated")],
   prods=["voice-api","phone-numbers","ai-agents"],
   faq=[("Can call outcomes update my systems?","Yes. Use status and hangup callbacks to update orders."),("Can drivers be connected?","Yes. Bring a driver into the call with Dial or a conference."),("Can I use toll-free numbers?","Yes, for inbound support lines.")]),
 "real-estate": dict(h1="Every enquiry <em>called back in minutes.</em>", sub="Call new leads the moment they land, qualify budget and location, and book site visits while interest is high.",
   script=[("ev","Outbound · new lead"),("a","Hi, you asked about 2BHK homes in Whitefield. What's your budget?"),("c","Around 90 lakh."),("a","I can book a site visit on Sunday at 11. Works?"),("ev ok","Site visit booked · Sunday 11 AM")],
   uses=[("bolt","Instant callback","Call leads within moments of the enquiry."),("users","Qualification","Capture budget, location and timeline."),("home","Site visits","Book visits and send confirmations.")],
   flow=[("Lead","Form filled on a portal"),("Call","Agent calls back quickly"),("Qualify","Budget and location"),("Booked","Site visit on Sunday")],
   prods=["phone-numbers","ai-agents","messaging"],
   faq=[("Can calls come from a local number?","Yes. Use a local number per city."),("Can sales take over?","Yes. Transfer to a person when the lead is ready."),("Can I send a confirmation?","Yes. Send WhatsApp or SMS after the call.")]),
 "travel-hospitality": dict(h1="Bookings and changes, <em>around the clock.</em>", sub="Handle booking changes, check-in questions and confirmations at any hour, on local or toll-free lines.",
   script=[("ev","Inbound · toll-free"),("c","Can I get a late check-out tomorrow?"),("a","Yes, I can extend it to 1 PM for your room."),("c","Perfect."),("ev ok","Late check-out added · SMS sent")],
   uses=[("plane","24/7 lines","Answer every call, any hour."),("phone","Toll-free numbers","Give guests a free number to call."),("mail","Confirmations","Send SMS or WhatsApp confirmations.")],
   flow=[("Inbound","Guest calls the hotel"),("Agent","Finds the booking"),("Change","Late check-out added"),("Confirm","SMS sent to guest")],
   prods=["phone-numbers","ai-agents","messaging"],
   faq=[("Can I offer a toll-free number?","Yes. Buy toll-free numbers for inbound lines."),("Can staff take over?","Yes. Transfer to a person when needed."),("Can I confirm by message?","Yes, by SMS or WhatsApp.")]),
}
def page_solution(slug):
    D = SOL[slug]
    name = next(n for s, n, _, _ in SOLUTIONS if s == slug)
    icon = next(i for s, _, i, _ in SOLUTIONS if s == slug)
    vis = mock(f"{name} · call", '<div class="rv-st">' + "".join(msg(c, t) for c, t in D["script"]) + "</div>")
    body = phero([("Solutions", None), (name, None)], name, D["h1"], D["sub"], vis)
    body += partners()
    body += f'<section class="wrap sect tight">{shead("Use cases", "Calls you can put on <em>autopilot.</em>")}{features([(i, name, t, d) for i, t, d in D["uses"]])}</section>'
    body += f'<section class="wrap sect tight">{shead("Call flow", "One call, <em>start to finish.</em>")}{steps([(k, v) for k, v in D["flow"]], 4)}</section>'
    prods = [(next(p for p in PRODUCTS if p[0] == ps)) for ps in D["prods"]]
    body += stats()
    body += faq(D["faq"])
    body += related("What you'll <em>use.</em>", [(i, n, d, f"/products/{s}/") for s, n, i, d in prods])
    title = f"AI Calling for {name} | TryVox"
    desc = D["sub"]
    return title, desc, body

# ---------------------------------------------------------------- pricing
def page_pricing():
    plans = [("Pay as you go", "Free to start", "For teams getting their first agent on the phone.", ["All products on one account", "No lock-in, no minimums", "Docs and email support"], ("Start free", APP, "kbtn"), False),
             ("Scale", "Volume rates", "For teams running thousands of calls a day.", ["Rates for your volume", "Help planning concurrency", "Priority support"], ("Get a rate card", "/contact/", "kbtn"), True),
             ("Enterprise", "Custom", "For platforms and large operations.", ["Custom terms", "Partner and multi-account setups", "Dedicated contact"], ("Talk to us", "/contact/", "obtn"), False)]
    cards = ""
    for name, price, d, ticks, (cta, href, cls), hl in plans:
        t = "".join(f"<li>{E(x)}</li>" for x in ticks)
        badge = '<span class="badge-top">Most teams</span>' if hl else ""
        cards += f'<div class="plan rv{" hl" if hl else ""}">{badge}<h3>{E(name)}</h3><div class="pr">{E(price)}</div><p>{E(d)}</p><ul class="ticks">{t}</ul><a class="{cls}" href="{href}">{E(cta)}</a></div>'
    est = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
    i = est.index('<section class="wrap sect est" id="estimate"'); j = est.index("</section>", i) + 10
    estimator = est[i:j]
    vis = mock("Your line · estimate", '<div class="rv-st"><div class="mrow"><span>Calls per month</span><span>50,000</span></div><div class="mrow"><span>Average call</span><span>2.5 min</span></div><div class="mrow"><span>Minutes per month</span><span class="mlcd" style="font-size:22px">1,25,000</span></div><div class="mrow"><span>Peak concurrent calls</span><span>~27</span></div></div>', "Example")
    body = phero([("Pricing", None)], "Pricing", "Pay for minutes, <em>not seats.</em>", "Pay as you go with no lock-in and no minimums. When your volume grows, ask for a rate card that fits it.", vis,
                 secondary=("Get a rate card", "/contact/"))
    body += f'<section class="wrap sect tight">{shead("Plans", "Simple plans that <em>grow with you.</em>", "Every plan includes the same products. Volume and support are what change.")}<div class="plans">{cards}</div></section>'
    body += f'<section class="wrap sect tight">{shead("Included everywhere", "Every plan gets <em>the full stack.</em>")}{features([(i, n, n, d) for _, n, i, d in PRODUCTS])}</section>'
    body += estimator
    body += faq([("Is there a free way to start?", "Yes. Start free from the dashboard and pay as you go."),
                 ("Are there minimums or contracts?", "No. Pay as you go has no lock-in and no minimums."),
                 ("How do I get volume rates?", "Use the estimator above, then ask for a rate card from the contact page."),
                 ("Is messaging billed separately?", "Voice and messaging run on one account and one bill.")])
    return "Pricing | TryVox", "Pay as you go telephony for AI voice agents. No lock-in, no minimums. Volume rate cards on request.", body

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
    code = {"curl": ("cURL", CALL_CURL), "node": ("Node", CALL_NODE), "py": ("Python", CALL_PY), "auth": ("Auth", AUTH_CURL)}
    body = f'''<section class="phero wrap"><div class="phero-grid"><div>{crumb([("Developers", None)])}<p class="tag"><i></i>Developers</p><h1 class="hd">Build on <em>TryVox.</em></h1><p class="sub">A REST API at api.tryvox.io with HTTP Basic auth, VoxML for call flows, and webhooks for every call event.</p><div class="cta"><a class="kbtn" href="{DOCS}/getting-started/quickstart">Read the quickstart</a><a class="obtn" href="{APP}">Get API keys</a></div><div class="micro"><span>REST + JSON</span><span>Signed webhooks</span><span>VoxML</span></div></div><div class="rv" style="min-width:0">{code_panel(code, NOTE_CALL)}</div></div></section>'''
    body += f'<section class="wrap sect tight">{shead("Quickstart", "Your first call in <em>four steps.</em>")}{steps([("Get your keys", "Copy your Auth ID and Auth Token from the dashboard.", DOCS + "/getting-started/authentication"), ("Buy a number", "Search and purchase a number to call from.", DOCS + "/numbers/purchase"), ("Place a call", "POST to the calls endpoint with from, to and answer_url.", DOCS + "/voice/make-call"), ("Handle webhooks", "Receive ring, answer, status and hangup callbacks.", DOCS + "/getting-started/webhooks")], 4)}</section>'
    body += f'<section class="wrap sect tight">{shead("Documentation", "Everything in <em>the docs.</em>", "Jump straight to the reference you need.")}<div class="dmap">{groups}</div></section>'
    body += faq([("How does authentication work?", "HTTP Basic auth. Your Auth ID is the username and your Auth Token is the password."),
                 ("Where do callbacks go?", "To the URLs you set on each call, such as answer_url, ring_url, hangup_url and status_callback_url."),
                 ("Are webhooks signed?", "Yes. Set a webhook secret and TryVox signs callback requests with it."),
                 ("Where is the full reference?", "At docs.tryvox.io.")])
    return "Developers | TryVox", "Build on TryVox: REST API with HTTP Basic auth, VoxML call flows and webhooks for every call event.", body

# ---------------------------------------------------------------- integrations
def page_integrations():
    idx = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
    i = idx.index('<section class="integ" id="integrations"'); j = idx.index("</section>", i) + 10
    wall = idx[i:j].replace('<h2 class="hd h2" style="margin-top:20px">', '<h1 class="hd h2" style="margin-top:20px">', 1).replace("</em></h2>", "</em></h1>", 1)
    wall = wall.replace('<a class="obtn" href="/integrations/">See all integrations</a>', f'<a class="obtn" href="{DOCS}/ai-agents">Browse integration docs ↗</a>')
    wall = wall.replace('<div class="integ-copy rv">', '<div class="integ-copy rv">' + crumb([("Integrations", None)]), 1)
    provs = [("Vapi", "vapi"), ("Retell", "retell"), ("ElevenLabs", "elevenlabs"), ("LiveKit", "livekit"), ("Bolna", "bolna")]
    cards = "".join(f'<a class="ccard rv" href="{DOCS}/ai-agents/{s}">{ic("bot")}<h3>{n}</h3><p>Bind a TryVox number to your {n} agent.</p><span class="go">Setup guide ↗</span></a>' for n, s in provs)
    cards += f'<a class="ccard rv" href="{DOCS}/byoc">{ic("sip")}<h3>Your own SIP or carrier</h3><p>Connect any SIP stack, or bring your own carrier.</p><span class="go">BYOC guide ↗</span></a>'
    body = wall
    body += f'<section class="wrap sect tight">{shead("Agent platforms", "Setup guides for <em>every provider.</em>")}<div class="ccards">{cards}</div></section>'
    note = f'From <a href="{DOCS}/ai-agents/connect-number">Connect a number</a> in the TryVox docs.'
    panel = code_panel({"sip": ("Agent SIP headers", SIP_HEADERS)}, note)
    body += f'<section class="wrap sect tight"><div class="devgrid"><div class="rv"><p class="tag"><i></i>How binding works</p><h2 class="hd h2" style="margin-top:20px">Pick, connect, <em>answer.</em></h2><p class="sub">Choose a provider, pick a number and an agent, and confirm. Inbound calls to that number go straight to the agent, with context in SIP headers.</p><ul class="ticks"><li>One number binds to one agent</li><li>No deployment or SIP configuration</li><li>Remove the binding to fall back to your other routing</li></ul></div><div class="rv" style="min-width:0">{panel}</div></div></section>'
    body += faq([("Which agent platforms work with TryVox?", "Vapi, Retell, ElevenLabs, LiveKit and Bolna, plus any standards-based SIP stack."),
                 ("Do I need to configure SIP for agent platforms?", "No. Binding a number to an agent needs no deployment or SIP configuration."),
                 ("Can agents call out through TryVox?", "Outbound calls from agents are still in progress. Inbound calls work today.")])
    return "Integrations | TryVox", "Connect TryVox numbers to Vapi, Retell, ElevenLabs, LiveKit and Bolna, or any SIP stack.", body

# ---------------------------------------------------------------- about / contact
def page_about():
    vis = mock("Company", '<div class="rv-st"><div class="mrow"><span>Company</span><span>Tryjolt Solutions Pvt Ltd</span></div><div class="mrow"><span>Product</span><span>TryVox</span></div><div class="mrow"><span>Built in</span><span>India</span></div><div class="mrow"><span>Focus</span><span>Telephony for voice AI</span></div><div class="mrow"><span>Contact</span><span>team@tryvox.io</span></div></div>', None)
    body = phero([("About", None)], "About TryVox", "We build the <em>phone layer</em> for voice AI.", "TryVox covers voice, SIP, SMS, WhatsApp and workflow automation for teams that need reliable communications in India and beyond.", vis, secondary=("Contact us", "/contact/"))
    body += f'<section class="wrap sect tight">{shead("What we believe", "Communications should be <em>easy to trust.</em>")}{features([("globe", "India-first", "India-first operations", "Compliance, KYC, DLT-aware messaging and telecom workflows are product requirements, not afterthoughts."), ("code", "Developers", "Developer control", "Voice, messaging, routing and webhooks exposed as primitives engineering teams can build on."), ("bot", "AI", "Built for AI workflows", "Real-time conversations where AI agents, support teams and business systems work together."), ("bolt", "Speed", "Fast to integrate", "Live in minutes, with docs that match the product."), ("eye", "Visibility", "Observable in production", "Events and records for every call and message."), ("shield", "Compliance", "Aligned with compliance", "Telecom rules handled inside the product.")])}</section>'
    bind = mock("Bindings", '<div class="mchk"><div>Vapi<span>connected</span></div><div>Retell<span>connected</span></div><div>LiveKit<span>connected</span></div><div>Bolna<span>connected</span></div></div>', None)
    body += f'<section class="wrap sect tight"><div class="frow"><div class="rv"><h3 class="hd">We don&rsquo;t build agents. <em>We connect them.</em></h3><p>TryVox is only the phone layer, so agent platforms and builders can run on us without feeding a competitor.</p><ul class="ticks"><li>Infrastructure only</li><li>Bring any agent platform</li><li>No lock-in</li></ul></div><div class="rv">{bind}</div></div></section>'
    return "About | TryVox", "TryVox builds telephony infrastructure for voice AI: numbers, SIP, voice APIs and messaging. Built in India by Tryjolt Solutions.", body

def page_contact():
    cards = [("mail", "Email the team", "Questions about TryVox, partnerships or anything else.", "mailto:team@tryvox.io", "team@tryvox.io"),
             ("rupee", "Get a rate card", "Tell us your monthly calls and average call length, and we'll share rates for your volume.", "mailto:team@tryvox.io?subject=Rate%20card%20request", "Request rates"),
             ("users", "Book a demo", "See numbers, agents and call events working together.", "mailto:team@tryvox.io?subject=Demo%20request", "Request a demo"),
             ("bolt", "Start free", "Create an account and get a number in minutes.", APP, "Open the dashboard"),
             ("doc", "Read the docs", "API reference, VoxML, numbers, SIP and agent guides.", f"{DOCS}/", "docs.tryvox.io"),
             ("code", "Developer hub", "Quickstart steps and code samples.", "/developers/", "Go to developers")]
    c = "".join(f'<a class="ccard rv" href="{h}">{ic(i)}<h3>{E(t)}</h3><p>{E(d)}</p><span class="go">{E(l)} →</span></a>' for i, t, d, h, l in cards)
    vis = mock("team@tryvox.io", '<div class="rv-st"><div class="mrow"><span>Sales &amp; rate cards</span><span class="pill">Open</span></div><div class="mrow"><span>Partnerships</span><span class="pill">Open</span></div><div class="mrow"><span>Support</span><span class="pill p">Docs + email</span></div></div>', None)
    body = phero([("Contact", None)], "Contact", "Talk to <em>the team.</em>", "Tell us what you're building and how many calls you run. We'll help you get your agent on the phone.", vis,
                 primary=("Email team@tryvox.io", "mailto:team@tryvox.io"), secondary=("Start free", APP), micro=("Built in India", "Replies by email", "No sales pressure"))
    body += f'<section class="wrap sect tight">{shead("Ways to reach us", "Pick what <em>you need.</em>")}<div class="ccards">{c}</div></section>'
    return "Contact | TryVox", "Talk to the TryVox team about numbers, SIP, AI agents and rate cards. Email team@tryvox.io.", body

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
