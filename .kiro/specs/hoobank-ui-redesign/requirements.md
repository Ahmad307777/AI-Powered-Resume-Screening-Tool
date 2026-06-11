# Requirements Document

## Introduction

This feature replaces the current plain PortalSelect landing page of the Screen.AI resume-screening application with a full-featured, multi-section marketing landing page inspired by the HooBank business website template. The new landing page must communicate the value of the AI screening product, guide visitors to the correct portal (Candidate or HR), and introduce a modern dark-themed visual language (deep backgrounds, gradient purples/blues, glassmorphism cards, radial gradient glows, Poppins/Inter typography) using Tailwind CSS. All existing application routes (`/`, `/candidate`, `/hr`) and portal functionality must be preserved without regression.

---

## Glossary

- **Landing_Page**: The redesigned single-page layout served at the `/` route, replacing the current PortalSelect component.
- **Navbar**: The fixed top navigation bar containing the Screen.AI logo, nav links, and a primary CTA button.
- **Hero_Section**: The first visible section of the Landing_Page containing the main headline, subtext, dual CTA buttons, and a decorative visual element.
- **Stats_Section**: A horizontal strip displaying three key platform statistics with numeric values and labels.
- **Features_Section**: A grid of feature-highlight cards, each with an icon, title, and short description.
- **Billing_Section**: A two-column section with a product screenshot/illustration on one side and a bulleted feature list on the other.
- **Testimonials_Section**: A horizontal row of user-feedback cards sourced from representative personas.
- **Clients_Section**: A strip of partner or technology logos displayed in a single row.
- **CTA_Banner**: A full-width call-to-action banner prompting the visitor to choose a portal.
- **Footer**: The bottom section containing the Screen.AI logo, navigation link groups, and social icons.
- **Tailwind_CSS**: The utility-first CSS framework to be added as a dev dependency and used for all Landing_Page styling.
- **Candidate_Portal**: The existing `/candidate` route and its associated CandidatePortal component.
- **HR_Portal**: The existing `/hr` route and its associated HRPortal component.
- **Screen.AI**: The brand name of the product.
- **Glassmorphism_Card**: A UI card with a semi-transparent background, backdrop blur filter, and a subtle border.
- **Gradient_Text**: Text rendered with a CSS linear gradient applied as a background clip to the text fill.
- **Radial_Glow**: A decorative `div` with a radial-gradient background used as ambient lighting effect.

---

## Requirements

### Requirement 1: Tailwind CSS Integration

**User Story:** As a developer, I want Tailwind CSS installed and configured in the frontend project, so that I can use utility classes to style the Landing_Page consistently with the HooBank design language.

#### Acceptance Criteria

1. THE Frontend_Project SHALL include `tailwindcss`, `postcss`, and `autoprefixer` as dev dependencies with pinned version numbers.
2. THE Frontend_Project SHALL include a `tailwind.config.js` file that extends the default theme with the Screen.AI colour palette (primary background `#00040f`, card background `#00040f` variant, accent purple `#a855f7`, accent gradient from `#6366f1` to `#a855f7` to `#ec4899`), the Poppins and Inter font families, and a content glob covering `./src/**/*.{js,jsx,ts,tsx}`.
3. THE Frontend_Project SHALL include a `postcss.config.js` that registers the `tailwindcss` and `autoprefixer` plugins.
4. THE `index.css` file SHALL import Tailwind's `base`, `components`, and `utilities` layers via `@tailwind` directives while retaining all existing CSS custom properties and global styles needed by non-landing-page routes.
5. WHEN the Vite dev server starts after integration, THE Frontend_Project SHALL compile without errors related to Tailwind configuration.

---

### Requirement 2: Landing Page Component Architecture

**User Story:** As a developer, I want the Landing_Page composed of discrete, independently-maintainable section components, so that each section can be developed, tested, and replaced without affecting others.

#### Acceptance Criteria

