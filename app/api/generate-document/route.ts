import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  console.log("OCR ROUTE HIT");

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    const { createWorker } = await import("tesseract.js");
    const worker = await createWorker({ logger: () => {} });
    await worker.loadLanguage("eng");
    await worker.initialize("eng");

    let extractedText = "";

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const {
        data: { text },
      } = await worker.recognize(buffer);

      extractedText += text + "\n\n";
    }

    await worker.terminate();

    return Response.json({
      html: `<pre>${extractedText || "No text found"}</pre>`,
    });
  } catch (err) {
    console.error(err);
    return new Response("Error", { status: 500 });
  }
}