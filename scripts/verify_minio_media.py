"""
verify_minio_media.py - Automated MinIO Image Integrity Verification Suite
Milestone 2: Authentic Media Pipeline & Storage

Verifies that 100% of the 988 culinary images (25 category banners, 104 recipe covers,
312 gallery photos, and 547 step action photos) defined in scripts/image_source_manifest.json
are publicly accessible from MinIO (http://localhost:9000) with:
1. HTTP 200 OK via anonymous GET (no authentication headers).
2. Content-Type: image/jpeg.
3. Content-Length >= 5 KB.
4. Valid JPEG magic bytes (0xFF 0xD8 0xFF).
5. Uncorrupted JPEG data verified by Pillow (PIL.Image.verify).
"""

import io
import json
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

MINIO_BASE_URL = "http://localhost:9000"
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST_PATH = os.path.join(BASE_DIR, "scripts", "image_source_manifest.json")
DATASET_PATH = os.path.join(BASE_DIR, "backend", "src", "Infrastructure", "Data", "Datasets", "recipes_master_dataset.json")


def verify_single_url(url: str, item_type: str, item_title: str):
    """
    Perform anonymous HTTP GET on MinIO image URL and verify headers,
    size, magic bytes, and JPEG stream integrity.
    """
    full_url = f"{MINIO_BASE_URL}{url}" if url.startswith("/") else f"{MINIO_BASE_URL}/{url}"
    
    try:
        # Anonymous GET without any credentials or auth headers
        resp = requests.get(full_url, timeout=6)
        status = resp.status_code
        content_type = resp.headers.get("Content-Type", "")
        content_length = len(resp.content)
        
        # 1. Status Code Check
        if status != 200:
            return {
                "url": url,
                "type": item_type,
                "title": item_title,
                "is_ok": False,
                "error": f"HTTP status {status} (expected 200)"
            }

        # 2. Content Type Check
        if "image/jpeg" not in content_type.lower():
            return {
                "url": url,
                "type": item_type,
                "title": item_title,
                "is_ok": False,
                "error": f"Content-Type '{content_type}' (expected 'image/jpeg')"
            }

        # 3. Minimum Size Check (>= 5 KB = 5120 bytes)
        if content_length < 5120:
            return {
                "url": url,
                "type": item_type,
                "title": item_title,
                "is_ok": False,
                "error": f"Size {content_length} bytes (< 5 KB)"
            }

        # 4. JPEG Magic Bytes Check (\xFF\xD8\xFF)
        if not resp.content.startswith(b"\xff\xd8\xff"):
            return {
                "url": url,
                "type": item_type,
                "title": item_title,
                "is_ok": False,
                "error": "Missing JPEG magic bytes (0xFF 0xD8 0xFF)"
            }

        # 5. Pillow Structure Verification
        try:
            img = Image.open(io.BytesIO(resp.content))
            img.verify()
        except Exception as pe:
            return {
                "url": url,
                "type": item_type,
                "title": item_title,
                "is_ok": False,
                "error": f"Pillow image corruption: {pe}"
            }

        return {
            "url": url,
            "type": item_type,
            "title": item_title,
            "status": status,
            "content_type": content_type,
            "size_kb": content_length / 1024.0,
            "is_ok": True,
            "error": None
        }

    except Exception as e:
        return {
            "url": url,
            "type": item_type,
            "title": item_title,
            "is_ok": False,
            "error": f"Connection/Network error: {e}"
        }


def classify_url(url: str) -> str:
    """Classify MinIO path into its semantic group."""
    if "/categories/" in url:
        return "Category"
    elif url.endswith("/cover.jpg"):
        return "Cover"
    elif "/gallery-" in url:
        return "Gallery"
    elif "/steps/" in url:
        return "Step"
    return "Other"


