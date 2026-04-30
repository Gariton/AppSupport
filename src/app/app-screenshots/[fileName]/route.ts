import { readAppScreenshot } from "@/lib/store";

const contentTypes: Record<string, string> = {
  gif: "image/gif",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp"
};

export async function GET(_request: Request, { params }: { params: Promise<{ fileName: string }> }) {
  const { fileName } = await params;
  const screenshot = await readAppScreenshot(fileName);
  if (!screenshot) {
    return new Response(null, { status: 404 });
  }

  const extension = fileName.split(".").pop() || "";

  return new Response(screenshot, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": contentTypes[extension] || "application/octet-stream"
    }
  });
}
