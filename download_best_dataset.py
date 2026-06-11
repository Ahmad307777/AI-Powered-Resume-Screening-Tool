import subprocess, sys, os

def pip(pkg):
    try: __import__(pkg.replace("-","_"))
    except ImportError: subprocess.check_call([sys.executable,"-m","pip","install",pkg])

pip("datasets")
pip("pandas")

from datasets import load_dataset, ClassLabel
import pandas as pd

print("Loading syedroshanzameer/resume-classification via HuggingFace datasets library...")
try:
    ds = load_dataset("syedroshanzameer/resume-classification")
    print("\nDataset info:")
    print(ds)
    print("\nFeatures:")
    print(ds['train'].features)

    # Extract ClassLabel names from the 'labels' feature
    label_feature = ds['train'].features['labels']
    if hasattr(label_feature, 'names'):
        label_names = label_feature.names
        print(f"\nLabel names (int -> name):")
        for i, name in enumerate(label_names):
            print(f"  {i}: {name}")
        
        # Combine all splits
        dfs = []
        for split in ds.keys():
            split_df = ds[split].to_pandas()
            dfs.append(split_df)
        df = pd.concat(dfs, ignore_index=True)
        
        # Map integer labels to text
        df['Category'] = df['labels'].map(lambda x: label_names[x])
        df_final = df[['Category', 'text']].copy()
        df_final.columns = ['Category', 'Resume']
        
        print(f"\nTotal rows: {len(df_final)}")
        print("\nCategory distribution:")
        print(df_final['Category'].value_counts().to_string())
        
        df_final.to_csv("PerfectResumeDataSet.csv", index=False, encoding="utf-8")
        print(f"\nSUCCESS: Saved to {os.path.abspath('PerfectResumeDataSet.csv')}")
    else:
        print("Labels are not ClassLabel type, they are:", type(label_feature))
        print("Raw unique values:", sorted(ds['train']['labels'][:50]))
except Exception as e:
    print(f"Error: {e}")
    import traceback; traceback.print_exc()
