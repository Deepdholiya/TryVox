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

# ---------------------------------------------------------------- v2 components (giga-style inner pages)
def xhero(crumbs, tag, icon, h1, sub, stage, tint, primary=("Start free", APP), secondary=("Talk to us", "/contact/"), micro=("No lock-in", "Pay as you go", "Live in minutes")):
    m = "".join(f"<span>{E(x)}</span>" for x in micro)
    return f'''<section class="xhero" style="--tint:{tint}">
  <div class="xh-aura" aria-hidden="true"><i></i><i></i></div>
  <div class="wrap xh-in">
    {crumb(crumbs)}
    <p class="xh-tag">{ICON[icon]}<span>{E(tag)}</span></p>
    <h1 class="hd">{h1}</h1>
    <p class="sub">{E(sub)}</p>
    <div class="cta"><a class="kbtn" href="{primary[1]}">{E(primary[0])}</a><a class="obtn" href="{secondary[1]}">{E(secondary[0])}</a></div>
    <div class="micro">{m}</div>
  </div>
  <div class="wrap xh-stage rv">{stage}</div>
</section>'''

APPNAV = [("phone", "Numbers", "phone-numbers"), ("sip", "SIP trunks", "sip-trunking"), ("wave", "Calls", "voice-api"),
          ("bot", "AI agents", "ai-agents"), ("chat", "Messaging", "messaging"), ("shield", "Compliance", "compliance")]
def console(active, where, main, aside=""):
    side = "".join(f'<span class="{"on" if s == active else ""}">{ICON[i]}{E(n)}</span>' for i, n, s in APPNAV)
    a = f'<div class="app-aside">{aside}</div>' if aside else ""
    return f'''<div class="app" aria-label="TryVox dashboard preview" role="img">
  <div class="app-top"><span class="dots"><i></i><i></i><i></i></span><span class="app-org"><svg viewBox="0 0 32 32" aria-hidden="true">{LOGO}</svg>Acme Finance<i>/</i>{E(where)}</span><span class="app-env">Prod</span><span class="app-key">Auth ID &middot; MA&bull;&bull;&bull;&bull;7Q</span></div>
  <div class="app-body"><nav class="app-side"><p>Workspace</p>{side}<p>Account</p><span>{ICON["key"]}API keys</span><span>{ICON["rupee"]}Billing</span></nav>
  <div class="app-main{" has-aside" if aside else ""}"><div class="app-col">{main}</div>{a}</div></div>
</div>'''

def ap_head(title, meta, right=""):
    return f'<div class="ap-h"><div><h4>{title}</h4><p>{meta}</p></div>{right}</div>'
def kpis(items):
    out = ""
    for lbl, val, sub in items:
        out += f'<div class="kpi"><span class="mlabel">{E(lbl)}</span><b>{val}</b>' + (f'<em>{sub}</em>' if sub else "") + '</div>'
    return f'<div class="kpis">{out}</div>'
def tbl(cols, rows, tmpl, hide=()):
    def cell(i, v):
        h = ' class="hs"' if i in hide else ""
        return f'<span{h}>{v}</span>'
    head = "".join(cell(i, E(c)) for i, c in enumerate(cols))
    body = "".join('<div class="tr">' + "".join(cell(i, v) for i, v in enumerate(r)) + "</div>" for r in rows)
    return f'<div class="tbl" style="--cols:{tmpl}"><div class="tr th">{head}</div><div class="rv-st">{body}</div></div>'
def spark(pts, label):
    w, h = 600, 120
    mx = max(pts); n = len(pts) - 1
    xy = [(round(i * w / n, 1), round(h - 10 - (v / mx) * (h - 26), 1)) for i, v in enumerate(pts)]
    d = "M" + " L".join(f"{x},{y}" for x, y in xy)
    area = d + f" L{w},{h} L0,{h} Z"
    lx, ly = xy[-1]
    return f'''<div class="spark"><span class="mlabel">{E(label)}</span><svg viewBox="0 0 {w} {h}" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9D61FF" stop-opacity=".35"/><stop offset="1" stop-color="#9D61FF" stop-opacity="0"/></linearGradient></defs><path class="sa" d="{area}" fill="url(#sg)"/><path class="sl" d="{d}" fill="none" stroke="#B48AFF" stroke-width="2" vector-effect="non-scaling-stroke"/><circle cx="{lx}" cy="{ly}" r="4" fill="#CDB0FF"/></svg></div>'''
def bars(label, n=28):
    import random
    rnd = random.Random(label)
    b = "".join(f'<i style="--h:{rnd.randint(28, 96)}%"></i>' for _ in range(n))
    return f'<div class="vbars"><span class="mlabel">{E(label)}</span><div class="bars" data-live>{b}</div></div>'
ON = ' class="on"'
def chips(items, on=0):
    return '<div class="mchips">' + "".join(f'<span{ON if i == on else ""}>{E(x)}</span>' for i, x in enumerate(items)) + "</div>"
def mono(text): return f'<pre class="mcode">{E(text)}</pre>'
def feed(lines): return '<div class="rv-st mfeed">' + "".join(msg(c, t) for c, t in lines) + "</div>"
def rows(pairs):
    return '<div class="rv-st">' + "".join(f'<div class="mrow"><span>{a}</span><span>{b}</span></div>' for a, b in pairs) + "</div>"
def checks(pairs): return '<div class="mchk">' + "".join(f"<div>{a}<span>{b}</span></div>" for a, b in pairs) + "</div>"
def flowv(items): return '<div class="mflow">' + "".join(f'<div><b>{i}</b>{t}<span class="pill{(" " + c) if c else ""}">{p}</span></div>' for i, (t, p, c) in enumerate(items, 1)) + "</div>"
def pane(label, body, live=None):
    return mock(label, body, live)

def intro_row(text, trio):
    cells = "".join(f'<div class="ir-c rv"><span class="ir-i">{ICON[i]}</span><h3>{E(t)}</h3><p>{E(d)}</p></div>' for i, _, t, d in trio)
    return f'<section class="wrap irow"><p class="ir-lead rv">{E(text)}</p>{cells}</section>'

def chapters(tag, h2, items, tint):
    nav = "".join(f'<button type="button" role="tab" data-go="{i}"{ON if i == 0 else ""}><small>{i + 1:02d}</small>{E(it[0])}</button>' for i, it in enumerate(items))
    arts = ""
    for i, (label, lead, body, ticks, vis) in enumerate(items):
        t = "".join(f"<li>{E(x)}</li>" for x in ticks)
        arts += f'''<article class="chp" data-i="{i}"><div class="chp-copy"><p class="tag"><i></i>{i + 1:02d}</p><h3 class="hd">{E(label)}</h3><p class="lead">{lead}</p><p class="body">{E(body)}</p><ul class="ticks">{t}</ul></div><div class="chp-vis">{vis}</div></article>'''
    return f'''<section class="chaps" style="--tint:{tint}">
  <div class="wrap chp-head">{shead(tag, h2)}</div>
  <div class="chp-nav"><div class="wrap"><div class="chp-tabs" role="tablist" aria-label="Steps">{nav}</div><div class="chp-line"><i></i></div></div></div>
  <div class="wrap chp-list">{arts}</div>
</section>'''

def bento(tag, h2, big, small, tint):
    b = "".join(f'<div class="bcard rv"><div class="bc-copy"><p class="mlab">{E(k)}</p><h3>{E(t)}</h3><p>{E(d)}</p></div><div class="bc-vis">{v}</div></div>' for k, t, d, v in big)
    s = "".join(f'<div class="bsm rv"><span class="ir-i">{ICON[i]}</span><h3>{E(t)}</h3><p>{E(d)}</p></div>' for i, _, t, d in small)
    return f'<section class="wrap sect tight bento" style="--tint:{tint}">{shead(tag, h2)}<div class="bgrid">{b}</div><div class="bsmall">{s}</div></section>'

def bigstats(h2, items=(("<", 200, "ms", "Response time"), ("", 99.9, "%", "Platform uptime"), ("", 24, "/7", "Always available"))):
    cells = ""
    for pre, n, suf, lbl in items:
        cells += f'<div><span class="mlab">{E(lbl)}</span><b class="cnt" data-to="{n}" data-pre="{E(pre)}" data-suf="{E(suf)}">{E(pre)}{n}{E(suf)}</b></div>'
    return f'<section class="bstats wrap"><h2 class="hd h2 rv">{h2}</h2><div class="bs-row rv">{cells}</div></section>'

