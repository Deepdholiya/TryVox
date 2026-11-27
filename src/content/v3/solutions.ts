/* Solution (industry) page content. [square brackets] in h1 mark highlighted words. */

export type Line = [who: "ev" | "ok" | "a" | "c", text: string];
export type Use = { path: string; tag: string; title: string; body: string; points: string[] };
export type Solution = {
  name: string; title: string; description: string;
  label: string; meta: string; chip: string; h1: string; lead: string;
  call: { path: string; right: string; lines: Line[] };
  pains: [string, string][];
  uses: Use[];
  flow: [string, string][];
  products: string[];
  faq: [string, string][];
};

export const SOLUTION_PAGES: Record<string, Solution> = {
  "financial-services": {
    name: "Financial services",
    title: "AI Voice Calling for Banks, NBFCs and Fintech in India | TryVox",
    description: "Run EMI reminders, collections, KYC follow-ups and loan servicing with your AI agent on local Indian numbers, with consent records, call events and WhatsApp payment links built in.",
    label: "Financial services", meta: "Banks · NBFCs · Fintech",
    chip: "Consent checked before every call",
    h1: "AI calling for [lenders and fintechs].",
    lead: "Run EMI reminders, collections, KYC follow-ups and loan servicing with your AI agent on local Indian numbers, with consent records and WhatsApp payment links built in.",
    call: {
      path: "call / emi-reminder", right: "Outbound",
      lines: [["ev", "EMI due in 3 days · local number"], ["a", "Hi, this is Riya from Acme Finance. Is this a good time?"], ["c", "Yes, go ahead."], ["a", "Your EMI of ₹4,250 is due on Friday. Shall I send a payment link on WhatsApp?"], ["ok", "Promise to pay · Friday · link sent"]],
    },
    pains: [
      ["Borrowers screen unknown numbers", "Reminders from an unfamiliar number go unanswered, so dues roll over."],
      ["Every call is regulated", "Consent, calling hours and records have to be right before a single reminder goes out."],
      ["Promises without follow-up", "A promise to pay means little without a payment link before the call ends."],
    ],
    uses: [
      { path: "use / emi-reminders", tag: "EMI reminders", title: "Remind borrowers before the due date", body: "Call ahead of every EMI from a local number, log promises to pay and send the link on WhatsApp in the same flow.", points: ["Local caller ID", "Promise to pay logged", "WhatsApp payment link"] },
      { path: "use / kyc-follow-ups", tag: "KYC follow-ups", title: "Finish KYC without the chase", body: "Call customers with pending KYC, explain what's missing and send an upload link while they're still on the line.", points: ["Pending list as a campaign", "Upload link mid-call", "Outcome by webhook"] },
      { path: "use / loan-servicing", tag: "Loan servicing", title: "Answer servicing calls at any hour", body: "Let your agent handle balance, schedule and foreclosure questions on a dedicated line, with a person one transfer away.", points: ["Dedicated inbound line", "Transfer to a person", "Call records kept"] },
    ],
    flow: [["Trigger", "EMI due in 3 days"], ["Call", "Agent calls from a local number"], ["Outcome", "Promise to pay: Friday"], ["Follow-up", "WhatsApp payment link sent"]],
    products: ["phone-numbers", "compliance", "campaign-manager", "whatsapp"],
    faq: [
      ["Can collection calls come from a local number?", "Yes. Buy local numbers by region and use verified caller IDs so borrowers recognise the call."],
      ["How is consent handled?", "Store consent per contact in TryVox and respect withdrawals before your agent dials."],
      ["Can a person take over a call?", "Yes. Bring a person in with Dial or a conference, or hand the call to a browser endpoint."],
      ["Can I send a payment link after the call?", "Yes. Send a WhatsApp or SMS template from the same account when the call ends."],
    ],
  },

  healthcare: {
    name: "Healthcare",
    title: "AI Phone Agents for Clinics and Hospitals in India | TryVox",
    description: "Let your AI agent answer patient calls on each clinic's own number, book and move appointments, and send reminders, while staff handle the cases that need a person.",
    label: "Healthcare", meta: "Clinics · Hospitals · Diagnostics",
    chip: "One number per clinic",
    h1: "Every patient call [answered], day or night.",
    lead: "Let your AI agent answer patient calls on each clinic's own number, book and move appointments and send reminders, while staff handle the cases that need a person.",
    call: {
      path: "call / appointment", right: "Inbound",
      lines: [["ev", "Inbound · Indiranagar clinic line"], ["c", "I need to move my appointment with Dr. Rao."], ["a", "Sure. Thursday at 11 or Friday at 4. Which works?"], ["c", "Friday at 4."], ["ok", "Rescheduled · SMS confirmation sent"]],
    },
    pains: [
      ["Front desks miss calls", "At peak hours the phone rings out, and patients book somewhere else."],
      ["No-shows cost slots", "Without reminders, empty chairs show up only when it's too late to refill them."],
      ["Some calls need a person", "Urgent or sensitive calls have to reach staff fast, with context."],
    ],
    uses: [
      { path: "use / booking", tag: "Booking", title: "Book and move appointments", body: "Your agent answers on each clinic's own number, checks your scheduler and confirms by SMS or WhatsApp.", points: ["Number per clinic", "Works with your scheduler", "Confirmation message"] },
      { path: "use / reminders", tag: "Reminders", title: "Reminders that cut no-shows", body: "Call or message patients ahead of their visit and free the slot if they cancel.", points: ["Call or WhatsApp", "Cancel or confirm", "Slot freed by webhook"] },
      { path: "use / handoff", tag: "Handoff", title: "Staff take what needs a person", body: "Transfer urgent or sensitive calls to staff in a browser tab, with what the agent already learned.", points: ["Warm transfer", "Context passed", "Browser or phone"] },
    ],
    flow: [["Trigger", "Patient calls clinic line"], ["Call", "Agent checks open slots"], ["Outcome", "Moved to Friday 4 pm"], ["Follow-up", "SMS confirmation sent"]],
    products: ["phone-numbers", "ai-agents", "webrtc", "sms-rcs"],
    faq: [
      ["Can each clinic have its own number?", "Yes. Buy a local number per clinic and bind each one to the right agent."],
      ["Can the agent hand a call to staff?", "Yes. Transfer a live call to a browser endpoint or a phone, with context."],
      ["Can we send reminders by WhatsApp?", "Yes. WhatsApp and SMS run on the same account as your numbers."],
      ["Do you store medical records?", "No. TryVox carries the call and its events. Your agent and your systems hold patient data."],
    ],
  },

  ecommerce: {
    name: "E-commerce",
    title: "AI Calling for E-commerce: COD Confirmation and Order Support | TryVox",
    description: "Confirm cash-on-delivery orders, recover abandoned carts and answer where-is-my-order calls with your AI agent, even on your biggest sale days.",
    label: "E-commerce", meta: "D2C · Marketplaces · Quick commerce",
    chip: "Built for sale-day volume",
    h1: "Confirm COD orders [before they ship].",
    lead: "Confirm cash-on-delivery orders, recover abandoned carts and answer where-is-my-order calls with your AI agent, even on your biggest sale days.",
    call: {
      path: "call / cod-confirm", right: "Outbound",
      lines: [["ev", "COD order #48213 · ₹1,299"], ["a", "Namaste! Calling from Kirana Box about your COD order. Shall we deliver tomorrow evening?"], ["c", "Haan, kal shaam ko bhej do."], ["a", "Done. I've sent the slot to your WhatsApp."], ["ok", "Confirmed · slot sent · status_callback 200"]],
    },
    pains: [
      ["COD returns eat margin", "Unconfirmed cash orders get refused at the door and shipped back at your cost."],
      ["Sale days flood the lines", "Order volume spikes overnight, and so do the calls."],
      ["Carts go cold fast", "A reminder an hour later converts better than one the next day."],
    ],
    uses: [
      { path: "use / cod", tag: "COD confirmation", title: "Confirm before you ship", body: "Call every COD order, confirm the address and slot, and send the details on WhatsApp.", points: ["Call on order webhook", "Address and slot confirmed", "WhatsApp follow-up"] },
      { path: "use / carts", tag: "Abandoned carts", title: "Win back carts while they're warm", body: "Call or message shoppers who left items behind, with a link straight back to checkout.", points: ["Consent checked", "Checkout link", "Outcome per contact"] },
      { path: "use / wismo", tag: "Order support", title: "Answer where-is-my-order", body: "Let your agent look up the order and answer on your support number, at any hour.", points: ["Toll-free or local", "Order lookup", "Transfer to a person"] },
    ],
    flow: [["Trigger", "New COD order"], ["Call", "Agent confirms address"], ["Outcome", "Delivery tomorrow evening"], ["Follow-up", "Slot sent on WhatsApp"]],
    products: ["phone-numbers", "voice-api", "campaign-manager", "whatsapp"],
    faq: [
      ["Can calls start from my order webhook?", "Yes. Place a call with the Voice API when an order comes in, and get the outcome back by webhook."],
      ["Will it hold up on sale days?", "Calls are billed per minute with no lock-in. Share your expected volume and we'll size channels and numbers with you."],
      ["Can we follow up on WhatsApp?", "Yes. Send a template the moment the call ends, from the same account."],
      ["Which agent platforms can we use?", "Vapi, Retell, ElevenLabs, LiveKit, Bolna or your own code."],
    ],
  },

  logistics: {
    name: "Logistics",
    title: "AI Calling for Logistics and Last-Mile Delivery | TryVox",
    description: "Confirm delivery slots, reschedule in one call and keep drivers and customers in sync, with every outcome pushed to your systems by webhook.",
    label: "Logistics", meta: "Last mile · 3PL · Fleets",
    chip: "Outcomes pushed by webhook",
    h1: "Fewer failed deliveries, [one call earlier].",
    lead: "Confirm delivery slots, reschedule in one call and keep drivers and customers in sync, with every outcome pushed to your systems by webhook.",
    call: {
      path: "call / delivery-slot", right: "Outbound",
      lines: [["ev", "Shipment out for delivery today"], ["a", "Your parcel arrives today. Will someone be home between 2 and 5?"], ["c", "No, tomorrow morning is better."], ["a", "Moved to tomorrow, 9 to 12."], ["ok", "Rescheduled · driver app updated"]],
    },
    pains: [
      ["Nobody home", "A wasted trip costs fuel, time and a second attempt."],
      ["Drivers can't call everyone", "Confirmation calls take time drivers don't have."],
      ["Status lives in silos", "What the customer said has to reach the dispatch system right away."],
    ],
    uses: [
      { path: "use / slots", tag: "Slot confirmation", title: "Confirm before the van leaves", body: "Call customers on the morning of delivery and confirm or move the slot.", points: ["Local caller ID", "Reschedule in one call", "Webhook to dispatch"] },
      { path: "use / reschedule", tag: "Reschedule", title: "Move it in one call", body: "When a delivery fails, the agent calls back and books the next attempt.", points: ["Triggered by status", "Next slot booked", "SMS confirmation"] },
      { path: "use / inbound", tag: "Inbound", title: "Answer where-is-my-parcel", body: "Customers call one number, and the agent answers with live status.", points: ["Tracking lookup", "Toll-free option", "Transfer to support"] },
    ],
    flow: [["Trigger", "Out for delivery"], ["Call", "Agent confirms the slot"], ["Outcome", "Moved to tomorrow 9–12"], ["Follow-up", "Dispatch updated by webhook"]],
    products: ["phone-numbers", "voice-api", "sms-rcs", "campaign-manager"],
    faq: [
      ["Can call outcomes update our systems?", "Yes. Every call stage posts to your webhooks, so dispatch gets the new slot right away."],
      ["Can we call from a local number per city?", "Yes. Buy local numbers by city and route each to the right agent."],
      ["Can customers call us back?", "Yes. Inbound calls to the same numbers reach your agent or your team."],
      ["Can we send an SMS after the call?", "Yes. DLT-ready SMS and WhatsApp run on the same account."],
    ],
  },

  "real-estate": {
    name: "Real estate",
    title: "AI Calling for Real Estate Leads and Site Visits | TryVox",
    description: "Call new property leads the moment they land, qualify budget and location, and book site visits while interest is high, from a local number buyers trust.",
    label: "Real estate", meta: "Developers · Brokers · Portals",
    chip: "Call leads within a minute",
    h1: "Call every lead [while it's hot].",
    lead: "Call new property leads the moment they land, qualify budget and location, and book site visits while interest is high, from a local number buyers trust.",
    call: {
      path: "call / new-lead", right: "Outbound",
      lines: [["ev", "New lead · 2BHK · Whitefield"], ["a", "Hi! You asked about 2BHK homes in Whitefield. What's your budget?"], ["c", "Around 90 lakhs."], ["a", "We have two options. Would Saturday at 11 suit a site visit?"], ["ok", "Site visit booked · location sent on WhatsApp"]],
    },
    pains: [
      ["Leads cool in minutes", "The first developer to call usually gets the visit."],
      ["Sales teams can't keep up", "Portal leads arrive at all hours, faster than people can call."],
      ["Unknown numbers get ignored", "Buyers screen calls from numbers they don't recognise."],
    ],
    uses: [
      { path: "use / speed-to-lead", tag: "Speed to lead", title: "Call before anyone else does", body: "Trigger a call the moment a lead lands from your form or portal.", points: ["Call on lead webhook", "Local caller ID", "Any hour"] },
      { path: "use / qualify", tag: "Qualify", title: "Budget, location, timeline", body: "Your agent asks the questions your team would, and passes qualified buyers on.", points: ["Answers to your CRM", "Hot leads transferred", "Call records kept"] },
      { path: "use / visits", tag: "Site visits", title: "Book the visit on the call", body: "Offer slots, confirm the visit and send the location on WhatsApp.", points: ["Slot booked", "Location on WhatsApp", "Reminder before the visit"] },
    ],
    flow: [["Trigger", "New lead from portal"], ["Call", "Agent calls in under a minute"], ["Outcome", "Site visit: Saturday 11"], ["Follow-up", "Location sent on WhatsApp"]],
    products: ["phone-numbers", "number-reputation", "campaign-manager", "whatsapp"],
    faq: [
      ["How fast can a lead be called?", "As soon as your system places the call. Trigger it from the lead webhook with the Voice API."],
      ["Can a hot lead reach a salesperson?", "Yes. Transfer the live call to a person with Dial or a browser endpoint."],
      ["Will buyers recognise the number?", "Use local numbers with your verified business name on caller ID."],
      ["Can we send the site location?", "Yes. Send it on WhatsApp from the same account when the call ends."],
    ],
  },

  "travel-hospitality": {
    name: "Travel & hospitality",
    title: "AI Phone Agents for Hotels and Travel Companies | TryVox",
    description: "Handle booking changes, check-in questions and confirmations at any hour on local or toll-free lines, with SMS and WhatsApp confirmations from the same account.",
    label: "Travel & hospitality", meta: "Hotels · OTAs · Tour operators",
    chip: "Local or toll-free lines",
    h1: "A front desk that [never sleeps].",
    lead: "Handle booking changes, check-in questions and confirmations at any hour on local or toll-free lines, with SMS and WhatsApp confirmations from the same account.",
    call: {
      path: "call / booking-change", right: "Inbound",
      lines: [["ev", "Inbound · toll-free reservations"], ["c", "Can I push my check-in to Sunday?"], ["a", "Yes, a deluxe room is free Sunday to Tuesday. Shall I move it?"], ["c", "Please do."], ["ok", "Booking moved · WhatsApp confirmation sent"]],
    },
    pains: [
      ["Guests call at all hours", "Time zones and late flights mean calls arrive when the desk is closed."],
      ["Simple changes tie up staff", "Most calls are dates, times and directions."],
      ["Confirmations get lost", "A change agreed on the phone needs to land in writing."],
    ],
    uses: [
      { path: "use / changes", tag: "Booking changes", title: "Change dates on the call", body: "Your agent checks availability and moves the booking, then confirms in writing.", points: ["Toll-free or local", "Availability lookup", "Written confirmation"] },
      { path: "use / pre-arrival", tag: "Pre-arrival", title: "Confirm before guests travel", body: "Call or message guests before arrival with check-in times and directions.", points: ["Outbound reminders", "Directions on WhatsApp", "Changes by webhook"] },
      { path: "use / concierge", tag: "Concierge", title: "Answer the usual questions", body: "Wi-Fi, breakfast, parking and transfers, answered at any hour, with staff one transfer away.", points: ["24/7 line", "Transfer to staff", "Call records"] },
    ],
    flow: [["Trigger", "Guest calls reservations"], ["Call", "Agent checks availability"], ["Outcome", "Moved to Sunday–Tuesday"], ["Follow-up", "WhatsApp confirmation"]],
    products: ["phone-numbers", "ai-agents", "whatsapp", "sms-rcs"],
    faq: [
      ["Can we run a toll-free reservations line?", "Yes. Buy a toll-free number and bind it to your agent."],
      ["Can each property have its own number?", "Yes. Buy local numbers per property and route each to the right agent."],
      ["Can confirmations go out on WhatsApp?", "Yes. WhatsApp and SMS run on the same account as your numbers."],
      ["Can a call reach staff?", "Yes. Transfer a live call to staff on a phone or in a browser tab."],
    ],
  },
};
