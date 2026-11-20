import io
import json
import random
import sys
import psycopg2
import requests
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

print("=" * 80)
print("🛡️ FORENSIC AUDITOR INDEPENDENT VERIFICATION")
print("=" * 80)

# 1. Connect to PostgreSQL directly
conn = psycopg2.connect(
    host="127.0.0.1",
    port=5433,
    dbname="culinary_blog",
    user="postgres",
    password="postgres_dev_password",
    connect_timeout=5
)
cur = conn.cursor()

# Check tables and counts
tables = ["Categories", "Recipes", "RecipeIngredients", "RecipeSteps", "RecipeImages", "AspNetUsers"]
counts = {}
for t in tables:
    cur.execute(f'SELECT count(*) FROM "{t}";')
    counts[t] = cur.fetchone()[0]
    print(f"  [DB Table] {t:<20}: {counts[t]} rows")

assert counts["Categories"] == 25, f"Categories count expected 25, got {counts['Categories']}"
assert counts["Recipes"] == 104, f"Recipes count expected 104, got {counts['Recipes']}"
assert counts["RecipeIngredients"] == 1115, f"Ingredients count expected 1115, got {counts['RecipeIngredients']}"
assert counts["RecipeSteps"] == 547, f"Steps count expected 547, got {counts['RecipeSteps']}"
assert counts["RecipeImages"] == 416, f"Images count expected 416, got {counts['RecipeImages']}"
assert counts["AspNetUsers"] >= 10, f"Users count expected >= 10, got {counts['AspNetUsers']}"

# Check for any bogus/lorem/placeholder text in Titles, Descriptions, Notes
cur.execute('''
    SELECT "Id", "Title", "Slug" FROM "Recipes" 
    WHERE "Title" ~* '(lorem|ipsum|bogus|faker|placeholder|dummy|test)'
       OR "Description" ~* '(lorem|ipsum|bogus|faker|placeholder|dummy)';
''')
bogus_rows = cur.fetchall()
print(f"\n  [DB Check] Bogus/Lorem/Fake recipes found: {len(bogus_rows)}")
assert len(bogus_rows) == 0, f"Found bogus recipes: {bogus_rows}"

# Inspect 5 random recipes from DB
cur.execute('''
    SELECT r."Id", r."Title", r."Slug", c."Name", u."UserName",
           count(DISTINCT i."Id") as ing_count,
           count(DISTINCT s."Id") as step_count,
           count(DISTINCT img."Id") as img_count
    FROM "Recipes" r
    JOIN "Categories" c ON r."CategoryId" = c."Id"
    JOIN "AspNetUsers" u ON r."AuthorId" = u."Id"
    LEFT JOIN "RecipeIngredients" i ON r."Id" = i."RecipeId"
    LEFT JOIN "RecipeSteps" s ON r."Id" = s."RecipeId"
    LEFT JOIN "RecipeImages" img ON r."Id" = img."RecipeId"
    GROUP BY r."Id", r."Title", r."Slug", c."Name", u."UserName"
    ORDER BY random()
    LIMIT 5;
''')
random_recipes = cur.fetchall()
print("\n  [DB Sample] 5 Random Recipes from PostgreSQL:")
for row in random_recipes:
    rid, title, slug, cat_name, author, n_ing, n_step, n_img = row
    print(f"   * [{cat_name}] '{title}' by @{author} -> {n_ing} ing, {n_step} steps, {n_img} images (Slug: {slug})")
    assert n_ing >= 10, f"Recipe {title} has < 10 ingredients"
    assert n_step >= 5, f"Recipe {title} has < 5 steps"
    assert n_img == 4, f"Recipe {title} has != 4 images"

# Check primary cover uniqueness in DB
cur.execute('''
    SELECT "OriginalUrl", count(*)
    FROM "RecipeImages"
    WHERE "IsPrimary" = true
    GROUP BY "OriginalUrl"
    HAVING count(*) > 1;
''')
dup_covers = cur.fetchall()
print(f"\n  [DB Check] Duplicate primary covers: {len(dup_covers)}")
assert len(dup_covers) == 0, f"Found duplicate primary covers: {dup_covers}"

