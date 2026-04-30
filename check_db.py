import sqlite3

def check_schema():
    try:
        conn = sqlite3.connect('resumes.db')
        cur = conn.cursor()
        
        print("--- Tables ---")
        cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cur.fetchall()
        for table in tables:
            print(f"Table: {table[0]}")
            cur.execute(f"PRAGMA table_info({table[0]})")
            columns = cur.fetchall()
            for col in columns:
                print(f"  Column: {col[1]} ({col[2]})")
        
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_schema()
