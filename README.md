# Federal Paws - Federal Register Animal Advocacy Email Notifications

Federal Paws is an Open Paws MVP that monitors Federal Register activity, identifies animal-related policy and regulatory notices, summarizes their advocacy relevance, and helps advocates verify official sources, review deadlines, and decide whether action is still possible.

## Screenshots

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/28e5925d-9152-4464-beca-967a52316a9d" />

![Uploading image.png…]()

## Architecture

Browser UI -> Next.js internal API routes -> n8n frontend API workflow -> PostgreSQL processed notice tables -> response back to the frontend.

Federal Register APIs are used by the ingestion/orchestrator workflows and, where needed, by the frontend API workflow for agency metadata.

The browser never calls n8n webhook URLs directly. The Next.js App Router route handlers call the n8n frontend API workflow server-side.

Do not wire browser/client components directly to n8n webhooks, PostgreSQL, the email processor workflow, the orchestrator workflow, embeddings, or admin workflows. The frontend should only call internal Next.js API routes.

## Frontend Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- lucide-react

## Backend / Automation Stack

- n8n
- PostgreSQL
- Federal Register API
- OpenRouter for AI relevance classification and summarization
- SMTP email delivery

## Deployment / Infrastructure

- Vercel or Railway for the frontend
- Elestio/self-hosted n8n for workflows
- Railway PostgreSQL for database storage

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Required in `.env.local`:

```env
N8N_FRONTEND_API_BASE_URL=https://code-for-compassion-u54266.vm.elestio.app/webhook
```

This value is server-side only. Do not use public-prefixed environment variables for the n8n base URL; the n8n webhook URL must not be exposed to browser/client components.

## Internal Frontend Routes

The browser calls only these internal Next.js routes:

- `GET /api/notices?date=YYYY-MM-DD`
- `GET /api/notices?date=YYYY-MM-DD&agency_slug=animal-and-plant-health-inspection-service`
- `GET /api/notices?date=YYYY-MM-DD&document_type=notice`
- `GET /api/notices?date=YYYY-MM-DD&actionability=monitoring%20only`
- `GET /api/notices?date=YYYY-MM-DD&deadline_status=open`
- `POST /api/subscribe`
- `GET /api/agencies`
- `GET /api/agency-detail?slug=animal-and-plant-health-inspection-service`

The route handlers call only these n8n frontend API workflow endpoints:

- `POST ${N8N_FRONTEND_API_BASE_URL}/calendar-notices`
- `POST ${N8N_FRONTEND_API_BASE_URL}/subscribe`
- `GET ${N8N_FRONTEND_API_BASE_URL}/agencies`
- `GET ${N8N_FRONTEND_API_BASE_URL}/agency-detail?slug=...`

## Expected Notice Response Shape

```ts
export interface Notice {
  id?: string;
  document_number: string;
  title: string;
  agency: string;
  agency_slug?: string;
  publication_date: string;
  document_type?: string;
  abstract?: string;
  html_url?: string;
  pdf_url?: string;
  comment_url?: string;
  actionability?: string;
  urgency?: string;
  deadline?: string | null;
  comment_deadline?: string | null;
  deadline_sensitivity?: string;
  ai_summary?: string;
  summary_plain_language?: string;
  why_it_matters?: string;
  talking_points?: string;
  suggested_talking_points?: string[] | string;
  processor_status?: string;
  ai_decision?: string;
  filing_tag?: string;
  email_sent?: boolean;
  verification_instructions?: string;
  disclaimer?: string;
}
```

Successful notices response:

```json
{
  "success": true,
  "date": "2026-05-29",
  "count": 0,
  "notices": []
}
```

## Demo Flow

1. Open the dashboard.
2. Select a publication date.
3. Apply available filters such as agency, document type, actionability, or deadline status where supported by the backend.
4. Review notice metadata, plain-language summary, why it matters, actionability, urgency, and deadline fields.
5. Open the official Federal Register source link.
6. Read the verification instructions.
7. Confirm the disclaimer is visible: "This represents informational guidance only and not legal advice."
8. Optionally submit an email subscription if the frontend API subscription route is active.

## Known Limitations

* Authentication, unsubscribe management, and account preferences are not implemented in this frontend.
* Email logs and audit dashboards are intentionally not included in the MVP frontend.
* Notice topic filtering is not shown because the current `/calendar-notices` frontend API contract does not accept a topic filter.
* Subscription topics are supported through `POST /api/subscribe` if the frontend API workflow route is active.
* Date history depends on processed records already stored in PostgreSQL for the selected publication date.
* The dashboard only displays records returned by the backend as relevant or available for review; it does not directly scan the full Federal Register from the browser.

## Validation

```bash
npm run lint
npm run build
```
