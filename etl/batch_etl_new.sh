#!/bin/bash
# Batch ETL for 11 new kashafat
# Run from /home/ubuntu/marqoom directory

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INPUT_DIR="/home/ubuntu/new_kashafat"
OUTPUT_DIR="$SCRIPT_DIR/output"

echo "=== Starting Batch ETL for 11 new kashafat ==="

run_etl() {
  local file="$1"
  local book_id="$2"
  local title="$3"
  local author="$4"
  local died_hijri="$5"
  local category="$6"
  local out_dir="$OUTPUT_DIR/${book_id}"
  
  mkdir -p "$out_dir"
  echo "Processing: $title ($book_id)..."
  python3 "$SCRIPT_DIR/marqoom_etl.py" \
    "$file" \
    --book-id "$book_id" \
    --title "$title" \
    --author "$author" \
    --died-hijri "$died_hijri" \
    --category "$category" \
    --output-dir "$out_dir" \
    && echo "  ✓ Done: $book_id" \
    || echo "  ✗ FAILED: $book_id"
}

# 1. الجامع لعلوم الإمام أحمد
run_etl "$INPUT_DIR/مرقوم_الجامع_لعلوم_الإمام_أحمد_بالأرقام.xlsx" \
  "marqoom71_jamia_ulum_ahmad" \
  "كشّاف الجامع لعلوم الإمام أحمد" \
  "جمع وإعداد" \
  "" \
  "حديث"

# 2. الدرر السنية
run_etl "$INPUT_DIR/مرقوم_الدرر_السنية_بالأرقام.xlsx" \
  "marqoom72_durar_saniyya" \
  "كشّاف الدرر السنية" \
  "جمع وإعداد" \
  "" \
  "عقيدة"

# 3. البحر الرائق لابن نجيم
run_etl "$INPUT_DIR/مرقوم_الكشاف_المنهجي_البحر_الرائق_بالأرقام.xlsx" \
  "marqoom73_bahr_raiq" \
  "كشّاف البحر الرائق لابن نجيم" \
  "ابن نجيم المصري" \
  "970" \
  "فقه"

# 4. الحاوي الكبير للماوردي
run_etl "$INPUT_DIR/مرقوم_الكشاف_المنهجي_الحاوي_الكبير_الماوردي.xlsx" \
  "marqoom74_hawi_kabir" \
  "كشّاف الحاوي الكبير للماوردي" \
  "أبو الحسن الماوردي" \
  "450" \
  "فقه"

# 5. مجموع فتاوى ابن تيمية مع المستدرك
run_etl "$INPUT_DIR/مرقوم_الكشاف_المنهجي_الرقمي_مجموع_فتاوى_ابن_تيمية_مع_المستدرك_بالأرقام.xlsx" \
  "marqoom75_majmoo_fatawa" \
  "كشّاف مجموع فتاوى ابن تيمية مع المستدرك" \
  "شيخ الإسلام ابن تيمية" \
  "728" \
  "عقيدة"

# 6. مجموعة الرسائل والمسائل النجدية
run_etl "$INPUT_DIR/مرقوم_الكشاف_المنهجي_مجموعة_الرسائل_والمسائل_النجدية_بالأرقام.xlsx" \
  "marqoom76_rasail_masail_najdiyya" \
  "كشّاف مجموعة الرسائل والمسائل النجدية" \
  "علماء نجد" \
  "" \
  "عقيدة"

# 7. تاريخ الإسلام للذهبي
run_etl "$INPUT_DIR/مرقوم_تاريخ_الإسلام_للذهبي_الكشاف_التفصيلي.xlsx" \
  "marqoom77_tarikh_islam_dhahabi" \
  "كشّاف تاريخ الإسلام للذهبي" \
  "شمس الدين الذهبي" \
  "748" \
  "تاريخ"

# 8. درء تعارض العقل والنقل
run_etl "$INPUT_DIR/مرقوم_درء_تعارض_العقل_والنقل_بالأرقام.xlsx" \
  "marqoom78_dara_taarus" \
  "كشّاف درء تعارض العقل والنقل" \
  "شيخ الإسلام ابن تيمية" \
  "728" \
  "عقيدة"

# 9. فتح القدير لابن الهمام
run_etl "$INPUT_DIR/مرقوم_فتح_القدير_لابن_الهمام_الكشاف_المنهجي_الرقمي.xlsx" \
  "marqoom79_fath_qadir_ibnahummam" \
  "كشّاف فتح القدير لابن الهمام" \
  "كمال الدين ابن الهمام" \
  "861" \
  "فقه"

# 10. البيان للعمراني
run_etl "$INPUT_DIR/مرقوم_كشاف_البيان_للعمراني_تحليل_تفصيلي.xlsx" \
  "marqoom80_bayan_umrani" \
  "كشّاف البيان في مذهب الإمام الشافعي للعمراني" \
  "أبو الحسين يحيى العمراني" \
  "558" \
  "فقه"

# 11. الذخيرة للقرافي
run_etl "$INPUT_DIR/مرقوم_كشاف_الذخيرة_للقرافي_بالأرقام.xlsx" \
  "marqoom81_dhakhira_qarafi" \
  "كشّاف الذخيرة للقرافي" \
  "شهاب الدين القرافي" \
  "684" \
  "فقه"

echo ""
echo "=== Batch ETL Complete ==="
echo "Output directories:"
ls "$OUTPUT_DIR" | grep "marqoom7[1-9]\|marqoom8[01]" | sort
