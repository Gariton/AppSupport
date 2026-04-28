import { mkdir, readFile, rename, writeFile } from "fs/promises";
import path from "path";
import { AppRecord, ContactRecord, Database, PolicyRecord } from "./types";

const dataDir = process.env.DATA_DIR || path.join(process.cwd(), ".data");
const dbPath = path.join(dataDir, "db.json");
const policyDir = path.join(dataDir, "policies");
const iconDir = path.join(dataDir, "icons");
const iconPublicPath = "/app-icons";
const maxIconBytes = 2 * 1024 * 1024;

const iconMimeTypes: Record<string, string> = {
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp"
};

const emptyDb: Database = {
  apps: [],
  policies: [],
  contacts: []
};

async function ensureDataDir() {
  await mkdir(dataDir, { recursive: true });
  await mkdir(policyDir, { recursive: true });
  await mkdir(iconDir, { recursive: true });
}

async function readDb(): Promise<Database> {
  await ensureDataDir();
  try {
    const raw = await readFile(dbPath, "utf8");
    const db = { ...emptyDb, ...JSON.parse(raw) } as Database;
    db.apps = db.apps.map((app) => ({ ...app, iconImageUrl: app.iconImageUrl || "" }));
    return db;
  } catch {
    await writeDb(emptyDb);
    return emptyDb;
  }
}

async function writeDb(db: Database) {
  await ensureDataDir();
  const tmpPath = `${dbPath}.tmp`;
  await writeFile(tmpPath, JSON.stringify(db, null, 2), "utf8");
  await rename(tmpPath, dbPath);
}

export async function listApps() {
  const db = await readDb();
  return db.apps.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getAppBySlug(slug: string) {
  const db = await readDb();
  return db.apps.find((app) => app.slug === slug) || null;
}

export async function getAppById(id: string) {
  const db = await readDb();
  return db.apps.find((app) => app.id === id) || null;
}

type SaveAppInput = Omit<AppRecord, "id" | "platform" | "createdAt" | "updatedAt"> & { id?: string };

export async function saveApp(input: SaveAppInput) {
  const db = await readDb();
  const now = new Date().toISOString();
  const slug = normalizeSlug(input.slug);
  const duplicate = db.apps.find((app) => app.slug === slug && app.id !== input.id);
  if (duplicate) {
    throw new Error("このスラッグは既に使われています。");
  }

  if (input.id) {
    db.apps = db.apps.map((app) =>
      app.id === input.id
        ? {
            ...app,
            name: input.name,
            slug,
            platform: "ios",
            appStoreUrl: input.appStoreUrl,
            supportEmail: input.supportEmail,
            description: input.description,
            iconImageUrl: input.iconImageUrl || app.iconImageUrl || "",
            updatedAt: now
          }
        : app
    );
  } else {
    db.apps.push({
      id: crypto.randomUUID(),
      name: input.name,
      slug,
      platform: "ios",
      appStoreUrl: input.appStoreUrl,
      supportEmail: input.supportEmail,
      description: input.description,
      iconImageUrl: input.iconImageUrl,
      createdAt: now,
      updatedAt: now
    });
  }
  await writeDb(db);
}

export async function saveAppIcon(file: File) {
  if (file.size > maxIconBytes) {
    throw new Error("アイコン画像は 2MB 以下にしてください。");
  }

  const extension = iconMimeTypes[file.type];
  if (!extension) {
    throw new Error("アイコン画像は PNG、JPEG、WebP、GIF のいずれかを選択してください。");
  }

  const fileName = `${crypto.randomUUID()}.${extension}`;
  await writeFile(path.join(iconDir, fileName), Buffer.from(await file.arrayBuffer()));
  return `${iconPublicPath}/${fileName}`;
}

export async function readAppIcon(fileName: string) {
  if (!/^[a-f0-9-]+\.(gif|jpe?g|png|webp)$/.test(fileName)) {
    return null;
  }

  try {
    return await readFile(path.join(iconDir, fileName));
  } catch {
    return null;
  }
}

export async function listPolicies(appId?: string) {
  const db = await readDb();
  return db.policies
    .filter((policy) => !appId || policy.appId === appId)
    .sort((a, b) => a.locale.localeCompare(b.locale));
}

export async function getPolicy(appId: string, locale: string) {
  const db = await readDb();
  return db.policies.find((policy) => policy.appId === appId && policy.locale === locale) || null;
}

export async function savePolicy(appId: string, locale: string, originalName: string, markdown: string) {
  const db = await readDb();
  const app = db.apps.find((item) => item.id === appId);
  if (!app) {
    throw new Error("アプリが見つかりません。");
  }

  const normalizedLocale = normalizeLocale(locale);
  const now = new Date().toISOString();
  const fileName = `${app.slug}-${normalizedLocale}.md`;
  await writeFile(path.join(policyDir, fileName), markdown, "utf8");

  const title = extractMarkdownTitle(markdown) || `${app.name} Privacy Policy`;
  const existing = db.policies.find((policy) => policy.appId === appId && policy.locale === normalizedLocale);
  if (existing) {
    existing.fileName = fileName;
    existing.title = title;
    existing.updatedAt = now;
  } else {
    db.policies.push({
      id: crypto.randomUUID(),
      appId,
      locale: normalizedLocale,
      fileName,
      title,
      updatedAt: now
    });
  }

  await writeDb(db);
  return originalName;
}

export async function readPolicyMarkdown(policy: PolicyRecord) {
  return readFile(path.join(policyDir, policy.fileName), "utf8");
}

export async function saveContact(input: Omit<ContactRecord, "id" | "createdAt">) {
  const db = await readDb();
  db.contacts.unshift({
    id: crypto.randomUUID(),
    ...input,
    createdAt: new Date().toISOString()
  });
  await writeDb(db);
}

export async function listContacts() {
  const db = await readDb();
  return db.contacts;
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

function extractMarkdownTitle(markdown: string) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim();
}
