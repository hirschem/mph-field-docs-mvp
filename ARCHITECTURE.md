MPH Field Docs MVP — Architecture
Purpose
MPH Field Docs is a simple internal tool designed for a construction contractor to:
Generate invoices from photos
Transcribe handwritten book notes
Save important documents in an organized library
Email generated documents instantly
This application is intentionally minimal and workflow-focused.
The goal is to support the following workflow:
Upload → Generate → Save → Email

Everything in the system must support this workflow.

Core Principles
1. No Overengineering
This is a rapid MVP intended to be usable immediately.
The system must not include:
authentication
user accounts
passwords
roles
permissions
complex architecture
microservices
advanced abstractions
unnecessary frameworks
If a feature does not support the core workflow, it does not belong in this MVP.

2. Documents Are Only Saved Intentionally
Generation does not automatically save documents.
A document becomes permanent only when the user presses Save.
This prevents clutter in the document libraries.
Document states:
Temporary document
Generated but not saved

Saved document
Stored in the database and visible in the library

If the user leaves the page without saving, the generated document is discarded.

3. Separate Workspaces
The application contains two separate workspaces:
Invoices
Book Pages

Each workspace has its own saved document library.
Documents from these two categories are never mixed in the UI.

System Architecture
The system contains only three layers.
Browser UI
      ↓
Next.js API Routes
      ↓
SQLite Database

No additional services are required.

Application Navigation
Navigation is present on all pages.
MPH Field Docs

Invoices | Book Pages

These links represent the two primary workspaces.

Pages
Total pages: 5
/
Home

/invoices
Invoices workspace

/invoices/new
Create new invoice

/book-pages
Book transcription workspace

/book-pages/new
Create new book transcription


Page Descriptions
Home
Entry point to the application.
UI:
MPH Field Docs

[ Invoices ]
[ Book Pages ]

Buttons navigate to the appropriate workspace.

Invoices Page
Purpose: invoice workspace.
UI:
Invoices

[ Create New Invoice ]

Saved Invoices
-------------------------
Invoice - Mar 16
Invoice - Mar 14
Invoice - Mar 12

Documents listed here come from the database where:
type = "invoice"


Book Pages Page
Purpose: book transcription workspace.
UI:
Book Pages

[ Transcribe New Page ]

Saved Book Pages
-------------------------
Page - Mar 16
Page - Mar 15
Page - Mar 13

Documents listed here come from the database where:
type = "book"


New Invoice Page
Route:
/invoices/new

Workflow:
Upload Images
↓
Generate
↓
Preview Result
↓
Save Invoice
Email

Generation does not save automatically.
The result preview appears on the same page.

New Book Page
Route:
/book-pages/new

Same UI and workflow as invoice generation.
The only difference is the generation prompt used internally.

Document Generation Flow
Upload images
      ↓
POST /api/generate
      ↓
OCR / AI processing
      ↓
Return formatted HTML
      ↓
Display preview

The document remains temporary until the user presses Save.

Save Flow
When the user presses Save:
Generated document
      ↓
POST /api/save-document
      ↓
Insert into SQLite database
      ↓
Appears in Saved Library


Email Flow
When the user presses Email:
Enter email address
      ↓
POST /api/email
      ↓
Send generated HTML as email body

Email does not require saving first.

Database
The application uses a single SQLite database.
Location:
/data/documents.db


Database Schema
Table: documents
documents
---------------------------
id
type
title
content_html
created_at


Field Descriptions
id
Primary key.

type
Defines the document category.
Allowed values:
invoice
book

Used to filter documents in the UI.

title
Automatically generated title.
Examples:
Invoice - Mar 16 2:45 PM
Book Page - Mar 16 3:10 PM


content_html
Formatted HTML representation of the generated document.
Displayed directly in the UI.

created_at
Timestamp indicating when the document was saved.

File Upload Handling
Uploaded images are temporary.
Images are used only during the generation process.
Images are not stored in the database for the MVP.
This prevents unnecessary storage complexity.

API Routes
The system uses three API endpoints.
POST /api/generate
POST /api/save-document
POST /api/email


/api/generate
Input:
mode
files

Mode values:
invoice
book

Returns:
generated HTML document

This endpoint does not write to the database.

/api/save-document
Input:
type
title
content_html

Stores the document in SQLite.

/api/email
Input:
email
html_content

Sends the generated document via email.

Folder Structure
mph-field-docs-mvp
│
├─ app
│   ├─ page.tsx
│   │
│   ├─ invoices
│   │   ├─ page.tsx
│   │   └─ new
│   │       └─ page.tsx
│   │
│   └─ book-pages
│       ├─ page.tsx
│       └─ new
│           └─ page.tsx
│
├─ app/api
│   ├─ generate
│   │   └─ route.ts
│   ├─ save-document
│   │   └─ route.ts
│   └─ email
│       └─ route.ts
│
├─ lib
│   ├─ db.ts
│   ├─ generate.ts
│   └─ email.ts
│
├─ data
│   └─ documents.db
│
└─ ARCHITECTURE.md


Development Phases
The application will be built in the following order:
UI skeleton
Generation endpoint
Result preview
Save document
Saved libraries
Email feature
No additional features should be added until these phases are complete.

MVP Success Criteria
The MVP is considered successful if a user can:
1. Upload photos
2. Generate a document
3. Save the document to the correct library
4. Email the document instantly

If the system supports this workflow simply and reliably, the MVP is complete.

Litmus Test
At any point during development, ask:
Could a non-technical contractor complete this workflow in under 30 seconds?
If the answer is no, simplify the design.

Future Expansion (Not Part of MVP)
Possible future tools:
Inspection Reports
Estimates
Job Notes
Client Reports

These tools should reuse the same document generation and storage system.
They are not part of this MVP.
