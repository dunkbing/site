import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

const PREFIX = "tikim";

export const POST: APIRoute = async ({ request, params }) => {
  console.log("[tikim], syncing pro status");
  const body = (await request.json()) as { isPro: boolean };
  const isPro = Boolean(body?.isPro);
  const id = params.id!;
  await env.DB99_KV.put(`${PREFIX}:${id}`, String(isPro));
  return Response.json({ result: "ok" });
};

export const GET: APIRoute = async ({ params }) => {
  console.log("[tikim], getting pro status");
  const id = params.id!;
  const value = await env.DB99_KV.get(`${PREFIX}:${id}`);
  if (!value) return Response.json({ result: false });
  return Response.json({ result: value === "true" });
};
