import json

vc = json.load(open('/home/ubuntu/upload/مرقوم_تحليل_تفسير_الطبري_جامع_البيان_للطبري_view_cache.json'))

print("=== بنية الملف الجديد للطبري ===")
print("protocol_version:", vc.get('protocol_version'))
print("مفاتيح:", list(vc.keys()))

# sections
sections = vc.get('sections', [])
print(f"\nsections: {len(sections)} عنصر")
if sections:
    s = sections[0]
    print("مفاتيح section:", list(s.keys()))
    print("مثال:", json.dumps(s, ensure_ascii=False)[:400])

# resources
resources = vc.get('resources', {})
print(f"\nresources type: {type(resources)}")
if isinstance(resources, dict):
    print("مفاتيح resources:", list(resources.keys()))
    for k, v in resources.items():
        print(f"  {k}: {type(v)} - {str(v)[:100]}")
elif isinstance(resources, list) and resources:
    print("أول عنصر:", json.dumps(resources[0], ensure_ascii=False)[:300])

# terms
terms = vc.get('terms', {})
print(f"\nterms type: {type(terms)}")
if isinstance(terms, dict):
    print("مفاتيح terms:", list(terms.keys()))
    for k, v in list(terms.items())[:3]:
        print(f"  {k}: {str(v)[:100]}")
elif isinstance(terms, list) and terms:
    print("أول عنصر:", json.dumps(terms[0], ensure_ascii=False)[:300])

# summary
summary = vc.get('summary', {})
print(f"\nsummary مفاتيح:", list(summary.keys()))

# book
book = vc.get('book', {})
print(f"\nbook:", json.dumps(book, ensure_ascii=False)[:300])