def devband(code, note, h2="Straight from <em>the docs.</em>", sub="A REST API at api.tryvox.io with Auth ID and Auth Token. Every example here matches the documentation."):
    return f'<section class="wrap sect tight"><div class="xdev"><div class="xdev-copy rv"><p class="tag"><i></i>Developers</p><h2 class="hd h2">{h2}</h2><p class="sub">{E(sub)}</p><div class="cta"><a class="obtn" href="/developers/">Developer hub</a><a class="obtn" href="{DOCS}/">docs.tryvox.io ↗</a></div></div><div class="rv" style="min-width:0">{code_panel(code, note)}</div></div></section>'

def switcher(tag, h2, sub, items, tint):
    lst = "".join(f'<button type="button" class="sw-i{" on" if i == 0 else ""}" data-sw="{i}"><small>{i + 1:02d}</small><span><b>{E(t)}</b><em>{E(d)}</em></span><i class="sw-p"></i></button>' for i, (ic_, t, d, v) in enumerate(items))
    vis = "".join(f'<div class="sw-v{" on" if i == 0 else ""}" data-v="{i}">{v}</div>' for i, (ic_, t, d, v) in enumerate(items))
    return f'<section class="wrap sect tight sw" style="--tint:{tint}"><div class="sw-grid"><div>{shead(tag, h2, sub)}<div class="sw-list">{lst}</div></div><div class="sw-stage rv">{vis}</div></div></section>'

def showcase(h3, p, lines, title="Live call", number="+91 80 4718 2290"):
    data = json.dumps([[("Caller" if c == "c" else "Agent" if c == "a" else "Event"), t, c] for c, t in lines]).replace("</", "<\\/")
    return f'''<section class="wrap sect tight"><div class="show rv">
  <div class="show-copy"><h3>{h3}</h3><p>{E(p)}</p></div>
  <div class="show-mid"><canvas class="dots3d" aria-hidden="true"></canvas>
    <div class="phone"><div class="ph-isl"></div><div class="ph-call"><span class="ph-av"><svg viewBox="0 0 32 32" aria-hidden="true">{LOGO}</svg></span><span><b>{E(title)}</b><small>{E(number)}</small></span><span class="ph-t mlcd">00:00</span></div><div class="ph-wave"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div></div>
  <div class="show-cap" aria-live="polite"><span class="mlab">Caller</span><q>{E(lines[0][1])}</q></div>
  <script type="application/json" class="show-data">{data}</script>
</div></section>'''

def flowrail(tag, h2, items):
    nodes = "".join(f'<div class="fr-n"><span class="fr-d"></span><small>{i + 1:02d} · {E(k)}</small><b>{E(v)}</b></div>' for i, (k, v) in enumerate(items))
    return f'<section class="wrap sect tight">{shead(tag, h2)}<div class="frail" style="--n:{len(items)}"><div class="fr-line"><i></i><b class="fr-pk"></b></div>{nodes}</div></section>'

def tilegrid(tag, h2, tiles):
    t = "".join(f'<a class="tile rv" href="{h}"><span class="tl-i">{v}</span><b>{E(n)}</b><small>{E(d)}</small><span class="go">↗</span></a>' for v, n, d, h in tiles)
    return f'<section class="wrap sect tight">{shead(tag, h2)}<div class="tiles">{t}</div></section>'

def manifesto(text):
    words = " ".join(f"<span>{w}</span>" for w in text.split())
    return f'<section class="wrap mani"><p class="hd" id="mani">{words}</p></section>'

LOGOIMG = {"vapi": ('Vapi', 55), "retell": ('Retell AI', 65), "livekit": ('LiveKit', 18), "bolna": ('Bolna', 28)}
def provgrid(on="vapi"):
    out = ""
    for k in ["vapi", "retell", "elevenlabs", "livekit", "bolna", "more"]:
        cls = ' class="on"' if k == on else ""
        if k in LOGOIMG:
            n, w = LOGOIMG[k]
            out += f'<span{cls}><img src="/assets/logos/{k}.svg" alt="{n}" width="{w}" height="18"></span>'
        else:
            out += f'<span{cls}><em>{"ElevenLabs" if k == "elevenlabs" else "+ more"}</em></span>'
    return f'<div class="mprov">{out}</div>'

def page_wrap_faq(items): return faq(items)

# ---------------------------------------------------------------- product content
PROD = {}
PROD["phone-numbers"] = dict(tint="#19B35A", title="Phone Numbers for AI Voice Agents | TryVox",
  desc="Search, buy and configure local, national and toll-free numbers with business KYC, and bind them to your AI agent.",
  h1="Numbers your callers <em>actually pick up.</em>",
  sub="Search, buy and configure local, national and toll-free numbers with business KYC handled online. Point any number at your agent, your SIP trunk or your own code.",
  app=("Numbers", ap_head("Numbers", "4 numbers · 3 cities", '<span class="mbtn">+ Buy number</span>')
        + f'<div class="msearch">{ICON["search"]}<span>Search <b>Bengaluru</b></span>{chips(["Local", "National", "Toll-free"])}</div>'
        + tbl(["Number", "City", "Type", "Routed to", "Status"],
              [['<b class="mono">+91 80 4718 2290</b>', "Bengaluru", "Local", "Vapi · Riya", '<span class="pill">Active</span>'],
               ['<b class="mono">+91 22 6120 4471</b>', "Mumbai", "Local", "SIP · trunk-prod", '<span class="pill">Active</span>'],
               ['<b class="mono">+91 11 4910 0732</b>', "Delhi", "National", "VoxML flow", '<span class="pill">Active</span>'],
               ['<b class="mono">1800 xxx xxxx</b>', "India", "Toll-free", "Retell · Support", '<span class="pill w">KYC review</span>']],
              "1.5fr 1fr .9fr 1.3fr .9fr", hide=(1, 2)),
       '<p class="mlabel">Bind to agent</p><div class="bind"><span class="mlcd">+91 80 4718 2290</span><span class="arrow">↓</span>' + provgrid() + '<span class="mbtn wide">Confirm binding</span></div>'),
  intro="Every number lives in one dashboard and one API. Buy it, verify it, route it, and see every call it takes.",
  chap=[("Search", "Find the number <em>that fits.</em>", "Search by city or number type in the dashboard or through the Numbers API, then buy it in a click.", ["Local, national and toll-free", "Search from the dashboard or API", "Release numbers you no longer need"],
         pane("Numbers · search", f'<div class="msearch">{ICON["search"]}<span>Search <b>Mumbai · local</b></span></div>' + rows([('<span class="mlcd" style="font-size:22px">+91 22 6120 4471</span>', '<span class="mbtn">Buy</span>'), ("+91 22 6120 5180", '<span class="pill w">Local</span>'), ("+91 22 6120 7702", '<span class="pill w">Local</span>')]))),
        ("Verify", "Business KYC, <em>done online.</em>", "Verification happens before numbers go live, as India's telecom rules require. No paperwork back-and-forth.", ["Verify your business once", "Track status in the dashboard", "Numbers go live when verified"],
         pane("KYC · Acme Finance", checks([("Business details", "submitted"), ("Documents", "uploaded"), ("Review", "complete"), ("Numbers", "live")]), "Verified")),
        ("Route", "Point it <em>anywhere.</em>", "Send a number to an AI agent, a SIP trunk or a VoxML call flow, and change it whenever you like.", ["Bind to Vapi, Retell, ElevenLabs, LiveKit or Bolna", "Or a SIP trunk, or your own code", "Re-route any time"],
         pane("+91 80 4718 2290 · routing", flowv([("AI agent · Vapi", "Selected", "p"), ("SIP trunk · trunk-prod", "Option", "w"), ("VoxML · answer_url", "Option", "w")]), None))],
  big=[("Local presence", "A local caller ID in every city", "Callers are more likely to answer a number they recognise. Give each region or campaign its own number.",
        pane("Caller IDs", checks([("+91 80 4718 2290", "Bengaluru"), ("+91 22 6120 4471", "Mumbai"), ("+91 11 4910 0732", "Delhi"), ("+91 44 6631 0925", "Chennai")]), None)),
       ("Call records", "Every call becomes an event", "Status callbacks and call records for each number, ready for your own dashboards.",
        pane("+91 80 4718 2290 · today", spark([3, 5, 4, 8, 7, 11, 9, 14, 12, 17, 15, 19], "Calls per hour") + rows([("Answered", '<span class="pill">94%</span>')]), "Live"))],
  feat=[("search", "Search", "Search and buy in minutes", "Find numbers by city or type and buy them from the dashboard or the API."),
        ("id", "KYC", "Business KYC, online", "Verification happens before numbers go live."),
        ("route", "Routing", "Route anywhere", "AI agent, SIP trunk or VoxML call flow."),
        ("phone", "Caller ID", "Verified caller IDs", "Verify the numbers you call from."),
        ("bot", "Agents", "Bind to an agent", "Vapi, Retell, ElevenLabs, LiveKit or Bolna in a few clicks."),
        ("eye", "Records", "Call records", "Status callbacks and records for every number.")],
  code={"curl": ("List numbers", AUTH_CURL)}, note=f'Based on <a href="{DOCS}/getting-started/authentication">Authentication</a> in the TryVox docs.',
  faq=[("What kinds of numbers can I get?", "Local, national and toll-free numbers. Search by city or type in the dashboard or through the Numbers API."),
       ("Do I need KYC?", "Yes. Business KYC is completed online before numbers go live, as India's telecom rules require."),
       ("Can I move a number between agents?", "Yes. Re-point a number to a different agent, SIP trunk or call flow at any time. A number can be bound to one agent at a time."),
       ("Can I release a number?", "Yes. Release numbers you no longer need from the dashboard or the API.")])

