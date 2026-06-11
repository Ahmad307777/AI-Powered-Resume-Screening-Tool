"""
Phase 1: Data Preparation Script
- Deduplicates UpdatedResumeDataSet.csv (166 unique rows)
- Decodes PerfectResumeDataSet.csv integer labels using the LabelEncoder-derived mapping
- Merges both datasets into a final clean ProductionResumeDataSet.csv
- Prints class distribution and validation stats
"""

import pandas as pd
from sklearn.preprocessing import LabelEncoder

# ----- Label mapping derived from UpdatedResumeDataSet.csv categories -----
# (Alphabetical order => LabelEncoder assigns 0..24)
LABEL_MAP = {
    0: 'Advocate',
    1: 'Arts',
    2: 'Automation Testing',
    3: 'Blockchain',
    4: 'Business Analyst',
    5: 'Civil Engineer',
    6: 'Data Science',
    7: 'Database',
    8: 'DevOps Engineer',
    9: 'DotNet Developer',
    10: 'ETL Developer',
    11: 'Electrical Engineering',
    12: 'HR',
    13: 'Hadoop',
    14: 'Health and fitness',
    15: 'Java Developer',
    16: 'Mechanical Engineer',
    17: 'Network Security Engineer',
    18: 'Operations Manager',
    19: 'PMO',
    20: 'Python Developer',
    21: 'SAP Developer',
    22: 'Sales',
    23: 'Testing',
    24: 'Web Designing',
}

print("=" * 60)
print("PHASE 1: DATA PREPARATION")
print("=" * 60)

# --- Load & deduplicate UpdatedResumeDataSet ---
print("\n[1] Loading UpdatedResumeDataSet.csv ...")
df_orig = pd.read_csv('UpdatedResumeDataSet.csv')
print(f"    Total rows: {len(df_orig)}, Columns: {list(df_orig.columns)}")

df_orig_dedup = df_orig.drop_duplicates(subset=['Resume'])
print(f"    After dedup: {len(df_orig_dedup)} unique resumes")

# Ensure correct column names
df_orig_dedup = df_orig_dedup[['Category', 'Resume']].copy()
df_orig_dedup.columns = ['Category', 'Resume']

# --- Load PerfectResumeDataSet and decode integer labels ---
print("\n[2] Loading PerfectResumeDataSet.csv ...")
df_perfect = pd.read_csv('PerfectResumeDataSet.csv')
print(f"    Total rows: {len(df_perfect)}, Columns: {list(df_perfect.columns)}")
print(f"    Integer labels found: {sorted(df_perfect['Category'].unique())}")

# Map integers to text labels
df_perfect['Category'] = df_perfect['Category'].map(LABEL_MAP)
unmapped = df_perfect['Category'].isna().sum()
if unmapped > 0:
    print(f"    WARNING: {unmapped} rows had unmapped integer labels — dropping them.")
    df_perfect = df_perfect.dropna(subset=['Category'])

df_perfect = df_perfect[['Category', 'Resume']].copy()
print(f"    After label decoding: {len(df_perfect)} rows")

# --- Merge both datasets ---
print("\n[3] Merging datasets ...")
df_combined = pd.concat([df_orig_dedup, df_perfect], ignore_index=True)
print(f"    Combined total rows: {len(df_combined)}")

# Final dedup pass (in case any overlap between datasets)
df_combined = df_combined.drop_duplicates(subset=['Resume'])
print(f"    After final dedup: {len(df_combined)} unique resumes")

# --- Validation ---
print("\n[4] Class Distribution:")
dist = df_combined['Category'].value_counts().sort_index()
for cat, count in dist.items():
    print(f"    {cat:<30} {count:>4} samples")

print(f"\n    Total categories: {df_combined['Category'].nunique()}")
print(f"    Min samples per class: {dist.min()} ({dist.idxmin()})")
print(f"    Max samples per class: {dist.max()} ({dist.idxmax()})")
print(f"    Total samples: {len(df_combined)}")

# --- Save ---
out_path = 'ProductionResumeDataSet.csv'
df_combined.to_csv(out_path, index=False)
print(f"\n[5] Saved to: {out_path}")
print("\n✅ Phase 1 complete. Ready for model training.")
