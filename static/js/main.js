const canvas = document.getElementById("canvas");
const btnReset = document.getElementById("btn-reset");
const ctx = canvas.getContext("2d");

let originX = canvas.offsetLeft;
let originY = canvas.offsetTop;

let isPainting = false;

ctx.lineWidth = 10;
ctx.strokeStyle = "white";
ctx.lineCap = "round";

window.addEventListener("resize", () => {
  originX = canvas.offsetLeft;
  originY = canvas.offsetTop;
});

canvas.addEventListener("mousedown", (e) => {
  let x = e.clientX - originX;
  let y = e.clientY - originY;

  ctx.beginPath();
  isPainting = true;
});

canvas.addEventListener("mousemove", (e) => {
  if (!isPainting) return;

  const x = e.clientX - originX;
  const y = e.clientY - originY;

  ctx.lineTo(x, y);
  ctx.stroke();
});

window.addEventListener("mouseup", () => {
  isPainting = false;
});

btnReset.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
