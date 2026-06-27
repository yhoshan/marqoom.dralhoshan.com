import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);
// فحص الأعمدة أولاً
const [cols] = await conn.execute('DESCRIBE kashaf_viewcache');
console.log('Columns:', cols.map(c => c.Field).join(', '));

const [rows] = await conn.execute('SELECT * FROM kashaf_viewcache ORDER BY id DESC LIMIT 5');
console.log('Last 5:', rows.map(r => ({id: r.id, ...Object.fromEntries(Object.entries(r).slice(0,5))})));
const [count] = await conn.execute('SELECT COUNT(*) as total FROM kashaf_viewcache');
console.log('Total:', count[0].total);
conn.end();
