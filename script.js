(function () {
  "use strict";

  const threshold   = document.getElementById("threshold");
  const letter      = document.getElementById("letter");
  const candleBtn   = document.getElementById("candleBtn");
  const audio       = document.getElementById("bgAudio");
  const audioToggle = document.getElementById("audioToggle");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- ambient particles ---------- */
  function scatter(container, count) {
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      const left = Math.random() * 100;
      const duration = 9 + Math.random() * 10;
      const delay = Math.random() * 12;
      const driftX = (Math.random() * 60 - 30).toFixed(0) + "px";
      p.style.left = left + "%";
      p.style.animationDuration = duration + "s";
      p.style.animationDelay = delay + "s";
      p.style.setProperty("--drift-x", driftX);
      container.appendChild(p);
    }
  }
  if (!reduceMotion) {
    document.querySelectorAll(".drift--embers").forEach((el) => scatter(el, 14));
    document.querySelectorAll(".drift--motes").forEach((el) => scatter(el, 10));
  }

  /* ---------- volume fade ---------- */
  function fadeVolume(target, ms) {
    const start = performance.now();
    const from = audio.volume;
    function step(now) {
      const t = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic, reads as a soft rise
      audio.volume = from + (target - from) * eased;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- candle -> letter ---------- */
  let lit = false;
  candleBtn.addEventListener("click", () => {
    if (lit) return;
    lit = true;

    candleBtn.classList.add("is-lit");
    candleBtn.setAttribute("aria-label", "Candle lit");

    audio.volume = 0;
    const playPromise = audio.play();
    if (playPromise && playPromise.catch) {
      playPromise
        .then(() => fadeVolume(0.75, 3200))
        .catch(() => { /* audio file missing or blocked — the moment still works in silence */ });
    }

    window.setTimeout(() => {
      threshold.classList.remove("is-active");
      letter.classList.add("is-active");
      audioToggle.hidden = false;
      audioToggle.classList.add("is-playing");
      window.scrollTo(0, 0);
    }, reduceMotion ? 300 : 1500);
  });

  /* ---------- floating audio toggle ---------- */
  audioToggle.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch(() => {});
      audioToggle.setAttribute("aria-pressed", "true");
      audioToggle.setAttribute("aria-label", "Pause music");
      audioToggle.classList.add("is-playing");
    } else {
      audio.pause();
      audioToggle.setAttribute("aria-pressed", "false");
      audioToggle.setAttribute("aria-label", "Play music");
      audioToggle.classList.remove("is-playing");
    }
  });
})();
```[span_1](start_span)[span_1](end_span)
