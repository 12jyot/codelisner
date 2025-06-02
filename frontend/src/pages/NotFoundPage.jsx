import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-2xl w-full text-center">
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-12">
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              404
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                Page Not Found
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Oops! The page you're looking for seems to have wandered off into the digital void.
              Don't worry, even the best developers encounter 404s!
            </p>
          </div>

          <div className="space-y-4">
            <Link
              to="/"
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 w-full justify-center"
            >
              <Home className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Return Home
            </Link>

            <Link
              to="/tutorials"
              className="group inline-flex items-center px-8 py-4 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 font-semibold rounded-2xl hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-600/50 transform hover:scale-105 w-full justify-center"
            >
              <Search className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Explore Tutorials
            </Link>

            <button
              onClick={() => window.history.back()}
              className="group inline-flex items-center px-8 py-4 text-gray-600 dark:text-gray-400 font-semibold hover:text-gray-900 dark:hover:text-white transition-all duration-300 w-full justify-center hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-2xl"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </button>
          </div>

          {/* Fun Element */}
          <div className="mt-8 text-6xl animate-bounce">
            🤖
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Our robot is looking for your page...
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
