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
    startCelebration();
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

// ---------- Celebration ----------
let celebrated = false;
const C = (id) => document.getElementById(id);

function startCelebration() {
  if (celebrated) return;
  celebrated = true;
  C("celebration").hidden = false;
  startFireworks();
  playSong().catch(() => { C("soundBtn").hidden = false; });
  setTimeout(() => { C("goBtn").hidden = false; }, 4000);
}

const NOTES = [["G4",.75],["G4",.25],["A4",1],["G4",1],["C5",1],["B4",2],
  ["G4",.75],["G4",.25],["A4",1],["G4",1],["D5",1],["C5",2],
  ["G4",.75],["G4",.25],["G5",1],["E5",1],["C5",1],["B4",1],["A4",2],
  ["F5",.75],["F5",.25],["E5",1],["C5",1],["D5",1],["C5",2]];
const LYRICS = ["Happy birthday to you 🎶","Happy birthday to you 🎶","Happy birthday dear Pavithra 💖","Happy birthday to you 🎉"];
const FREQ = { A4:440, B4:493.88, C5:523.25, D5:587.33, E5:659.25, F5:698.46, G4:392, G5:783.99 };

async function playSong() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  await ctx.resume();
  if (ctx.state !== "running") throw new Error("blocked");
  C("soundBtn").hidden = true;
  const beat = 0.45;
  let t = ctx.currentTime + 0.2, start = t;
  const lineStarts = [0, 6, 12, 19];
  NOTES.forEach(([n, d], i) => {
    const li = lineStarts.indexOf(i);
    if (li >= 0) setTimeout(() => { C("lyric").textContent = LYRICS[li]; }, (t - start) * 1000);
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = "triangle"; o.frequency.value = FREQ[n];
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.3, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + d * beat);
    o.connect(g).connect(ctx.destination);
    o.start(t); o.stop(t + d * beat);
    t += d * beat;
  });
}
C("soundBtn").addEventListener("click", () => playSong().catch(() => {}));

function startFireworks() {
  const cv = C("fireworks"), cx = cv.getContext("2d");
  const fit = () => { cv.width = innerWidth; cv.height = innerHeight; };
  fit(); addEventListener("resize", fit);
  const parts = [];
  const colors = ["#f2b8ff", "#ffd6a5", "#ff7eb6", "#9ae6ff", "#fff3a1"];
  function burst() {
    const x = Math.random() * cv.width, y = cv.height * (0.15 + Math.random() * 0.4);
    const col = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < 50; i++) {
      const a = Math.random() * Math.PI * 2, v = 1 + Math.random() * 4;
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 60 + Math.random() * 30, col });
    }
  }
  setInterval(burst, 700); burst();
  (function loop() {
    cx.fillStyle = "rgba(11,7,18,.22)";
    cx.fillRect(0, 0, cv.width, cv.height);
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.life--;
      if (p.life <= 0) { parts.splice(i, 1); continue; }
      cx.globalAlpha = Math.min(1, p.life / 40);
      cx.fillStyle = p.col;
      cx.fillRect(p.x, p.y, 2.5, 2.5);
    }
    cx.globalAlpha = 1;
    requestAnimationFrame(loop);
  })();
}

const MEMES = [
  { when: "When someone asks your age today", face: "🙈", line: "Adhellam sollave mudiyaadhu!", sub: "Age is just a number… adha naan ezhudhi vechikala 😂" },
  { when: "Me waiting for 12 AM to wish you", face: "🥱⏰", line: "Naanum rowdy dhaan!", sub: "Thookam varudhu, aana wish pannaama poga maaten 😤" },
  { when: "Cake paatha udane Pavithra", face: "🎂🤤", line: "Enakku innum oru piece venum!", sub: "Diet-ah? Adhu naalaiku paathukalam 🍰" },
  { when: "Birthday gift kekura moment", face: "🎁👀", line: "Gift enga da?!", sub: "Love ah mattum vechikitu ennaku enna laabam? 😆" },
  { when: "Friends singing Happy Birthday off-key", face: "🎤😵", line: "Avlo dhaan… mudinjiduchu!", sub: "Paattu illa da, adhu oru kolai 😭" },
  { when: "Pavithra after reading all these memes", face: "😎", line: "Naan dhaan da birthday queen!", sub: "Vera level, vera mari 👑" },
];
let mi = 0;
function showMeme() {
  const m = MEMES[mi];
  C("memeWhen").textContent = m.when;
  C("memeFace").textContent = m.face;
  C("memeLine").textContent = m.line;
  C("memeSub").textContent = m.sub;
  C("bars").innerHTML = MEMES.map((_, i) => `<span class="${i <= mi ? "on" : ""}"></span>`).join("");
  const el = C("meme"); el.classList.remove("in"); void el.offsetWidth; el.classList.add("in");
}
C("goBtn").addEventListener("click", () => {
  C("party").hidden = true; C("memes").hidden = false; mi = 0; showMeme();
});
C("memes").addEventListener("click", () => {
  mi++;
  if (mi >= MEMES.length) { C("memes").hidden = true; C("finale").hidden = false; return; }
  showMeme();
});
C("replayBtn").addEventListener("click", () => {
  C("finale").hidden = true; C("party").hidden = false;
  playSong().catch(() => { C("soundBtn").hidden = false; });
});
