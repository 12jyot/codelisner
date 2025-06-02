import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Configure Cloudinary function
const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  return cloudinary.config();
};

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

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

// Upload single image
router.post('/image', mockAuthMiddleware, authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    // Configure Cloudinary with current environment variables
    configureCloudinary();

    console.log('📸 Image upload request received');
    console.log('User:', req.user ? `${req.user.email} (${req.user.role})` : 'No user');
    console.log('File:', req.file ? `${req.file.originalname} (${req.file.size} bytes)` : 'No file');

    if (!req.file) {
      console.log('❌ No file provided');
      return res.status(400).json({
        message: 'No image file provided',
        details: 'Please select an image file to upload'
      });
    }

    // Validate file type
    if (!req.file.mimetype.startsWith('image/')) {
      console.log('❌ Invalid file type:', req.file.mimetype);
      return res.status(415).json({
        message: 'Only image files are allowed',
        details: `Received: ${req.file.mimetype}. Please use JPG, PNG, GIF, or WebP.`
      });
    }

    // Validate file size
    if (req.file.size > 5 * 1024 * 1024) {
      console.log('❌ File too large:', req.file.size);
      return res.status(413).json({
        message: 'File size too large. Maximum 5MB allowed.',
        details: `File size: ${(req.file.size / 1024 / 1024).toFixed(2)}MB`
      });
    }

    console.log('☁️ Uploading to Cloudinary...');

    // Test Cloudinary configuration before upload
    const config = cloudinary.config();
    if (!config.cloud_name || !config.api_key || !config.api_secret) {
      throw new Error('Cloudinary configuration incomplete');
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'codenotes/tutorials',
          transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto' },
            { format: 'auto' }
          ],
          resource_type: 'image'
        },
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary upload error:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            reject(error);
          } else {
            console.log('✅ Cloudinary upload successful:', result.public_id);
            resolve(result);
          }
        }
      ).end(req.file.buffer);
    });

    const response = {
      message: 'Image uploaded successfully',
      image: {
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes
      }
    };

    console.log('✅ Upload complete:', response.image.public_id);
    res.json(response);

  } catch (error) {
    console.error('❌ Image upload error:', error);

    // Handle specific Cloudinary errors
    if (error.error && error.error.message) {
      return res.status(500).json({
        message: 'Cloud storage error',
        details: error.error.message
      });
    }

    // Handle multer errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        message: 'File size too large. Maximum 5MB allowed.',
        details: 'Please compress your image or choose a smaller file.'
      });
    }

    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        message: 'Unexpected file field',
        details: 'Please use the correct file input field.'
      });
    }

    // Generic error
    res.status(500).json({
      message: 'Image upload failed',
      details: 'An unexpected error occurred. Please try again.'
    });
  }
});

// Upload multiple images
router.post('/images', mockAuthMiddleware, authenticateToken, requireAdmin, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files provided' });
    }

    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'codenotes/tutorials',
            transformation: [
              { width: 1200, height: 800, crop: 'limit' },
              { quality: 'auto' },
              { format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve({
              url: result.secure_url,
              public_id: result.public_id,
              width: result.width,
              height: result.height
            });
          }
        ).end(file.buffer);
      });
    });

    const images = await Promise.all(uploadPromises);

    res.json({
      message: 'Images uploaded successfully',
      images
    });

  } catch (error) {
    console.error('Multiple images upload error:', error);
    res.status(500).json({ message: 'Images upload failed' });
  }
});

// Delete image
router.delete('/image/:publicId', mockAuthMiddleware, authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { publicId } = req.params;

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      res.json({ message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ message: 'Image not found' });
    }

  } catch (error) {
    console.error('Image deletion error:', error);
    res.status(500).json({ message: 'Image deletion failed' });
  }
});

// Get upload signature for direct client uploads (optional)
router.post('/signature', mockAuthMiddleware, authenticateToken, requireAdmin, (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const params = {
      timestamp,
      folder: 'codenotes/tutorials',
      transformation: 'w_1200,h_800,c_limit,q_auto,f_auto'
    };

    const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);

    res.json({
      signature,
      timestamp,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME
    });

  } catch (error) {
    console.error('Signature generation error:', error);
    res.status(500).json({ message: 'Failed to generate upload signature' });
  }
});

export default router;
