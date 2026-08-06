/* ============================================================
   FAIZUL HAI — portfolio interactions
   Pure vanilla JS. No frameworks, no dependencies.
   ============================================================ */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* ----------------------------------------------------------
     Preloader
  ---------------------------------------------------------- */
  const preloader = $("#preloader");
  const preFill = $("#pre-fill");
  let preProgress = 0;

  const preTicker = setInterval(() => {
    preProgress = Math.min(100, preProgress + Math.random() * 22 + 8);
    preFill.style.width = preProgress + "%";
    if (preProgress >= 100) clearInterval(preTicker);
  }, 130);

  window.addEventListener("load", finishPreload);
  setTimeout(finishPreload, 2600); // failsafe

  function finishPreload() {
    preProgress = 100;
    preFill.style.width = "100%";
    setTimeout(() => preloader.classList.add("done"), 300);
  }

  /* ----------------------------------------------------------
     Custom cursor (fine pointers only)
  ---------------------------------------------------------- */
  const dot = $(".cursor-dot");
  const ring = $(".cursor-ring");
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  let cursorVisible = false;

  if (finePointer && !reduceMotion) {
    document.body.classList.add("cursor-on");
    dot.style.opacity = ring.style.opacity = 1;

    addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top = my + "px";
      if (!cursorVisible) { cursorVisible = true; }
    });

    (function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      requestAnimationFrame(loop);
    })();

    document.addEventListener("mouseover", (e) => {
      if (e.target.closest("a, button, [data-cursor]")) ring.classList.add("is-hover");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest("a, button, [data-cursor]")) ring.classList.remove("is-hover");
    });
  }

  /* ----------------------------------------------------------
     Scroll progress bar
  ---------------------------------------------------------- */
  const progress = $("#progress");
  addEventListener("scroll", () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
  }, { passive: true });

  /* ----------------------------------------------------------
     Nav: scrolled state + active link
  ---------------------------------------------------------- */
  const nav = $(".nav");
  const navLinks = $$(".nav-link");
  const sections = ["about", "fields", "projects", "contact"].map((id) => document.getElementById(id));

  function onScrollNav() {
    nav.classList.toggle("scrolled", scrollY > 40);
    $("#to-top").classList.toggle("show", scrollY > 600);

    let current = "";
    sections.forEach((sec) => {
      if (sec && sec.getBoundingClientRect().top <= innerHeight * 0.4) current = sec.id;
    });
    navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + current));
  }
  addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  $("#to-top").addEventListener("click", () => scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  /* ----------------------------------------------------------
     Text scramble (hero headline)
  ---------------------------------------------------------- */
  const scrambleChars = "π∑Δ√∞×±ƒλΩ<>/!?$%&#@*+=01";
  const scrambled = $$(".scramble");

  scrambled.forEach((el) => {
    if (reduceMotion) return;
    const target = el.dataset.text || el.textContent;
    const chars = target.split("");

    el.innerHTML = chars.map(() => '<span class="sc-ch">' + (chars[0]) + "</span>").join("");

    const spans = $$(".sc-ch", el);
    let frame = 0;
    const total = 28;

    (function tick() {
      const settled = Math.floor((frame / total) * chars.length);
      spans.forEach((s, i) => {
        if (i < settled) { s.textContent = chars[i]; s.style.opacity = 1; }
        else { s.textContent = scrambleChars[(Math.random() * scrambleChars.length) | 0]; s.style.opacity = 0.55; }
      });
      frame++;
      if (frame <= total) requestAnimationFrame(tick);
      else spans.forEach((s, i) => { s.textContent = chars[i]; s.style.opacity = 1; });
    })();
  });

  /* ----------------------------------------------------------
     Rotating word wheel
  ---------------------------------------------------------- */
  const wheel = $("#wheel");
  if (wheel) {
    const words = ["MATHEMATICS", "PHYSICS", "CHEMISTRY", "TECH", "SCIENCE"];
    let wi = 0;
    const cycle = () => {
      wheel.style.opacity = 0;
      wheel.style.transform = "translateY(6px) rotate(-1deg)";
      setTimeout(() => {
        wi = (wi + 1) % words.length;
        wheel.textContent = words[wi];
        wheel.style.transition = "opacity .25s, transform .25s";
        wheel.style.opacity = 1;
        wheel.style.transform = "translateY(0) rotate(-1deg)";
      }, 250);
    };
    if (!reduceMotion) setInterval(cycle, 2600);
  }

  /* ----------------------------------------------------------
     Sine wave in hero
  ---------------------------------------------------------- */
  const wavePath = $("#wave-path");
  if (wavePath) {
    const W = 1200, A = 22, period = 300, freq = (Math.PI * 2) / period;
    let d = "M0 60";
    for (let x = 0; x <= W; x += 6) {
      const y = 60 + A * Math.sin(freq * x);
      d += x === 0 ? "" : " L" + x.toFixed(1) + " " + y.toFixed(1);
    }
    wavePath.setAttribute("d", d + " L1200 120 L0 120 Z");
    wavePath.setAttribute("fill", "rgba(0,184,240,0.15)");
  }

  /* ----------------------------------------------------------
     Marquee: duplicate track content for seamless loop
  ---------------------------------------------------------- */
  $$(".marquee-track").forEach((track) => {
    const original = track.innerHTML;
    track.innerHTML = original + original;
  });

  /* ----------------------------------------------------------
     Reveal on scroll
  ---------------------------------------------------------- */
  const revealEls = $$(".reveal");
  revealEls.forEach((el, i) => {
    el.style.setProperty("--d", ((i % 5) * 0.08).toFixed(2) + "s");
  });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ----------------------------------------------------------
     Count-up numbers
  ---------------------------------------------------------- */
  const counters = $$("[data-count]:not(#stat-age)");
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const end = parseFloat(el.dataset.count);
      const dur = 1200;
      const t0 = performance.now();
      (function step(t) {
        const p = Math.min(1, (t - t0) / dur);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      })(t0);
      cio.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach((c) => cio.observe(c));

  /* ----------------------------------------------------------
     Live age: born 2007.09.04 — years + days alive
  ---------------------------------------------------------- */
  const BORN = new Date(2007, 8, 4);
  const ageChip = $("#age-chip");
  const statAge = $("#stat-age");

  function updateAge() {
    const now = new Date();
    const days = Math.floor((now - BORN) / 86400000);
    const years = days / 365.2422;
    if (ageChip) ageChip.textContent = days.toLocaleString("en-US");
    if (statAge && !statAge.dataset.counted) {
      const end = years.toFixed(1);
      const dur = 1200;
      const t0 = performance.now();
      (function step(t) {
        const p = Math.min(1, (t - t0) / dur);
        statAge.textContent = (parseFloat(end) * (1 - Math.pow(1 - p, 3))).toFixed(1);
        if (p < 1) requestAnimationFrame(step);
        else statAge.dataset.counted = "1";
      })(t0);
    }
  }
  updateAge();
  setInterval(updateAge, 60000); // re-check daily; cheap anyway

  /* ----------------------------------------------------------
     Magnetic buttons
  ---------------------------------------------------------- */
  if (finePointer && !reduceMotion) {
    $$(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = "translate(" + dx * 0.22 + "px," + dy * 0.32 + "px)";
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  /* ----------------------------------------------------------
     3D tilt cards
  ---------------------------------------------------------- */
  if (finePointer && !reduceMotion) {
    $$(".tilt").forEach((card) => {
      const max = 7;
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          "perspective(900px) rotateX(" + (-py * max) + "deg) rotateY(" + (px * max) + "deg)";
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ----------------------------------------------------------
     Logo click → math-symbol confetti
  ---------------------------------------------------------- */
  const logo = $("#logo");
  if (logo && !reduceMotion) {
    logo.addEventListener("click", (e) => {
      e.preventDefault();
      const symbols = ["π", "∑", "Δ", "√", "∞", "×", "±", "ƒ", "λ", "ω"];
      const colors = ["#00B8F0", "#7C4DFF", "#FF2E9A", "#B8F000", "#16130F"];
      const x0 = e.clientX, y0 = e.clientY;

      for (let i = 0; i < 26; i++) {
        const bit = document.createElement("span");
        bit.className = "confetti-bit";
        bit.textContent = symbols[(Math.random() * symbols.length) | 0];
        const size = 14 + Math.random() * 18;
        bit.style.left = x0 + "px";
        bit.style.top = y0 + "px";
        bit.style.fontSize = size + "px";
        bit.style.color = colors[(Math.random() * colors.length) | 0];
        bit.style.setProperty("--cx", (Math.random() * 220 - 110).toFixed(0) + "px");
        bit.style.setProperty("--cy", (-Math.random() * 220 - 30).toFixed(0) + "px");
        bit.style.setProperty("--cr", (Math.random() * 540 - 270).toFixed(0) + "deg");
        document.body.appendChild(bit);
        setTimeout(() => bit.remove(), 1400);
      }
      scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }
})();
