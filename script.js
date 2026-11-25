// Birthday target: 1 December 2026 at 00:00, India Standard Time (UTC+05:30).
const target = new Date("2026-12-01T00:00:00+05:30").getTime();

const $ = (id) => document.getElementById(id);

function pad(n) {
  return String(n).padStart(2, "0");
}

function updateCountdown() {
  const now = Date.now();
  const distance = target - now;

  if (distance <= 0) {
    $("days").textContent = "00";
    $("hours").textContent = "00";
    $("minutes").textContent = "00";
    $("seconds").textContent = "00";
    $("message").textContent = "It's time ✨";
    document.title = "It's time ✨";
    return;
  }

  const totalSeconds = Math.floor(distance / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  $("days").textContent = pad(days);
  $("hours").textContent = pad(hours);
  $("minutes").textContent = pad(minutes);
  $("seconds").textContent = pad(seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Tap the polaroid: it straightens up and a few hearts float out
const photo = $("photo");
const hearts = ["💖", "💕", "💗", "🌸", "✨", "💝"];
photo.addEventListener("click", () => {
  photo.classList.toggle("straight");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const box = photo.getBoundingClientRect();
  const cx = box.left + box.width / 2;
  const cy = box.top + box.height / 2;
  for (let i = 0; i < 12; i++) {
    const el = document.createElement("span");
    el.className = "pop";
    el.textContent = hearts[i % hearts.length];
    const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.4;
    const dist = 70 + Math.random() * 60;
    el.style.left = cx - 11 + "px";
    el.style.top = cy - 11 + "px";
    el.style.setProperty("--dx", Math.cos(angle) * dist + "px");
    el.style.setProperty("--dy", Math.sin(angle) * dist - 30 + "px");
    el.style.setProperty("--r", (Math.random() * 60 - 30) + "deg");
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
  if (navigator.vibrate) navigator.vibrate(20);
});
