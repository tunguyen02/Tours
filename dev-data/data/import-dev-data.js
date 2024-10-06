import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import TourModel from '../../model/tourModel.js';

// Định nghĩa __dirname thủ công
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB)
    .then(() => console.log('DB connection successful!'));

// Đọc file JSON
const tours = JSON.parse(fs.readFileSync(path.join(__dirname, 'tours-simple.json'), 'utf-8'));

// Import data vào DB
const importData = async () => {
    try {
        await TourModel.create(tours);
        console.log('Data successfully loaded!');
    } catch (error) {
        console.log(error);
    }
    process.exit();
}

// Xóa tất cả dữ liệu từ DB
const deleteData = async () => {
    try {
        await TourModel.deleteMany();
        console.log('Data successfully deleted!');
    } catch (error) {
        console.log(error);
    }
    process.exit();
}

// Kiểm tra arguments từ command line để quyết định hành động
if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}

console.log(process.argv);
