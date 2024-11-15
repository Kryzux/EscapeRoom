document.getElementById("run-btn").addEventListener("click", () => {
  // Get code from the textareas
  const htmlCode = document.getElementById("html-editor").value;
  const cssCode = `<style>${document.getElementById("css-editor").value}</style>`;
  const jsCode = `<script>${document.getElementById("js-editor").value}<\/script>`;

  // Combine code into one document
  const output = document.getElementById("output");
  const blob = new Blob([htmlCode + cssCode + jsCode], { type: "text/html" });

  // Load the content into the iframe
  output.src = URL.createObjectURL(blob);
});

document.getElementById("fullscreen-btn").addEventListener("click", () => {
  const output = document.getElementById("output");

  // Request fullscreen mode for the iframe
  if (output.requestFullscreen) {
    output.requestFullscreen();
  } else if (output.mozRequestFullScreen) {
    output.mozRequestFullScreen(); // For Firefox
  } else if (output.webkitRequestFullscreen) {
    output.webkitRequestFullscreen(); // For Safari and Chrome
  } else if (output.msRequestFullscreen) {
    output.msRequestFullscreen(); // For IE/Edge
  }
});
