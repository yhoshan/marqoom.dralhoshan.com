import { readFileSync } from 'fs';
const data = JSON.parse(readFileSync('/home/ubuntu/marqoom/etl/all_viewcaches_data.json', 'utf8'));
console.log('عدد الكشافات:', data.length);
console.log('آخر كشاف:', data[data.length-1]?.kashafId);
const noTitle = data.filter(d => !d.title && !d.dbTitle);
console.log('بدون عنوان:', noTitle.length, noTitle.map(d => d.kashafId).join(', '));
console.log('\n=== جميع الكشافات ===');
data.forEach((d, i) => {
  const title = d.dbTitle || d.title || '???';
  const author = d.dbAuthor || d.author || '???';
  console.log(`${i+1}. [${d.kashafId}] "${title}" | ${author} | كلمات:${d.words} صفحات:${d.pages} وحدات:${d.units}`);
});
