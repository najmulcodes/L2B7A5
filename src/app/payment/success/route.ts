import { NextResponse, type NextRequest } from "next/server";

/**
 * SSLCommerz completes a payment by redirecting the customer's BROWSER
 * here via an auto-submitting form POST (application/x-www-form-urlencoded),
 * not a plain GET - so this has to be a Route Handler, not a page. It
 * just extracts tran_id and forwards to a GET-based status page, which is
 * what actually renders UI (a route.ts and a page.tsx can't coexist at
 * the same path in the App Router).
 */
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const tranId = formData.get("tran_id")?.toString();

  const url = new URL("/payment/status", request.url);
  url.searchParams.set("outcome", "success");
  if (tranId) url.searchParams.set("transactionId", tranId);

  return NextResponse.redirect(url, { status: 303 });
}
