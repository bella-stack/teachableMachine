let classifier;
let imageModelURL = './my_model/';

let video;
let flippedVideo; 
let label = "";

let videoPlaying = false;
let canvas; 

let toggleButton; // Declare toggleButton globally
let snapButton; 
let clearButton;

// Setup function
function setup() {
  canvas = createCanvas(320, 270);
  canvas.position(50,300);
  canvas.style('border-radius', '20px');
  canvas.style('box-shadow', '0 0 20px 10px #2271b1'); 
  canvas.hide(); 

  toggleButton = createButton('Turn on Camera');
  toggleButton.position(30,50);
  toggleButton.class('button-56');
  toggleButton.mousePressed(toggleVideo);

  snapButton = createButton('Take Picture');
  snapButton.position(200, 50);
  snapButton.class('button-56');
  snapButton.mousePressed(takePicture);
  snapButton.hide();

  clearButton = createButton('Clear Pictures');
  clearButton.position(350, 50); 
  clearButton.class('button-56');
  clearButton.mousePressed(clearPictures);
  // clearButton.hide();

  
  classifier = ml5.imageClassifier(imageModelURL + 'model.json', videoReady);
}

function videoReady() {
  console.log('Video ready');
}

function toggleVideo() {
  if (!videoPlaying) {
    videoPlaying = true;
    toggleButton.html('Turn off Camera');
    video = createCapture(VIDEO);
    video.size(320, 270);
    video.hide(); 
    canvas.show(); 
    snapButton.show();//show snap 
    classifyVideo();
  } else { 
    videoPlaying = false;
    toggleButton.html('Turn on Camera');
    canvas.hide(); 
    snapButton.hide();
    if (video) {
      video.remove(); 
    }

  }
}

function classifyVideo() {
  if (videoPlaying) {
    flippedVideo = ml5.flipImage(video);
    classifier.classify(flippedVideo, gotResult);
    flippedVideo.remove();
  }
}

function draw() {
  if (videoPlaying) {
    background(0);
    image(flippedVideo, 0, 0, width, height);
  }
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  label = results[0].label;
  if (label == "Cat") label = "Kitten :)";
  if (label == "Dog") label = "Puppy :)";
  if (label == "Rabbit") label = "Little Rabbit :)";
  document.getElementById('label-container').textContent = `->>>> Hey! ${label} `;
  if (videoPlaying) {
    classifyVideo();
  }
}

function takePicture() {
  if (videoPlaying) {
    push();
    translate(width, 0); 
    scale(-1, 1); 
    image(video, 0, 0, width, height); 
    pop(); 

    let snap = get();

    let imgElement = createImg(snap.canvas.toDataURL());
    imgElement.style('display', 'block');
    imgElement.style('margin', '10px auto'); 

    imgElement.style('width', '200px');
    imgElement.style('height', 'auto');

    let container = document.getElementById('snapshot-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'snapshot-container';
      document.body.appendChild(container);
    }
    container.appendChild(imgElement.elt); 
  }
}

function clearPictures() {
  const container = document.getElementById('snapshot-container');
  if (container) {
    container.innerHTML = ''; 
  }
}
