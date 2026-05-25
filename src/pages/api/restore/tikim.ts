import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

const KEY = "tikim:restore-allowed";

export const POST: APIRoute = async ({ request }) => {
  console.log("[tikim], syncing restore allowed status");
  const body = (await request.json()) as { restoreAllowed: boolean };
  const restoreAllowed = Boolean(body?.restoreAllowed);
  await env.DB99_KV.put(KEY, String(restoreAllowed));
  return Response.json({ result: "ok" });
};

export const GET: APIRoute = async () => {
  console.log("[tikim], getting restore allowed status");
  const value = await env.DB99_KV.get(KEY);
  if (!value) return Response.json({ result: false });
  return Response.json({ result: value === "true" });
};
