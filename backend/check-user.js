import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const checkUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codenotes');
    console.log('✅ Connected to MongoDB');

    // Find admin user
    const adminUser = await User.findOne({ email: 'admin@codenotes.com' });
    
    if (adminUser) {
      console.log('✅ Admin user found:');
      console.log('- Email:', adminUser.email);
      console.log('- Username:', adminUser.username);
      console.log('- Role:', adminUser.role);
      console.log('- ID:', adminUser._id);
      
      // Test password comparison
      const isPasswordValid = await adminUser.comparePassword('admin123');
      console.log('- Password valid:', isPasswordValid);
      
    } else {
      console.log('❌ Admin user not found');
      
      // Check if any users exist
      const userCount = await User.countDocuments();
      console.log('Total users in database:', userCount);
      
      if (userCount > 0) {
        const users = await User.find({}).select('email username role');
        console.log('Existing users:', users);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

checkUser();
