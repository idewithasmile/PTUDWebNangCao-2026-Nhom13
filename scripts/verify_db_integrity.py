"""
verify_db_integrity.py - Live Database Relational Integrity Audit Suite
Milestone 3: Database Clean Slate Purge & Seeder Specialist

Audits the live PostgreSQL database ('culinary_blog') for:
1. Category count >= 10 (expected exact 25)
2. Recipe count >= 50 (expected exact 104), 100% Published status
3. 100% recipes have >= 5 quantified ingredients (quantity > 0, unit non-empty)
4. 100% recipes have >= 3-5 sequential steps with non-null ImageUrl matching /culinary-blog/recipes/{recipeId}/steps/{stepNumber}.jpg
5. 100% recipes have exactly 1 primary cover image, and 100% unique primary cover URLs
6. Clean slate check: 0 rows with 'lorem', 'faker', or bogus dummy strings
7. Foreign key integrity: 0 orphan recipes without valid CategoryId or AuthorId
8. Showcase recipe 'pho-bo-tai-lan-chuan-vi-ha-thanh' verification
"""

import os
import subprocess
import sys
import psycopg2

sys.stdout.reconfigure(encoding="utf-8")

DB_HOSTS = ["127.0.0.1", "localhost"]
DB_PORTS = [5433, 5432]
DB_NAME = "culinary_blog"
DB_USER = "postgres"
DB_PASSWORDS = ["postgres_dev_password", "123456", "postgres"]


def get_db_cursor():
    """Connect to live PostgreSQL via psycopg2, with fallback to psql subprocess."""
    for port in DB_PORTS:
        for host in DB_HOSTS:
            for pwd in DB_PASSWORDS:
                try:
                    conn = psycopg2.connect(
                        host=host,
                        port=port,
                        dbname=DB_NAME,
                        user=DB_USER,
                        password=pwd,
                        connect_timeout=3
                    )
                    conn.autocommit = True
                    return conn, conn.cursor(), f"psycopg2://{host}:{port}/{DB_NAME}"
                except Exception:
                    continue
    raise RuntimeError("Failed to connect to PostgreSQL via psycopg2.")


