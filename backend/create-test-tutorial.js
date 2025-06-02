import mongoose from 'mongoose';
import Tutorial from './models/Tutorial.js';
import User from './models/User.js';

async function createTestTutorial() {
  try {
    await mongoose.connect('mongodb://localhost:27017/codenotes');
    console.log('✅ Connected to MongoDB');
    
    const admin = await User.findOne({ email: 'admin@codenotes.com' });
    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }
    
    // Delete existing test tutorial if it exists
    await Tutorial.deleteOne({ slug: 'test-tutorial-with-images' });
    
    const testTutorial = new Tutorial({
      title: 'Test Tutorial with Images',
      slug: 'test-tutorial-with-images',
      category: 'JavaScript',
      content: `
        <h2>Test Tutorial with Images</h2>
        <p>This tutorial contains images for testing the URL display functionality.</p>
        <img src="https://via.placeholder.com/600x400/0066cc/ffffff?text=Sample+Image+1" alt="Sample Image 1">
        <p>More content here between images.</p>
        <img src="https://via.placeholder.com/600x300/cc6600/ffffff?text=Sample+Image+2" alt="Sample Image 2">
        <p>Final content after images.</p>
      `,
      excerpt: 'A test tutorial with sample images to verify URL display functionality',
      difficulty: 'Beginner',
      estimatedReadTime: 5,
      tags: ['test', 'images', 'url-display'],
      isPublished: true,
      author: admin._id,
      contentBlocks: [
        {
          id: 'block1',
          type: 'heading',
          content: 'Tutorial with Images',
          level: 'h2'
        },
        {
          id: 'block2',
          type: 'text',
          content: 'This is a test tutorial to verify that images show as URLs only (user preference).'
        },
        {
          id: 'block3',
          type: 'image',
          url: 'https://via.placeholder.com/600x400/0066cc/ffffff?text=Test+Image+1',
          alt: 'Test Image 1 - Blue Background',
          caption: 'This is a test image caption for the first image'
        },
        {
          id: 'block4',
          type: 'text',
          content: 'More content after the first image. This text should appear between the image URL displays.'
        },
        {
          id: 'block5',
          type: 'image',
          url: 'https://via.placeholder.com/600x300/cc6600/ffffff?text=Test+Image+2',
          alt: 'Test Image 2 - Orange Background',
          caption: 'Another test image with different dimensions and color'
        },
        {
          id: 'block6',
          type: 'text',
          content: 'Final content block after all images. The images above should display as URL references only.'
        }
      ]
    });
    
    await testTutorial.save();
    console.log('✅ Test tutorial created successfully');
    console.log('📝 Title:', testTutorial.title);
    console.log('🔗 Slug:', testTutorial.slug);
    console.log('🌐 URL: http://localhost:5714/tutorial/' + testTutorial.slug);
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createTestTutorial();
