#!/usr/bin/env python3
"""
Gap Report: مقارنة الحزمة الحديثة مع قاعدة البيانات والواجهة
"""
import json, os, re

BATCH_DIR = "/home/ubuntu/upload/batch2"
HOME_TSX = "/home/ubuntu/marqoom/client/src/pages/Home.tsx"
PHASE1_JSON = "/tmp/audit_phase1.json"  # نتائج audit المرحلة الأولى

# ─── 1. استخراج الكشافات من الحزمة ───────────────────────────────────────────
files = os.listdir(BATCH_DIR)
batch_books = {}
for f in files:
    base = f.replace("مرقوم_تحليل_", "")
    if base.endswith("_view_cache.json"):
        name = base.replace("_view_cache.json", "")
        batch_books.setdefault(name, {})["view_cache"] = os.path.join(BATCH_DIR, f)
    elif base.endswith("_validation_report.json"):
        name = base.replace("_validation_report.json", "")
        batch_books.setdefault(name, {})["validation"] = os.path.join(BATCH_DIR, f)
    elif base.endswith(".xlsx"):
        name = base.replace(".xlsx", "")
        batch_books.setdefault(name, {})["excel"] = os.path.join(BATCH_DIR, f)

print(f"كشافات الحزمة: {len(batch_books)}")
for b in sorted(batch_books.keys()):
    files_present = [k for k in ['view_cache','validation','excel'] if k in batch_books[b]]
    print(f"  {b}: {files_present}")
