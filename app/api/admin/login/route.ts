import { NextResponse } from "next/server";
import { validateAdminKey } from "@/app/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const key: string = body?.key || "";

  if (!(await validateAdminKey(key))) {
    return NextResponse.json({ error: "Kredensial salah" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin_auth", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/admin",
    maxAge: 60 * 60 * 24, // 1 day
  });
  return response;
}
