import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { appendStatusParam, safeAdminReturnTo } from "@/lib/admin-redirect";
import { adminPath, isAdminSlug } from "@/lib/admin-path";
import { redirectTo } from "@/lib/http";
import { saveAppScreenshots } from "@/lib/store";

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
  const returnTo = safeAdminReturnTo(form.get("returnTo"), basePath);
  const appId = String(form.get("appId") || "");
  const files = form
    .getAll("screenshotFiles")
    .filter((file): file is File => file instanceof File && file.size > 0);

  if (files.length === 0 || files.length > 10) {
    return redirectTo(appendStatusParam(returnTo, "screenshotError", "1"));
  }

  try {
    await saveAppScreenshots(appId, files, { replace: form.get("replace") === "1" });
  } catch {
    return redirectTo(appendStatusParam(returnTo, "screenshotError", "1"));
  }

  return redirectTo(appendStatusParam(returnTo, "saved", "screenshots"));
}
