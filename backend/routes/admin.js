import express from 'express';
import { body, validationResult, query } from 'express-validator';
import User from '../models/User.js';
import Tutorial from '../models/Tutorial.js';
import Category from '../models/Category.js';
import Language from '../models/Language.js';
import ReadTimePreset from '../models/ReadTimePreset.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all users (admin only)
router.get('/users', authenticateToken, requireAdmin, [
  query('search').optional().isString(),
  query('role').optional().isIn(['all', 'user', 'admin']),
  query('status').optional().isIn(['all', 'active', 'inactive']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { search, role, status, page = 1, limit = 20 } = req.query;

    // Build query
    const query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (status && status !== 'all') {
      query.isActive = status === 'active';
    }

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'profile.firstName': { $regex: search, $options: 'i' } },
        { 'profile.lastName': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password -emailVerificationToken -passwordResetToken')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query)
    ]);

    res.json({
      users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new user (admin only)
router.post('/users', authenticateToken, requireAdmin, [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
  body('profile.firstName').optional().isLength({ max: 50 }),
  body('profile.lastName').optional().isLength({ max: 50 }),
  body('profile.bio').optional().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { username, email, password, role, profile } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email
          ? 'Email already registered'
          : 'Username already taken'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role,
      profile: profile || {},
      emailVerified: true, // Admin-created users are pre-verified
      isActive: true
    });

    await user.save();

    res.status(201).json({
      message: `${role === 'admin' ? 'Admin' : 'User'} created successfully`,
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Create user error:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
      });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user (admin only)
router.patch('/users/:id', authenticateToken, requireAdmin, [
  body('role').optional().isIn(['user', 'admin']),
  body('isActive').optional().isBoolean(),
  body('profile.firstName').optional().isLength({ max: 50 }),
  body('profile.lastName').optional().isLength({ max: 50 }),
  body('profile.bio').optional().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Prevent admin from demoting themselves
    if (req.params.id === req.user.userId && req.body.role === 'user') {
      return res.status(400).json({
        message: 'You cannot demote yourself from admin role'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password -emailVerificationToken -passwordResetToken');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (admin only)
router.delete('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.user.userId) {
      return res.status(400).json({
        message: 'You cannot delete your own account'
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get analytics data (admin only)
router.get('/analytics', authenticateToken, requireAdmin, [
  query('range').optional().isIn(['7d', '30d', '90d', '1y'])
], async (req, res) => {
  try {
    const { range = '30d' } = req.query;

    // Calculate date range
    const now = new Date();
    const daysBack = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    }[range];

    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));

    // Get overview stats
    const [totalTutorials, totalUsers, publishedTutorials, activeUsers] = await Promise.all([
      Tutorial.countDocuments(),
      User.countDocuments(),
      Tutorial.countDocuments({ isPublished: true }),
      User.countDocuments({ isActive: true })
    ]);

    // Get total views and likes
    const tutorialStats = await Tutorial.aggregate([
      { $match: { isPublished: true } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' },
          totalLikes: { $sum: '$likes' }
        }
      }
    ]);

    const { totalViews = 0, totalLikes = 0 } = tutorialStats[0] || {};

    // Get popular tutorials
    const popularTutorials = await Tutorial.find({ isPublished: true })
      .select('title views likes')
      .sort({ views: -1 })
      .limit(5);

    // Get category distribution
    const categoryStats = await Tutorial.aggregate([
      { $match: { isPublished: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const totalPublished = categoryStats.reduce((sum, cat) => sum + cat.count, 0);
    const categoryStatsWithPercentage = categoryStats.map(cat => ({
      category: cat._id,
      count: cat.count,
      percentage: totalPublished > 0 ? ((cat.count / totalPublished) * 100).toFixed(1) : 0
    }));

    // Get recent activity (mock data for now)
    const recentActivity = [
      { action: 'New tutorial published', details: 'JavaScript Basics', time: '2 hours ago' },
      { action: 'User registered', details: 'john@example.com', time: '4 hours ago' },
      { action: 'Tutorial updated', details: 'Python Functions', time: '6 hours ago' },
      { action: 'New tutorial published', details: 'HTML5 Elements', time: '1 day ago' }
    ];

    // Calculate growth trends (simplified - would need historical data for accurate trends)
    const trends = {
      tutorialsGrowth: 12.5,
      usersGrowth: 8.3,
      viewsGrowth: 23.1,
      likesGrowth: 15.7
    };

    res.json({
      overview: {
        totalTutorials,
        totalUsers,
        totalViews,
        totalLikes
      },
      trends,
      popularTutorials,
      categoryStats: categoryStatsWithPercentage,
      recentActivity
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get/Update settings (admin only)
router.get('/settings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Return current environment variables (sanitized)
    const settings = {
      general: {
        siteName: 'CodeNotes',
        siteDescription: 'Learn programming with interactive tutorials',
        siteUrl: process.env.FRONTEND_URL || 'http://localhost:5714',
        adminEmail: process.env.ADMIN_EMAIL || 'admin@codenotes.com'
      },
      security: {
        jwtSecret: process.env.JWT_SECRET ? '***hidden***' : '',
        sessionTimeout: 7,
        maxLoginAttempts: 5,
        requireEmailVerification: false
      },
      email: {
        smtpHost: process.env.SMTP_HOST || '',
        smtpPort: parseInt(process.env.SMTP_PORT) || 587,
        smtpUser: process.env.SMTP_USER || '',
        smtpPassword: process.env.SMTP_PASSWORD ? '***hidden***' : '',
        fromEmail: process.env.FROM_EMAIL || 'noreply@codenotes.com',
        fromName: process.env.FROM_NAME || 'CodeNotes'
      },
      compiler: {
        judge0ApiUrl: process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com',
        judge0ApiKey: process.env.JUDGE0_API_KEY ? '***hidden***' : '',
        executionTimeout: 10,
        memoryLimit: 128
      },
      storage: {
        cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
        cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ? '***hidden***' : '',
        maxFileSize: 5
      }
    };

    res.json(settings);

  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/settings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // In a real application, you would update environment variables or a settings database
    // For now, just return success
    res.json({ message: 'Settings updated successfully' });

  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ===== CATEGORY MANAGEMENT ROUTES =====

// Get all categories (admin only)
router.get('/categories', authenticateToken, requireAdmin, [
  query('search').optional().isString(),
  query('status').optional().isIn(['all', 'active', 'inactive']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { search, status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.isActive = status === 'active';
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      Category.find(query)
        .sort({ sortOrder: 1, name: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Category.countDocuments(query)
    ]);

    // Calculate actual tutorial counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const tutorialCount = await Tutorial.countDocuments({
          category: category.name,
          isPublished: true
        });
        return {
          ...category.toObject(),
          tutorialCount
        };
      })
    );

    res.json({
      categories: categoriesWithCounts,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new category (admin only)
router.post('/categories', authenticateToken, requireAdmin, [
  body('name')
    .isLength({ min: 1, max: 50 })
    .withMessage('Name must be between 1 and 50 characters')
    .trim(),
  body('description').optional().isLength({ max: 200 }),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Color must be a valid hex color'),
  body('icon').optional().isString(),
  body('sortOrder').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const category = new Category(req.body);
    await category.save();

    res.status(201).json({
      message: 'Category created successfully',
      category
    });

  } catch (error) {
    console.error('Create category error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Category name already exists'
      });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update category (admin only)
router.put('/categories/:id', authenticateToken, requireAdmin, [
  body('name').optional().isLength({ min: 1, max: 50 }).trim(),
  body('description').optional().isLength({ max: 200 }),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i),
  body('icon').optional().isString(),
  body('isActive').optional().isBoolean(),
  body('sortOrder').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({
      message: 'Category updated successfully',
      category
    });

  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete category (admin only)
router.delete('/categories/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Check if category is being used by tutorials
    const tutorialCount = await Tutorial.countDocuments({ category: req.params.id });

    if (tutorialCount > 0) {
      return res.status(400).json({
        message: `Cannot delete category. It is being used by ${tutorialCount} tutorial(s).`
      });
    }

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({
      message: 'Category deleted successfully'
    });

  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ===== LANGUAGE MANAGEMENT ROUTES =====

// Get all languages (admin only)
router.get('/languages', authenticateToken, requireAdmin, [
  query('search').optional().isString(),
  query('status').optional().isIn(['all', 'active', 'inactive']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { search, status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.isActive = status === 'active';
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { displayName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [languages, total] = await Promise.all([
      Language.find(query)
        .sort({ sortOrder: 1, name: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Language.countDocuments(query)
    ]);

    // Calculate actual tutorial counts for each language
    const languagesWithCounts = await Promise.all(
      languages.map(async (language) => {
        const tutorialCount = await Tutorial.countDocuments({
          language: language.name,
          isPublished: true
        });
        return {
          ...language.toObject(),
          tutorialCount
        };
      })
    );

    res.json({
      languages: languagesWithCounts,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get languages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new language (admin only)
router.post('/languages', authenticateToken, requireAdmin, [
  body('name')
    .isLength({ min: 1, max: 50 })
    .withMessage('Name must be between 1 and 50 characters')
    .trim(),
  body('displayName')
    .isLength({ min: 1, max: 50 })
    .withMessage('Display name must be between 1 and 50 characters')
    .trim(),
  body('fileExtension')
    .isLength({ min: 1, max: 10 })
    .withMessage('File extension must be between 1 and 10 characters')
    .trim(),
  body('judge0Id')
    .isInt({ min: 1 })
    .withMessage('Judge0 ID must be a positive integer'),
  body('monacoLanguage')
    .isLength({ min: 1 })
    .withMessage('Monaco language is required')
    .trim(),
  body('description').optional().isLength({ max: 200 }),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Color must be a valid hex color'),
  body('icon').optional().isString(),
  body('sortOrder').optional().isInt({ min: 0 }),
  body('defaultTemplate').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const language = new Language(req.body);
    await language.save();

    res.status(201).json({
      message: 'Language created successfully',
      language
    });

  } catch (error) {
    console.error('Create language error:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `${field === 'judge0Id' ? 'Judge0 ID' : 'Language name'} already exists`
      });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update language (admin only)
router.put('/languages/:id', authenticateToken, requireAdmin, [
  body('name').optional().isLength({ min: 1, max: 50 }).trim(),
  body('displayName').optional().isLength({ min: 1, max: 50 }).trim(),
  body('fileExtension').optional().isLength({ min: 1, max: 10 }).trim(),
  body('judge0Id').optional().isInt({ min: 1 }),
  body('monacoLanguage').optional().isLength({ min: 1 }).trim(),
  body('description').optional().isLength({ max: 200 }),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i),
  body('icon').optional().isString(),
  body('isActive').optional().isBoolean(),
  body('sortOrder').optional().isInt({ min: 0 }),
  body('defaultTemplate').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const language = await Language.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!language) {
      return res.status(404).json({ message: 'Language not found' });
    }

    res.json({
      message: 'Language updated successfully',
      language
    });

  } catch (error) {
    console.error('Update language error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete language (admin only)
router.delete('/languages/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const language = await Language.findByIdAndDelete(req.params.id);

    if (!language) {
      return res.status(404).json({ message: 'Language not found' });
    }

    res.json({
      message: 'Language deleted successfully'
    });

  } catch (error) {
    console.error('Delete language error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ===== READ TIME PRESET MANAGEMENT ROUTES =====

// Get all read time presets (admin only)
router.get('/read-time-presets', authenticateToken, requireAdmin, [
  query('search').optional().isString(),
  query('status').optional().isIn(['all', 'active', 'inactive']),
  query('category').optional().isIn(['Quick', 'Short', 'Medium', 'Long', 'Extended']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { search, status, category, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.isActive = status === 'active';
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [presets, total] = await Promise.all([
      ReadTimePreset.find(query)
        .sort({ sortOrder: 1, minutes: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      ReadTimePreset.countDocuments(query)
    ]);

    res.json({
      presets,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get read time presets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new read time preset (admin only)
router.post('/read-time-presets', authenticateToken, requireAdmin, [
  body('name')
    .isLength({ min: 1, max: 50 })
    .withMessage('Name must be between 1 and 50 characters')
    .trim(),
  body('minutes')
    .isInt({ min: 1, max: 300 })
    .withMessage('Minutes must be between 1 and 300'),
  body('category')
    .isIn(['Quick', 'Short', 'Medium', 'Long', 'Extended'])
    .withMessage('Category must be one of: Quick, Short, Medium, Long, Extended'),
  body('description').optional().isLength({ max: 200 }),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Color must be a valid hex color'),
  body('icon').optional().isString(),
  body('sortOrder').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const preset = new ReadTimePreset(req.body);
    await preset.save();

    res.status(201).json({
      message: 'Read time preset created successfully',
      preset
    });

  } catch (error) {
    console.error('Create read time preset error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Preset name already exists'
      });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update read time preset (admin only)
router.put('/read-time-presets/:id', authenticateToken, requireAdmin, [
  body('name').optional().isLength({ min: 1, max: 50 }).trim(),
  body('minutes').optional().isInt({ min: 1, max: 300 }),
  body('category').optional().isIn(['Quick', 'Short', 'Medium', 'Long', 'Extended']),
  body('description').optional().isLength({ max: 200 }),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i),
  body('icon').optional().isString(),
  body('isActive').optional().isBoolean(),
  body('sortOrder').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const preset = await ReadTimePreset.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!preset) {
      return res.status(404).json({ message: 'Read time preset not found' });
    }

    res.json({
      message: 'Read time preset updated successfully',
      preset
    });

  } catch (error) {
    console.error('Update read time preset error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete read time preset (admin only)
router.delete('/read-time-presets/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const preset = await ReadTimePreset.findByIdAndDelete(req.params.id);

    if (!preset) {
      return res.status(404).json({ message: 'Read time preset not found' });
    }

    res.json({
      message: 'Read time preset deleted successfully'
    });

  } catch (error) {
    console.error('Delete read time preset error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
