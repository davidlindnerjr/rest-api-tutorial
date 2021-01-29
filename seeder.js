import dotenv from 'dotenv';
import users from './data/users.js';
import User from './models/userModel.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () =>{
    try {

        // Clear Database before importing
        await User.deleteMany();
        await User.insertMany(users);

    } catch (err){
        console.error(`${err}`);
        process.exit(1);
    }
}

const destroyData = async () => {
    try {
        // Clear database before import
        await User.deleteMany();

        console.log('Data Deleted');

    } catch (err) {
        console.error(`${err}`);
        process.exit(1);
    }
}

if(process.argv[2] === '-d'){
    destroyData();
} else {
    importData();
}