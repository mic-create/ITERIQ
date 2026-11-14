# ITERIQ Environment Setup Guide

## 1. Prerequisites
- Node.js (v18+ recommended)
- Python (v3.10+)
- Supabase Account & Project

## 2. Environment Configuration
1. Copy `.env.example` to `.env` in the root directory.
2. Populate Supabase URL and API keys from your Supabase project dashboard.
3. Configure port settings and Python microservice URL.

## 3. Installation & Local Development
- **Backend & Frontend Dependencies**: Run `npm install` in the root directory.
- **Python PDF Service**: Navigate to `python-pdf/`, create a virtual environment (`python -m venv venv`), activate it, and install requirements (`pip install -r requirements.txt`).

## 4. Deployment (Render)
- Deploy Node.js service using root `package.json`.
- Deploy Python FastAPI service using `python-pdf/requirements.txt` and `python-pdf/app.py`.
# ITERIQ Environment Setup Guide

## PDF Service Environment Variables
- `PDF_SERVICE_URL`: URL of the deployed Python FastAPI PDF service (e.g., `https://iteriq-pdf-service.onrender.com`).
- `PDF_SERVICE_TOKEN`: Shared secret token required by both the Node.js backend and Python FastAPI service for secure communication.