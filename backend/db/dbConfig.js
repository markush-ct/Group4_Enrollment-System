import mysql from 'mysql';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from "url";
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pemPath = path.resolve(__dirname, "../ssl/isrgrootx1.pem");

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        ca: fs.readFileSync(pemPath)
    },
    connectTimeout: 10000
};

// const dbConfig = {
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'cvsuenrollmentsystem',    
// };


export default dbConfig;