PROD["sip-trunking"] = dict(tint="#3D7BFF", title="SIP Trunking for AI Voice Agents | TryVox",
  desc="Create SIP trunks, manage credentials and IP ACLs, set channel limits or bring your own carrier.",
  h1="SIP trunking, <em>set up for you.</em>",
  sub="Create trunks for inbound and outbound calls, manage credentials and IP access lists, and set channel limits. Or bring your own carrier and keep your existing routes.",
  app=("SIP trunks", ap_head("trunk-prod", "trunk.tryvox.io · inbound + outbound", '<span class="pill">Active</span>')
        + kpis([("Channels in use", '<span class="mlcd">12</span><small>/ 30</small>', "limit set by you"), ("Credentials", "2", "rotated 4 days ago"), ("IP ACL", "2 ranges", "allow-list on")])
        + bars("Concurrent channels · last hour"),
       '<p class="mlabel">IP access list</p>' + rows([("203.0.113.0/28", '<span class="pill">Allow</span>'), ("198.51.100.4", '<span class="pill">Allow</span>'), ("Everything else", '<span class="pill w">Deny</span>')]) + '<p class="mlabel" style="margin-top:18px">Carrier</p>' + rows([("TryVox", '<span class="pill p">Primary</span>'), ("BYOC", '<span class="pill w">Optional</span>')])),
  intro="Trunks carry calls between the phone network and your stack. TryVox gives you the trunk, the controls and the events in one place.",
  chap=[("Create", "A trunk in <em>one form.</em>", "Name it, choose inbound, outbound or both, and it is ready for your PBX, LiveKit or any SIP client.", ["Inbound and outbound on one trunk", "Dashboard or API", "Works with any SIP stack"],
         pane("New trunk", rows([("Name", "trunk-prod"), ("Direction", '<span class="pill p">Inbound + outbound</span>'), ("Domain", "trunk.tryvox.io")]))),
        ("Secure", "Lock it to <em>who you trust.</em>", "Use SIP credentials, IP access lists, or both. Rotate credentials whenever you need to.", ["Credentials per trunk", "IP allow-lists", "Rotate without downtime"],
         pane("Credentials · IP ACL", checks([("agent-prod", "credential"), ("agent-staging", "credential"), ("203.0.113.0/28", "allowed"), ("198.51.100.4", "allowed")]), "Secured")),
        ("Scale", "Set the channels. <em>Keep your carrier.</em>", "Choose how many concurrent calls a trunk carries. Bring Your Own Carrier keeps your routes and rates, with TryVox routing and events on top.", ["Channel limits per trunk", "BYOC for existing contracts", "Same events on every route"],
         pane("BYOC", flowv([("Your carrier", "SIP", "w"), ("TryVox routing", "Events", "p"), ("Your agent", "Live", "")]), None))],
  big=[("Capacity", "Concurrency you can see", "Channels in use against the limit you set, per trunk.", pane("trunk-prod", bars("Channels · now", 22), "Live")),
       ("Bring your own carrier", "Keep the routes you have", "BYOC keeps your carrier contracts while TryVox handles numbers, routing and call events.", pane("Routes", rows([("Carrier A · BYOC", '<span class="pill">Healthy</span>'), ("TryVox", '<span class="pill p">Primary</span>'), ("Failover", '<span class="pill w">Standby</span>')]), None))],
  feat=[("sip", "Trunks", "Create a trunk", "Inbound and outbound on one trunk."),
        ("key", "Credentials", "Credentials you control", "Generate and rotate SIP credentials per trunk."),
        ("shield", "IP ACL", "IP access lists", "Allow calls only from ranges you trust."),
        ("flow", "Channels", "Channel limits", "Set how many concurrent calls a trunk may carry."),
        ("globe", "BYOC", "Bring your own carrier", "Keep an existing carrier and still use TryVox."),
        ("bot", "Agents", "Works with any SIP stack", "LiveKit, your PBX or any standards-based client.")],
  code=None,
  faq=[("What is a SIP trunk?", "A SIP trunk carries phone calls over the internet between the phone network and your systems, such as a voice agent or PBX."),
       ("Can I restrict who uses my trunk?", "Yes. Use SIP credentials, IP access lists, or both."),
       ("How many calls can a trunk carry?", "You set a channel limit per trunk. Talk to us if you need more capacity."),
       ("Can I use my own carrier?", "Yes. Bring Your Own Carrier (BYOC) keeps your carrier while using TryVox on top.")])

PROD["voice-api"] = dict(tint="#9D61FF", title="Programmable Voice API and VoxML | TryVox",
  desc="Place calls, run conferences, record and build call flows with VoxML. REST API at api.tryvox.io.",
  h1="Every call, <em>under your control.</em>",
  sub="Place calls, receive webhooks at every stage, run conferences, record and hang up from your code. Build call flows with VoxML verbs like Say, Gather, Dial and Stream.",
  app=("Calls", ap_head("Calls", "Today · all numbers", chips(["1H", "24H", "7D"], 1))
        + spark([12, 18, 15, 22, 30, 26, 34, 41, 38, 47, 44, 52, 58, 55, 63], "Calls per minute")
        + tbl(["Call", "To", "Status", "Duration"],
              [['<b class="mono">call_8f2a19</b>', "+91 98•• ••5678", '<span class="pill">In progress</span>', '<span class="mono">01:42</span>'],
               ['<b class="mono">call_7c11e0</b>', "+91 99•• ••0412", '<span class="pill p">Ringing</span>', '<span class="mono">00:00</span>'],
               ['<b class="mono">call_6b90d4</b>', "+91 97•• ••2231", '<span class="pill w">Completed</span>', '<span class="mono">03:08</span>'],
               ['<b class="mono">call_5a07f3</b>', "+91 90•• ••8840", '<span class="pill w">Queued</span>', '<span class="mono">00:00</span>']],
              "1.2fr 1.3fr 1fr .8fr", hide=(1,)),
       '<p class="mlabel">call_8f2a19 · events</p>' + feed([("ev", "201 · status: queued"), ("ev", "ring_url · ringing"), ("ev ok", "answer_url · VoxML returned"), ("ev", "Stream · audio to agent"), ("ev", "status_callback_url · in-progress")])),
  intro="One REST API at api.tryvox.io, HTTP Basic auth, and a webhook for every stage of every call.",
  chap=[("Authenticate", "Two keys. <em>That's it.</em>", "Your Auth ID is the username and your Auth Token is the password. Both come from the dashboard.", ["HTTP Basic auth", "Keys per account", "Same keys for every endpoint"],
         pane("auth.sh", mono("curl -u $TRYVOX_AUTH_ID:$TRYVOX_AUTH_TOKEN \\\n  https://api.tryvox.io/v1/account/$TRYVOX_AUTH_ID/numbers"), None)),
        ("Place a call", "One request <em>starts the call.</em>", "POST from, to and answer_url. TryVox replies 201 with status queued, then calls your webhooks as the call moves.", ["ring_url, hangup_url, status_callback_url", "ring_timeout and time_limit", "Webhooks signed with your secret"],
         pane("call_8f2a19 · events", feed([("ev", "POST /v1/voice/accounts/{auth_id}/calls"), ("ev ok", "201 · status: queued"), ("ev", "ring_url · ringing"), ("ev ok", "answer_url · VoxML returned"), ("a", "Hi, this is Riya from Acme Finance."), ("ev", "hangup_url · final call record")]))),
        ("Return VoxML", "Build the flow <em>with VoxML.</em>", "When a call is answered, TryVox asks your answer_url what to do. Reply with VoxML verbs and TryVox runs them on the call.", ["Say, Play and Gather for menus and input", "Dial and Conference to bring people in", "Stream to send live audio to your agent"],
         pane("VoxML verbs", flowv([("Say a greeting", "Say", "w"), ("Collect a keypress", "Gather", "w"), ("Stream audio to the agent", "Stream", "p"), ("Transfer to a person", "Dial", "w")]), None))],
  big=[("Conferences", "Everyone on one call", "Bring callers, agents and humans into the same conference.", pane("conf_room_12", checks([("Caller · +91 98•• ••5678", "joined"), ("AI agent · Riya", "joined"), ("Supervisor · Neha", "joined")]), "Live")),
       ("Recordings", "Record and fetch later", "Record calls and pull recordings through the API.", pane("Recordings", rows([('<span class="mono">rec_31a8</span>', "03:08"), ('<span class="mono">rec_30f2</span>', "01:57"), ('<span class="mono">rec_2fd9</span>', "04:21")]), None))],
  feat=[("wave", "Calls", "Make and list calls", "Outbound calls one by one or in bulk."),
        ("hook", "Webhooks", "Callbacks for every stage", "Ring, answer, status and hangup URLs."),
        ("flow", "VoxML", "Call flows in VoxML", "Say, Play, Gather, Dial, Record, Stream and more."),
        ("users", "Conferences", "Conferences", "Callers, agents and humans in one call."),
        ("rec", "Recordings", "Recordings", "Record calls and fetch them through the API."),
        ("bolt", "Control", "Live call actions", "Act on calls in progress, or hang them up.")],
  code={"curl": ("cURL", CALL_CURL), "node": ("Node", CALL_NODE), "py": ("Python", CALL_PY), "resp": ("Response", CALL_RESP)}, note=NOTE_CALL,
  faq=[("How do I authenticate?", "HTTP Basic auth: your Auth ID is the username and your Auth Token is the password. Both come from the dashboard."),
       ("What does answer_url need to return?", "VoxML. TryVox POSTs to answer_url when the call is answered and runs the VoxML you return."),
       ("Can I place calls in bulk?", "Yes. The same endpoint accepts a list of calls."),
       ("Is answering machine detection available?", "Not yet. The parameter is accepted but has no effect today, so don't rely on it.")])

