const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./src/models/Admin');
const User = require('./src/models/User');
const connectDB = require('./src/config/db');

dotenv.config();

const run = async () => {
    await connectDB();
    const targetEmail = 'pulluripuli654@gmail.com';

    const isAdmin = await Admin.findOne({ email: targetEmail });
    const isUser = await User.findOne({ email: targetEmail });

    console.log(`Checking: ${targetEmail}`);
    console.log(`Is Admin: ${isAdmin ? 'YES' : 'NO'}`);
    console.log(`Is User: ${isUser ? 'YES' : 'NO'}`);

    if (isUser && !isAdmin) {
        console.log('Detected account as regular user. Converting to Admin...');
        await Admin.create({
            username: isUser.username || 'admin_puli',
            email: isUser.email,
            password: isUser.password, // This is risky if hashing differ, but matchPassword uses bcrypt
            isVerified: true
        });
        console.log('Conversion successful!');
    }

    mongoose.connection.close();
};

run();
