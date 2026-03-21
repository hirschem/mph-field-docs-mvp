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
    const { text, clientName, clientAddress } = await req.json();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are an expert construction estimator.
Write in polished, professional contractor language.
Improve clarity, readability, and professionalism.
Expand rough notes into clean client-facing descriptions when appropriate.
Keep the writing practical and grounded in the job details.
Do not sound robotic, overly legal, or overly corporate.
Do not invent major project details that are not reasonably supported by the notes.
Only include a Materials value if materials are actually supported by the notes. Otherwise return an empty string.
Only include a Pricing value if pricing is actually supported by the notes. Otherwise return an empty string.
Your job:
- Clean and interpret the text
- Infer meaning when OCR is unclear
- Ignore obvious OCR noise
- Produce a clean, professional Field Document
Return ONLY valid JSON with these keys:
- scopeOfWork (string)
- materials (string)
- pricing (string)
- clientName (string)
- clientAddress (string)
If a section is not present, return an empty string for that key.
Do NOT explain anything. Do NOT return anything except valid JSON.
Example:
{
  "scopeOfWork": "Paint interior walls and ceilings.",
  "materials": "Sherwin-Williams paint, brushes, tape",
  "pricing": "$2,500",
  "clientName": "John Doe",
  "clientAddress": "123 Main St Denver"
}
`,
        },
        {
          role: "user",
          content: JSON.stringify({ text, clientName, clientAddress }),
        },
      ],
    });

    let parsed;
    try {
      parsed = JSON.parse(completion.choices[0].message.content || '{}');
    } catch {
      parsed = { scopeOfWork: '', materials: '', pricing: '' };
    }

    let docType = "Inspection";
    if (parsed.pricing && parsed.pricing.trim()) {
      docType = "Invoice";
    } else if (parsed.materials && parsed.materials.trim()) {
      docType = "Proposal";
    }

    let html = `
  <div style="margin-bottom: 16px;">
    <h2 style="margin:0 0 4px 0;font-size:1.35em;font-weight:bold;">MPH Construction and Painting</h2>
    720-883-5097<br>
    303-249-4563<br>
    mhirsch60@hotmail.com<br>
    9426 Troon Village Way<br>
    Lone Tree, CO 80124
  </div>

  <div style="margin-bottom: 16px;">
    <strong style="font-size: 16px;">Bill To:</strong><br>
    ${escapeHtml(clientName || "Client Name")}<br>
    ${escapeHtml(clientAddress || "Client Address")}
  </div>

  <h2 style="margin:0 0 16px 0;font-size:1.35em;font-weight:bold;">${docType}</h2>
`;
    if (parsed.scopeOfWork && parsed.scopeOfWork.trim()) {
      html += `<div style="margin-bottom:16px;"><strong style="font-size:16px;">Scope of Work</strong><br>${parsed.scopeOfWork}</div>`;
    }
    if (parsed.materials && parsed.materials.trim()) {
      html += `<div style="margin-bottom:16px;"><strong style="font-size:16px;">Materials</strong><br>${parsed.materials}</div>`;
    }
    if (parsed.pricing && parsed.pricing.trim()) {
      html += `<div style="margin-bottom:16px;"><strong style="font-size:16px;">Total</strong><br>${parsed.pricing}</div>`;
    }

    // Derive title from clientAddress and docType
    let generatedTitle = docType;
    if (parsed.clientAddress && parsed.clientAddress.trim()) {
      const words = parsed.clientAddress.trim().split(/\s+/).slice(0, 2);
      if (words.length >= 2) {
        generatedTitle = `${words.join(" ")} - ${docType}`;
      }
    }
    return Response.json({ html, title: generatedTitle });
  } catch (err) {
    console.error(err);
    return new Response("Error", { status: 500 });
  }
}