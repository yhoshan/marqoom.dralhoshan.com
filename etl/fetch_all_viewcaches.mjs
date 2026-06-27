/**
 * جلب view_cache لكل كشاف من S3 واستخراج البيانات الأساسية
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { writeFileSync, readFileSync } from 'fs';
dotenv.config();

const FORGE_URL = process.env.BUILT_IN_FORGE_API_URL?.replace(/\/+$/, '');
const FORGE_KEY = process.env.BUILT_IN_FORGE_API_KEY;

async function getPresignedUrl(storageKey) {
  const url = new URL('v1/storage/presign/get', FORGE_URL + '/');
  url.searchParams.set('path', storageKey);
  const resp = await fetch(url, { headers: { Authorization: `Bearer ${FORGE_KEY}` } });
  if (!resp.ok) throw new Error(`Presign failed: ${resp.status}`);
  const { url: signed } = await resp.json();
  return signed;
}

async function fetchViewCache(storageKey) {
  try {
    const signed = await getPresignedUrl(storageKey);
    const resp = await fetch(signed);
    if (!resp.ok) return null;
    return await resp.json();
  } catch (e) {
    return null;
  }
}

function extractStats(vc) {
  if (!vc) return {};
  
  // schema v2.1
  if (vc.views || vc.facets) {
    const meta = vc.metadata || {};
    const stats = vc.stats || {};
    return {
      schema: 'v2.1',
      title: meta.book_title || meta.title || '',
      author: meta.book_author || meta.author || '',
      died: meta.author_died || meta.died || '',
      words: stats.total_words || stats.words || 0,
      pages: stats.total_pages || stats.pages || 0,
      units: (vc.views?.units?.length) || stats.units || 0,
      resources: (vc.views?.resources?.length) || stats.resources || 0,
    };
  }
  
  // schema v1 / legacy
  const meta = vc.metadata || vc.book_metadata || {};
  const stats = vc.stats || vc.statistics || {};
  
  // محاولة استخراج الإحصائيات من highlights أو distributions
  const highlights = Array.isArray(vc.highlights) ? vc.highlights : [];
  const statsFromHighlights = {};
  highlights.forEach(h => {
    if (h && h.value) statsFromHighlights[h.label] = h.value;
  });
  
  return {
    schema: 'v1',
    title: meta.book_title || meta.title || vc.book_title || '',
    author: meta.book_author || meta.author || vc.book_author || '',
    died: meta.author_died || meta.died || '',
    words: stats.total_words || stats.words || 0,
    pages: stats.total_pages || stats.pages || 0,
    units: stats.total_entries || stats.entries || stats.units || 0,
    resources: stats.total_resources || stats.resources || 0,
    highlights: statsFromHighlights,
  };
}

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute('SELECT * FROM kashaf_viewcache ORDER BY id ASC');
conn.end();

console.log(`جلب view_cache لـ ${rows.length} كشاف...`);

const results = [];
let i = 0;
for (const row of rows) {
  i++;
  process.stdout.write(`\r${i}/${rows.length}: ${row.kashafId}...`);
  const vc = await fetchViewCache(row.storageKey);
  const stats = extractStats(vc);
  results.push({
    kashafId: row.kashafId,
    dbTitle: row.bookTitle,
    dbAuthor: row.bookAuthor,
    ...stats,
    storageKey: row.storageKey,
  });
  // تأخير صغير لتجنب rate limiting
  await new Promise(r => setTimeout(r, 100));
}

console.log('\nانتهى الجلب!');
writeFileSync('/home/ubuntu/marqoom/etl/all_viewcaches_data.json', JSON.stringify(results, null, 2));
console.log('تم الحفظ في all_viewcaches_data.json');

// طباعة ملخص
results.forEach((r, idx) => {
  const title = r.dbTitle || r.title || '???';
  const author = r.dbAuthor || r.author || '???';
  console.log(`${idx+1}. [${r.kashafId}] ${title} | ${author} | كلمات:${r.words} صفحات:${r.pages}`);
});
