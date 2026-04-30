import streamlit as st
import sqlite3
import pandas as pd
import base64
import tempfile
import os
st.title("HR's Requirement")
categories = ['ACCOUNTANT', 'ADVOCATE', 'AGRICULTURE', 'APPAREL', 'ARTS', 'AUTOMOBILE', 'AVIATION', 'Automation Testing', 'BANKING', 'BPO', 'BUSINESS-DEVELOPMENT', 'Blockchain', 'Business Analyst', 'CHEF', 'CONSTRUCTION', 'CONSULTANT', 'Civil Engineer', 'DESIGNER', 'DIGITAL-MEDIA', 'Data Science', 'Database', 'DevOps Engineer', 'DotNet Developer', 'ENGINEERING', 'ETL Developer', 'Electrical Engineering', 'FINANCE', 'FITNESS', 'HEALTHCARE', 'HR', 'Hadoop', 'Health and fitness', 'INFORMATION-TECHNOLOGY', 'Java Developer', 'Mechanical Engineer', 'Network Security Engineer', 'Operations Manager', 'PMO', 'PUBLIC-RELATIONS', 'Python Developer', 'SALES', 'SAP Developer', 'Sales', 'TEACHER', 'Testing', 'Web Designing']
with st.form("HR form"):
    position = st.selectbox(label = "Position", options=categories, help="Please select the required position from the available categories")
    exp = st.text_input(label = "Minimum Experience (in years)", placeholder="Please enter the minimum experience required (in years)")
    submitted = st.form_submit_button("Submit")
mydb = sqlite3.connect('resumes.db', check_same_thread=False)
cur = mydb.cursor()   
if submitted:
    
    position=position.lower()
    exp=int(exp)
    
    
    query0 = """DELETE FROM HR"""
    cur.execute(query0)
    mydb.commit()
    query = """INSERT INTO HR (Position,Experience) VALUES (?,?)"""
    value = (position,exp)
    cur.execute(query,value)
    mydb.commit()
# Initialize session state for showing resumes and selecting specialized view
if 'show_resumes' not in st.session_state:
    st.session_state.show_resumes = False
if 'view_resume_index' not in st.session_state:
    st.session_state.view_resume_index = None

if st.button("Show Resumes"):
    st.session_state.show_resumes = True

if st.session_state.show_resumes:
    query1 = """SELECT NAME,EMAIL,LOCATION,SCORE,RESUME,CATEGORY,STATUS,REASONING FROM EMPLOYEES ORDER BY SCORE DESC"""
    cur.execute(query1)
    resumes = cur.fetchall()

    if not resumes:
        st.info("No candidates found matching the current requirement.")
    else:
        colms = st.columns((1, 1.5, 1, 1, 1, 1))
        fields = ["Name", 'Email', "Score", "Category", "Status", "Action"]
        for col, field_name in zip(colms, fields):
            col.write(f"**{field_name}**")
        
        st.divider()
        
        for i, row in enumerate(resumes):
            col1, col2, col3, col4, col5, col6 = st.columns((1, 1.5, 1, 1, 1, 1))
            col1.write(row[0])  # Name
            col2.write(row[1])  # Email
            col3.write(f"{row[3]:.1f}%")  # Score
            col4.write(row[5])  # Category
            
            # Status badge
            status_color = "green" if row[6] == "Selected" else "red"
            col5.markdown(f"<span style='color:{status_color}; font-weight:bold;'>{row[6]}</span>", unsafe_allow_html=True)
            
            if col6.button("View Details", key=f"view_{i}", type="primary"):
                st.session_state.view_resume_index = i
            
            st.divider()

        # Display selected resume and AI report
        if st.session_state.view_resume_index is not None and st.session_state.view_resume_index < len(resumes):
            selected_row = resumes[st.session_state.view_resume_index]
            
            st.markdown("---")
            st.header(f"📋 AI Selection Report: {selected_row[0]}")
            
            # Merit Analysis Section
            r1, r2 = st.columns([1, 2])
            with r1:
                st.metric("Match Score", f"{selected_row[3]:.1f}%")
                status_box = "✅ SELECTED" if selected_row[6] == "Selected" else "❌ REJECTED"
                st.subheader(status_box)
            with r2:
                st.info(f"**AI Reasoning:** {selected_row[7]}")

            st.write("### Resume Preview")
            try:
                with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                    tmp.write(selected_row[4])
                    tmp_path = tmp.name
                
                with open(tmp_path, "rb") as f:
                    base64_pdf = base64.b64encode(f.read()).decode('utf-8')
                    pdf_display = f'<iframe src="data:application/pdf;base64,{base64_pdf}" width="100%" height="800" type="application/pdf"></iframe>'
                    st.markdown(pdf_display, unsafe_allow_html=True)
                
                st.download_button(
                    label="Download Resume",
                    data=selected_row[4],
                    file_name=f"{selected_row[0]}_Resume.pdf",
                    mime="application/pdf"
                )
                
                os.unlink(tmp_path)
            except Exception as e:
                st.error(f"Error displaying resume: {e}")
            
            if st.button("Close Viewer"):
                st.session_state.view_resume_index = None
                st.rerun()