import dotenv from 'dotenv';
dotenv.config();

import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import mongoose from 'mongoose';
import { Admin } from '../models/admin.model.js';
import { WebsiteSettings } from '../models/websiteSettings.model.js';
import { Homepage } from '../models/homepage.model.js';
import { ROLES } from '../utils/constants.js';
import { generateSecurePassword } from '../utils/generatePassword.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const seedAdmin = async () => {
  const rl = readline.createInterface({ input, output });

  try {
    console.log('\n====================================');
    console.log('      TIMES SCHOOL ADMIN SETUP');
    console.log('====================================\n');

    let email = await rl.question('Enter Admin Email: ');
    email = email.toLowerCase().trim();

    if (!email || !emailRegex.test(email)) {
      console.error('\n❌ Invalid email address provided. Setup aborted.\n');
      rl.close();
      process.exit(1);
    }

    const nameInput = await rl.question('Enter Admin Name (Press enter for "Super Admin"): ');
    const name = nameInput.trim() || 'Super Admin';

    rl.close();

    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/times_digital_db';
    console.log('\nConnecting to database...');
    await mongoose.connect(mongoUri);

    // Check if an admin with this email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log('\n====================================');
      console.log(`⚠️ An admin account with '${email}' already exists.`);
      console.log('No duplicate admin was created.');
      console.log('If you forgot the password, run: npm run admin:reset');
      console.log('====================================\n');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Generate secure random temporary password
    const temporaryPassword = generateSecurePassword(14);

    // Create admin in DB (Mongoose pre-save hook will hash the password with bcryptjs)
    await Admin.create({
      name,
      email,
      password: temporaryPassword,
      role: ROLES.SUPERADMIN,
      isActive: true,
      mustChangePassword: true
    });

    // Ensure Website Settings and Homepage documents are initialized
    const settingsCount = await WebsiteSettings.countDocuments();
    if (settingsCount === 0) {
      await WebsiteSettings.create({});
    }

    const homepageCount = await Homepage.countDocuments();
    if (homepageCount === 0) {
      await Homepage.create({});
    }

    await mongoose.disconnect();

    console.log('\n====================================');
    console.log('      TIMES SCHOOL ADMIN SETUP');
    console.log('====================================\n');
    console.log('Admin Email:');
    console.log(email);
    console.log('\nTemporary Password:');
    console.log(temporaryPassword);
    console.log('\nIMPORTANT:');
    console.log('This temporary password will be shown only once.');
    console.log('Save it securely.');
    console.log('\nThe administrator MUST change this password after first login.');
    console.log('\n====================================');
    console.log('Admin created successfully.');
    console.log('====================================\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during admin setup:', error.message || error);
    try {
      await mongoose.disconnect();
    } catch {}
    process.exit(1);
  }
};

seedAdmin();
