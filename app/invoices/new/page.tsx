"use client";
import { useState } from "react";

export default function NewInvoice() {
  const [generated, setGenerated] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setGenerated("<b>Sample Invoice Content</b><br>This is a generated invoice.");
    setSaved(false);
    setEmailSent(false);
  };

  const handleSave = async () => {
    if (!generated) return;
    setLoading(true);
    setSaved(false);
    try {
      const res = await fetch('/api/save-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'invoice',
          title: 'Invoice',
          content_html: generated
        })
      });
      if (res.ok) {
        setSaved(true);
      }
    } catch {}
    setLoading(false);
  };

  const handleEmail = () => {
    setLoading(true);
    setTimeout(() => {
      setEmailSent(true);
      setLoading(false);
    }, 500); // Simulate email
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '48px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '32px' }}>Create Invoice</h1>
      <input
        type="file"
        accept="image/*"
        style={{ marginBottom: '24px', fontSize: '1rem' }}
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
        onClick={handleEmail}
        disabled={!saved || emailSent || loading}
      >
        Email
      </button>
      <div style={{ marginTop: '16px', fontSize: '1rem', color: '#555', border: '1px solid #ddd', padding: '24px', width: '100%', maxWidth: '400px', textAlign: 'center', minHeight: '48px' }}>
        {generated ? <span dangerouslySetInnerHTML={{ __html: generated }} /> : "Generated invoice will appear here."}
      </div>
      {saved && <div style={{ color: 'green', marginTop: '8px' }}>Invoice saved.</div>}
      {emailSent && <div style={{ color: 'blue', marginTop: '8px' }}>Invoice emailed.</div>}
    </div>
  );
}
