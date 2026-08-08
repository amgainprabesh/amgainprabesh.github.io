# Prabesh Amgain — Portfolio

A minimalist, motion-graphics portfolio built from verified GitHub profile data.
Dark editorial · volt accent · zero dependencies · vanilla JS.

![preview](assets/avatar.jpg)

## Stack

- Semantic HTML5
- Hand-rolled CSS (custom properties, grid, clip-path reveals)
- Vanilla JS: canvas particle field, IntersectionObserver scroll choreography,
  custom cursor, preloader, marquee tickers, count-up stats
- Google Fonts: Space Grotesk · Instrument Serif · Space Mono

## Structure

```
index.html          — page (preloader, nav, hero, works, about, stack, contact)
css/styles.css      — design tokens + all styles
js/main.js          — motion engine
assets/avatar.jpg   — real GitHub avatar
```

## Run locally

```bash
python -m http.server 8080
# open http://localhost:8080
```

## Deploy to GitHub Pages

1. Push this folder to `amgainprabesh/amgainprabesh.github.io`:
   ```bash
   git init
   git add .
   git commit -m "portfolio"
   git branch -M main
   git remote add origin https://github.com/amgainprabesh/amgainprabesh.github.io.git
   git push -u origin main
   ```
2. Repo → Settings → Pages → Source: `Deploy from a branch` → `main` / root.
3. Live at `https://amgainprabesh.github.io`.

## Customize

- Replace `assets/avatar.jpg` with a real photo.
- Email + GitHub links live in `index.html` (nav status, contact section).
- Works list lives in `index.html` — add/remove `.work` rows.
