import { NextRequest, NextResponse } from "next/server";
import {
  getN8nFrontendApiBaseUrl,
  isRecord,
  jsonError,
  readJson,
} from "../_lib/n8n";

export const dynamic = "force-dynamic";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  if (!isRecord(payload)) {
    return jsonError("Request body must be an object", 400);
  }

  const email =
    typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";

  if (!email) {
    return jsonError("email is required", 400);
  }

  if (!EMAIL_PATTERN.test(email)) {
    return jsonError("email must be valid", 400);
  }

  if (payload.agencies !== undefined && !Array.isArray(payload.agencies)) {
    return jsonError("agencies must be an array", 400);
  }

  if (payload.topics !== undefined && !Array.isArray(payload.topics)) {
    return jsonError("topics must be an array", 400);
  }

  const body = {
    email,
    agencies: Array.isArray(payload.agencies) ? payload.agencies : [],
    topics: Array.isArray(payload.topics) ? payload.topics : [],
  };

  try {
    const response = await fetch(`${getN8nFrontendApiBaseUrl()}/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await readJson(response);

    if (!response.ok) {
      console.error("n8n subscribe request failed", {
        status: response.status,
        data,
      });

      return jsonError("Failed to subscribe", 502);
    }

    if (isRecord(data)) {
      if (data.success === false) {
        const error =
          typeof data.error === "string"
            ? data.error
            : "Subscription was not saved";

        console.error("n8n subscribe response was unsuccessful", {
          error,
          data,
        });

        return jsonError(error, 502);
      }

      if (data.subscriber_id === undefined || data.subscriber_id === null) {
        console.error("n8n subscribe response did not include subscriber_id", {
          data,
        });

        return jsonError("Subscription was not confirmed in the database", 502);
      }

      return NextResponse.json({
        success: data.success !== false,
        message:
          typeof data.message === "string"
            ? data.message
            : "Subscription saved successfully.",
        subscriber_id:
          data.subscriber_id === undefined ? undefined : String(data.subscriber_id),
        email: typeof data.email === "string" ? data.email : email,
      });
    }

    return NextResponse.json(data);
  } catch {
    return jsonError("Failed to subscribe", 502);
  }
}
