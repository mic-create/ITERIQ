# ITERIQ System Architecture

## 1. Overview
ITERIQ is a Single Page Application (SPA) built with Vanilla JavaScript (ES Modules), HTML5, and CSS3 on the frontend, powered by an Express.js and Node.js backend, backed by Supabase (PostgreSQL + Auth), and integrated with a dedicated Python FastAPI + ReportLab microservice for deterministic PDF attendance register generation.

## 2. PDF Generation Microservice
- **Service**: Python FastAPI (`python-pdf/app.py`).
- **Engine**: ReportLab (`python-pdf/pdf_builder.py`) using custom A4 landscape canvas (`NumberedCanvas`) for dynamic page numbering and publication-quality typography.
- **Security**: Authenticated via private `X-Pdf-Service-Token` header sent securely from the Node.js backend.