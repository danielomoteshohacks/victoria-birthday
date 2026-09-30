(() => {
  "use strict";

  /* ============ CANVAS: drifting stardust ============ */
  const canvas = document.getElementById("sky");
  const ctx = canvas.getContext("2d");
  let W, H, DPR;
  let particles = [];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function makeParticles() {
    const count = Math.min(90, Math.floor((W * H) / 14000));
    particles = Array.from({ length: count }, () => spawnParticle(true));
  }

  function spawnParticle(randomY) {
    const kind = Math.random() < 0.18 ? "spark" : "mote";
    return {
      x: Math.random() * W,
      y: randomY ? Math.random() * H : H + 20,
