import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Tutorial from '../models/Tutorial.js';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.js';

// Mock authentication middleware for demo purposes
const mockAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer mock-jwt-token-')) {
    // Mock admin user for demo
    req.user = {
      _id: 'demo-admin-id',
      username: 'admin',
      email: 'admin@codenotes.com',
      role: 'admin'
    };
    return next();
  }
  return next();
};

const router = express.Router();

// Get all tutorials (public)
router.get('/', [
  query('category').optional().isString(),
  query('search').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('sort').optional().isIn(['newest', 'oldest', 'popular', 'title'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { category, search, page = 1, limit = 12, sort = 'newest' } = req.query;

    // Build query
    const query = { isPublished: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Build sort
    let sortOption = {};
    switch (sort) {
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'popular':
        sortOption = { views: -1, likes: -1 };
        break;
      case 'title':
        sortOption = { title: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;

    const [tutorials, total] = await Promise.all([
      Tutorial.find(query)
        .select('title slug category excerpt difficulty estimatedReadTime views likes createdAt author')
        .populate('author', 'username profile.firstName profile.lastName')
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit)),
      Tutorial.countDocuments(query)
    ]);

    res.json({
      tutorials,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        hasNext: skip + tutorials.length < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get tutorials error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tutorial by slug (public)
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const tutorial = await Tutorial.findOne({
      slug: req.params.slug,
      isPublished: true
    }).populate('author', 'username profile.firstName profile.lastName profile.avatar');

    if (!tutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }

    // Increment view count
    tutorial.views += 1;
    await tutorial.save();

    res.json({ tutorial });

  } catch (error) {
    console.error('Get tutorial error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get categories (public) - Using aggregation for better performance
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Tutorial.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { name: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } }
    ]);

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tutorial statistics (public)
router.get('/meta/stats', async (req, res) => {
  try {
    const [totalTutorials, totalViews, totalLikes, categories] = await Promise.all([
      Tutorial.countDocuments({ isPublished: true }),
      Tutorial.aggregate([
        { $match: { isPublished: true } },
        { $group: { _id: null, total: { $sum: '$views' } } }
      ]),
      Tutorial.aggregate([
        { $match: { isPublished: true } },
        { $group: { _id: null, total: { $sum: '$likes' } } }
      ]),
      Tutorial.distinct('category', { isPublished: true })
    ]);

    const stats = {
      tutorials: totalTutorials,
      views: totalViews[0]?.total || 0,
      likes: totalLikes[0]?.total || 0,
      categories: categories.length,
      languages: categories.length // For now, same as categories
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search tutorials (public)
router.get('/search', [
  query('q').notEmpty().withMessage('Search query is required'),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { q, page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;

    const searchQuery = {
      isPublished: true,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } },
        { category: { $regex: q, $options: 'i' } }
      ]
    };

    const [tutorials, total] = await Promise.all([
      Tutorial.find(searchQuery)
        .select('title slug category excerpt difficulty estimatedReadTime views likes createdAt author')
        .populate('author', 'username profile.firstName profile.lastName')
        .sort({ views: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Tutorial.countDocuments(searchQuery)
    ]);

    res.json({
      tutorials,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      },
      query: q
    });
  } catch (error) {
    console.error('Search tutorials error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes
// Get all tutorials for admin (must come before /:id route)
router.get('/admin/all', mockAuthMiddleware, authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status = 'all', search } = req.query;

    const query = {};
    if (status === 'published') query.isPublished = true;
    if (status === 'draft') query.isPublished = false;

    // Add search functionality
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const [tutorials, total] = await Promise.all([
      Tutorial.find(query)
        .populate('author', 'username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Tutorial.countDocuments(query)
    ]);

    res.json({
      tutorials,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Admin get tutorials error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single tutorial by ID for admin
router.get('/admin/:id', mockAuthMiddleware, authenticateToken, requireAdmin, async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id)
      .populate('author', 'username profile.firstName profile.lastName profile.avatar');

    if (!tutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }

    res.json({ tutorial });

  } catch (error) {
    console.error('Get tutorial by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create tutorial (admin only)
router.post('/', mockAuthMiddleware, authenticateToken, requireAdmin, [
  body('title').notEmpty().withMessage('Title is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('content').notEmpty().withMessage('Content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const tutorial = new Tutorial({
      ...req.body,
      author: req.user.userId || req.user._id
    });

    await tutorial.save();
    await tutorial.populate('author', 'username');

    res.status(201).json({
      message: 'Tutorial created successfully',
      tutorial
    });

  } catch (error) {
    console.error('Create tutorial error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update tutorial (admin only)
router.patch('/:id', mockAuthMiddleware, authenticateToken, requireAdmin, async (req, res) => {
  try {
    const tutorial = await Tutorial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'username');

    if (!tutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }

    res.json({
      message: 'Tutorial updated successfully',
      tutorial
    });

  } catch (error) {
    console.error('Update tutorial error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete tutorial (admin only)
router.delete('/:id', mockAuthMiddleware, authenticateToken, requireAdmin, async (req, res) => {
  try {
    const tutorial = await Tutorial.findByIdAndDelete(req.params.id);

    if (!tutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }

    res.json({ message: 'Tutorial deleted successfully' });

  } catch (error) {
    console.error('Delete tutorial error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
