📄 MPH Field Docs MVP

AI-powered document generation tool for real-world field use.

Overview

This project is an in-progress MVP designed to help contractors generate clean, client-ready documents from photos of handwritten notes or job site details.

The goal is to simplify document creation for non-technical users by combining image input with AI-powered structuring and formatting.

Current Capabilities
📸 Upload one or more images
🤖 AI processes images to extract structured information
🧾 Generates formatted document previews
💾 Save and view generated documents
🖨️ Print-friendly document views
In Progress / Challenges
Improving multi-image consistency (ensuring all images are used reliably)
Refining document structure and formatting logic
Handling edge cases in AI output (missing fields, inconsistent data)
Mobile UI adjustments and readability fixes
Tech Stack
Next.js (App Router), TypeScript
OpenAI (multimodal image processing)
SQLite
Railway (Dockerized deployment)
Why This Project

Built to solve a real problem: helping a non-technical user generate professional documents directly from field notes without relying on file downloads or complex tools.

Local Development
npm install
npm run dev