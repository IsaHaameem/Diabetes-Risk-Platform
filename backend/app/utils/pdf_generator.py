from fpdf import FPDF
import tempfile
import os

def create_patient_report(patient_data: dict, prediction_result: dict) -> str:
    pdf = FPDF()
    pdf.add_page()
    
    # Title
    pdf.set_font("Arial", 'B', 16)
    pdf.cell(200, 10, txt="Diabetes Risk Intelligence Report", ln=True, align='C')
    pdf.ln(10)
    
    # Risk Summary
    pdf.set_font("Arial", 'B', 14)
    pdf.cell(200, 10, txt="Risk Assessment Summary", ln=True)
    pdf.set_font("Arial", '', 12)
    pdf.cell(200, 10, txt=f"Risk Level: {prediction_result['risk_level']}", ln=True)
    pdf.cell(200, 10, txt=f"Probability: {prediction_result['probability'] * 100:.1f}%", ln=True)
    pdf.ln(5)
    
    # Patient Data
    pdf.set_font("Arial", 'B', 14)
    pdf.cell(200, 10, txt="Patient Clinical Metrics", ln=True)
    pdf.set_font("Arial", '', 12)
    for key, value in patient_data.items():
        pdf.cell(200, 8, txt=f"{key}: {value}", ln=True)
    pdf.ln(5)
    
    # Recommendations
    pdf.set_font("Arial", 'B', 14)
    pdf.cell(200, 10, txt="Clinical Recommendations", ln=True)
    pdf.set_font("Arial", '', 12)
    for rec in prediction_result.get('recommendations', []):
        pdf.multi_cell(0, 8, txt=f"- {rec}")
    
    # Save to temp file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    pdf.output(temp_file.name)
    return temp_file.name