import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tutorial from './models/Tutorial.js';
import User from './models/User.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codenotes');
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const createSampleTutorials = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Creating sample tutorials...');
    
    // Find or create a sample user
    let sampleUser = await User.findOne({ email: 'admin@example.com' });
    if (!sampleUser) {
      sampleUser = new User({
        username: 'admin',
        email: 'admin@example.com',
        password: 'hashedpassword', // In real app, this would be properly hashed
        role: 'admin',
        isActive: true
      });
      await sampleUser.save();
      console.log('✅ Created sample admin user');
    }

    // Clear existing tutorials
    await Tutorial.deleteMany({});
    console.log('🧹 Cleared existing tutorials');
    
    const sampleTutorials = [
      {
        title: 'JavaScript Fundamentals',
        slug: 'javascript-fundamentals',
        excerpt: 'Learn the basics of JavaScript programming',
        content: 'This tutorial covers JavaScript fundamentals including variables, functions, and objects.',
        category: 'JavaScript',
        language: 'javascript',
        difficulty: 'beginner',
        estimatedReadTime: 10,
        isPublished: true,
        views: 150,
        likes: 25,
        author: sampleUser._id,
        tags: ['javascript', 'programming', 'web development']
      },
      {
        title: 'Python Data Types',
        slug: 'python-data-types',
        excerpt: 'Understanding Python data types and structures',
        content: 'Learn about Python data types including strings, lists, dictionaries, and more.',
        category: 'Python',
        language: 'python',
        difficulty: 'beginner',
        estimatedReadTime: 15,
        isPublished: true,
        views: 200,
        likes: 30,
        author: sampleUser._id,
        tags: ['python', 'data types', 'programming']
      },
      {
        title: 'HTML5 Semantic Elements',
        slug: 'html5-semantic-elements',
        excerpt: 'Modern HTML5 semantic elements for better structure',
        content: 'Explore HTML5 semantic elements like header, nav, main, section, and footer.',
        category: 'HTML',
        language: 'html',
        difficulty: 'beginner',
        estimatedReadTime: 8,
        isPublished: true,
        views: 180,
        likes: 20,
        author: sampleUser._id,
        tags: ['html', 'html5', 'semantic', 'web development']
      },
      {
        title: 'CSS Grid Layout',
        slug: 'css-grid-layout',
        excerpt: 'Master CSS Grid for modern web layouts',
        content: 'Learn how to create complex layouts using CSS Grid properties and techniques.',
        category: 'CSS',
        language: 'css',
        difficulty: 'intermediate',
        estimatedReadTime: 20,
        isPublished: true,
        views: 300,
        likes: 45,
        author: sampleUser._id,
        tags: ['css', 'grid', 'layout', 'responsive']
      },
      {
        title: 'Java Object-Oriented Programming',
        slug: 'java-oop',
        excerpt: 'Object-oriented programming concepts in Java',
        content: 'Understanding classes, objects, inheritance, and polymorphism in Java.',
        category: 'Java',
        language: 'java',
        difficulty: 'intermediate',
        estimatedReadTime: 25,
        isPublished: true,
        views: 250,
        likes: 35,
        author: sampleUser._id,
        tags: ['java', 'oop', 'programming', 'classes']
      },
      {
        title: 'Advanced JavaScript Patterns',
        slug: 'advanced-javascript-patterns',
        excerpt: 'Advanced design patterns in JavaScript',
        content: 'Explore advanced JavaScript patterns including modules, closures, and async patterns.',
        category: 'JavaScript',
        language: 'javascript',
        difficulty: 'advanced',
        estimatedReadTime: 30,
        isPublished: false, // Draft tutorial
        views: 0,
        likes: 0,
        author: sampleUser._id,
        tags: ['javascript', 'advanced', 'patterns', 'design patterns']
      }
    ];

    for (const tutorialData of sampleTutorials) {
      const tutorial = new Tutorial(tutorialData);
      await tutorial.save();
      console.log(`  ✅ Created tutorial: ${tutorial.title} (${tutorial.category})`);
    }
    
    console.log('🎉 Sample tutorials created successfully!');
    
    // Show summary
    const totalTutorials = await Tutorial.countDocuments();
    const publishedTutorials = await Tutorial.countDocuments({ isPublished: true });
    const categoryStats = await Tutorial.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n📊 Tutorial Summary:');
    console.log(`   Total tutorials: ${totalTutorials}`);
    console.log(`   Published tutorials: ${publishedTutorials}`);
    console.log('   Category breakdown:');
    categoryStats.forEach(cat => {
      console.log(`     ${cat._id}: ${cat.count} tutorials`);
    });
    
  } catch (error) {
    console.error('❌ Failed to create sample tutorials:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

createSampleTutorials();
