// script.js
let dimensions;
let imageLoaded = false;
let topText = "";
let bottomText = "";
let utter;
let voices;
const img = new Image(); // used to load image from <input> and draw to canvas
const ctx = document.getElementById('user-image').getContext('2d');
ctx.fillStyle = 'black';
ctx.fillRect(0,0,400,400);
ctx.font = "36px Impact"
ctx.textAlign = "center";
const resetButton = document.querySelector("button[type='reset']");
const speakButton = document.querySelector("button[type='button']");
const imageInput = document.getElementById("image-input");
const voiceSelect = document.getElementById("voice-selection");

speechSynthesis.addEventListener("voiceschanged", e => {
  voices = speechSynthesis.getVoices();
  for (let voice in voices) {
    console.log(voice);
    const option = document.createElement("option");
    option.textContent = voice.name + ' (' + voices.lang + ')';
    if(voices.default) {
      option.textContent += ' -- DEFAULT';
    }
    option.setAttribute('data-lang', voice.lang);
    option.setAttribute('data-name', voice.name);
    voiceSelect.options.add(option);
  }
  voiceSelect.disabled = false;
})

//Set img.src
imageInput.addEventListener('input', e => {
  img.src = URL.createObjectURL(imageInput.files[0]);
  imageLoaded = true;
  resetButton.disabled = false;
})

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  dimensions = getDimmensions(400,400,img.width,img.height);
  render();
});

const form = document.getElementById("generate-meme");
form.addEventListener('submit', e => {
  e.preventDefault();
  topText = document.getElementById("text-top").value;
  bottomText = document.getElementById("text-bottom").value;
  if (!topText && !bottomText) return;
  utter = new SpeechSynthesisUtterance(topText + ".  .  ." + bottomText);
  console.log(voiceSelect.options);
  resetButton.disabled = false;
  speakButton.disabled = false; 
  render();
})

resetButton.addEventListener("click", e => {
  topText="";
  bottomText="";
  imageLoaded = false;
  render();
  resetButton.disabled = true;
  speakButton.disabled = true;
  form.reset();
})

speakButton.addEventListener("click", e => {
  speechSynthesis.speak(utter);
})

function render() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,400,400);
  if (imageLoaded) {
    ctx.drawImage(img,dimensions.startX,dimensions.startY,dimensions.width,dimensions.height);
  }
  if (topText || bottomText) {
    ctx.fillStyle = 'rgb(220,220,220)';
    ctx.textBaseline = "top";
    ctx.fillText(topText,200,5);
    ctx.textBaseline = "bottom";
    ctx.fillText(bottomText,200,395);
  }
}

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
