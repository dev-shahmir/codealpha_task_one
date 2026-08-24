require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');

async function makeAdmin() {
  await connectDB();
  const email = process.env.ADMIN_EMAIL || 'ashahmir467@gmail.com';
  
  let user = await User.findOne({ email });
  if (user) {
    user.role = 'admin';
    user.isEmailVerified = true;
    await user.save({ validateBeforeSave: false });
    console.log(`✅ User ${email} has been updated to ADMIN role!`);
  } else {
    user = await User.create({
      name: 'Admin Store',
      email,
      password: process.env.ADMIN_PASSWORD || 'Shahmirxstore',
      role: 'admin',
      isEmailVerified: true,
    });
    console.log(`✅ New ADMIN user ${email} created!`);
  }
  process.exit(0);
}

makeAdmin().catch(console.error);
