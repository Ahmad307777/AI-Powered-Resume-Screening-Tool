# CV Enhancement Feature — Llama-Powered Analysis

## Overview
Add a new **CV Enhancer** tab to the Candidate Portal. When a candidate uploads their CV, they can optionally request an AI analysis that:
1. **Identifies faults** in the CV relative to the target job role
2. **Provides improvement suggestions** with specific, actionable advice

The feature uses **Groq's Llama 3.3 70B** model via REST API (fastest, free-tier available, no local installation needed).

## Architecture

```
[CandidatePortal.jsx]  → uploads CV file → [/api/enhance endpoint]
                                              → pdfplumber extracts text
                                              → Groq Llama API call
                                              → returns {faults[], suggestions[]}
                       ← renders CVEnhancer panel ←
```

## Proposed Changes

---

### Backend — [app.py](file:///d:/Resume-Screening-main/app.py)

#### [MODIFY] app.py
- Add `POST /api/enhance` endpoint that:
  - Accepts `file` (UploadFile) + `job_title` (str) + `required_skills` (str)
  - Extracts text with `pdfplumber`
  - Calls Groq Llama 3.3-70B API with a structured prompt
  - Returns `{ faults: [...], suggestions: [...] }`
- Read Groq API key from env variable `GROQ_API_KEY`
- Uses `requests` (already available) to call `https://api.groq.com/openai/v1/chat/completions`

---

### Frontend Components

#### [NEW] CVEnhancer.jsx
A new component rendered within the CandidatePortal after a file is selected:
- **"✨ Enhance My CV"** button (appears after file is uploaded, alongside Submit)
- Calls `/api/enhance` with the uploaded file + active job config
- Shows a **two-panel result**:
  - 🔴 **Faults Detected** — numbered list of weaknesses in the CV
  - 🟢 **Improvement Suggestions** — numbered list of concrete improvements
- Loading spinner during API call
- Graceful error if API key is not configured

#### [MODIFY] CandidatePortal.jsx
- Import and render `CVEnhancer` component below the upload area
- Pass `file`, `activeConfig` props

---

### Configuration

#### [MODIFY] requirements.txt
- `pdfplumber` is already installed
- No new packages needed (uses `requests` which is already a dependency of `httpx`/`fastapi`)

## Groq API Setup (User Action Required)
The user needs a free Groq API key:
1. Sign up at https://console.groq.com (free, no credit card)
2. Create an API key
3. Set it as an environment variable before starting the server:
   ```
   $env:GROQ_API_KEY = "gsk_..."
   ```
   Or create a `.env` file and load it with `python-dotenv`.

## Verification Plan
- Test `/api/enhance` via curl/Postman with a sample PDF
- Verify frontend renders faults and suggestions correctly
- Test error handling when no API key is set
