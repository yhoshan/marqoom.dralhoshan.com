import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// جلب جميع الكشافات من قاعدة البيانات
const [dbRows] = await conn.execute('SELECT kashafId, storageKey, schemaVersion FROM kashaf_viewcache ORDER BY id ASC');
conn.end();

console.log(`\n=== قاعدة البيانات: ${dbRows.length} كشاف ===`);
const dbIds = new Set(dbRows.map(r => r.kashafId));

// جلب IDs من KashafDetail.tsx
const detailContent = readFileSync('/home/ubuntu/marqoom/client/src/pages/KashafDetail.tsx', 'utf8');
const homeContent = readFileSync('/home/ubuntu/marqoom/client/src/pages/Home.tsx', 'utf8');

// استخراج IDs من KashafDetail
const detailIds = [...detailContent.matchAll(/id:\s*["']([^"']+)["']/g)].map(m => m[1]).filter(id => id.startsWith('marqoom'));
// استخراج IDs من Home
const homeIds = [...homeContent.matchAll(/id:\s*["']([^"']+)["']/g)].map(m => m[1]).filter(id => id.startsWith('marqoom'));

console.log(`\n=== KashafDetail.tsx: ${detailIds.length} كشاف ===`);
console.log(`=== Home.tsx: ${homeIds.length} كشاف ===`);

// الكشافات في الواجهة لكن ليس في DB
const inDetailNotDB = detailIds.filter(id => !dbIds.has(id));
console.log(`\n⚠️ في KashafDetail لكن ليس في DB (${inDetailNotDB.length}):`, inDetailNotDB);

// الكشافات في DB لكن ليس في KashafDetail
const inDBNotDetail = [...dbIds].filter(id => !detailIds.includes(id));
console.log(`\n⚠️ في DB لكن ليس في KashafDetail (${inDBNotDetail.length}):`, inDBNotDetail);

// الكشافات في Home لكن ليس في DB
const inHomeNotDB = homeIds.filter(id => !dbIds.has(id));
console.log(`\n⚠️ في Home لكن ليس في DB (${inHomeNotDB.length}):`, inHomeNotDB);

// الكشافات في DB لكن ليس في Home
const inDBNotHome = [...dbIds].filter(id => !homeIds.includes(id));
console.log(`\n⚠️ في DB لكن ليس في Home (${inDBNotHome.length}):`, inDBNotHome);

// الكشافات بدون xlsxUrl في KashafDetail
const noXlsx = detailIds.filter(id => {
  const idx = detailContent.indexOf(`id: "${id}"`);
  if (idx === -1) return false;
  const snippet = detailContent.slice(idx, idx + 2000);
  return !snippet.includes('xlsxUrl');
});
console.log(`\n⚠️ بدون xlsxUrl في KashafDetail (${noXlsx.length}):`, noXlsx);

console.log('\n=== انتهى الفحص ===');
