import { NextResponse } from "next/server";

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function errorResponse(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

export function parseSearchParams(url: string) {
  const { searchParams } = new URL(url);
  return {
    page: Math.max(1, parseInt(searchParams.get("page") ?? "1", 10)),
    limit: Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10))),
    search: searchParams.get("search") ?? undefined,
    categoryId: searchParams.get("categoryId") ?? undefined,
    accountId: searchParams.get("accountId") ?? undefined,
    type: searchParams.get("type") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    dateFrom: searchParams.get("dateFrom") ?? undefined,
    dateTo: searchParams.get("dateTo") ?? undefined,
    period: searchParams.get("period") ?? undefined,
    months: searchParams.get("months") ?? undefined,
  };
}
