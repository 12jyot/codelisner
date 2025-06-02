import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MongoDB URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/codenotes');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codenotes');
    console.log('✅ MongoDB connected successfully');
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({ test: String });
    const TestModel = mongoose.model('Test', testSchema);
    
    const doc = new TestModel({ test: 'connection test' });
    await doc.save();
    console.log('✅ Test document created successfully');
    
    await TestModel.deleteOne({ _id: doc._id });
    console.log('✅ Test document deleted successfully');
    
    await mongoose.connection.close();
    console.log('✅ Connection closed successfully');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    process.exit(1);
  }
};

testConnection();
