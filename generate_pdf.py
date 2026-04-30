from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        pass
    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

def clean_text(text):
    # FPDF1/2 Core fonts only support latin-1
    return text.encode('latin-1', 'replace').decode('latin-1')

def create_pdf(md_path, pdf_path):
    pdf = PDF()
    pdf.set_left_margin(20)
    pdf.set_right_margin(20)
    pdf.add_page()
    pdf.set_font("helvetica", size=11)
    
    with open(md_path, "r", encoding="utf-8") as f:
        text = f.read()
        
    text = text.replace("**", "")
    lines = text.split("\n")
    
    for line in lines:
        line = line.strip()
        if not line:
            pdf.ln(5)
            continue
            
        cleaned_line = clean_text(line)
        
        if cleaned_line.startswith("# "):
            pdf.set_font("helvetica", 'B', 16)
            pdf.multi_cell(0, 10, cleaned_line[2:], align='C')
            pdf.set_font("helvetica", size=11)
        elif cleaned_line.startswith("## "):
            pdf.ln(5)
            pdf.set_font("helvetica", 'B', 14)
            pdf.multi_cell(0, 10, cleaned_line[3:])
            pdf.set_font("helvetica", size=11)
        elif cleaned_line.startswith("### "):
            pdf.ln(3)
            pdf.set_font("helvetica", 'B', 12)
            pdf.multi_cell(0, 10, cleaned_line[4:])
            pdf.set_font("helvetica", size=11)
        else:
            pdf.multi_cell(0, 8, cleaned_line)
            
    pdf.output(pdf_path)
    print(f"PDF saved to {pdf_path}")

if __name__ == "__main__":
    md_file = r"c:\Users\namal\Downloads\Resume-Screening-main\Full_Project_Analysis_and_Technical_Report.md"
    pdf_file = r"c:\Users\namal\Downloads\Resume-Screening-main\Full_Project_Analysis_and_Technical_Report.pdf"
    create_pdf(md_file, pdf_file)
