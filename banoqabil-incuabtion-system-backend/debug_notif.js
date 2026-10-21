const mongoose = require('mongoose');
const Notification = require('./models/notification.model');
const User = require('./models/user.model');
require('dotenv').config({ path: '.env.development' });

const connectDB = require('./config/db.config');

const checkNotifications = async () => {
    try {
        process.env.MONGO_DB_NAME = 'dummy_db';
        await connectDB({ requireDummyDb: true });
        const activeDb = mongoose.connection.name;
        if (activeDb !== 'dummy_db') {
            console.error(`🛑 FATAL SAFETY BLOCK: debug_notif is restricted to 'dummy_db'. Connected to '${activeDb}'. Aborting.`);
            return;
        }

        // Find user by email to get ID
        const user = await User.findOne({ email: 'muhammadshah4589@gmail.com' });

        if (!user) {
            console.log('User not found');
            return;
        }

        console.log('User ID:', user._id);

        const loginNotifs = await Notification.find({ recipient: user._id, type: 'LOGIN' }).sort({ createdAt: -1 }).limit(5);
        console.log('Login notifications count:', loginNotifs.length);
        console.log('Login notifications:', loginNotifs);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

checkNotifications();