def main():
    print("=" * 70)
    print("🔍 Starting Comprehensive MinIO Media Integrity Verification Audit")
    print(f"Target MinIO Server: {MINIO_BASE_URL}")
    print(f"Manifest:           {MANIFEST_PATH}")
    print("=" * 70)

    # 1. Load manifest
    if not os.path.exists(MANIFEST_PATH):
        print(f"FATAL: Manifest file not found: {MANIFEST_PATH}")
        sys.exit(1)

    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    images_map = manifest.get("images", {})
    total_images = len(images_map)
    print(f"Loaded {total_images} total image paths to verify.")

    # 2. Build verification tasks
    tasks = []
    for minio_path in images_map.keys():
        itype = classify_url(minio_path)
        tasks.append((minio_path, itype, os.path.basename(minio_path)))

    counts = {
        "Category": len([t for t in tasks if t[1] == "Category"]),
        "Cover": len([t for t in tasks if t[1] == "Cover"]),
        "Gallery": len([t for t in tasks if t[1] == "Gallery"]),
        "Step": len([t for t in tasks if t[1] == "Step"]),
    }

    print(f"\nBreakdown to audit:")
    print(f"  - Category Banners:   {counts['Category']:>4}")
    print(f"  - Recipe Covers:      {counts['Cover']:>4}")
    print(f"  - Gallery Photos:     {counts['Gallery']:>4}")
    print(f"  - Step Illustrations: {counts['Step']:>4}")
    print(f"  - Total:              {total_images:>4}")
    print(f"\nExecuting anonymous multi-threaded audit across 20 workers...")

    # 3. Execute audit
    t0 = time.time()
    results_by_type = {"Category": [], "Cover": [], "Gallery": [], "Step": [], "Other": []}
    failures = []

    with ThreadPoolExecutor(max_workers=20) as executor:
        future_to_task = {
            executor.submit(verify_single_url, url, itype, title): (url, itype, title)
            for url, itype, title in tasks
        }
        done_count = 0
        for future in as_completed(future_to_task):
            done_count += 1
            res = future.result()
            results_by_type[res["type"]].append(res)
            if not res["is_ok"]:
                failures.append(res)

            if done_count % 150 == 0 or done_count == total_images:
                pct = (done_count / total_images) * 100
                print(f"  Audited {done_count}/{total_images} images ({pct:5.1f}%)...")

    duration = time.time() - t0

    # 4. Print detailed results
    print("\n" + "=" * 70)
    print("📊 MinIO Media Integrity Audit Results")
    print("=" * 70)

    all_passed = True
    for itype in ["Category", "Cover", "Gallery", "Step"]:
        type_results = results_by_type[itype]
        passed = sum(1 for r in type_results if r["is_ok"])
        total = len(type_results)
        pct = (passed / total * 100) if total > 0 else 0
        avg_size = (sum(r["size_kb"] for r in type_results if r["is_ok"]) / passed) if passed > 0 else 0
        status_sym = "✓" if passed == total else "✗"
        print(f"  {status_sym} {itype:<10} Images: {passed:>4}/{total:>4} passed ({pct:5.1f}%) | Avg Size: {avg_size:6.1f} KB")
        if passed != total:
            all_passed = False

    total_passed = sum(1 for r in sum(results_by_type.values(), []) if r["is_ok"])
    print("-" * 70)
    print(f"Total Verified:       {total_passed}/{total_images} passed ({total_passed/total_images*100:5.1f}%)")
    print(f"Total Audit Time:     {duration:.2f} seconds ({total_images/duration:.1f} req/s)")

    if failures:
        print("\n❌ Verification Failures Detected:")
        for idx, f in enumerate(failures[:15], 1):
            print(f"  {idx}. [{f['type']}] {f['url']} -> {f['error']}")
        if len(failures) > 15:
            print(f"  ... and {len(failures) - 15} more failures.")
        print("\n" + "=" * 70)
        sys.exit(1)
    else:
        print("\n🎉 VERIFICATION SUCCESS:")
        print("  ✓ 100% of 988 images return HTTP 200 OK via anonymous GET.")
        print("  ✓ 100% of images have Content-Type 'image/jpeg'.")
        print("  ✓ 100% of images have sizes >= 5 KB.")
        print("  ✓ 100% of images start with valid JPEG magic bytes (0xFF 0xD8 0xFF).")
        print("  ✓ 100% of images pass uncorrupted Pillow stream verification.")
        print("=" * 70)
        sys.exit(0)


if __name__ == "__main__":
    main()
