// /backend/config/dbConfig.js
import mysql from 'mysql';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        ca: fs.readFileSync(path.resolve(__dirname, '../ssl', 'isrgrootx1.pem')) // Adjusted path
    }
};

export default dbConfig;
