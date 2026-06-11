import base64
import streamlit as st
import sqlite3
import tempfile
import os

# --- Page Config & Aesthetics ---
st.set_page_config(page_title="Filtered Resumes", layout="wide")

# Custom CSS for Premium Design
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Outfit', sans-serif;
    }
    
    .title-gradient {
        background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 800;
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
    }
    
    /* Table row divider */
    .row-divider {
        margin: 0.5em 0;
        opacity: 0.15;
    }
    
    /* Badge for category */
    .cat-badge {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #fff;
        border-radius: 12px;
        padding: 2px 10px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        display: inline-block;
    }
</style>
""", unsafe_allow_html=True)

st.markdown('<h1 class="title-gradient">📂 Filtered Candidates</h1>', unsafe_allow_html=True)
st.markdown("Browse resumes matching the currently active HR department requirement rule.")
st.markdown("---")

mydb = sqlite3.connect('resumes.db', check_same_thread=False)
cur = mydb.cursor()

# Get active HR position
cur.execute("SELECT POSITION FROM HR")
pos_row = cur.fetchone()

if pos_row:
    category = pos_row[0].upper()
    st.info(f"Showing results filtered for category: **{category}**")
    
    # Query matching employees
    cur.execute("SELECT NAME, EMAIL, LOCATION, SCORE, RESUME, CATEGORY, STATUS FROM employees WHERE CATEGORY = ? ORDER BY SCORE DESC", (category,))
    resumes = cur.fetchall()
else:
    category = "NONE"
    resumes = []
    st.warning("⚠️ No recruitment position has been configured from the Recruiter Dashboard yet.")

if resumes:
    # Grid Headers
    colms = st.columns((2, 2.5, 2, 1.5, 1.5))
    fields = ["Name", 'Email', 'Location', "Score", "Action"]
    for col, field_name in zip(colms, fields):
        col.write(f"**{field_name}**")
    
    st.markdown("<hr style='margin: 0.5em 0; opacity: 0.3;' />", unsafe_allow_html=True)
    
    # Render candidate rows
    for c, row in enumerate(resumes):
        col1, col2, col3, col4, col5 = st.columns((2, 2.5, 2, 1.5, 1.5))
        col1.write(row[0])  # Name
        col2.write(row[1])  # Email
        col3.write(row[2])  # Location
        col4.write(f"**{row[3]:.1f}%**")  # Score
        
        button_phold = col5.empty()
        do_action = button_phold.button("View CV", key=f"btn_{c}", type="primary")
        
        if do_action:
            st.markdown("---")
            st.subheader(f"📄 Resume Document: {row[0]}")
            try:
                # Save binary resume to temp PDF file and display
                with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                    tmp.write(row[4])
                    tmp_path = tmp.name
                
                with open(tmp_path, "rb") as f:
                    base64_pdf = base64.b64encode(f.read()).decode('utf-8')
                    pdf_display = f'<iframe src="data:application/pdf;base64,{base64_pdf}" width="100%" height="800" type="application/pdf"></iframe>'
                    st.markdown(pdf_display, unsafe_allow_html=True)
                
                os.unlink(tmp_path)
            except Exception as e:
                st.error(f"Failed to load pdf file: {e}")
            st.markdown("---")
            
        st.markdown("<hr class='row-divider' />", unsafe_allow_html=True)
else:
    st.info(f"No candidates matching '{category}' category have registered yet.")

mydb.close()