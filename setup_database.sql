CREATE DATABASE IF NOT EXISTS resumes;
USE resumes;

CREATE TABLE IF NOT EXISTS HR (
    Position VARCHAR(255),
    Experience INT
);

CREATE TABLE IF NOT EXISTS employees (
    Name VARCHAR(255),
    Email VARCHAR(255),
    Resume MEDIUMBLOB,
    score FLOAT,
    location VARCHAR(255),
    category VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS skills (
    position VARCHAR(255),
    skills TEXT
);

-- Seed some skills data if needed, or at least ensure the table exists.
-- The app seems to expect predefined skills to match resumes against.
INSERT INTO skills (position, skills) VALUES 
('python developer', 'python,django,flask,sql,numpy,pandas,matplotlib,git'),
('data science', 'python,statistics,machine learning,deep learning,natural language processing,pandas,numpy'),
('java developer', 'java,spring boot,hibernate,maven,sql,microservices'),
('web designing', 'html,css,javascript,react,angular,vue,figma,ui/ux');
