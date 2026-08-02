import { NextRequest } from "next/server";
import { sendContactNotification } from "@/lib/contact-email";
import { redirectTo } from "@/lib/http";
import { getAppById, saveContact, updateContactEmailStatus } from "@/lib/store";

const requestLog = new Map<string, number[]>();
const validCategories = new Set(["app-support", "bug-report", "general"]);

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const category = String(form.get("category") || "");
  const appId = String(form.get("appId") || "");
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim();
  const message = String(form.get("message") || "").trim();
  const website = String(form.get("website") || "").trim();
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const app = appId ? await getAppById(appId) : null;

  if (
    website ||
    !validCategories.has(category) ||
    !name ||
    name.length > 100 ||
    !isValidEmail(email) ||
    email.length > 254 ||
    !message ||
    message.length > 5000 ||
    ((category === "app-support" || category === "bug-report") && !app)
  ) {
    return redirectTo("/contact?error=1");
  }

  if (isRateLimited(clientIp)) return redirectTo("/contact?error=rate");

  const contact = await saveContact({
    appId: app?.id || null,
    category: category as "app-support" | "bug-report" | "general",
    name,
    email,
    message,
    emailStatus: "pending"
  });

  try {
    const status = await sendContactNotification(contact, app);
    await updateContactEmailStatus(contact.id, status);
  } catch (error) {
    console.error("Failed to send contact notification", error);
    await updateContactEmailStatus(contact.id, "failed");
  }

  return redirectTo("/contact?sent=1");
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const windowStart = now - 10 * 60 * 1000;
  const recent = (requestLog.get(ip) || []).filter((time) => time > windowStart);
  if (recent.length >= 5) return true;
  recent.push(now);
  requestLog.set(ip, recent);
  return false;
}
