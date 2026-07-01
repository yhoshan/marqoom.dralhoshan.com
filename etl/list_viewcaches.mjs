import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';

// Load env
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');
try {
  const envContent = readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) process.env[k.trim()] = v.join('=').trim();
  });
} catch {}

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) { console.error('No DATABASE_URL'); process.exit(1); }

const conn = await mysql.createConnection(dbUrl);
const [rows] = await conn.query('SELECT kashafId, bookTitle, storageKey FROM kashaf_viewcache ORDER BY id');
console.log('Total in DB:', rows.length);
rows.forEach(r => console.log(r.kashafId));
await conn.end();
