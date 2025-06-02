import React, { useState } from 'react';
import { useStyle } from '../../contexts/StyleContext';
import { useTheme } from '../../contexts/ThemeContext';
import ColorPicker from '../../components/admin/ColorPicker';
import StylePreview from '../../components/admin/StylePreview';
import { 
  Palette, 
  RotateCcw, 
  Save, 
  Eye, 
  Settings,
  Type,
  Code,
  Quote,
  List,
  Sun,
  Moon
} from 'lucide-react';

const TutorialStyleSettings = () => {
  const { styles, updateStyles, resetStyles, defaultStyles } = useStyle();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('headings');
  const [showPreview, setShowPreview] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  const tabs = [
    { id: 'headings', label: 'Headings', icon: Type },
    { id: 'text', label: 'Text & Paragraphs', icon: Type },
    { id: 'code', label: 'Code Blocks', icon: Code },
    { id: 'quotes', label: 'Quotes & Lists', icon: Quote },
  ];

  const handleStyleChange = (section, property, value) => {
    const newStyles = {
      ...styles,
      tutorial: {
        ...styles.tutorial,
        [section]: {
          ...styles.tutorial[section],
          [property]: value
        }
      }
    };
    updateStyles(newStyles);
    setHasChanges(true);
  };

  const handleDarkModeStyleChange = (section, property, value) => {
    const newStyles = {
      ...styles,
      dark: {
        ...styles.dark,
        [section]: {
          ...styles.dark[section],
          [property]: value
        }
      }
    };
    updateStyles(newStyles);
    setHasChanges(true);
  };

  const handleReset = () => {
    updateStyles(defaultStyles);
    setHasChanges(false);
  };

  const handleSave = () => {
    // In a real app, you would save to backend here
    setHasChanges(false);
    alert('Styles saved successfully!');
  };

  const renderHeadingsTab = () => (
    <div className="space-y-8">
      {/* H1 Settings */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Type className="h-5 w-5 mr-2" />
          Main Heading (H1)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ColorPicker
            label="Gradient Start Color"
            value={styles.tutorial.h1.gradientFrom}
            onChange={(value) => handleStyleChange('h1', 'gradientFrom', value)}
          />
          <ColorPicker
            label="Gradient End Color"
            value={styles.tutorial.h1.gradientTo}
            onChange={(value) => handleStyleChange('h1', 'gradientTo', value)}
          />
        </div>
        
        {theme === 'dark' && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <Moon className="h-4 w-4 mr-2" />
              Dark Mode Colors
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorPicker
                label="Dark Gradient Start"
                value={styles.dark.h1.gradientFrom}
                onChange={(value) => handleDarkModeStyleChange('h1', 'gradientFrom', value)}
              />
              <ColorPicker
                label="Dark Gradient End"
                value={styles.dark.h1.gradientTo}
                onChange={(value) => handleDarkModeStyleChange('h1', 'gradientTo', value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* H2 Settings */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Section Heading (H2)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ColorPicker
            label="Gradient Start Color"
            value={styles.tutorial.h2.gradientFrom}
            onChange={(value) => handleStyleChange('h2', 'gradientFrom', value)}
          />
          <ColorPicker
            label="Gradient End Color"
            value={styles.tutorial.h2.gradientTo}
            onChange={(value) => handleStyleChange('h2', 'gradientTo', value)}
          />
        </div>
        
        {theme === 'dark' && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <Moon className="h-4 w-4 mr-2" />
              Dark Mode Colors
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorPicker
                label="Dark Gradient Start"
                value={styles.dark.h2.gradientFrom}
                onChange={(value) => handleDarkModeStyleChange('h2', 'gradientFrom', value)}
              />
              <ColorPicker
                label="Dark Gradient End"
                value={styles.dark.h2.gradientTo}
                onChange={(value) => handleDarkModeStyleChange('h2', 'gradientTo', value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* H3 Settings */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Sub-heading (H3)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ColorPicker
            label="Gradient Start Color"
            value={styles.tutorial.h3.gradientFrom}
            onChange={(value) => handleStyleChange('h3', 'gradientFrom', value)}
          />
          <ColorPicker
            label="Gradient End Color"
            value={styles.tutorial.h3.gradientTo}
            onChange={(value) => handleStyleChange('h3', 'gradientTo', value)}
          />
        </div>
        
        {theme === 'dark' && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <Moon className="h-4 w-4 mr-2" />
              Dark Mode Colors
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorPicker
                label="Dark Gradient Start"
                value={styles.dark.h3.gradientFrom}
                onChange={(value) => handleDarkModeStyleChange('h3', 'gradientFrom', value)}
              />
              <ColorPicker
                label="Dark Gradient End"
                value={styles.dark.h3.gradientTo}
                onChange={(value) => handleDarkModeStyleChange('h3', 'gradientTo', value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderTextTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Paragraph Text
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ColorPicker
            label="Text Color"
            value={styles.tutorial.paragraph.color}
            onChange={(value) => handleStyleChange('paragraph', 'color', value)}
          />
          {theme === 'dark' && (
            <ColorPicker
              label="Dark Mode Text Color"
              value={styles.dark.paragraph.color}
              onChange={(value) => handleDarkModeStyleChange('paragraph', 'color', value)}
            />
          )}
        </div>
      </div>
    </div>
  );

  const renderCodeTab = () => (
    <div className="space-y-6">
      {/* Inline Code */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Inline Code
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ColorPicker
            label="Background Color"
            value={styles.tutorial.code.backgroundColor}
            onChange={(value) => handleStyleChange('code', 'backgroundColor', value)}
          />
          <ColorPicker
            label="Text Color"
            value={styles.tutorial.code.color}
            onChange={(value) => handleStyleChange('code', 'color', value)}
          />
          <ColorPicker
            label="Border Color"
            value={styles.tutorial.code.borderColor}
            onChange={(value) => handleStyleChange('code', 'borderColor', value)}
          />
        </div>
        
        {theme === 'dark' && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Dark Mode Colors
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ColorPicker
                label="Dark Background"
                value={styles.dark.code.backgroundColor}
                onChange={(value) => handleDarkModeStyleChange('code', 'backgroundColor', value)}
              />
              <ColorPicker
                label="Dark Text Color"
                value={styles.dark.code.color}
                onChange={(value) => handleDarkModeStyleChange('code', 'color', value)}
              />
              <ColorPicker
                label="Dark Border Color"
                value={styles.dark.code.borderColor}
                onChange={(value) => handleDarkModeStyleChange('code', 'borderColor', value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Code Blocks */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Code Blocks
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ColorPicker
            label="Background Color"
            value={styles.tutorial.codeBlock.backgroundColor}
            onChange={(value) => handleStyleChange('codeBlock', 'backgroundColor', value)}
          />
          <ColorPicker
            label="Text Color"
            value={styles.tutorial.codeBlock.color}
            onChange={(value) => handleStyleChange('codeBlock', 'color', value)}
          />
          <ColorPicker
            label="Border Color"
            value={styles.tutorial.codeBlock.borderColor}
            onChange={(value) => handleStyleChange('codeBlock', 'borderColor', value)}
          />
        </div>
      </div>
    </div>
  );

  const renderQuotesTab = () => (
    <div className="space-y-6">
      {/* Blockquotes */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Blockquotes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ColorPicker
            label="Background Color"
            value={styles.tutorial.blockquote.backgroundColor}
            onChange={(value) => handleStyleChange('blockquote', 'backgroundColor', value)}
          />
          <ColorPicker
            label="Text Color"
            value={styles.tutorial.blockquote.color}
            onChange={(value) => handleStyleChange('blockquote', 'color', value)}
          />
          <ColorPicker
            label="Border Color"
            value={styles.tutorial.blockquote.borderColor}
            onChange={(value) => handleStyleChange('blockquote', 'borderColor', value)}
          />
        </div>
        
        {theme === 'dark' && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Dark Mode Colors
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorPicker
                label="Dark Background"
                value={styles.dark.blockquote.backgroundColor}
                onChange={(value) => handleDarkModeStyleChange('blockquote', 'backgroundColor', value)}
              />
              <ColorPicker
                label="Dark Text Color"
                value={styles.dark.blockquote.color}
                onChange={(value) => handleDarkModeStyleChange('blockquote', 'color', value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Lists */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Lists
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ColorPicker
            label="Text Color"
            value={styles.tutorial.list.color}
            onChange={(value) => handleStyleChange('list', 'color', value)}
          />
          <ColorPicker
            label="Marker Color"
            value={styles.tutorial.list.markerColor}
            onChange={(value) => handleStyleChange('list', 'markerColor', value)}
          />
        </div>
        
        {theme === 'dark' && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Dark Mode Colors
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorPicker
                label="Dark Text Color"
                value={styles.dark.list.color}
                onChange={(value) => handleDarkModeStyleChange('list', 'color', value)}
              />
              <ColorPicker
                label="Dark Marker Color"
                value={styles.dark.list.markerColor}
                onChange={(value) => handleDarkModeStyleChange('list', 'markerColor', value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Palette className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400" />
            Tutorial Style Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Customize the appearance of tutorial content
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Toggle theme to preview dark mode styles"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? 'Hide' : 'Show'} Preview
          </button>
          
          <button
            onClick={handleReset}
            className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </button>
          
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'headings' && renderHeadingsTab()}
            {activeTab === 'text' && renderTextTab()}
            {activeTab === 'code' && renderCodeTab()}
            {activeTab === 'quotes' && renderQuotesTab()}
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Live Preview
              </h3>
              <StylePreview styles={styles} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorialStyleSettings;
