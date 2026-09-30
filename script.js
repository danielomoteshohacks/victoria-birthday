(function () {
  "use strict";

  /* ================= 1. LIVE COSMOS & STARDUST CANVAS ================= */
  const canvas = document.getElementById("cosmosCanvas");
  const ctx = canvas.getContext("2d");
  let w, h;
  const particles = [];

  function setCanvasBounds() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", setCanvasBounds);
  setCanvasBounds();

  class CosmicStardust {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.x = Math.random() * w;
      this.y = initial ? Math.random() * h : h + 15;
      this.radius = Math.random() * 2 + 0.6;
      this.speedY = Math.random() * 0.45 + 0.2;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.65 + 0.15;
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
      this.colorTone = Math.random() > 0.4 
        ? "255, 215, 130"   // Golden
        : "216, 131, 157";  // Soft Rose
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.alpha += Math.sin(Date.now() * this.pulseSpeed) * 0.006;
      if (this.y < -20 || this.x < -20 || this.x > w + 20) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.colorTone}, ${Math.max(0.1, Math.min(0.85, this.alpha))})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = "#ffd782";
      ctx.fill();
    }
  }

  for (let i = 0; i < 50; i++) {
    particles.push(new CosmicStardust());
  }

  function renderCosmos() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(renderCosmos);
  }
  renderCosmos();

  /* ================= 2. LUMINOUS PROCEDURAL BALLOONS ================= */
  const balloonSky = document.getElementById("balloonSky");
  const balloonGradients = [
    "radial-gradient(circle at 35% 30%, #ffd97d, #c98236)", // Gold
    "radial-gradient(circle at 35% 30%, #f7c5cc, #a64b66)", // Soft Rose
    "radial-gradient(circle at 35% 30%, #d8b7ff, #623d94)", // Lavender
    "radial-gradient(circle at 35% 30%, #ffffff, #b0a190)", // Pearlescent
    "radial-gradient(circle at 35% 30%, #fbd5a5, #9e6435)"  // Warm Honey
  ];

  function populateBalloons() {
    const totalBalloons = 9;
    for (let i = 0; i < totalBalloons; i++) {
      const b = document.createElement("div");
      b.className = "balloon";
      
      const width = Math.floor(Math.random() * 20 + 36); // 36px to 56px
      const height = Math.floor(width * 1.25);
      const isDistant = Math.random() > 0.6; // Depth of field

      b.style.width = width + "px";
      b.style.height = height + "px";
      b.style.left = (Math.random() * 90 + 4) + "%";
      b.style.background = balloonGradients[i % balloonGradients.length];
      b.style.setProperty("--balloon-opacity", isDistant ? "0.45" : "0.75");
      b.style.setProperty("--drift-shift", (Math.random() * 60 - 30) + "px");
      b.style.setProperty("--rot", (Math.random() * 16 - 8) + "deg");
      
      if (isDistant) {
        b.style.filter = "blur(2px) drop-shadow(0 0 10px rgba(255,215,130,0.15))";
      }

      b.style.animationDuration = (Math.random() * 10 + 16) + "s";
      b.style.animationDelay = (i * 2.2) + "s";
      balloonSky.appendChild(b);
    }
  }
  populateBalloons();

  /* ================= 3. SMOOTH EXPONENTIAL AUDIO ENGINE ================= */
  const audio = document.getElementById("bgAudio");
  let fadeInterval = null;

  function fadeAudioTo(targetVolume, durationMs, callback) {
    if (!audio) return;
    clearInterval(fadeInterval);

    const startVolume = audio.volume;
    const diff = targetVolume - startVolume;
    const steps = 30;
    const stepTime = durationMs / steps;
    let currentStep = 0;

    fadeInterval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      // Soft cubic ease
      const eased = 1 - Math.pow(1 - progress, 3);
      audio.volume = Math.max(0, Math.min(1, startVolume + diff * eased));

      if (currentStep >= steps) {
        clearInterval(fadeInterval);
        if (callback) callback();
      }
    }, stepTime);
  }

  /* ================= 4. CANDLE REVEAL TRANSITION ================= */
  const threshold = document.getElementById("threshold");
  const letter = document.getElementById("letter");
  const candleBtn = document.getElementById("candleBtn");
  const audioToggle = document.getElementById("audioToggle");
  const audioStatus = document.getElementById("audioStatus");
  let isTriggered = false;

  candleBtn.addEventListener("click", () => {
    if (isTriggered) return;
    isTriggered = true;

    // Light the flame visually
    candleBtn.classList.add("is-lit");

    // Begin audio smoothly at 0 volume and swell over 4.2 seconds
    if (audio) {
      audio.volume = 0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => fadeAudioTo(0.85, 4200))
          .catch(() => {
            // Failsafe if browser prohibits audio without interaction
          });
      }
    }

    // Smooth transition from threshold to letter sanctuary
    setTimeout(() => {
      threshold.classList.add("is-hidden");
      letter.classList.add("is-visible");
      audioToggle.style.display = "flex";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1500);
  });

  /* ================= 5. AUDIO PILL CONTROLLER ================= */
  audioToggle.addEventListener("click", () => {
    if (!audio) return;

    if (audio.paused) {
      audio.play().then(() => {
        fadeAudioTo(0.85, 1200);
        audioToggle.classList.remove("is-paused");
        audioStatus.textContent = "Playing softly";
      }).catch(() => {});
    } else {
      fadeAudioTo(0, 1000, () => {
        audio.pause();
        audioToggle.classList.add("is-paused");
        audioStatus.textContent = "Music paused";
      });
    }
  });
})();
