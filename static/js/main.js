const canvas = document.getElementById("canvas");
const btnReset = document.getElementById("btn-reset");
const btnSubmit = document.getElementById("btn-submit");
const predictionContainer = document.getElementById("prediction");
const probsContainer = document.getElementById("probs");
const ctx = canvas.getContext("2d");

let originX = canvas.offsetLeft;
let originY = canvas.offsetTop;

let isPainting = false;

ctx.lineWidth = 15;
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
  if (isPainting) {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const rgbData = [];

    for (let i = 0; i < data.length; i += 4) {
      rgbData.push([data[i], data[i + 1], data[i + 2]]);
    }

    fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ data: rgbData }),
    })
      .then((response) => response.json())
      .then((data) => {
        probsContainer.innerHTML = "";

        const probListItems = data.probs.map(
          (prob, i) => `<li>${i}: ${prob}</li>`
        );
        predictionContainer.innerText = data.prediction;

        for (const probListItem of probListItems) {
          probsContainer.innerHTML += probListItem;
        }
      })
      .catch(console.error);
  }
  isPainting = false;
});

btnReset.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  predictionContainer.innerText = "";
  probsContainer.innerHTML = "";
});
