import mongoose from 'mongoose';
import Tutorial from './models/Tutorial.js';

async function checkTutorial() {
  try {
    await mongoose.connect('mongodb://localhost:27017/codenotes');
    console.log('✅ Connected to MongoDB');
    
    const tutorial = await Tutorial.findOne({ title: /React Hooks/i });
    
    if (tutorial) {
      console.log('📚 Found tutorial:', tutorial.title);
      console.log('🔗 Slug:', tutorial.slug);
      console.log('📝 Content blocks:', tutorial.contentBlocks?.length || 0);
      
      if (tutorial.contentBlocks) {
        tutorial.contentBlocks.forEach((block, index) => {
          console.log(`\nBlock ${index + 1}:`);
          console.log('  Type:', block.type);
          if (block.type === 'image') {
            console.log('  🖼️  Image URL:', block.url);
            console.log('  📝 Alt text:', block.alt);
            console.log('  📄 Caption:', block.caption);
          } else if (block.type === 'heading') {
            console.log('  📋 Content:', block.content);
            console.log('  📏 Level:', block.level);
          } else if (block.type === 'text') {
            console.log('  📝 Content:', block.content.substring(0, 100) + '...');
          }
        });
      }
      
      // Also check if there are images in the old images array
      if (tutorial.images && tutorial.images.length > 0) {
        console.log('\n🖼️  Legacy images array:');
        tutorial.images.forEach((img, index) => {
          console.log(`  Image ${index + 1}:`, img.url);
        });
      }
      
    } else {
      console.log('❌ No React Hooks tutorial found');
      
      // List all tutorials
      const allTutorials = await Tutorial.find({}, 'title slug').limit(10);
      console.log('\n📚 Available tutorials:');
      allTutorials.forEach(t => {
        console.log(`  - ${t.title} (${t.slug})`);
      });
    }
    
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkTutorial();
