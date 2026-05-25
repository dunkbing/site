import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as {
      topic: string;
      text: string;
      user: unknown;
    };

    if (!body.topic || !body.text) {
      return Response.json(
        { error: "Topic and text are required" },
        { status: 400 },
      );
    }

    const entry = {
      topic: body.topic,
      text: body.text,
      user: body.user,
      timestamp: new Date().toISOString(),
    };

    console.log("[feedback] Received feedback:", entry);

    await env.DB99_KV.put(
      `feedback:${crypto.randomUUID()}`,
      JSON.stringify(entry),
    );

    return Response.json({ result: "ok" });
  } catch (error) {
    console.error("[feedback] Error processing feedback:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};
