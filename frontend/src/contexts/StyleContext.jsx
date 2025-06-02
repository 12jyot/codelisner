import React, { createContext, useContext, useState, useEffect } from 'react';

const StyleContext = createContext();

export const useStyle = () => {
  const context = useContext(StyleContext);
  if (!context) {
    throw new Error('useStyle must be used within a StyleProvider');
  }
  return context;
};

// Default style configuration
const defaultStyles = {
  tutorial: {
    h1: {
      color: '#1e40af',
      gradientFrom: '#1e40af',
      gradientTo: '#7c3aed',
      fontSize: '1.875rem',
      fontWeight: '700',
      marginBottom: '1.5rem',
    },
    h2: {
      color: '#2563eb',
      gradientFrom: '#2563eb',
      gradientTo: '#8b5cf6',
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '1rem',
    },
    h3: {
      color: '#3b82f6',
      gradientFrom: '#3b82f6',
      gradientTo: '#a855f7',
      fontSize: '1.25rem',
      fontWeight: '500',
      marginBottom: '0.75rem',
    },
    paragraph: {
      color: '#1f2937',
      fontSize: '1rem',
      lineHeight: '1.625',
      fontWeight: '400',
      marginBottom: '1rem',
    },
    code: {
      backgroundColor: '#dbeafe',
      color: '#1e40af',
      borderColor: '#bfdbfe',
      fontSize: '0.875rem',
      fontWeight: '600',
      padding: '0.375rem 0.75rem',
      borderRadius: '0.5rem',
    },
    codeBlock: {
      backgroundColor: '#0f172a',
      color: '#f1f5f9',
      borderColor: '#334155',
      padding: '1.5rem',
      borderRadius: '1rem',
      marginBottom: '1.5rem',
    },
    blockquote: {
      backgroundColor: '#eff6ff',
      borderColor: '#3b82f6',
      color: '#1f2937',
      padding: '1rem 1.5rem',
      margin: '1.5rem 0',
      borderRadius: '0.5rem',
    },
    list: {
      color: '#374151',
      markerColor: '#3b82f6',
      marginBottom: '1rem',
      paddingLeft: '1.5rem',
    }
  },
  dark: {
    h1: {
      gradientFrom: '#60a5fa',
      gradientTo: '#a78bfa',
    },
    h2: {
      gradientFrom: '#3b82f6',
      gradientTo: '#8b5cf6',
    },
    h3: {
      gradientFrom: '#60a5fa',
      gradientTo: '#a855f7',
    },
    paragraph: {
      color: '#e5e7eb',
    },
    code: {
      backgroundColor: '#1e3a8a',
      color: '#93c5fd',
      borderColor: '#3730a3',
    },
    blockquote: {
      backgroundColor: '#1e3a8a',
      color: '#dbeafe',
    },
    list: {
      color: '#d1d5db',
      markerColor: '#60a5fa',
    }
  }
};

// Function to apply styles to DOM
const applyStylesToDOM = (styles) => {
  if (typeof window === 'undefined') return;

  // Remove existing custom style element
  const existingStyle = document.getElementById('custom-tutorial-styles');
  if (existingStyle) {
    existingStyle.remove();
  }

  // Create new style element
  const styleElement = document.createElement('style');
  styleElement.id = 'custom-tutorial-styles';
  
  // Generate CSS from styles object
  const css = generateCSS(styles);
  styleElement.textContent = css;
  
  // Append to head
  document.head.appendChild(styleElement);
};

