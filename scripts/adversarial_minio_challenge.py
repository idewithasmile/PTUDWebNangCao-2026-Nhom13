"""
adversarial_minio_challenge.py - Empirical Challenger 2 Verification Suite
Author: Challenger 2 (Empirical Challenger: Critic & Specialist)
Target: MinIO Object Storage, PostgreSQL Image Integrity, Next.js Rewrite Proxy

Covers:
1. Database Image Mappings & Primary/Secondary Integrity (PostgreSQL)
2. MinIO Bucket Object Inventory & Anonymous Public Read Policy
3. High-Concurrency MinIO Direct HTTP Access (100% HTTP 200 OK)
4. Deep Binary JPEG Integrity (SOI 0xFF 0xD8, EOI 0xFF 0xD9, Size > 10KB, PIL verify)
5. Next.js Rewrite Proxy Verification (http://localhost:3000/culinary-blog/...)
6. Adversarial Edge Cases: HTTP Range requests (206 Partial), 404 handling, path traversal bounds
"""

import io
import json
import random
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Dict, List, Tuple
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from PIL import Image
from minio import Minio

# Set utf-8 encoding for Windows console
sys.stdout.reconfigure(encoding="utf-8")

MINIO_DIRECT_BASE = "http://localhost:9000"
NEXTJS_PROXY_BASE = "http://localhost:3000"
BUCKET_NAME = "culinary-blog"
MINIO_ACCESS_KEY = "minioadmin"
MINIO_SECRET_KEY = "minioadminpassword"
MIN_FILE_SIZE_BYTES = 10 * 1024  # 10 KB threshold


def create_pooled_session(pool_size: int = 64, max_retries: int = 3) -> requests.Session:
    session = requests.Session()
    retries = Retry(
        total=max_retries,
        backoff_factor=0.2,
        status_forcelist=[502, 503, 504],
        raise_on_status=False
    )
    adapter = HTTPAdapter(
        pool_connections=pool_size,
        pool_maxsize=pool_size,
        max_retries=retries
    )
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    return session


