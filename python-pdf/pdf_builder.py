import os
from reportlab.lib.pagesizes import A4, landscape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """Canvas for multi-page support with 'Page X of Y' numbering and running header/footer."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor('#718096'))
        
        # Header rule & text
        self.setStrokeColor(colors.HexColor('#1b4d3e'))
        self.setLineWidth(1)
        self.line(40, A4[0] - 30, A4[1] - 40, A4[0] - 30)
        self.drawString(40, A4[0] - 25, "ITERIQ | OFFICIAL ATTENDANCE REGISTER — BELLS UNIVERSITY OF TECHNOLOGY")
        
        # Footer rule & page number
        self.line(40, 40, A4[1] - 40, 40)
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(A4[1] - 40, 25, page_str)
        self.drawString(40, 25, "Certified Academic Document — Generated securely via ITERIQ Engine")
        self.restoreState()

def build_attendance_pdf(data: dict, output_filepath: str):
    # Landscape A4 dimensions: width = 841.89, height = 595.27
    doc = SimpleDocTemplate(
        output_filepath,
        pagesize=landscape(A4),
        rightMargin=40,
        leftMargin=40,
        topMargin=50,
        bottomMargin=50
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#1b4d3e')
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor('#c05621')
    )
    
    cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=12,
        textColor=colors.HexColor('#2d3748')
    )
    
    header_cell_style = ParagraphStyle(
        'TableHeaderCell',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=12,
        textColor=colors.white
    )

    elements = []

    # Title & Metadata Banner
    elements.append(Paragraph("OFFICIAL ATTENDANCE REGISTER", title_style))
    elements.append(Paragraph(f"Bells University of Technology, Ota — {data.get('institution', 'ITERIQ System')}", subtitle_style))
    elements.append(Spacer(1, 15))

    meta_data = [
        [
            Paragraph(f"<b>Course Code:</b> {data.get('course_code')}", cell_style),
            Paragraph(f"<b>Course Title:</b> {data.get('course_title')}", cell_style),
            Paragraph(f"<b>Academic Level:</b> {data.get('academic_level')}", cell_style)
        ],
        [
            Paragraph(f"<b>Lecture Venue:</b> {data.get('venue_name')}", cell_style),
            Paragraph(f"<b>Session Date:</b> {data.get('session_date')}", cell_style),
            Paragraph(f"<b>Total Present:</b> {data.get('total_count')}", cell_style)
        ]
    ]
    
    meta_table = Table(meta_data, colWidths=[200, 300, 234.18])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f5f3ee')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    
    elements.append(meta_table)
    elements.append(Spacer(1, 20))

    # Attendance Table Data Construction
    table_data = [[
        Paragraph("S/N", header_cell_style),
        Paragraph("Student Full Name", header_cell_style),
        Paragraph("Matriculation Number", header_cell_style),
        Paragraph("Academic Level", header_cell_style),
        Paragraph("Verification Timestamp", header_cell_style),
        Paragraph("Status", header_cell_style)
    ]]

    records = data.get('records', [])
    for idx, rec in enumerate(records, start=1):
        table_data.append([
            Paragraph(str(idx), cell_style),
            Paragraph(str(rec.get('full_name', '')), cell_style),
            Paragraph(str(rec.get('matric_number', '')), cell_style),
            Paragraph(str(rec.get('academic_level', '')), cell_style),
            Paragraph(str(rec.get('timestamp', '')), cell_style),
            Paragraph("Verified Present", cell_style)
        ])

    attendance_table = Table(table_data, colWidths=[40, 220, 160, 100, 154.18, 100], repeatRows=1)
    attendance_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1b4d3e')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#1b4d3e')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#fcfbf9')])
    ]))

    elements.append(attendance_table)
    elements.append(Spacer(1, 30))

    # Signature Area
    sig_data = [
        [
            Paragraph("<b>Course Representative Signature:</b> ___________________________", cell_style),
            Paragraph("<b>Assistant Rep Signature:</b> ___________________________", cell_style)
        ],
        [
            Paragraph(f"Name: {data.get('representative_name', 'Course Representative')}", cell_style),
            Paragraph("Name: _______________________________", cell_style)
        ]
    ]
    
    sig_table = Table(sig_data, colWidths=[382.09, 382.09])
    sig_table.setStyle(TableStyle([
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    
    elements.append(sig_table)

    doc.build(elements, canvasmaker=NumberedCanvas)