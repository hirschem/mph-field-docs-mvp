import { initDb, getDocuments } from '../../lib/db';

export default async function Invoices() {
  await initDb();
  const invoices = await getDocuments('invoice');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '48px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '32px' }}>Invoices</h1>
      <a href="/invoices/new" style={{ width: '100%', maxWidth: '400px', marginBottom: '24px' }}>
        <button style={{ width: '100%', padding: '20px', fontSize: '1.1rem' }}>Create New Invoice</button>
      </a>
      {invoices.length === 0 ? (
        <div style={{ marginTop: '16px', fontSize: '1rem', color: '#555' }}>
          No invoices saved yet.
        </div>
      ) : (
        <div style={{ marginTop: '24px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {invoices.map((doc) => (
            <div key={doc.id} style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '8px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '8px' }}>{doc.title}</div>
              <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '8px' }}>{doc.created_at}</div>
              <div dangerouslySetInnerHTML={{ __html: doc.content_html }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
