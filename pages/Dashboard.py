import streamlit as st
import sqlite3
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from collections import Counter

st.set_page_config(page_title="HR Analytics Dashboard", layout="wide")

st.title("📊 HR Analytics Dashboard")
st.markdown("---")

def load_data():
    conn = sqlite3.connect('resumes.db')
    query = "SELECT * FROM employees"
    df = pd.read_sql(query, conn)
    conn.close()
    return df

try:
    df = load_data()
    
    if df.empty:
        st.warning("No data available yet. Please upload some resumes first!")
    else:
        # Top Metrics
        col1, col2, col3, col4 = st.columns(4)
        col1.metric("Total Applications", len(df))
        col2.metric("Unique Categories", df['category'].nunique())
        col3.metric("Avg. Match Score", f"{df['score'].mean():.1f}%")
        col4.metric("Top Location", df['location'].mode()[0] if not df['location'].mode().empty else "N/A")

        st.markdown("### 📈 Application Insights")
        
        c1, c2 = st.columns(2)
        
        with c1:
            # Category Breakdown
            category_counts = df['category'].value_counts().reset_index()
            category_counts.columns = ['Category', 'Applicants']
            fig_category = px.bar(category_counts, x='Applicants', y='Category', orientation='h', 
                                 title="Applicants by Category", color='Applicants', color_continuous_scale='Viridis')
            st.plotly_chart(fig_category, use_container_width=True)
            
        with c2:
            # Match Quality by Category
            avg_score = df.groupby('category')['score'].mean().reset_index()
            avg_score.columns = ['Category', 'Avg Score']
            fig_score = px.line(avg_score, x='Category', y='Avg Score', title="Average Match Quality per Category", markers=True)
            fig_score.update_traces(line_color='#FF4B4B')
            st.plotly_chart(fig_score, use_container_width=True)

        st.markdown("### 🔍 Skill & Location Insights")
        
        c3, c4 = st.columns(2)
        
        with c3:
            # Skill Distribution
            all_skills = []
            for skills in df['matched_skills'].dropna():
                if skills:
                    all_skills.extend([s.strip() for s in skills.split(',') if s.strip()])
            
            if all_skills:
                skill_counts = Counter(all_skills).most_common(10)
                skill_df = pd.DataFrame(skill_counts, columns=['Skill', 'Frequency'])
                fig_skills = px.pie(skill_df, values='Frequency', names='Skill', title="Top 10 Matched Skills (Selection Drivers)", hole=0.3)
                st.plotly_chart(fig_skills, use_container_width=True)
            else:
                st.info("No skill match data available.")

        with c4:
            # Location Distribution
            loc_counts = df['location'].value_counts().reset_index()
            loc_counts.columns = ['Location', 'Count']
            fig_loc = px.treemap(loc_counts, path=['Location'], values='Count', title="Candidate Location Distribution")
            st.plotly_chart(fig_loc, use_container_width=True)

        # Raw Data View (Optional Toggle)
        with st.expander("View Detailed Candidate Records"):
            st.dataframe(df[['Name', 'Email', 'location', 'category', 'score', 'matched_skills']], use_container_width=True)

except Exception as e:
    st.error(f"Error loading dashboard: {e}")
    st.info("Make sure you have processed some resumes and the database is correct.")
