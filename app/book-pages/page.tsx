export const dynamic = "force-dynamic";

import { initDb, getDocuments } from '../../lib/db';
import DeleteButton from '../invoices/DeleteButton';

export default async function BookPages() {
  await initDb();
  const bookPages = await getDocuments('book');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '48px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '32px' }}>Book Pages</h1>
      <a href="/book-pages/new" style={{ width: '100%', maxWidth: '400px', marginBottom: '24px' }}>
        <button style={{ width: '100%', padding: '20px', fontSize: '1.1rem' }}>New Book Page</button>
      </a>
      {bookPages.length === 0 ? (
        <div style={{ marginTop: '16px', fontSize: '1rem', color: '#555' }}>
          No book pages saved yet.
        </div>
      ) : (
        <div style={{ marginTop: '24px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {bookPages.map((doc) => (
            <div key={doc.id} style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '8px', position: 'relative' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '8px' }}>{doc.title}</div>
              <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '8px' }}>
                {
                  (() => {
                    const date = new Date(doc.created_at);
                    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                    return `${dateStr} \u2022 ${timeStr}`;
                  })()
                }
              </div>
              <a href={`/book-pages/${doc.id}`} style={{ fontSize: '0.95rem', color: '#0070f3', textDecoration: 'underline', marginBottom: '8px', display: 'inline-block' }}>View Book Page</a>
              <DeleteButton id={doc.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
