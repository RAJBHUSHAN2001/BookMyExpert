const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bookmyexpert';

const createDemoUser = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    const hashedPassword = await bcrypt.hash('user1', 10);
    
    await User.findOneAndUpdate(
      { email: '2001rajbhushan2001@gmail.com' },
      { 
        name: 'Raj Bhushan', 
        email: '2001rajbhushan2001@gmail.com', 
        password: hashedPassword, 
        role: 'user' 
      },
      { upsert: true, new: true }
    );
    
    console.log('User 2001rajbhushan2001@gmail.com created/updated with password "user1"');
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
};

createDemoUser();
