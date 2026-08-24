import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/times_digital_db');
    console.log(`\n✅ MongoDB connected successfully! DB HOST: ${connectionInstance.connection.host}, DB NAME: ${connectionInstance.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
