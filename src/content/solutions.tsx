/* Ported from the original static site. Edit freely: this file is now the source of truth. */
import type { ReactNode } from "react";
import type { QA } from "./site";

export type Line = [kind: string, text: string];
export type Solution = {
  name: string; title: string; description: string; h1: ReactNode; h1Text: string; sub: string;
  call: Line[]; challenge: ReactNode; pains: [string, string][]; did: ReactNode[]; result: ReactNode;
  uses: { tag: string; heading: ReactNode; body: string; lines: Line[] }[];
  flow: [string, string][]; products: string[]; faq: QA[];
};

export const SOLUTION_PAGES: Record<string, Solution> = {
  "financial-services": {
    name: "Financial services",
    title: "AI Voice Calling for Banks, NBFCs and Fintech in India | TryVox",
    description: "Run EMI reminders, collections, KYC follow-ups and loan servicing with your AI agent on local Indian numbers, with consent records, call events and WhatsApp payment links built in.",
    h1: <>AI calling for{" "}<em>lenders and fintechs.</em></>,
    h1Text: "AI calling for lenders and fintechs.",
    sub: "Run EMI reminders, collections, KYC follow-ups and loan servicing with your AI agent on local Indian numbers, with consent records, call events and WhatsApp payment links built in.",
    call: [["ev", "Outbound · EMI due in 3 days"], ["a", "Hi, this is Riya from Acme Finance. Is this a good time?"], ["c", "Yes, go ahead."], ["a", "Your EMI of ₹4,250 is due on Friday. Shall I send a payment link on WhatsApp?"], ["ev ok", "Promise to pay · Friday · link sent"]],
    challenge: <>Collections calls that don't connect{" "}<em>cost you twice.</em></>,
    pains: [["Borrowers screen unknown numbers", "Reminders from an unfamiliar number go unanswered, so dues roll over."], ["Every call is regulated", "Consent, calling hours and records have to be right before a single reminder goes out."], ["Promises without follow-up", "A promise to pay means little without a payment link sent before the call ends."]],
    did: [
      <>Called from a local Bengaluru number{" "}<code>+91 80 4718 2290</code></>,
      "Checked consent before dialling",
      "Streamed audio to your Vapi agent",
      <>Posted the outcome to{" "}<code>status_callback_url</code></>,
      <>Sent WhatsApp template{" "}<code>payment_reminder</code></>
    ],
    result: "Promise to pay logged and payment link delivered.",
    uses: [
      { tag: "EMI reminders", heading: <>Remind borrowers{" "}<em>before the due date.</em></>, body: "Call ahead of every EMI from a local number, log promises to pay and send the link on WhatsApp in the same flow.", lines: [["ev", "Outbound · EMI due in 3 days"], ["a", "Your EMI of ₹4,250 is due on Friday."], ["c", "I'll pay on Friday."], ["ev ok", "Promise to pay logged"]] },
      { tag: "KYC follow-ups", heading: <>Finish KYC{" "}<em>without the chase.</em></>, body: "Call customers with pending KYC, explain what's missing and send an upload link while they're still on the line.", lines: [["ev", "Outbound · KYC pending"], ["a", "We still need your address proof to finish KYC."], ["c", "Can you send me the link?"], ["ev ok", "Upload link sent on WhatsApp"]] },
      { tag: "Loan servicing", heading: <>Answer servicing calls{" "}<em>any hour.</em></>, body: "Let your agent handle balance, schedule and foreclosure questions on a dedicated line, with a person one transfer away.", lines: [["ev", "Inbound · servicing line"], ["c", "What's my outstanding balance?"], ["a", "It's ₹1,12,400 with 26 EMIs left."], ["ev", "Transfer offered · Dial"]] }
    ],
    flow: [["Trigger", "EMI due in 3 days"], ["Call", "Agent calls from a local number"], ["Outcome", "Promise to pay: Friday"], ["Follow-up", "WhatsApp payment link sent"]],
    products: ["phone-numbers", "ai-agents", "messaging"],
    faq: [["Can collection calls come from a local number?", "Yes. Buy local numbers per region and use verified caller IDs so borrowers recognise the call."], ["How does TryVox handle consent for financial calls?", "Store consent per contact in TryVox and respect withdrawals before your agent dials."], ["Can a human take over a collections call?", "Yes. Bring a person into the call with Dial or a conference."], ["Can I send a payment link after the call?", "Yes. Send a WhatsApp or SMS template from the same account when the call ends."]],
  },
  "healthcare": {
    name: "Healthcare",
    title: "AI Phone Agents for Clinics and Hospitals in India | TryVox",
    description: "Let your AI agent answer patient calls on each clinic's own number, book and move appointments, and send reminders, while staff handle the cases that need a person.",
    h1: <>Patient calls answered{" "}<em>on the first ring.</em></>,
    h1Text: "Patient calls answered on the first ring.",
    sub: "Let your AI agent answer patient calls on each clinic's own number, book and move appointments, and send reminders, while staff handle the cases that need a person.",
    call: [["ev", "Inbound · Indiranagar clinic"], ["c", "Hi, I'd like to move my appointment."], ["a", "Sure. I have Thursday at 4 PM or Friday at 11 AM."], ["c", "Thursday works."], ["ev ok", "Booked · Thursday 4 PM · SMS reminder set"]],
    challenge: <>Every missed call is{" "}<em>a missed appointment.</em></>,
    pains: [["Front desks are overloaded", "Staff juggle walk-ins and phones, so calls ring out during the busiest hours."], ["No-shows cost revenue", "Without reminders, booked slots go empty and waiting lists grow."], ["After-hours calls go nowhere", "Patients who call at night get voicemail and book elsewhere."]],
    did: [
      <>Answered on the clinic's local number{" "}<code>+91 80 4718 2290</code></>,
      "Routed the call to your Retell agent",
      <>Sent the booking to your system via{" "}<code>status_callback_url</code></>,
      "Scheduled an SMS reminder for the day before"
    ],
    result: "Appointment booked and reminder scheduled.",
    uses: [
      { tag: "Inbound booking", heading: <>Every clinic,{" "}<em>its own number.</em></>, body: "Give each location a local number bound to your agent, so patients always reach the right clinic.", lines: [["ev", "Inbound · Indiranagar clinic"], ["c", "Do you have a slot tomorrow?"], ["a", "Yes, 10:30 AM with Dr. Rao."], ["ev ok", "Booked · 10:30 AM"]] },
      { tag: "Rescheduling", heading: <>Move appointments{" "}<em>any hour.</em></>, body: "Patients reschedule by phone at night or on weekends, and the slot opens up for someone else.", lines: [["ev", "Inbound · 9:40 PM"], ["c", "I need to move Monday's visit."], ["a", "I can do Wednesday at 5 PM."], ["ev ok", "Rescheduled · Wednesday 5 PM"]] },
      { tag: "Reminders", heading: <>Fewer no-shows{" "}<em>with reminders.</em></>, body: "Send SMS or WhatsApp reminders before every visit from the same account.", lines: [["ev", "24 hours before visit"], ["ev ok", "SMS · appointment_confirm · delivered"], ["c", "CONFIRM"], ["ev ok", "Visit confirmed"]] }
    ],
    flow: [["Inbound", "Patient calls the clinic"], ["Agent", "Checks open slots"], ["Booked", "Thursday, 4 PM"], ["Reminder", "SMS 24 hours before"]],
    products: ["phone-numbers", "ai-agents", "messaging"],
    faq: [["Can each clinic have its own phone number?", "Yes. Buy a local number per clinic and bind each to an agent."], ["Can staff take over a patient call?", "Yes. Transfer to a person with Dial."], ["Can I send appointment reminders?", "Yes. Send SMS or WhatsApp from the same account."], ["Does the agent answer after hours?", "Yes. A bound number reaches your agent 24/7."]],
  },
  "ecommerce": {
    name: "E-commerce",
    title: "AI Calling for E-commerce: COD Confirmation and Order Support | TryVox",
    description: "Confirm cash-on-delivery orders, recover abandoned carts and answer where-is-my-order calls with your AI agent, even on your biggest sale days.",
    h1: <>Confirm COD orders{" "}<em>before they ship.</em></>,
    h1Text: "Confirm COD orders before they ship.",
    sub: "Confirm cash-on-delivery orders, recover abandoned carts and answer where-is-my-order calls with your AI agent, even on your biggest sale days.",
    call: [["ev", "Outbound · COD order 48213"], ["a", "Hi! Calling to confirm your order of ₹1,899. Press 1 to confirm."], ["ev", "dtmf · 1"], ["a", "Thanks, your order ships tomorrow."], ["ev ok", "Order released to ship"]],
    challenge: <>Unconfirmed COD orders{" "}<em>come back as RTO.</em></>,
    pains: [["Fake and impulse COD orders", "Orders nobody confirmed turn into return-to-origin costs and lost inventory time."], ["Sale-day spikes", "Support lines can't scale when order volume jumps tenfold overnight."], ["Abandoned carts go cold", "Shoppers who left items behind rarely come back without a nudge."]],
    did: [
      "Placed the call in bulk via the Voice API",
      <>Collected the keypress with VoxML{" "}<code>Gather</code></>,
      <>Posted{" "}<code>confirmed</code>{" "}to your order system</>,
      "Sent a WhatsApp order summary"
    ],
    result: "Order released to ship.",
    uses: [
      { tag: "COD confirmation", heading: <>Cut RTO with{" "}<em>one call.</em></>, body: "Call every cash-on-delivery order and confirm with a keypress before it leaves the warehouse.", lines: [["ev", "Outbound · COD order 48213"], ["a", "Press 1 to confirm your ₹1,899 order."], ["ev", "dtmf · 1"], ["ev ok", "Released to ship"]] },
      { tag: "Cart recovery", heading: <>Bring shoppers{" "}<em>back to checkout.</em></>, body: "Call shoppers who left items behind, answer their questions and send a checkout link.", lines: [["ev", "Outbound · cart left 2h ago"], ["a", "Your sneakers are still in your cart."], ["c", "Is there a size 9?"], ["ev ok", "Size 9 reserved · link sent"]] },
      { tag: "Order status", heading: <>Answer{" "}<em>where-is-my-order</em>{" "}instantly.</>, body: "Let your agent answer order status calls on a toll-free line, so your team handles the exceptions.", lines: [["ev", "Inbound · support line"], ["c", "Where is my order?"], ["a", "It's out for delivery and arrives by 6 PM."], ["ev ok", "Resolved on the call"]] }
    ],
    flow: [["Trigger", "COD order placed"], ["Call", "Agent confirms the order"], ["Keypad", "Customer presses 1"], ["Outcome", "Order released to ship"]],
    products: ["voice-api", "ai-agents", "messaging"],
    faq: [["Can customers confirm an order with a keypress?", "Yes. Collect input with VoxML Gather."], ["Can I place confirmation calls in bulk?", "Yes. The calls endpoint accepts a list of calls."], ["Can I follow up on WhatsApp?", "Yes, from the same account."], ["Will it scale on sale days?", "Calls run on TryVox infrastructure with 99.9% platform uptime. Talk to us before big events so we can plan capacity with you."]],
  },
  "logistics": {
    name: "Logistics",
    title: "AI Calling for Logistics and Last-Mile Delivery | TryVox",
    description: "Confirm delivery slots, reschedule in one call and keep drivers and customers in sync, with every outcome pushed to your systems by webhook.",
    h1: <>Delivery calls that{" "}<em>reach the doorstep.</em></>,
    h1Text: "Delivery calls that reach the doorstep.",
    sub: "Confirm delivery slots, reschedule in one call and keep drivers and customers in sync, with every outcome pushed to your systems by webhook.",
    call: [["ev", "Outbound · out for delivery"], ["a", "Hi, your package arrives today. Is 2 to 4 PM okay?"], ["c", "Can you come after 6?"], ["a", "Done. I've moved it to 6 PM and told the driver."], ["ev ok", "Slot updated · driver app synced"]],
    challenge: <>Failed deliveries{" "}<em>start with a missed call.</em></>,
    pains: [["Customers aren't home", "Without a slot confirmation, drivers arrive at locked doors and try again tomorrow."], ["Changes don't reach drivers", "A new time agreed on the phone often never makes it to the driver app."], ["Ops teams drown in calls", "Dispatch spends its day on status calls instead of exceptions."]],
    did: [
      "Called from a local number before dispatch",
      "Agent agreed a new slot with the customer",
      <>Sent the outcome to{" "}<code>hangup_url</code></>,
      "Your TMS updated the driver app"
    ],
    result: "Delivery rescheduled to 6 PM. Driver informed.",
    uses: [
      { tag: "Slot confirmation", heading: <>Confirm the window{" "}<em>before dispatch.</em></>, body: "Call ahead of every delivery so drivers only go where someone is home.", lines: [["ev", "Outbound · before dispatch"], ["a", "Is 2 to 4 PM okay for delivery?"], ["c", "Yes, that works."], ["ev ok", "Slot confirmed"]] },
      { tag: "Rescheduling", heading: <>Move a delivery{" "}<em>in one call.</em></>, body: "Customers change the slot on the phone and the new time flows straight to your systems.", lines: [["ev", "Outbound · out for delivery"], ["c", "I won't be home until 6."], ["a", "Moved to 6 PM."], ["ev ok", "Driver app updated"]] },
      { tag: "Status updates", heading: <>Outcomes{" "}<em>in your systems.</em></>, body: "Status and hangup callbacks push every result to your TMS or order system.", lines: [["ev", "hangup_url · call record"], ["ev ok", "Order 7731 · slot 18:00"], ["ev", "status_callback_url · completed"], ["ev ok", "TMS updated"]] }
    ],
    flow: [["Trigger", "Out for delivery"], ["Call", "Agent confirms the slot"], ["Change", "Customer asks for 6 PM"], ["Update", "Driver app updated"]],
    products: ["voice-api", "phone-numbers", "ai-agents"],
    faq: [["Can call outcomes update my delivery systems?", "Yes. Use status and hangup callbacks to update orders and driver apps."], ["Can I connect a driver to the customer?", "Yes. Bring a driver into the call with Dial or a conference."], ["Can I use a toll-free number for support?", "Yes, for inbound support lines."], ["Can I call in bulk before dispatch?", "Yes. The calls endpoint accepts a list of calls."]],
  },
  "real-estate": {
    name: "Real estate",
    title: "AI Calling for Real Estate Leads and Site Visits | TryVox",
    description: "Call new property leads the moment they land, qualify budget and location, and book site visits while interest is high, from a local number buyers trust.",
    h1: <>Call every lead back{" "}<em>in minutes.</em></>,
    h1Text: "Call every lead back in minutes.",
    sub: "Call new property leads the moment they land, qualify budget and location, and book site visits while interest is high, from a local number buyers trust.",
    call: [["ev", "Outbound · new lead · 10:03"], ["a", "Hi, you asked about 2BHK homes in Whitefield. What's your budget?"], ["c", "Around 90 lakh."], ["a", "I can book a site visit on Sunday at 11. Works?"], ["ev ok", "Site visit booked · Sunday 11 AM"]],
    challenge: <>Leads go cold{" "}<em>while they wait.</em></>,
    pains: [["Slow callbacks lose buyers", "Portal leads enquire with several builders. The first to call usually wins the visit."], ["Sales teams can't keep up", "Weekend and late-night enquiries sit until Monday morning."], ["Unqualified visits waste time", "Site visits without budget and timeline checks burn your team's weekend."]],
    did: [
      "Called the lead within a minute of the enquiry",
      "Used a local Bengaluru caller ID",
      "Captured budget and timeline in your CRM via webhook",
      "Sent the site location on WhatsApp"
    ],
    result: "Qualified lead with a site visit booked.",
    uses: [
      { tag: "Instant callback", heading: <>Be the{" "}<em>first builder to call.</em></>, body: "Trigger a call the moment a portal or website form comes in, any time of day.", lines: [["ev", "Lead · portal form · 10:02"], ["ev ok", "Outbound call · 10:03"], ["a", "Thanks for your enquiry about Whitefield."], ["c", "Yes, I'm interested."]] },
      { tag: "Qualification", heading: <>Know the budget{" "}<em>before the visit.</em></>, body: "Your agent captures budget, location and timeline and pushes them to your CRM.", lines: [["a", "What budget are you looking at?"], ["c", "Around 90 lakh."], ["a", "And when do you plan to move?"], ["ev ok", "Qualified · 90L · 3 months"]] },
      { tag: "Site visits", heading: <>Book the visit{" "}<em>on the call.</em></>, body: "Lock in a site visit while interest is high and send the location by WhatsApp.", lines: [["a", "Sunday at 11 for a site visit?"], ["c", "Yes."], ["ev ok", "Visit booked · Sunday 11 AM"], ["ev", "WhatsApp · location sent"]] }
    ],
    flow: [["Lead", "Form filled on a portal"], ["Call", "Agent calls back in a minute"], ["Qualify", "Budget and location"], ["Booked", "Site visit on Sunday"]],
    products: ["phone-numbers", "ai-agents", "messaging"],
    faq: [["How quickly can the agent call a new lead?", "As soon as your system triggers the call through the Voice API or your agent platform."], ["Can calls come from a local number?", "Yes. Use a local number per city."], ["Can my sales team take over?", "Yes. Transfer to a person when the lead is ready."], ["Can I send a confirmation after the call?", "Yes. Send WhatsApp or SMS from the same account."]],
  },
  "travel-hospitality": {
    name: "Travel & hospitality",
    title: "AI Phone Agents for Hotels and Travel Companies | TryVox",
    description: "Handle booking changes, check-in questions and confirmations at any hour on local or toll-free lines, with SMS and WhatsApp confirmations from the same account.",
    h1: <>Guest calls answered{" "}<em>around the clock.</em></>,
    h1Text: "Guest calls answered around the clock.",
    sub: "Handle booking changes, check-in questions and confirmations at any hour on local or toll-free lines, with SMS and WhatsApp confirmations from the same account.",
    call: [["ev", "Inbound · toll-free · 11:40 PM"], ["c", "Can I get a late check-out tomorrow?"], ["a", "Yes, I can extend it to 1 PM for your room."], ["c", "Perfect."], ["ev ok", "Late check-out added · SMS sent"]],
    challenge: <>Guests call at every hour.{" "}<em>Your desk can't.</em></>,
    pains: [["Night calls go unanswered", "Travellers in other time zones call when your reservations team is offline."], ["Peak seasons overflow", "Holiday weeks bring more calls than any desk can staff for."], ["Changes need confirming", "A booking change without a written confirmation leads to disputes at check-in."]],
    did: [
      "Answered on your toll-free line",
      "Routed to your ElevenLabs agent",
      "Updated the booking through your webhook",
      <>Sent a WhatsApp{" "}<code>booking_confirm</code></>
    ],
    result: "Booking changed and confirmation delivered.",
    uses: [
      { tag: "24/7 lines", heading: <>Every call answered,{" "}<em>any hour.</em></>, body: "Your agent picks up at 2 AM the same way it does at noon.", lines: [["ev", "Inbound · 2:14 AM"], ["c", "Is the airport shuttle running?"], ["a", "Yes, every 30 minutes from 5 AM."], ["ev ok", "Resolved"]] },
      { tag: "Toll-free numbers", heading: <>A free number{" "}<em>for every guest.</em></>, body: "Give guests a toll-free line for bookings, changes and questions.", lines: [["ev", "Inbound · 1800 line"], ["c", "I need to change my booking dates."], ["a", "Moved to the 14th to the 16th."], ["ev ok", "Booking updated"]] },
      { tag: "Confirmations", heading: <>Confirm every change{" "}<em>in writing.</em></>, body: "Send SMS or WhatsApp confirmations the moment a booking changes.", lines: [["ev ok", "Booking updated"], ["ev", "WhatsApp · booking_confirm"], ["ev ok", "Delivered · read"], ["c", "Got it, thanks!"]] }
    ],
    flow: [["Inbound", "Guest calls the hotel"], ["Agent", "Finds the booking"], ["Change", "Late check-out added"], ["Confirm", "SMS sent to guest"]],
    products: ["phone-numbers", "ai-agents", "messaging"],
    faq: [["Can I offer guests a toll-free number?", "Yes. Buy toll-free numbers for inbound lines."], ["Can staff take over a call?", "Yes. Transfer to a person when needed."], ["Can I confirm bookings by message?", "Yes, by SMS or WhatsApp from the same account."], ["Does the agent work at night?", "Yes. Calls to a bound number reach your agent 24/7."]],
  }
};