PROD["ai-agents"] = dict(tint="#C257F0", title="Connect AI Voice Agents to Phone Numbers | TryVox",
  desc="Bind a TryVox number to a Vapi, Retell, ElevenLabs, LiveKit or Bolna agent. No deployment or SIP configuration needed.",
  h1="Your agent, <em>on a real number.</em>",
  sub="Pick your provider, choose a TryVox number and an agent, and confirm. The agent answers calls on that number straight away, with no deployment or SIP configuration.",
  app=("AI agents", ap_head("AI agents", "3 bindings · 3 providers", '<span class="mbtn">+ Connect number</span>') + provgrid()
        + tbl(["Number", "Provider", "Agent", "Direction"],
              [['<b class="mono">+91 80 4718 2290</b>', "Vapi", "Collections · Riya", '<span class="pill">Inbound</span>'],
               ['<b class="mono">+91 22 6120 4471</b>', "Retell", "Support · Arjun", '<span class="pill">Inbound</span>'],
               ['<b class="mono">1800 xxx xxxx</b>', "Bolna", "Bookings · Meera", '<span class="pill">Inbound</span>']],
              "1.4fr .9fr 1.3fr .9fr", hide=(2,)),
       '<p class="mlabel">Incoming · SIP headers</p>' + feed([("ev", "X-TryVox-Direction: inbound"), ("ev", "X-TryVox-Route: ai-agent"), ("ev", "X-TryVox-AI-Provider: vapi"), ("ev", "X-TryVox-From: +91 98•• ••5678"), ("ev ok", "Agent answered")])),
  intro="TryVox is the phone layer only. Bring the agent you built anywhere and give it a real number in a few clicks.",
  chap=[("Choose a provider", "Bring the agent <em>you already built.</em>", "Open AI Agents and pick your integration: Vapi, Retell, ElevenLabs, LiveKit or Bolna.", ["Five providers today, more on the way", "Keep your agent platform", "No lock-in"],
         pane("AI agents · providers", provgrid("retell"), None)),
        ("Pick number and agent", "One number, <em>one agent.</em>", "Choose an active TryVox number and an agent from your provider, so routing stays predictable.", ["Each number binds to one agent", "Switch agents without changing numbers", "Remove a binding to fall back"],
         pane("Connect number", rows([("Number", '<span class="mlcd" style="font-size:20px">+91 80 4718 2290</span>'), ("Provider", "Retell"), ("Agent", "Support · Arjun"), ("Status", '<span class="pill">Connected</span>')]))),
        ("Answer", "Calls arrive <em>with context.</em>", "Inbound calls to the number go straight to the agent, with direction, provider, caller and number in SIP headers.", ["No deployment or SIP configuration", "Context in X-TryVox headers", "Same events and recordings"],
         pane("Incoming call", feed([("ev", "X-TryVox-Direction: inbound"), ("ev", "X-TryVox-AI-Provider: retell"), ("ev ok", "Agent answered · streaming"), ("a", "Hi, you've reached Acme support. How can I help?")]), "Live"))],
  big=[("We don't build agents", "Infrastructure only", "Agent platforms and builders can run on TryVox without feeding a competitor.", pane("Bindings", checks([("+91 80 4718 2290 → Vapi", "inbound"), ("+91 22 6120 4471 → Retell", "inbound"), ("1800 xxx xxxx → Bolna", "inbound")]), None)),
       ("Switch freely", "Change providers, keep numbers", "Move a number to a different agent at any time. Your callers never notice.", pane("Re-bind", flowv([("Vapi · Riya", "Before", "w"), ("Retell · Arjun", "After", "p")]), None))],
  feat=[("bot", "Providers", "Bring any agent", "Vapi, Retell, ElevenLabs, LiveKit and Bolna."),
        ("bolt", "Setup", "No SIP to configure", "Binding a number is a few clicks."),
        ("route", "Routing", "One number, one agent", "Predictable routing for every number."),
        ("code", "Headers", "Context in SIP headers", "Direction, provider, caller and number."),
        ("flow", "Fallback", "Clean fallback", "Remove a binding and other routing takes over."),
        ("eye", "Observe", "Same call records", "Agent calls get the same events and recordings.")],
  code={"sip": ("Agent SIP headers", SIP_HEADERS)}, note=f'From <a href="{DOCS}/ai-agents/connect-number">Connect a number</a> in the TryVox docs.',
  faq=[("Which providers are supported?", "Vapi, Retell, ElevenLabs, LiveKit and Bolna."),
       ("Do agents make outbound calls through TryVox?", "Inbound calls to a bound number go straight to the agent. Outbound calls from the agent are still in progress, so don't rely on them for production yet."),
       ("Can one number go to two agents?", "No. A number binds to one agent at a time."),
       ("Should I also set the number as inbound in my provider?", "No. Doing both can make calls conflict. Let TryVox route the number to the agent.")])

