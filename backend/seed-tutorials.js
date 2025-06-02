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

const sampleTutorials = [
  {
    title: 'JavaScript Fundamentals for Beginners',
    slug: 'javascript-fundamentals-for-beginners',
    category: 'JavaScript',
    content: `
      <h2>Introduction to JavaScript</h2>
      <p>JavaScript is a versatile programming language that powers the web. In this tutorial, you'll learn the fundamental concepts that every JavaScript developer should know.</p>
      
      <h3>Variables and Data Types</h3>
      <p>JavaScript has several data types including strings, numbers, booleans, arrays, and objects.</p>
      
      <h3>Functions</h3>
      <p>Functions are reusable blocks of code that perform specific tasks.</p>
      
      <h3>Control Structures</h3>
      <p>Learn about if statements, loops, and other control structures that control the flow of your program.</p>
    `,
    excerpt: 'Learn the essential JavaScript concepts every developer needs to know, from variables to functions.',
    difficulty: 'Beginner',
    estimatedReadTime: 15,
    tags: ['javascript', 'programming', 'web development', 'beginner'],
    isPublished: true,
    views: 1250,
    likes: 89,
    codeExamples: [
      {
        title: 'Variable Declaration',
        language: 'javascript',
        code: `// Different ways to declare variables
let name = "John";
const age = 25;
var city = "New York";

console.log(name, age, city);`,
        description: 'Learn how to declare variables using let, const, and var'
      }
    ]
  },
  {
    title: 'Python Data Structures and Algorithms',
    slug: 'python-data-structures-algorithms',
    category: 'Python',
    content: `
      <h2>Understanding Data Structures in Python</h2>
      <p>Data structures are fundamental building blocks of efficient programs. This tutorial covers the most important data structures in Python.</p>
      
      <h3>Lists and Arrays</h3>
      <p>Lists are ordered collections that can store multiple items.</p>
      
      <h3>Dictionaries</h3>
      <p>Dictionaries store key-value pairs for fast lookups.</p>
      
      <h3>Sets</h3>
      <p>Sets are collections of unique elements.</p>
    `,
    excerpt: 'Master Python data structures and learn essential algorithms for efficient programming.',
    difficulty: 'Intermediate',
    estimatedReadTime: 25,
    tags: ['python', 'data structures', 'algorithms', 'programming'],
    isPublished: true,
    views: 890,
    likes: 67,
    codeExamples: [
      {
        title: 'Working with Lists',
        language: 'python',
        code: `# Creating and manipulating lists
numbers = [1, 2, 3, 4, 5]
numbers.append(6)
numbers.extend([7, 8, 9])

print(numbers)  # [1, 2, 3, 4, 5, 6, 7, 8, 9]`,
        description: 'Learn basic list operations in Python'
      }
    ]
  },
  {
    title: 'React Hooks Complete Guide',
    slug: 'react-hooks-complete-guide',
    category: 'React',
    content: `
      <h2>Mastering React Hooks</h2>
      <p>React Hooks revolutionized how we write React components. This comprehensive guide covers all the essential hooks.</p>
      
      <h3>useState Hook</h3>
      <p>Manage state in functional components with useState.</p>
      
      <h3>useEffect Hook</h3>
      <p>Handle side effects and lifecycle events with useEffect.</p>
      
      <h3>Custom Hooks</h3>
      <p>Create reusable logic with custom hooks.</p>
    `,
    excerpt: 'Complete guide to React Hooks including useState, useEffect, and creating custom hooks.',
    difficulty: 'Intermediate',
    estimatedReadTime: 30,
    tags: ['react', 'hooks', 'frontend', 'javascript'],
    isPublished: true,
    views: 2100,
    likes: 156,
    codeExamples: [
      {
        title: 'useState Example',
        language: 'javascript',
        code: `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`,
        description: 'Basic useState hook example with a counter'
      }
    ]
  },
  {
    title: 'CSS Grid Layout Mastery',
    slug: 'css-grid-layout-mastery',
    category: 'CSS',
    content: `
      <h2>CSS Grid Layout</h2>
      <p>CSS Grid is a powerful layout system that allows you to create complex, responsive layouts with ease.</p>
      
      <h3>Grid Container</h3>
      <p>Learn how to set up a grid container and define grid tracks.</p>
      
      <h3>Grid Items</h3>
      <p>Position and size grid items using grid lines and areas.</p>
      
      <h3>Responsive Grids</h3>
      <p>Create responsive layouts that adapt to different screen sizes.</p>
    `,
    excerpt: 'Master CSS Grid Layout to create modern, responsive web layouts with ease.',
    difficulty: 'Intermediate',
    estimatedReadTime: 20,
    tags: ['css', 'layout', 'grid', 'responsive design'],
    isPublished: true,
    views: 756,
    likes: 43,
    codeExamples: [
      {
        title: 'Basic Grid Setup',
        language: 'css',
        code: `.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  padding: 20px;
}

.grid-item {
  background-color: #f0f0f0;
  padding: 20px;
  text-align: center;
}`,
        description: 'Basic CSS Grid setup with three equal columns'
      }
    ]
  },
  {
    title: 'Node.js REST API Development',
    slug: 'nodejs-rest-api-development',
    category: 'Node.js',
    content: `
      <h2>Building REST APIs with Node.js</h2>
      <p>Learn how to build robust REST APIs using Node.js and Express.js framework.</p>
      
      <h3>Setting up Express</h3>
      <p>Get started with Express.js for building web applications and APIs.</p>
      
      <h3>Routing</h3>
      <p>Create routes to handle different HTTP methods and endpoints.</p>
      
      <h3>Middleware</h3>
      <p>Use middleware for authentication, logging, and error handling.</p>
    `,
    excerpt: 'Build professional REST APIs using Node.js, Express, and best practices.',
    difficulty: 'Advanced',
    estimatedReadTime: 35,
    tags: ['nodejs', 'express', 'api', 'backend'],
    isPublished: true,
    views: 1450,
    likes: 98,
    codeExamples: [
      {
        title: 'Express Server Setup',
        language: 'javascript',
        code: `const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/api/users', (req, res) => {
  res.json({ message: 'Get all users' });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
        description: 'Basic Express.js server setup with a simple route'
      }
    ]
  }
];

const seedTutorials = async () => {
  try {
    console.log('🌱 Starting tutorial seeding...');

    // Clear existing tutorials
    await Tutorial.deleteMany({});
    console.log('🗑️  Cleared existing tutorials');

    // Find or create a demo admin user
    let adminUser = await User.findOne({ email: 'admin@codenotes.com' });
    
    if (!adminUser) {
      adminUser = new User({
        username: 'admin',
        email: 'admin@codenotes.com',
        password: 'admin123', // This will be hashed by the pre-save middleware
        role: 'admin',
        isActive: true,
        profile: {
          firstName: 'Admin',
          lastName: 'User'
        }
      });
      await adminUser.save();
      console.log('👤 Created admin user');
    }

    // Add author to tutorials
    const tutorialsWithAuthor = sampleTutorials.map(tutorial => ({
      ...tutorial,
      author: adminUser._id
    }));

    // Insert tutorials
    const insertedTutorials = await Tutorial.insertMany(tutorialsWithAuthor);
    console.log(`✅ Successfully seeded ${insertedTutorials.length} tutorials`);

    // Display summary
    console.log('\n📊 Seeding Summary:');
    console.log(`- Total tutorials: ${insertedTutorials.length}`);
    console.log(`- Categories: ${[...new Set(sampleTutorials.map(t => t.category))].join(', ')}`);
    console.log(`- Difficulty levels: ${[...new Set(sampleTutorials.map(t => t.difficulty))].join(', ')}`);

  } catch (error) {
    console.error('❌ Error seeding tutorials:', error);
  }
};

const main = async () => {
  await connectDB();
  await seedTutorials();
  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB');
  process.exit(0);
};

main();
