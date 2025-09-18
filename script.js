body {
  margin: 0;
  padding: 0;
  background: linear-gradient(to top right, #ffe4ec, #e4f7ff, #fff4e1);
  font-family: 'Comic Sans MS', cursive, sans-serif;
  overflow: hidden;
}

.container {
  text-align: center;
  margin-top: 40px;
}

h1 {
  color: #ff80ab;
  font-size: 2.2em;
  margin-bottom: 10px;
}

.instruction {
  font-size: 18px;
  color: #444;
  margin-bottom: 20px;
}

canvas {
  display: block;
  margin: 0 auto;
}

#cake {
  border: 2px dashed #ffb6c1;
  border-radius: 12px;
}

#confetti {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px 30px;
  font-size: 24px;
  font-weight: bold;
  border-radius: 12px;
  color: #333;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.hidden {
  display: none;
}
