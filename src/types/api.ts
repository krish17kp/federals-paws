export interface Agency {
  name: string;
  slug: string;
  url?: string;
}

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

export interface NoticesResponse {
  success: boolean;
  date?: string;
  count?: number;
  notices: Notice[];
  error?: string;
}

export interface AgenciesResponse {
  success: boolean;
  count?: number;
  agencies: Agency[];
  error?: string;
}

export interface SubscribeRequest {
  email: string;
  agencies?: string[];
  topics?: string[];
}

export interface SubscribeResponse {
  success: boolean;
  message?: string;
  subscriber_id?: string;
  email?: string;
  error?: string;
}
