import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Clock, Eye, Star, BookOpen, AlertCircle } from 'lucide-react';
import { tutorialService } from '../services/tutorialService';
import BackendStatus from '../components/BackendStatus';

const TutorialsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tutorials, setTutorials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [showBackendStatus, setShowBackendStatus] = useState(false);
  const [backendMessage, setBackendMessage] = useState('');

  const currentCategory = searchParams.get('category') || 'all';
  const currentSearch = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const currentSort = searchParams.get('sort') || 'newest';

  useEffect(() => {
    fetchTutorials();
  }, [currentCategory, currentSearch, currentPage, currentSort]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchTutorials = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        sort: currentSort
      };

      if (currentCategory !== 'all') {
        params.category = currentCategory;
      }
      if (currentSearch) {
        params.search = currentSearch;
      }

      const data = await tutorialService.getAllTutorials(params);
      setTutorials(data.tutorials || []);
      setPagination(data.pagination || {});

      // Check if we're using fallback data
      if (data.message && data.message.includes('Backend is starting')) {
        setBackendMessage(data.message);
        setShowBackendStatus(true);
      }
    } catch (error) {
      console.error('Failed to fetch tutorials:', error);

      // Check if it's a network error (backend unavailable)
      if (error.code === 'ECONNABORTED' || error.code === 'NETWORK_ERROR' || !error.response) {
        setShowBackendStatus(true);
      } else {
        setTutorials([]);
        setPagination({});
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await tutorialService.getCategories();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
    }
  };

  const updateSearchParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    // Reset to page 1 when changing filters
    if (updates.category || updates.search || updates.sort) {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const search = formData.get('search');
    updateSearchParams({ search });
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'title', label: 'Alphabetical' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 py-8">
      {/* Backend Status Modal */}
      {showBackendStatus && (
        <BackendStatus
          onBackendReady={() => {
            setShowBackendStatus(false);
            fetchTutorials();
          }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Backend Status Banner */}
        {backendMessage && (
          <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3" />
              <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                {backendMessage}
              </p>
            </div>
          </div>
        )}

        {/* Enhanced Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full text-sm font-medium text-blue-800 dark:text-blue-300 mb-6 border border-blue-200/50 dark:border-blue-700/50">
            <BookOpen className="h-4 w-4 mr-2" />
            Explore Our Library
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
              Programming Tutorials
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Master programming with our comprehensive collection of interactive tutorials,
            hands-on examples, and expert-crafted content designed for all skill levels.
          </p>
        </div>

        {/* Enhanced Filters and Search */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50 p-8 mb-12">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  placeholder="Search tutorials, topics, or technologies..."
                  defaultValue={currentSearch}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200/50 dark:border-gray-600/50 rounded-2xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </form>

            {/* Category Filter */}
            <select
              value={currentCategory}
              onChange={(e) => updateSearchParams({ category: e.target.value === 'all' ? '' : e.target.value })}
              className="px-6 py-4 border border-gray-200/50 dark:border-gray-600/50 rounded-2xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg font-medium min-w-[200px]"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={currentSort}
              onChange={(e) => updateSearchParams({ sort: e.target.value })}
              className="px-6 py-4 border border-gray-200/50 dark:border-gray-600/50 rounded-2xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg font-medium min-w-[180px]"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : tutorials.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {tutorials.map((tutorial) => (
                <Link
                  key={tutorial._id}
                  to={`/tutorial/${tutorial.slug}`}
                  className="group relative overflow-hidden bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative p-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-800 dark:text-blue-300 text-sm font-semibold rounded-full border border-blue-200/50 dark:border-blue-700/50">
                        {tutorial.category}
                      </span>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${
                          tutorial.difficulty === 'Beginner' ? 'bg-green-500' :
                          tutorial.difficulty === 'Intermediate' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {tutorial.difficulty}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                      {tutorial.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-2 leading-relaxed">
                      {tutorial.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="font-medium">{tutorial.estimatedReadTime} min</span>
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <Eye className="h-4 w-4 mr-1" />
                          <span className="font-medium">{tutorial.views}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-yellow-500">
                        <Star className="h-4 w-4 mr-1 fill-current" />
                        <span className="font-semibold">{tutorial.likes}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                {pagination.hasPrev && (
                  <button
                    onClick={() => updateSearchParams({ page: currentPage - 1 })}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Previous
                  </button>
                )}

                <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
                  Page {pagination.current} of {pagination.pages}
                </span>

                {pagination.hasNext && (
                  <button
                    onClick={() => updateSearchParams({ page: currentPage + 1 })}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Next
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No tutorials found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search criteria or browse all categories.
            </p>
            <button
              onClick={() => setSearchParams({})}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorialsPage;
