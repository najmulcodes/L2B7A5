import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const tranId = formData.get("tran_id")?.toString();

  const url = new URL("/payment/status", request.url);
  url.searchParams.set("outcome", "cancel");
  if (tranId) url.searchParams.set("transactionId", tranId);

  return NextResponse.redirect(url, { status: 303 });
}
