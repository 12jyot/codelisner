import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const DebugAuth = () => {
  const { user, token, loading, isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Authentication Debug
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Auth State
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Loading:</span>
              <span className={`font-medium ${loading ? 'text-yellow-600' : 'text-green-600'}`}>
                {loading ? 'Yes' : 'No'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Has Token:</span>
              <span className={`font-medium ${token ? 'text-green-600' : 'text-red-600'}`}>
                {token ? 'Yes' : 'No'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Is Authenticated:</span>
              <span className={`font-medium ${isAuthenticated() ? 'text-green-600' : 'text-red-600'}`}>
                {isAuthenticated() ? 'Yes' : 'No'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Is Admin:</span>
              <span className={`font-medium ${isAdmin() ? 'text-green-600' : 'text-red-600'}`}>
                {isAdmin() ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {user && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              User Data
            </h2>
            <pre className="text-sm bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        )}

        {token && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Token (First 50 chars)
            </h2>
            <p className="text-sm font-mono bg-gray-100 dark:bg-gray-700 p-4 rounded break-all">
              {token.substring(0, 50)}...
            </p>
          </div>
        )}

        <div className="flex space-x-4">
          <Link
            to="/admin/login"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Admin Login
          </Link>
          
          {isAuthenticated() && isAdmin() && (
            <Link
              to="/admin"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Go to Admin Dashboard
            </Link>
          )}
          
          <Link
            to="/"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DebugAuth;
