import { createConnection } from 'mysql2/promise';

async function main() {
  const db = await createConnection(process.env.DATABASE_URL as string);

  // فحص أعمدة الجدول
  const [cols] = await db.execute('DESCRIBE kashaf_viewcache') as any;
  const colNames: string[] = cols.map((c: any) => c.Field);
  console.log('=== COLUMNS ===', colNames.join(', '));

  // جلب جميع السجلات للبحث عن الرازي
  const [rows] = await db.execute(
    'SELECT * FROM kashaf_viewcache LIMIT 200'
  ) as any;

  // البحث عن الرازي
  const raziRow = rows.find((r: any) => {
    const vals = Object.values(r).join(' ');
    return vals.includes('رازي') || vals.includes('razi') || vals.includes('alrazi');
  });

  if (raziRow) {
    console.log('\n=== RAZI ROW (non-cache fields) ===');
    const { view_cache, ...meta } = raziRow as any;
    console.log(JSON.stringify(meta, null, 2));

    // تحليل view_cache
    const storageKey = raziRow.storage_key || raziRow.storageKey;
    console.log('\n=== STORAGE KEY ===', storageKey);

    if (storageKey) {
      const forgeUrl = (process.env.BUILT_IN_FORGE_API_URL as string).replace(/\/+$/, '');
      const forgeKey = process.env.BUILT_IN_FORGE_API_KEY as string;
      const presignUrl = `${forgeUrl}/v1/storage/presign/get?path=${encodeURIComponent(storageKey)}`;
      const presignResp = await fetch(presignUrl, { headers: { Authorization: `Bearer ${forgeKey}` } });
      const presignJson = await presignResp.json() as any;
      const signedUrl = presignJson.url;

      const jsonData = await fetch(signedUrl).then(r => r.json()) as any;

      // استخراج summary.purpose_distribution
      const summary = jsonData.summary;
      console.log('\n=== summary keys ===', summary ? Object.keys(summary) : 'NO SUMMARY');

      const purposeDist = summary?.purpose_distribution;
      console.log('\n=== purpose_distribution type ===', typeof purposeDist, Array.isArray(purposeDist) ? 'ARRAY len=' + purposeDist.length : 'NOT ARRAY');

      if (Array.isArray(purposeDist) && purposeDist.length > 0) {
        console.log('\n=== FIRST RECORD ===');
        console.log(JSON.stringify(purposeDist[0], null, 2));
        console.log('\n=== ALL KEYS ===', Object.keys(purposeDist[0]));
        console.log('\n=== RECORDS 1-3 ===');
        console.log(JSON.stringify(purposeDist.slice(0, 3), null, 2));
      } else {
        console.log('\n=== purpose_distribution raw ===');
        console.log(JSON.stringify(purposeDist, null, 2));
      }
    }
  } else {
    console.log('\n=== NO RAZI ROW FOUND ===');
    console.log('Available titles:', rows.slice(0, 10).map((r: any) => r.book_title || r.bookTitle || Object.values(r)[2]));
  }

  await db.end();
}

main().catch(console.error);
