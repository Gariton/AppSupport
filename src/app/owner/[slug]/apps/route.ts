import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
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
      iconImageUrl
    });
  } catch {
    return redirectTo(`${basePath}?appError=1`);
  }

  return redirectTo(basePath);
}
