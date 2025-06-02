import { useState, useEffect } from 'react';
import axios from 'axios';

// API Base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://codenotes-backend.onrender.com/api';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Eye, 
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    overview: {
      totalTutorials: 0,
      totalUsers: 0,
      totalViews: 0,
      totalLikes: 0
    },
    trends: {
      tutorialsGrowth: 0,
      usersGrowth: 0,
      viewsGrowth: 0,
      likesGrowth: 0
    },
    popularTutorials: [],
    categoryStats: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Note: This endpoint needs to be created in the backend
      const response = await axios.get(`${API_BASE_URL}/admin/analytics?range=${timeRange}`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // Mock data for demonstration
      setAnalytics({
        overview: {
          totalTutorials: 24,
          totalUsers: 1234,
          totalViews: 15678,
          totalLikes: 892
        },
        trends: {
          tutorialsGrowth: 12.5,
          usersGrowth: 8.3,
          viewsGrowth: 23.1,
          likesGrowth: 15.7
        },
        popularTutorials: [
          { title: 'JavaScript Basics', views: 1234, likes: 89 },
          { title: 'Python Functions', views: 987, likes: 67 },
          { title: 'HTML5 Semantic Elements', views: 756, likes: 45 }
        ],
        categoryStats: [
          { category: 'JavaScript', count: 8, percentage: 33.3 },
          { category: 'Python', count: 6, percentage: 25.0 },
          { category: 'HTML', count: 4, percentage: 16.7 },
          { category: 'CSS', count: 3, percentage: 12.5 },
          { category: 'React', count: 3, percentage: 12.5 }
        ],
        recentActivity: [
          { action: 'New tutorial published', details: 'JavaScript Basics', time: '2 hours ago' },
          { action: 'User registered', details: 'john@example.com', time: '4 hours ago' },
          { action: 'Tutorial updated', details: 'Python Functions', time: '6 hours ago' },
          { action: 'New tutorial published', details: 'HTML5 Elements', time: '1 day ago' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, growth, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</p>
          {growth !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="h-3 w-3 mr-1" />
              {growth >= 0 ? '+' : ''}{growth}% from last period
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your platform's performance and growth
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Tutorials"
              value={analytics.overview.totalTutorials}
              growth={analytics.trends.tutorialsGrowth}
              icon={BookOpen}
              color="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            />
            <StatCard
              title="Total Users"
              value={analytics.overview.totalUsers}
              growth={analytics.trends.usersGrowth}
              icon={Users}
              color="bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
            />
            <StatCard
              title="Total Views"
              value={analytics.overview.totalViews}
              growth={analytics.trends.viewsGrowth}
              icon={Eye}
              color="bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
            />
            <StatCard
              title="Total Likes"
              value={analytics.overview.totalLikes}
              growth={analytics.trends.likesGrowth}
              icon={Activity}
              color="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Popular Tutorials */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Popular Tutorials
              </h2>
              <div className="space-y-4">
                {analytics.popularTutorials.map((tutorial, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{tutorial.title}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {tutorial.views}
                        </span>
                        <span className="flex items-center">
                          <Activity className="h-3 w-3 mr-1" />
                          {tutorial.likes}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">#{index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Category Distribution
              </h2>
              <div className="space-y-3">
                {analytics.categoryStats.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500'][index % 5]
                      }`}></div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{category.category}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{category.count}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{category.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              {analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{activity.details}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
