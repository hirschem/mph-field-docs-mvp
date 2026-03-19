
import { initDb, getDocuments } from '../../lib/db';
import DeleteButton from './DeleteButton';

export default async function Invoices() {
  await initDb();
  const invoices = await getDocuments('invoice');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '48px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '32px' }}>Field Documents</h1>
      <a href="/invoices/new" style={{ width: '100%', maxWidth: '400px', marginBottom: '24px' }}>
        <button style={{ width: '100%', padding: '20px', fontSize: '1.1rem' }}>Create New Field Doc</button>
      </a>
      {invoices.length === 0 ? (
        <div style={{ marginTop: '16px', fontSize: '1rem', color: '#555' }}>
          No invoices saved yet.
          <a
            href="/invoices/new"
            style={{
              display: 'inline-block',
              marginBottom: '24px',
              padding: '12px 24px',
              fontSize: '1.1rem',
              background: '#0070f3',
              color: '#fff',
              borderRadius: '6px',
              textDecoration: 'none',
            }}
          >
            Create Field Document
          </a>
        </div>
      ) : (
        invoices.map((invoice: any) => (
          <div key={invoice.id} style={{ width: '100%', maxWidth: '400px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '6px', padding: '16px', background: '#fff' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>{invoice.title}</div>
            <div style={{ fontSize: '0.95rem', color: '#888', marginBottom: '8px' }}>{
              (() => {
                const date = new Date(invoice.created_at);
                const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                return `${dateStr} • ${timeStr}`;
              })()
            }</div>
            <a href={`/invoices/${invoice.id}`} style={{ color: '#0070f3', textDecoration: 'underline', marginRight: '16px' }}>View Invoice</a>
            <DeleteButton id={invoice.id} />
          </div>
        ))
      )}
    </div>
  );
}
