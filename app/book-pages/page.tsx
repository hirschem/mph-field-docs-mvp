export default function BookPages() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '48px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '32px' }}>Book Pages</h1>
      <a href="/book-pages/new" style={{ width: '100%', maxWidth: '400px', marginBottom: '24px' }}>
        <button style={{ width: '100%', padding: '20px', fontSize: '1.1rem' }}>New Book Page</button>
      </a>
      <div style={{ marginTop: '16px', fontSize: '1rem', color: '#555' }}>
        No book pages saved yet.
      </div>
    </div>
  );
}
