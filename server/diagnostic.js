const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./src/models/Admin');
const User = require('./src/models/User');
const connectDB = require('./src/config/db');

dotenv.config();

const diagnostic = async () => {
    try {
        await connectDB();
        console.log('--- DATABASE DIAGNOSIS ---');

        const admins = await Admin.find({});
        console.log(`Found ${admins.length} Admins:`);
        admins.forEach(a => {
            console.log(` - [ADMIN] Email: ${a.email}, Username: ${a.username}, Verified: ${a.isVerified}, ID: ${a._id}`);
        });

        const users = await User.find({});
        console.log(`Found ${users.length} Users:`);
        users.forEach(u => {
            console.log(` - [USER] Email: ${u.email}, ID: ${u._id}`);
        });

        console.log('--- END DIAGNOSIS ---');
        mongoose.connection.close();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

diagnostic();
