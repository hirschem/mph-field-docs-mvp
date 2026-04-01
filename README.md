# MPH Field Docs MVP

AI-powered document generation tool for real-world field use.

## Overview

MPH Field Docs MVP is an in-progress web application designed to help contractors generate clean, client-ready documents from photos of handwritten notes or job site details.

The project is being built around a simple workflow for non-technical users: upload images, generate a document, review it, save it, and print or email it without dealing with complicated file management.

## Current Capabilities

- Upload one or more images
- Process images with AI to extract structured information
- Generate formatted document previews
- Save generated documents
- View saved documents in separate libraries
- Print documents from a clean detail view

## In Progress / Current Challenges

- Improving multi-image consistency so all uploaded images are used reliably
- Refining document structure and formatting logic
- Handling edge cases in AI-generated output
- Improving mobile styling and readability
- Tightening reliability across the full upload-to-save workflow

## Why This Project Exists

This project was created to solve a real workflow problem for a non-technical field user who needs a simple way to turn rough notes and photos into professional-looking documents.

The focus is not just on generating output, but on making the overall experience usable in the field for someone who does not want to manage downloads, complex editing tools, or confusing interfaces.

## Tech Stack

- Next.js (App Router)
- TypeScript
- OpenAI API
- SQLite
- Railway
- Docker

## Project Focus

This MVP is focused on:

- AI-assisted document generation from image input
- Clear and readable output formatting
- Real-world workflow design for non-technical users
- Handling messy inputs and incomplete source material
- Iterating on reliability and edge cases during development

## Status

This is an active MVP in development, not a finished product.

The system already supports the core document-generation flow, but it is still being refined for consistency, formatting quality, and mobile usability.

## Local Development

Install dependencies:

```bash
npm install