import mysql.connector
from mysql.connector import errorcode

config = {
  'user': 'root',
  'password': 'password',
  'host': '127.0.0.1',
  'auth_plugin': 'mysql_native_password'
}

def create_database(cursor):
    try:
        cursor.execute("CREATE DATABASE IF NOT EXISTS resumes")
        print("Database 'resumes' created or already exists.")
    except mysql.connector.Error as err:
        print(f"Failed creating database: {err}")
        exit(1)

try:
    mydb = mysql.connector.connect(**config)
    cursor = mydb.cursor()
    
    create_database(cursor)
    
    mydb.database = 'resumes'
    
    tables = {}
    tables['HR'] = (
        "CREATE TABLE IF NOT EXISTS HR ("
        "  Position VARCHAR(255),"
        "  Experience INT"
        ")")
    
    tables['employees'] = (
        "CREATE TABLE IF NOT EXISTS employees ("
        "  Name VARCHAR(255),"
        "  Email VARCHAR(255),"
        "  Resume MEDIUMBLOB,"
        "  score FLOAT,"
        "  location VARCHAR(255),"
        "  category VARCHAR(255)"
        ")")
    
    tables['skills'] = (
        "CREATE TABLE IF NOT EXISTS skills ("
        "  position VARCHAR(255),"
        "  skills TEXT"
        ")")
        
    for table_name in tables:
        table_description = tables[table_name]
        try:
            print(f"Creating table {table_name}: ", end='')
            cursor.execute(table_description)
        except mysql.connector.Error as err:
            if err.errno == errorcode.ER_TABLE_EXISTS_ERROR:
                print("already exists.")
            else:
                print(err.msg)
        else:
            print("OK")

    # Seed data
    print("Seeding skills data: ", end='')
    seed_query = "INSERT INTO skills (position, skills) VALUES (%s, %s)"
    seed_data = [
        ('python developer', 'python,django,flask,sql,numpy,pandas,matplotlib,git'),
        ('data science', 'python,statistics,machine learning,deep learning,natural language processing,pandas,numpy'),
        ('java developer', 'java,spring boot,hibernate,maven,sql,microservices'),
        ('web designing', 'html,css,javascript,react,angular,vue,figma,ui/ux')
    ]
    
    # Check if already seeded
    cursor.execute("SELECT COUNT(*) FROM skills")
    if cursor.fetchone()[0] == 0:
        cursor.executemany(seed_query, seed_data)
        mydb.commit()
        print("OK")
    else:
        print("already seeded.")

    cursor.close()
    mydb.close()
    print("Database setup completed successfully.")

except mysql.connector.Error as err:
    if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
        print("Something is wrong with your user name or password")
    elif err.errno == errorcode.ER_BAD_DB_ERROR:
        print("Database does not exist")
    else:
        print(err)
