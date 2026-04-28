import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { adminPath, isAdminSlug } from "@/lib/admin-path";
import { redirectTo } from "@/lib/http";
import { savePolicy } from "@/lib/store";

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isAdminSlug(slug)) {
    return new Response(null, { status: 404 });
  }

  const basePath = adminPath(slug);
  if (!requireAdmin(request)) {
    return redirectTo(`${basePath}/login`);
  }

  const form = await request.formData();
  const appId = String(form.get("appId") || "");
  const locale = String(form.get("locale") || "");
  const file = form.get("policyFile");

  if (!(file instanceof File) || !file.name.endsWith(".md")) {
    return redirectTo(`${basePath}?policyError=1`);
  }

  await savePolicy(appId, locale, file.name, await file.text());
  return redirectTo(basePath);
}
