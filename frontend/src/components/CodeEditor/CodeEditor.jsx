import React, { useState, useRef } from 'react';
import { Play, Copy, Download, RotateCcw, Loader2 } from 'lucide-react';
import axios from 'axios';

const CodeEditor = ({
  initialCode = '',
  language = 'javascript',
  readOnly = false,
  height = '400px'
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef(null);

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'c', label: 'C' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' }
  ];

  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const runCode = async () => {
    if (!code.trim()) {
      setError('Please enter some code to run');
      return;
    }

    setIsRunning(true);
    setError('');
    setOutput('');

    try {
      const response = await axios.post('http://localhost:5000/api/compiler/execute', {
        code: code,
        language: selectedLanguage,
        input: ''
      });

      if (response.data.success) {
        const result = response.data.output;

        if (selectedLanguage === 'html') {
          // For HTML, show the rendered output
          setOutput(result.html_output || result.stdout);
        } else if (selectedLanguage === 'css') {
          // For CSS, show validation message
          setOutput(result.stdout || 'CSS code is valid');
        } else {
          // For other languages, show stdout or stderr
          setOutput(result.stdout || result.stderr || 'No output');
        }

        if (result.stderr) {
          setError(result.stderr);
        }
      } else {
        setError(response.data.message || 'Code execution failed');
      }
    } catch (error) {
      console.error('Code execution error:', error);
      setError(error.response?.data?.message || 'Failed to execute code');
    } finally {
      setIsRunning(false);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const downloadCode = () => {
    const extensions = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      html: 'html',
      css: 'css',
      php: 'php',
      ruby: 'rb',
      go: 'go',
      rust: 'rs'
    };

    const extension = extensions[selectedLanguage] || 'txt';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput('');
    setError('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);

      // Set cursor position after the inserted spaces
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="code-editor-container border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center space-x-3">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            disabled={readOnly}
            className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold shadow-sm hover:shadow-md transition-all duration-200"
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={copyCode}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Copy code"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={downloadCode}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Download code"
          >
            <Download className="h-4 w-4" />
          </button>
          {!readOnly && (
            <button
              onClick={resetCode}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              title="Reset code"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={runCode}
            disabled={isRunning || readOnly}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {isRunning ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          className="w-full p-4 font-mono text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none focus:outline-none"
          style={{ height }}
          placeholder="Enter your code here..."
          spellCheck={false}
        />
      </div>

      {/* Output Section */}
      {(output || error) && (
        <div className="border-t border-gray-200 dark:border-gray-600">
          <div className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-gray-800 dark:to-gray-700">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Output:
            </h4>
            {error && (
              <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-3 shadow-sm">
                <div className="flex items-center mb-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  <span className="text-sm font-semibold text-red-700 dark:text-red-400">Error:</span>
                </div>
                <pre className="text-sm font-mono text-red-600 dark:text-red-400 whitespace-pre-wrap">
                  {error}
                </pre>
              </div>
            )}
            {output && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-lg shadow-sm">
                {selectedLanguage === 'html' ? (
                  <div
                    className="text-sm"
                    dangerouslySetInnerHTML={{ __html: output }}
                  />
                ) : (
                  <pre className="text-sm font-mono text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
                    {output}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
