import { mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const dataDir = path.resolve(process.argv[2] || process.env.DATA_DIR || ".data");
const dbPath = path.join(dataDir, "db.json");
const databaseName = process.env.CLOUDFLARE_D1_DATABASE || "gariton-site";
const bucketName = process.env.CLOUDFLARE_R2_BUCKET || "gariton-site-uploads";
const temporaryDir = await mkdtemp(path.join(tmpdir(), "gariton-cloudflare-migration-"));

try {
  const database = JSON.parse(await readFile(dbPath, "utf8"));
  const sqlPath = path.join(temporaryDir, "data.sql");
  await writeFile(sqlPath, buildSql(database), "utf8");

  runWrangler(["d1", "migrations", "apply", databaseName, "--remote"]);
  runWrangler(["d1", "execute", databaseName, "--remote", "--yes", "--file", sqlPath]);

  await uploadDirectory(path.join(dataDir, "icons"), "icons");
  await uploadDirectory(path.join(dataDir, "screenshots"), "screenshots");
  await uploadDirectory(path.join(dataDir, "policies"), "policies");

  console.log("Cloudflareへのデータ移行が完了しました。");
} finally {
  await rm(temporaryDir, { recursive: true, force: true });
}

function buildSql(database) {
  const statements = ["PRAGMA foreign_keys = ON;"];

  for (const app of database.apps || []) {
    statements.push(`INSERT OR REPLACE INTO apps (
      id, name, slug, platform, app_store_url, support_email, description,
      has_in_app_purchases, supported_languages, icon_image_url, screenshots, created_at, updated_at
    ) VALUES (${[
      app.id,
      app.name,
      app.slug,
      "ios",
      app.appStoreUrl || "",
      app.supportEmail || "",
      app.description || "",
      app.hasInAppPurchases ? 1 : 0,
      JSON.stringify(app.supportedLanguages || []),
      app.iconImageUrl || "",
      JSON.stringify(app.screenshots || []),
      app.createdAt,
      app.updatedAt
    ].map(sqlValue).join(", ")});`);
  }

  for (const policy of database.policies || []) {
    statements.push(`INSERT OR REPLACE INTO policies (id, app_id, locale, file_name, title, updated_at) VALUES (${[
      policy.id,
      policy.appId,
      policy.locale,
      policy.fileName,
      policy.title,
      policy.updatedAt
    ].map(sqlValue).join(", ")});`);
  }

  for (const contact of database.contacts || []) {
    statements.push(`INSERT OR REPLACE INTO contacts (
      id, app_id, category, name, email, message, email_status, created_at
    ) VALUES (${[
      contact.id,
      contact.appId || null,
      contact.category || "app-support",
      contact.name,
      contact.email,
      contact.message,
      contact.emailStatus || "not-configured",
      contact.createdAt
    ].map(sqlValue).join(", ")});`);
  }

  return `${statements.join("\n")}\n`;
}

function sqlValue(value) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") return String(value);
  return `'${String(value).replaceAll("'", "''")}'`;
}

async function uploadDirectory(directory, prefix) {
  try {
    if (!(await stat(directory)).isDirectory()) return;
  } catch {
    return;
  }

  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    runWrangler([
      "r2",
      "object",
      "put",
      `${bucketName}/${prefix}/${entry.name}`,
      "--remote",
      "--file",
      path.join(directory, entry.name)
    ]);
  }
}

function runWrangler(args) {
  const result = spawnSync("npx", ["wrangler", ...args], { stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`wrangler ${args.slice(0, 3).join(" ")} が失敗しました。`);
  }
}
