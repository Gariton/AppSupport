const ADMOB_CERTIFICATION_AUTHORITY_ID = "f08c47fec0942fa0";

export const dynamic = "force-dynamic";

function getAppAdsTxt() {
  const publisherId = process.env.ADMOB_PUBLISHER_ID?.trim();
  if (!publisherId) {
    return null;
  }

  return `google.com, ${publisherId}, DIRECT, ${ADMOB_CERTIFICATION_AUTHORITY_ID}\n`;
}

export function GET() {
  const appAdsTxt = getAppAdsTxt();
  if (!appAdsTxt) {
    return new Response(null, { status: 404 });
  }

  return new Response(appAdsTxt, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
