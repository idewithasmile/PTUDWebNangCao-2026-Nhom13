"""
challenger_stress_test.py - Empirical Challenger Stress Test Suite
Author: Challenger 1 (Empirical Challenger Agent)

Adversarial testing against:
1. Live PostgreSQL Database (localhost:5433 / culinary_postgres container)
   - Foreign key integrity (AuthorId in AspNetUsers, CategoryId in Categories, child orphaned records)
   - Uniqueness (Titles, Slugs, Category Names/Slugs)
   - String integrity & encoding (control characters, null bytes, mojibake, leading/trailing whitespace, slug regex)
   - Nutrition validation (100% positive, non-null, realistic bounds)
   - Child entity invariants (>= 10 ingredients, >= 5 steps, 3-5 images, exactly 1 primary, sequential step numbers)
2. Live Backend API Endpoints (http://localhost:5001/api/v1)
   - Pagination boundary checks (page=9&pageSize=12, out of bounds page=10, zero page=0, negative page=-5, pageSize=0, pageSize=150)
   - Difficulty filtering (difficulty=1, 2, 3 sum=104; difficulty=4 edge case returns totalCount=0; invalid difficulty 99)
   - Search edge cases (searchTerm=nonexistent_xyz, SQL injection string, XSS string, FTS endpoint, <2 chars 422 check)
   - Detail endpoint edge cases (valid slug, 404 slug, path traversal)
   - Category filtering (valid category, empty category GUID)
"""

import json
import re
import subprocess
import sys
import time
from typing import Any, Dict, List, Tuple
import requests

sys.stdout.reconfigure(encoding='utf-8')

API_BASE = "http://localhost:5001/api/v1"


class ChallengerReport:
    def __init__(self):
        self.results: List[Dict[str, Any]] = []

    def record(self, group: str, test_id: str, title: str, passed: bool, detail: str):
        self.results.append({
            "group": group,
            "test_id": test_id,
            "title": title,
            "passed": passed,
            "detail": detail
        })
        mark = "✓ PASS" if passed else "✗ FAIL"
        color = "\033[92m" if passed else "\033[91m"
        reset = "\033[0m"
        print(f"  {color}{mark}{reset} [{group}] {test_id} - {title}: {detail}")

    def all_passed(self) -> bool:
        return all(r["passed"] for r in self.results)

    def summary(self):
        total = len(self.results)
        passed = sum(1 for r in self.results if r["passed"])
        failed = total - passed
        print("\n" + "=" * 80)
        print("⚔️  CHALLENGER 1 ADVERSARIAL STRESS TEST SUMMARY")
        print("=" * 80)
        groups = {}
        for r in self.results:
            groups.setdefault(r["group"], []).append(r)

        for g, items in groups.items():
            g_pass = sum(1 for i in items if i["passed"])
            g_total = len(items)
            pct = (g_pass / g_total * 100) if g_total > 0 else 0
            print(f"• {g:<35}: {g_pass}/{g_total} passed ({pct:.1f}%)")

        print("-" * 80)
        overall_pct = (passed / total * 100) if total > 0 else 0
        print(f"Overall Result: {passed}/{total} tests passed ({overall_pct:.1f}%)")
        if self.all_passed():
            print("\033[92m🏆 VERDICT: APPROVE - All adversarial challenges survived!\033[0m")
        else:
            print("\033[91m💥 VERDICT: CHALLENGE_FAILED - Vulnerabilities or bugs discovered!\033[0m")
        print("=" * 80)


