import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const StylePreview = ({ styles }) => {
  const { theme } = useTheme();

  const sampleContent = {
    title: "Sample Tutorial: JavaScript Basics",
    subtitle: "Understanding Variables and Functions",
    subheading: "Working with Arrays",
    paragraph: "JavaScript is a versatile programming language that runs in web browsers and on servers. It's essential for modern web development and offers powerful features for creating interactive websites.",
    code: "const greeting = 'Hello, World!';",
    codeBlock: `function calculateSum(a, b) {
  return a + b;
}

const result = calculateSum(5, 3);
console.log(result); // Output: 8`,
    quote: "The best way to learn programming is by writing code and solving problems.",
    listItems: [
      "Variables store data values",
      "Functions perform specific tasks",
      "Arrays hold multiple values",
      "Objects group related data"
    ]
  };

  const getStyleForElement = (element) => {
    const currentTheme = theme === 'dark' ? 'dark' : 'tutorial';
    const baseStyles = styles.tutorial[element] || {};
    const themeStyles = styles[currentTheme]?.[element] || {};
    
    return { ...baseStyles, ...themeStyles };
  };

  const createGradientStyle = (gradientFrom, gradientTo) => ({
    background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent'
  });

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 max-h-96 overflow-y-auto">
      <div className="tutorial-content">
        {/* H1 Preview */}
        <h1 
          style={{
            ...getStyleForElement('h1'),
            ...createGradientStyle(
              getStyleForElement('h1').gradientFrom,
              getStyleForElement('h1').gradientTo
            )
          }}
        >
          {sampleContent.title}
        </h1>

        {/* H2 Preview */}
        <h2 
          style={{
            ...getStyleForElement('h2'),
            ...createGradientStyle(
              getStyleForElement('h2').gradientFrom,
              getStyleForElement('h2').gradientTo
            )
          }}
        >
          {sampleContent.subtitle}
        </h2>

        {/* Paragraph Preview */}
        <p style={getStyleForElement('paragraph')}>
          {sampleContent.paragraph}
        </p>

        {/* H3 Preview */}
        <h3 
          style={{
            ...getStyleForElement('h3'),
            ...createGradientStyle(
              getStyleForElement('h3').gradientFrom,
              getStyleForElement('h3').gradientTo
            )
          }}
        >
          {sampleContent.subheading}
        </h3>

        {/* List Preview */}
        <ul style={{ 
          marginBottom: getStyleForElement('list').marginBottom,
          paddingLeft: getStyleForElement('list').paddingLeft 
        }}>
          {sampleContent.listItems.map((item, index) => (
            <li 
              key={index}
              style={{
                color: getStyleForElement('list').color,
                marginBottom: '0.5rem'
              }}
            >
              {item}
            </li>
          ))}
        </ul>

        {/* Inline Code Preview */}
        <p style={getStyleForElement('paragraph')}>
          Here's an example of inline code: {' '}
          <code style={getStyleForElement('code')}>
            {sampleContent.code}
          </code>
        </p>

        {/* Code Block Preview */}
        <pre style={getStyleForElement('codeBlock')}>
          <code>{sampleContent.codeBlock}</code>
        </pre>

        {/* Blockquote Preview */}
        <blockquote style={getStyleForElement('blockquote')}>
          {sampleContent.quote}
        </blockquote>
      </div>
    </div>
  );
};

export default StylePreview;
