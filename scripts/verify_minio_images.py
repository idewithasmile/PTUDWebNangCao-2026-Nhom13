"""
verify_minio_images.py - Automated MinIO Image Verification Script
Milestone 2: MinIO Storage & Image Pipeline

Verifies that 100% of category images and recipe images referenced in
backend/src/Infrastructure/Data/Datasets/recipes_master_dataset.json
are publicly accessible from MinIO (http://localhost:9000) with HTTP 200 OK,
valid content type (image/jpeg), valid magic bytes (0xFF 0xD8 0xFF),
and non-empty file content.
"""

import json
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests

sys.stdout.reconfigure(encoding='utf-8')

MINIO_BASE_URL = "http://localhost:9000"
DATASET_PATH = "backend/src/Infrastructure/Data/Datasets/recipes_master_dataset.json"


def check_url(url: str, item_type: str, item_desc: str):
    """Perform anonymous HTTP GET on image URL and verify headers and magic bytes."""
    full_url = f"{MINIO_BASE_URL}{url}"
    try:
        resp = requests.get(full_url, timeout=5, stream=True)
        status = resp.status_code
        content_type = resp.headers.get("Content-Type", "")
        # Read first 1024 bytes to inspect magic bytes and ensure body is readable
        chunk = resp.raw.read(1024)
        has_jpeg_magic = chunk.startswith(b"\xff\xd8\xff")
        content_length = int(resp.headers.get("Content-Length", len(chunk)))

        is_ok = (status == 200) and ("image" in content_type) and has_jpeg_magic and (content_length > 1000)
        return {
            "url": url,
            "full_url": full_url,
            "type": item_type,
            "desc": item_desc,
            "status": status,
            "content_type": content_type,
            "content_length": content_length,
            "has_magic": has_jpeg_magic,
            "is_ok": is_ok,
            "error": None if is_ok else f"Status: {status}, Type: {content_type}, Magic: {has_jpeg_magic}, Len: {content_length}"
        }
    except Exception as e:
        return {
            "url": url,
            "full_url": full_url,
            "type": item_type,
            "desc": item_desc,
            "status": 0,
            "content_type": "",
            "content_length": 0,
            "has_magic": False,
            "is_ok": False,
            "error": str(e)
        }


def main():
    print("=" * 70)
    print("🔍 Starting MinIO Image Verification Audit")
    print("=" * 70)

    with open(DATASET_PATH, 'r', encoding='utf-8') as f:
        master = json.load(f)

    categories = master.get('categories', [])
    recipes = master.get('recipes', [])

    tasks = []

    # 1. Collect category image URLs
    for c in categories:
        slug = c['slug']
        url = c['imageUrl']
        tasks.append((url, "Category", f"Category [{c['name']}] ({slug})"))

    # 2. Collect recipe image URLs
    for r in recipes:
        recipe_title = r['title']
        for img in r.get('images', []):
            is_primary = img.get('isPrimary', False)
            order = img.get('orderIndex', 0)
            tag = "Primary" if is_primary else f"Step {order}"
            tasks.append((img['url'], "Recipe", f"[{tag}] {recipe_title}"))

    total_images = len(tasks)
    print(f"Total images to verify: {total_images} (25 categories, {total_images - 25} recipe images)")
    print(f"Testing anonymous public access via {MINIO_BASE_URL}...\n")

    t0 = time.time()
    results = []
    with ThreadPoolExecutor(max_workers=16) as executor:
        future_to_task = {executor.submit(check_url, url, itype, idesc): (url, itype, idesc) for url, itype, idesc in tasks}
        for future in as_completed(future_to_task):
            res = future.result()
            results.append(res)
            if not res["is_ok"]:
                print(f"❌ FAIL: {res['desc']} -> {res['full_url']} (Error: {res['error']})")

    duration = time.time() - t0

    # Categorize results
    cat_results = [r for r in results if r["type"] == "Category"]
    recipe_results = [r for r in results if r["type"] == "Recipe"]

    cat_passed = sum(1 for r in cat_results if r["is_ok"])
    recipe_passed = sum(1 for r in recipe_results if r["is_ok"])
    total_passed = cat_passed + recipe_passed

    cat_rate = (cat_passed / len(cat_results)) * 100 if cat_results else 0
    recipe_rate = (recipe_passed / len(recipe_results)) * 100 if recipe_results else 0
    total_rate = (total_passed / total_images) * 100 if total_images else 0

    print("=" * 70)
    print("📊 MinIO Verification Audit Results")
    print("=" * 70)
    print(f"Category Images: {cat_passed}/{len(cat_results)} passed ({cat_rate:.1f}%)")
    print(f"Recipe Images:   {recipe_passed}/{len(recipe_results)} passed ({recipe_rate:.1f}%)")
    print(f"Total Verified:  {total_passed}/{total_images} passed ({total_rate:.1f}%)")
    print(f"Verification Time: {duration:.2f} seconds")

    if total_rate == 100.0:
        print("\n🎉 VERIFICATION SUCCESS: 100% of images exist, return HTTP 200 OK, and have valid JPEG magic bytes!")
        print("=" * 70)
        sys.exit(0)
    else:
        print(f"\n❌ VERIFICATION FAILURE: {total_images - total_passed} images failed verification.")
        print("=" * 70)
        sys.exit(1)


if __name__ == "__main__":
    main()
