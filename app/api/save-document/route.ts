import { initDb, saveDocument } from "../../../lib/db";

export async function POST(request: Request) {
  try {
    await initDb();

    const body = await request.json();
    const { type, title, content_html } = body || {};

    if (type !== "invoice" && type !== "book") {
      return new Response(JSON.stringify({ error: "Invalid type" }), {
        status: 400,
      });
    }

    if (!title || typeof title !== "string" || !title.trim()) {
      return new Response(JSON.stringify({ error: "Title required" }), {
        status: 400,
      });
    }

    if (
      !content_html ||
      typeof content_html !== "string" ||
      !content_html.trim()
    ) {
      return new Response(JSON.stringify({ error: "Content required" }), {
        status: 400,
      });
    }

    await saveDocument(type, title, content_html, new Date().toISOString());

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}