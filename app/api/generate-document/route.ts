// No changes needed, code already matches requirements.

import OpenAI from "openai";

function getClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });
}

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

    const client = getClient();
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `

You will be given multiple images representing one document. Treat them as sequential pages of the same job.

Rewrite each scope item in clear, professional residential construction language suitable for a high-end client.

Expand shorthand notes into complete, polished, client-facing descriptions while preserving the original meaning.

Preserve ALL original work items. Do not omit anything. Do not invent new scope beyond what is reasonably supported.

Each work item should be written as a clear, descriptive sentence that reads naturally to a homeowner, not as a short list fragment.

Avoid shorthand or bullet-style phrasing. Each item should feel like a brief professional description of the work performed.

Write in clean, client-facing sections. Each line item should be a short, well-written description (1–2 sentences max), not shorthand fragments.

Tone must reflect an experienced residential general contractor: confident, clear, and professional — not robotic, not overly corporate.

The project overview should be general and high-level only. Do NOT include detailed task breakdowns in the overview.
---

IMAGE + EXTRACTION RULES:

- The images are the PRIMARY source of truth.

- Read ALL provided images as one continuous document.
- Do not finalize output until every image has been processed.
- Extract ALL work items and ALL dollar amounts across ALL images.

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
- Do not start every line item with verbs like "Install", "Demo", or "Prep". Vary phrasing and write each item as a natural, professional description of the work performed.
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
- The pricing value must equal the sum of all amounts in lineItems when lineItems are present.
- Do not return a pricing total that conflicts with the extracted lineItems.
- If a final handwritten total is visible and it matches the line items, use it.
- If a final handwritten total is visible but conflicts with the extracted lineItems, prioritize internal consistency so pricing equals the sum of lineItems.
- Preserve numeric values even if messy.
- Only return empty pricing if absolutely no price exists.

---

MATERIALS RULE:
- Only include materials if they are explicitly written in the document. If not, return an empty string.

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
            ...images.flatMap((img: string, index: number) => [
  {
    type: "text",
    text: `Page ${index + 1} of ${images.length}`
  },
  {
    type: "image_url",
    image_url: { url: img }
  }
])
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

    // Calculate pricing from lineItems if present
    if (Array.isArray(parsed.lineItems) && parsed.lineItems.length > 0) {
      const sum = parsed.lineItems.reduce((acc: number, item: { amount?: string }) => {
        if (item && typeof item.amount === 'string') {
          const num = Number(item.amount.replace(/[^\d.\-]/g, ''));
          return acc + (isNaN(num) ? 0 : num);
        }
        return acc;
      }, 0);
      parsed.pricing = sum > 0 ? `$${sum.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})}` : '';
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
        parsed.lineItems.map((item: { description: string; amount: string }) => `${escapeHtml(item.description)} — ${escapeHtml(item.amount)}`).join('<br>') +
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