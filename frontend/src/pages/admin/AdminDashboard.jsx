import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

// API Base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://codenotes-backend.onrender.com/api';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings as SettingsIcon,
  BarChart3,
  Plus,
  LogOut,
  TrendingUp,
  Activity,
  Clock,
  Star,
  Zap,
  Target,
  Award,
  Globe,
  Palette,
  Tag,
  Code,
  Timer,
  Image as ImageIcon
} from 'lucide-react';

// Import actual admin components
import TutorialManagement from './TutorialManagement';
import TutorialEditor from './TutorialEditor';
import TutorialViewer from './TutorialViewer';
import UserManagement from './UserManagement';
import Analytics from './Analytics';
import Settings from './Settings';
import TutorialStyleSettings from './TutorialStyleSettings';
import CategoryManagement from './CategoryManagement';
import LanguageManagement from './LanguageManagement';
import ReadTimeManagement from './ReadTimeManagement';
import ImageManagement from './ImageManagement';

const AdminDashboard = () => {
  const { isAuthenticated, isAdmin, loading, logout, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated() || !isAdmin()) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <div className="flex flex-col lg:flex-row">
        {/* Modern Sidebar */}
        <div className="w-full lg:w-72 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl border-b lg:border-r lg:border-b-0 border-white/20 dark:border-gray-700/50 lg:min-h-screen">
          {/* Logo Section */}
          <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <LayoutDashboard className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  CodeNotes
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-4 lg:mt-8 px-3 sm:px-4 lg:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 lg:space-y-2 lg:gap-0">
              <Link
                to="/admin"
                className={`group flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-all duration-200 touch-target ${
                  location.pathname === '/admin'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transform scale-105'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:shadow-md hover:scale-105'
                }`}
              >
                <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                <span className="hidden sm:inline lg:inline">Overview</span>
                <span className="sm:hidden lg:hidden">Home</span>
                {location.pathname === '/admin' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>

              <Link
                to="/admin/tutorials"
                className={`group flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-all duration-200 touch-target ${
                  location.pathname === '/admin/tutorials'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 transform scale-105'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:shadow-md hover:scale-105'
                }`}
              >
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                <span>Tutorials</span>
                {location.pathname === '/admin/tutorials' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>

              <Link
                to="/admin/users"
                className={`group flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-all duration-200 touch-target ${
                  location.pathname === '/admin/users'
                    ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/25 transform scale-105'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:shadow-md hover:scale-105'
                }`}
              >
                <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                <span>Users</span>
                {location.pathname === '/admin/users' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>

              <Link
                to="/admin/analytics"
                className={`group flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-all duration-200 touch-target ${
                  location.pathname === '/admin/analytics'
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/25 transform scale-105'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:shadow-md hover:scale-105'
                }`}
              >
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                <span>Analytics</span>
                {location.pathname === '/admin/analytics' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>

              <Link
                to="/admin/images"
                className={`group flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-all duration-200 touch-target ${
                  location.pathname === '/admin/images'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 transform scale-105'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:shadow-md hover:scale-105'
                }`}
              >
                <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                <span>Images</span>
                {location.pathname === '/admin/images' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>

              <Link
                to="/admin/settings"
                className={`group flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-all duration-200 touch-target ${
                  location.pathname === '/admin/settings'
                    ? 'bg-gradient-to-r from-gray-500 to-slate-600 text-white shadow-lg shadow-gray-500/25 transform scale-105'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:shadow-md hover:scale-105'
                }`}
              >
                <SettingsIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                <span>Settings</span>
                {location.pathname === '/admin/settings' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>

              <Link
                to="/admin/style-settings"
                className={`group flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-all duration-200 touch-target ${
                  location.pathname === '/admin/style-settings'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/25 transform scale-105'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:shadow-md hover:scale-105'
                }`}
              >
                <Palette className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                <span className="hidden sm:inline lg:inline">Style Settings</span>
                <span className="sm:hidden lg:hidden">Styles</span>
                {location.pathname === '/admin/style-settings' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>

              <Link
                to="/admin/categories"
                className={`group flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-all duration-200 touch-target ${
                  location.pathname === '/admin/categories'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 transform scale-105'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:shadow-md hover:scale-105'
                }`}
              >
                <Tag className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                <span>Categories</span>
                {location.pathname === '/admin/categories' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>

              <Link
                to="/admin/languages"
                className={`group flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-all duration-200 touch-target ${
                  location.pathname === '/admin/languages'
                    ? 'bg-gradient-to-r from-teal-500 to-green-600 text-white shadow-lg shadow-teal-500/25 transform scale-105'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:shadow-md hover:scale-105'
                }`}
              >
                <Code className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                <span>Languages</span>
                {location.pathname === '/admin/languages' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>

              <Link
                to="/admin/read-times"
                className={`group flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-all duration-200 touch-target ${
                  location.pathname === '/admin/read-times'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25 transform scale-105'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:shadow-md hover:scale-105'
                }`}
              >
                <Timer className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                <span className="hidden sm:inline lg:inline">Read Times</span>
                <span className="sm:hidden lg:hidden">Times</span>
                {location.pathname === '/admin/read-times' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>
            </div>

            {/* Logout Button */}
            <div className="mt-4 lg:mt-8 pt-4 lg:pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={logout}
                className="w-full group flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 hover:shadow-md touch-target"
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/tutorials" element={<TutorialManagement />} />
            <Route path="/tutorials/new" element={<TutorialEditor />} />
            <Route path="/tutorials/edit/:id" element={<TutorialEditor />} />
            <Route path="/tutorials/view/:id" element={<TutorialViewer />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/images" element={<ImageManagement />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/style-settings" element={<TutorialStyleSettings />} />
            <Route path="/categories" element={<CategoryManagement />} />
            <Route path="/languages" element={<LanguageManagement />} />
            <Route path="/read-times" element={<ReadTimeManagement />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

// Dashboard Overview Component
const DashboardOverview = () => {
  const [analytics, setAnalytics] = useState({
    overview: {
      totalTutorials: 0,
      totalUsers: 0,
      totalViews: 0,
      publishedTutorials: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/analytics`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Section - Following Javatpoint Pattern: Heading → Text → Image → Button */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl sm:rounded-3xl shadow-2xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative responsive-padding">
          <div className="max-w-4xl">
            {/* Heading */}
            <h1 className="responsive-heading font-bold text-white mb-4 sm:mb-6 leading-tight">
              Welcome to CodeNotes
              <span className="block responsive-subheading font-medium text-blue-100 mt-2">
                Admin Dashboard
              </span>
            </h1>

            {/* Text */}
            <p className="responsive-text text-blue-50 mb-6 sm:mb-8 leading-relaxed max-w-2xl">
              Manage your tutorials, users, and analytics from this comprehensive admin panel.
              Create engaging content and monitor your platform's performance with powerful tools.
            </p>

            {/* Image Placeholder */}
            <div className="mb-6 sm:mb-8 flex items-center space-x-3 sm:space-x-4 overflow-x-auto">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                <LayoutDashboard className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>

            {/* Button */}
            <div className="responsive-flex">
              <Link
                to="/admin/tutorials/new"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 font-semibold rounded-xl sm:rounded-2xl hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 touch-target text-sm sm:text-base"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Create New Tutorial
              </Link>
              <Link
                to="/admin/analytics"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white/20 text-white font-semibold rounded-xl sm:rounded-2xl hover:bg-white/30 transition-all duration-200 backdrop-blur-sm border border-white/30 touch-target text-sm sm:text-base"
              >
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                View Analytics
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-white/10 to-transparent rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="responsive-grid">
        <div className="responsive-card group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl shadow-lg">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-500 text-xs sm:text-sm font-medium">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  +12%
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Total Tutorials
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : analytics.overview.totalTutorials}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {loading ? '...' : analytics.overview.publishedTutorials} published
              </p>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-500 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8%
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Total Users
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : analytics.overview.totalUsers.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {loading ? '...' : analytics.overview.activeUsers || 0} active
              </p>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border border-orange-200/50 dark:border-orange-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-500 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +15%
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Total Views
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : analytics.overview.totalViews.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {loading ? '...' : analytics.overview.totalLikes || 0} likes
              </p>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl p-6 border border-purple-200/50 dark:border-purple-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-500 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +5%
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Categories
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : analytics.categoryStats?.length || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Active categories
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50 p-8">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg mr-4">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Quick Actions
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Streamline your workflow with these shortcuts
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/admin/tutorials/new"
            className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg mb-4 w-fit">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Create Tutorial
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add new educational content to your platform
              </p>
            </div>
          </Link>

          <Link
            to="/admin/users"
            className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg mb-4 w-fit">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Manage Users
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Oversee user accounts and permissions
              </p>
            </div>
          </Link>

          <Link
            to="/admin/analytics"
            className="group relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border border-orange-200/50 dark:border-orange-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg mb-4 w-fit">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                View Analytics
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monitor performance and engagement metrics
              </p>
            </div>
          </Link>

          <Link
            to="/admin/images"
            className="group relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-200/50 dark:border-indigo-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg mb-4 w-fit">
                <ImageIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Manage Images
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upload and organize tutorial images
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg mr-4">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Recent Activity
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Stay updated with the latest platform events
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">Live</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="group flex items-center p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl border border-blue-200/30 dark:border-blue-700/30 hover:shadow-lg transition-all duration-200">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg mr-4">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">
                New tutorial "Advanced React Patterns" was published
              </p>
              <div className="flex items-center mt-1">
                <Clock className="h-3 w-3 text-gray-400 mr-1" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  2 hours ago
                </p>
                <div className="ml-auto flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Featured</span>
                </div>
              </div>
            </div>
          </div>

          <div className="group flex items-center p-4 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-2xl border border-emerald-200/30 dark:border-emerald-700/30 hover:shadow-lg transition-all duration-200">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg mr-4">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">
                12 new users registered today
              </p>
              <div className="flex items-center mt-1">
                <Clock className="h-3 w-3 text-gray-400 mr-1" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  4 hours ago
                </p>
                <div className="ml-auto flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 dark:text-green-400">+25%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="group flex items-center p-4 bg-gradient-to-r from-orange-50/50 to-red-50/50 dark:from-orange-900/10 dark:to-red-900/10 rounded-2xl border border-orange-200/30 dark:border-orange-700/30 hover:shadow-lg transition-all duration-200">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg mr-4">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">
                Tutorial engagement increased by 18% this week
              </p>
              <div className="flex items-center mt-1">
                <Clock className="h-3 w-3 text-gray-400 mr-1" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  1 day ago
                </p>
                <div className="ml-auto flex items-center">
                  <Award className="h-4 w-4 text-purple-500 mr-1" />
                  <span className="text-sm text-purple-600 dark:text-purple-400">Milestone</span>
                </div>
              </div>
            </div>
          </div>

          <div className="group flex items-center p-4 bg-gradient-to-r from-purple-50/50 to-violet-50/50 dark:from-purple-900/10 dark:to-violet-900/10 rounded-2xl border border-purple-200/30 dark:border-purple-700/30 hover:shadow-lg transition-all duration-200">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-lg mr-4">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">
                Platform reached 50,000 total page views
              </p>
              <div className="flex items-center mt-1">
                <Clock className="h-3 w-3 text-gray-400 mr-1" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  2 days ago
                </p>
                <div className="ml-auto flex items-center">
                  <Target className="h-4 w-4 text-indigo-500 mr-1" />
                  <span className="text-sm text-indigo-600 dark:text-indigo-400">Goal Reached</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default AdminDashboard;
