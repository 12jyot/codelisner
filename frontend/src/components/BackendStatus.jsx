import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { tutorialService } from '../services/tutorialService';

const BackendStatus = ({ onBackendReady }) => {
  const [status, setStatus] = useState('checking'); // checking, starting, ready, error
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 10;

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    setStatus('checking');
    
    for (let i = 0; i < maxAttempts; i++) {
      setAttempts(i + 1);
      
      const isReady = await tutorialService.wakeUpBackend();
      
      if (isReady) {
        setStatus('ready');
        if (onBackendReady) {
          setTimeout(onBackendReady, 1000); // Give a moment for the success message
        }
        return;
      }
      
      setStatus('starting');
      
      // Wait before next attempt (exponential backoff)
      const delay = Math.min(2000 + (i * 1000), 5000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    setStatus('error');
  };

  const handleRetry = () => {
    setAttempts(0);
    checkBackendStatus();
  };

  if (status === 'ready') {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Backend Ready!
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Loading your tutorials...
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Backend Unavailable
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The backend service is currently unavailable. You can view sample tutorials or try again.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={onBackendReady}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              View Samples
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          {status === 'checking' ? (
            <RefreshCw className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
          ) : (
            <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {status === 'checking' ? 'Checking Backend...' : 'Starting Backend...'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {status === 'checking' 
            ? 'Connecting to the server...'
            : 'The backend is waking up from sleep. This may take a moment.'
          }
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <span>Attempt {attempts} of {maxAttempts}</span>
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === (attempts % 3) ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackendStatus;
