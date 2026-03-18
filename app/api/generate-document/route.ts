import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are an expert construction estimator.

You will receive messy OCR text from job site notes.

Your job:
- Clean and interpret the text
- Infer meaning when OCR is unclear
- Ignore obvious OCR noise
- Produce a clean, professional Field Document

Return ONLY valid JSON with these keys:
- scopeOfWork (string)
- materials (string)
- pricing (string)
If a section is not present, return an empty string for that key.
Do NOT explain anything. Do NOT return anything except valid JSON.
Example:
{
  "scopeOfWork": "Paint interior walls and ceilings.",
  "materials": "Sherwin-Williams paint, brushes, tape",
  "pricing": "$2,500"
}
`,
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    let parsed;
    try {
      parsed = JSON.parse(completion.choices[0].message.content || '{}');
    } catch {
      parsed = { scopeOfWork: '', materials: '', pricing: '' };
    }

    let html = '<h2 style="margin:0 0 16px 0;font-size:1.35em;font-weight:bold;">Field Document</h2>';
    if (parsed.scopeOfWork && parsed.scopeOfWork.trim()) {
      html += `<div style="margin-bottom:16px;"><strong style="font-size:16px;">Scope of Work</strong><br>${parsed.scopeOfWork}</div>`;
    }
    if (parsed.materials && parsed.materials.trim()) {
      html += `<div style="margin-bottom:16px;"><strong style="font-size:16px;">Materials</strong><br>${parsed.materials}</div>`;
    }
    if (parsed.pricing && parsed.pricing.trim()) {
      html += `<div style="margin-bottom:16px;"><strong style="font-size:16px;">Total</strong><br>${parsed.pricing}</div>`;
    }

    return Response.json({ html });
  } catch (err) {
    console.error(err);
    return new Response("Error", { status: 500 });
  }
}