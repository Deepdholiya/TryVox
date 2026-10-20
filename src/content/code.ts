/* Ported from the original static site. Edit freely: this file is now the source of truth. */
/* Code samples, matching docs.tryvox.io. */

export type CodeSet = Record<string, [label: string, source: string]>;

export const CALL_CURL = "# Place an outbound call\ncurl -X POST https://api.tryvox.io/v1/voice/accounts/$TRYVOX_AUTH_ID/calls \\\n  -u $TRYVOX_AUTH_ID:$TRYVOX_AUTH_TOKEN \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"from\": \"+918047182290\",\n    \"to\": \"+919812345678\",\n    \"answer_url\": \"https://example.com/answer\",\n    \"hangup_url\": \"https://example.com/hangup\",\n    \"status_callback_url\": \"https://example.com/status\",\n    \"ring_timeout\": 30,\n    \"time_limit\": 3600\n  }'";

export const CALL_NODE = "// Place an outbound call\nconst { TRYVOX_AUTH_ID: id, TRYVOX_AUTH_TOKEN: token } = process.env;\n\nconst res = await fetch(`https://api.tryvox.io/v1/voice/accounts/${id}/calls`, {\n  method: \"POST\",\n  headers: {\n    Authorization: \"Basic \" + Buffer.from(`${id}:${token}`).toString(\"base64\"),\n    \"Content-Type\": \"application/json\",\n  },\n  body: JSON.stringify({\n    from: \"+918047182290\",\n    to: \"+919812345678\",\n    answer_url: \"https://example.com/answer\",\n    hangup_url: \"https://example.com/hangup\",\n  }),\n});\nconst { data } = await res.json(); // data.status === \"queued\"";

export const CALL_PY = "# Place an outbound call\nimport os, requests\n\nauth_id = os.environ[\"TRYVOX_AUTH_ID\"]\ncall = requests.post(\n    f\"https://api.tryvox.io/v1/voice/accounts/{auth_id}/calls\",\n    auth=(auth_id, os.environ[\"TRYVOX_AUTH_TOKEN\"]),\n    json={\n        \"from\": \"+918047182290\",\n        \"to\": \"+919812345678\",\n        \"answer_url\": \"https://example.com/answer\",\n        \"hangup_url\": \"https://example.com/hangup\",\n    },\n).json()[\"data\"]";

export const SIP_HEADERS = "# Headers your agent receives on an inbound call\n# after you bind a TryVox number to it\n\nX-TryVox-Direction:    inbound\nX-TryVox-Route:        ai-agent\nX-TryVox-AI-Provider:  vapi | elevenlabs | retell\nX-TryVox-From:         <E.164 caller>\nX-TryVox-To:           <E.164 TryVox number>";

export const AUTH_CURL = "# Every request uses HTTP Basic auth:\n# username = Auth ID, password = Auth Token (both from the dashboard)\n\ncurl -u $TRYVOX_AUTH_ID:$TRYVOX_AUTH_TOKEN \\\n  https://api.tryvox.io/v1/account/$TRYVOX_AUTH_ID/numbers";

export const CALL_RESP = "// 201 Created\n{\n  \"data\": {\n    \"request_uuid\": \"…\",\n    \"from\": \"+918047182290\",\n    \"to\": \"+919812345678\",\n    \"direction\": \"outbound\",\n    \"status\": \"queued\",\n    \"duration\": 0,\n    \"billsec\": 0\n  }\n}";
