const landingTypewriter = document.getElementById("landingTypewriter");
const landingClock = document.getElementById("landingClock");
const systemMessages = [
  "WEBSITE_DEVELOPMENT",
  "SYSTEMS_DESIGN",
  "VISUAL_IDENTITY",
  "ADMIN_SUPPORT",
];

function updateLandingClock() {
  if (!landingClock) {
    return;
  }

  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());

  landingClock.textContent = `${time} PHT`;
}

function startTypewriter() {
  if (!landingTypewriter) {
    return;
  }

  let messageIndex = 0;
  let characterIndex = 0;
  let deleting = false;

  function typeNextCharacter() {
    const message = systemMessages[messageIndex];

    characterIndex += deleting ? -1 : 1;
    landingTypewriter.textContent = message.slice(0, characterIndex);

    let delay = deleting ? 35 : 58;

    if (!deleting && characterIndex === message.length) {
      deleting = true;
      delay = 1150;
    } else if (deleting && characterIndex === 0) {
      deleting = false;
      messageIndex = (messageIndex + 1) % systemMessages.length;
      delay = 260;
    }

    window.setTimeout(typeNextCharacter, delay);
  }

  window.setTimeout(typeNextCharacter, 850);
}

function startLandingMotion() {
  window.setTimeout(() => {
    window.requestAnimationFrame(() => {
      document.body.classList.add("landing-motion-ready");
      startTypewriter();
    });
  }, 120);
}

updateLandingClock();
window.setInterval(updateLandingClock, 1000);

if (document.readyState === "complete") {
  startLandingMotion();
} else {
  window.addEventListener("load", startLandingMotion, { once: true });
}
