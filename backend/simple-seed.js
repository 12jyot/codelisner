import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import Language from './models/Language.js';
import ReadTimePreset from './models/ReadTimePreset.js';

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

const seedData = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Category.deleteMany({});
    await Language.deleteMany({});
    await ReadTimePreset.deleteMany({});
    
    // Seed Categories
    console.log('📂 Seeding categories...');
    const categories = [
      { name: 'JavaScript', description: 'JavaScript programming tutorials', color: '#F7DF1E', icon: 'Zap', sortOrder: 1 },
      { name: 'Python', description: 'Python programming tutorials', color: '#3776AB', icon: 'Code', sortOrder: 2 },
      { name: 'HTML', description: 'HTML markup tutorials', color: '#E34F26', icon: 'Globe', sortOrder: 3 },
      { name: 'CSS', description: 'CSS styling tutorials', color: '#1572B6', icon: 'Palette', sortOrder: 4 },
      { name: 'Java', description: 'Java programming tutorials', color: '#ED8B00', icon: 'Coffee', sortOrder: 5 }
    ];
    
    for (const categoryData of categories) {
      const category = new Category(categoryData);
      await category.save();
      console.log(`  ✅ Created category: ${category.name}`);
    }
    
    // Seed Languages
    console.log('💻 Seeding languages...');
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
        defaultTemplate: 'console.log("Hello, World!");'
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
        defaultTemplate: 'print("Hello, World!")'
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
        defaultTemplate: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}'
      }
    ];
    
    for (const languageData of languages) {
      const language = new Language(languageData);
      await language.save();
      console.log(`  ✅ Created language: ${language.displayName}`);
    }
    
    // Seed Read Time Presets
    console.log('⏱️ Seeding read time presets...');
    const presets = [
      { name: 'Quick Read', minutes: 5, category: 'Quick', color: '#EF4444', icon: 'Zap', sortOrder: 1 },
      { name: 'Standard', minutes: 10, category: 'Short', color: '#10B981', icon: 'Clock', sortOrder: 2 },
      { name: 'Detailed', minutes: 20, category: 'Medium', color: '#3B82F6', icon: 'BookOpen', sortOrder: 3 },
      { name: 'Complete', minutes: 45, category: 'Long', color: '#8B5CF6', icon: 'Star', sortOrder: 4 }
    ];
    
    for (const presetData of presets) {
      const preset = new ReadTimePreset(presetData);
      await preset.save();
      console.log(`  ✅ Created preset: ${preset.name} (${preset.minutes} min)`);
    }
    
    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

seedData();
