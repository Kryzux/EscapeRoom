let player;
let audioContext;
let analyser;
let dataArray;

function onYouTubeIframeAPIReady() {
    document.getElementById('load-video').addEventListener('click', loadVideo);
}

function loadVideo() {
    const url = document.getElementById('youtube-url').value;
    const videoId = extractVideoId(url);

    if (!videoId) {
        alert("Invalid YouTube URL.");
        return;
    }

    if (player) {
        player.loadVideoById(videoId);
    } else {
        player = new YT.Player('player', {
            height: '315',
            width: '560',
            videoId: videoId,
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }
}

function extractVideoId(url) {
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+|(?:v|e(?:mbed)?)\/([^"&?\/\s]*))|youtu\.be\/([^"&?\/\s]*))/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

function onPlayerReady(event) {
    console.log("Player is ready");
    event.target.playVideo();
    initAudioContext();
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        console.log("Video is playing");
        startVisualizer();
    }
}

function initAudioContext() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(player.getIframe());
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
}

function startVisualizer() {
    function draw() {
        analyser.getByteFrequencyData(dataArray);
        drawVisualizer();
        requestAnimationFrame(draw);
    }

    draw();
}

function drawVisualizer() {
    const canvas = document.getElementById('visualizer');
    const canvasCtx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = 400;

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / analyser.frequencyBinCount) * 2.5;
    let x = 0;

    for (let i = 0; i < analyser.frequencyBinCount; i++) {
        const barHeight = dataArray[i];
        const r = barHeight + 25 * (i / analyser.frequencyBinCount);
        const g = 250 * (i / analyser.frequencyBinCount);
        const b = 50;
        
        canvasCtx.fillStyle = `rgb(${r},${g},${b})`;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
    }
}
