import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';

const ColorPicker = ({ 
  label, 
  value, 
  onChange, 
  presetColors = [],
  showPresets = true 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value || '#000000');
  const pickerRef = useRef(null);

  // Default preset colors
  const defaultPresets = [
    '#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd',
    '#7c3aed', '#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe',
    '#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca',
    '#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa',
    '#ca8a04', '#eab308', '#facc15', '#fde047', '#fef08a',
    '#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0',
    '#0891b2', '#06b6d4', '#22d3ee', '#67e8f9', '#a5f3fc',
    '#1f2937', '#374151', '#4b5563', '#6b7280', '#9ca3af',
  ];

  const colors = presetColors.length > 0 ? presetColors : defaultPresets;

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleColorSelect = (color) => {
    setCustomColor(color);
    onChange(color);
    setIsOpen(false);
  };

  const handleCustomColorChange = (e) => {
    const color = e.target.value;
    setCustomColor(color);
    onChange(color);
  };

  return (
    <div className="relative" ref={pickerRef}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      
      {/* Color Display Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
      >
        <div 
          className="w-8 h-8 rounded-lg border-2 border-gray-300 dark:border-gray-500 shadow-sm"
          style={{ backgroundColor: value || customColor }}
        />
        <span className="flex-1 text-left text-gray-900 dark:text-white font-mono text-sm">
          {value || customColor}
        </span>
        <Palette className="h-5 w-5 text-gray-400" />
      </button>

      {/* Color Picker Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 p-4">
          {/* Custom Color Input */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              Custom Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={customColor}
                onChange={handleCustomColorChange}
                className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => handleCustomColorChange(e)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Preset Colors */}
          {showPresets && (
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Preset Colors
              </label>
              <div className="grid grid-cols-10 gap-2">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleColorSelect(color)}
                    className="relative w-8 h-8 rounded-lg border-2 border-gray-300 dark:border-gray-500 hover:border-gray-400 dark:hover:border-gray-400 transition-colors group"
                    style={{ backgroundColor: color }}
                    title={color}
                  >
                    {(value === color || customColor === color) && (
                      <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-lg" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent Colors */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Current Selection
              </span>
              <button
                type="button"
                onClick={() => handleColorSelect(customColor)}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
