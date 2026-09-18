import { env } from "cloudflare:workers";
import { AppRecord, ContactRecord, PolicyRecord } from "./types";

const iconPublicPath = "/app-icons";
const screenshotPublicPath = "/app-screenshots";
const maxIconBytes = 2 * 1024 * 1024;
const maxScreenshotBytes = 8 * 1024 * 1024;

const imageMimeTypes: Record<string, string> = {
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp"
};

type AppRow = {
  id: string;
  name: string;
  slug: string;
  platform: "ios";
  app_store_url: string;
  support_email: string;
  description: string;
  has_in_app_purchases: number;
  supported_languages: string;
  icon_image_url: string;
  screenshots: string;
  created_at: string;
  updated_at: string;
};

type PolicyRow = {
  id: string;
  app_id: string;
  locale: string;
  file_name: string;
  title: string;
  updated_at: string;
};

type ContactRow = {
  id: string;
  app_id: string | null;
  category: ContactRecord["category"];
  name: string;
  email: string;
  message: string;
  email_status: ContactRecord["emailStatus"];
  created_at: string;
};

function parseStringArray(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function mapApp(row: AppRow): AppRecord {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    platform: "ios",
    appStoreUrl: row.app_store_url,
    supportEmail: row.support_email,
    description: row.description,
    hasInAppPurchases: Boolean(row.has_in_app_purchases),
    supportedLanguages: parseStringArray(row.supported_languages),
    iconImageUrl: row.icon_image_url,
    screenshots: parseStringArray(row.screenshots),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapPolicy(row: PolicyRow): PolicyRecord {
  return {
    id: row.id,
    appId: row.app_id,
    locale: row.locale,
    fileName: row.file_name,
    title: row.title,
    updatedAt: row.updated_at
  };
}

function mapContact(row: ContactRow): ContactRecord {
  return {
    id: row.id,
    appId: row.app_id,
    category: row.category,
    name: row.name,
    email: row.email,
    message: row.message,
    emailStatus: row.email_status,
    createdAt: row.created_at
  };
}

export async function listApps() {
  const { results } = await env.DB.prepare("SELECT * FROM apps ORDER BY name COLLATE NOCASE").all<AppRow>();
  return results.map(mapApp);
}

export async function getAppBySlug(slug: string) {
  const row = await env.DB.prepare("SELECT * FROM apps WHERE slug = ? LIMIT 1").bind(slug).first<AppRow>();
  return row ? mapApp(row) : null;
}

export async function getAppById(id: string) {
  const row = await env.DB.prepare("SELECT * FROM apps WHERE id = ? LIMIT 1").bind(id).first<AppRow>();
  return row ? mapApp(row) : null;
}

type SaveAppInput = Omit<AppRecord, "id" | "platform" | "createdAt" | "updatedAt" | "screenshots"> & {
  id?: string;
};

export async function saveApp(input: SaveAppInput) {
  const now = new Date().toISOString();
  const slug = normalizeSlug(input.slug);
  const duplicate = await env.DB.prepare("SELECT id FROM apps WHERE slug = ? AND id != ? LIMIT 1")
    .bind(slug, input.id || "")
    .first<{ id: string }>();
  if (duplicate) {
    throw new Error("このスラッグは既に使われています。");
  }

  if (input.id) {
    const result = await env.DB.prepare(
      `UPDATE apps
       SET name = ?, slug = ?, app_store_url = ?, support_email = ?, description = ?,
           has_in_app_purchases = ?, supported_languages = ?,
           icon_image_url = CASE WHEN ? = '' THEN icon_image_url ELSE ? END,
           updated_at = ?
       WHERE id = ?`
    )
      .bind(
        input.name,
        slug,
        input.appStoreUrl,
        input.supportEmail,
        input.description,
        input.hasInAppPurchases ? 1 : 0,
        JSON.stringify(normalizeSupportedLanguages(input.supportedLanguages)),
        input.iconImageUrl,
        input.iconImageUrl,
        now,
        input.id
      )
      .run();
    if (!result.meta.changes) throw new Error("アプリが見つかりません。");
    return;
  }

  await env.DB.prepare(
    `INSERT INTO apps (
       id, name, slug, platform, app_store_url, support_email, description,
       has_in_app_purchases, supported_languages, icon_image_url, screenshots, created_at, updated_at
     ) VALUES (?, ?, ?, 'ios', ?, ?, ?, ?, ?, ?, '[]', ?, ?)`
  )
    .bind(
      crypto.randomUUID(),
      input.name,
      slug,
      input.appStoreUrl,
      input.supportEmail,
      input.description,
      input.hasInAppPurchases ? 1 : 0,
      JSON.stringify(normalizeSupportedLanguages(input.supportedLanguages)),
      input.iconImageUrl,
      now,
      now
    )
    .run();
}

export async function saveAppIcon(file: File) {
  if (file.size > maxIconBytes) {
    throw new Error("アイコン画像は 2MB 以下にしてください。");
  }

  const extension = imageMimeTypes[file.type];
  if (!extension) {
    throw new Error("アイコン画像は PNG、JPEG、WebP、GIF のいずれかを選択してください。");
  }

  const fileName = `${crypto.randomUUID()}.${extension}`;
  await env.UPLOADS.put(`icons/${fileName}`, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type }
  });
  return `${iconPublicPath}/${fileName}`;
}

