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
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error("SQLITE OPEN ERROR", err);
      } else {
        console.log("SQLite connected");
      }
    });
  }
  return db;
}

export function initDb(): Promise<void> {
  return new Promise((resolve, reject) => {
    const dbInstance = getDb();
    if (!dbInstance) {
      console.error("DB is null");
      return resolve();
    }
    dbInstance.run(
      `CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        content_html TEXT NOT NULL,
        created_at TEXT NOT NULL
      )`,
      (err) => {
        if (err) {
          console.error("INIT DB ERROR", err);
          resolve();
        } else resolve();
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
    const dbInstance = getDb();
    if (!dbInstance) {
      console.error("DB is null");
      return resolve(0);
    }
    dbInstance.run(
      `INSERT INTO documents (type, title, content_html, created_at) VALUES (?, ?, ?, ?)`,
      [type, title, content_html, created_at],
      function (err) {
        if (err) {
          console.error("SAVE ERROR", err);
          resolve(0);
        } else resolve(this.lastID);
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
    const dbInstance = getDb();
    if (!dbInstance) {
      console.error("DB is null");
      return resolve([]);
    }
    dbInstance.all(
      `SELECT id, type, title, content_html, created_at
       FROM documents
       WHERE type = ?
       ORDER BY created_at DESC`,
      [type],
      (err, rows) => {
        if (err) {
          console.error("GET DOCUMENTS ERROR", err);
          resolve([]);
        } else resolve(rows as {
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
    const dbInstance = getDb();
    if (!dbInstance) {
      console.error("DB is null");
      return resolve(undefined);
    }
    dbInstance.get(
      `SELECT id, type, title, content_html, created_at FROM documents WHERE id = ?`,
      [id],
      (err, row) => {
        if (err) {
          console.error("GET DOCUMENT BY ID ERROR", err);
          resolve(undefined);
        } else resolve(row as
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