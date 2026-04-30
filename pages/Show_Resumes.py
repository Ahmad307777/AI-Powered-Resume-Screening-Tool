import base64
import streamlit as st
import sqlite3
import tempfile
import os
st.set_page_config(page_title="Show Resumes")
mydb = sqlite3.connect('resumes.db', check_same_thread=False)
cur = mydb.cursor()
query0 = """SELECT POSITION FROM HR"""
cur.execute(query0)
positin1 = cur.fetchall()


mydb.commit()
if positin1:
    position1 = list(positin1[0])
    category = position1[0].upper()
    query1 = f"""SELECT NAME,EMAIL,LOCATION,SCORE,RESUME,CATEGORY FROM EMPLOYEES WHERE CATEGORY = ? ORDER BY SCORE DESC"""
    cur.execute(query1, (category,))
    resumes = cur.fetchall()
else:
    category = "NONE"
    resumes = []
    st.warning("No job position set from the HR page yet.")

colms = st.columns((1, 2, 3, 1))
fields = ["Name", 'Email', 'Location', "Resume"]
for col, field_name in zip(colms, fields):
    # header
    col.write(field_name)
c=0
for row in resumes:
    col1, col2, col3, col4, col5 = st.columns((1, 2, 2,1, 1))
    col1.write(row[0])  #name
    col2.write(row[1])  # email
    col3.write(row[2])  # location
    # col4.write(row[3])   # score
    disable_status = "X"  # flexible type of button
    # button_type = "Show" if disable_status else "Seen"
    button_phold = col5.empty()  # create a placeholder
    # do_action = button_phold.button(button_type, key=c)
    do_action = button_phold.button("Show", key=c, type="primary")
    if do_action:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(row[4])
            tmp_path = tmp.name
        with open(tmp_path,"rb") as f:
            base64_pdf = base64.b64encode(f.read()).decode('utf-8')
            pdf_display = f'<iframe src="data:application/pdf;base64,{base64_pdf}" width="800" height="1200" type="application/pdf"></iframe>'
            st.markdown(pdf_display, unsafe_allow_html=True)
        os.unlink(tmp_path)
    c+=1