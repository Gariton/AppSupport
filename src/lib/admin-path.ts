export function adminSlug() {
  return sanitizeSlug(process.env.ADMIN_SLUG || "owner-console");
}

export function adminPath(slug = adminSlug()) {
  return `/owner/${slug}`;
}

export function isAdminSlug(slug: string) {
  return sanitizeSlug(slug) === adminSlug();
}

function sanitizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
