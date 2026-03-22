import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";

const dbPath =
  process.env.NODE_ENV === "production"
    ? "/data/field-docs.db"
    : path.resolve(process.cwd(), "field-docs.db");

// 🔴 ADD THIS BLOCK
if (process.env.NODE_ENV === "production") {
  try {
    if (!fs.existsSync("/data")) {
      fs.mkdirSync("/data", { recursive: true });
    }

    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, "");
    }
  } catch (err) {
    console.error("DB FILE SETUP FAILED", err);
  }
}

let db: sqlite3.Database | null = null;

function getDb() {
  if (!db) {
    db = new sqlite3.Database(dbPath);
  }
  return db;
}

export function initDb(): Promise<void> {
  return new Promise((resolve, reject) => {
    getDb().run(
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
    getDb().run(
      `INSERT INTO documents (type, title, content_html, created_at) VALUES (?, ?, ?, ?)`,
      [type, title, content_html, created_at],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

export function getDocuments(type: "invoice" | "book"): Promise<
  {
    id: number;
    type: string;
    title: string;
    content_html: string;
    created_at: string;
  }[]
> {
  return new Promise((resolve, reject) => {
    getDb().all(
      `SELECT id, type, title, content_html, created_at
       FROM documents
       WHERE type = ?
       ORDER BY created_at DESC`,
      [type],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows as {
          id: number;
          type: string;
          title: string;
          content_html: string;
          created_at: string;
        }[]);
      }
    );
  });
}

export function getDocumentById(id: number): Promise<{
  id: number;
  type: string;
  title: string;
  content_html: string;
  created_at: string;
} | undefined> {
  return new Promise((resolve, reject) => {
    getDb().get(
      `SELECT id, type, title, content_html, created_at FROM documents WHERE id = ?`,
      [id],
      (err, row) => {
        if (err) reject(err);
        else resolve(row as
          | {
              id: number;
              type: string;
              title: string;
              content_html: string;
              created_at: string;
            }
          | undefined);
      }
    );
  });
}