export async function saveAppScreenshots(appId: string, files: File[], options: { replace?: boolean } = {}) {
  const app = await getAppById(appId);
  if (!app) {
    throw new Error("アプリが見つかりません。");
  }

  files.forEach(validateScreenshotImage);
  const imageUrls = await Promise.all(files.map(saveScreenshotImage));
  const screenshots = options.replace ? imageUrls : [...app.screenshots, ...imageUrls];
  await env.DB.prepare("UPDATE apps SET screenshots = ?, updated_at = ? WHERE id = ?")
    .bind(JSON.stringify(screenshots), new Date().toISOString(), appId)
    .run();
  return screenshots;
}

async function saveScreenshotImage(file: File) {
  const extension = validateScreenshotImage(file);
  const fileName = `${crypto.randomUUID()}.${extension}`;
  await env.UPLOADS.put(`screenshots/${fileName}`, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type }
  });
  return `${screenshotPublicPath}/${fileName}`;
}

function validateScreenshotImage(file: File) {
  if (file.size > maxScreenshotBytes) {
    throw new Error("スクリーンショット画像は 8MB 以下にしてください。");
  }

  const extension = imageMimeTypes[file.type];
  if (!extension) {
    throw new Error("スクリーンショット画像は PNG、JPEG、WebP、GIF のいずれかを選択してください。");
  }

  return extension;
}

export async function readAppIcon(fileName: string) {
  if (!isSafeImageFileName(fileName)) return null;
  const object = await env.UPLOADS.get(`icons/${fileName}`);
  return object ? object.arrayBuffer() : null;
}

export async function readAppScreenshot(fileName: string) {
  if (!isSafeImageFileName(fileName)) return null;
  const object = await env.UPLOADS.get(`screenshots/${fileName}`);
  return object ? object.arrayBuffer() : null;
}

function isSafeImageFileName(fileName: string) {
  return /^[a-f0-9-]+\.(gif|jpe?g|png|webp)$/.test(fileName);
}

export async function listPolicies(appId?: string) {
  const statement = appId
    ? env.DB.prepare("SELECT * FROM policies WHERE app_id = ? ORDER BY locale").bind(appId)
    : env.DB.prepare("SELECT * FROM policies ORDER BY locale");
  const { results } = await statement.all<PolicyRow>();
  return results.map(mapPolicy);
}

export async function getPolicy(appId: string, locale: string) {
  const row = await env.DB.prepare("SELECT * FROM policies WHERE app_id = ? AND locale = ? LIMIT 1")
    .bind(appId, locale)
    .first<PolicyRow>();
  return row ? mapPolicy(row) : null;
}

export async function savePolicy(appId: string, locale: string, originalName: string, markdown: string) {
  const app = await getAppById(appId);
  if (!app) {
    throw new Error("アプリが見つかりません。");
  }

  const normalizedLocale = normalizeLocale(locale);
  const now = new Date().toISOString();
  const fileName = `${app.slug}-${normalizedLocale}.md`;
  const title = extractMarkdownTitle(markdown) || `${app.name} Privacy Policy`;
  await env.UPLOADS.put(`policies/${fileName}`, markdown, {
    httpMetadata: { contentType: "text/markdown; charset=utf-8" }
  });
  await env.DB.prepare(
    `INSERT INTO policies (id, app_id, locale, file_name, title, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(app_id, locale) DO UPDATE SET
       file_name = excluded.file_name,
       title = excluded.title,
       updated_at = excluded.updated_at`
  )
    .bind(crypto.randomUUID(), appId, normalizedLocale, fileName, title, now)
    .run();
  return originalName;
}

export async function readPolicyMarkdown(policy: PolicyRecord) {
  const object = await env.UPLOADS.get(`policies/${policy.fileName}`);
  if (!object) throw new Error("ポリシーファイルが見つかりません。");
  return object.text();
}

export async function saveContact(input: Omit<ContactRecord, "id" | "createdAt">) {
  const contact: ContactRecord = {
    id: crypto.randomUUID(),
    ...input,
    createdAt: new Date().toISOString()
  };
  await env.DB.prepare(
    `INSERT INTO contacts (id, app_id, category, name, email, message, email_status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      contact.id,
      contact.appId,
      contact.category,
      contact.name,
      contact.email,
      contact.message,
      contact.emailStatus,
      contact.createdAt
    )
    .run();
  return contact;
}

export async function updateContactEmailStatus(id: string, emailStatus: ContactRecord["emailStatus"]) {
  await env.DB.prepare("UPDATE contacts SET email_status = ? WHERE id = ?").bind(emailStatus, id).run();
}

export async function listContacts() {
  const { results } = await env.DB.prepare("SELECT * FROM contacts ORDER BY created_at DESC").all<ContactRow>();
  return results.map(mapContact);
}

export function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeLocale(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
}

function normalizeSupportedLanguages(values: string[] | string) {
  const items = Array.isArray(values) ? values : values.split(/[,、\n]/);
  return Array.from(new Set(items.map((value) => value.trim()).filter(Boolean)));
}

function extractMarkdownTitle(markdown: string) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim();
}
