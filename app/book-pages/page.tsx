export default function BookPages() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex flex-col items-center w-full max-w-2xl py-32 px-8 bg-white">
        <nav className="mb-8 w-full flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-2">MPH Field Docs</h1>
          <div className="flex gap-6 text-lg">
            <a href="/invoices" className="font-semibold">Invoices</a>
            <span>|</span>
            <a href="/book-pages" className="font-semibold">Book Pages</a>
          </div>
        </nav>
        <h2 className="text-2xl font-bold mb-6">Book Pages</h2>
        <a href="/book-pages/new" className="mb-6 w-full">
          <button className="w-full py-4 text-xl bg-green-600 text-white rounded-lg font-semibold">Transcribe New Page</button>
        </a>
        <div className="w-full mt-8">
          <h3 className="text-lg font-semibold mb-2">Saved Book Pages</h3>
          <hr className="mb-2" />
          <p className="text-zinc-500">(No book pages saved yet)</p>
        </div>
      </main>
    </div>
  );
}
