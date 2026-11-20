import io
import json
import math
import sys
import requests
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

MINIO_BASE = "http://localhost:9000/culinary-blog"
MANIFEST_PATH = "scripts/image_source_manifest.json"

with open(MANIFEST_PATH, 'r', encoding='utf-8') as f:
    manifest = json.load(f)

image_entries = manifest.get('images', {})
print(f"Total mapped images in manifest: {len(image_entries)}")

categories_dict = manifest.get('categories', {})
recipes_dict = manifest.get('recipes', {})

print(f"Categories in manifest: {len(categories_dict)}")
print(f"Recipes in manifest: {len(recipes_dict)}")

# Group images by type
category_imgs = [k for k in image_entries.keys() if 'categories/' in k]
cover_imgs = [k for k in image_entries.keys() if 'cover.jpg' in k]
gallery_imgs = [k for k in image_entries.keys() if 'gallery-' in k]
step_imgs = [k for k in image_entries.keys() if '/steps/' in k]

print(f"Category banners: {len(category_imgs)}")
print(f"Recipe covers: {len(cover_imgs)} (Unique: {len(set(cover_imgs))})")
print(f"Gallery images: {len(gallery_imgs)}")
print(f"Step illustrations: {len(step_imgs)}")

assert len(cover_imgs) == len(set(cover_imgs)), "Duplicate cover URLs detected!"

# Select 30 representative samples across all 4 types
sample_keys = []
sample_keys.extend(category_imgs[:5])
sample_keys.extend(cover_imgs[:10])
sample_keys.extend(gallery_imgs[:5])
sample_keys.extend(step_imgs[:10])

def compute_entropy(img: Image.Image) -> float:
    gray = img.convert('L')
    hist = gray.histogram()
    total = sum(hist)
    entropy = 0.0
    for count in hist:
        if count > 0:
            p = count / total
            entropy -= p * math.log2(p)
    return entropy

all_sizes = []
entropies = []
dimensions = []

print(f"\nAuditing {len(sample_keys)} sample images for dimensions, file size, entropy, and photographic authenticity...")

for idx, key in enumerate(sample_keys):
    clean_path = key.replace('/culinary-blog/', '').lstrip('/')
    url = f"{MINIO_BASE}/{clean_path}"
    res = requests.get(url, timeout=10)
    assert res.status_code == 200, f"Failed HTTP {res.status_code} for {url}"
    data = res.content
    size_kb = len(data) / 1024.0
    all_sizes.append(size_kb)

    # Verify Pillow
    img = Image.open(io.BytesIO(data))
    w, h = img.size
    dimensions.append((w, h))

    ent = compute_entropy(img)
    entropies.append(ent)

    src = image_entries.get(key, image_entries.get(f"/{clean_path}", 'N/A'))
    # Truncate src
    src_display = src[:50] + "..." if len(src) > 50 else src
    print(f" [{idx+1:02d}] {clean_path[:42]:<42} | {size_kb:6.1f} KB | {w}x{h} | Ent: {ent:.2f} | Src: {src_display}")

print("\n--- Summary of Forensic Image Audit ---")
print(f"Total Sample Audited: {len(sample_keys)}")
print(f"Min Size: {min(all_sizes):.1f} KB, Max Size: {max(all_sizes):.1f} KB, Avg Size: {sum(all_sizes)/len(all_sizes):.1f} KB")
print(f"Min Entropy: {min(entropies):.2f}, Max Entropy: {max(entropies):.2f}, Avg Entropy: {sum(entropies)/len(entropies):.2f}")
print(f"Are all sizes > 10 KB? {all(s > 10 for s in all_sizes)}")
print(f"Are all widths >= 400? {all(w >= 400 for w, h in dimensions)}")
print(f"Are all entropies > 6.0 (genuine photo, rich variance)? {all(e > 6.0 for e in entropies)}")

# Now let's audit the showcase recipe specifically:
pho_recipe = next((v for k, v in recipes_dict.items() if v.get('slug') == 'pho-bo-tai-lan-chuan-vi-ha-thanh'), None)
if pho_recipe:
    print(f"\n--- Showcase Dish Media Audit: {pho_recipe.get('title')} ---")
    cover_item = pho_recipe.get('cover')
    print(f"Cover image: {cover_item}")
    for s_idx, s_item in enumerate(pho_recipe.get('steps', [])):
        print(f"Step {s_idx+1} image: {s_item}")
