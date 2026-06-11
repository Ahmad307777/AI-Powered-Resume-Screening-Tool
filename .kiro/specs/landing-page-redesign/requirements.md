# Landing Page Redesign Requirements

## Overview
Redesign the current `PortalSelect` component (the `/` route landing page) inspired by the **HooBank business website template** (React + Tailwind CSS). The new landing page should feel like a modern SaaS product page — with a navbar, hero section, feature highlights, stats, and a clear CTA — while preserving the two-portal navigation (Candidate / HR).

---

## Requirements

### REQ-1: Navbar
- Display the Screen.AI brand logo (🔮 icon + "Screen.AI" wordmark) on the left.
- Provide navigation links: Features, How It Works, About.
- Include a "Get Started" button (CTA) on the right that scrolls to the portal selection cards.
- Navbar should be sticky/fixed at the top with a semi-transparent glassmorphism background.
- Responsive: collapse links on mobile using a hamburger icon.

### REQ-2: Hero Section
- Full-width hero with a large headline, sub-headline, and two CTA buttons:
  - Primary: "Apply Now" → scrolls to / navigates to `/candidate`
  - Secondary: "HR Login" → scrolls to / navigates to `/hr`
- Include a decorative gradient glow background (purple/indigo, matching existing palette).
- Display a floating "stats pill" or badge (e.g., "500+ Resumes Screened").
- Hero visual: abstract graphic / gradient card mockup (SVG or CSS art — no external images needed).

### REQ-3: Stats Bar
- Horizontal row of 3–4 key metrics:
  - "AI-Powered Screening"
  - "Instant Results"
  - "10x Faster Hiring"
  - "95% Accuracy"
- Dividers between stats, muted text for labels, bold text for values.

### REQ-4: Features Section
- 3 feature cards in a row, each with an icon, title, and short description:
  1. **Smart Resume Parsing** — Auto-extracts name, email, skills from any PDF/DOCX/TXT.
  2. **AI Role Matching** — Cosine similarity + keyword scoring against job requirements.
  3. **CV Enhancer** — AI-generated feedback to improve resume quality.
- Cards use the existing glassmorphism style (dark bg, subtle border, hover glow).

### REQ-5: How It Works Section
- 3-step numbered process:
  1. Upload Resume
  2. AI Analyzes & Scores
  3. Get Instant Feedback
- Each step has an icon, a step number badge, title, and description.
- Alternating layout (text left / graphic right) similar to HooBank's billing/card sections.

### REQ-6: Portal Selection Section (CTA)
- The existing two portal cards (Candidate Portal + HR Portal) become a dedicated section with a section heading: "Choose Your Portal".
- Cards remain functionally identical — clicking navigates to `/candidate` or `/hr`.
- Anchor `id="get-started"` on this section for navbar scroll link.

### REQ-7: Footer
- Single-row footer with:
  - Brand name on the left.
  - A center copyright line.
  - A "Privacy" note / data-safety statement on the right.
- Matches the dark theme.

### REQ-8: Design System
- **Colors**: Keep existing palette — `#0a0b10` bg, purple accent `#8b5cf6` / `#a855f7`, green `#10b981`.
- **Font**: Keep `Outfit` (already loaded).
- **No new CSS frameworks** — continue using inline styles + `index.css` utility classes.
- **No external image assets required** — use SVG icons (lucide-react already installed) and CSS gradients.
- Smooth scroll behavior for in-page anchor links.
- Fade-in animation on section entry (reuse existing `animated-view` class or add `IntersectionObserver`).

### REQ-9: Routing — no changes
- The `/`, `/candidate`, and `/hr` routes remain as-is in `App.jsx`.
- Only `PortalSelect.jsx` is replaced/rewritten (the `/` route component).

### REQ-10: Responsive Design
- Mobile-first: stack sections vertically on screens < 768px.
- Navbar collapses to hamburger on mobile.
- Feature cards and How It Works steps go to single column on mobile.
