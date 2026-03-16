import { NextRequest, NextResponse } from 'next/server';
import { initDb } from '../../../lib/db';
import sqlite3 from "sqlite3";
import path from "path";

export async function POST(req: NextRequest) {
  let id: number | undefined;
  try {
    const data = await req.json();
    id = data.id;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (typeof id !== 'number') {
    return NextResponse.json({ error: 'Missing or invalid id' }, { status: 400 });
  }
  try {
    await initDb();
    const dbPath = path.resolve(process.cwd(), "field-docs.db");
    const db = new sqlite3.Database(dbPath);
    const result = await new Promise<{ changes: number }>((resolve, reject) => {
      db.run('DELETE FROM documents WHERE id = ?', [id], function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });
    db.close();
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
