/* ═══════════════════════════════════════════════════════════
   Prabesh Amgain — Portfolio motion engine
   Vanilla JS · no dependencies
   ═══════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE = window.matchMedia("(pointer: fine)").matches;
  const PREVIEW = new URLSearchParams(location.search).has("preview");
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ── 1 · PRELOADER ─────────────────────────────────────── */
  function preloader() {
    const el = document.getElementById("preloader");
    if (!el) return;
    const countEl = document.getElementById("preloader-count");
    const barEl = document.getElementById("preloader-bar");
    const nameEl = el.querySelector(".preloader__name");

    // split name into chars for mask reveal
    nameEl.innerHTML = nameEl.textContent
      .split("")
      .map((c) => (c === " " ? " " : `<span>${c}</span>`))
      .join("");

    const done = () => {
      document.body.classList.add("is-ready");
      el.classList.add("preloader--run");
      setTimeout(() => el.classList.add("preloader--done"), 650);
      setTimeout(() => el.remove(), 1800);
    };

    if (REDUCED || PREVIEW) { countEl.textContent = "100"; barEl.style.width = "100%"; done(); return; }

    const duration = 1500;
    const t0 = performance.now();
    const tick = (now) => {
      const p = clamp((now - t0) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      const val = Math.round(eased * 100);
      countEl.textContent = String(val).padStart(3, "0");
      barEl.style.width = val + "%";
      if (p < 1) requestAnimationFrame(tick);
      else done();
    };
    requestAnimationFrame(tick);
  }

  /* ── 2 · CUSTOM CURSOR ─────────────────────────────────── */
  function cursor() {
    if (!FINE || REDUCED) return;
    const dot = document.querySelector(".cursor__dot");
    const ring = document.querySelector(".cursor__ring");
    const wrap = document.getElementById("cursor");
    if (!dot || !ring) return;

    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my;
    let visible = false;

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top = my + "px";
      if (!visible) { visible = true; wrap.classList.remove("cursor--hidden"); }
    });

    document.addEventListener("mouseleave", () => { visible = false; wrap.classList.add("cursor--hidden"); });

    (function loop() {
      rx = lerp(rx, mx, 0.16);
      ry = lerp(ry, my, 0.16);
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      requestAnimationFrame(loop);
    })();

    // grow on interactive elements
    const growSel = "a, button, .work, [data-cursor='link']";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(growSel)) wrap.classList.add("cursor--active");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(growSel)) wrap.classList.remove("cursor--active");
    });
  }

  /* ── 3 · CANVAS PARTICLE FIELD ─────────────────────────── */
  function field() {
    const canvas = document.getElementById("field");
    if (!canvas || REDUCED) return;
    const ctx = canvas.getContext("2d");
    const hero = document.getElementById("hero");

    const ACCENT = "198, 255, 77";
    let W, H, DPR;
    let parts = [];
    let mouse = { x: -9999, y: -9999 };
    let raf = null;
    let running = true;

    const resize = () => {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      const rect = hero.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const count = clamp(Math.floor((W * H) / 16000), 40, 130);
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.4 + 0.4,
        p: Math.random() * Math.PI * 2,
      }));
    };

    const step = (t) => {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);

      // slow drift + mouse repulsion
      for (const pt of parts) {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.p += 0.01;
        // gentle vertical breathing
        pt.y += Math.sin(t / 2400 + pt.p) * 0.12;

        const dx = pt.x - mouse.x, dy = pt.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 14400) { // 120px radius
          const d = Math.sqrt(d2) || 1;
          const f = ((120 - d) / 120) * 1.6;
          pt.x += (dx / d) * f;
          pt.y += (dy / d) * f;
        }

        if (pt.x < -10) pt.x = W + 10; if (pt.x > W + 10) pt.x = -10;
        if (pt.y < -10) pt.y = H + 10; if (pt.y > H + 10) pt.y = -10;

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ACCENT}, 0.55)`;
        ctx.fill();
      }

      // proximity lines
      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          const a = parts[i], b = parts[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 10000) { // 100px
            const alpha = (1 - Math.sqrt(d2) / 100) * 0.22;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${ACCENT}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(step);
    };

    // mouse only within hero
    hero.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener("mouseleave", () => { mouse.x = -9999; mouse.y = -9999; });

    // scroll parallax: hero canvas sinks slower than scroll
    const onScroll = () => {
      if (window.scrollY < innerHeight) {
        const y = window.scrollY * 0.35;
        canvas.style.transform = `translateY(${y}px)`;
      }
    };

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", () => {
      running = !document.hidden;
      if (running && !raf) raf = requestAnimationFrame(step);
      if (!running && raf) { cancelAnimationFrame(raf); raf = null; }
    });

    resize();
    raf = requestAnimationFrame(step);
  }

  /* ── 4 · HERO REVEAL ───────────────────────────────────── */
  function heroReveal() {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const start = () => {
      hero.classList.add("hero--run");
      document.body.classList.add("is-ready");
    };
    // tie to preloader if present, else run immediately
    const pre = document.getElementById("preloader");
    if (pre && !REDUCED && !PREVIEW) {
      setTimeout(start, 1450);
    } else {
      requestAnimationFrame(start);
    }
  }

  /* ── 5 · SCROLL REVEALS (IO) ───────────────────────────── */
  function reveals() {
    const els = document.querySelectorAll("[data-reveal]");
    if (PREVIEW) {
      els.forEach((el) => el.classList.add("is-inview"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          for (const en of entries) {
            if (en.isIntersecting) {
              en.target.classList.add("is-inview");
              io.unobserve(en.target);
            }
          }
        },
        { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
      );
      els.forEach((el) => io.observe(el));
    }

    // manifesto word-by-word
    const manifesto = document.querySelector("[data-manifesto]");
    if (manifesto) {
      const paras = manifesto.querySelectorAll("p");
      paras.forEach((p) => {
        const words = p.textContent.trim().split(/\s+/);
        p.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(" ");
      });
      const mio = new IntersectionObserver(
        (entries) => {
          for (const en of entries) {
            if (en.isIntersecting) { en.target.classList.add("is-inview"); mio.unobserve(en.target); }
          }
        },
        { threshold: 0.3 }
      );
      mio.observe(manifesto);
    }

    // stack columns animate bars
    const cols = document.querySelectorAll(".stack__col");
    if (PREVIEW) {
      cols.forEach((c) => c.classList.add("is-inview"));
    } else {
      const cio = new IntersectionObserver(
        (entries) => {
          for (const en of entries) {
            if (en.isIntersecting) { en.target.classList.add("is-inview"); cio.unobserve(en.target); }
          }
        },
        { threshold: 0.35 }
      );
      cols.forEach((c) => cio.observe(c));
    }
  }

  /* ── 6 · COUNTERS ──────────────────────────────────────── */
  function counters() {
    const nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;
    if (PREVIEW) {
      nums.forEach((el) => { el.textContent = el.dataset.count + (el.dataset.suffix || ""); });
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (!en.isIntersecting) continue;
          const el = en.target;
          io.unobserve(el);
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || "";
          if (REDUCED) { el.textContent = target + suffix; continue; }
          const t0 = performance.now();
          const dur = 1400;
          const tick = (now) => {
            const p = clamp((now - t0) / dur, 0, 1);
            const eased = 1 - Math.pow(1 - p, 4);
            el.textContent = Math.round(eased * target) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.6 }
    );
    nums.forEach((n) => io.observe(n));
  }

  /* ── 7 · NAV + PROGRESS ────────────────────────────────── */
  function chrome() {
    const nav = document.getElementById("nav");
    const progress = document.getElementById("progress");
    let lastY = 0;

    const onScroll = () => {
      const y = window.scrollY;
      // progress
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
      // nav background
      nav.classList.toggle("nav--scrolled", y > 40);
      // hide on scroll down, show on scroll up
      if (y > lastY && y > 420) nav.classList.add("nav--hidden");
      else nav.classList.remove("nav--hidden");
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ── boot ──────────────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", () => {
    preloader();
    cursor();
    field();
    heroReveal();
    reveals();
    counters();
    chrome();
  });
})();
