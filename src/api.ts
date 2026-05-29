import {
  AgenciesResponse,
  Agency,
  Notice,
  NoticesResponse,
  SubscribeRequest,
  SubscribeResponse,
} from "./types";

type CalendarNoticeParams = {
  date: string;
  agency_slug?: string;
  document_type?: string;
  actionability?: string;
  deadline_status?: string;
};

type ApiObject = Record<string, unknown>;

function isRecord(value: unknown): value is ApiObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function normalizeDateForApi(date: string): string {
  if (!date) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toISOString().slice(0, 10);
}

function normalizeTalkingPoints(value: unknown): string[] | string | undefined {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value === "string") {
    return value;
  }

  return undefined;
}

function normalizeNotice(rawNotice: unknown, fallbackDate: string): Notice {
  const notice = isRecord(rawNotice) ? rawNotice : {};

  return {
    id: asString(
      notice.id || notice.document_number || notice.fr_doc || notice.html_url,
    ) || undefined,
    document_number: asString(notice.document_number || notice.fr_doc),
    title: asString(notice.title, "Untitled notice"),
    agency: asString(notice.agency, "Unknown agency"),
    agency_slug: asString(notice.agency_slug) || undefined,
    publication_date: normalizeDateForApi(
      asString(notice.publication_date || notice.pub_date, fallbackDate),
    ),
    document_type: asString(notice.document_type || notice.type) || undefined,
    abstract: asString(notice.abstract) || undefined,
    html_url: asString(notice.html_url || notice.source || notice.url) || undefined,
    pdf_url: asString(notice.pdf_url || notice.pdf) || undefined,
    comment_url: asString(notice.comment_url) || undefined,
    actionability: asString(
      notice.actionability || notice.actionability_status,
      "informational",
    ),
    urgency: asString(notice.urgency) || undefined,
    deadline: asString(notice.deadline) || null,
    comment_deadline: asString(notice.comment_deadline || notice.deadline) || null,
    deadline_sensitivity: asString(notice.deadline_sensitivity) || undefined,
    ai_summary: asString(notice.ai_summary) || undefined,
    summary_plain_language:
      asString(notice.summary_plain_language || notice.ai_summary || notice.summary) ||
      asString(notice.abstract, "Summary unavailable. Verify the official notice."),
    why_it_matters:
      asString(notice.why_it_matters) ||
      "This item matched the animal advocacy monitoring pipeline. Verify the official source before deciding whether to act.",
    talking_points: asString(notice.talking_points) || undefined,
    suggested_talking_points: normalizeTalkingPoints(
      notice.suggested_talking_points || notice.talking_points,
    ),
    processor_status: asString(notice.processor_status) || undefined,
    ai_decision: asString(notice.ai_decision) || undefined,
    filing_tag: asString(notice.filing_tag) || undefined,
    email_sent:
      typeof notice.email_sent === "boolean" ? notice.email_sent : undefined,
    verification_instructions:
      asString(notice.verification_instructions) ||
      "Open the official Federal Register source and verify the title, agency, publication date, document number, and any comment deadline before taking action.",
    disclaimer:
      asString(notice.disclaimer) ||
      "This represents informational guidance only and not legal advice.",
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      isRecord(data) && typeof data.error === "string"
        ? data.error
        : `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data as T;
}

export const fetchCalendarNotices = async (
  params: CalendarNoticeParams,
): Promise<Notice[]> => {
  const searchParams = new URLSearchParams();
  const normalizedDate = normalizeDateForApi(params.date);

  searchParams.set("date", normalizedDate);

  if (params.agency_slug) {
    searchParams.set("agency_slug", params.agency_slug);
  }

  if (params.document_type) {
    searchParams.set("document_type", params.document_type);
  }

  if (params.actionability) {
    searchParams.set("actionability", params.actionability);
  }

  if (params.deadline_status) {
    searchParams.set("deadline_status", params.deadline_status);
  }

  const response = await fetch(`/api/notices?${searchParams.toString()}`);
  const data = await handleResponse<NoticesResponse>(response);

  if (!data.success) {
    throw new Error(data.error || "Failed to fetch notices");
  }

  return data.notices.map((notice) => normalizeNotice(notice, normalizedDate));
};

export const fetchAgencies = async (): Promise<Agency[]> => {
  const response = await fetch("/api/agencies");
  const data = await handleResponse<AgenciesResponse>(response);

  if (!data.success) {
    throw new Error(data.error || "Failed to fetch agencies");
  }

  return Array.isArray(data.agencies) ? data.agencies : [];
};

export const fetchAgencyDetail = async (slug: string) => {
  const response = await fetch(
    `/api/agency-detail?slug=${encodeURIComponent(slug)}`,
  );

  return handleResponse<unknown>(response);
};

export const subscribeUser = async (
  payload: SubscribeRequest,
): Promise<SubscribeResponse> => {
  const response = await fetch("/api/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await handleResponse<SubscribeResponse>(response);

  if (!data.success) {
    throw new Error(data.error || "Subscription was not saved");
  }

  return data;
};
