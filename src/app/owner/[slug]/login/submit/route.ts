import { NextRequest } from "next/server";
import { createSessionValue, setSessionCookie, verifyCredentials } from "@/lib/auth";
import { adminPath, isAdminSlug } from "@/lib/admin-path";
import { redirectTo } from "@/lib/http";

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isAdminSlug(slug)) {
    return new Response(null, { status: 404 });
  }

  const basePath = adminPath(slug);
  const form = await request.formData();
  const username = String(form.get("username") || "");
  const password = String(form.get("password") || "");

  if (!verifyCredentials(username, password)) {
    return redirectTo(`${basePath}/login?error=1`);
  }

  const response = redirectTo(basePath);
  setSessionCookie(response, createSessionValue());
  return response;
}
