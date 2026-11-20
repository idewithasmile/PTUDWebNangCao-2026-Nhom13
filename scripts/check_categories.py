import psycopg2, sys

if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

conn = psycopg2.connect(host='localhost', port=5433, dbname='culinary_blog', user='postgres', password='postgres_dev_password')
cur = conn.cursor()

cur.execute("""
    SELECT c."Id", c."Name", c."Slug", count(r."Id") as r_count
    FROM "Categories" c
    LEFT JOIN "Recipes" r ON r."CategoryId" = c."Id"
    GROUP BY c."Id", c."Name", c."Slug"
    ORDER BY r_count DESC, c."Name";
""")

rows = cur.fetchall()
active = [r for r in rows if r[3] > 0]
empty = [r for r in rows if r[3] == 0]

print(f"Categories with recipes ({len(active)}):")
for r in active:
    print(f"  ✓ [{r[1]}] (slug: {r[2]}): {r[3]} recipes")

print(f"\nUnused empty categories ({len(empty)}):")
for r in empty:
    print(f"  ✗ [{r[1]}] (slug: {r[2]}): {r[3]} recipes")
