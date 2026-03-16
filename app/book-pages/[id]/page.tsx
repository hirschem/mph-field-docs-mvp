import { getDocumentById, initDb } from '../../../lib/db';

export default async function BookPageDetail({ params }: { params: { id: string } }) {
  await initDb();
  const id = Number(params.id);
  if (!id || isNaN(id)) {
    return (
      <div style={{ marginTop: '48px', textAlign: 'center', fontSize: '1.2rem' }}>Invalid book page id.</div>
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
      <div style={{ fontSize: '0.95rem', color: '#888', marginBottom: '24px' }}>{doc.created_at}</div>
      <div style={{ border: '1px solid #ddd', padding: '24px', width: '100%', maxWidth: '500px', textAlign: 'left', minHeight: '48px' }}>
        <span dangerouslySetInnerHTML={{ __html: doc.content_html }} />
      </div>
    </div>
  );
}
