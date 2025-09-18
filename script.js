const canvas = document.getElementById("cake");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;

let candlesLit = [true, true, true, true, true];

// gambar kue pastel 🎂
function drawCake() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // kue dasar pastel
  ctx.fillStyle = "#ffd1dc"; // pink pastel
  ctx.fillRect(100, 250, 200, 100);

  ctx.fillStyle = "#ffb6b9"; // lebih tua sedikit
  ctx.fillRect(100, 230, 200, 20);

  // lilin pastel
  const spacing = 200 / (candlesLit.length + 1);
  for (let i = 0; i < candlesLit.length; i++) {
    const x = 100 + spacing * (i + 1);
    const y = 190;

    ctx.fillStyle = "#a7c7e7"; // biru pastel
    ctx.fillRect(x - 5, y, 10, 40);

    if (candlesLit[i]) {
      ctx.beginPath();
      ctx.ellipse(x, y - 10, 6, 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#ffcc80"; // api pastel
      ctx.fill();
    }
  }
}
drawCake();

// mic input super sensitif
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(function(stream) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const mic = audioContext.createMediaStreamSource(stream);
    mic.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);

    function detectBlow() {
      analyser.getByteFrequencyData(data);
      let values = 0;
      for (let i = 0; i < data.length; i++) values += data[i];
      let average = values / data.length;

      if (average > 5 && candlesLit.some(l => l)) { // sensitif banget
        for (let i = 0; i < candlesLit.length; i++) {
          if (candlesLit[i]) {
            candlesLit[i] = false;
            break;
          }
        }
        drawCake();
        if (!candlesLit.some(l => l)) {
          launchConfetti();
          document.getElementById("popup").classList.remove("hidden");
        }
      }
      requestAnimationFrame(detectBlow);
    }
    detectBlow();
  })
  .catch(function(err) {
    console.log("Mic not allowed", err);
  });

// fallback klik
canvas.addEventListener("click", () => {
  if (candlesLit.some(l => l)) {
    for (let i = 0; i < candlesLit.length; i++) {
      if (candlesLit[i]) {
        candlesLit[i] = false;
        break;
      }
    }
    drawCake();
    if (!candlesLit.some(l => l)) {
      launchConfetti();
      document.getElementById("popup").classList.remove("hidden");
    }
  }
});
