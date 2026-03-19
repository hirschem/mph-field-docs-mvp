import { getDocumentById, initDb } from '../../../lib/db';

export default async function InvoiceDetail({ params }: { params: Promise<{ id: string }> }) {
  await initDb();
  const { id: idParam } = await params;
  const id = Number(idParam);

  if (!idParam || !id || isNaN(id)) {
    return (
      <div style={{ marginTop: '48px', textAlign: 'center', fontSize: '1.2rem' }}>Invalid invoice id.</div>
    );
  }

  const doc = await getDocumentById(id);
  if (!doc || doc.type !== 'book') {
    return (
      <div style={{ marginTop: '48px', textAlign: 'center', fontSize: '1.2rem' }}>Book page not found.</div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '48px' }}>
      <a href="/book-pages" style={{ alignSelf: 'flex-start', marginBottom: '16px', fontSize: '1rem', color: '#0070f3', textDecoration: 'underline' }}>Back to Book Pages</a>
      <h1 style={{ fontSize: '2rem', marginBottom: '24px' }}>{doc.title}</h1>
      <div style={{ fontSize: '0.95rem', color: '#888', marginBottom: '24px' }}>{
        (() => {
          const date = new Date(doc.created_at);
          const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
          return `${dateStr} • ${timeStr}`;
        })()
      }</div>
      <div style={{ border: '1px solid #ddd', padding: '24px', width: '100%', maxWidth: '500px', textAlign: 'left', minHeight: '48px' }}>
        <span dangerouslySetInnerHTML={{ __html: doc.content_html }} />
      </div>
    </div>
  );
}
