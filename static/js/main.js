// DOM
const canvas = document.getElementById("canvas");
const btnReset = document.getElementById("btn-reset");
const predictionContainer = document.getElementById("prediction");
const probsContainer = document.getElementById("probs");
const placeholder = document.getElementById("placeholder");

const defaultText = "✏️ Draw a digit on the canvas";

// Canvas context
const ctx = canvas.getContext("2d");

// Canvas origin point coordinates
let originX = canvas.offsetLeft;
let originY = canvas.offsetTop;

let isPainting = false;

// Config canvas styles
ctx.lineWidth = 15;
ctx.strokeStyle = "white";
ctx.lineCap = "round";

async function fetchPrediction(imgData) {
  const url = "/predict";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: imgData }),
  });

  return await response.json();
}

function startLoading() {
  placeholder.innerHTML = `<span class="loading loading-spinner loading-sm"></span>`;
}

function stopLoading() {
  placeholder.innerHTML = "";
}

function setProbabilities(probs) {
  const probListItems = probs.map(
    (prob, i) =>
      `<li class="btn w-full">
      ${i}
      <div class="badge">${parseInt(prob * 100)}%</div>
    </li>`
  );

  probsContainer.innerHTML = "";

  for (const probListItem of probListItems) {
    probsContainer.innerHTML += probListItem;
  }
}

function setPrediction(prediction) {
  predictionContainer.innerText = prediction;
}

function rgbaToRgb(rgba) {
  let rgb = [];

  for (let i = 0; i < rgba.length; i += 4) {
    rgb.push([rgba[i], rgba[i + 1], rgba[i + 2]]);
  }

  return rgb;
}

function reset() {
  predictionContainer.innerText = "";
  probsContainer.innerHTML = "";
  placeholder.innerHTML = defaultText;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

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
    const imgDataRgba = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    ).data;

    const imgDataRgb = rgbaToRgb(imgDataRgba);

    startLoading();

    fetchPrediction(imgDataRgb)
      .then((prediction) => {
        setPrediction(prediction.prediction);
        setProbabilities(prediction.probs);
      })
      .catch(console.error)
      .finally(() => {
        stopLoading();
      });
  }

  isPainting = false;
});

btnReset.addEventListener("click", reset);

reset();