def psql(sql: str) -> str:
    cmd = [
        "docker", "exec", "-i", "culinary_postgres",
        "psql", "-U", "postgres", "-d", "culinary_blog", "-t", "-A", "-c", sql
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    if res.returncode != 0:
        raise RuntimeError(f"psql error: {res.stderr.strip()}")
    return res.stdout.strip()


def psql_lines(sql: str) -> List[str]:
    raw = psql(sql)
    return [line.strip() for line in raw.splitlines() if line.strip()]


def run_database_adversarial_suite(report: ChallengerReport):
    print("\n" + "=" * 80)
    print("🔬 [PHASE 1] Live PostgreSQL Adversarial & Forensic Database Checks")
    print("=" * 80)

    # 1.1 Author Foreign Key Integrity
    try:
        orphaned_authors = psql('SELECT count(*) FROM "Recipes" r LEFT JOIN "AspNetUsers" u ON r."AuthorId" = u."Id" WHERE u."Id" IS NULL;')
        cnt = int(orphaned_authors)
        report.record("Database Integrity", "DB-FK-01", "Recipe Author Foreign Key",
                      cnt == 0, f"Found {cnt} recipes with invalid/missing AuthorId (expected 0)")
    except Exception as e:
        report.record("Database Integrity", "DB-FK-01", "Recipe Author Foreign Key", False, str(e))

    # 1.2 Active Author Check
    try:
        inactive_authors = psql('SELECT count(*) FROM "Recipes" r JOIN "AspNetUsers" u ON r."AuthorId" = u."Id" WHERE u."IsActive" = false;')
        cnt = int(inactive_authors)
        report.record("Database Integrity", "DB-FK-02", "Author IsActive Status",
                      cnt == 0, f"Found {cnt} recipes authored by inactive users (expected 0)")
    except Exception as e:
        report.record("Database Integrity", "DB-FK-02", "Author IsActive Status", False, str(e))

    # 1.3 Category Foreign Key Integrity
    try:
        orphaned_cats = psql('SELECT count(*) FROM "Recipes" r LEFT JOIN "Categories" c ON r."CategoryId" = c."Id" WHERE c."Id" IS NULL;')
        cnt = int(orphaned_cats)
        report.record("Database Integrity", "DB-FK-03", "Recipe Category Foreign Key",
                      cnt == 0, f"Found {cnt} recipes with invalid/missing CategoryId (expected 0)")
    except Exception as e:
        report.record("Database Integrity", "DB-FK-03", "Recipe Category Foreign Key", False, str(e))

    # 1.4 Soft-Deleted Category Check
    try:
        deleted_cats = psql('SELECT count(*) FROM "Recipes" r JOIN "Categories" c ON r."CategoryId" = c."Id" WHERE c."IsDeleted" = true;')
        cnt = int(deleted_cats)
        report.record("Database Integrity", "DB-FK-04", "Recipe Non-Deleted Category",
                      cnt == 0, f"Found {cnt} recipes assigned to soft-deleted categories (expected 0)")
    except Exception as e:
        report.record("Database Integrity", "DB-FK-04", "Recipe Non-Deleted Category", False, str(e))

    # 1.5 Orphaned Child Records Check
    try:
        orphaned_ing = int(psql('SELECT count(*) FROM "RecipeIngredients" i LEFT JOIN "Recipes" r ON i."RecipeId" = r."Id" WHERE r."Id" IS NULL;'))
        orphaned_stp = int(psql('SELECT count(*) FROM "RecipeSteps" s LEFT JOIN "Recipes" r ON s."RecipeId" = r."Id" WHERE r."Id" IS NULL;'))
        orphaned_img = int(psql('SELECT count(*) FROM "RecipeImages" m LEFT JOIN "Recipes" r ON m."RecipeId" = r."Id" WHERE r."Id" IS NULL;'))
        orphaned_total = orphaned_ing + orphaned_stp + orphaned_img
        report.record("Database Integrity", "DB-FK-05", "No Orphaned Child Entities",
                      orphaned_total == 0, f"Orphaned: {orphaned_ing} ingredients, {orphaned_stp} steps, {orphaned_img} images")
    except Exception as e:
        report.record("Database Integrity", "DB-FK-05", "No Orphaned Child Entities", False, str(e))

    # 2.1 Duplicate Recipe Titles
    try:
        dup_titles = psql('SELECT count(*) FROM (SELECT lower("Title") FROM "Recipes" GROUP BY lower("Title") HAVING count(*) > 1) q;')
        cnt = int(dup_titles)
        report.record("Data Uniqueness", "DB-UQ-01", "Recipe Title Uniqueness",
                      cnt == 0, f"Found {cnt} duplicate recipe titles (case-insensitive)")
    except Exception as e:
        report.record("Data Uniqueness", "DB-UQ-01", "Recipe Title Uniqueness", False, str(e))

    # 2.2 Duplicate Recipe Slugs
    try:
        dup_slugs = psql('SELECT count(*) FROM (SELECT "Slug" FROM "Recipes" GROUP BY "Slug" HAVING count(*) > 1) q;')
        cnt = int(dup_slugs)
        report.record("Data Uniqueness", "DB-UQ-02", "Recipe Slug Uniqueness",
                      cnt == 0, f"Found {cnt} duplicate recipe slugs")
    except Exception as e:
        report.record("Data Uniqueness", "DB-UQ-02", "Recipe Slug Uniqueness", False, str(e))

    # 2.3 Duplicate Category Names and Slugs
    try:
        dup_cat_names = int(psql('SELECT count(*) FROM (SELECT lower("Name") FROM "Categories" GROUP BY lower("Name") HAVING count(*) > 1) q;'))
        dup_cat_slugs = int(psql('SELECT count(*) FROM (SELECT "Slug" FROM "Categories" GROUP BY "Slug" HAVING count(*) > 1) q;'))
        report.record("Data Uniqueness", "DB-UQ-03", "Category Name & Slug Uniqueness",
                      dup_cat_names == 0 and dup_cat_slugs == 0,
                      f"Found {dup_cat_names} duplicate category names, {dup_cat_slugs} duplicate slugs")
    except Exception as e:
        report.record("Data Uniqueness", "DB-UQ-03", "Category Name & Slug Uniqueness", False, str(e))

    # 3.1 String Corruption & Whitespace Checks
    try:
        bad_whitespace = psql('SELECT count(*) FROM "Recipes" WHERE "Title" != trim("Title") OR "Slug" != trim("Slug");')
        cnt = int(bad_whitespace)
        report.record("String Integrity", "DB-STR-01", "No Leading/Trailing Whitespace in Recipes",
                      cnt == 0, f"Found {cnt} recipes with leading/trailing whitespace in Title/Slug")
    except Exception as e:
        report.record("String Integrity", "DB-STR-01", "No Leading/Trailing Whitespace in Recipes", False, str(e))

    # 3.2 Recipe Slug Format Regex
    try:
        recipe_slugs = psql_lines('SELECT "Slug" FROM "Recipes";')
        slug_pattern = re.compile(r'^[a-z0-9]+(-[a-z0-9]+)*$')
        invalid_slugs = [s for s in recipe_slugs if not slug_pattern.match(s)]
        report.record("String Integrity", "DB-STR-02", "Recipe Slug Regex Conformance",
                      len(invalid_slugs) == 0,
                      f"Audited {len(recipe_slugs)} slugs: {len(invalid_slugs)} invalid ({invalid_slugs[:2] if invalid_slugs else 'none'})")
    except Exception as e:
        report.record("String Integrity", "DB-STR-02", "Recipe Slug Regex Conformance", False, str(e))

    # 3.3 Control Characters and Null Bytes Probe
    try:
        control_chars = psql(r"""SELECT count(*) FROM "Recipes" WHERE "Title" ~ '[\x00-\x08\x0B\x0C\x0E-\x1F]' OR "Description" ~ '[\x00-\x08\x0B\x0C\x0E-\x1F]';""")
        cnt = int(control_chars)
        report.record("String Integrity", "DB-STR-03", "No Control Characters / Null Bytes",
                      cnt == 0, f"Found {cnt} recipes with illegal control characters")
    except Exception as e:
        report.record("String Integrity", "DB-STR-03", "No Control Characters / Null Bytes", False, str(e))

    # 3.4 Mojibake / Double UTF-8 Encoding Probe across Recipes, Categories, Ingredients, Steps
    try:
        mojibake_pattern = re.compile(r'(Ã[¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿]|áº[¡-¿]|á»[¡-¿]|Ã\s|Ã©|Ã\xa0)')
        r_titles = psql_lines('SELECT "Title" || \' \' || "Description" FROM "Recipes";')
        c_names = psql_lines('SELECT "Name" || \' \' || "Description" FROM "Categories";')
        i_names = psql_lines('SELECT "Name" || \' \' || coalesce("Notes", \'\') FROM "RecipeIngredients";')
        s_titles = psql_lines('SELECT "Title" || \' \' || "Description" FROM "RecipeSteps";')

        total_checked = len(r_titles) + len(c_names) + len(i_names) + len(s_titles)
        bad_r = [s for s in r_titles if mojibake_pattern.search(s)]
        bad_c = [s for s in c_names if mojibake_pattern.search(s)]
        bad_i = [s for s in i_names if mojibake_pattern.search(s)]
        bad_s = [s for s in s_titles if mojibake_pattern.search(s)]
        bad_total = len(bad_r) + len(bad_c) + len(bad_i) + len(bad_s)

        report.record("String Integrity", "DB-STR-04", "No Double-Encoded UTF-8 / Mojibake",
                      bad_total == 0, f"Audited {total_checked} strings across 4 tables, found {bad_total} mojibake artifacts")
    except Exception as e:
        report.record("String Integrity", "DB-STR-04", "No Double-Encoded UTF-8 / Mojibake", False, str(e))

    # 4.1 Nutrition 100% Non-Null and Positive
    try:
        bad_nutrition = psql("""
            SELECT count(*) FROM "Recipes" 
            WHERE "Nutrition_Calories" IS NULL OR "Nutrition_Calories" <= 0
               OR "Nutrition_Protein" IS NULL OR "Nutrition_Protein" <= 0
               OR "Nutrition_Fat" IS NULL OR "Nutrition_Fat" <= 0
               OR "Nutrition_Carbohydrates" IS NULL OR "Nutrition_Carbohydrates" <= 0;
        """)
        cnt = int(bad_nutrition)
        report.record("Nutrition Verification", "DB-NUT-01", "100% Positive Core Nutrition (Cal/Prot/Fat/Carb)",
                      cnt == 0, f"Found {cnt} recipes with null, zero, or negative core nutrition values (expected 0)")
    except Exception as e:
        report.record("Nutrition Verification", "DB-NUT-01", "100% Positive Core Nutrition (Cal/Prot/Fat/Carb)", False, str(e))

    # 4.2 Nutrition Realistic Physiological Bounds
    try:
        outliers = psql("""
            SELECT count(*) FROM "Recipes"
            WHERE "Nutrition_Calories" < 50 OR "Nutrition_Calories" > 3000
               OR "Nutrition_Protein" > 300 OR "Nutrition_Fat" > 300 OR "Nutrition_Carbohydrates" > 600;
        """)
        cnt = int(outliers)
        stats = psql("""
            SELECT round(min("Nutrition_Calories")), round(avg("Nutrition_Calories")), round(max("Nutrition_Calories")),
                   round(min("Nutrition_Protein")), round(max("Nutrition_Protein")),
                   round(min("Nutrition_Fat")), round(max("Nutrition_Fat")),
                   round(min("Nutrition_Carbohydrates")), round(max("Nutrition_Carbohydrates"))
            FROM "Recipes";
        """).split("|")
        report.record("Nutrition Verification", "DB-NUT-02", "Realistic Nutrition Bounds & Averages",
                      cnt == 0, f"Outliers: {cnt}. Calories: {stats[0]}-{stats[2]} kcal (avg {stats[1]}), Protein: {stats[3]}-{stats[4]}g, Fat: {stats[5]}-{stats[6]}g, Carbs: {stats[7]}-{stats[8]}g")
    except Exception as e:
        report.record("Nutrition Verification", "DB-NUT-02", "Realistic Nutrition Bounds & Averages", False, str(e))

    # 5.1 Step Number Sequentiality (No Gaps, No Duplicates)
    try:
        bad_steps = psql("""
            SELECT count(*) FROM (
                SELECT "RecipeId", min("StepNumber") as min_s, max("StepNumber") as max_s, count(*) as cnt
                FROM "RecipeSteps"
                GROUP BY "RecipeId"
                HAVING min("StepNumber") != 1 OR max("StepNumber") != count(*)
            ) q;
        """)
        cnt = int(bad_steps)
        report.record("Step Verification", "DB-STP-01", "Sequential Step Numbers (1..N, No Gaps)",
                      cnt == 0, f"Found {cnt} recipes with non-sequential or gapped step numbers")
    except Exception as e:
        report.record("Step Verification", "DB-STP-01", "Sequential Step Numbers (1..N, No Gaps)", False, str(e))

    # 5.2 Ingredient Valid Quantities and Units
    try:
        bad_ingredients = psql("""
            SELECT count(*) FROM "RecipeIngredients"
            WHERE "Quantity" <= 0 OR "Unit" IS NULL OR trim("Unit") = '' OR "Name" IS NULL OR trim("Name") = '';
        """)
        cnt = int(bad_ingredients)
        report.record("Ingredient Verification", "DB-ING-01", "Valid Ingredient Quantities & Units",
                      cnt == 0, f"Found {cnt} ingredients with <= 0 quantity or empty name/unit")
    except Exception as e:
        report.record("Ingredient Verification", "DB-ING-01", "Valid Ingredient Quantities & Units", False, str(e))

    # 6.1 Child Count Thresholds
    try:
        under_10_ing = int(psql('SELECT count(*) FROM (SELECT "RecipeId" FROM "RecipeIngredients" GROUP BY "RecipeId" HAVING count(*) < 10) q;'))
        under_5_stp = int(psql('SELECT count(*) FROM (SELECT "RecipeId" FROM "RecipeSteps" GROUP BY "RecipeId" HAVING count(*) < 5) q;'))
        bad_imgs = int(psql('SELECT count(*) FROM (SELECT "RecipeId" FROM "RecipeImages" GROUP BY "RecipeId" HAVING count(*) < 3 OR count(*) > 5) q;'))
        bad_primary = int(psql('SELECT count(*) FROM (SELECT "RecipeId" FROM "RecipeImages" WHERE "IsPrimary" = true GROUP BY "RecipeId" HAVING count(*) != 1) q;'))
        all_ok = (under_10_ing == 0 and under_5_stp == 0 and bad_imgs == 0 and bad_primary == 0)
        report.record("Child Invariants", "DB-CHD-01", "Strict Child Entity Thresholds",
                      all_ok, f"<10 Ingrs: {under_10_ing}, <5 Steps: {under_5_stp}, !=3..5 Imgs: {bad_imgs}, !=1 Primary: {bad_primary}")
    except Exception as e:
        report.record("Child Invariants", "DB-CHD-01", "Strict Child Entity Thresholds", False, str(e))


def run_api_adversarial_suite(report: ChallengerReport):
    print("\n" + "=" * 80)
    print("🌐 [PHASE 2] Live Backend API Stress Testing & Adversarial Edge Cases")
    print("=" * 80)

    session = requests.Session()

    # 2.1 Pagination Boundary: Exact Last Page (page=9&pageSize=12)
    try:
        r = session.get(f"{API_BASE}/recipes?page=9&pageSize=12", timeout=10)
        if r.status_code == 200:
            data = r.json()
            items = data.get("items", [])
            total = data.get("totalCount", 0)
            passed = (total == 104) and (len(items) == 8) and (data.get("page") == 9)
            report.record("API Pagination", "API-PAG-01", "Exact Last Page (page=9&pageSize=12)",
                          passed, f"Returned totalCount={total}, items.length={len(items)} (expected 8), page={data.get('page')}")
        else:
            report.record("API Pagination", "API-PAG-01", "Exact Last Page (page=9&pageSize=12)", False, f"HTTP {r.status_code}")
    except Exception as e:
        report.record("API Pagination", "API-PAG-01", "Exact Last Page (page=9&pageSize=12)", False, str(e))

    # 2.2 Pagination Boundary: Out-of-Bounds Page (page=10&pageSize=12)
    try:
        r = session.get(f"{API_BASE}/recipes?page=10&pageSize=12", timeout=10)
        if r.status_code == 200:
            data = r.json()
            items = data.get("items", [])
            total = data.get("totalCount", 0)
            passed = (total == 104) and (len(items) == 0)
            report.record("API Pagination", "API-PAG-02", "Out-of-Bounds Page (page=10&pageSize=12)",
                          passed, f"Graceful 200 OK: totalCount={total}, items.length={len(items)} (expected 0)")
        else:
            report.record("API Pagination", "API-PAG-02", "Out-of-Bounds Page (page=10&pageSize=12)", False, f"HTTP {r.status_code}")
    except Exception as e:
        report.record("API Pagination", "API-PAG-02", "Out-of-Bounds Page (page=10&pageSize=12)", False, str(e))

    # 2.3 Pagination Boundary: Zero & Negative Page (page=0, page=-5)
    try:
        r_zero = session.get(f"{API_BASE}/recipes?page=0&pageSize=12", timeout=10)
        r_neg = session.get(f"{API_BASE}/recipes?page=-5&pageSize=12", timeout=10)
        if r_zero.status_code == 200 and r_neg.status_code == 200:
            d_zero = r_zero.json()
            d_neg = r_neg.json()
            passed = (len(d_zero.get("items", [])) == 12) and (len(d_neg.get("items", [])) == 12)
            report.record("API Pagination", "API-PAG-03", "Zero and Negative Page Auto-Correction",
                          passed, f"page=0 returned {len(d_zero.get('items', []))} items; page=-5 returned {len(d_neg.get('items', []))} items (clamped to page 1)")
        else:
            report.record("API Pagination", "API-PAG-03", "Zero and Negative Page Auto-Correction", False,
                          f"Zero HTTP {r_zero.status_code}, Neg HTTP {r_neg.status_code}")
    except Exception as e:
        report.record("API Pagination", "API-PAG-03", "Zero and Negative Page Auto-Correction", False, str(e))

    # 2.4 Pagination Boundary: Zero PageSize (pageSize=0)
    try:
        r = session.get(f"{API_BASE}/recipes?page=1&pageSize=0", timeout=10)
        if r.status_code == 200:
            data = r.json()
            items = data.get("items", [])
            passed = len(items) == 10  # Clamped to default 10
            report.record("API Pagination", "API-PAG-04", "Zero PageSize Auto-Correction",
                          passed, f"pageSize=0 returned {len(items)} items (clamped to default 10)")
        else:
            report.record("API Pagination", "API-PAG-04", "Zero PageSize Auto-Correction", False, f"HTTP {r.status_code}")
    except Exception as e:
        report.record("API Pagination", "API-PAG-04", "Zero PageSize Auto-Correction", False, str(e))

    # 2.5 Pagination Boundary: Large PageSize (pageSize=150)
    try:
        r = session.get(f"{API_BASE}/recipes?page=1&pageSize=150", timeout=10)
        if r.status_code == 200:
            data = r.json()
            items = data.get("items", [])
            total = data.get("totalCount", 0)
            passed = (total == 104) and (len(items) == 104)
            report.record("API Pagination", "API-PAG-05", "Large PageSize (pageSize=150 returns all)",
                          passed, f"totalCount={total}, returned items.length={len(items)}")
        else:
            report.record("API Pagination", "API-PAG-05", "Large PageSize (pageSize=150 returns all)", False, f"HTTP {r.status_code}")
    except Exception as e:
        report.record("API Pagination", "API-PAG-05", "Large PageSize (pageSize=150 returns all)", False, str(e))

    # 3.1 Difficulty Filtering: Easy=1, Medium=2, Hard=3 Exhaustive Verification
    try:
        counts = {}
        all_match = True
        for diff_val, diff_name in [(1, "Easy"), (2, "Medium"), (3, "Hard")]:
            r = session.get(f"{API_BASE}/recipes?difficulty={diff_val}&pageSize=100", timeout=10)
            if r.status_code == 200:
                d = r.json()
                total_diff = d.get("totalCount", 0)
                counts[diff_name] = total_diff
                items = d.get("items", [])
                for it in items:
                    if it.get("difficulty") != diff_val:
                        all_match = False
            else:
                all_match = False
                counts[diff_name] = -1

        sum_diff = sum(counts.values())
        passed = all_match and (sum_diff == 104) and (counts["Easy"] == 52) and (counts["Medium"] == 41) and (counts["Hard"] == 11)
        report.record("API Filtering", "API-FLT-01", "Difficulty Filtering (Easy/Medium/Hard) Sum = 104",
                      passed, f"Distribution: {counts}, Sum={sum_diff} (expected 104), All items matched filter={all_match}")
    except Exception as e:
        report.record("API Filtering", "API-FLT-01", "Difficulty Filtering (Easy/Medium/Hard) Sum = 104", False, str(e))

    # 3.2 Dispatch Adversarial Edge Case: difficulty=4 (Expert)
    try:
        r = session.get(f"{API_BASE}/recipes?difficulty=4", timeout=10)
        if r.status_code == 200:
            d = r.json()
            total = d.get("totalCount", 0)
            items = d.get("items", [])
            passed = (total == 0) and (len(items) == 0)
            report.record("API Filtering", "API-FLT-02", "Dispatch Edge Case (difficulty=4 Expert -> 0 items)",
                          passed, f"Returned 200 OK gracefully: totalCount={total}, items={items}")
        else:
            report.record("API Filtering", "API-FLT-02", "Dispatch Edge Case (difficulty=4 Expert -> 0 items)", False, f"HTTP {r.status_code}")
    except Exception as e:
        report.record("API Filtering", "API-FLT-02", "Dispatch Edge Case (difficulty=4 Expert -> 0 items)", False, str(e))

    # 3.3 Invalid Difficulty (difficulty=99)
    try:
        r = session.get(f"{API_BASE}/recipes?difficulty=99", timeout=10)
        passed = (r.status_code == 200 and r.json().get("totalCount", 0) == 0) or (r.status_code == 400)
        report.record("API Filtering", "API-FLT-03", "Invalid Difficulty 99 Graceful Handling",
                      passed, f"Returned HTTP {r.status_code} without internal server error")
    except Exception as e:
        report.record("API Filtering", "API-FLT-03", "Invalid Difficulty 99 Graceful Handling", False, str(e))

    # 4.1 Dispatch Adversarial Edge Case: searchTerm=nonexistent_xyz
    try:
        r = session.get(f"{API_BASE}/recipes?searchTerm=nonexistent_xyz", timeout=10)
        if r.status_code == 200:
            d = r.json()
            total = d.get("totalCount", 0)
            items = d.get("items", [])
            passed = (total == 0) and (len(items) == 0)
            report.record("API Search", "API-SCH-01", "Dispatch Edge Case (searchTerm=nonexistent_xyz)",
                          passed, f"Returned 200 OK: totalCount={total}, items.length={len(items)}")
        else:
            report.record("API Search", "API-SCH-01", "Dispatch Edge Case (searchTerm=nonexistent_xyz)", False, f"HTTP {r.status_code}")
    except Exception as e:
        report.record("API Search", "API-SCH-01", "Dispatch Edge Case (searchTerm=nonexistent_xyz)", False, str(e))

    # 4.2 Search: Vietnamese Keyword ("bò")
    try:
        r = session.get(f"{API_BASE}/recipes?searchTerm=bò", timeout=10)
        if r.status_code == 200:
            d = r.json()
            total = d.get("totalCount", 0)
            items = d.get("items", [])
            passed = total > 0 and len(items) > 0
            titles = [i["title"] for i in items[:2]]
            report.record("API Search", "API-SCH-02", "Vietnamese Keyword Search (searchTerm=bò)",
                          passed, f"Found {total} recipes matching 'bò' (e.g. {titles})")
        else:
            report.record("API Search", "API-SCH-02", "Vietnamese Keyword Search (searchTerm=bò)", False, f"HTTP {r.status_code}")
    except Exception as e:
        report.record("API Search", "API-SCH-02", "Vietnamese Keyword Search (searchTerm=bò)", False, str(e))

    # 4.3 Search: SQL Injection Probe (' OR 1=1--)
    try:
        r = session.get(f"{API_BASE}/recipes", params={"searchTerm": "' OR 1=1--"}, timeout=10)
        if r.status_code == 200:
            d = r.json()
            total = d.get("totalCount", 0)
            passed = (total == 0)
            report.record("API Security/Robustness", "API-SEC-01", "SQL Injection Probe (' OR 1=1--)",
                          passed, f"HTTP 200 OK, totalCount={total} (did NOT inject full table)")
        else:
            report.record("API Security/Robustness", "API-SEC-01", "SQL Injection Probe (' OR 1=1--)", False, f"HTTP {r.status_code}")
    except Exception as e:
        report.record("API Security/Robustness", "API-SEC-01", "SQL Injection Probe (' OR 1=1--)", False, str(e))

    # 4.4 Search: XSS Payload (<script>alert(1)</script>)
    try:
        r = session.get(f"{API_BASE}/recipes", params={"searchTerm": "<script>alert(1)</script>"}, timeout=10)
        if r.status_code == 200:
            d = r.json()
            total = d.get("totalCount", 0)
            passed = (total == 0)
            report.record("API Security/Robustness", "API-SEC-02", "XSS Payload Search Probe",
                          passed, f"HTTP 200 OK, totalCount={total}")
        else:
            report.record("API Security/Robustness", "API-SEC-02", "XSS Payload Search Probe", False, f"HTTP {r.status_code}")
    except Exception as e:
        report.record("API Security/Robustness", "API-SEC-02", "XSS Payload Search Probe", False, str(e))

    # 4.5 Full-Text Search Endpoint: < 2 characters validation (FR-SRCH-001)
    try:
        r = session.get(f"{API_BASE}/recipes/search?q=a", timeout=10)
        passed = (r.status_code == 422)
        report.record("API Search", "API-SCH-03", "Full-Text Search < 2 chars Validation",
                      passed, f"Returned HTTP {r.status_code} UnprocessableEntity (expected 422)")
    except Exception as e:
        report.record("API Search", "API-SCH-03", "Full-Text Search < 2 chars Validation", False, str(e))

    # 4.6 Full-Text Search Endpoint: Unaccented search ("pho bo")
    try:
        r = session.get(f"{API_BASE}/recipes/search?q=pho%20bo", timeout=10)
        if r.status_code == 200:
            d = r.json()
            items = d.get("items", [])
            total = d.get("totalCount", 0)
            passed = total > 0 and any("phở" in i["title"].lower() or "pho" in i["title"].lower() for i in items)
            report.record("API Search", "API-SCH-04", "Full-Text Unaccent Search ('pho bo' -> Phở bò)",
                          passed, f"Found {total} matches with tsvector & unaccent")
        else:
            report.record("API Search", "API-SCH-04", "Full-Text Unaccent Search ('pho bo' -> Phở bò)", False, f"HTTP {r.status_code}")
    except Exception as e:
        report.record("API Search", "API-SCH-04", "Full-Text Unaccent Search ('pho bo' -> Phở bò)", False, str(e))

    # 5.1 Detail: Nonexistent Slug (404 check)
    try:
        r = session.get(f"{API_BASE}/recipes/slug-that-definitely-does-not-exist-12345", timeout=10)
        passed = (r.status_code == 404)
        report.record("API Detail", "API-DET-01", "Nonexistent Slug 404 Handling",
                      passed, f"Returned HTTP {r.status_code} NotFound (expected 404)")
    except Exception as e:
        report.record("API Detail", "API-DET-01", "Nonexistent Slug 404 Handling", False, str(e))

    # 5.2 Detail: Path Traversal Probe
    try:
        r = session.get(f"{API_BASE}/recipes/..%2F..%2F..%2Fetc%2Fpasswd", timeout=10)
        passed = (r.status_code in (400, 404))
        report.record("API Security/Robustness", "API-SEC-03", "Path Traversal Probe",
                          passed, f"Returned HTTP {r.status_code} (graceful rejection, no 500)")
    except Exception as e:
        report.record("API Security/Robustness", "API-SEC-03", "Path Traversal Probe", False, str(e))

    # 5.3 Detail: Showcase Recipe Verification
    try:
        r = session.get(f"{API_BASE}/recipes/pho-bo-tai-lan-chuan-vi-ha-thanh", timeout=10)
        if r.status_code == 200:
            recipe = r.json()
            n = recipe.get("nutrition", {})
            nutr_ok = (n.get("calories", 0) > 0 and n.get("protein", 0) > 0 and n.get("fat", 0) > 0 and n.get("carbohydrates", 0) > 0)
            ings = recipe.get("ingredients", [])
            stps = recipe.get("steps", [])
            imgs = recipe.get("images", [])
            passed = nutr_ok and len(ings) >= 10 and len(stps) >= 5 and 3 <= len(imgs) <= 5
            report.record("API Detail", "API-DET-02", "Showcase Dish Full Detail Payload",
                          passed, f"Ings: {len(ings)}, Steps: {len(stps)}, Imgs: {len(imgs)}, Nutrition: {n}")
        else:
            report.record("API Detail", "API-DET-02", "Showcase Dish Full Detail Payload", False, f"HTTP {r.status_code}")
    except Exception as e:
        report.record("API Detail", "API-DET-02", "Showcase Dish Full Detail Payload", False, str(e))

    # 6.1 Category Filter: Valid CategoryId
    try:
        r_cats = session.get(f"{API_BASE}/categories", timeout=10)
        if r_cats.status_code == 200:
            cats = r_cats.json()
            first_cat = cats[0]
            cat_id = first_cat["id"]
            cat_name = first_cat["name"]
            r_rec = session.get(f"{API_BASE}/recipes?categoryId={cat_id}", timeout=10)
            if r_rec.status_code == 200:
                rec_data = r_rec.json()
                total = rec_data.get("totalCount", 0)
                items = rec_data.get("items", [])
                passed = total > 0 and all(i.get("categoryName") == cat_name for i in items)
                report.record("API Filtering", "API-FLT-04", f"Category Filtering ({cat_name})",
                              passed, f"Returned {total} recipes, all tagged with '{cat_name}'")
            else:
                report.record("API Filtering", "API-FLT-04", "Category Filtering", False, f"HTTP {r_rec.status_code}")
        else:
            report.record("API Filtering", "API-FLT-04", "Category Filtering", False, f"Categories HTTP {r_cats.status_code}")
    except Exception as e:
        report.record("API Filtering", "API-FLT-04", "Category Filtering", False, str(e))

    # 6.2 Category Filter: Nonexistent GUID
    try:
        r = session.get(f"{API_BASE}/recipes?categoryId=00000000-0000-0000-0000-000000000000", timeout=10)
        if r.status_code == 200:
            d = r.json()
            total = d.get("totalCount", 0)
            passed = (total == 0)
            report.record("API Filtering", "API-FLT-05", "Nonexistent Category GUID Filtering",
                          passed, f"totalCount={total} (expected 0)")
        else:
            report.record("API Filtering", "API-FLT-05", "Nonexistent Category GUID Filtering", False, f"HTTP {r.status_code}")
    except Exception as e:
        report.record("API Filtering", "API-FLT-05", "Nonexistent Category GUID Filtering", False, str(e))


def main():
    t_start = time.time()
    report = ChallengerReport()

    run_database_adversarial_suite(report)
    run_api_adversarial_suite(report)

    report.summary()
    sys.exit(0 if report.all_passed() else 1)


if __name__ == "__main__":
    main()
