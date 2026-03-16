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
  if (!doc || doc.type !== 'invoice') {
    return (
      <div style={{ marginTop: '48px', textAlign: 'center', fontSize: '1.2rem' }}>Invoice not found.</div>
    );
  }
  return (
    <div className="invoice-detail-root" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '48px' }}>
      <style>{`
        @media print {
          .invoice-detail-controls,
          .invoice-detail-back {
            display: none !important;
          }
          .invoice-detail-root {
            align-items: stretch !important;
            margin-top: 0 !important;
          }
          .invoice-detail-content {
            border: none !important;
            padding: 0 !important;
            max-width: none !important;
            width: 100% !important;
            box-shadow: none !important;
          }
          .invoice-detail-title,
          .invoice-detail-meta {
            text-align: left !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
        }
      `}</style>
      <div className="invoice-detail-controls" style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '500px', marginBottom: '8px', alignItems: 'center' }}>
        <a
          href="/invoices"
          className="invoice-detail-back"
          style={{
            fontSize: '1rem',
            color: '#0070f3',
            textDecoration: 'underline',
            marginRight: 'auto'
          }}
        >
          Back to Invoices
        </a>
        <button
          id="print-btn"
          type="button"
          style={{
            fontSize: '1rem',
            padding: '6px 16px',
            background: '#f5f5f5',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Print
        </button>
      </div>
      <h1 className="invoice-detail-title" style={{ fontSize: '2rem', marginBottom: '24px' }}>{doc.title}</h1>
      <div className="invoice-detail-meta" style={{ fontSize: '0.95rem', color: '#888', marginBottom: '24px' }}>{doc.created_at}</div>
      <div
        className="invoice-detail-content"
        style={{
          border: '1px solid #ddd',
          padding: '24px',
          width: '100%',
          maxWidth: '500px',
          textAlign: 'left',
          minHeight: '48px'
        }}
      >
        <span dangerouslySetInnerHTML={{ __html: doc.content_html }} />
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              var btn = document.getElementById('print-btn');
              if (btn) {
                btn.addEventListener('click', function() {
                  window.print();
                });
              }
            });
          `
        }}
      />
    </div>
  );
}