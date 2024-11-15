// JavaScript

// Get the YouTube video link and button
const youtubeLinkInput = document.getElementById('youtube-link');
const loadButton = document.getElementById('load-music');
const canvas = document.getElementById('visualizationCanvas');
const ctx = canvas.getContext('2d');

// Initialize the Web Audio API context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let analyser = audioContext.createAnalyser();
let audioSourceNode;
let frequencyData = new Uint8Array(analyser.frequencyBinCount);

// Handle button click
loadButton.addEventListener('click', () => {
  const youtubeURL = youtubeLinkInput.value;

  if (youtubeURL) {
    loadMusic(youtubeURL);
  }
});

// YouTube Iframe API function
let player;
function onYouTubeIframeAPIReady() {
  // Set up the YouTube player to load the video
  player = new YT.Player('music-container', {
    height: '390',
    width: '640',
    videoId: getYouTubeVideoId(youtubeLinkInput.value),
    events: {
      'onReady': onPlayerReady
    }
  });
}

// Get YouTube Video ID from URL
function getYouTubeVideoId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Once the YouTube player is ready, start the visualization
function onPlayerReady(event) {
  const youtubePlayer = event.target;
  const videoElement = youtubePlayer.getIframe();

  // Connect the YouTube player's audio to Web Audio API
  audioSourceNode = audioContext.createMediaElementSource(videoElement);
  audioSourceNode.connect(analyser);
  analyser.connect(audioContext.destination);

  videoElement.play();
  startVisualizer();
}

// Start the audio visualizer
function startVisualizer() {
  analyser.fftSize = 256; // Size of the frequency bins (smaller = more detailed)
  const bufferLength = analyser.frequencyBinCount;
  frequencyData = new Uint8Array(bufferLength);

  // Resize the canvas for the visualizer
  canvas.width = window.innerWidth;
  canvas.height = 300;

  // Draw the visualizer
  drawVisualizer();
}

// Draw the visualizer on the canvas
function drawVisualizer() {
  analyser.getByteFrequencyData(frequencyData);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = (canvas.width / frequencyData.length) * 2.5;
  let x = 0;

  for (let i = 0; i < frequencyData.length; i++) {
    const barHeight = frequencyData[i];

    ctx.fillStyle = `rgb(${barHeight + 100}, 50, ${barHeight})`;
    ctx.fillRect(x, canvas.height - barHeight - 1, barWidth, barHeight);

    x += barWidth + 1;
  }

  // Keep drawing the visualizer
  requestAnimationFrame(drawVisualizer);
}
