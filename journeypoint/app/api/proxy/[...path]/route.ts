import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = (process.env.API_BACKEND_URL ?? "").replace(/\/$/, "");

const getTenantId = (request: NextRequest): string | null =>
  request.headers.get("abp.tenantid") ??
  request.headers.get("Abp.TenantId") ??
  request.cookies.get("Abp.TenantId")?.value ??
  null;

const handleRequest = async (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) => {
  const { path } = await context.params;
  const search = request.nextUrl.search ?? "";
  const targetUrl = `${BACKEND_URL}/${path.join("/")}${search}`;
  const tenantId = getTenantId(request);

  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.text();

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        "Content-Type":
          request.headers.get("content-type") ?? "application/json",
        ...(request.headers.get("authorization")
          ? { Authorization: request.headers.get("authorization")! }
          : {}),
        ...(tenantId
          ? {
              "Abp.TenantId": tenantId,
              Cookie: `Abp.TenantId=${encodeURIComponent(tenantId)}`,
            }
          : {}),
      },
      body,
    });

    const responseBody = await response.arrayBuffer();

    return new NextResponse(responseBody, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (error) {
    console.error(`[proxy] ${request.method} ${targetUrl} failed:`, error);
    return NextResponse.json(
      { error: "Proxy request failed", detail: String(error) },
      { status: 502 },
    );
  }
};

export const GET = async (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) => {
  return handleRequest(request, context);
};

export const POST = async (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) => {
  return handleRequest(request, context);
};

export const PUT = async (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) => {
  return handleRequest(request, context);
};

export const DELETE = async (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) => {
  return handleRequest(request, context);
};

export const OPTIONS = async () => {
  return new NextResponse(null, { status: 204 });
};
