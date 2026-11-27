/* Extra product page sections: how it works, where it is used, and what it works with.
   Steps only restate what the product pages already describe. */
export type ProductExtra = { how: [string, string][]; uses: string[]; works: string[] };

export const PRODUCT_EXTRA: Record<string, ProductExtra> = {
  "phone-numbers": {
    how: [["Search", "Find local, national or toll-free numbers by city or series, in the dashboard or the Numbers API."], ["Verify once", "Finish business KYC online. Every number on the account goes live when it clears."], ["Route", "Point the number at your agent, a SIP trunk or an answer_url, and change it any time."]],
    uses: ["ecommerce", "financial-services", "healthcare"],
    works: ["vapi", "retell", "elevenlabs", "livekit", "bolna"],
  },
  "number-reputation": {
    how: [["Verify your name", "Each number is tied to your verified business, so people see who is calling."], ["Watch every number", "TryVox tracks how each number is answered, rejected or cut short."], ["Rest and rotate", "Numbers that hit their limit or start getting rejected step aside for healthy ones."]],
    uses: ["financial-services", "real-estate", "ecommerce"],
    works: ["vapi", "retell", "livekit", "bolna"],
  },
  compliance: {
    how: [["KYC", "Upload business documents once. The check covers every number on the account."], ["Consent and DLT", "Keep consent next to the contacts you dial, and link your DLT entity, headers and templates."], ["Verified caller ID", "Calls and messages go out under your verified business."]],
    uses: ["financial-services", "healthcare", "real-estate"],
    works: ["vapi", "retell", "elevenlabs", "livekit", "bolna"],
  },
  "sip-trunking": {
    how: [["Create a trunk", "Create an inbound or outbound trunk from the dashboard or the API."], ["Lock it down", "Use credentials, IP lists or both, and set channel limits per trunk."], ["Connect your stack", "Point LiveKit, a PBX or any SIP client at the trunk, or bring your own carrier."]],
    uses: ["logistics", "travel-hospitality", "financial-services"],
    works: ["livekit", "vapi", "retell", "elevenlabs"],
  },
  webrtc: {
    how: [["Create endpoints", "One endpoint for each person or device that should make or take calls."], ["Sign in from the browser", "The tab registers and can call any number with a real caller ID."], ["Hand off", "Move a live AI call to a person, with what the agent already covered."]],
    uses: ["logistics", "healthcare", "travel-hospitality"],
    works: ["livekit", "vapi", "retell"],
  },
  "ai-agents": {
    how: [["Pick a provider", "Choose Vapi, Retell, ElevenLabs, LiveKit or Bolna."], ["Pick a number and agent", "Select a TryVox number and the agent that should answer it."], ["Confirm", "The agent answers on that number straight away, with no SIP setup."]],
    uses: ["ecommerce", "healthcare", "real-estate"],
    works: ["vapi", "retell", "elevenlabs", "livekit", "bolna"],
  },
  "voice-api": {
    how: [["Place a call", "One POST with from, to and answer_url starts the call."], ["Return VoxML", "When the call is answered, TryVox fetches your answer_url and runs the VoxML it returns."], ["Follow events", "Get a webhook at every stage of the call, plus recordings when you ask for them."]],
    uses: ["financial-services", "logistics", "ecommerce"],
    works: ["livekit", "vapi", "retell", "elevenlabs"],
  },
  whatsapp: {
    how: [["Connect a number", "Add a WhatsApp number to the same account that runs your voice agent."], ["Send templates", "Trigger approved templates on a call outcome: a slot, a link or a document."], ["Get events", "Every inbound message, call and delivery status arrives as a webhook."]],
    uses: ["ecommerce", "logistics", "healthcare"],
    works: ["vapi", "retell", "bolna"],
  },
  "sms-rcs": {
    how: [["Link DLT", "Add your DLT entity, headers and templates once."], ["Send", "OTPs, alerts and reminders over SMS, or rich RCS cards with buttons."], ["Fall back", "Phones that can't show RCS get the SMS version."]],
    uses: ["financial-services", "ecommerce", "healthcare"],
    works: ["vapi", "retell", "bolna"],
  },
  "campaign-manager": {
    how: [["Plan", "Start from a preset and see the pace and finish time before anything dials."], ["Run", "Every number is watched while the campaign runs, and tired numbers rest."], ["Review", "Every call that didn't connect shows what happened and what was done about it."]],
    uses: ["financial-services", "real-estate", "ecommerce"],
    works: ["vapi", "retell", "livekit", "bolna"],
  },
};