PROD["messaging"] = dict(tint="#14B3A0", title="WhatsApp and SMS for Voice AI Teams | TryVox",
  desc="Send WhatsApp and DLT-ready SMS from the same account as your phone numbers, including WhatsApp calling and templates.",
  h1="Follow up on <em>the channel they read.</em>",
  sub="Send WhatsApp messages and DLT-ready SMS from the same account as your numbers. Confirm, remind and share links right after the call.",
  app=("Messaging", ap_head("Messaging", "WhatsApp · SMS · this week", chips(["WhatsApp", "SMS"]))
        + '<div class="funnel"><div style="--w:100%"><span>Sent</span><b>12,480</b></div><div style="--w:97%"><span>Delivered</span><b>12,102</b></div><div style="--w:79%"><span>Read</span><b>9,860</b></div></div>'
        + tbl(["Template", "Channel", "Status"],
              [['<b class="mono">payment_reminder</b>', "WhatsApp", '<span class="pill">Approved</span>'],
               ['<b class="mono">otp_login</b>', "SMS · DLT", '<span class="pill">Approved</span>'],
               ['<b class="mono">delivery_slot</b>', "WhatsApp", '<span class="pill w">Pending</span>']],
              "1.6fr 1fr .9fr"),
       '<p class="mlabel">After the call</p>' + feed([("ev ok", "call.completed · 02:41"), ("a", "Here is your payment link for the EMI due on Friday."), ("c", "Paid. Thank you!"), ("ev", "template: payment_reminder · read")])),
  intro="Voice and messaging on one account and one bill, so the follow-up goes out the moment the call ends.",
  chap=[("Add a channel", "WhatsApp and SMS, <em>side by side.</em>", "Connect WhatsApp and DLT-ready SMS to the same account as your numbers.", ["WhatsApp messaging and calling", "DLT-ready SMS for India", "One account"],
         pane("Channels", checks([("WhatsApp Business", "connected"), ("WhatsApp calling", "enabled"), ("SMS · DLT entity", "linked")]), "Ready")),
        ("Set up templates", "Templates <em>ready to send.</em>", "Manage the templates your campaigns use, and see which are approved.", ["Template management", "Approval status at a glance", "Reuse across campaigns"],
         pane("Templates", rows([('<span class="mono">payment_reminder</span>', '<span class="pill">Approved</span>'), ('<span class="mono">appointment_confirm</span>', '<span class="pill">Approved</span>'), ('<span class="mono">delivery_slot</span>', '<span class="pill w">Pending</span>')]))),
        ("Send", "Follow up <em>the moment it ends.</em>", "Send from the API or right after each call, and track sent, delivered and read.", ["Send from the API", "Delivery and read events", "Pay as you go"],
         pane("WhatsApp · after the call", feed([("ev ok", "call.completed · 02:41"), ("a", "Thanks for your time today. Here is your payment link."), ("c", "Paid. Thank you!"), ("ev", "delivered · read")])))],
  big=[("Delivery events", "Know what was read", "Sent, delivered and read events for every message.", '<div class="mock"><div class="mock-body"><div class="funnel"><div style="--w:100%"><span>Sent</span><b>4,210</b></div><div style="--w:96%"><span>Delivered</span><b>4,047</b></div><div style="--w:81%"><span>Read</span><b>3,402</b></div></div></div></div>'),
       ("WhatsApp calling", "Calls on WhatsApp too", "Take calls on WhatsApp alongside your phone numbers.", pane("WhatsApp call", rows([("Caller", "+91 98•• ••5678"), ("Status", '<span class="pill">Connected</span>'), ("Duration", '<span class="mono">00:47</span>')]), "Live"))],
  feat=[("chat", "WhatsApp", "WhatsApp messaging", "Send and receive messages in one place."),
        ("phone", "Calling", "WhatsApp calling", "Take calls on WhatsApp alongside your numbers."),
        ("doc", "Templates", "Templates", "Manage the templates your campaigns use."),
        ("mail", "SMS", "DLT-ready SMS", "OTPs, reminders and alerts under DLT rules."),
        ("hook", "Events", "Delivery events", "Sent, delivered and read."),
        ("rupee", "Billing", "One account, one bill", "Voice and messaging, pay as you go.")],
  code=None,
  faq=[("Can I send WhatsApp messages after an AI call?", "Yes. Messaging runs on the same account, so you can follow up when a call ends."),
       ("Is SMS DLT-ready?", "Yes. DLT registration is part of compliance in TryVox."),
       ("Is WhatsApp calling supported?", "Yes. See WhatsApp calling in the docs.")])

PROD["compliance"] = dict(tint="#E8932A", title="Telecom Compliance for AI Calling in India | TryVox",
  desc="Business KYC, consent records, DLT registration and verified caller IDs, built into TryVox.",
  h1="India's telecom rules, <em>handled.</em>",
  sub="Business KYC, consent records, DLT registration and verified caller IDs are part of the product, not a project you run on the side.",
  app=("Compliance", ap_head("Compliance", "Account readiness", '<span class="pill">Ready</span>')
        + '<div class="ready"><div class="ring" style="--p:100"><b>4/4</b><small>checks</small></div>' + checks([("Business KYC", "verified"), ("Consent records", "per contact"), ("DLT entity", "linked"), ("Caller IDs", "2 verified")]) + '</div>',
       '<p class="mlabel">Consent log</p>' + rows([("+91 98•• ••5678", '<span class="pill">Consented</span>'), ("+91 99•• ••0412", '<span class="pill">Consented</span>'), ("+91 97•• ••2231", '<span class="pill w">Withdrawn</span>')])),
  intro="Compliance in India is a product requirement. TryVox builds it into numbers, calling and messaging from day one.",
  chap=[("Complete KYC", "Verify <em>once.</em>", "Business verification happens online, before numbers are issued.", ["Online, no paperwork loop", "Status in the dashboard", "Required for every number"],
         pane("KYC", checks([("Business details", "submitted"), ("Documents", "uploaded"), ("Verified", "complete")]), "Verified")),
        ("Record consent", "Consent, <em>on record.</em>", "Store consent for the people you call, and respect it when they withdraw.", ["Consent per contact", "Withdrawals respected", "Exportable records"],
         pane("Consent", rows([("+91 98•• ••5678", '<span class="pill">Consented</span>'), ("+91 99•• ••0412", '<span class="pill">Consented</span>'), ("+91 97•• ••2231", '<span class="pill w">Withdrawn</span>')]))),
        ("DLT and caller IDs", "Register, verify, <em>send.</em>", "Link your DLT entity for SMS and verify the numbers you call from.", ["DLT entity and templates", "Verified caller IDs", "Signed webhooks"],
         pane("DLT · caller IDs", checks([("DLT entity", "linked"), ("otp_login", "template"), ("+91 80 4718 2290", "caller ID"), ("+91 22 6120 4471", "caller ID")]), "Ready"))],
  big=[("Audit trail", "Every call leaves a record", "An event trail for every call and message, for your audits.", pane("Events", feed([("ev", "call.initiated · consent checked"), ("ev ok", "call.answered"), ("ev", "call.completed · record stored")]), None)),
       ("Security", "Signed webhooks", "Callbacks are signed with your webhook secret so you can trust what arrives.", pane("Webhook", rows([("Secret", '<span class="mono">whsec_••••••••</span>'), ("Signature", '<span class="pill">Valid</span>')]), None))],
  feat=[("id", "KYC", "Business KYC", "Verification before numbers go live."),
        ("users", "Consent", "Consent records", "Record consent for the people you call."),
        ("mail", "DLT", "DLT registration", "Entity and template workflows for SMS."),
        ("phone", "Caller ID", "Verified caller IDs", "Verify the numbers you call from."),
        ("eye", "Audit", "Call records", "An event trail for every call and message."),
        ("shield", "Security", "Signed webhooks", "Callbacks signed with your secret.")],
  code=None,
  faq=[("Why does TryVox need KYC?", "India's telecom rules require business verification before numbers are issued."),
       ("What is DLT?", "Distributed Ledger Technology registration, required in India for commercial SMS."),
       ("How do verified caller IDs work?", "You verify ownership of a number, then use it as the caller ID on outbound calls.")])

def page_product(slug):
    P = PROD[slug]
    name, icon = next((n, i) for s, n, i, _ in PRODUCTS if s == slug)
    where, main, aside = P["app"]
    body = xhero([("Products", None), (name, None)], name, icon, P["h1"], P["sub"], console(slug, where, main, aside), P["tint"])
    body += intro_row(P["intro"], P["feat"][:3])
    body += partners()
    body += chapters("How it works", "Live in <em>three steps.</em>", P["chap"], P["tint"])
    body += bento("What you get", "Everything in <em>" + E(name) + ".</em>", P["big"], P["feat"][3:], P["tint"])
    if P.get("code"):
        body += devband(P["code"], P["note"])
    body += bigstats("Built for <em>production.</em>")
    body += faq(P["faq"])
    body += related_products(slug)
    return P["title"], P["desc"], body

