import sqlite3

def fix_db():
    conn = sqlite3.connect('resumes.db')
    cursor = conn.cursor()
    
    # Check current columns
    cursor.execute('PRAGMA table_info(employees)')
    columns = [col[1] for col in cursor.fetchall()]
    print(f"Current columns: {columns}")
    
    needed_columns = [
        ('matched_skills', 'TEXT'),
        ('status', 'TEXT'),
        ('reasoning', 'TEXT')
    ]
    
    for col_name, col_type in needed_columns:
        if col_name not in columns:
            print(f"Adding column {col_name}...")
            try:
                cursor.execute(f'ALTER TABLE employees ADD COLUMN {col_name} {col_type}')
                print(f"Successfully added {col_name}")
            except Exception as e:
                print(f"Error adding {col_name}: {e}")
        else:
            print(f"Column {col_name} already exists.")
            
    conn.commit()
    conn.close()
    print("Database sync complete.")

if __name__ == "__main__":
    fix_db()
