import { NextResponse } from "next/server";

export function getN8nFrontendApiBaseUrl() {
  const baseUrl = process.env.N8N_FRONTEND_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("Missing N8N_FRONTEND_API_BASE_URL");
  }

  return baseUrl.replace(/\/$/, "");
}

export async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export function jsonError(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