# ---------------------------------------------------------------- solution pages
SOL = {
 "financial-services": dict(tint="#5B6CFF", h1="Collections and reminders <em>that connect.</em>", sub="Run EMI reminders, KYC follow-ups and loan servicing calls with your AI agent on local numbers, then follow up on WhatsApp.",
   script=[("c", "Hi, who is this?"), ("a", "Hi, this is Riya calling from Acme Finance. Is this a good time?"), ("c", "Yes, go ahead."), ("a", "Your EMI of ₹4,250 is due on Friday. Shall I send a payment link on WhatsApp?"), ("c", "Yes please, send it."), ("ev ok", "Promise to pay · Friday · link sent")],
   uses=[("rupee", "EMI reminders", "Remind borrowers before due dates and log promises to pay.", [("ev", "Outbound · EMI due in 3 days"), ("a", "Your EMI of ₹4,250 is due on Friday."), ("c", "I'll pay on Friday."), ("ev ok", "Promise to pay logged")]),
         ("id", "KYC follow-ups", "Call customers to complete or update KYC.", [("ev", "Outbound · KYC pending"), ("a", "We still need your address proof to finish KYC."), ("c", "Can you send me the link?"), ("ev ok", "Upload link sent on WhatsApp")]),
         ("users", "Loan servicing", "Answer balance and schedule questions, with a human one transfer away.", [("ev", "Inbound · servicing line"), ("c", "What's my outstanding balance?"), ("a", "It's ₹1,12,400 with 26 EMIs left."), ("ev", "Transfer offered · Dial")])],
   flow=[("Trigger", "EMI due in 3 days"), ("Call", "Agent calls from a local number"), ("Outcome", "Promise to pay: Friday"), ("Follow-up", "WhatsApp payment link sent")],
   prods=["phone-numbers", "ai-agents", "messaging"],
   faq=[("Can calls come from a local number?", "Yes. Buy local numbers per region and use verified caller IDs."), ("Can a person take over?", "Yes. Bring a human into the call with Dial or a conference."), ("How do I keep records?", "Every call produces events, a call record and optional recordings.")]),
 "healthcare": dict(tint="#EF5B7B", h1="Appointments booked <em>without hold music.</em>", sub="Let your agent answer patient calls on clinic numbers, confirm slots and send reminders, while staff handle the cases that need a person.",
   script=[("c", "Hi, I'd like to move my appointment."), ("a", "Sure. I have Thursday at 4 PM or Friday at 11 AM."), ("c", "Thursday works."), ("a", "Done. You'll get an SMS reminder the day before."), ("ev ok", "Booked · Thursday 4 PM · SMS reminder set")],
   uses=[("phone", "Inbound booking", "Answer every call on each clinic's own number.", [("ev", "Inbound · Indiranagar clinic"), ("c", "Do you have a slot tomorrow?"), ("a", "Yes, 10:30 AM with Dr. Rao."), ("ev ok", "Booked · 10:30 AM")]),
         ("rec", "Rescheduling", "Move appointments by phone, any hour.", [("ev", "Inbound · 9:40 PM"), ("c", "I need to move Monday's visit."), ("a", "I can do Wednesday at 5 PM."), ("ev ok", "Rescheduled · Wednesday 5 PM")]),
         ("mail", "Reminders", "SMS reminders before every visit.", [("ev", "24 hours before visit"), ("ev ok", "SMS · appointment_confirm · delivered"), ("c", "Reply: CONFIRM"), ("ev ok", "Visit confirmed")])],
   flow=[("Inbound", "Patient calls the clinic"), ("Agent", "Checks open slots"), ("Booked", "Thursday, 4 PM"), ("Reminder", "SMS 24 hours before")],
   prods=["phone-numbers", "ai-agents", "messaging"],
   faq=[("Can each clinic have its own number?", "Yes. Buy a local number per clinic and bind each to an agent."), ("Can staff take over a call?", "Yes. Transfer to a person with Dial."), ("Can I send reminders?", "Yes. Send SMS or WhatsApp from the same account.")]),
 "ecommerce": dict(tint="#FF7A3D", h1="Order confirmations <em>at checkout speed.</em>", sub="Confirm cash-on-delivery orders, recover carts and answer where-is-my-order calls, even on sale days.",
   script=[("a", "Hi! Calling to confirm your order of ₹1,899."), ("c", "Yes, that's mine."), ("a", "Great. Press 1 to confirm delivery tomorrow."), ("ev", "dtmf · 1"), ("ev ok", "Order released to ship")],
   uses=[("cart", "COD confirmation", "Confirm orders before they ship.", [("ev", "Outbound · COD order 48213"), ("a", "Press 1 to confirm your ₹1,899 order."), ("ev", "dtmf · 1"), ("ev ok", "Released to ship")]),
         ("bolt", "Cart recovery", "Call shoppers who left items behind.", [("ev", "Outbound · cart left 2h ago"), ("a", "Your sneakers are still in your cart."), ("c", "Is there a size 9?"), ("ev ok", "Size 9 reserved · link sent")]),
         ("truck", "Order status", "Answer where-is-my-order calls instantly.", [("ev", "Inbound · support line"), ("c", "Where is my order?"), ("a", "It's out for delivery and arrives by 6 PM."), ("ev ok", "Resolved on the call")])],
   flow=[("Trigger", "COD order placed"), ("Call", "Agent confirms address"), ("Keypad", "Customer presses 1"), ("Outcome", "Order released to ship")],
   prods=["voice-api", "ai-agents", "messaging"],
   faq=[("Can customers confirm with a keypress?", "Yes. Collect input with VoxML Gather."), ("Can I call in bulk?", "Yes. The calls endpoint accepts a list of calls."), ("Can I follow up on WhatsApp?", "Yes, from the same account.")]),
 "logistics": dict(tint="#2BA2E0", h1="Delivery calls that <em>reach the doorstep.</em>", sub="Coordinate pickups and delivery slots with customers and drivers, and keep everyone informed as plans change.",
   script=[("a", "Hi, your package arrives today. Is 2 to 4 PM okay?"), ("c", "Can you come after 6?"), ("a", "Done. I've moved it to 6 PM and told the driver."), ("c", "Perfect, thanks."), ("ev ok", "Slot updated · driver app synced")],
   uses=[("truck", "Slot confirmation", "Confirm delivery windows before dispatch.", [("ev", "Outbound · before dispatch"), ("a", "Is 2 to 4 PM okay for delivery?"), ("c", "Yes, that works."), ("ev ok", "Slot confirmed")]),
         ("route", "Rescheduling", "Move deliveries in one call.", [("ev", "Outbound · out for delivery"), ("c", "I won't be home until 6."), ("a", "Moved to 6 PM."), ("ev ok", "Driver app updated")]),
         ("hook", "Status updates", "Push call outcomes to your systems with webhooks.", [("ev", "hangup_url · call record"), ("ev ok", "Order 7731 · slot 18:00"), ("ev", "status_callback_url · completed"), ("ev ok", "TMS updated")])],
   flow=[("Trigger", "Out for delivery"), ("Call", "Agent confirms the slot"), ("Change", "Customer asks for 6 PM"), ("Update", "Driver app updated")],
   prods=["voice-api", "phone-numbers", "ai-agents"],
   faq=[("Can call outcomes update my systems?", "Yes. Use status and hangup callbacks to update orders."), ("Can drivers be connected?", "Yes. Bring a driver into the call with Dial or a conference."), ("Can I use toll-free numbers?", "Yes, for inbound support lines.")]),
 "real-estate": dict(tint="#26B07A", h1="Every enquiry <em>called back in minutes.</em>", sub="Call new leads the moment they land, qualify budget and location, and book site visits while interest is high.",
   script=[("a", "Hi, you asked about 2BHK homes in Whitefield. What's your budget?"), ("c", "Around 90 lakh."), ("a", "I can book a site visit on Sunday at 11. Works?"), ("c", "Yes, Sunday is good."), ("ev ok", "Site visit booked · Sunday 11 AM")],
   uses=[("bolt", "Instant callback", "Call leads within moments of the enquiry.", [("ev", "Lead · portal form · 10:02"), ("ev ok", "Outbound call · 10:03"), ("a", "Thanks for your enquiry about Whitefield."), ("c", "Yes, I'm interested.")]),
         ("users", "Qualification", "Capture budget, location and timeline.", [("a", "What budget are you looking at?"), ("c", "Around 90 lakh."), ("a", "And when do you plan to move?"), ("ev ok", "Qualified · 90L · 3 months")]),
         ("home", "Site visits", "Book visits and send confirmations.", [("a", "Sunday at 11 for a site visit?"), ("c", "Yes."), ("ev ok", "Visit booked · Sunday 11 AM"), ("ev", "WhatsApp · location pin sent")])],
   flow=[("Lead", "Form filled on a portal"), ("Call", "Agent calls back quickly"), ("Qualify", "Budget and location"), ("Booked", "Site visit on Sunday")],
   prods=["phone-numbers", "ai-agents", "messaging"],
   faq=[("Can calls come from a local number?", "Yes. Use a local number per city."), ("Can sales take over?", "Yes. Transfer to a person when the lead is ready."), ("Can I send a confirmation?", "Yes. Send WhatsApp or SMS after the call.")]),
 "travel-hospitality": dict(tint="#D9A022", h1="Bookings and changes, <em>around the clock.</em>", sub="Handle booking changes, check-in questions and confirmations at any hour, on local or toll-free lines.",
   script=[("c", "Can I get a late check-out tomorrow?"), ("a", "Yes, I can extend it to 1 PM for your room."), ("c", "Perfect."), ("a", "Done. I've sent the details by SMS."), ("ev ok", "Late check-out added · SMS sent")],
   uses=[("plane", "24/7 lines", "Answer every call, any hour.", [("ev", "Inbound · 2:14 AM"), ("c", "Is the airport shuttle running?"), ("a", "Yes, every 30 minutes from 5 AM."), ("ev ok", "Resolved")]),
         ("phone", "Toll-free numbers", "Give guests a free number to call.", [("ev", "Inbound · 1800 line"), ("c", "I need to change my booking dates."), ("a", "Moved to the 14th to the 16th."), ("ev ok", "Booking updated")]),
         ("mail", "Confirmations", "Send SMS or WhatsApp confirmations.", [("ev ok", "Booking updated"), ("ev", "WhatsApp · booking_confirm"), ("ev ok", "Delivered · read"), ("c", "Got it, thanks!")])],
   flow=[("Inbound", "Guest calls the hotel"), ("Agent", "Finds the booking"), ("Change", "Late check-out added"), ("Confirm", "SMS sent to guest")],
   prods=["phone-numbers", "ai-agents", "messaging"],
   faq=[("Can I offer a toll-free number?", "Yes. Buy toll-free numbers for inbound lines."), ("Can staff take over?", "Yes. Transfer to a person when needed."), ("Can I confirm by message?", "Yes, by SMS or WhatsApp.")]),
}
def devices(name, D):
    f = D["flow"]
    first = [l for l in D["script"] if l[0] != "ev"][:3]
    talk = "".join(msg(c, t) for c, t in first)
    return f'''<div class="devs">
  <div class="dev d-l"><p class="mlabel">01 · {E(f[0][0])}</p><div class="dev-ev"><span class="pill p">{E(f[0][0])}</span><b>{E(f[0][1])}</b></div><p class="mlabel" style="margin-top:16px">02 · {E(f[1][0])}</p><div class="dev-ev"><span class="pill">{E(f[1][0])}</span><b>{E(f[1][1])}</b></div></div>
  <div class="dev d-c"><div class="dev-top"><span class="dots"><i></i><i></i><i></i></span><span>{E(name)} · live call</span><span class="live">Live</span></div><div class="dev-body mfeed rv-st">{talk}</div><div class="dev-bar"><span class="mlcd dclock">00:00</span><span class="wv"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span></div></div>
  <div class="dev d-r"><p class="mlabel">03 · {E(f[2][0])}</p><div class="dev-ev"><span class="pill">{E(f[2][0])}</span><b>{E(f[2][1])}</b></div><p class="mlabel" style="margin-top:16px">04 · {E(f[3][0])}</p><div class="dev-ev"><span class="pill w">{E(f[3][0])}</span><b>{E(f[3][1])}</b></div></div>
</div>'''

