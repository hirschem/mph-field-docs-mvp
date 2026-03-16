import { initDb, getDocuments } from "../../../lib/db";

export async function GET(request: Request) {
  try {
    await initDb();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type !== "invoice" && type !== "book") {
      return new Response(JSON.stringify({ error: "Invalid type" }), {
        status: 400,
      });
    }

    const documents = await getDocuments(type);

    return new Response(JSON.stringify({ documents }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}