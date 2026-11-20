"""
seed_minio_authentic_images.py - Automated MinIO Image Seeding Pipeline for Culinary Blog
Milestone 2: Authentic Media Pipeline & Storage

Seeds authentic, high-quality culinary images from scripts/image_source_manifest.json
into the 'culinary-blog' bucket in MinIO (http://localhost:9000).

Features:
- Clean slate purge of all legacy/test/placeholder objects in 'culinary-blog'.
- Sets anonymous public read policy for direct offline/browser accessibility.
- Downloads authentic images from Điện Máy XANH Vào Bếp, Cookpad, and culinary CDNs.
- Disk caching with SHA-256 keys in scripts/.authentic_image_cache for resilience & speed.
- Normalizes and validates 100% of images with Pillow (ensuring valid JPEG magic bytes, >= 5 KB, RGB).
- Uploads all 988 images (25 category banners, 104 covers, 312 gallery photos, 547 step action photos)
  to exact S3 object paths with Content-Type: image/jpeg.
"""

import hashlib
import io
import json
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests
from PIL import Image
from minio import Minio
from minio.deleteobjects import DeleteObject

sys.stdout.reconfigure(encoding='utf-8')

MINIO_ENDPOINT = "localhost:9000"
MINIO_ACCESS_KEY = "minioadmin"
MINIO_SECRET_KEY = "minioadminpassword"
MINIO_BUCKET = "culinary-blog"

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST_PATH = os.path.join(BASE_DIR, "scripts", "image_source_manifest.json")
CACHE_DIR = os.path.join(BASE_DIR, "scripts", ".authentic_image_cache")
os.makedirs(CACHE_DIR, exist_ok=True)

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"


def get_url_hash(url: str) -> str:
    """Generate deterministic SHA-256 hash for cache key."""
    return hashlib.sha256(url.encode('utf-8')).hexdigest()[:24]


def download_and_normalize_image(url: str) -> bytes:
    """
    Download image from source CDN URL, validate, normalize to RGB JPEG,
    cache to disk, and return raw JPEG bytes.
    """
    cache_file = os.path.join(CACHE_DIR, f"{get_url_hash(url)}.jpg")
    
    # 1. Check local cache
    if os.path.exists(cache_file):
        try:
            with open(cache_file, "rb") as f:
                data = f.read()
            if len(data) >= 5120 and data.startswith(b"\xff\xd8\xff"):
                # Fast validation via PIL
                Image.open(io.BytesIO(data)).verify()
                return data
        except Exception:
            pass  # Corrupted cache, re-download

    # 2. Fetch from source CDN with retries
    headers = {"User-Agent": USER_AGENT}
    last_err = None
    for attempt in range(1, 4):
        try:
            resp = requests.get(url, headers=headers, timeout=15)
            if resp.status_code == 200 and len(resp.content) >= 1000:
                raw_bytes = resp.content
                # Parse and normalize to clean RGB JPEG using Pillow
                img = Image.open(io.BytesIO(raw_bytes)).convert("RGB")
                buf = io.BytesIO()
                img.save(buf, format="JPEG", quality=90, optimize=True)
                jpeg_bytes = buf.getvalue()

                # Ensure minimum size requirement
                if len(jpeg_bytes) >= 5120 and jpeg_bytes.startswith(b"\xff\xd8\xff"):
                    with open(cache_file, "wb") as f:
                        f.write(jpeg_bytes)
                    return jpeg_bytes
            else:
                last_err = f"HTTP {resp.status_code}, Length: {len(resp.content)}"
        except Exception as e:
            last_err = str(e)
        time.sleep(attempt * 0.5)

    raise RuntimeError(f"Failed to fetch valid image from {url}: {last_err}")


def clean_slate_purge_and_policy(client: Minio):
    """Cleanly purge legacy objects in bucket and set anonymous public read policy."""
    print("\n--- Phase 1: MinIO Clean Slate Purge & Bucket Setup ---")
    if not client.bucket_exists(MINIO_BUCKET):
        print(f"Bucket '{MINIO_BUCKET}' does not exist. Creating...")
        client.make_bucket(MINIO_BUCKET)
        print(f"Created bucket '{MINIO_BUCKET}'.")
    else:
        print(f"Bucket '{MINIO_BUCKET}' exists. Scanning for legacy objects to purge...")
        objects_to_delete = []
        for obj in client.list_objects(MINIO_BUCKET, recursive=True):
            objects_to_delete.append(DeleteObject(obj.object_name))

        if objects_to_delete:
            print(f"Found {len(objects_to_delete)} legacy objects. Deleting in bulk...")
            delete_errors = list(client.remove_objects(MINIO_BUCKET, objects_to_delete))
            for err in delete_errors:
                print(f"  [ERROR] Deleting {err.name}: {err.message}")
            print(f"Purged {len(objects_to_delete) - len(delete_errors)} objects. Bucket is now a clean slate.")
        else:
            print("Bucket is already clean (0 objects).")

    # Set public anonymous read policy
    policy = f"""{{
        "Version": "2012-10-17",
        "Statement": [
            {{
                "Effect": "Allow",
                "Principal": {{"AWS": ["*"]}},
                "Action": ["s3:GetObject"],
                "Resource": ["arn:aws:s3:::{MINIO_BUCKET}/*"]
            }}
        ]
    }}"""
    client.set_bucket_policy(MINIO_BUCKET, policy)
    print("Enforced anonymous public read policy on bucket.")


