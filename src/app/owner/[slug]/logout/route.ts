import { clearSessionCookie } from "@/lib/auth";
import { adminPath, isAdminSlug } from "@/lib/admin-path";
import { redirectTo } from "@/lib/http";

export async function POST(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isAdminSlug(slug)) {
    return new Response(null, { status: 404 });
  }

  const response = redirectTo(`${adminPath(slug)}/login`);
  clearSessionCookie(response);
  return response;
}
