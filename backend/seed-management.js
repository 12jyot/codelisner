import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import Language from './models/Language.js';
import ReadTimePreset from './models/ReadTimePreset.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codenotes');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedCategories = async () => {
  try {
    // Clear existing categories
    await Category.deleteMany({});

    const categories = [
      {
        name: 'HTML',
        description: 'HyperText Markup Language - the standard markup language for web pages',
        color: '#E34F26',
        icon: 'Globe',
        sortOrder: 1
      },
      {
        name: 'CSS',
        description: 'Cascading Style Sheets - for styling and layout of web pages',
        color: '#1572B6',
        icon: 'Palette',
        sortOrder: 2
      },
      {
        name: 'JavaScript',
        description: 'Dynamic programming language for web development',
        color: '#F7DF1E',
        icon: 'Zap',
        sortOrder: 3
      },
      {
        name: 'Python',
        description: 'High-level programming language for general-purpose programming',
        color: '#3776AB',
        icon: 'Code',
        sortOrder: 4
      },
      {
        name: 'Java',
        description: 'Object-oriented programming language for enterprise applications',
        color: '#ED8B00',
        icon: 'Coffee',
        sortOrder: 5
      },
      {
        name: 'C++',
        description: 'General-purpose programming language with object-oriented features',
        color: '#00599C',
        icon: 'Cpu',
        sortOrder: 6
      },
      {
        name: 'React',
        description: 'JavaScript library for building user interfaces',
        color: '#61DAFB',
        icon: 'Monitor',
        sortOrder: 7
      },
      {
        name: 'Node.js',
        description: 'JavaScript runtime for server-side development',
        color: '#339933',
        icon: 'Database',
        sortOrder: 8
      },
      {
        name: 'SQL',
        description: 'Structured Query Language for database management',
        color: '#336791',
        icon: 'Database',
        sortOrder: 9
      },
      {
        name: 'Other',
        description: 'Miscellaneous programming topics and tutorials',
        color: '#6B7280',
        icon: 'BookOpen',
        sortOrder: 10
      }
    ];

    await Category.insertMany(categories);
    console.log('Categories seeded successfully');
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
};

const seedLanguages = async () => {
  try {
    // Clear existing languages
    await Language.deleteMany({});

    const languages = [
      {
        name: 'javascript',
        displayName: 'JavaScript',
        fileExtension: 'js',
        judge0Id: 63,
        monacoLanguage: 'javascript',
        color: '#F7DF1E',
        icon: 'Zap',
        sortOrder: 1,
        defaultTemplate: 'console.log("Hello, World!");',
        description: 'Dynamic programming language for web development'
      },
      {
        name: 'python',
        displayName: 'Python',
        fileExtension: 'py',
        judge0Id: 71,
        monacoLanguage: 'python',
        color: '#3776AB',
        icon: 'Code',
        sortOrder: 2,
        defaultTemplate: 'print("Hello, World!")',
        description: 'High-level programming language'
      },
      {
        name: 'java',
        displayName: 'Java',
        fileExtension: 'java',
        judge0Id: 62,
        monacoLanguage: 'java',
        color: '#ED8B00',
        icon: 'Coffee',
        sortOrder: 3,
        defaultTemplate: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
        description: 'Object-oriented programming language'
      },
      {
        name: 'cpp',
        displayName: 'C++',
        fileExtension: 'cpp',
        judge0Id: 54,
        monacoLanguage: 'cpp',
        color: '#00599C',
        icon: 'Cpu',
        sortOrder: 4,
        defaultTemplate: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
        description: 'General-purpose programming language'
      },
      {
        name: 'c',
        displayName: 'C',
        fileExtension: 'c',
        judge0Id: 50,
        monacoLanguage: 'c',
        color: '#A8B9CC',
        icon: 'Terminal',
        sortOrder: 5,
        defaultTemplate: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
        description: 'Procedural programming language'
      },
      {
        name: 'html',
        displayName: 'HTML',
        fileExtension: 'html',
        judge0Id: 1,
        monacoLanguage: 'html',
        color: '#E34F26',
        icon: 'Globe',
        sortOrder: 6,
        defaultTemplate: '<!DOCTYPE html>\n<html>\n<head>\n    <title>Hello World</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>',
        description: 'Markup language for web pages'
      },
      {
        name: 'css',
        displayName: 'CSS',
        fileExtension: 'css',
        judge0Id: 2,
        monacoLanguage: 'css',
        color: '#1572B6',
        icon: 'Palette',
        sortOrder: 7,
        defaultTemplate: 'body {\n    font-family: Arial, sans-serif;\n    margin: 0;\n    padding: 20px;\n}\n\nh1 {\n    color: #333;\n}',
        description: 'Style sheet language for web pages'
      },
      {
        name: 'sql',
        displayName: 'SQL',
        fileExtension: 'sql',
        judge0Id: 82,
        monacoLanguage: 'sql',
        color: '#336791',
        icon: 'Database',
        sortOrder: 8,
        defaultTemplate: 'SELECT "Hello, World!" AS message;',
        description: 'Database query language'
      },
      {
        name: 'php',
        displayName: 'PHP',
        fileExtension: 'php',
        judge0Id: 68,
        monacoLanguage: 'php',
        color: '#777BB4',
        icon: 'Code',
        sortOrder: 9,
        defaultTemplate: '<?php\necho "Hello, World!";\n?>',
        description: 'Server-side scripting language'
      },
      {
        name: 'ruby',
        displayName: 'Ruby',
        fileExtension: 'rb',
        judge0Id: 72,
        monacoLanguage: 'ruby',
        color: '#CC342D',
        icon: 'Code',
        sortOrder: 10,
        defaultTemplate: 'puts "Hello, World!"',
        description: 'Dynamic programming language'
      }
    ];

    await Language.insertMany(languages);
    console.log('Languages seeded successfully');
  } catch (error) {
    console.error('Error seeding languages:', error);
  }
};

const seedReadTimePresets = async () => {
  try {
    // Clear existing presets
    await ReadTimePreset.deleteMany({});

    const presets = [
      {
        name: 'Quick Read',
        minutes: 2,
        category: 'Quick',
        description: 'Very short tutorials for quick concepts',
        color: '#EF4444',
        icon: 'Zap',
        sortOrder: 1
      },
      {
        name: 'Brief Tutorial',
        minutes: 5,
        category: 'Quick',
        description: 'Short tutorials covering basic topics',
        color: '#F59E0B',
        icon: 'Clock',
        sortOrder: 2
      },
      {
        name: 'Standard Tutorial',
        minutes: 10,
        category: 'Short',
        description: 'Standard length for most tutorials',
        color: '#10B981',
        icon: 'BookOpen',
        sortOrder: 3
      },
      {
        name: 'Detailed Guide',
        minutes: 15,
        category: 'Medium',
        description: 'Comprehensive tutorials with examples',
        color: '#3B82F6',
        icon: 'Target',
        sortOrder: 4
      },
      {
        name: 'In-depth Tutorial',
        minutes: 25,
        category: 'Medium',
        description: 'Thorough coverage of complex topics',
        color: '#6366F1',
        icon: 'Award',
        sortOrder: 5
      },
      {
        name: 'Complete Course',
        minutes: 45,
        category: 'Long',
        description: 'Comprehensive course-style tutorials',
        color: '#8B5CF6',
        icon: 'Star',
        sortOrder: 6
      },
      {
        name: 'Extended Learning',
        minutes: 60,
        category: 'Long',
        description: 'Extended tutorials for advanced topics',
        color: '#EC4899',
        icon: 'TrendingUp',
        sortOrder: 7
      },
      {
        name: 'Workshop Style',
        minutes: 90,
        category: 'Extended',
        description: 'Workshop-style comprehensive tutorials',
        color: '#F97316',
        icon: 'Activity',
        sortOrder: 8
      },
      {
        name: 'Masterclass',
        minutes: 120,
        category: 'Extended',
        description: 'Masterclass-level comprehensive content',
        color: '#DC2626',
        icon: 'Award',
        sortOrder: 9
      }
    ];

    await ReadTimePreset.insertMany(presets);
    console.log('Read time presets seeded successfully');
  } catch (error) {
    console.error('Error seeding read time presets:', error);
  }
};

const seedAll = async () => {
  try {
    await connectDB();

    console.log('Starting database seeding...');

    await seedCategories();
    await seedLanguages();
    await seedReadTimePresets();

    console.log('Database seeding completed successfully!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAll().catch(error => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
}

export { seedCategories, seedLanguages, seedReadTimePresets };
