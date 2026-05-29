import { NextRequest, NextResponse } from "next/server";
import {
  getN8nFrontendApiBaseUrl,
  jsonError,
  readJson,
} from "../_lib/n8n";

export const dynamic = "force-dynamic";

const SLUG_PATTERN = /^[a-z0-9-]+$/;

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug")?.trim() || "";

  if (!slug) {
    return jsonError("slug is required", 400);
  }

  if (!SLUG_PATTERN.test(slug)) {
    return jsonError("slug is invalid", 400);
  }

  try {
    const response = await fetch(
      `${getN8nFrontendApiBaseUrl()}/agency-detail?slug=${encodeURIComponent(slug)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    const data = await readJson(response);

    if (!response.ok) {
      return jsonError("Failed to fetch agency detail", 502);
    }

    return NextResponse.json(data);
  } catch {
    return jsonError("Failed to fetch agency detail", 502);
  }
}
