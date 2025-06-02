import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  BookOpen,
  Users,
  Zap,
  ArrowRight,
  Star,
  Clock,
  Eye,
  Play,
  AlertCircle
} from 'lucide-react';
import { tutorialService } from '../services/tutorialService';
import BackendStatus from '../components/BackendStatus';


const HomePage = () => {
  const [featuredTutorials, setFeaturedTutorials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBackendStatus, setShowBackendStatus] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [tutorialsData, categoriesData] = await Promise.all([
          tutorialService.getAllTutorials({ limit: 6, sort: 'popular' }),
          tutorialService.getCategories()
        ]);

        setFeaturedTutorials(tutorialsData.tutorials || []);
        setCategories(categoriesData.categories || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);

        // Check if it's a network error (backend unavailable)
        if (error.code === 'ECONNABORTED' || error.code === 'NETWORK_ERROR' || !error.response) {
          setShowBackendStatus(true);
        } else {
          setError('Failed to load content. Please try again later.');
        }

        // Set fallback data
        setFeaturedTutorials([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const features = [
    {
      icon: <Code2 className="h-8 w-8" />,
      title: "Interactive Code Editor",
      description: "Write, edit, and run code directly in your browser with our built-in compiler supporting multiple languages."
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Comprehensive Tutorials",
      description: "Step-by-step guides covering everything from basics to advanced topics in web development and programming."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Driven",
      description: "Learn from a community of developers and contribute to making programming education accessible to everyone."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Feedback",
      description: "Get immediate results from your code with our fast compilation service and detailed error messages."
    }
  ];

  const stats = [
    { label: "Tutorials", value: "500+" },
    { label: "Students", value: "10K+" },
    { label: "Languages", value: "12+" },
    { label: "Code Examples", value: "2K+" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      {/* Backend Status Modal */}
      {showBackendStatus && (
        <BackendStatus
          onBackendReady={() => {
            setShowBackendStatus(false);
            window.location.reload(); // Reload to fetch fresh data
          }}
        />
      )}

      {/* Enhanced Hero Section - Following Javatpoint Pattern */}
      <section className="relative overflow-hidden py-12 sm:py-16 lg:py-24 xl:py-32">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl -translate-x-32 sm:-translate-x-48 -translate-y-32 sm:-translate-y-48"></div>
          <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl translate-x-32 sm:translate-x-48 translate-y-32 sm:translate-y-48"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Heading */}
            <div className="mb-6 sm:mb-8">
              <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-300 mb-4 sm:mb-6 border border-blue-200/50 dark:border-blue-700/50">
                <Code2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Welcome to CodeNotes
              </div>
              <h1 className="responsive-heading font-bold mb-4 sm:mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent block">
                  Learn to Code with
                </span>
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent block mt-2">
                  Interactive Tutorials
                </span>
              </h1>
            </div>

            {/* Text */}
            <p className="responsive-text text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
              Master programming languages with hands-on tutorials, interactive code examples,
              and instant feedback. Join thousands of developers on their coding journey.
            </p>

            {/* Image/Visual Elements */}
            <div className="mb-8 sm:mb-12 flex justify-center px-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-xs sm:max-w-2xl">
                <div className="group relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 touch-target">
                    <Code2 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 transform -translate-x-1/2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Code
                  </div>
                </div>
                <div className="group relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 touch-target">
                    <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 transform -translate-x-1/2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn
                  </div>
                </div>
                <div className="group relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 touch-target">
                    <Play className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 transform -translate-x-1/2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Practice
                  </div>
                </div>
                <div className="group relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 touch-target">
                    <Star className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 transform -translate-x-1/2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Master
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
              <Link
                to="/tutorials"
                className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl sm:rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 touch-target"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl sm:rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <span className="relative flex items-center text-sm sm:text-base">
                  Start Learning Journey
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                to="/tutorials?category=JavaScript"
                className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 font-semibold rounded-xl sm:rounded-2xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50 transform hover:scale-105 touch-target"
              >
                <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm sm:text-base">Try Interactive Demo</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="responsive-subheading font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3 sm:mb-4">
              Trusted by Developers Worldwide
            </h2>
            <p className="responsive-text text-gray-600 dark:text-gray-300">
              Join our growing community of learners and educators
            </p>
          </div>
          <div className="responsive-grid">
            {stats.map((stat, index) => (
              <div key={index} className="group text-center responsive-card bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-semibold text-sm sm:text-base lg:text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="responsive-subheading font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Why Choose CodeNotes?
            </h2>
            <p className="responsive-text text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We provide the best learning experience with modern tools and comprehensive content.
            </p>
          </div>

          <div className="responsive-grid">
            {features.map((feature, index) => (
              <div key={index} className="responsive-card bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-105 transition-all duration-300 group">
                <div className="text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="responsive-subheading font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Popular Categories
            </h2>
            <p className="responsive-text text-gray-600 dark:text-gray-300">
              Explore tutorials across different programming languages and technologies.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 sm:p-6 animate-pulse">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Unable to load categories
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No categories available at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {categories.slice(0, 12).map((category) => (
                <Link
                  key={category.name}
                  to={`/tutorials?category=${category.name}`}
                  className="responsive-card bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 hover:scale-105 transition-all duration-300 group touch-target"
                >
                  <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1">
                    {category.name}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {category.count} tutorials
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Tutorials Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
            <div className="flex-1">
              <h2 className="responsive-subheading font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Featured Tutorials
              </h2>
              <p className="responsive-text text-gray-600 dark:text-gray-300">
                Start with these popular tutorials chosen by our community.
              </p>
            </div>
            <Link
              to="/tutorials"
              className="hidden sm:inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm lg:text-base touch-target"
            >
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="responsive-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="responsive-card bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
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
          ) : (
            <div className="responsive-grid">
              {featuredTutorials.map((tutorial) => (
                <Link
                  key={tutorial._id}
                  to={`/tutorial/${tutorial.slug}`}
                  className="responsive-card bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs sm:text-sm font-medium rounded-full">
                      {tutorial.category}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {tutorial.difficulty}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {tutorial.title}
                  </h3>

                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                    {tutorial.excerpt}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 gap-2">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {tutorial.estimatedReadTime} min
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {tutorial.views}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-yellow-400" />
                      {tutorial.likes}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8 sm:mt-12 sm:hidden">
            <Link
              to="/tutorials"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors touch-target"
            >
              View All Tutorials
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-blue-600 dark:bg-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="responsive-subheading font-bold text-white mb-3 sm:mb-4">
            Ready to Start Your Coding Journey?
          </h2>
          <p className="responsive-text text-blue-100 mb-6 sm:mb-8">
            Join thousands of developers who are learning and growing with CodeNotes.
          </p>
          <Link
            to="/tutorials"
            className="inline-flex items-center px-6 sm:px-8 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors touch-target"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
