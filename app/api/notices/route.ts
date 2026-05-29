import { NextRequest, NextResponse } from "next/server";
import {
  getN8nFrontendApiBaseUrl,
  isRecord,
  jsonError,
  readJson,
} from "../_lib/n8n";

export const dynamic = "force-dynamic";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const AGENCY_SLUG_PATTERN = /^[a-z0-9-]+$/;

const ACTIONABILITY_MAP: Record<string, string> = {
  monitoring_only: "monitoring only",
  action_available: "action available",
  comment_open: "public comment open",
  public_comment_open: "public comment open",
  deadline_sensitive: "urgent",
};

const ALLOWED_DOCUMENT_TYPES = new Set([
  "notice",
  "rule",
  "proposed rule",
  "presidential document",
  "",
]);

const ALLOWED_ACTIONABILITY = new Set([
  "public comment open",
  "urgent",
  "monitoring only",
  "action available",
  "",
]);

const ALLOWED_DEADLINE_STATUS = new Set([
  "open",
  "approaching",
  "closed",
  "none",
  "",
]);

function getOptionalParam(params: URLSearchParams, key: string) {
  return params.get(key)?.trim() || "";
}

function getLowercaseParam(params: URLSearchParams, key: string) {
  return getOptionalParam(params, key).toLowerCase();
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const date = getOptionalParam(params, "date");

  if (!date) {
    return jsonError("date is required", 400);
  }

  if (!DATE_PATTERN.test(date)) {
    return jsonError("Invalid date. Expected YYYY-MM-DD", 400);
  }

  const agencySlug = getLowercaseParam(params, "agency_slug");
  const documentType = getLowercaseParam(params, "document_type");
  let actionability = getLowercaseParam(params, "actionability");
  const deadlineStatus = getLowercaseParam(params, "deadline_status");

  actionability = ACTIONABILITY_MAP[actionability] || actionability;

  if (agencySlug && !AGENCY_SLUG_PATTERN.test(agencySlug)) {
    return jsonError("Invalid agency_slug", 400);
  }

  if (!ALLOWED_DOCUMENT_TYPES.has(documentType)) {
    return jsonError("Invalid document_type", 400);
  }

  if (!ALLOWED_ACTIONABILITY.has(actionability)) {
    return jsonError("Invalid actionability", 400);
  }

  if (!ALLOWED_DEADLINE_STATUS.has(deadlineStatus)) {
    return jsonError("Invalid deadline_status", 400);
  }

  const body = {
    date,
    agency_slug: agencySlug,
    document_type: documentType,
    actionability,
    deadline_status: deadlineStatus,
  };

  try {
    const response = await fetch(
      `${getN8nFrontendApiBaseUrl()}/calendar-notices`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      },
    );

    const data = await readJson(response);

    if (!response.ok) {
      return jsonError("Failed to fetch notices", 502);
    }

    if (isRecord(data)) {
      const notices = Array.isArray(data.notices) ? data.notices : [];

      return NextResponse.json({
        success: data.success !== false,
        date: typeof data.date === "string" ? data.date : date,
        count:
          typeof data.count === "number" ? data.count : notices.length,
        notices,
      });
    }

    return NextResponse.json({
      success: true,
      date,
      count: Array.isArray(data) ? data.length : 0,
      notices: Array.isArray(data) ? data : [],
    });
  } catch {
    return jsonError("Failed to fetch notices", 502);
  }
}