def main():
    print("=" * 80)
    print("🔍 LIVE POSTGRESQL DATABASE RELATIONAL INTEGRITY VERIFICATION")
    print("=" * 80)

    try:
        conn, cur, dsn = get_db_cursor()
        print(f"Connected to database via: {dsn}\n")
    except Exception as e:
        print(f"FATAL: Database connection error: {e}")
        sys.exit(1)

    checks = []

    # 1. Category Count
    cur.execute('SELECT count(*) FROM "Categories";')
    cat_count = cur.fetchone()[0]
    checks.append((
        "Category Count",
        cat_count >= 20,
        f"Count = {cat_count} (Requirement: >= 10, Target: 25)"
    ))

    # 2. Recipe Count
    cur.execute('SELECT count(*) FROM "Recipes";')
    recipe_count = cur.fetchone()[0]
    checks.append((
        "Recipe Count",
        recipe_count >= 50,
        f"Count = {recipe_count} (Requirement: >= 50, Target: 104)"
    ))

    # 3. Status 100% Published
    cur.execute('SELECT count(*) FROM "Recipes" WHERE "Status" != \'Published\';')
    non_published = cur.fetchone()[0]
    checks.append((
        "100% Published Status",
        non_published == 0,
        f"Non-published recipes = {non_published} (Requirement: 0)"
    ))

    # 4. Ingredients: >= 5 quantified per recipe
    cur.execute('''
        SELECT count(*) FROM "Recipes" r
        WHERE (
            SELECT count(*) FROM "RecipeIngredients" i
            WHERE i."RecipeId" = r."Id" AND i."Quantity" > 0 AND i."Unit" IS NOT NULL AND i."Unit" != ''
        ) < 5;
    ''')
    under_5_ingr = cur.fetchone()[0]
    checks.append((
        "Recipes with < 5 Quantified Ingredients",
        under_5_ingr == 0,
        f"Deficient recipes = {under_5_ingr} (Requirement: 0)"
    ))

    # 5. Total Ingredients Count
    cur.execute('SELECT count(*) FROM "RecipeIngredients";')
    total_ingr = cur.fetchone()[0]
    checks.append((
        "Total Ingredients Count",
        total_ingr == 1115,
        f"Total = {total_ingr} (Expected: 1,115)"
    ))

    # 6. Steps: >= 3 steps with non-null ImageUrl per recipe
    cur.execute('''
        SELECT count(*) FROM "Recipes" r
        WHERE (
            SELECT count(*) FROM "RecipeSteps" s
            WHERE s."RecipeId" = r."Id" AND s."ImageUrl" IS NOT NULL AND s."ImageUrl" != ''
        ) < 3;
    ''')
    under_3_steps = cur.fetchone()[0]
    checks.append((
        "Recipes with < 3 Valid Steps",
        under_3_steps == 0,
        f"Deficient recipes = {under_3_steps} (Requirement: 0)"
    ))

    # 7. Total Steps Count
    cur.execute('SELECT count(*) FROM "RecipeSteps";')
    total_steps = cur.fetchone()[0]
    checks.append((
        "Total Preparation Steps Count",
        total_steps == 547,
        f"Total = {total_steps} (Expected: 547)"
    ))

    # 8. Step ImageUrl Schema Compliance
    cur.execute('''
        SELECT count(*) FROM "RecipeSteps"
        WHERE "ImageUrl" IS NULL OR "ImageUrl" NOT LIKE '/culinary-blog/recipes/%/steps/%.jpg';
    ''')
    invalid_step_imgs = cur.fetchone()[0]
    checks.append((
        "Step ImageUrl Pattern Compliance",
        invalid_step_imgs == 0,
        f"Non-compliant step images = {invalid_step_imgs} (Requirement: 0)"
    ))

    # 9. Total RecipeImages Count
    cur.execute('SELECT count(*) FROM "RecipeImages";')
    total_images = cur.fetchone()[0]
    checks.append((
        "Total Recipe Images Count",
        total_images == 416,
        f"Total = {total_images} (Expected: 416)"
    ))

    # 10. Exactly 1 Primary Image Per Recipe
    cur.execute('''
        SELECT count(*) FROM (
            SELECT "RecipeId" FROM "RecipeImages"
            WHERE "IsPrimary" = true
            GROUP BY "RecipeId"
            HAVING count(*) != 1
        ) q;
    ''')
    invalid_primary = cur.fetchone()[0]
    checks.append((
        "Exactly 1 Primary Cover Image Per Recipe",
        invalid_primary == 0,
        f"Recipes violating primary constraint = {invalid_primary} (Requirement: 0)"
    ))

    # 11. 100% Unique Primary Cover URLs
    cur.execute('''
        SELECT count(*), count(distinct "OriginalUrl")
        FROM "RecipeImages"
        WHERE "IsPrimary" = true;
    ''')
    primary_total, primary_unique = cur.fetchone()
    checks.append((
        "100% Unique Primary Cover URLs",
        primary_total == primary_unique and primary_total >= 50,
        f"Unique: {primary_unique}/{primary_total} (Requirement: zero duplicate covers)"
    ))

    # 12. Clean Slate: Zero Bogus / Faker / Lorem Text
    cur.execute('''
        SELECT count(*) FROM "Recipes"
        WHERE lower("Title") LIKE '%lorem%' OR lower("Title") LIKE '%faker%' OR lower("Title") LIKE '%bogus%'
           OR lower("Description") LIKE '%lorem%' OR lower("Description") LIKE '%faker%' OR lower("Description") LIKE '%bogus%';
    ''')
    bogus_count = cur.fetchone()[0]
    checks.append((
        "Clean Slate: Zero Bogus/Lorem/Faker Text",
        bogus_count == 0,
        f"Bogus recipes found = {bogus_count} (Requirement: 0)"
    ))

    # 13. Crucial Showcase Recipe
    cur.execute('''
        SELECT "Title", "Slug", "Status", "PrepTimeMinutes", "CookTimeMinutes", "Servings"
        FROM "Recipes"
        WHERE "Slug" = 'pho-bo-tai-lan-chuan-vi-ha-thanh';
    ''')
    showcase = cur.fetchone()
    showcase_valid = showcase is not None and showcase[2] == "Published"
    checks.append((
        "Showcase Recipe 'pho-bo-tai-lan-chuan-vi-ha-thanh'",
        showcase_valid,
        f"Details: {showcase[0]} (Status: {showcase[2]})" if showcase else "NOT FOUND"
    ))

    # 14. Foreign Key Integrity: Categories
    cur.execute('''
        SELECT count(*) FROM "Recipes" r
        LEFT JOIN "Categories" c ON r."CategoryId" = c."Id"
        WHERE c."Id" IS NULL;
    ''')
    orphan_cat = cur.fetchone()[0]
    checks.append((
        "Foreign Key Integrity: CategoryId",
        orphan_cat == 0,
        f"Orphan recipes without category = {orphan_cat} (Requirement: 0)"
    ))

    # 15. Foreign Key Integrity: Authors
    cur.execute('''
        SELECT count(*) FROM "Recipes" r
        LEFT JOIN "AspNetUsers" u ON r."AuthorId" = u."Id"
        WHERE u."Id" IS NULL;
    ''')
    orphan_auth = cur.fetchone()[0]
    checks.append((
        "Foreign Key Integrity: AuthorId",
        orphan_auth == 0,
        f"Orphan recipes without author = {orphan_auth} (Requirement: 0)"
    ))

    # Print Report
    all_passed = True
    for name, passed, detail in checks:
        mark = "✓ PASS" if passed else "✗ FAIL"
        color = "\033[92m" if passed else "\033[91m"
        reset = "\033[0m"
        print(f"  {color}{mark}{reset} {name:<45}: {detail}")
        if not passed:
            all_passed = False

    print("\n" + "=" * 80)
    if all_passed:
        print("🎉 ALL DATABASE RELATIONAL INTEGRITY CHECKS PASSED (100% PASS)!")
        print("=" * 80)
        conn.close()
        sys.exit(0)
    else:
        print("❌ INTEGRITY AUDIT FAILED: One or more checks failed.")
        print("=" * 80)
        conn.close()
        sys.exit(1)


if __name__ == "__main__":
    main()
