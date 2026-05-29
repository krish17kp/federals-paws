import { NextResponse } from "next/server";
import {
  getN8nFrontendApiBaseUrl,
  isRecord,
  jsonError,
  readJson,
} from "../_lib/n8n";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetch(`${getN8nFrontendApiBaseUrl()}/agencies`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await readJson(response);

    if (!response.ok) {
      return jsonError("Failed to fetch agencies", 502);
    }

    if (isRecord(data)) {
      const agencies = Array.isArray(data.agencies) ? data.agencies : [];

      return NextResponse.json({
        success: data.success !== false,
        count:
          typeof data.count === "number" ? data.count : agencies.length,
        agencies,
      });
    }

    return NextResponse.json({
      success: true,
      count: Array.isArray(data) ? data.length : 0,
      agencies: Array.isArray(data) ? data : [],
    });
  } catch {
    return jsonError("Failed to fetch agencies", 502);
  }
}
