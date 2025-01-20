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
    host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    user: 'yy1aykyEhDRFQV6.root',
    password: 'RBP2ZbF0vd0Op2nY',
    database: 'cvsuenrollmentsystem',
    port: 4000,
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