// Function to generate CSS from styles object
const generateCSS = (styles) => {
  const { tutorial, dark } = styles;
  
  return `
    /* Custom Tutorial Styles */
    .tutorial-content h1 {
      font-size: ${tutorial.h1.fontSize} !important;
      font-weight: ${tutorial.h1.fontWeight} !important;
      margin-bottom: ${tutorial.h1.marginBottom} !important;
      background: linear-gradient(135deg, ${tutorial.h1.gradientFrom}, ${tutorial.h1.gradientTo}) !important;
      background-clip: text !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
    }

    .tutorial-content h2 {
      font-size: ${tutorial.h2.fontSize} !important;
      font-weight: ${tutorial.h2.fontWeight} !important;
      margin-bottom: ${tutorial.h2.marginBottom} !important;
      background: linear-gradient(135deg, ${tutorial.h2.gradientFrom}, ${tutorial.h2.gradientTo}) !important;
      background-clip: text !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
    }

    .tutorial-content h3 {
      font-size: ${tutorial.h3.fontSize} !important;
      font-weight: ${tutorial.h3.fontWeight} !important;
      margin-bottom: ${tutorial.h3.marginBottom} !important;
      background: linear-gradient(135deg, ${tutorial.h3.gradientFrom}, ${tutorial.h3.gradientTo}) !important;
      background-clip: text !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
    }

    .tutorial-content p {
      color: ${tutorial.paragraph.color} !important;
      font-size: ${tutorial.paragraph.fontSize} !important;
      line-height: ${tutorial.paragraph.lineHeight} !important;
      font-weight: ${tutorial.paragraph.fontWeight} !important;
      margin-bottom: ${tutorial.paragraph.marginBottom} !important;
    }

    .tutorial-content code {
      background: ${tutorial.code.backgroundColor} !important;
      color: ${tutorial.code.color} !important;
      border: 1px solid ${tutorial.code.borderColor} !important;
      font-size: ${tutorial.code.fontSize} !important;
      font-weight: ${tutorial.code.fontWeight} !important;
      padding: ${tutorial.code.padding} !important;
      border-radius: ${tutorial.code.borderRadius} !important;
    }

    .tutorial-content pre {
      background: ${tutorial.codeBlock.backgroundColor} !important;
      color: ${tutorial.codeBlock.color} !important;
      border: 1px solid ${tutorial.codeBlock.borderColor} !important;
      padding: ${tutorial.codeBlock.padding} !important;
      border-radius: ${tutorial.codeBlock.borderRadius} !important;
      margin-bottom: ${tutorial.codeBlock.marginBottom} !important;
    }

    .tutorial-content blockquote {
      background: ${tutorial.blockquote.backgroundColor} !important;
      border-left: 4px solid ${tutorial.blockquote.borderColor} !important;
      color: ${tutorial.blockquote.color} !important;
      padding: ${tutorial.blockquote.padding} !important;
      margin: ${tutorial.blockquote.margin} !important;
      border-radius: ${tutorial.blockquote.borderRadius} !important;
    }

    .tutorial-content li {
      color: ${tutorial.list.color} !important;
      margin-bottom: 0.5rem !important;
      padding-left: ${tutorial.list.paddingLeft} !important;
    }

    .tutorial-content li::marker {
      color: ${tutorial.list.markerColor} !important;
    }

    /* Dark mode styles */
    .dark .tutorial-content h1 {
      background: linear-gradient(135deg, ${dark.h1.gradientFrom}, ${dark.h1.gradientTo}) !important;
      background-clip: text !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
    }

    .dark .tutorial-content h2 {
      background: linear-gradient(135deg, ${dark.h2.gradientFrom}, ${dark.h2.gradientTo}) !important;
      background-clip: text !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
    }

    .dark .tutorial-content h3 {
      background: linear-gradient(135deg, ${dark.h3.gradientFrom}, ${dark.h3.gradientTo}) !important;
      background-clip: text !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
    }

    .dark .tutorial-content p {
      color: ${dark.paragraph.color} !important;
    }

    .dark .tutorial-content code {
      background: ${dark.code.backgroundColor} !important;
      color: ${dark.code.color} !important;
      border: 1px solid ${dark.code.borderColor} !important;
    }

    .dark .tutorial-content blockquote {
      background: ${dark.blockquote.backgroundColor} !important;
      color: ${dark.blockquote.color} !important;
    }

    .dark .tutorial-content li {
      color: ${dark.list.color} !important;
    }

    .dark .tutorial-content li::marker {
      color: ${dark.list.markerColor} !important;
    }
  `;
};

export const StyleProvider = ({ children }) => {
  const [styles, setStyles] = useState(() => {
    // Load from localStorage or use defaults
    if (typeof window !== 'undefined') {
      const savedStyles = localStorage.getItem('tutorial-styles');
      if (savedStyles) {
        try {
          return JSON.parse(savedStyles);
        } catch (error) {
          console.error('Error parsing saved styles:', error);
        }
      }
    }
    return defaultStyles;
  });

  // Apply styles whenever they change
  useEffect(() => {
    applyStylesToDOM(styles);
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('tutorial-styles', JSON.stringify(styles));
    }
  }, [styles]);

  const updateStyles = (newStyles) => {
    setStyles(newStyles);
  };

  const resetStyles = () => {
    setStyles(defaultStyles);
  };

  const value = {
    styles,
    updateStyles,
    resetStyles,
    defaultStyles
  };

  return (
    <StyleContext.Provider value={value}>
      {children}
    </StyleContext.Provider>
  );
};
