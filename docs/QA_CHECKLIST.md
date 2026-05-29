# Federal Paws QA Checklist

## Setup

- [ ] `npm install` completes from a fresh clone.
- [ ] `.env.local` exists with `N8N_FRONTEND_API_BASE_URL`.
- [ ] `npm run dev` starts the app.
- [ ] `npm run build` passes.
- [ ] `npm run lint` passes.

## API

- [ ] Client code does not contain the n8n webhook URL.
- [ ] Client code does not use public-prefixed n8n environment variables.
- [ ] `/api/notices?date=YYYY-MM-DD` returns JSON or a clear error.
- [ ] `/api/notices` without `date` returns a 400 validation error.
- [ ] `/api/agencies` returns agencies or a clear error.
- [ ] `/api/agency-detail?slug=...` validates slug format.
- [ ] `/api/subscribe` validates email, agencies, and topics.

## Notice Display

- [ ] Each notice shows title.
- [ ] Each notice shows agency.
- [ ] Each notice shows publication date.
- [ ] Each notice shows Federal Register document number.
- [ ] Each notice shows document type when available.
- [ ] Each notice shows plain-language summary.
- [ ] Each notice shows why it matters.
- [ ] Each notice shows actionability.
- [ ] Each notice shows urgency when available.
- [ ] Each notice shows comment deadline when available.
- [ ] Each notice shows deadline sensitivity when available.
- [ ] Each notice shows suggested talking points when available.
- [ ] Each notice has an official Federal Register source link.
- [ ] Each notice has a PDF/source link when available.
- [ ] Each notice shows source verification instructions.
- [ ] Each notice shows: "This represents informational guidance only and not legal advice."

## User Flow

- [ ] User can select a date.
- [ ] User can filter by agency.
- [ ] User can filter by document type.
- [ ] User can filter by actionability.
- [ ] User can filter by deadline status.
- [ ] Notice topic filtering is not shown unless the backend contract adds it.
- [ ] Empty state appears when no notices match.
- [ ] Loading state appears during fetch.
- [ ] API error state is visible and understandable.
- [ ] Mobile layout allows the user to search, filter, and read notice cards.
- [ ] No placeholder auth, settings, bell, support, or email-log controls are visible.

## Demo Readiness

- [ ] The demo proves that an advocate can find, understand, verify, and decide whether to act on a Federal Register notice.
- [ ] The presenter can explain that backend classification/email logic lives in n8n and PostgreSQL.
- [ ] Known limitations are documented in `README.md`.
