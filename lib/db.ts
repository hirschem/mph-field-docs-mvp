import sqlite3 from "sqlite3";
import path from "path";

const dbPath = path.resolve(process.cwd(), "field-docs.db");
const db = new sqlite3.Database(dbPath);

export function initDb(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        content_html TEXT NOT NULL,
        created_at TEXT NOT NULL
      )`,
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

export function saveDocument(
  type: "invoice" | "book",
  title: string,
  content_html: string,
  created_at: string
): Promise<number> {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO documents (type, title, content_html, created_at) VALUES (?, ?, ?, ?)`,
      [type, title, content_html, created_at],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}