1. THE Landing_Page SHALL be implemented as a `LandingPage` React component located at `src/components/landing/LandingPage.jsx`.
2. THE Landing_Page SHALL assemble the following child section components in document order: `Navbar`, `HeroSection`, `StatsSection`, `FeaturesSection`, `BillingSection`, `TestimonialsSection`, `ClientsSection`, `CTABanner`, `Footer`.
3. THE `App` router SHALL render the `LandingPage` component at the `/` route, replacing the `PortalSelect` component.
4. WHEN the `/candidate` route is navigated to, THE App SHALL render the existing `CandidatePortal` component without modification.
5. WHEN the `/hr` route is navigated to, THE App SHALL render the existing `HRPortal` component without modification.
6. IF any Landing_Page section component throws a runtime error, THEN THE Landing_Page SHALL display a fallback UI rather than a blank screen (React error boundary or equivalent).

---

### Requirement 3: Navbar

**User Story:** As a visitor, I want a clear top navigation bar with the Screen.AI logo, section links, and a "Get Started" button, so that I can orient myself and quickly jump to relevant sections.

#### Acceptance Criteria

1. THE Navbar SHALL be fixed to the top of the viewport (`position: fixed` or Tailwind `fixed`) and span the full viewport width.
2. THE Navbar SHALL display the Screen.AI logo (emoji icon + "Screen" in white bold + ".AI" in accent purple) on the left side.
3. THE Navbar SHALL display navigation links for "Features", "How It Works", "Testimonials", and "About" that smooth-scroll to the corresponding Landing_Page sections when clicked.
4. THE Navbar SHALL display a "Get Started" CTA button on the right side that scrolls to or links to the `CTABanner` section.
5. WHEN the viewport width is less than 768px, THE Navbar SHALL hide the navigation links and replace them with a hamburger menu icon.
6. WHEN the hamburger menu icon is clicked, THE Navbar SHALL toggle a mobile navigation drawer displaying all navigation links vertically.
7. WHILE the page is scrolled more than 50px from the top, THE Navbar SHALL apply a blurred semi-transparent background (`backdrop-blur` + `bg-[#00040f]/80` equivalent) to differentiate it from the page content.
8. THE Navbar SHALL have a `z-index` higher than all other page elements to prevent overlap.

---

### Requirement 4: Hero Section

**User Story:** As a visitor, I want an impactful hero section with a bold headline, explanatory subtext, and prominent CTAs, so that I immediately understand the product and know how to proceed.

#### Acceptance Criteria

1. THE Hero_Section SHALL occupy at least `100vh` in height on desktop viewports.
2. THE Hero_Section SHALL display a primary headline of "Next-Generation AI Resume Screening" (or equivalent brand copy) using Gradient_Text styling (purple-to-cyan gradient).
3. THE Hero_Section SHALL display a subtitle paragraph of no more than 30 words describing the product value proposition in `text-dimWhite` or equivalent muted-white colour.
4. THE Hero_Section SHALL display two CTA buttons side by side: "Screen Your Resume" navigating to `/candidate` and "HR Dashboard" navigating to `/hr`.
5. THE "Screen Your Resume" button SHALL use the primary gradient style (`btn` class equivalent) with a right-arrow icon.
6. THE "HR Dashboard" button SHALL use the secondary outline style with a right-arrow icon.
7. THE Hero_Section SHALL display a decorative right-side visual — either the existing `hero.png` asset or a stylised glassmorphism card element — visible only on viewports wider than 768px.
8. THE Hero_Section SHALL include at least two Radial_Glow decorative elements positioned behind the content to create ambient depth.
9. WHEN the Hero_Section is first rendered, THE section content SHALL fade in and translate upward using a CSS entrance animation completing within 600ms.

---

### Requirement 5: Stats Section

**User Story:** As a visitor, I want to see key platform statistics, so that I can quickly gauge the scale and credibility of Screen.AI.

#### Acceptance Criteria

1. THE Stats_Section SHALL display exactly three statistics in a horizontal row on desktop viewports.
2. THE Stats_Section SHALL display the following statistics (values may be illustrative): "10,000+ Resumes Screened", "500+ Companies Served", and "98% Accuracy Rate".
3. EACH statistic SHALL display a large numeric value in white bold text and a short label in muted-white text below it.
4. WHEN the viewport width is less than 768px, THE Stats_Section SHALL stack the statistics vertically or in a two-column grid.
5. THE Stats_Section SHALL include a top gradient separator line to visually divide it from the Hero_Section.

