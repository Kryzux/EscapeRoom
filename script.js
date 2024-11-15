// Initialize CodeMirror instances
const htmlEditor = CodeMirror.fromTextArea(document.getElementById("htmlEditor"), {
    mode: "xml",
    lineNumbers: true,
    autoCloseBrackets: true,
    theme: "default",
});

const cssEditor = CodeMirror.fromTextArea(document.getElementById("cssEditor"), {
    mode: "css",
    lineNumbers: true,
    autoCloseBrackets: true,
    theme: "default",
});

const jsEditor = CodeMirror.fromTextArea(document.getElementById("jsEditor"), {
    mode: "javascript",
    lineNumbers: true,
    autoCloseBrackets: true,
    theme: "default",
});

const editors = { htmlEditor, cssEditor, jsEditor };

// Tabs Handling
document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        const editorId = tab.getAttribute("data-editor");
        Object.keys(editors).forEach((key) => {
            editors[key].getWrapperElement().style.display = key === editorId ? "block" : "none";
            editors[key].refresh();
        });
    });
});

// Run Code Functionality
function runCode() {
    const htmlCode = htmlEditor.getValue();
    const cssCode = cssEditor.getValue();
    const jsCode = jsEditor.getValue();

    const iframe = document.getElementById("sandbox");
    const doc = iframe.contentDocument || iframe.contentWindow.document;

    doc.open();
    doc.write(`
        <html>
            <head>
                <style>${cssCode}</style>
            </head>
            <body>
                ${htmlCode}
                <script>${jsCode}<\/script>
            </body>
        </html>
    `);
    doc.close();
}

// Save Code to Local Storage
function saveCode() {
    localStorage.setItem("htmlCode", htmlEditor.getValue());
    localStorage.setItem("cssCode", cssEditor.getValue());
    localStorage.setItem("jsCode", jsEditor.getValue());
    alert("Code saved successfully!");
}

// Load Code from Local Storage
function loadCode() {
    htmlEditor.setValue(localStorage.getItem("htmlCode") || "");
    cssEditor.setValue(localStorage.getItem("cssCode") || "");
    jsEditor.setValue(localStorage.getItem("jsCode") || "");
    alert("Code loaded successfully!");
}

// Export Code as File
function exportCode() {
    const blob = new Blob(
        [
            "<html>\n<head>\n<style>\n",
            cssEditor.getValue(),
            "\n</style>\n</head>\n<body>\n",
            htmlEditor.getValue(),
            "\n<script>\n",
            jsEditor.getValue(),
            "\n</script>\n</body>\n</html>",
        ],
        { type: "text/html" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "index.html";
    a.click();
    URL.revokeObjectURL(url);
}

// Theme Switching
function changeTheme() {
    const theme = document.getElementById("themeSelector").value;
    Object.values(editors).forEach((editor) => editor.setOption("theme", theme));
}

// Fullscreen Window for Running Code
function togglePreviewFullscreen() {
    // Get the code from editors
    const htmlCode = htmlEditor.getValue();
    const cssCode = cssEditor.getValue();
    const jsCode = jsEditor.getValue();

    // Create a new window
    const fullscreenWindow = window.open('', '', 'width=100%, height=100%, resizable=yes, fullscreen=yes');

    fullscreenWindow.document.open();
    fullscreenWindow.document.write(`
        <html>
            <head>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
                    ${cssCode}
                </style>
            </head>
            <body>
                ${htmlCode}
                <script>
                    ${jsCode}
                </script>
            </body>
        </html>
    `);
    fullscreenWindow.document.close();
}