def main():
    print("=" * 70)
    print("🚀 Starting Authentic MinIO Image Seeding Pipeline")
    print(f"Endpoint: http://{MINIO_ENDPOINT} | Bucket: {MINIO_BUCKET}")
    print("=" * 70)

    # 1. Connect to MinIO
    try:
        client = Minio(MINIO_ENDPOINT, access_key=MINIO_ACCESS_KEY, secret_key=MINIO_SECRET_KEY, secure=False)
        # Test connection
        client.list_buckets()
    except Exception as e:
        print(f"FATAL: Cannot connect to MinIO on {MINIO_ENDPOINT}: {e}")
        sys.exit(1)

    # 2. Clean slate purge & bucket setup
    clean_slate_purge_and_policy(client)

    # 3. Load Image Source Manifest
    print(f"\n--- Phase 2: Loading Manifest ({MANIFEST_PATH}) ---")
    if not os.path.exists(MANIFEST_PATH):
        print(f"FATAL: Manifest file not found at {MANIFEST_PATH}")
        sys.exit(1)

    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    images_map = manifest.get("images", {})
    total_images = len(images_map)
    unique_urls = sorted(list(set(images_map.values())))

    print(f"Loaded manifest with {total_images} mapped MinIO image paths.")
    print(f"Found {len(unique_urls)} unique source CDN URLs.")

    # 4. Pre-fetch and cache unique source images
    print(f"\n--- Phase 3: Pre-fetching {len(unique_urls)} Unique Source Images ---")
    cached_images = {}
    t_fetch_start = time.time()
    
    with ThreadPoolExecutor(max_workers=16) as executor:
        future_to_url = {executor.submit(download_and_normalize_image, u): u for u in unique_urls}
        completed = 0
        for future in as_completed(future_to_url):
            url = future_to_url[future]
            completed += 1
            try:
                data = future.result()
                cached_images[url] = data
                if completed % 25 == 0 or completed == len(unique_urls):
                    pct = (completed / len(unique_urls)) * 100
                    print(f"  [{completed}/{len(unique_urls)}] ({pct:5.1f}%) Cached {url[:60]}... ({len(data)//1024} KB)")
            except Exception as e:
                print(f"  [ERROR] Failed {url}: {e}")
                sys.exit(1)

    fetch_duration = time.time() - t_fetch_start
    print(f"Successfully fetched & cached all {len(cached_images)} unique images in {fetch_duration:.2f}s.")

    # 5. Upload 988 images to MinIO
    print(f"\n--- Phase 4: Ingesting {total_images} Images into MinIO '{MINIO_BUCKET}' ---")
    t_upload_start = time.time()

    def upload_single_image(minio_path: str, source_url: str):
        # minio_path: /culinary-blog/categories/slug.jpg or /culinary-blog/recipes/id/cover.jpg
        # object_key: categories/slug.jpg or recipes/id/cover.jpg
        object_key = minio_path.lstrip("/").replace(f"{MINIO_BUCKET}/", "", 1)
        data = cached_images[source_url]
        client.put_object(
            bucket_name=MINIO_BUCKET,
            object_name=object_key,
            data=io.BytesIO(data),
            length=len(data),
            content_type="image/jpeg"
        )
        return object_key, len(data)

    uploaded_count = 0
    total_bytes = 0

    with ThreadPoolExecutor(max_workers=16) as executor:
        future_to_path = {executor.submit(upload_single_image, path, url): path for path, url in images_map.items()}
        for future in as_completed(future_to_path):
            path = future_to_path[future]
            try:
                obj_key, size = future.result()
                uploaded_count += 1
                total_bytes += size
                if uploaded_count % 100 == 0 or uploaded_count == total_images:
                    pct = (uploaded_count / total_images) * 100
                    print(f"  [{uploaded_count}/{total_images}] ({pct:5.1f}%) Uploaded '{obj_key}' ({size//1024} KB)")
            except Exception as e:
                print(f"  [ERROR] Upload failed for {path}: {e}")
                sys.exit(1)

    upload_duration = time.time() - t_upload_start

    print("\n" + "=" * 70)
    print("🎉 Authentic MinIO Image Seeding Completed Successfully!")
    print("=" * 70)
    print(f"Total Images Seeded:    {uploaded_count}/{total_images} (100.0%)")
    print(f"Total Transferred:      {total_bytes / (1024 * 1024):.2f} MB")
    print(f"Average Image Size:     {total_bytes / uploaded_count / 1024:.2f} KB")
    print(f"Pre-fetch Time:         {fetch_duration:.2f}s")
    print(f"Upload Time:            {upload_duration:.2f}s")
    print(f"Total Pipeline Time:    {fetch_duration + upload_duration:.2f}s")
    print(f"Bucket:                 http://{MINIO_ENDPOINT}/{MINIO_BUCKET}/")
    print("=" * 70)


if __name__ == "__main__":
    main()
