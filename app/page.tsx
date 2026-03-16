export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '48px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '32px' }}>MPH Field Docs</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '400px', marginBottom: '32px' }}>
        <a href="/invoices/new" style={{ width: '100%' }}>
          <button style={{ width: '100%', padding: '24px', fontSize: '1.25rem', marginBottom: '8px' }}>Create New Invoice</button>
        </a>
        <a href="/book-pages/new" style={{ width: '100%' }}>
          <button style={{ width: '100%', padding: '24px', fontSize: '1.25rem' }}>Transcribe Book Page</button>
        </a>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
        <a href="/invoices" style={{ fontSize: '1rem', color: '#222', textDecoration: 'underline', marginBottom: '4px' }}>View Invoices</a>
        <a href="/book-pages" style={{ fontSize: '1rem', color: '#222', textDecoration: 'underline' }}>View Book Pages</a>
      </div>
    </div>
  );
}
