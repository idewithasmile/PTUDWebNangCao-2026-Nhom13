import psycopg2, redis, requests, sys

if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

conn = psycopg2.connect(host='localhost', port=5433, dbname='culinary_blog', user='postgres', password='postgres_dev_password')
cur = conn.cursor()

# 1. Soft-delete or remove categories with 0 recipes
cur.execute('''
    DELETE FROM "Categories"
    WHERE "Id" NOT IN (SELECT DISTINCT "CategoryId" FROM "Recipes");
''')
deleted_count = cur.rowcount
conn.commit()
print(f"✓ Removed {deleted_count} empty categories with 0 recipes.")

# 2. Flush Redis
r = redis.Redis(host='localhost', port=6379, db=0)
r.flushall()
print("✓ Flushed Redis distributed cache.")

# 3. Verify via API
resp = requests.get('http://localhost:5001/api/v1/categories')
print(f"\n✓ API /api/v1/categories returned {len(resp.json())} clean categories:")
for c in resp.json():
    print(f"   [{c['name']}] (slug: {c['slug']}) -> {c['recipeCount']} recipes")
