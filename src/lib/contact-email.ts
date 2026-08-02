import nodemailer from "nodemailer";
import type { AppRecord, ContactRecord } from "./types";

const categoryLabels: Record<ContactRecord["category"], string> = {
  "app-support": "アプリについて",
  "bug-report": "不具合報告",
  general: "その他"
};

export async function sendContactNotification(contact: ContactRecord, app: AppRecord | null) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  if (!host || !user || !password) return "not-configured" as const;

  const port = Number(process.env.SMTP_PORT || "587");
  const secure = process.env.SMTP_SECURE === "true";
  const to = process.env.CONTACT_TO_EMAIL || "contact@gariton.site";
  const from = process.env.SMTP_FROM_EMAIL || `Gariton Lab <${user}>`;
  const category = categoryLabels[contact.category];
  const appName = app?.name || "指定なし";

  const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass: password } });
  await transporter.sendMail({
    from,
    to,
    replyTo: contact.email,
    subject: `[Gariton Lab] ${category}${app ? `: ${app.name}` : ""}`,
    text: [
      "Gariton LabのWebサイトからお問い合わせが届きました。",
      "",
      `種別: ${category}`,
      `対象アプリ: ${appName}`,
      `お名前: ${contact.name}`,
      `メールアドレス: ${contact.email}`,
      "",
      "内容:",
      contact.message
    ].join("\n")
  });
  return "sent" as const;
}
