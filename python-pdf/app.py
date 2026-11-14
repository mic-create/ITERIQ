import os
import uuid
from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
from pdf_builder import build_attendance_pdf

app = FastAPI(title="ITERIQ PDF Generation Microservice", version="1.0.0")

PDF_SERVICE_TOKEN = os.getenv("PDF_SERVICE_TOKEN", "bells-iteriq-pdf-secret-token-2026")

def verify_token(x_pdf_service_token: Optional[str] = Header(None)):
    if not x_pdf_service_token or x_pdf_service_token != PDF_SERVICE_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid or missing PDF service authentication token.")
    return True

class AttendanceRecordModel(BaseModel):
    full_name: str
    matric_number: str
    academic_level: str
    timestamp: str

class PdfGenerationRequest(BaseModel):
    institution: str = "Bells University of Technology, Ota"
    course_code: str
    course_title: str
    academic_level: str
    venue_name: str
    session_date: str
    total_count: int
    representative_name: str
    records: List[AttendanceRecordModel]

@app.post("/generate-pdf", dependencies=[Depends(verify_token)])
def generate_pdf_endpoint(payload: PdfGenerationRequest):
    filename = f"ITERIQ_{payload.course_code.replace(' ', '')}_{payload.academic_level.replace(' ', '')}_{uuid.uuid4().hex[:6]}.pdf"
    output_path = os.path.join("/tmp", filename)

    try:
        build_attendance_pdf(payload.dict(), output_path)
        return FileResponse(output_path, media_type="application/pdf", filename=filename)
    except Exception as e:
        print(f"PDF Generation Error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF register: {str(e)}")

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "ITERIQ Python PDF Microservice"}