import psycopg2, json, sys, requests

if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

conn = psycopg2.connect(host='localhost', port=5433, dbname='culinary_blog', user='postgres', password='postgres_dev_password')
cur = conn.cursor()

# 1. Check Categories table
cur.execute('SELECT "Id", "Name", "Slug" FROM "Categories";')
cats = cur.fetchall()
print(f"Total categories in DB: {len(cats)}")

for cid, cname, cslug in cats:
    cur.execute('SELECT count(*) FROM "Recipes" WHERE "CategoryId" = %s;', (cid,))
    rc = cur.fetchone()[0]
    if "gia" in cslug.lower() or rc > 0:
        print(f"  - [{cname}] (slug: {cslug}, id: {cid}): {rc} recipes in DB")

# 2. Check API /api/v1/categories
r = requests.get('http://localhost:5001/api/v1/categories')
print("\nAPI /api/v1/categories status:", r.status_code)
if r.status_code == 200:
    data = r.json()
    cats_api = data if isinstance(data, list) else data.get('data', data.get('items', []))
    for c in cats_api:
        if "gia" in c.get('slug', '').lower() or "gia cầm" in c.get('name', '').lower():
            print("  API category Gia cam:", c)

# 3. Check Redis cache
import redis
r_client = redis.Redis(host='localhost', port=6379, db=0)
keys = r_client.keys("*")
print(f"\nRedis keys count: {len(keys)}")
for k in keys[:10]:
    print("  Redis key:", k.decode('utf-8', errors='ignore'))
