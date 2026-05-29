# Federal Paws Demo Script

## Goal

Show that Federal Paws helps animal advocates review backend-processed Federal Register notices, understand actionability, verify the government source, and avoid treating AI guidance as legal advice.

## Demo Steps

1. Open `http://localhost:3000`.
2. Explain that the browser calls internal Next.js API routes, and those routes proxy to the existing n8n frontend API workflow.
3. Select a publication date with known backend data.
4. Apply one filter, such as agency, document type, actionability, or deadline status.
5. Open the notices section.
6. Point out the required metadata: title, agency, publication date, Federal Register document number, and document type.
7. Read the plain-language summary.
8. Read "Why this matters to animal advocates."
9. Point out actionability, urgency, and any comment deadline.
10. Show suggested advocacy talking points if present.
11. Open the official Federal Register notice link.
12. Read the verification instructions.
13. Point out the disclaimer: "This represents informational guidance only and not legal advice."
14. If subscription is enabled, submit a test email and explain that subscription persistence is handled by the n8n frontend API workflow.

## What Not To Claim

- Do not claim the frontend provides legal advice.
- Do not claim auth, unsubscribe, or email logs are complete.
- Do not claim all Federal Register items are shown; the backend determines relevance and filtering.
- Do not claim the frontend triggers the orchestrator or email processor workflows.

## Fallback If Backend Is Down

Show the API error state and explain that the frontend fails visibly rather than silently hiding backend failures.
