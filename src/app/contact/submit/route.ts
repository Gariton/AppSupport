import { NextRequest } from "next/server";
import { redirectTo } from "@/lib/http";
import { getAppById, saveContact } from "@/lib/store";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const appId = String(form.get("appId") || "");
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim();
  const message = String(form.get("message") || "").trim();

  if (!appId || !name || !email || !message || !(await getAppById(appId))) {
    return redirectTo("/contact?error=1");
  }

  await saveContact({ appId, name, email, message });
  return redirectTo("/contact?sent=1");
}
