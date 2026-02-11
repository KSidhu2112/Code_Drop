const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./src/models/Admin');
const connectDB = require('./src/config/db');

dotenv.config();
connectDB();

const seedAdmin = async () => {
    try {
        const adminExists = await Admin.findOne({ username: 'admin' });
        if (adminExists) {
            console.log('Admin already exists');
            process.exit();
        }

        await Admin.create({
            username: 'admin',
            password: 'password123'
        });

        console.log('Admin user created: admin / password123');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedAdmin();
