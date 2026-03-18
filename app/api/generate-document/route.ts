export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files");

    console.log("FILES RECEIVED:", files.length);

    return Response.json({
      html: `<div><strong>Received ${files.length} image(s)</strong></div>`,
    });
  } catch {
    return new Response("Error", { status: 500 });
  }
}