const landingShell = document.querySelector(".landing-shell");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

if (landingShell && finePointer.matches && !reducedMotion.matches) {
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  function renderMotion() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    landingShell.style.setProperty("--motion-x", `${currentX}px`);
    landingShell.style.setProperty("--motion-y", `${currentY}px`);
    landingShell.style.setProperty("--motion-x-reverse", `${currentX * -0.45}px`);
    landingShell.style.setProperty("--motion-y-reverse", `${currentY * -0.45}px`);
    landingShell.style.setProperty("--orbit-x", `${currentX * -0.7}px`);
    landingShell.style.setProperty("--orbit-y", `${currentY * -0.7}px`);
    window.requestAnimationFrame(renderMotion);
  }

  window.addEventListener("pointermove", (event) => {
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;

    targetX = x * 10;
    targetY = y * 10;
  });

  window.addEventListener("pointerleave", () => {
    targetX = 0;
    targetY = 0;
  });

  window.requestAnimationFrame(renderMotion);
}
