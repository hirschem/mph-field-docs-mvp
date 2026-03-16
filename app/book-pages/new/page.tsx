"use client";

export default function TranscribeBookPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '48px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '32px' }}>Transcribe Book Page</h1>
      <input
        type="file"
        accept="image/*"
        style={{ marginBottom: '24px', fontSize: '1rem' }}
      />
      <button style={{ padding: '16px 32px', fontSize: '1.1rem', marginBottom: '32px' }}>Generate</button>
      <div style={{ marginTop: '16px', fontSize: '1rem', color: '#555', border: '1px solid #ddd', padding: '24px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        Transcribed text will appear here.
      </div>
    </div>
  );
}