# Check step imageUrl validity in DB
cur.execute('''
    SELECT count(*) FROM "RecipeSteps"
    WHERE "ImageUrl" IS NULL OR "ImageUrl" = '' OR "ImageUrl" NOT LIKE '/culinary-blog/recipes/%/steps/%.jpg';
''')
bad_steps = cur.fetchone()[0]
print(f"  [DB Check] Non-compliant step imageUrls: {bad_steps}")
assert bad_steps == 0, f"Found {bad_steps} non-compliant step imageUrls"

# 2. Independent MinIO Inspection
print("\n--- Independent MinIO Storage Inspection ---")
cur.execute('SELECT "ImageUrl" FROM "RecipeSteps" ORDER BY random() LIMIT 10;')
sample_step_urls = [r[0] for r in cur.fetchall()]

cur.execute('SELECT "OriginalUrl" FROM "RecipeImages" WHERE "IsPrimary" = true ORDER BY random() LIMIT 10;')
sample_cover_urls = [r[0] for r in cur.fetchall()]

test_urls = sample_cover_urls + sample_step_urls
minio_failures = 0
for u in test_urls:
    url = f"http://localhost:9000{u}"
    resp = requests.get(url, timeout=5)
    if resp.status_code != 200:
        print(f"  ✗ Failed MinIO URL {url}: HTTP {resp.status_code}")
        minio_failures += 1
        continue
    content = resp.content
    if not content.startswith(b"\xff\xd8\xff"):
        print(f"  ✗ Failed JPEG magic bytes {url}")
        minio_failures += 1
        continue
    img = Image.open(io.BytesIO(content))
    if img.size[0] < 400 or img.size[1] < 200:
        print(f"  ✗ Suspicious tiny image dimensions {img.size} for {url}")
        minio_failures += 1
        continue

print(f"  [MinIO Check] Audited {len(test_urls)} random images: {len(test_urls) - minio_failures} passed, {minio_failures} failed")
assert minio_failures == 0, "MinIO image validation failed"

# 3. Independent Backend API Inspection
print("\n--- Independent Backend API Inspection ---")
api_base = "http://localhost:5001/api/v1"

# Categories
res_cat = requests.get(f"{api_base}/categories", timeout=5)
assert res_cat.status_code == 200, f"Categories endpoint returned {res_cat.status_code}"
cats_data = res_cat.json()
print(f"  [API Check] GET /categories returned {len(cats_data)} categories")
assert len(cats_data) == 25

# Recipes pagination
res_rec = requests.get(f"{api_base}/recipes?page=1&pageSize=12", timeout=5)
assert res_rec.status_code == 200, f"Recipes endpoint returned {res_rec.status_code}"
rec_data = res_rec.json()
print(f"  [API Check] GET /recipes returned totalCount={rec_data['totalCount']}, pageSize={len(rec_data['items'])}")
assert rec_data['totalCount'] == 104
assert len(rec_data['items']) == 12

# Showcase recipe
res_pho = requests.get(f"{api_base}/recipes/pho-bo-tai-lan-chuan-vi-ha-thanh", timeout=5)
assert res_pho.status_code == 200, f"Showcase recipe returned {res_pho.status_code}"
pho_data = res_pho.json()
print(f"  [API Check] Showcase recipe title: '{pho_data['title']}' | Ingredients: {len(pho_data['ingredients'])} | Steps: {len(pho_data['steps'])} | Images: {len(pho_data['images'])}")
assert len(pho_data['ingredients']) == 13
assert len(pho_data['steps']) == 6
assert all(s.get('imageUrl') for s in pho_data['steps'])
assert len(pho_data['images']) == 4

print("\n" + "=" * 80)
print("🎉 ALL INDEPENDENT FORENSIC AUDITOR CHECKS PASSED (100% CLEAN)!")
print("=" * 80)
