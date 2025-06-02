import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const TestLogin = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const testLogin = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('Testing login...');
      const result = await login('admin@codenotes.com', 'admin123');
      console.log('Test result:', result);
      setResult(result);
    } catch (error) {
      console.error('Test error:', error);
      setResult({ success: false, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Login Test Page
        </h1>
        
        <button
          onClick={testLogin}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Admin Login'}
        </button>
        
        {result && (
          <div className="mt-6 p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Result:</h3>
            <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestLogin;
