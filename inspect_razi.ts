import { createConnection } from 'mysql2/promise';
import * as https from 'https';
import * as http from 'http';

async function fetchUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  const db = await createConnection(process.env.DATABASE_URL!);

  // جلب storageKey للرازي
  const [rows] = await db.execute(
    "SELECT id, book_id, book_title, storage_key, schema_version FROM kashaf_viewcache WHERE book_id LIKE '%razi%' OR book_title LIKE '%رازي%' LIMIT 5"
  ) as any;

  console.log('=== STORAGE KEYS ===');
  console.log(JSON.stringify(rows, null, 2));

  if (rows.length > 0) {
    const storageKey = rows[0].storage_key;
    console.log('\n=== FETCHING VIEW_CACHE ===');
    console.log('Key:', storageKey);

    // جلب presigned URL من forge API
    const forgeUrl = process.env.BUILT_IN_FORGE_API_URL!.replace(/\/+$/, '');
    const forgeKey = process.env.BUILT_IN_FORGE_API_KEY!;

    const presignUrl = `${forgeUrl}/v1/storage/presign/get?path=${encodeURIComponent(storageKey)}`;
    const presignResp = await fetch(presignUrl, {
      headers: { Authorization: `Bearer ${forgeKey}` }
    });
    const { url } = await presignResp.json() as { url: string };
    
    const jsonData = await fetch(url).then(r => r.json()) as Record<string, unknown>;
    
    // استخراج purpose_distribution
    const summary = jsonData.summary as Record<string, unknown> | undefined;
    const purposeDist = summary?.purpose_distribution;
    
    console.log('\n=== summary keys ===');
    console.log(Object.keys(summary || {}));
    
    console.log('\n=== purpose_distribution type ===');
    console.log(typeof purposeDist, Array.isArray(purposeDist) ? 'ARRAY len=' + (purposeDist as unknown[]).length : 'NOT ARRAY');
    
    if (Array.isArray(purposeDist) && purposeDist.length > 0) {
      console.log('\n=== FIRST RECORD (purpose_distribution[0]) ===');
      console.log(JSON.stringify(purposeDist[0], null, 2));
      console.log('\n=== ALL KEYS in first record ===');
      console.log(Object.keys(purposeDist[0] as object));
    } else {
      console.log('\n=== purpose_distribution raw ===');
      console.log(JSON.stringify(purposeDist, null, 2));
    }
  }

  await db.end();
}

main().catch(console.error);
