import dotenv from 'dotenv';
dotenv.config();

import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import mongoose from 'mongoose';
import { Admin } from '../models/admin.model.js';
import { generateSecurePassword } from '../utils/generatePassword.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const resetAdminPassword = async () => {
  const rl = readline.createInterface({ input, output });

  try {
    console.log('\n====================================');
    console.log('       TIMES SCHOOL ADMIN RESET');
    console.log('====================================\n');

    let email = await rl.question('Enter Admin Email: ');
    email = email.toLowerCase().trim();

    rl.close();

    if (!email || !emailRegex.test(email)) {
      console.error('\n❌ Invalid email address provided. Reset aborted.\n');
      process.exit(1);
    }

    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/times_digital_db';
    console.log('\nConnecting to database...');
    await mongoose.connect(mongoUri);

    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.error(`\n❌ No admin account found with email '${email}'. Reset aborted.\n`);
      await mongoose.disconnect();
      process.exit(1);
    }

    // Generate new cryptographically secure random temporary password
    const temporaryPassword = generateSecurePassword(14);

    admin.password = temporaryPassword;
    admin.mustChangePassword = true;
    admin.passwordChangedAt = new Date();

    await admin.save();
    await mongoose.disconnect();

    console.log('\n====================================');
    console.log('Admin password reset successfully.\n');
    console.log('Email:');
    console.log(email);
    console.log('\nTemporary Password:');
    console.log(temporaryPassword);
    console.log('\nIMPORTANT:');
    console.log('This password will not be shown again.\n');
    console.log('The admin must change it after login.');
    console.log('====================================\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during admin password reset:', error.message || error);
    try {
      await mongoose.disconnect();
    } catch {}
    process.exit(1);
  }
};

resetAdminPassword();
