import React, { useEffect, useRef, useState, useCallback } from 'react';
import './QuillEditor.css';
import toast from 'react-hot-toast';

// We need to access the global Quill object from the CDN
const getQuill = () => window.Quill;

export default function QuillEditor({ initialContent, onSave }) {
    const editorRef = useRef(null);
    const quillInstance = useRef(null);
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [lastSaved, setLastSaved] = useState('Unsaved');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showCodeModal, setShowCodeModal] = useState(false);
    const [codeOutput, setCodeOutput] = useState('');

    useEffect(() => {
        const Quill = getQuill();
        if (!Quill) {
            toast.error('Quill.js not loaded. Check internet connection.');
            return;
        }

        if (quillInstance.current) return;

        // Custom Toolbar Configuration
        const toolbarOptions = [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ['blockquote', 'code-block'],
            ['link', 'image'],
            ['clean']
        ];

        quillInstance.current = new Quill(editorRef.current, {
            theme: 'snow',
            modules: {
                toolbar: {
                    container: toolbarOptions,
                    handlers: {
                        image: imageHandler
                    }
                },
                history: {
                    delay: 1000,
                    maxStack: 50,
                    userOnly: true
                }
            },
            placeholder: 'Start writing your document here...'
        });

        // Set initial content
        if (initialContent) {
            // Check if content is HTML string or delta
            // For now assume HTML string as that is what we save
            quillInstance.current.clipboard.dangerouslyPasteHTML(initialContent);
        }

        // Stats listener
        quillInstance.current.on('text-change', () => {
            updateStats();
        });

        updateStats();
        loadSettings();

        // Autosave loop - optional, but user provided logic had it. 
        // We might just rely on props or explicit save for React.
        // Let's implement explicit save mostly, but we can do auto-update of stats.

    }, [initialContent, imageHandler]);

    const imageHandler = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = () => {
            const file = input.files[0];
            if (/^image\//.test(file.type)) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    const range = quillInstance.current.getSelection();
                    quillInstance.current.insertEmbed(range.index, 'image', reader.result);
                    quillInstance.current.setSelection(range.index + 1);
                    toast.success('Image inserted successfully');
                };
            } else {
                toast.error('Please select a valid image file');
            }
        };
    }, []);

    const updateStats = () => {
        if (!quillInstance.current) return;
        const text = quillInstance.current.getText();
        const words = text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
        const chars = text.length > 1 ? text.length - 1 : 0;
        setWordCount(words);
        setCharCount(chars);
    };

    const handleSave = async () => {
        if (!quillInstance.current) return;
        const content = quillInstance.current.root.innerHTML;

        if (onSave) {
            try {
                await onSave(content);
                const now = new Date();
                const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                setLastSaved(`Saved at ${timeString}`);
                toast.success('Document saved successfully');
            } catch (error) {
                toast.error('Failed to save document');
                console.error(error);
            }
        }
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
        if (!isFullscreen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        if (newMode) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('editor_theme_preference', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('editor_theme_preference', 'light');
        }
    };

    const loadSettings = () => {
        const theme = localStorage.getItem('editor_theme_preference');
        if (theme === 'dark') {
            setIsDarkMode(true);
            document.body.classList.add('dark-mode');
        }
    };

    const clearEditor = () => {
        if (window.confirm('Are you sure you want to clear the editor? This cannot be undone.')) {
            quillInstance.current.setContents([]);
        }
    };

    const convertToCode = () => {
        if (!quillInstance.current) return;
        const html = quillInstance.current.root.innerHTML;
        const formatted = formatHTML(html);
        setCodeOutput(formatted);
        setShowCodeModal(true);
        setTimeout(() => {
            if (window.Prism) {
                // We need to find the code element. 
                // Since react rerenders, doing this imperatively is a bit tricky but should work if node exists
                const codeEl = document.querySelector('#codeOutput code');
                if (codeEl) window.Prism.highlightElement(codeEl);
            }
        }, 100);
    };

    // Basic HTML Formatter from provided code
    const formatHTML = (html) => {
        let formatted = '';
        let indent = '';
        const tab = '    ';
        html.split(/>\s*</).forEach(function (element) {
            if (element.match(/^\/\w/)) {
                indent = indent.substring(tab.length);
            }
            formatted += indent + '<' + element + '>\r\n';
            if (element.match(/^<?\w[^>]*[^/]$/) && !element.startsWith("input") && !element.startsWith("img") && !element.startsWith("br")) {
                indent += tab;
            }
        });
        return formatted.substring(1, formatted.length - 3);
    };

    const copyCode = () => {
        navigator.clipboard.writeText(codeOutput).then(() => {
            toast.success('HTML code copied to clipboard');
        });
    };

    const downloadHtml = () => {
        const blob = new Blob([codeOutput], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="quill-editor-wrapper">
            {/* Header */}
            <header className="editor-header">
                <div className="logo">
                    <i className="fas fa-pen-nib"></i>
                    Professional Editor
                </div>
                <div className="header-controls">
                    <button className="btn btn-primary" onClick={convertToCode}>
                        <i className="fas fa-code"></i> Convert Text to Code
                    </button>
                    <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 5px' }}></div>
                    <button className="btn btn-icon" onClick={toggleTheme} title="Toggle Dark Mode">
                        <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
                    </button>
                    <button className="btn btn-icon" onClick={toggleFullscreen} title="Fullscreen">
                        <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
                    </button>
                    <button className="btn btn-icon" onClick={clearEditor} title="Clear All">
                        <i className="fas fa-trash-alt"></i>
                    </button>
                    <button className="btn" onClick={handleSave} title="Save Content">
                        <i className="fas fa-save"></i> Save
                    </button>
                </div>
            </header>

            {/* Main Editor */}
            <div className={`editor-container ${isFullscreen ? 'fullscreen' : ''}`}>
                <div ref={editorRef} style={{ height: 'calc(100% - 42px)' }}></div>
            </div>

            {/* Status Bar */}
            <div className="stats-bar">
                <div className="stats-group">
                    <span>{wordCount} words</span>
                    <span>{charCount} characters</span>
                </div>
                <div className="stats-group">
                    <span>{lastSaved}</span>
                </div>
            </div>

            {/* View Code Modal */}
            <div className={`custom-modal ${showCodeModal ? 'active' : ''}`} id="codeModal" style={{ display: showCodeModal ? 'flex' : 'none' }}>
                <div className="custom-modal-content">
                    <div className="custom-modal-header">
                        <h3><i className="fas fa-file-code"></i> Generated HTML Code</h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="btn" onClick={copyCode}>
                                <i className="fas fa-copy"></i> Copy HTML
                            </button>
                            <button className="btn" onClick={downloadHtml}>
                                <i className="fas fa-download"></i> Download .html
                            </button>
                            <button className="btn btn-icon" onClick={() => setShowCodeModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div className="custom-modal-body">
                        <pre className="code-output" id="codeOutput" style={{ margin: 0, padding: '20px' }}>
                            <code className="language-html">{codeOutput}</code>
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Add CSS for toast if not already handled globally (Main App usually handles Toaster, but user provided custom toast css.
// We will rely on react-hot-toast for toasts as it is already installed in package.json, but use the custom css for layout if needed.
// Actually, I replaced custom toast with react-hot-toast in logic, so I can ignore the custom toast div.)
