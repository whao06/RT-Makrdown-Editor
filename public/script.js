// Wait for window to load
window.onload = function() {
    var converter = new showdown.Converter(); // create a showdown conversion
    var markdownArea = document.getElementById('markdown'); // Get ref to preview area

    // Initialize CodeMirror with basic config
    // Create editor instance
    var editor = CodeMirror(document.getElementById('editor-container'), {
        mode: 'markdown', 
        theme: 'monokai',
        lineNumbers: true,
        lineWrapping: true,
        placeholder: "Write your text here" // Dont think this actually works
    });

    // Define custom hints for markdown
    CodeMirror.registerHelper("hint", "markdown", function(editor, options) {
        const cursor = editor.getCursor();
        const line = editor.getLine(cursor.line);
        const token = line.slice(0, cursor.ch);

        const markdownHints = {
            '#': [
                {display: '# Heading 1', text: '# '},
                { display: '## Heading 2', text: '## ' },
                { display: '### Heading 3', text: '### ' }
            ],
            '*': [
                { display: 'Bold', text: '**bold text**' },
                { display: 'Italic', text: '*italic text*' },
                { display: 'List item', text: '* ' }
            ],
            '[': [
                { display: 'Link', text: '[link text](url)' }
            ],
            '`': [
                { display: 'Code block', text: '```\n\n```' },
                { display: 'Inline code', text: '`code`' }
            ],
            '-': [
                { display: 'List item', text: '- ' },
                { display: 'Horizontal rule', text: '---\n' }
            ],
            '>': [
                { display: 'Blockquote', text: '> ' }
            ],
            '|': [
                { display: 'Table', text: '| Column 1 | Column 2 |\n|----------|----------|\n' }
            ],
            '!': [
                { display: 'Image', text: '![alt text](image-url)' }
            ]
        };

        let suggestions = [];
        let replacementStart = cursor.ch;

        // Check for trigger characters
        Object.keys(markdownHints).forEach(trigger => {
            if (token.endsWith(trigger)) {
                replacementStart = cursor.ch - trigger.length;
                suggestions = markdownHints[trigger].map(hint => ({
                    text: hint.text,
                    displayText: hint.display,
                    from: CodeMirror.Pos(cursor.line, replacementStart),
                    to: cursor
                }));
            }
        });

        return {
            list: suggestions,
            from: CodeMirror.Pos(cursor.line, replacementStart),
            to: cursor
        };
    });

    // Function to handle autocompletion
    // Prevent multiple boxes, config hint behavior, show suggestions
    function handleAutocomplete(cm) {
        if (cm.state.completionActive) {
            return;
        }

        CodeMirror.showHint(cm, CodeMirror.hint.markdown, {
            completeSingle: false,
            closeOnUnfocus: true,
            alignWithWord: true
        });
    }

    // Add change handler to show suggestions
    // Monitor typing
    editor.on('change', function(cm, change) {
        if (change.origin === '+input') {
            const typed = change.text[0];
            const triggerChars = ['#', '*', '[', '`', '-', '>', '|', '!'];

            if (triggerChars.includes(typed)) {
                setTimeout(handleAutocomplete, 50, cm); // Just for proper timing
            }
        }
    });

    // Handle Enter and Tab keys
    editor.setOption('extraKeys', {
        'Enter': function(cm) {
            if (cm.state.completionActive) {
                let hint = cm.state.completionActive.widget.selectedHint();
                if (hint >= 0) {
                    cm.state,completionActive.widget.pick();
                    return;
                }
            }

            cm.execCommand('newlineAndIndent');
        },
        'Tab': function(cm) {
            if (cm.state.completionActive) {
                let hint = cm.state.completionActive.widget.selectedHint();
                if (hint >= 0) {
                    cm.state.completionActive.widget.pick();
                    return;
                }
            }

            cm.execCommand('indentMore');
        }
    });

    // Live preview
    // Convert markdown to HTML on change
    editor.on('change', function() {
        var markdownText = editor.getValue();
        var html = converter.makeHtml(markdownText);
        markdownArea.innerHTML = html;
    });

    // Download Function
    document.getElementById('downloadBtn').addEventListener('click', function() {
        // Get the content from CodeMirror editor
        const content = editor.getValue(); // Assuming your CodeMirror instance is named 'editor'
        
        // Create current timestamp for the filename
        const now = new Date();
        const timestamp = now.toISOString()
            .replace(/[:.]/g, '-')
            .replace('T', '_')
            .split('.')[0];
        
        // Create filename with timestamp
        const filename = `markdown_${timestamp}.md`;
        
        // Method 1: Using Blob and download attribute
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
        
        // Create download link
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = filename; // Set download attribute to force download
        
        // Make link invisible
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        
        // Trigger download
        downloadLink.click();
        
        // Cleanup
        window.URL.revokeObjectURL(downloadLink.href);
        document.body.removeChild(downloadLink);
    });

};