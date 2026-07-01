/**
 * توليد كود KASHAFAT لـ Home.tsx من البيانات المستخرجة
 * يضيف الكشافات من 12 إلى 84 (الكشاف 85 موجود بالفعل)
 * ويربط IDs الكشافات 1-11 القديمة بالـ kashafId الصحيح
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(path.resolve(__dirname, 'all_kashafat_full.json'), 'utf8'));

// خريطة تصنيفات
const categoryMap = {
  'حديث': 'حديث',
  'فقه': 'فقه',
  'تفسير': 'تفسير',
  'عقيدة': 'عقيدة',
  'تاريخ': 'تاريخ',
  'لغة': 'لغة',
  'قراءات': 'قراءات',
  'أصول': 'أصول',
  'سيرة': 'سيرة',
  '': 'أخرى',
};

// خريطة categoryLabel
const categoryLabelMap = {
  'حديث': 'الحديث وعلومه',
  'فقه': 'الفقه المقارن',
  'تفسير': 'التفسير',
  'عقيدة': 'العقيدة والأصول',
  'تاريخ': 'التاريخ والتراجم',
  'لغة': 'اللغة والبلاغة',
  'قراءات': 'القراءات',
  'أصول': 'أصول الفقه',
  'سيرة': 'السيرة النبوية',
  'أخرى': 'أخرى',
};

// خريطة الكشافات 1-11 (IDs القديمة → بيانات الواجهة الحالية)
const oldKashafMap = {
  'fathalbaari': { num: 1, url: 'https://marqoom1.dralhoshan.com', xlsxUrl: '/manus-storage/fathalbaari_941b6fe4.xlsx', docxUrl: '/manus-storage/fathalbaari_b996ac19.docx' },
  'ibnabdulbar': { num: 2, url: 'https://marqoom2.dralhoshan.com', xlsxUrl: '/manus-storage/ibnabdulbar_6a68a5e1.xlsx', docxUrl: '/manus-storage/ibnabdulbar_c6225243.docx' },
  'ibntimiah': { num: 3, url: 'https://marqoom3.dralhoshan.com', xlsxUrl: '/manus-storage/ibntimiah_76aba10d.xlsx', docxUrl: '/manus-storage/ibntimiah_f0915251.docx' },
  'alrazi': { num: 4, url: 'https://marqoom4.dralhoshan.com', xlsxUrl: '/manus-storage/alrazi_235e5b5f.xlsx', docxUrl: '/manus-storage/alrazi_847cb397.docx' },
  'alqurtubi': { num: 5, url: 'https://marqoom5.dralhoshan.com', xlsxUrl: '/manus-storage/alqurtubi_8166b591.xlsx', docxUrl: '/manus-storage/alqurtubi_91c92062.docx' },
  'altabari': { num: 6, url: 'https://marqoom6.dralhoshan.com', xlsxUrl: '/manus-storage/altabari_b5a853f1.xlsx', docxUrl: '/manus-storage/altabari_aebfc1ae.docx' },
  'annawawe': { num: 7, url: 'https://marqoom7.dralhoshan.com', xlsxUrl: '/manus-storage/annawawe_1cadb86b.xlsx', docxUrl: '/manus-storage/annawawe_d9bef041.docx' },
  'almuhalla': { num: 8, url: 'https://marqoom8.dralhoshan.com', xlsxUrl: '/manus-storage/almuhalla_c65c1027.xlsx', docxUrl: '/manus-storage/almuhalla_63eccc4a.docx' },
  'almughni': { num: 9, url: 'https://marqoom9.dralhoshan.com', xlsxUrl: '/manus-storage/almughni_32baf018.xlsx', docxUrl: '/manus-storage/almughni_46f85955.docx' },
  'albadaei': { num: 10, url: 'https://marqoom10.dralhoshan.com', xlsxUrl: '/manus-storage/albadaei_d6c19af7.xlsx', docxUrl: '/manus-storage/albadaei_edee1f00.docx' },
  'ibnalqayyim': { num: 11, url: 'https://marqoom11.dralhoshan.com', xlsxUrl: '/manus-storage/ibnalqayyim_e5c84b55.xlsx', docxUrl: '/manus-storage/ibnalqayyim_da87858a.docx' },
};

// تنظيف عنوان الكشاف (إزالة "كشّاف " من البداية)
function cleanTitle(title) {
  return title.replace(/^كشّاف\s+/, '').replace(/^كشاف\s+/, '');
}

// تنسيق الأرقام
function formatNum(n) {
  if (!n || n === 0) return null;
  if (n >= 1000000) return `${(n/1000000).toFixed(1)}م`;
  if (n >= 1000) return n.toLocaleString('en');
  return String(n);
}

// توليد stats من البيانات المتاحة
function makeStats(d) {
  const stats = [];
  if (d.words && d.words > 0) stats.push({ label: 'كلمة', value: formatNum(d.words) });
  if (d.pages && d.pages > 0) stats.push({ label: 'صفحة', value: formatNum(d.pages) });
  if (d.units && d.units > 0) stats.push({ label: 'وحدة', value: formatNum(d.units) });
  if (d.resources && d.resources > 0) stats.push({ label: 'مورد', value: formatNum(d.resources) });
  // إذا لا توجد إحصائيات كافية
  while (stats.length < 2) stats.push({ label: 'مصدر', value: 'متاح' });
  return stats.slice(0, 4);
}

// توليد كود كشاف واحد
function genKashaf(d, num) {
  const cat = d.category || 'أخرى';
  const catLabel = categoryLabelMap[cat] || 'أخرى';
  const title = cleanTitle(d.title || d.kashafId);
  const author = d.author || '';
  const died = d.died || '';
  const stats = makeStats(d);
  const statsStr = stats.map(s => `      { label: "${s.label}", value: "${s.value}" }`).join(',\n');
  
  return `  {
    id: "${d.kashafId}",
    num: ${num},
    title: "${title}",
    author: "${author}",
    death: "${died}",
    category: "${cat}",
    categoryLabel: "${catLabel}",
    description: "",
    stats: [
${statsStr}
    ],
    tag: "${catLabel}",
    url: "",
    xlsxUrl: "",
    docxUrl: "",
  }`;
}

// الكشافات 1-11 (القديمة) - نحتاج تحديث kashafId فيها
const old11 = data.filter(d => oldKashafMap[d.kashafId]);
console.log(`\nالكشافات 1-11 (القديمة): ${old11.length}`);
old11.forEach(d => {
  const info = oldKashafMap[d.kashafId];
  console.log(`  ${info.num}. [${d.kashafId}] "${d.title}" | ${d.author} ${d.died} | كلمات:${d.words?.toLocaleString()}`);
});

// الكشافات 12-84 (الجديدة غير الموجودة في الواجهة)
const newKashafat = data.filter(d => {
  // استبعاد الـ 11 الأولى والكشاف 85
  return !oldKashafMap[d.kashafId] && d.kashafId !== 'marqoom85_bayan_tabyin' && d.kashafId !== 'bahr_muhit_zarkashi';
});

console.log(`\nالكشافات الجديدة (12-84): ${newKashafat.length}`);

// ترتيب الكشافات الجديدة حسب رقمها
newKashafat.sort((a, b) => {
  const numA = parseInt(a.kashafId.match(/marqoom(\d+)/)?.[1] || '999');
  const numB = parseInt(b.kashafId.match(/marqoom(\d+)/)?.[1] || '999');
  return numA - numB;
});

// توليد الكود
let code = '';
let num = 12;
for (const d of newKashafat) {
  code += genKashaf(d, num) + ',\n';
  num++;
}

// إضافة الكشاف 61 (bahr_muhit_zarkashi) في مكانه
const zarkashi = data.find(d => d.kashafId === 'bahr_muhit_zarkashi');
if (zarkashi) {
  console.log(`\nالزركشي: "${zarkashi.title}" | ${zarkashi.author} ${zarkashi.died}`);
}

writeFileSync(path.resolve(__dirname, 'new_kashafat_code.txt'), code);
console.log(`\nتم توليد كود ${num-12} كشاف جديد في new_kashafat_code.txt`);

// طباعة الكشافات الجديدة بالترتيب
newKashafat.forEach((d, i) => {
  console.log(`${i+12}. [${d.kashafId}] "${d.title}" | ${d.author} ${d.died} | تصنيف:${d.category}`);
});
