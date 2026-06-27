/**
 * استخراج بيانات جميع الكشافات الـ 85 من S3
 * يدعم schema v1.0.0 (_meta + book + summary) و v2.1 (schema/views/facets)
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { writeFileSync } from 'fs';
dotenv.config();

const FORGE_URL = process.env.BUILT_IN_FORGE_API_URL?.replace(/\/+$/, '');
const FORGE_KEY = process.env.BUILT_IN_FORGE_API_KEY;

async function fetchViewCache(storageKey) {
  try {
    const url = new URL('v1/storage/presign/get', FORGE_URL + '/');
    url.searchParams.set('path', storageKey);
    const presignResp = await fetch(url, { headers: { Authorization: `Bearer ${FORGE_KEY}` } });
    if (!presignResp.ok) return null;
    const { url: signed } = await presignResp.json();
    const resp = await fetch(signed);
    if (!resp.ok) return null;
    return await resp.json();
  } catch (e) {
    return null;
  }
}

function extractData(vc, kashafId, dbTitle, dbAuthor) {
  if (!vc) return { kashafId, title: dbTitle || '', author: dbAuthor || '', schema: 'missing', words: 0, pages: 0, units: 0 };

  // schema v2.1 (protocol_version: "2.1")
  if (vc.views || vc.facets || (vc.schema && vc.schema.protocol_version)) {
    const meta = vc.metadata || {};
    const stats = vc.stats || {};
    return {
      kashafId,
      schema: 'v2.1',
      title: dbTitle || meta.book_title || meta.title || '',
      author: dbAuthor || meta.book_author || meta.author || '',
      died: meta.author_died || meta.died || '',
      diedHijri: null,
      category: meta.category || '',
      words: stats.total_words || stats.words || 0,
      pages: stats.total_pages || stats.pages || 0,
      units: (vc.views?.units?.length) || stats.units || 0,
      resources: (vc.views?.resources?.length) || stats.resources || 0,
    };
  }

  // schema v1.0.0 (_meta + book + summary)
  const book = vc.book || {};
  const summary = vc.summary || {};
  
  return {
    kashafId,
    schema: 'v1',
    bookId: vc._meta?.book_id || '',
    title: dbTitle || book.title || '',
    author: dbAuthor || book.author || '',
    died: book.died_hijri ? `ت ${book.died_hijri}هـ` : '',
    diedHijri: book.died_hijri || null,
    category: book.category || '',
    words: summary.words_approx || 0,
    pages: summary.pages || 0,
    units: 0, // لا يوجد في schema v1
    resources: 0,
  };
}

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute('SELECT * FROM kashaf_viewcache ORDER BY id ASC');
conn.end();

console.log(`جلب ${rows.length} كشاف...`);
const results = [];

for (let i = 0; i < rows.length; i++) {
  const row = rows[i];
  process.stdout.write(`\r${i+1}/${rows.length}: ${row.kashafId}...`);
  const vc = await fetchViewCache(row.storageKey);
  const data = extractData(vc, row.kashafId, row.bookTitle, row.bookAuthor);
  results.push(data);
  await new Promise(r => setTimeout(r, 80));
}

console.log('\n\nانتهى!');
writeFileSync('/home/ubuntu/marqoom/etl/all_kashafat_full.json', JSON.stringify(results, null, 2));
console.log('تم الحفظ في all_kashafat_full.json\n');

// ملخص
results.forEach((d, i) => {
  const title = d.title || '???';
  const author = d.author || '???';
  const died = d.died || '';
  console.log(`${i+1}. [${d.kashafId}] "${title}" | ${author} ${died} | كلمات:${d.words?.toLocaleString()} صفحات:${d.pages} تصنيف:${d.category}`);
});
