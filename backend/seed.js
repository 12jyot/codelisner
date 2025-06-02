import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Tutorial from './models/Tutorial.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codenotes');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Tutorial.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@codenotes.com',
      password: 'admin123',
      role: 'admin',
      profile: {
        firstName: 'Admin',
        lastName: 'User',
        bio: 'Administrator of CodeNotes platform'
      }
    });

    await adminUser.save();
    console.log('Created admin user');

    // Create additional admin users
    const secondAdmin = new User({
      username: 'superadmin',
      email: 'superadmin@codenotes.com',
      password: 'super123',
      role: 'admin',
      profile: {
        firstName: 'Super',
        lastName: 'Admin',
        bio: 'Super Administrator with full system access'
      }
    });

    await secondAdmin.save();
    console.log('Created super admin user');

    // Create a regular user
    const regularUser = new User({
      username: 'johndoe',
      email: 'john@example.com',
      password: 'user123',
      role: 'user',
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Regular user interested in learning programming'
      }
    });

    await regularUser.save();
    console.log('Created regular user');

    // Create sample tutorials
    const tutorials = [
      {
        title: 'JavaScript Basics: Variables and Data Types',
        slug: 'javascript-basics-variables-data-types',
        category: 'JavaScript',
        content: `
          <h2>Introduction to JavaScript Variables</h2>
          <p>Variables are containers for storing data values. In JavaScript, you can declare variables using <code>var</code>, <code>let</code>, or <code>const</code>.</p>

          <h3>Variable Declaration</h3>
          <p>Here are the three ways to declare variables in JavaScript:</p>
          <ul>
            <li><strong>var</strong> - Function-scoped or globally-scoped</li>
            <li><strong>let</strong> - Block-scoped (ES6+)</li>
            <li><strong>const</strong> - Block-scoped, cannot be reassigned (ES6+)</li>
          </ul>

          <h3>Data Types</h3>
          <p>JavaScript has several built-in data types:</p>
          <ul>
            <li><strong>String</strong> - Text data</li>
            <li><strong>Number</strong> - Numeric data</li>
            <li><strong>Boolean</strong> - true or false</li>
            <li><strong>Array</strong> - Ordered list of values</li>
            <li><strong>Object</strong> - Key-value pairs</li>
            <li><strong>null</strong> - Intentional absence of value</li>
            <li><strong>undefined</strong> - Variable declared but not assigned</li>
          </ul>
        `,
        excerpt: 'Learn the fundamentals of JavaScript variables and data types with practical examples.',
        codeExamples: [
          {
            language: 'javascript',
            title: 'Variable Declaration Examples',
            description: 'Different ways to declare variables in JavaScript',
            code: `// Using var (function-scoped)
var name = "John";
var age = 25;

// Using let (block-scoped)
let city = "New York";
let isStudent = true;

// Using const (block-scoped, immutable)
const PI = 3.14159;
const colors = ["red", "green", "blue"];

console.log("Name:", name);
console.log("Age:", age);
console.log("City:", city);
console.log("Is Student:", isStudent);
console.log("PI:", PI);
console.log("Colors:", colors);`
          },
          {
            language: 'javascript',
            title: 'Data Type Examples',
            description: 'Examples of different JavaScript data types',
            code: `// String
let message = "Hello, World!";
let template = \`Welcome, \${name}!\`;

// Number
let integer = 42;
let decimal = 3.14;
let negative = -10;

// Boolean
let isActive = true;
let isComplete = false;

// Array
let fruits = ["apple", "banana", "orange"];
let numbers = [1, 2, 3, 4, 5];

// Object
let person = {
  name: "Alice",
  age: 30,
  city: "Boston"
};

// Check data types
console.log(typeof message);    // "string"
console.log(typeof integer);    // "number"
console.log(typeof isActive);   // "boolean"
console.log(typeof fruits);     // "object"
console.log(typeof person);     // "object"`
          }
        ],
        tags: ['javascript', 'variables', 'data-types', 'beginner'],
        difficulty: 'Beginner',
        estimatedReadTime: 8,
        author: adminUser._id,
        isPublished: true
      },
      {
        title: 'Python Functions: Complete Guide',
        slug: 'python-functions-complete-guide',
        category: 'Python',
        content: `
          <h2>Understanding Python Functions</h2>
          <p>Functions are reusable blocks of code that perform specific tasks. They help organize code and avoid repetition.</p>

          <h3>Function Syntax</h3>
          <p>Python functions are defined using the <code>def</code> keyword:</p>

          <h3>Function Parameters</h3>
          <p>Functions can accept parameters to make them more flexible:</p>
          <ul>
            <li><strong>Positional parameters</strong> - Order matters</li>
            <li><strong>Keyword parameters</strong> - Named parameters</li>
            <li><strong>Default parameters</strong> - Have default values</li>
            <li><strong>Variable-length parameters</strong> - *args and **kwargs</li>
          </ul>

          <h3>Return Values</h3>
          <p>Functions can return values using the <code>return</code> statement.</p>
        `,
        excerpt: 'Master Python functions with examples covering parameters, return values, and best practices.',
        codeExamples: [
          {
            language: 'python',
            title: 'Basic Function Examples',
            description: 'Simple function definitions and calls',
            code: `# Simple function without parameters
def greet():
    print("Hello, World!")

# Function with parameters
def greet_person(name):
    print(f"Hello, {name}!")

# Function with return value
def add_numbers(a, b):
    return a + b

# Function with default parameter
def greet_with_title(name, title="Mr."):
    return f"Hello, {title} {name}!"

# Call the functions
greet()
greet_person("Alice")
result = add_numbers(5, 3)
print(f"5 + 3 = {result}")
print(greet_with_title("Smith"))
print(greet_with_title("Johnson", "Dr."))`
          },
          {
            language: 'python',
            title: 'Advanced Function Features',
            description: 'Variable arguments and lambda functions',
            code: `# Function with variable arguments
def calculate_sum(*args):
    return sum(args)

# Function with keyword arguments
def create_profile(**kwargs):
    profile = {}
    for key, value in kwargs.items():
        profile[key] = value
    return profile

# Lambda function (anonymous function)
square = lambda x: x ** 2
multiply = lambda x, y: x * y

# Using the functions
print("Sum:", calculate_sum(1, 2, 3, 4, 5))

profile = create_profile(name="John", age=25, city="NYC")
print("Profile:", profile)

print("Square of 5:", square(5))
print("3 * 4 =", multiply(3, 4))

# List comprehension with lambda
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x**2, numbers))
print("Squared numbers:", squared)`
          }
        ],
        tags: ['python', 'functions', 'parameters', 'intermediate'],
        difficulty: 'Intermediate',
        estimatedReadTime: 12,
        author: adminUser._id,
        isPublished: true
      },
      {
        title: 'HTML5 Semantic Elements',
        slug: 'html5-semantic-elements',
        category: 'HTML',
        content: `
          <h2>Introduction to HTML5 Semantic Elements</h2>
          <p>HTML5 introduced semantic elements that provide meaning to the structure of web pages, making them more accessible and SEO-friendly.</p>

          <h3>Why Use Semantic Elements?</h3>
          <ul>
            <li><strong>Accessibility</strong> - Screen readers can better understand page structure</li>
            <li><strong>SEO</strong> - Search engines can better index content</li>
            <li><strong>Maintainability</strong> - Code is more readable and organized</li>
          </ul>

          <h3>Common Semantic Elements</h3>
          <ul>
            <li><code>&lt;header&gt;</code> - Page or section header</li>
            <li><code>&lt;nav&gt;</code> - Navigation links</li>
            <li><code>&lt;main&gt;</code> - Main content area</li>
            <li><code>&lt;article&gt;</code> - Independent content</li>
            <li><code>&lt;section&gt;</code> - Thematic grouping</li>
            <li><code>&lt;aside&gt;</code> - Sidebar content</li>
            <li><code>&lt;footer&gt;</code> - Page or section footer</li>
          </ul>
        `,
        excerpt: 'Learn how to structure web pages using HTML5 semantic elements for better accessibility and SEO.',
        codeExamples: [
          {
            language: 'html',
            title: 'Basic Page Structure',
            description: 'A complete HTML5 page using semantic elements',
            code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Blog</title>
</head>
<body>
    <header>
        <h1>My Personal Blog</h1>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <article>
            <header>
                <h2>My First Blog Post</h2>
                <time datetime="2024-01-15">January 15, 2024</time>
            </header>
            <p>This is the content of my first blog post...</p>
            <footer>
                <p>Tags: <a href="#html">HTML</a>, <a href="#web">Web Development</a></p>
            </footer>
        </article>

        <aside>
            <h3>Recent Posts</h3>
            <ul>
                <li><a href="#post1">Getting Started with HTML</a></li>
                <li><a href="#post2">CSS Basics</a></li>
            </ul>
        </aside>
    </main>

    <footer>
        <p>&copy; 2024 My Personal Blog. All rights reserved.</p>
    </footer>
</body>
</html>`
          }
        ],
        tags: ['html', 'html5', 'semantic', 'accessibility', 'beginner'],
        difficulty: 'Beginner',
        estimatedReadTime: 6,
        author: adminUser._id,
        isPublished: true
      }
    ];

    // Insert tutorials
    for (const tutorialData of tutorials) {
      const tutorial = new Tutorial(tutorialData);
      await tutorial.save();
      console.log(`Created tutorial: ${tutorial.title}`);
    }

    console.log('✅ Seed data created successfully!');
    console.log('\n🔐 User Credentials:');
    console.log('===================');
    console.log('Admin User:');
    console.log('  Email: admin@codenotes.com');
    console.log('  Password: admin123');
    console.log('\nSuper Admin:');
    console.log('  Email: superadmin@codenotes.com');
    console.log('  Password: super123');
    console.log('\nRegular User:');
    console.log('  Email: john@example.com');
    console.log('  Password: user123');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedData();
