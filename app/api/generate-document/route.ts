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

Rewrite each scope item in clear, professional residential construction language
Expand shorthand notes into complete, client-facing descriptions where appropriate
Preserve all original work items, do not omit anything
Do not invent new scope beyond what is reasonably supported
Maintain structured line-separated format (one item per line)
Keep tone consistent with an experienced general contractor

Rules:

        Rules:
        - The images are the PRIMARY source of truth.
        - The OCR text is UNRELIABLE and should only be used as a fallback.
        - If there is ANY conflict between OCR text and the images, TRUST THE IMAGES.
        - Extract ALL visible line items from the images.
        - DO NOT summarize or combine line items.
        - Each line item must remain separate.
        - Capture EVERY visible dollar amount.
        - Do NOT omit any priced item.
        - The uploaded image is the primary source of truth. Use the OCR text only as a helper.
        - This is often a handwritten contractor invoice or estimate photographed from a phone.
        - Read the full document carefully from top to bottom.
        - Extract as many recognizable line items as possible.
        - Do not reduce a multi-line invoice into one short summary if multiple work items are visible.
        - When a final handwritten total is present, use that final total for pricing.
        - Prefer the top handwritten client name and address from the image over OCR text when visible.
        - If the page itself says “Invoice” or “Invoice/Estimate,” strongly prefer documentType: "Invoice" unless the content clearly reads like a forward-looking estimate only.

You must return one additional JSON key: documentType. Allowed values are exactly: "Invoice", "Proposal", or "Inspection".

Rules for documentType:
- If the source document is labeled invoice, invoice/estimate, amount due, or shows charges/totals for completed work, return "Invoice"
- If it is a quote/estimate/proposed work before completion, return "Proposal"
- If it contains observations/notes without pricing, return "Inspection"

IMPORTANT:
If the OCR text contains any total, amount due, balance, estimate, price, cost, or dollar amount, it must be returned in pricing.
Dollar amounts and numeric totals should be preserved even if OCR is messy.
pricing should only be empty if no price-related value appears anywhere in the notes.

Your job:
- Clean and interpret the text
- Infer meaning when OCR is unclear
- Ignore obvious OCR noise
- Produce a clean, professional Field Document
Return ONLY valid JSON with these keys:
- clientName (string)
- clientAddress (string)
- documentType (string)
- scopeOfWork (string)
- materials (string)
- pricing (string)
- lineItems (array of objects with description (string) and amount (string))
If a section is not present, return an empty string or empty array for that key.
Extract every recognizable priced line item from the document.
Preserve as many individual amounts as possible.
Do not collapse multiple priced items into one total.
Use the final handwritten total as pricing if present.
Do NOT explain anything. Do NOT return anything except valid JSON.
Example:
{
  "clientName": "John Doe",
  "clientAddress": "123 Main St Denver",
  "documentType": "Invoice",
  "scopeOfWork": "Paint interior walls and ceilings.",
  "materials": "Sherwin-Williams paint, brushes, tape",
  "pricing": "$2,500",
  "lineItems": [
    { "description": "Paint living room", "amount": "$1,000" },
    { "description": "Paint kitchen", "amount": "$1,500" }
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