---

### Requirement 6: Features Section

**User Story:** As a visitor, I want to see the core features of Screen.AI displayed as scannable cards, so that I can understand what the product offers before choosing a portal.

#### Acceptance Criteria

1. THE Features_Section SHALL display a section heading of "Features" (or equivalent) and a short descriptive subtitle.
2. THE Features_Section SHALL render at least four feature cards, covering: AI Resume Parsing, Job Fit Scoring, Skill Gap Analysis, and CV Enhancement Suggestions.
3. EACH feature card SHALL be a Glassmorphism_Card containing a coloured icon (from `lucide-react`), a title, and a two-to-three sentence description.
4. THE Features_Section SHALL arrange the feature cards in a responsive grid: four columns on desktop (≥1280px), two columns on tablet (≥768px), and one column on mobile (<768px).
5. WHEN a feature card is hovered, THE card border SHALL transition to the accent-purple glow colour within 250ms.

---

### Requirement 7: Billing / How It Works Section

**User Story:** As a visitor, I want to see how Screen.AI works with a visual side-by-side layout, so that I can understand the workflow before signing up.

#### Acceptance Criteria

1. THE Billing_Section SHALL use a two-column layout with an illustration/screenshot on the left and a feature list on the right on desktop viewports (≥768px).
2. WHEN the viewport width is less than 768px, THE Billing_Section SHALL stack the image column above the text column.
3. THE Billing_Section text column SHALL display a heading, a short paragraph, and a list of at least four bullet points, each with a checkmark or tick icon in accent-green colour.
4. THE illustration column SHALL display either the existing `hero.png` asset or a placeholder styled card representing the screening workflow.
5. THE Billing_Section SHALL carry the `id="how-it-works"` HTML attribute to enable Navbar smooth-scroll navigation.

---

### Requirement 8: Testimonials Section

**User Story:** As a visitor, I want to read real-looking testimonials from users, so that I can build trust in the Screen.AI product.

#### Acceptance Criteria

1. THE Testimonials_Section SHALL display at least three testimonial cards in a responsive horizontal layout.
2. EACH testimonial card SHALL be a Glassmorphism_Card containing: a quote text, the user's full name, job title, and a star rating (1–5 stars rendered as filled star icons).
3. THE Testimonials_Section SHALL display a section heading and subtitle above the cards.
4. WHEN the viewport width is less than 768px, THE Testimonials_Section cards SHALL be scrollable horizontally via `overflow-x: auto` or equivalent, or stack vertically.
5. THE Testimonials_Section SHALL carry the `id="testimonials"` HTML attribute.

---

### Requirement 9: Clients / Trusted By Section

**User Story:** As a visitor, I want to see logos of technologies or companies that Screen.AI integrates with, so that I feel confident in the product's ecosystem.

#### Acceptance Criteria

1. THE Clients_Section SHALL display a row of at least five technology or partner logos/wordmarks (e.g., Python, OpenAI, FastAPI, React, SQLite or similar representative icons/text badges).
2. THE Clients_Section SHALL display a short heading above the logo row such as "Powered by industry-leading technology".
3. THE logo items SHALL be rendered with reduced opacity (e.g., `opacity-50`) and SHALL increase to full opacity on hover within 200ms.
4. WHEN the viewport width is less than 768px, THE Clients_Section logos SHALL wrap to a second row rather than overflow horizontally.

---

### Requirement 10: CTA Banner Section

**User Story:** As a visitor who has scrolled through the landing page, I want a final call-to-action section with direct portal entry buttons, so that I can immediately navigate to the correct portal.

#### Acceptance Criteria

1. THE CTA_Banner SHALL display a full-width gradient background (purple-to-blue or purple-to-pink) that is visually distinct from the surrounding sections.
2. THE CTA_Banner SHALL display a heading such as "Ready to transform your hiring process?" and a short supporting sentence.
3. THE CTA_Banner SHALL display two portal-entry buttons side by side: "I'm a Candidate" navigating to `/candidate` and "I'm an HR Professional" navigating to `/hr`.
4. THE CTA_Banner SHALL carry the `id="get-started"` HTML attribute.
5. WHEN either CTA_Banner button is clicked, THE App SHALL navigate to the corresponding portal route using React Router `useNavigate`, preserving the existing routing behaviour.

