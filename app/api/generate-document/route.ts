import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:`
You are an expert construction estimator.

You will receive messy OCR text from job site notes.

Your job:
- Clean and interpret the text
- Infer meaning when OCR is unclear
- Ignore obvious OCR noise
- Produce a clean, professional Field Document

Format output as clean HTML with these sections ONLY if relevant:

1. Scope of Work
- Clear bullet-style or paragraph description of the job

2. Materials (only if mentioned or implied)

3. Total / Pricing (only if mentioned)

Rules:
- Do NOT include raw OCR text
- Do NOT explain anything
- Do NOT include headings that are empty
- Make reasonable assumptions if needed (this is critical)
- Write like a professional contractor document

Return ONLY HTML. No markdown. No explanation.
`
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    const html = completion.choices[0].message.content || "<p>No output</p>";

    return Response.json({ html });
  } catch (err) {
    console.error(err);
    return new Response("Error", { status: 500 });
  }
}