import streamlit as st
import sqlite3
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from collections import Counter

# --- Page Config & Aesthetics ---
st.set_page_config(page_title="HR Analytics Dashboard", layout="wide")

# Custom CSS for Premium Design
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Outfit', sans-serif;
    }
    
    /* Elegant Title Gradient */
    .title-gradient {
        background: linear-gradient(135deg, #f857a6 0%, #ff5858 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 800;
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
    }
    
    /* Metric Cards Grid */
    .metric-card {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 1.5rem;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(10px);
    }
    
    .metric-title {
        font-size: 12px;
        text-transform: uppercase;
        color: #aaa;
        letter-spacing: 1px;
        margin-bottom: 8px;
    }
    
    .metric-value {
        font-size: 2.2rem;
        font-weight: 700;
        color: #fff;
    }
    
    /* Section Headers */
    .section-header {
        font-size: 20px;
        font-weight: 600;
        color: #fff;
        margin-top: 2rem;
        margin-bottom: 1rem;
        border-left: 4px solid #ff5858;
        padding-left: 10px;
    }
</style>
""", unsafe_allow_html=True)

st.markdown('<h1 class="title-gradient">📊 HR Analytics & Insights</h1>', unsafe_allow_html=True)
st.markdown("Real-time telemetry and algorithmic screening statistics across all candidates.")
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
        st.warning("⚠️ No applicant records are currently registered. Run candidate uploads to populate this dashboard.")
    else:
        # Custom Metrics Grid
        c1, c2, c3, c4 = st.columns(4)
        
        with c1:
            st.markdown(f"""
            <div class="metric-card">
                <div class="metric-title">Total Applicants</div>
                <div class="metric-value" style="color: #ff5858;">{len(df)}</div>
            </div>
            """, unsafe_allow_html=True)
            
        with c2:
            st.markdown(f"""
            <div class="metric-card">
                <div class="metric-title">Unique Categories</div>
                <div class="metric-value" style="color: #f857a6;">{df['category'].nunique()}</div>
            </div>
            """, unsafe_allow_html=True)
            
        with c3:
            st.markdown(f"""
            <div class="metric-card">
                <div class="metric-title">Avg. Match Score</div>
                <div class="metric-value" style="color: #00e676;">{df['score'].mean():.1f}%</div>
            </div>
            """, unsafe_allow_html=True)
            
        with c4:
            top_loc = df['location'].mode()[0] if not df['location'].mode().empty else "N/A"
            st.markdown(f"""
            <div class="metric-card">
                <div class="metric-title">Primary Pool Location</div>
                <div class="metric-value" style="color: #00e5ff; font-size: 1.5rem; padding-top: 10px;">{top_loc}</div>
            </div>
            """, unsafe_allow_html=True)

        # Plotly custom styles helper
        def apply_plotly_theme(fig):
            fig.update_layout(
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                font=dict(color='#ffffff', family='Outfit'),
                title_font=dict(size=16, color='#ffffff'),
                margin=dict(t=50, b=20, l=20, r=20)
            )
            fig.update_xaxes(showgrid=True, gridcolor='rgba(255,255,255,0.05)', zeroline=False)
            fig.update_yaxes(showgrid=True, gridcolor='rgba(255,255,255,0.05)', zeroline=False)
            return fig

        st.markdown('<div class="section-header">📈 Core Funnel Metrics</div>', unsafe_allow_html=True)
        
        col_chart1, col_chart2 = st.columns(2)
        
        with col_chart1:
            category_counts = df['category'].value_counts().reset_index()
            category_counts.columns = ['Category', 'Applicants']
            fig_category = px.bar(
                category_counts, x='Applicants', y='Category', orientation='h', 
                title="Applicants by Category Profile",
                color='Applicants',
                color_continuous_scale='Magma'
            )
            apply_plotly_theme(fig_category)
            st.plotly_chart(fig_category, use_container_width=True)
            
        with col_chart2:
            avg_score = df.groupby('category')['score'].mean().reset_index()
            avg_score.columns = ['Category', 'Avg Score']
            fig_score = px.line(
                avg_score, x='Category', y='Avg Score', 
                title="Algorithmic Match Quality Trend", 
                markers=True
            )
            fig_score.update_traces(line_color='#ff5858', marker=dict(size=8, color='#f857a6'))
            apply_plotly_theme(fig_score)
            st.plotly_chart(fig_score, use_container_width=True)

        st.markdown('<div class="section-header">🔍 Skills & Geospatial Insights</div>', unsafe_allow_html=True)
        
        col_chart3, col_chart4 = st.columns(2)
        
        with col_chart3:
            all_skills = []
            for skills in df['matched_skills'].dropna():
                if skills:
                    all_skills.extend([s.strip() for s in skills.split(',') if s.strip()])
            
            if all_skills:
                skill_counts = Counter(all_skills).most_common(10)
                skill_df = pd.DataFrame(skill_counts, columns=['Skill', 'Frequency'])
                fig_skills = px.pie(
                    skill_df, values='Frequency', names='Skill', 
                    title="Top 10 Driver Skills (Keywords Matched)", 
                    hole=0.4,
                    color_discrete_sequence=px.colors.sequential.RdPu_r
                )
                apply_plotly_theme(fig_skills)
                st.plotly_chart(fig_skills, use_container_width=True)
            else:
                st.info("No skill matches recorded yet.")
                
        with col_chart4:
            loc_counts = df['location'].value_counts().reset_index()
            loc_counts.columns = ['Location', 'Count']
            fig_loc = px.treemap(
                loc_counts, path=['Location'], values='Count', 
                title="Geo Distribution of Candidates",
                color_discrete_sequence=px.colors.qualitative.Pastel
            )
            apply_plotly_theme(fig_loc)
            st.plotly_chart(fig_loc, use_container_width=True)

        # Raw Table Viewer
        st.markdown('<div class="section-header">📋 Detailed Records View</div>', unsafe_allow_html=True)
        with st.expander("Expand Applicant Records Table"):
            st.dataframe(
                df[['Name', 'Email', 'location', 'category', 'score', 'status', 'matched_skills']], 
                use_container_width=True
            )

except Exception as e:
    st.error(f"Error loading dashboard: {e}")
    st.info("Check if candidates have been successfully parsed and stored in resumes.db.")
