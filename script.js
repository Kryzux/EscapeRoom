// Initialize CodeMirror instances for HTML, CSS, and JavaScript
const htmlEditor = CodeMirror.fromTextArea(document.getElementById('htmlEditor'), {
    mode: 'xml',
    theme: 'default',
    lineNumbers: true,
    tabSize: 2,
});

const cssEditor = CodeMirror.fromTextArea(document.getElementById('cssEditor'), {
    mode: 'css',
    theme: 'default',
    lineNumbers: true,
    tabSize: 2,
});

const jsEditor = CodeMirror.fromTextArea(document.getElementById('jsEditor'), {
    mode: 'javascript',
    theme: 'default',
    lineNumbers: true,
    tabSize: 2,
});

// Store references to the editors
const editors = { htmlEditor, cssEditor, jsEditor };

// Initialize first editor as active
htmlEditor.getWrapperElement().classList.add('active');

// Handle tab switching
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Set active tab
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Show the corresponding editor
        const editorId = tab.getAttribute('data-editor');
        Object.keys(editors).forEach(key => {
            const editor = editors[key];
            if (key === editorId) {
                editor.getWrapperElement().classList.add('active');
                editor.refresh(); // Ensure editor updates its layout
            } else {
                editor.getWrapperElement().classList.remove('active');
            }
        });
    });
});

// Function to run the combined code
function runCode() {
    const htmlCode = htmlEditor.getValue();
    const cssCode = cssEditor.getValue();
    const jsCode = jsEditor.getValue();

    const iframe = document.getElementById('sandbox');
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
