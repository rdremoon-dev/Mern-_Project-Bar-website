const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const Admin = require('./model/admin.js');

const MONGO_URI = process.env.MONGO_URI;

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);

    // Remove any existing admin with this email
    await Admin.deleteMany({ email: 'admin@example.com' });

    const hashedPassword = await bcrypt.hash('admin1234', 10);

    await Admin.create({
      name: 'Reservation Manager',
      email: 'admin@example.com',
      password: hashedPassword,
      avatar: 'https://readymadeui.com/team-2.webp',
    });

    console.log('✅ Admin credentials created successfully:');
    console.log('Email: admin@example.com');
    console.log('Password: admin1234');
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

createAdmin();
