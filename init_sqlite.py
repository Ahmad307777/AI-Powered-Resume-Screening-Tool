import sqlite3
import os

db_path = 'resumes.db'

def init_db():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS HR (
        Position TEXT,
        Experience INTEGER
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS employees (
        Name TEXT,
        Email TEXT,
        Resume BLOB,
        score REAL,
        location TEXT,
        category TEXT,
        matched_skills TEXT
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS skills (
        position TEXT,
        skills TEXT
    )
    ''')
    
    # Seed skills data
    cursor.execute("SELECT COUNT(*) FROM skills")
    if cursor.fetchone()[0] == 0:
        seed_data = [
            ('python developer', 'python,django,flask,sql,numpy,pandas,matplotlib,git'),
            ('data science', 'python,statistics,machine learning,deep learning,natural language processing,pandas,numpy'),
            ('java developer', 'java,spring boot,hibernate,maven,sql,microservices'),
            ('web designing', 'html,css,javascript,react,angular,vue,figma,ui/ux')
        ]
        cursor.executemany("INSERT INTO skills (position, skills) VALUES (?, ?)", seed_data)
        print("Skills data seeded.")
    
    # Initialize HR table with a default if empty
    cursor.execute("SELECT COUNT(*) FROM HR")
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO HR (Position, Experience) VALUES (?, ?)", ('python developer', 2))
        print("Default HR requirement set.")

    conn.commit()
    conn.close()
    print(f"Database {db_path} initialized successfully.")

if __name__ == "__main__":
    init_db()
