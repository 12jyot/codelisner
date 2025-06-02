import React, { useState, useEffect } from 'react';
import { X, MessageCircle, BarChart3, HelpCircle } from 'lucide-react';
import ChartBoard from '../ChartBoard/ChartBoard';

const FloatingBoatAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Add component mount effect for debugging
  useEffect(() => {
    console.log('FloatingBoatAI component mounted');
    setIsLoaded(true);
    return () => {
      console.log('FloatingBoatAI component unmounted');
    };
  }, []);

  // Add state change logging
  useEffect(() => {
    console.log('FloatingBoatAI state changed:', { isOpen, isAnimating, isLoaded });
  }, [isOpen, isAnimating, isLoaded]);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🚢 BOAT CLICKED! Current state:', isOpen); // Debug log

    if (isOpen) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsAnimating(false);
      }, 300);
    } else {
      setIsOpen(true);
      setIsAnimating(false);
    }
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        handleToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Floating Boat Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 floating-boat-container" style={{ zIndex: 9999 }}>
        <button
          onClick={handleToggle}
          onMouseDown={(e) => console.log('Button mouse down')}
          onMouseUp={(e) => console.log('Button mouse up')}
          className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer touch-target group"
          title="Ask Chart Board AI"
          aria-label="Open Chart Board AI"
          style={{
            zIndex: 10000,
            position: 'relative',
            pointerEvents: 'auto'
          }}
        >
          {/* Boat Emoji */}
          <span className="text-xl sm:text-2xl">
            {isOpen ? '✕' : '🚢'}
          </span>
        </button>

        {/* Tooltip */}
        {!isOpen && isLoaded && (
          <div className="absolute bottom-full right-0 mb-2 px-2 sm:px-3 py-1 sm:py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs sm:text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            🚢 Ask Chart Board AI
            <div className="absolute top-full right-3 sm:right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
          </div>
        )}

        {/* Floating Animation Rings */}
        {!isOpen && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-blue-400 opacity-20 animate-ping"></div>
            <div className="absolute inset-0 rounded-full border border-blue-300 opacity-30 animate-pulse"></div>
          </>
        )}
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className={`modal-overlay fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isAnimating ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={handleToggle}
          role="dialog"
          aria-modal="true"
          aria-labelledby="chart-board-title"
        >
          {/* Modal Content */}
          <div
            className={`responsive-modal modal-content fixed inset-2 sm:inset-4 md:inset-8 lg:inset-16 bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 transform ${
              isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header - Compact */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg">🚢</span>
                <h2 id="chart-board-title" className="text-sm sm:text-lg font-semibold text-white">AI Analytics Assistant</h2>
              </div>

              <button
                onClick={handleToggle}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors duration-200 touch-target"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </button>
            </div>

            {/* Modal Body - Charts Only */}
            <div className="h-full overflow-y-auto p-2 sm:p-4">
              {/* Chart Board Component - Charts Only */}
              <div className="chart-board-container">
                <ChartBoard />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingBoatAI;
