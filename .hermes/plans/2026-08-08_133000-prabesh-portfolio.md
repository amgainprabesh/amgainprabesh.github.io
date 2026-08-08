# Prabesh Amgain — Motion Graphics Portfolio Implementation Plan

> **For Hermes:** implement this plan directly (single session, no subagents needed — the artifact is one cohesive hand-built site).

**Goal:** A top-tier, minimalist **motion-graphics portfolio website** for Prabesh Amgain, built from verified GitHub profile data, styled in the editorial-dark register of alche.studio with the scroll-driven boldness of alethia.earth — explicitly *not* AI-slop (no indigo gradients, no feature-tile grids, no stock heroes).

**Architecture:** Static site, zero build step, deployable to GitHub Pages as-is. 3 files + assets.

**Tech Stack:** Semantic HTML5 · hand-rolled CSS (custom properties, grid, clip-path reveals) · vanilla JS (IntersectionObserver scroll choreography, canvas generative background, Lenis-style smooth scroll via native `scroll-behavior` + JS easing, custom cursor, marquee tickers) · Google Fonts (Space Grotesk display, Instrument Serif italic accent, Space Mono labels). No frameworks, no CDN bloat, no dependencies.

---

## Verified source data (from GitHub API, 2026-08-08)

- **Login:** `PrabeshAmgain` (user said "Prabeshamgain" — link the real one: github.com/PrabeshAmgain)
- **Name:** Prabesh Amgain · **Member since:** June 2025 · **23 public repos** · 4 followers · 5 following
- **No bio, no company, no location** — do NOT invent. Position him from repo evidence: CS student & self-taught builder (coursework repos: DSA, DBMS, OS, CN, Numerical Methods, Theory of Computation) with shipped AI/web experiments.
- **Flagship repos (pinned + most substantial), with verified descriptions:**
  1. **LabLoop** — TypeScript — *"Platform for rapid AI experimentation and ML workflow simulation powered by Gemini AI"* — 1★, pushed 2026-01
  2. **Manga-colorizer** — TypeScript — *"Colorize any manga page in an instant"* — live: manga-colorizer-three.vercel.app
  3. **Past-Paper-Sprint-Coach** — TypeScript — *"AI-powered study tool for exam preparation"*
  4. **Search-algorithm-visualizer** — JavaScript — *uninformed & informed search visualized* — live: visualizer-gules.vercel.app — 1★
  5. **phishing-detection** — Python — ML-based phishing URL detection
  6. **Personal-python-compiler** — Python/JS — browser Python compiler — live: personal-python-compiler.vercel.app
  7. **Bike-liscence-exam-** — TypeScript — *"Website that generates questions for bike trial exams"*
- **Language fingerprint:** TypeScript, Python, JavaScript, C, C++, Jupyter Notebook, HTML/CSS
- **Tooling inferred from repos:** Gemini AI API, Vercel deploys, Git

---

## Design system

### Surface: "Decide/Learn" portfolio (hero is correct here) — but composed editorially, not centered-stack.

| Token | Value |
|---|---|
| `--bg` | `#0A0A0C` (near-black, warm) |
| `--bg-2` | `#101014` (raised surface) |
| `--ink` | `#EDEDE8` (warm off-white text) |
| `--muted` | `#8A8A92` (labels, secondary) |
| `--accent` | `#C6FF4D` (chartreuse/volt — the single color, echoes alethia's C6F19D) |
| `--line` | `rgba(237,237,232,0.12)` (hairlines) |

### Type
- **Display:** Space Grotesk 500/700 — huge, tight-tracked headlines (`-0.04em`)
- **Italic accent:** Instrument Serif 400 italic — 1–2 words per section in serif italic (the current award-site move)
- **Labels/mono:** Space Mono 400 — section indices `01 /`, meta, tags, cursor coordinates
- Scale: hero `clamp(3.5rem, 12vw, 11rem)` → section `clamp(2.5rem, 6vw, 5rem)` → body 1rem/1.6

### Composition rules (anti-slop)
- Left-aligned editorial blocks; asymmetric grid (works list = full-width rows, not cards)
- One idea per section; hairline rules as the only "decoration" besides type and motion
- No gradients, no glassmorphism, no emoji, no icon grids, no fake metrics — every number on the page is real

### Motion choreography (the centerpiece)
1. **Preloader** — counter 0→100, name mask reveal, curtain lift into hero
2. **Hero kinetic type** — lines masked (`clip-path`/`translateY`), staggered word reveal; canvas particle drift + mouse-parallax field behind
3. **Custom cursor** — dot + trailing ring, `mix-blend-difference`, grows on interactive hover (desktop only)
4. **Scroll reveals** — IntersectionObserver; `[data-reveal]` with per-line stagger; manifesto words scale on scroll
5. **Marquee tickers** — infinite CSS translateX strips (skills, attitude lines)
6. **Works rows** — alche-style: index · title · tags · year · arrow; hover = title slide + ghost arrow + accent flash; click = GitHub
7. **Count-up stats** — 23 repos / 7+ languages / ships since 2025 — real numbers
8. **Nav** — fixed hairline bar, dot-status, section links with hover underline; reduced-motion respected via `prefers-reduced-motion`

---

## Files

| File | Purpose |
|---|---|
| `index.html` | Full page: preloader, nav, hero, marquee, works, manifesto, stack, contact/footer |
| `css/styles.css` | All tokens + styles + responsive (≤ 768px single column) |
| `js/main.js` | Preloader, cursor, canvas field, IO reveals, marquees, counters, menu |
| `assets/avatar.jpg` | Real GitHub avatar (downloaded) for manifesto section |
| `README.md` | What it is + how to deploy to GitHub Pages |
| `.hermes/plans/…` | This plan |

## Steps

1. **Assets** — download real avatar from `avatars.githubusercontent.com/u/217309016` → `assets/avatar.jpg`
2. **index.html** — semantic skeleton with all sections + real content copy
3. **css/styles.css** — tokens, type, layout, components, responsive, reduced-motion
4. **js/main.js** — all motion systems (preloader, cursor, canvas, IO, counters, marquee)
5. **Serve & verify** — `python -m http.server`, render via preview, screenshot with headless Chrome if available → `vision_analyze` the screenshots for real visual QA (desktop + mobile widths)
6. **Fix** anything QA flags (overflow, contrast, motion glitches, console errors)
7. **Deliver** — final path + deploy instructions + what was verified

## Validation

- [ ] No console errors
- [ ] All 8 project links → correct GitHub URLs (verified against API data)
- [ ] Contrast: ink on bg ≥ 12:1; muted ≥ 5.6:1
- [ ] Responsive: 1440 / 1024 / 768 / 390 widths render clean (screenshot check)
- [ ] Reduced-motion: animations collapse to fades
- [ ] Slop self-audit ≤ 2/10 (no tech-gradient, no feature-tile grid, no icon-topper, no center-stack, chosen type)
