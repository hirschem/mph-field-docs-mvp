// No changes needed, code already matches requirements.
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
    const { text = "", clientName = "", clientAddress = "", images = [] } = await req.json();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `

Rewrite each scope item in clear, professional residential construction language suitable for a high-end client.

Expand shorthand notes into complete, polished, client-facing descriptions while preserving the original meaning.

Preserve ALL original work items. Do not omit anything. Do not invent new scope beyond what is reasonably supported.

Each work item should read as a clean, standalone line that a homeowner can easily understand.

Avoid paragraph blocks. Maintain a structured, line-separated format.

Tone must reflect an experienced residential general contractor: confident, clear, and professional — not robotic, not overly corporate.

---

IMAGE + EXTRACTION RULES:

- The images are the PRIMARY source of truth.
- OCR text is unreliable and should only be used as a fallback.
- If there is any conflict, TRUST THE IMAGE.

- Read the entire document carefully from top to bottom.
- Extract ALL visible work items.
- Extract ALL visible dollar amounts.

- DO NOT summarize.
- DO NOT combine multiple items into one.

---

LINE ITEM EXTRACTION (CRITICAL):

- lineItems is REQUIRED if any dollar amounts appear in the document.
- You MUST extract individual priced items into lineItems.
- Each priced item MUST be its own entry.
- Do NOT skip lineItems even if scopeOfWork is present.
- Do NOT collapse priced work into scopeOfWork.
- Capture as many individual priced entries as possible.

---

DOCUMENT TYPE:

Return documentType as one of:
"Invoice", "Proposal", or "Inspection"

Rules:
- Completed work with totals → "Invoice"
- Future/planned work → "Proposal"
- Notes without pricing → "Inspection"

---

PRICING RULES:

- If ANY dollar amount exists, pricing MUST be filled.
- Use the final handwritten total when available.
- Preserve numeric values even if messy.
- Only return empty pricing if absolutely no price exists.

---

OUTPUT FORMAT:

Return ONLY valid JSON with:

- clientName (string)
- clientAddress (string)
- documentType (string)
- scopeOfWork (string)
- materials (string)
- pricing (string)
- lineItems (array of objects with description and amount)

If a section is missing, return empty string or empty array.

Do NOT explain anything.
Do NOT include markdown.
Do NOT include code fences.

---

EXAMPLE:

{
  "clientName": "John Doe",
  "clientAddress": "123 Main St Denver",
  "documentType": "Invoice",
  "scopeOfWork": "Prepare and paint interior walls and ceilings.",
  "materials": "Sherwin-Williams paint, masking materials, rollers and brushes",
  "pricing": "$2,500",
  "lineItems": [
    { "description": "Paint living room walls and ceiling", "amount": "$1,000" },
    { "description": "Paint kitchen walls and ceiling", "amount": "$1,500" }
  ]
}
`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: JSON.stringify({ text, clientName, clientAddress })
            },
            ...images.map((img: string) => ({ type: "image_url", image_url: { url: img } }))
          ],
        },
      ],
    });

    let parsed;
    try {
      parsed = JSON.parse(completion.choices[0].message.content || '{}');
    } catch {
      parsed = { scopeOfWork: '', materials: '', pricing: '', lineItems: [] };
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
    ${escapeHtml(parsed.clientName || "Client Name")}<br>
    ${escapeHtml(parsed.clientAddress || "Client Address")}
  </div>

  <h2 style="margin:0 0 16px 0;font-size:1.35em;font-weight:bold;">${parsed.documentType || ""}</h2>
`;
    if (parsed.scopeOfWork && parsed.scopeOfWork.trim()) {
      html += `<div style="margin-bottom:16px;"><strong style="font-size:16px;">Scope of Work</strong><br>${parsed.scopeOfWork}</div>`;
    }
    if (parsed.materials && parsed.materials.trim()) {
      html += `<div style="margin-bottom:16px;"><strong style="font-size:16px;">Materials</strong><br>${parsed.materials}</div>`;
    }
    if (Array.isArray(parsed.lineItems) && parsed.lineItems.length > 0) {
      html += `<div style=\"margin-bottom:16px;\"><strong style=\"font-size:16px;\">Line Items</strong><br>` +
        parsed.lineItems.map((item: { description: string; amount: string }) => `${escapeHtml(item.description)} ${escapeHtml(item.amount)}`).join('<br>') +
        `</div>`;
    }
    if (parsed.pricing && parsed.pricing.trim()) {
      html += `<div style="margin-bottom:16px;"><strong style="font-size:16px;">Total</strong><br>${parsed.pricing}</div>`;
    }

    // Derive title from clientAddress and documentType
    let generatedTitle = parsed.documentType || "";
    if (parsed.clientAddress && parsed.clientAddress.trim()) {
      const words = parsed.clientAddress.trim().split(/\s+/).slice(0, 2);
      if (words.length >= 2) {
        generatedTitle = `${words.join(" ")} - ${parsed.documentType || ""}`;
      }
    }
    return Response.json({ html, title: generatedTitle });
  } catch (err) {
    console.error(err);
    return new Response("Error", { status: 500 });
  }
}