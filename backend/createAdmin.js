import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
    
    // Direct database insert - NO MODEL NEEDED
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await mongoose.connection.db.collection('admins').insertOne({
      username: 'admin',
      password: hashedPassword,
      createdAt: new Date()
    });
    
    console.log('✅ Admin created! Login: admin / admin123');
  } catch (error) {
    if (error.code === 11000) {
      console.log('⚠️ Admin already exists! Login: admin / admin123');
    } else {
      console.error('❌ Error:', error.message);
    }
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();
