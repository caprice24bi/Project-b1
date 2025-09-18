// script.js
// gambar cake biru pastel + lilin goyang + mic + klik fallback + popup SweetAlert2

const canvas = document.getElementById("cake");
const ctx = canvas.getContext("2d");
// canvas width/height sudah di-attribute HTML (400x400)

// konfigurasi lilin
let candlesCount = 5;
let candlesLit = new Array(candlesCount).fill(true);
let phases = [];
for (let i = 0; i < candlesCount; i++) phases.push(Math.random() * Math.PI * 2);

// waktu animasi
let t = 0;

// gambar kue biru pastel
function drawCake() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // shadow/plate
  ctx.fillStyle = "rgba(40,80,120,0.06)";
  ctx.fillRect(80, 330, 240, 10);

  // badan kue - biru pastel
  ctx.fillStyle = "#bfe9ff"; // biru pastel
  roundRect(ctx, 100, 250, 200, 100, 12, true, false);

  // lapisan atas (sedikit lebih gelap)
  ctx.fillStyle = "#9fd8ff";
  roundRect(ctx, 100, 230, 200, 24, 8, true, false);

  // hiasan sprinkles (opsional)
  drawSprinkles();

  // gambar lilin dengan goyang (swing) - tiap lilin punya fase sendiri
  const spacing = 200 / (candlesCount + 1);
  for (let i = 0; i < candlesCount; i++) {
    const x = 100 + spacing * (i + 1);
    const y = 220; // titik atas batang lilin reference

    // sudut goyang (rad)
    const amplitude = 0.25; // ~14 derajat
    const speed = 0.025;
    const angle = candlesLit[i] ? Math.sin(t * speed + phases[i]) * amplitude : 0;

    // gambar batang lilin dengan rotasi sederhana
    ctx.save();
    ctx.translate(x, y + 20); // pivot di dasar batang (sedikit di bawah)
    ctx.rotate(angle);
    // batang lilin lembut biru
    ctx.fillStyle = "#a7d8f7";
    ctx.fillRect(-5, -40, 10, 40);

    // sumbu smoke / ring: bila sudah padam, beri sedikit efek abu-abu (opsional)
    if (candlesLit[i]) {
      // api
      ctx.beginPath();
      ctx.ellipse(0, -48, 6, 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#ffd27f";
      ctx.fill();

      // inner flicker
      ctx.beginPath();
      ctx.ellipse(0, -50, 3, 6, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#fff2c7";
      ctx.fill();
    } else {
      // kalau padam, bisa tambahkan sedikit asap halus (circle grey)
      ctx.beginPath();
      ctx.fillStyle = "rgba(120,120,120,0.12)";
      ctx.arc(0, -46, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// helper buat rounded rect
function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  if (typeof r === "undefined") r = 5;
  if (typeof fill === "undefined") fill = true;
  if (typeof stroke === "undefined") stroke = false;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

// sprinkle kecil acak di atas kue
function drawSprinkles() {
  const colors = ["#ff9ac2", "#ffd07f", "#a3ddff", "#c7f7d8"];
  for (let i = 0; i < 18; i++) {
    const px = 115 + Math.random() * 170;
    const py = 240 + Math.random() * 20;
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(px, py, 6, 2);
  }
}

// animasi loop
function animate() {
  t++;
  drawCake();
  requestAnimationFrame(animate);
}
animate();

// fungsi untuk tiup/ padam 1 lilin (satu per aksi)
function blowOneCandle() {
  for (let i = 0; i < candlesLit.length; i++) {
    if (candlesLit[i]) {
      candlesLit[i] = false;
      break;
    }
  }
  // cek semua padam
  if (!candlesLit.some(Boolean)) {
    // jeda singkat biar animasi confetti sinkron
    setTimeout(() => {
      if (typeof launchConfetti === "function") launchConfetti();
      // tampilkan popup SweetAlert yg lebih cantik
      Swal.fire({
        title: '🎉 Selamat Ulang Tahun yang ke-34 Sayang 🎂',
        text: 'Semoga harimu penuh cinta & kebahagiaan 💖',
        icon: 'success',
        confirmButtonText: 'Terima kasih 💕'
      });
      // juga tunjukkan overlay popup HTML (opsional)
      const popup = document.getElementById("popup");
      if (popup) popup.classList.remove("hidden");
    }, 250);
  }
}

// klik fallback: padamkan satu lilin per klik
canvas.addEventListener("click", () => {
  if (candlesLit.some(l => l)) blowOneCandle();
});

// --- mic detection (super sensitif) ---
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);

      function detectBlow() {
        analyser.getByteFrequencyData(data);
        let values = 0;
        for (let i = 0; i < data.length; i++) values += data[i];
        let average = values / data.length;
        // threshold sangat sensitif supaya napas kecil/tiupan terdeteksi
        if (average > 6 && candlesLit.some(l => l)) {
          blowOneCandle();
        }
        requestAnimationFrame(detectBlow);
      }
      detectBlow();
    })
    .catch(err => {
      console.log("Mic tidak tersedia/diizinkan — fallback ke klik.", err);
    });
} else {
  console.log("Browser tidak mendukung getUserMedia.");
}

