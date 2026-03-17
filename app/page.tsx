export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '48px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '32px' }}>MPH Field Docs</h1>
      <style>{`
        .homepage-action-btn {
          display: block;
          width: 100%;
          padding: 12px 20px;
          font-size: 1.1rem;
          border: 1px solid #ccc;
          border-radius: 6px;
          background: #f9f9f9;
          color: #222;
          text-decoration: none;
          text-align: center;
          transition: background 0.15s ease;
          cursor: pointer;
        }
        .homepage-action-btn:hover {
          background: #f0f0f0;
        }
      `}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '400px', marginBottom: '32px' }}>
        <a href="/invoices/new" className="homepage-action-btn">Create New Field Document</a>
        <a href="/book-pages/new" className="homepage-action-btn">Transcribe Book Page</a>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px', width: '100%', maxWidth: '400px' }}>
        <a href="/invoices" className="homepage-action-btn">View Field Docs</a>
        <a href="/book-pages" className="homepage-action-btn">View Book Pages</a>
      </div>
    </div>
  );
}
