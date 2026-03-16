"use client";
import { useState } from "react";

export default function TranscribeBookPage() {
  const [file, setFile] = useState<File | null>(null);
  const [generated, setGenerated] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null);
    // Do not clear generated here; user may want to re-upload before generating
  };

  const handleGenerate = () => {
    setGenerated("<b>Sample Book Page Content</b><br>This is a generated book page.");
    setSaved(false);
    setError(null);
  };

  const handleSave = async () => {
    if (!generated) return;
    setLoading(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch('/api/save-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'book',
          title: 'Book Page',
          content_html: generated
        })
      });
      if (res.ok) {
        setSaved(true);
      } else {
        setError("Failed to save book page.");
      }
    } catch {
      setError("Failed to save book page.");
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '48px' }}>
      <a href="/book-pages" style={{ alignSelf: 'flex-start', marginBottom: '16px', fontSize: '1rem', color: '#0070f3', textDecoration: 'underline' }}>Back to Book Pages</a>
      <h1 style={{ fontSize: '2rem', marginBottom: '32px' }}>Transcribe Book Page</h1>
      <input
        type="file"
        accept="image/*"
        style={{ marginBottom: '24px', fontSize: '1rem' }}
        onChange={handleFileChange}
        disabled={loading}
      />
      <button
        style={{ padding: '16px 32px', fontSize: '1.1rem', marginBottom: '16px' }}
        onClick={handleGenerate}
        disabled={loading}
      >
        Generate
      </button>
      <button
        style={{ padding: '12px 24px', fontSize: '1rem', marginBottom: '16px' }}
        onClick={handleSave}
        disabled={!generated || saved || loading}
      >
        Save
      </button>
      <button
        style={{ padding: '12px 24px', fontSize: '1rem', marginBottom: '16px' }}
        onClick={() => window.print()}
        disabled={!generated}
      >
        Print
      </button>
      <div style={{ marginTop: '16px', fontSize: '1rem', color: '#555', border: '1px solid #ddd', padding: '24px', width: '100%', maxWidth: '400px', textAlign: 'center', minHeight: '48px' }}>
        {generated ? <span dangerouslySetInnerHTML={{ __html: generated }} /> : "Transcribed text will appear here."}
      </div>
      {saved && <div style={{ color: 'green', marginTop: '8px' }}>Book page saved.</div>}
      {error && <div style={{ color: 'red', marginTop: '8px' }}>{error}</div>}
    </div>
  );
}
