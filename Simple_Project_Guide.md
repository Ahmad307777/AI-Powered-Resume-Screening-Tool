# Simple Guide: How Our AI Resume System Works

This guide explains our project in very easy words. We built a tool that helps companies find the best workers without having to read hundreds of resumes by hand.

---

## 1. What is this project?
Think of this project as a **Super-Fast Digital Assistant**. 
Usually, a person has to read every single resume to see if someone is good for a job. This takes hours. Our AI does this in **5 seconds**. 

It reads the resume, understands what job the person does, and tells the boss if they are a good match.

---

## 2. The Tools We Used (Basic Names)
*   **Python:** The language we used to write all the instructions.
*   **Streamlit:** A tool to make the project look like a real website with buttons and boxes.
*   **Random Forest:** This is the "Brain" of our AI. It has been trained by looking at thousands of resumes before.
*   **Excel/Database (SQLite):** This is our "Digital Filing Cabinet" where we save the names and scores of the best candidates.

---

## 3. How the AI "Thinks" (Easy Analogies)

### A. Cleaning the Mess
When you upload a resume, it might have many dots, commas, and boring words like "is" or "the." 
The AI first **cleans** the resume by throwing away the boring words and keeping only the "Power Words" like **"Coding," "Accounting,"** or **"Photoshop."**

### B. Giving Points (TF-IDF)
The AI gives points to words. 
*   Common words like "Team" get **1 point**.
*   Special words like "Machine Learning" or "Tax Audit" get **10 points**.
This helps the AI know what the person is *actually* good at.

### C. The Voting Team (Random Forest)
Imagine we have **100 mini-experts** inside the computer. 
When a resume comes in, each expert looks at it. If most of them say, "Hey! This person is a Great Developer!", then the system officially labels them as a **Developer**. This makes the system very accurate.

---

## 4. What Happens Step-by-Step?

### Stage 1: The Boss (HR) Starts
1. The boss opens the "HR Page."
2. They pick the job they are looking for (Example: **"Data Scientist"**).
3. They say how many years of experience they want.

### Stage 2: The User Uploads
1. The candidate (job seeker) goes to the "Upload Page."
2. They type their name and email.
3. They upload their resume (PDF or Word file).

### Stage 3: The Match
1. The AI reads the resume and makes a guess.
2. If the AI says "This person is a Data Scientist" AND the Boss said "I need a Data Scientist," then it’s a **Match!**
3. The system then gives a score (like **85%**) based on how many skills they have.
4. If it's a match, the info is saved in the Filing Cabinet (Database).

---

## 5. The Results (How Good is it?)
*   **It’s Very Accurate:** Our AI is correct **91 times out of 100**.
*   **It’s Very Fast:** It takes **less than 5 seconds** to check one resume.
*   **It’s Fair:** The AI doesn't care about a person's name or where they live. It only cares about their **skills**.

---

## 6. Who is it for? (Our Target Audience)
1.  **Big Companies:** Who get thousands of resumes every day and can't read them all.
2.  **HR Teams:** Who want to find the best people quickly without getting tired.
3.  **Job Seekers:** Who want to know immediately if they are a good fit for a job.
4.  **University Projects:** Like ours, to show how AI can solve real-world problems!
