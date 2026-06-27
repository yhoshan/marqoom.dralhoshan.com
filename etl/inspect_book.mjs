import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const FORGE_URL = process.env.BUILT_IN_FORGE_API_URL?.replace(/\/+$/, '');
const FORGE_KEY = process.env.BUILT_IN_FORGE_API_KEY;

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute("SELECT kashafId, storageKey FROM kashaf_viewcache WHERE kashafId = 'fathalbaari' LIMIT 1");
conn.end();

const row = rows[0];
const url = new URL('v1/storage/presign/get', FORGE_URL + '/');
url.searchParams.set('path', row.storageKey);
const presignResp = await fetch(url, { headers: { Authorization: `Bearer ${FORGE_KEY}` } });
const { url: signed } = await presignResp.json();
const resp = await fetch(signed);
const vc = await resp.json();

console.log('المفاتيح الرئيسية:', Object.keys(vc));
console.log('\nمفتاح book:', JSON.stringify(vc.book, null, 2));
console.log('\nمفتاح summary:', JSON.stringify(vc.summary, null, 2));
