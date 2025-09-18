// confetti.js - efek confetti sederhana, meledak dari kiri & kanan
const confettiCanvas = document.getElementById("confetti");
const confettiCtx = confettiCanvas.getContext("2d");
function resizeConfettiCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
resizeConfettiCanvas();
window.addEventListener("resize", resizeConfettiCanvas);

let confettiPieces = [];

function ConfettiPiece(x, y, color, vx) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.size = Math.random() * 6 + 4;
  this.vx = vx;
  this.vy = Math.random() * 2 + 2;
  this.rotate = Math.random() * Math.PI;
  this.vr = (Math.random() - 0.5) * 0.2;
}

function launchConfetti() {
  const w = confettiCanvas.width;
  const h = confettiCanvas.height;
  for (let i = 0; i < 220; i++) {
    const fromLeft = i % 2 === 0;
    const x = fromLeft ? -10 : w + 10;
    const y = Math.random() * h * 0.6;
    const vx = fromLeft ? (Math.random() * 4 + 2) : -(Math.random() * 4 + 2);
    const colors = ["#ff80ab", "#ffd27f", "#a7d8f7", "#c7f7d8", "#cba6f7"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    confettiPieces.push(new ConfettiPiece(x, y, color, vx));
  }
}

// draw loop
function drawConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  for (let i = 0; i < confettiPieces.length; i++) {
    const p = confettiPieces[i];
    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate(p.rotate);
    confettiCtx.fillStyle = p.color;
    confettiCtx.fillRect(-p.size/2, -p.size/2, p.size, p.size*0.6);
    confettiCtx.restore();

    p.x += p.vx;
    p.y += p.vy;
    p.rotate += p.vr;
    p.vy += 0.05; // gravity

    // remove when out of view
    if (p.y > confettiCanvas.height + 50 || p.x < -100 || p.x > confettiCanvas.width + 100) {
      confettiPieces.splice(i, 1);
      i--;
    }
  }
  requestAnimationFrame(drawConfetti);
}
drawConfetti();