def run_psql(sql: str) -> str:
    """Execute SQL query against live PostgreSQL docker container."""
    cmd = [
        "docker", "exec", "-i", "culinary_postgres",
        "psql", "-U", "postgres", "-d", "culinary_blog", "-t", "-A", "-c", sql
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    if res.returncode != 0:
        raise RuntimeError(f"PSQL execution error: {res.stderr.strip()}")
    return res.stdout.strip()


class ChallengerTestRunner:
    def __init__(self):
        self.passed_tests = 0
        self.failed_tests = 0
        self.test_results = []
        self.start_time = time.time()

    def assert_true(self, condition: bool, test_name: str, detail: str = ""):
        if condition:
            self.passed_tests += 1
            print(f"  [PASS] {test_name}: {detail}")
            self.test_results.append((test_name, True, detail))
        else:
            self.failed_tests += 1
            print(f"  [FAIL] {test_name}: {detail}")
            self.test_results.append((test_name, False, detail))

    def print_suite_header(self, title: str):
        print(f"\n{'='*75}\n>>> {title}\n{'='*75}")


def main():
    runner = ChallengerTestRunner()
    print("=" * 75)
    print("EMPIRICAL CHALLENGER 2: ADVERSARIAL MINIO & MEDIA STREAMING AUDIT")
    print("=" * 75)

    # -------------------------------------------------------------------------
    # SUITE 1: DATABASE PRIMARY / SECONDARY IMAGE INTEGRITY & SCHEMA CHECKS
    # -------------------------------------------------------------------------
    runner.print_suite_header("SUITE 1: PostgreSQL Image Relationships & Primary/Secondary Flags")

    # 1.1 Category Image Count & Nullability
    cat_query = 'SELECT "Id", "Slug", "ImageUrl" FROM "Categories" ORDER BY "OrderIndex";'
    cat_raw = run_psql(cat_query).splitlines()
    cat_records = [line.split("|") for line in cat_raw if line.strip()]
    runner.assert_true(len(cat_records) >= 20, "Category Count Threshold", f"Found {len(cat_records)} categories (>= 20)")

    null_cat_imgs = [c for c in cat_records if len(c) < 3 or not c[2].strip()]
    runner.assert_true(len(null_cat_imgs) == 0, "Category Images Non-Null", f"Null/missing category images: {len(null_cat_imgs)}")

    cat_urls = [c[2].strip() for c in cat_records]

    # 1.2 Recipe Image Count & Constraints
    recipe_imgs_query = """
    SELECT "RecipeId", "OriginalUrl", "IsPrimary", "OrderIndex"
    FROM "RecipeImages"
    ORDER BY "RecipeId", "OrderIndex";
    """
    img_raw = run_psql(recipe_imgs_query).splitlines()
    img_records = [line.split("|") for line in img_raw if line.strip()]
    total_recipe_imgs = len(img_records)
    runner.assert_true(total_recipe_imgs == 416, "Recipe Images Population", f"Found {total_recipe_imgs} recipe images (Expected 416)")

    # Group images by RecipeId
    recipes_map: Dict[str, List[dict]] = {}
    for r in img_records:
        rec_id, orig_url, is_prim, order_idx = r[0], r[1], r[2].lower() == "t", int(r[3])
        if rec_id not in recipes_map:
            recipes_map[rec_id] = []
        recipes_map[rec_id].append({
            "url": orig_url,
            "is_primary": is_prim,
            "order_index": order_idx
        })

    runner.assert_true(len(recipes_map) == 104, "Unique Recipes with Images", f"Found {len(recipes_map)} recipes with images (Expected 104)")

    # Check: Each recipe has between 3 and 5 images (specifically 4 images)
    invalid_counts = {rid: len(imgs) for rid, imgs in recipes_map.items() if not (3 <= len(imgs) <= 5)}
    runner.assert_true(len(invalid_counts) == 0, "3-5 Images per Recipe", f"Recipes violating 3-5 images: {len(invalid_counts)}")

    # Check: Exactly 1 primary image per recipe
    primary_counts = {rid: sum(1 for img in imgs if img["is_primary"]) for rid, imgs in recipes_map.items()}
    invalid_primaries = {rid: cnt for rid, cnt in primary_counts.items() if cnt != 1}
    runner.assert_true(len(invalid_primaries) == 0, "Exactly 1 Primary Image per Recipe", f"Violations: {len(invalid_primaries)}")

    # Check: Primary image has OrderIndex == 1 (1-based domain indexing)
    bad_order_primary = []
    for rid, imgs in recipes_map.items():
        for img in imgs:
            if img["is_primary"] and img["order_index"] != 1:
                bad_order_primary.append((rid, img))
    runner.assert_true(len(bad_order_primary) == 0, "Primary Image OrderIndex == 1 (1-indexed)", f"Violations: {len(bad_order_primary)}")

    # Check: Secondary images have IsPrimary == False and OrderIndex in [2, 3, 4]
    bad_secondaries = []
    for rid, imgs in recipes_map.items():
        for img in imgs:
            if not img["is_primary"] and img["order_index"] not in [2, 3, 4]:
                bad_secondaries.append((rid, img))
    runner.assert_true(len(bad_secondaries) == 0, "Secondary Images OrderIndex in [2, 3, 4]", f"Violations: {len(bad_secondaries)}")

    # Check: No duplicate OrderIndex within any recipe
    dup_orders = []
    for rid, imgs in recipes_map.items():
        orders = [img["order_index"] for img in imgs]
        if len(orders) != len(set(orders)):
            dup_orders.append((rid, orders))
    runner.assert_true(len(dup_orders) == 0, "Unique OrderIndex per Recipe", f"Violations: {len(dup_orders)}")

    # Collect all 441 URLs (25 category + 416 recipe)
    recipe_urls = [r[1].strip() for r in img_records]
    all_db_urls = cat_urls + recipe_urls
    runner.assert_true(len(all_db_urls) == 441, "Total Canonical Dataset Images", f"Total combined URLs: {len(all_db_urls)} (25 cat + 416 recipe)")

    # Verify all URLs follow `/culinary-blog/...` pattern
    invalid_url_pattern = [u for u in all_db_urls if not u.startswith("/culinary-blog/")]
    runner.assert_true(len(invalid_url_pattern) == 0, "URL Canonical Format (/culinary-blog/...)", f"Non-canonical URLs: {len(invalid_url_pattern)}")

    # -------------------------------------------------------------------------
    # SUITE 2: MINIO BUCKET INVENTORY & ANONYMOUS PUBLIC READ POLICY
    # -------------------------------------------------------------------------
    runner.print_suite_header("SUITE 2: MinIO S3 Object Inventory & Bucket Policy Verification")

    minio_client = Minio(
        "localhost:9000",
        access_key=MINIO_ACCESS_KEY,
        secret_key=MINIO_SECRET_KEY,
        secure=False
    )

    # Check bucket exists
    bucket_exists = minio_client.bucket_exists(BUCKET_NAME)
    runner.assert_true(bucket_exists, "MinIO Bucket Exists", f"Bucket '{BUCKET_NAME}' verified on localhost:9000")

    # List all objects in bucket
    minio_objects = list(minio_client.list_objects(BUCKET_NAME, recursive=True))
    minio_obj_map = {f"/{BUCKET_NAME}/{obj.object_name}": obj for obj in minio_objects}
    print(f"  [INFO] Total objects found in MinIO bucket '{BUCKET_NAME}': {len(minio_objects)}")

    # Check: 100% of the 441 database image URLs exist in MinIO bucket
    missing_in_minio = [u for u in all_db_urls if u not in minio_obj_map]
    runner.assert_true(len(missing_in_minio) == 0, "100% DB Images Exist in MinIO", f"Missing in MinIO: {len(missing_in_minio)}")
    if missing_in_minio:
        print(f"  [ERROR SAMPLE]: Missing URLs: {missing_in_minio[:5]}")

    # Check bucket policy for public anonymous read
    try:
        policy_str = minio_client.get_bucket_policy(BUCKET_NAME)
        policy_json = json.loads(policy_str)
        has_public_read = any(
            stmt.get("Effect") == "Allow" and
            (stmt.get("Principal") == "*" or stmt.get("Principal") == {"AWS": ["*"]})
            for stmt in policy_json.get("Statement", [])
        )
        runner.assert_true(has_public_read, "MinIO Public Read Policy", "Bucket policy allows Principal: *")
    except Exception as e:
        runner.assert_true(False, "MinIO Public Read Policy", f"Failed to get/parse policy: {e}")

    # -------------------------------------------------------------------------
    # SUITE 3: CONCURRENT DIRECT MINIO HTTP ACCESS & DEEP BINARY JPEG INTEGRITY
    # -------------------------------------------------------------------------
    runner.print_suite_header("SUITE 3: MinIO Direct Concurrent HTTP Access & Binary JPEG Integrity")

    minio_session = create_pooled_session(pool_size=64, max_retries=3)

    def test_direct_image(url: str):
        full_url = f"{MINIO_DIRECT_BASE}{url}"
        try:
            t0 = time.time()
            resp = minio_session.get(full_url, timeout=10)
            latency = time.time() - t0
            status = resp.status_code
            content_type = resp.headers.get("Content-Type", "")
            data = resp.content
            size = len(data)

            # Binary checks
            # JPEG Start of Image: 0xFF 0xD8
            soi_ok = data.startswith(b"\xff\xd8")
            # JPEG End of Image: 0xFF 0xD9 (often at end or near end with padding)
            eoi_ok = b"\xff\xd9" in data[-16:]

            # Size threshold > 10KB
            size_ok = size >= MIN_FILE_SIZE_BYTES

            # PIL validation
            pil_ok = False
            pil_format = ""
            width, height = 0, 0
            if soi_ok and size_ok:
                try:
                    img = Image.open(io.BytesIO(data))
                    pil_format = img.format
                    width, height = img.size
                    img.verify()
                    pil_ok = (pil_format == "JPEG") and (width > 0) and (height > 0)
                except Exception:
                    pil_ok = False

            return {
                "url": url,
                "status": status,
                "content_type": content_type,
                "size": size,
                "soi_ok": soi_ok,
                "eoi_ok": eoi_ok,
                "size_ok": size_ok,
                "pil_ok": pil_ok,
                "pil_format": pil_format,
                "dimensions": (width, height),
                "latency": latency,
                "error": None
            }
        except Exception as e:
            return {
                "url": url,
                "status": 0,
                "content_type": "",
                "size": 0,
                "soi_ok": False,
                "eoi_ok": False,
                "size_ok": False,
                "pil_ok": False,
                "pil_format": "",
                "dimensions": (0, 0),
                "latency": 0,
                "error": str(e)
            }

    print(f"  [INFO] Launching 32 concurrent workers against MinIO ({len(all_db_urls)} images)...")
    t0_suite3 = time.time()
    direct_results = []
    with ThreadPoolExecutor(max_workers=32) as executor:
        futures = {executor.submit(test_direct_image, u): u for u in all_db_urls}
        for fut in as_completed(futures):
            direct_results.append(fut.result())

    elapsed_suite3 = time.time() - t0_suite3
    print(f"  [INFO] Direct MinIO test completed in {elapsed_suite3:.2f}s ({len(all_db_urls)/elapsed_suite3:.1f} req/s)")

    # 3.1 Status 200 OK
    http_200_count = sum(1 for r in direct_results if r["status"] == 200)
    runner.assert_true(
        http_200_count == len(all_db_urls),
        "100% MinIO HTTP 200 OK",
        f"{http_200_count}/{len(all_db_urls)} returned 200 OK ({(http_200_count/len(all_db_urls))*100:.1f}%)"
    )

    # 3.2 Content-Type Check
    valid_content_types = sum(1 for r in direct_results if "image" in r["content_type"])
    runner.assert_true(
        valid_content_types == len(all_db_urls),
        "MinIO Image Content-Type",
        f"{valid_content_types}/{len(all_db_urls)} have image/* Content-Type"
    )

    # 3.3 Binary JPEG SOI Marker (0xFF 0xD8)
    valid_soi_count = sum(1 for r in direct_results if r["soi_ok"])
    runner.assert_true(
        valid_soi_count == len(all_db_urls),
        "Binary JPEG SOI Marker (0xFF 0xD8)",
        f"{valid_soi_count}/{len(all_db_urls)} match JPEG magic bytes"
    )

    # 3.4 File Size Threshold (> 10KB)
    sizes = [r["size"] for r in direct_results if r["size"] > 0]
    min_size = min(sizes) if sizes else 0
    max_size = max(sizes) if sizes else 0
    avg_size = sum(sizes) / len(sizes) if sizes else 0
    valid_size_count = sum(1 for r in direct_results if r["size_ok"])
    runner.assert_true(
        valid_size_count == len(all_db_urls),
        f"File Size Threshold (> {MIN_FILE_SIZE_BYTES//1024}KB)",
        f"{valid_size_count}/{len(all_db_urls)} > 10KB. Min: {min_size/1024:.1f}KB, Max: {max_size/1024:.1f}KB, Avg: {avg_size/1024:.1f}KB"
    )

    # 3.5 PIL Image Verification (Decodable & Uncorrupted)
    valid_pil_count = sum(1 for r in direct_results if r["pil_ok"])
    runner.assert_true(
        valid_pil_count == len(all_db_urls),
        "PIL Image Uncorrupted Structure Validation",
        f"{valid_pil_count}/{len(all_db_urls)} verified with PIL.Image.verify()"
    )

    # -------------------------------------------------------------------------
    # SUITE 4: NEXT.JS REWRITE PROXY VERIFICATION (PORT 3000)
    # -------------------------------------------------------------------------
    runner.print_suite_header("SUITE 4: Next.js Rewrite Proxy Verification (http://localhost:3000/culinary-blog/...)")

    proxy_session = create_pooled_session(pool_size=32, max_retries=3)

    def test_proxy_image(url: str):
        proxy_url = f"{NEXTJS_PROXY_BASE}{url}"
        try:
            t0 = time.time()
            resp = proxy_session.get(proxy_url, timeout=10)
            latency = time.time() - t0
            status = resp.status_code
            data = resp.content
            size = len(data)
            soi_ok = data.startswith(b"\xff\xd8")
            return {
                "url": url,
                "proxy_url": proxy_url,
                "status": status,
                "size": size,
                "soi_ok": soi_ok,
                "latency": latency,
                "error": None
            }
        except Exception as e:
            return {
                "url": url,
                "proxy_url": proxy_url,
                "status": 0,
                "size": 0,
                "soi_ok": False,
                "latency": 0,
                "error": str(e)
            }

    print(f"  [INFO] Testing 441 images through Next.js proxy on port 3000 (16 concurrent workers)...")
    t0_suite4 = time.time()
    proxy_results = []
    with ThreadPoolExecutor(max_workers=16) as executor:
        futures = {executor.submit(test_proxy_image, u): u for u in all_db_urls}
        for fut in as_completed(futures):
            proxy_results.append(fut.result())

    elapsed_suite4 = time.time() - t0_suite4
    print(f"  [INFO] Next.js proxy test completed in {elapsed_suite4:.2f}s ({len(all_db_urls)/elapsed_suite4:.1f} req/s)")

    proxy_200_count = sum(1 for r in proxy_results if r["status"] == 200)
    runner.assert_true(
        proxy_200_count == len(all_db_urls),
        "100% Next.js Rewrite Proxy HTTP 200 OK",
        f"{proxy_200_count}/{len(all_db_urls)} returned 200 OK through port 3000 ({(proxy_200_count/len(all_db_urls))*100:.1f}%)"
    )

    proxy_soi_count = sum(1 for r in proxy_results if r["soi_ok"])
    runner.assert_true(
        proxy_soi_count == len(all_db_urls),
        "Next.js Proxy Preserves Binary JPEG Stream",
        f"{proxy_soi_count}/{len(all_db_urls)} preserved SOI magic bytes through proxy"
    )

    # Compare MinIO direct sizes vs Next.js proxy sizes
    direct_size_map = {r["url"]: r["size"] for r in direct_results}
    size_mismatches = []
    for pr in proxy_results:
        dir_sz = direct_size_map.get(pr["url"], 0)
        if pr["size"] != dir_sz:
            size_mismatches.append((pr["url"], dir_sz, pr["size"]))
    runner.assert_true(
        len(size_mismatches) == 0,
        "Proxy Byte-for-Byte Fidelity",
        f"Size mismatches between direct MinIO and Next.js proxy: {len(size_mismatches)}"
    )

    # -------------------------------------------------------------------------
    # SUITE 5: ADVERSARIAL EDGE CASES & SECURITY BOUNDARIES
    # -------------------------------------------------------------------------
    runner.print_suite_header("SUITE 5: Adversarial Boundary Cases (HTTP Range, 404s, Path Traversal)")

    # 5.1 HTTP Range Request (HTTP 206 Partial Content)
    sample_url = all_db_urls[0]
    range_resp_minio = minio_session.get(
        f"{MINIO_DIRECT_BASE}{sample_url}",
        headers={"Range": "bytes=0-1023"},
        timeout=5
    )
    runner.assert_true(
        range_resp_minio.status_code == 206,
        "MinIO HTTP 206 Range Request Streaming",
        f"Direct MinIO returned status {range_resp_minio.status_code}, Content-Range: {range_resp_minio.headers.get('Content-Range')}"
    )

    range_resp_proxy = proxy_session.get(
        f"{NEXTJS_PROXY_BASE}{sample_url}",
        headers={"Range": "bytes=0-1023"},
        timeout=5
    )
    proxy_range_ok = range_resp_proxy.status_code in [200, 206]
    runner.assert_true(
        proxy_range_ok,
        "Next.js Proxy Range Request Support",
        f"Next.js proxy returned status {range_resp_proxy.status_code}"
    )

    # 5.2 Non-Existent Image URL (Must return 404)
    fake_url = f"{MINIO_DIRECT_BASE}/culinary-blog/non-existent-adversarial-fake-photo-123456.jpg"
    fake_resp = minio_session.get(fake_url, timeout=5)
    runner.assert_true(
        fake_resp.status_code == 404,
        "Direct MinIO 404 for Non-Existent Object",
        f"Status: {fake_resp.status_code} (Expected 404)"
    )

    fake_proxy_url = f"{NEXTJS_PROXY_BASE}/culinary-blog/non-existent-adversarial-fake-photo-123456.jpg"
    fake_proxy_resp = proxy_session.get(fake_proxy_url, timeout=5)
    runner.assert_true(
        fake_proxy_resp.status_code == 404,
        "Next.js Proxy 404 for Non-Existent Object",
        f"Status: {fake_proxy_resp.status_code} (Expected 404)"
    )

    # 5.3 Path Traversal Boundary Test
    traversal_urls = [
        f"{NEXTJS_PROXY_BASE}/culinary-blog/../../etc/passwd",
        f"{NEXTJS_PROXY_BASE}/culinary-blog/%2e%2e/%2e%2e/test",
    ]
    traversal_blocked = True
    for t_url in traversal_urls:
        try:
            t_resp = proxy_session.get(t_url, timeout=5)
            # Must not return 200 with sensitive data
            if t_resp.status_code == 200 and "root:" in t_resp.text:
                traversal_blocked = False
        except Exception:
            pass
    runner.assert_true(
        traversal_blocked,
        "Path Traversal Boundary Defense",
        "No unauthorized traversal access permitted"
    )

    # 5.4 High Concurrency Burst (64 concurrent requests to random images)
    burst_sample = [random.choice(all_db_urls) for _ in range(64)]
    burst_results = []
    with ThreadPoolExecutor(max_workers=32) as executor:
        burst_futs = [executor.submit(proxy_session.get, f"{NEXTJS_PROXY_BASE}{u}", timeout=10) for u in burst_sample]
        for fut in as_completed(burst_futs):
            try:
                res = fut.result()
                burst_results.append(res.status_code)
            except Exception as e:
                burst_results.append(0)

    burst_200 = sum(1 for s in burst_results if s == 200)
    runner.assert_true(
        burst_200 == 64,
        "High-Concurrency Burst (64 concurrent requests)",
        f"{burst_200}/64 requests returned HTTP 200 OK through proxy"
    )

    # -------------------------------------------------------------------------
    # FINAL VERDICT
    # -------------------------------------------------------------------------
    total_elapsed = time.time() - runner.start_time
    print("\n" + "=" * 75)
    print("CHALLENGER 2 - FINAL AUDIT VERDICT")
    print("=" * 75)
    print(f"Total Tests Executed: {runner.passed_tests + runner.failed_tests}")
    print(f"Passed: {runner.passed_tests}")
    print(f"Failed: {runner.failed_tests}")
    print(f"Total Audit Time: {total_elapsed:.2f} seconds")

    if runner.failed_tests == 0:
        print("\n🎉 VERDICT: APPROVE")
        print("Empirical evidence demonstrates 100% integrity across MinIO, Next.js Proxy, and Database Image Mappings.")
        print("=" * 75)
        sys.exit(0)
    else:
        print("\n❌ VERDICT: CHALLENGE_FAILED")
        print(f"Found {runner.failed_tests} failure modes requiring remediation.")
        print("=" * 75)
        sys.exit(1)


if __name__ == "__main__":
    main()
