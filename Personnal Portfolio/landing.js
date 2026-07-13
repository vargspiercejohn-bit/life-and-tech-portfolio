const typedText = document.getElementById("typedText");
const stage = document.querySelector(".landing-stage");
const words = [
  "refined visuals",
  "quiet storytelling",
  "digital identity",
  "modern elegance",
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  if (!typedText) {
    return;
  }

  const currentWord = words[wordIndex];

  if (isDeleting) {
    charIndex -= 1;
  } else {
    charIndex += 1;
  }

  typedText.textContent = currentWord.slice(0, charIndex);

  let delay = isDeleting ? 45 : 90;

  if (!isDeleting && charIndex === currentWord.length) {
    delay = 1200;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    delay = 240;
  }

  window.setTimeout(typeLoop, delay);
}

function setupParallax() {
  if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  window.addEventListener("pointermove", (event) => {
    const xRatio = (event.clientX / window.innerWidth - 0.5) * 2;
    const yRatio = (event.clientY / window.innerHeight - 0.5) * 2;

    stage.style.transform = `translate(${xRatio * 4}px, ${yRatio * 4}px)`;
  });

  window.addEventListener("pointerleave", () => {
    stage.style.transform = "";
  });
}

typeLoop();
setupParallax();