---

### Requirement 11: Footer

**User Story:** As a visitor, I want a footer with links and brand information, so that I can find secondary navigation and understand the product's identity.

#### Acceptance Criteria

1. THE Footer SHALL display the Screen.AI logo and a short brand tagline on the left column.
2. THE Footer SHALL display at least two link-group columns (e.g., "Product" and "Company") with two to four links each.
3. THE Footer SHALL display social icon links (GitHub, LinkedIn, or Twitter/X) as accessible icon buttons with visible focus rings.
4. THE Footer SHALL display a bottom copyright line: "© [current year] Screen.AI. All rights reserved."
5. THE Footer link and icon buttons SHALL each have a visible `:focus-visible` outline for keyboard accessibility.
6. THE Footer text and links SHALL meet WCAG 2.1 AA colour contrast ratio of at least 4.5:1 against the footer background.

---

### Requirement 12: Visual Design System Consistency

**User Story:** As a designer, I want all Landing_Page sections to share a cohesive dark-themed visual system, so that the page feels unified and professional.

#### Acceptance Criteria

1. THE Landing_Page SHALL use `#00040f` (or `#0a0b10` as defined in the existing CSS) as the primary page background colour, applied to the `body` or a root wrapper.
2. THE Landing_Page SHALL use the Poppins font (loaded via Google Fonts or a local import) as the primary typeface, falling back to Inter, then system sans-serif.
3. ALL Gradient_Text headings on the Landing_Page SHALL use the same CSS gradient definition (`linear-gradient` from `#6366f1` via `#a855f7` to `#ec4899`), consistent with the existing `--gradient-primary` CSS variable.
4. ALL Glassmorphism_Card elements SHALL apply `backdrop-filter: blur(4px)`, a border of `1px solid rgba(255,255,255,0.18)`, and a background of `rgba(255,255,255,0.03)` minimum.
5. THE Landing_Page SHALL preserve all existing CSS custom properties in `index.css` to avoid regressions in the `/candidate` and `/hr` portal styles.
6. THE Landing_Page SHALL be fully responsive across viewport widths from 320px to 1920px with no horizontal overflow at any breakpoint.
7. WHEN a user reduces motion via the OS-level `prefers-reduced-motion` setting, THE Landing_Page entrance animations SHALL be disabled.

---

### Requirement 13: Accessibility

**User Story:** As a user who relies on assistive technology, I want the Landing_Page to be keyboard navigable and screen-reader friendly, so that I can use the product regardless of ability.

#### Acceptance Criteria

1. THE Landing_Page SHALL provide a "Skip to main content" focusable link as the first focusable element in the DOM, visible on focus and hidden otherwise.
2. ALL interactive elements (buttons, links, hamburger icon) on the Landing_Page SHALL be reachable via Tab key navigation in a logical document order.
3. ALL icon-only buttons (e.g., hamburger menu, social icons) SHALL carry an `aria-label` attribute describing their action.
4. THE Hero_Section headline SHALL be an `<h1>` element; all other section headings SHALL use `<h2>` elements to maintain a logical heading hierarchy.
5. ALL decorative Radial_Glow `div` elements SHALL carry `aria-hidden="true"`.
6. THE Navbar CTA button and Hero_Section CTA buttons SHALL have accessible names that match their visible label text.

---

### Requirement 14: Performance

**User Story:** As a visitor on a typical broadband connection, I want the Landing_Page to load quickly, so that I am not deterred by a slow experience.

#### Acceptance Criteria

1. THE Landing_Page SHALL not introduce any new image assets larger than 200 KB without lazy loading applied via the `loading="lazy"` attribute on `<img>` elements or equivalent React lazy-loading pattern.
2. WHEN Tailwind CSS is built for production, THE Frontend_Project build process SHALL generate a purged Tailwind CSS bundle no larger than 20 KB (gzipped).
3. THE Landing_Page SHALL not import any new JavaScript dependency that increases the gzipped JS bundle by more than 50 KB, unless the dependency replaces an existing one of equal or greater size.