def page_solution(slug):
    D = SOL[slug]
    name, icon = next((n, i) for s, n, i, _ in SOLUTIONS if s == slug)
    body = xhero([("Solutions", None), (name, None)], name, icon, D["h1"], D["sub"], devices(name, D), D["tint"])
    body += partners()
    items = [(i, t, d, mock(f"{name} · {t}", feed(lines))) for i, t, d, lines in D["uses"]]
    body += switcher("Use cases", "Calls you can put on <em>autopilot.</em>", "Pick a use case to see the call.", items, D["tint"])
    body += showcase("Every call sounds like your best agent.", "Your AI agent handles the conversation. TryVox carries the call on a real number, streams the audio and reports every event back to you.", D["script"])
    body += flowrail("Call flow", "One call, <em>start to finish.</em>", D["flow"])
    body += bigstats("Built for <em>real call volume.</em>")
    prods = [next(p for p in PRODUCTS if p[0] == ps) for ps in D["prods"]]
    body += faq(D["faq"])
    body += related("What you'll <em>use.</em>", [(i, n, d, f"/products/{s}/") for s, n, i, d in prods])
    return f"AI Calling for {name} | TryVox", D["sub"], body

# ---------------------------------------------------------------- pricing
def page_pricing():
    plans = [("Pay as you go", "Free to start", "For teams getting their first agent on the phone.", ["All products on one account", "No lock-in, no minimums", "Docs and email support"], ("Start free", APP, "obtn"), False),
             ("Scale", "Volume rates", "For teams running thousands of calls a day.", ["Rates for your volume", "Help planning concurrency", "Priority support"], ("Get a rate card", "/contact/", "kbtn"), True),
             ("Enterprise", "Custom", "For platforms and large operations.", ["Custom terms", "Partner and multi-account setups", "Dedicated contact"], ("Talk to us", "/contact/", "obtn"), False)]
    cards = ""
    for name, price, d, ticks, (cta, href, cls), hl in plans:
        t = "".join(f"<li>{E(x)}</li>" for x in ticks)
        badge = '<span class="badge-top">Most teams</span>' if hl else ""
        meter = '<div class="pmeter"><span class="mlabel">Minutes this month</span><span class="mlcd" data-meter>1,25,000</span><div class="bars" data-live>' + "".join(f'<i style="--h:{h}%"></i>' for h in (30, 42, 38, 55, 48, 62, 58, 71, 66, 80, 74, 88)) + '</div></div>' if hl else ""
        cards += f'<div class="plan rv{" hl" if hl else ""}">{badge}<h3>{E(name)}</h3><div class="pr">{E(price)}</div><p>{E(d)}</p>{meter}<ul class="ticks">{t}</ul><a class="{cls}" href="{href}">{E(cta)}</a></div>'
    est = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
    i = est.index('<section class="wrap sect est" id="estimate"'); j = est.index("</section>", i) + 10
    estimator = est[i:j]
    body = xhero([("Pricing", None)], "Pricing", "rupee", "Pay for minutes, <em>not seats.</em>", "Pay as you go with no lock-in and no minimums. When your volume grows, ask for a rate card that fits it.",
                 f'<div class="plans">{cards}</div>', "#9D61FF", secondary=("Get a rate card", "/contact/"))
    body += intro_row("Every plan includes the same products. Volume and support are what change.", [("bolt", "", "Start in minutes", "Create an account and buy a number today."), ("rupee", "", "Pay as you go", "No minimums, no lock-in, one bill."), ("users", "", "Rates that scale", "Volume pricing when your calls grow.")])
    tiles = [(ICON[i], n, d, f"/products/{s}/") for s, n, i, d in PRODUCTS]
    body += tilegrid("Included everywhere", "Every plan gets <em>the full stack.</em>", tiles)
    body += estimator
    body += bigstats("Infrastructure you can <em>budget for.</em>")
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
def ide():
    code = {"curl": ("cURL", CALL_CURL), "node": ("Node", CALL_NODE), "py": ("Python", CALL_PY), "auth": ("Auth", AUTH_CURL)}
    side = "".join(f'<span class="{"on" if i == 0 else ""}"><em class="m {m.lower()}">{m}</em>{E(n)}</span>' for i, (m, n) in enumerate([("POST", "Make a call"), ("GET", "List calls"), ("POST", "Hang up"), ("POST", "Conferences"), ("GET", "Numbers"), ("POST", "Connect number")]))
    return f'''<div class="ide"><div class="ide-side"><p class="mlabel">Endpoints</p>{side}<p class="mlabel" style="margin-top:18px">Base URL</p><span class="mono small">api.tryvox.io</span></div>
<div class="ide-code">{code_panel(code, NOTE_CALL)}</div>
<div class="ide-resp"><p class="mlabel">Response · 201</p><pre class="mcode">{E(CALL_RESP)}</pre><p class="mlabel" style="margin-top:14px">Webhooks</p>{feed([("ev", "ring_url · ringing"), ("ev ok", "answer_url · answered"), ("ev", "hangup_url · completed")])}</div></div>'''

