"use client";
// ...existing code...
import { useRef } from "react";

export default function NewInvoice() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = () => {
    const files = fileInputRef.current?.files;
    const fileNames = files ? Array.from(files).map(f => f.name) : [];
    console.log("mode: invoice", "files:", fileNames);
  };

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
        <h2 className="text-2xl font-bold mb-6">Create New Invoice</h2>
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png"
          multiple
          className="mb-6 w-full border rounded-lg p-2"
        />
        <button
          className="w-full py-4 text-xl bg-blue-600 text-white rounded-lg font-semibold"
          onClick={handleGenerate}
        >
          Generate Invoice
        </button>
      </main>
    </div>
  );
}
