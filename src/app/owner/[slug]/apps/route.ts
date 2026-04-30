import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { appendStatusParam, safeAdminReturnTo } from "@/lib/admin-redirect";
import { adminPath, isAdminSlug } from "@/lib/admin-path";
import { redirectTo } from "@/lib/http";
import { saveApp, saveAppIcon } from "@/lib/store";

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

  try {
    const iconFile = form.get("iconFile");
    const iconImageUrl = iconFile instanceof File && iconFile.size > 0 ? await saveAppIcon(iconFile) : "";

    await saveApp({
      id: String(form.get("id") || "") || undefined,
      name: String(form.get("name") || "").trim(),
      slug: String(form.get("slug") || "").trim(),
      appStoreUrl: String(form.get("appStoreUrl") || "").trim(),
      supportEmail: String(form.get("supportEmail") || "").trim(),
      description: String(form.get("description") || "").trim(),
      hasInAppPurchases: form.get("hasInAppPurchases") === "1",
      supportedLanguages: String(form.get("supportedLanguages") || "").split(","),
      iconImageUrl
    });
  } catch {
    return redirectTo(appendStatusParam(returnTo, "appError", "1"));
  }

  return redirectTo(appendStatusParam(returnTo, "saved", "app"));
}
