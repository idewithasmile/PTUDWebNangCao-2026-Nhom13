#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Validation script for recipes_master_dataset.json.
Verifies 100% compliance with R1, R2, and database entity integrity:
1. File existence and valid JSON syntax.
2. Metadata check.
3. Categories check (count >= 20, 6 required home categories, unique GUIDs, unique slugs, image URLs).
4. Recipes check (count >= 100, crucial recipe 'pho-bo-tai-lan-chuan-vi-ha-thanh' present).
5. Recipe fields: id, title, slug, categorySlug, authorEmail, description, instructions, prepTime, cookTime, servings, difficulty.
6. Nutrition: calories, protein, carbohydrates, fat, fiber, sodium (realistic positive numbers).
7. Ingredients: >= 10 ingredients per recipe with name, quantity > 0, unit, notes.
8. Steps: >= 5 steps per recipe with stepNumber (1-based sequential), title, description, timer.
9. Images: 3-5 images per recipe, exactly 1 primary at orderIndex 0, correct URL format /culinary-blog/recipes/{recipeId}/{guid}.jpg.
10. Category distribution: all categories represented.
"""

import os
import sys
import json
import uuid
import re

# Ensure UTF-8 stdout
if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if sys.stderr and hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET_PATH = os.path.join(REPO_ROOT, "backend", "src", "Infrastructure", "Data", "Datasets", "recipes_master_dataset.json")

REQUIRED_HOME_CATEGORIES = [
    ("Món khai vị", "mon-khai-vi"),
    ("Món chính", "mon-chinh"),
    ("Canh & Súp", "canh-sup"),
    ("Món chay", "mon-chay"),
    ("Tráng miệng", "trang-mieng"),
    ("Đồ uống", "do-uong")
]

CRUCIAL_RECIPE_SLUG = "pho-bo-tai-lan-chuan-vi-ha-thanh"
VALID_DIFFICULTIES = {"Easy", "Medium", "Hard", "Expert"}


def is_valid_uuid(val: str) -> bool:
    try:
        uuid.UUID(str(val))
        return True
    except (ValueError, AttributeError):
        return False


def validate():
    print(f"=== Starting validation of {DATASET_PATH} ===")
    errors = []
    warnings = []

    # 1. File existence
    if not os.path.exists(DATASET_PATH):
        print(f"FAIL: File does not exist: {DATASET_PATH}")
        sys.exit(1)

    file_size_kb = os.path.getsize(DATASET_PATH) / 1024
    print(f"File exists. Size: {file_size_kb:.2f} KB")

    # 2. JSON parsing
    try:
        with open(DATASET_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        print(f"FAIL: Invalid JSON: {e}")
        sys.exit(1)

    # 3. Top-level keys
    for k in ["metadata", "categories", "recipes"]:
        if k not in data:
            errors.append(f"Missing top-level key: '{k}'")

    if errors:
        for err in errors:
            print(f"ERROR: {err}")
        sys.exit(1)

    categories = data["categories"]
    recipes = data["recipes"]

    # 4. Categories validation
    print(f"\n--- Validating Categories (Total: {len(categories)}) ---")
    if len(categories) < 20:
        errors.append(f"Categories count is {len(categories)}, expected >= 20.")

    cat_slug_map = {}
    cat_id_set = set()

    for idx, c in enumerate(categories):
        cid = c.get("id")
        name = c.get("name")
        slug = c.get("slug")
        desc = c.get("description")
        img_url = c.get("imageUrl")
        order_idx = c.get("orderIndex")

        if not is_valid_uuid(cid):
            errors.append(f"Category[{idx}] '{name}' has invalid UUID: {cid}")
        if cid in cat_id_set:
            errors.append(f"Category[{idx}] duplicate ID: {cid}")
        cat_id_set.add(cid)

        if not name or len(name.strip()) == 0:
            errors.append(f"Category[{idx}] has empty name")
        if not slug or len(slug.strip()) == 0:
            errors.append(f"Category[{idx}] has empty slug")
        if slug in cat_slug_map:
            errors.append(f"Category[{idx}] duplicate slug: '{slug}'")
        cat_slug_map[slug] = c

        if not desc or len(desc.strip()) < 15:
            errors.append(f"Category '{slug}' description too short: '{desc}'")

        expected_cat_img = f"/culinary-blog/categories/{slug}.jpg"
        if img_url != expected_cat_img:
            errors.append(f"Category '{slug}' imageUrl '{img_url}' does not match expected '{expected_cat_img}'")

        if not isinstance(order_idx, int) or order_idx < 1:
            errors.append(f"Category '{slug}' orderIndex must be integer >= 1 (got {order_idx})")

    # Check 6 required home categories
    for req_name, req_slug in REQUIRED_HOME_CATEGORIES:
        if req_slug not in cat_slug_map:
            errors.append(f"Missing required home category: '{req_name}' (slug: '{req_slug}')")
        else:
            print(f"  ✓ Required home category present: '{cat_slug_map[req_slug]['name']}' ({req_slug})")

    # 5. Recipes validation
    print(f"\n--- Validating Recipes (Total: {len(recipes)}) ---")
    if len(recipes) < 100:
        errors.append(f"Recipes count is {len(recipes)}, expected >= 100.")

    recipe_slug_set = set()
    recipe_id_set = set()
    category_recipe_counts = {slug: 0 for slug in cat_slug_map}
    found_crucial_recipe = False

    for idx, r in enumerate(recipes):
        rid = r.get("id")
        title = r.get("title")
        slug = r.get("slug")
        cat_slug = r.get("categorySlug")
        cat_id = r.get("categoryId")
        author_email = r.get("authorEmail")
        desc = r.get("description")
        inst_md = r.get("instructions")
        prep_min = r.get("prepTimeMinutes")
        cook_min = r.get("cookTimeMinutes")
        servings = r.get("servings")
        diff = r.get("difficulty")
        status = r.get("status")
        nutrition = r.get("nutrition", {})
        ingredients = r.get("ingredients", [])
        steps = r.get("steps", [])
        images = r.get("images", [])

        prefix = f"Recipe[{idx}] '{slug}'"

        # Check crucial recipe
        if slug == CRUCIAL_RECIPE_SLUG:
            found_crucial_recipe = True
            print(f"  ✓ Crucial recipe present: '{title}' ({slug})")

        # UUID
        if not is_valid_uuid(rid):
            errors.append(f"{prefix}: invalid UUID: {rid}")
        if rid in recipe_id_set:
            errors.append(f"{prefix}: duplicate recipe ID: {rid}")
        recipe_id_set.add(rid)

        # Slug
        if not slug or not re.match(r"^[a-z0-9\-]+$", slug):
            errors.append(f"{prefix}: invalid slug format '{slug}'")
        if slug in recipe_slug_set:
            errors.append(f"{prefix}: duplicate recipe slug '{slug}'")
        recipe_slug_set.add(slug)

        # Title
        if not title or len(title.strip()) < 5:
            errors.append(f"{prefix}: title too short: '{title}'")

        # CategorySlug and CategoryId
        if cat_slug not in cat_slug_map:
            errors.append(f"{prefix}: references unknown categorySlug '{cat_slug}'")
        else:
            category_recipe_counts[cat_slug] += 1
            expected_cat_id = cat_slug_map[cat_slug]["id"]
            if cat_id != expected_cat_id:
                errors.append(f"{prefix}: categoryId '{cat_id}' does not match expected '{expected_cat_id}'")

        # AuthorEmail
        if not author_email or "@" not in author_email:
            errors.append(f"{prefix}: invalid authorEmail '{author_email}'")

        # Description and instructions
        if not desc or len(desc.strip()) < 20:
            errors.append(f"{prefix}: description too short")
        if not inst_md or len(inst_md.strip()) < 30:
            errors.append(f"{prefix}: instructions overview too short")

        # Numeric fields
        if not isinstance(prep_min, int) or prep_min < 1:
            errors.append(f"{prefix}: prepTimeMinutes must be int > 0 (got {prep_min})")
        if not isinstance(cook_min, int) or cook_min < 0:
            errors.append(f"{prefix}: cookTimeMinutes must be int >= 0 (got {cook_min})")
        if not isinstance(servings, int) or servings < 1:
            errors.append(f"{prefix}: servings must be int > 0 (got {servings})")
        if diff not in VALID_DIFFICULTIES:
            errors.append(f"{prefix}: difficulty '{diff}' not in {VALID_DIFFICULTIES}")
        if status != "Published":
            errors.append(f"{prefix}: status is '{status}', expected 'Published'")

        # Nutrition
        for nut_field in ["calories", "protein", "carbohydrates", "fat", "fiber", "sodium"]:
            if nut_field not in nutrition:
                errors.append(f"{prefix}: nutrition missing field '{nut_field}'")
            elif not isinstance(nutrition[nut_field], (int, float)) or nutrition[nut_field] < 0:
                errors.append(f"{prefix}: nutrition['{nut_field}'] invalid: {nutrition[nut_field]}")

        if nutrition.get("calories", 0) < 50:
            errors.append(f"{prefix}: calories unrealistically low: {nutrition.get('calories')}")

        # Ingredients (>= 10 required)
        if len(ingredients) < 10:
            errors.append(f"{prefix}: has {len(ingredients)} ingredients, minimum 10 required.")

        for i_idx, ing in enumerate(ingredients):
            iname = ing.get("name")
            iqty = ing.get("quantity")
            iunit = ing.get("unit")
            if not iname or len(iname.strip()) == 0:
                errors.append(f"{prefix} ingredient[{i_idx}] missing name")
            if not isinstance(iqty, (int, float)) or iqty <= 0:
                errors.append(f"{prefix} ingredient '{iname}' quantity must be > 0 (got {iqty})")
            if not iunit or len(iunit.strip()) == 0:
                errors.append(f"{prefix} ingredient '{iname}' missing unit")

        # Steps (>= 5 required)
        if len(steps) < 5:
            errors.append(f"{prefix}: has {len(steps)} steps, minimum 5 required.")

        for s_idx, step in enumerate(steps):
            s_num = step.get("stepNumber")
            s_title = step.get("title")
            s_desc = step.get("description")
            s_timer = step.get("timerMinutes")

            if s_num != s_idx + 1:
                errors.append(f"{prefix} step[{s_idx}] stepNumber is {s_num}, expected {s_idx + 1}")
            if not s_title or len(s_title.strip()) == 0:
                errors.append(f"{prefix} step[{s_idx}] missing title")
            if not s_desc or len(s_desc.strip()) < 10:
                errors.append(f"{prefix} step[{s_idx}] description too short")
            if s_timer is not None and (not isinstance(s_timer, int) or s_timer <= 0):
                errors.append(f"{prefix} step[{s_idx}] timerMinutes invalid: {s_timer}")

        # Images (3 to 5 images required)
        if len(images) < 3 or len(images) > 5:
            errors.append(f"{prefix}: has {len(images)} images, expected 3 to 5.")

        primary_count = 0
        for img_idx, img in enumerate(images):
            img_id = img.get("id")
            img_url = img.get("url")
            img_alt = img.get("alt")
            is_pri = img.get("isPrimary")
            o_idx = img.get("orderIndex")

            if not is_valid_uuid(img_id):
                errors.append(f"{prefix} image[{img_idx}] invalid UUID: {img_id}")

            expected_img_url = f"/culinary-blog/recipes/{rid}/{img_id}.jpg"
            if img_url != expected_img_url:
                errors.append(f"{prefix} image[{img_idx}] url '{img_url}' != expected '{expected_img_url}'")

            if not img_alt or len(img_alt.strip()) == 0:
                errors.append(f"{prefix} image[{img_idx}] missing alt text")

            if is_pri:
                primary_count += 1
                if img_idx != 0:
                    errors.append(f"{prefix} primary image at index {img_idx}, must be index 0")
                if o_idx != 0:
                    errors.append(f"{prefix} primary image orderIndex is {o_idx}, must be 0")
            else:
                if img_idx == 0:
                    errors.append(f"{prefix} image at index 0 must have isPrimary=true")

        if primary_count != 1:
            errors.append(f"{prefix}: has {primary_count} primary images, expected exactly 1.")

    if not found_crucial_recipe:
        errors.append(f"CRITICAL: Crucial recipe '{CRUCIAL_RECIPE_SLUG}' was NOT found in dataset!")

    # 6. Category coverage check
    print("\n--- Category Recipe Distribution ---")
    zero_cats = []
    for cat_slug, count in category_recipe_counts.items():
        cat_name = cat_slug_map[cat_slug]["name"]
        print(f"  [{count:2d} recipes] {cat_name} ({cat_slug})")
        if count == 0:
            zero_cats.append(cat_slug)

    if zero_cats:
        errors.append(f"Categories with 0 recipes: {zero_cats}")

    # Final summary
    print("\n=== Validation Summary ===")
    print(f"Total Categories: {len(categories)}")
    print(f"Total Recipes: {len(recipes)}")
    print(f"Errors: {len(errors)}")
    print(f"Warnings: {len(warnings)}")

    if errors:
        print("\nValidation FAILED with the following errors:")
        for idx, err in enumerate(errors[:30], 1):
            print(f"  {idx}. {err}")
        if len(errors) > 30:
            print(f"  ... and {len(errors) - 30} more errors.")
        sys.exit(1)
    else:
        print("\nCONGRATULATIONS: 100% of validation rules PASSED successfully!")
        sys.exit(0)


if __name__ == "__main__":
    validate()