def page_developers():
    groups = "".join(f'<div class="dgrp rv"><h3>{ic(i)}{E(t)}</h3><ul>' + "".join(f'<li><a href="{DOCS}{h}">{E(n)}<span>↗</span></a></li>' for n, h in links) + "</ul></div>" for i, t, links in DOC_MAP)
    body = xhero([("Developers", None)], "Developers", "code", "Build on <em>TryVox.</em>", "A REST API at api.tryvox.io with HTTP Basic auth, VoxML for call flows, and webhooks for every call event.", ide(), "#3D7BFF",
                 primary=("Read the quickstart", f"{DOCS}/getting-started/quickstart"), secondary=("Get API keys", APP), micro=("REST + JSON", "Signed webhooks", "VoxML"))
    body += intro_row("Everything you need to put an agent on the phone network from your own code.", [("code", "", "REST + JSON", "Predictable resources under /v1."), ("hook", "", "Webhooks", "Ring, answer, status and hangup callbacks."), ("flow", "", "VoxML", "Say, Gather, Dial, Stream and more.")])
    chap = [("Get your keys", "Copy <em>two values.</em>", "Your Auth ID and Auth Token from the dashboard authenticate every request.", ["HTTP Basic auth", "Username = Auth ID", "Password = Auth Token"],
             pane("Dashboard · API keys", rows([("Auth ID", '<span class="mono">MA••••••••7Q</span>'), ("Auth Token", '<span class="mono">••••••••••••</span>'), ("Webhook secret", '<span class="pill">Set</span>')]), None)),
            ("Buy a number", "Pick a number <em>to call from.</em>", "Search and purchase a number in the dashboard or through the Numbers API.", ["Local, national, toll-free", "KYC online", "Ready in minutes"],
             pane("Numbers", rows([('<span class="mlcd" style="font-size:20px">+91 80 4718 2290</span>', '<span class="pill">Active</span>')]), None)),
            ("Place a call", "POST, <em>and it rings.</em>", "Send from, to and answer_url to the calls endpoint. You get 201 with status queued.", ["Bulk calls on the same endpoint", "ring_timeout and time_limit", "Returns a request_uuid"],
             pane("POST /calls", mono(CALL_RESP), None)),
            ("Handle webhooks", "Every stage, <em>in your inbox.</em>", "Receive ring, answer, status and hangup callbacks, signed with your webhook secret.", ["ring_url, answer_url, hangup_url", "status_callback_url", "Signed with webhook_secret"],
             pane("Webhook log", feed([("ev", "POST ring_url · 200"), ("ev ok", "POST answer_url · VoxML"), ("ev", "POST status_callback_url · 200"), ("ev", "POST hangup_url · 200")]), "Live"))]
    body += chapters("Quickstart", "Your first call in <em>four steps.</em>", chap, "#3D7BFF")
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
    def lg(s, n):
        if s in LOGOIMG:
            return f'<img src="/assets/logos/{s}.svg" alt="" width="{LOGOIMG[s][1]}" height="22">'
        return f'<em>{n}</em>'
    tiles = [(lg(s, n), n, "Setup guide", f"{DOCS}/ai-agents/{s}") for n, s in provs] + [(ICON["sip"], "Your SIP or carrier", "BYOC guide", f"{DOCS}/byoc")]
    body = wall
    body += tilegrid("Agent platforms", "Setup guides for <em>every provider.</em>", tiles)
    chap = [("Choose a provider", "Pick <em>your platform.</em>", "Open AI Agents in the dashboard and choose Vapi, Retell, ElevenLabs, LiveKit or Bolna.", ["Five providers today", "More on the way", "Any SIP stack via trunks"], pane("Providers", provgrid(), None)),
            ("Connect", "Number plus agent, <em>confirmed.</em>", "Choose an active TryVox number and an agent from your provider, then confirm.", ["One number binds to one agent", "No deployment", "No SIP configuration"], pane("Connect number", rows([("Number", '<span class="mlcd" style="font-size:20px">+91 80 4718 2290</span>'), ("Agent", "Collections · Riya"), ("Status", '<span class="pill">Connected</span>')]))),
            ("Answer", "Calls arrive <em>with context.</em>", "Inbound calls go straight to the agent with X-TryVox headers for direction, provider, caller and number.", ["Remove the binding to fall back", "Same events and recordings", "Outbound from agents: in progress"], pane("SIP headers", mono(SIP_HEADERS), "Live"))]
    body += chapters("How binding works", "Pick, connect, <em>answer.</em>", chap, "#C257F0")
    body += faq([("Which agent platforms work with TryVox?", "Vapi, Retell, ElevenLabs, LiveKit and Bolna, plus any standards-based SIP stack."),
                 ("Do I need to configure SIP for agent platforms?", "No. Binding a number to an agent needs no deployment or SIP configuration."),
                 ("Can agents call out through TryVox?", "Outbound calls from agents are still in progress. Inbound calls work today.")])
    return "Integrations | TryVox", "Connect TryVox numbers to Vapi, Retell, ElevenLabs, LiveKit and Bolna, or any SIP stack.", body

# ---------------------------------------------------------------- about / contact
def layer_diagram():
    agents = "".join(f'<span><img src="/assets/logos/{k}.svg" alt="{LOGOIMG[k][0]}" width="{LOGOIMG[k][1]}" height="16"></span>' for k in ["vapi", "retell", "livekit", "bolna"])
    return f'''<div class="ldia">
  <div class="ld-col"><p class="mlabel">Your agents</p><div class="ld-logos">{agents}<span><em>ElevenLabs</em></span></div></div>
  <div class="ld-wire" aria-hidden="true"><svg viewBox="0 0 120 40" preserveAspectRatio="none"><path d="M0 20H120"/></svg></div>
  <div class="ld-core"><svg viewBox="0 0 32 32" aria-hidden="true">{LOGO}</svg><b>TryVox</b><small>Numbers · SIP · Voice API · Messaging · Compliance</small></div>
  <div class="ld-wire" aria-hidden="true"><svg viewBox="0 0 120 40" preserveAspectRatio="none"><path d="M0 20H120"/></svg></div>
  <div class="ld-col"><p class="mlabel">Phone network</p><div class="ld-net"><span>{ICON["phone"]}Mobile</span><span>{ICON["globe"]}Landline</span><span>{ICON["chat"]}WhatsApp</span><span>{ICON["mail"]}SMS</span></div></div>
</div>'''

def page_about():
    body = xhero([("About", None)], "About TryVox", "globe", "We build the <em>phone layer</em> for voice AI.", "TryVox covers voice, SIP, SMS, WhatsApp and workflow automation for teams that need reliable communications in India and beyond.", layer_diagram(), "#9D61FF", secondary=("Contact us", "/contact/"))
    body += manifesto("Voice AI got good fast. Getting it onto a real phone line still meant carriers, KYC, SIP and paperwork. We built TryVox so any agent can get a number, take a call and report every event, without anyone building telephony from scratch.")
    big = [("We don't build agents", "We connect them", "TryVox is only the phone layer, so agent platforms and builders can run on us without feeding a competitor.", pane("Bindings", checks([("Vapi", "connected"), ("Retell", "connected"), ("LiveKit", "connected"), ("Bolna", "connected")]), None)),
           ("India-first", "Compliance built in", "KYC, consent, DLT and caller ID verification are product requirements, not afterthoughts.", pane("Readiness", checks([("Business KYC", "verified"), ("Consent", "recorded"), ("DLT", "linked")]), "Ready"))]
    small = [("code", "", "Developer control", "Voice, messaging, routing and webhooks as primitives."), ("eye", "", "Observable", "Events and records for every call and message."), ("bolt", "", "Fast to integrate", "Live in minutes, with docs that match the product.")]
    body += bento("What we believe", "Communications should be <em>easy to trust.</em>", big, small, "#9D61FF")
    body += bigstats("Infrastructure that <em>stays up.</em>")
    body += related("Start <em>building.</em>", [("bolt", "Products", "Numbers, SIP, Voice API, agents and messaging.", "/products/phone-numbers/"), ("code", "Developers", "Quickstart, code samples and docs.", "/developers/"), ("mail", "Contact", "Talk to the team at team@tryvox.io.", "/contact/")])
    return "About | TryVox", "TryVox builds telephony infrastructure for voice AI: numbers, SIP, voice APIs and messaging. Built in India by Tryjolt Solutions.", body

def compose():
    return f'''<div class="compose"><div class="mock-bar"><span class="dots"><i></i><i></i><i></i></span><span>New message</span></div>
<div class="cp-body"><div class="cp-row"><span>To</span><b>team@tryvox.io</b></div><div class="cp-row"><span>Subject</span><b>Rate card request</b></div>
<div class="cp-text"><span class="typed" data-type="Hi TryVox team, we run about 50,000 calls a month, 2.5 minutes on average, with a Vapi agent. Could you share a rate card for that volume?"></span><i class="caret"></i></div>
<div class="cp-foot"><a class="kbtn" href="mailto:team@tryvox.io?subject=Rate%20card%20request">Send email</a><span class="mlabel">Replies by email</span></div></div></div>'''

def page_contact():
    cards = [("mail", "Email the team", "Questions about TryVox, partnerships or anything else.", "mailto:team@tryvox.io", "team@tryvox.io"),
             ("rupee", "Get a rate card", "Tell us your monthly calls and average call length, and we'll share rates for your volume.", "mailto:team@tryvox.io?subject=Rate%20card%20request", "Request rates"),
             ("users", "Book a demo", "See numbers, agents and call events working together.", "mailto:team@tryvox.io?subject=Demo%20request", "Request a demo"),
             ("bolt", "Start free", "Create an account and get a number in minutes.", APP, "Open the dashboard"),
             ("doc", "Read the docs", "API reference, VoxML, numbers, SIP and agent guides.", f"{DOCS}/", "docs.tryvox.io"),
             ("code", "Developer hub", "Quickstart steps and code samples.", "/developers/", "Go to developers")]
    c = "".join(f'<a class="ccard rv" href="{h}">{ic(i)}<h3>{E(t)}</h3><p>{E(d)}</p><span class="go">{E(l)} →</span></a>' for i, t, d, h, l in cards)
    body = xhero([("Contact", None)], "Contact", "mail", "Talk to <em>the team.</em>", "Tell us what you're building and how many calls you run. We'll help you get your agent on the phone.", compose(), "#19B35A",
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
