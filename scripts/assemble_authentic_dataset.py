import json, os, sys, uuid, re

if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET_PATH = os.path.join(REPO_ROOT, "backend", "src", "Infrastructure", "Data", "Datasets", "recipes_master_dataset.json")
MANIFEST_PATH = os.path.join(REPO_ROOT, "scripts", "image_source_manifest.json")
SCRARED_PATH = os.path.join(REPO_ROOT, "scripts", "scraped_verified_recipes.json")

CATEGORY_NAMESPACE = uuid.UUID("7d91244e-128a-4d76-9f89-8d8a7c295b32")
RECIPE_NAMESPACE = uuid.UUID("3c8e4345-9831-4c62-87f5-dc977b38cb71")
IMAGE_NAMESPACE = uuid.UUID("a5183492-4f81-432d-9a03-7cb52199b001")

def slugify(text: str) -> str:
    text = text.lower()
    # Vietnamese accents removal
    accents = {
        'a': 'áàảãạăắằẳẵặâấầẩẫậ',
        'd': 'đ',
        'e': 'éèẻẽẹêếềểễệ',
        'i': 'íìỉĩị',
        'o': 'óòỏõọôốồổỗộơớờởỡợ',
        'u': 'úùủũụưứừửữự',
        'y': 'ýỳỷỹỵ'
    }
    for non_accent, char_group in accents.items():
        for char in char_group:
            text = text.replace(char, non_accent)
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text).strip('-')
    return text[:60]

CATEGORY_DEFS = [
    {
        "slug": "mon-khai-vi",
        "name": "Món Khai Vị",
        "description": "Các món gỏi, chả giò, nem rán nhẹ nhàng kích thích vị giác trước bữa ăn.",
        "orderIndex": 1,
        "bannerUrl": "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80"
    },
    {
        "slug": "mon-chinh",
        "name": "Món Chính",
        "description": "Các món ăn chính đậm đà, giàu dinh dưỡng cho bữa cơm gia đình.",
        "orderIndex": 2,
        "bannerUrl": "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1200&q=80"
    },
    {
        "slug": "canh-sup",
        "name": "Canh - Súp",
        "description": "Các món canh chua, canh thanh mát và súp bổ dưỡng cho mọi lứa tuổi.",
        "orderIndex": 3,
        "bannerUrl": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80"
    },
    {
        "slug": "mon-kho",
        "name": "Món Kho",
        "description": "Các món thịt kho, cá kho tộ đậm đà thơm nức mùi nước màu và tiêu ớt.",
        "orderIndex": 4,
        "bannerUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80"
    },
    {
        "slug": "mon-xao",
        "name": "Món Xào",
        "description": "Các món xào giòn ngọt từ rau củ, hải sản và thịt bò tươi ngon.",
        "orderIndex": 5,
        "bannerUrl": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80"
    },
    {
        "slug": "mon-nuong",
        "name": "Món Nướng",
        "description": "Các món nướng than hoa, nồi chiên không dầu thơm lừng hấp dẫn.",
        "orderIndex": 6,
        "bannerUrl": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80"
    },
    {
        "slug": "mon-chien",
        "name": "Món Chiên Rán",
        "description": "Các món chiên vàng giòn rụm, giòn rụm bên ngoài và mềm mọng bên trong.",
        "orderIndex": 7,
        "bannerUrl": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80"
    },
    {
        "slug": "mon-hap-luoc",
        "name": "Món Hấp & Luộc",
        "description": "Các món hấp cách thủy giữ trọn độ ngọt tự nhiên thanh đạm.",
        "orderIndex": 8,
        "bannerUrl": "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=1200&q=80"
    },
    {
        "slug": "bun-pho-mi",
        "name": "Bún - Phở - Mì",
        "description": "Tinh hoa món nước Việt Nam từ phở bò, bún chả, bún bò đến hủ tiếu đậm đà.",
        "orderIndex": 9,
        "bannerUrl": "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1200&q=80"
    },
    {
        "slug": "mon-cuon-goi",
        "name": "Món Cuốn & Nộm",
        "description": "Món cuốn bánh tráng, nộm chua ngọt kèm rau sống tươi mát thanh nhiệt.",
        "orderIndex": 10,
        "bannerUrl": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80"
    },
    {
        "slug": "mon-lau",
        "name": "Món Lẩu",
        "description": "Các nồi lẩu nghi ngút khói chua cay mặn ngọt cho các buổi sum họp.",
        "orderIndex": 11,
        "bannerUrl": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80"
    },
    {
        "slug": "mon-chay",
        "name": "Món Chay",
        "description": "Món ăn thuần chay thanh tịnh, dinh dưỡng từ nấm, đậu hũ và rau củ tươi.",
        "orderIndex": 12,
        "bannerUrl": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80"
    },
    {
        "slug": "trang-mieng",
        "name": "Tráng Miệng & Bánh",
        "description": "Các món chè ngọt thanh, bánh truyền thống bùi béo tráng miệng hoàn hảo.",
        "orderIndex": 13,
        "bannerUrl": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80"
    },
    {
        "slug": "do-uong",
        "name": "Đồ Uống & Giải Khát",
        "description": "Cà phê, trà trái cây và sinh tố giải nhiệt thanh mát cho cả nhà.",
        "orderIndex": 14,
        "bannerUrl": "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1200&q=80"
    }
]

def main():
    print("=" * 70)
    print("🚀 ASSEMBLING 100% AUTHENTIC MASTER DATASET & MINIO IMAGE MANIFEST")
    print("=" * 70)

    with open(SCRARED_PATH, "r", encoding="utf-8") as f:
        raw_recipes = json.load(f)

    # 1. Process Categories
    categories = []
    category_id_map = {}
    manifest_images = {}

    for cat in CATEGORY_DEFS:
        slug = cat["slug"]
        cat_id = str(uuid.uuid5(CATEGORY_NAMESPACE, f"category-{slug}"))
        category_id_map[slug] = cat_id
        minio_banner_path = f"/culinary-blog/categories/{slug}.jpg"
        
        categories.append({
            "id": cat_id,
            "name": cat["name"],
            "slug": slug,
            "description": cat["description"],
            "imageUrl": minio_banner_path,
            "orderIndex": cat["orderIndex"],
            "displayOrder": cat["orderIndex"]
        })
        manifest_images[minio_banner_path] = cat["bannerUrl"]

    # 2. Process Recipes
    recipes = []
    seen_slugs = set()

    for idx, r in enumerate(raw_recipes):
        title = r["title"]
        base_slug = slugify(title)
        slug = base_slug
        suffix = 2
        while slug in seen_slugs:
            slug = f"{base_slug}-{suffix}"
            suffix += 1
        seen_slugs.add(slug)

        recipe_id = str(uuid.uuid5(RECIPE_NAMESPACE, f"recipe-{slug}"))
        cat_slug = r["categorySlug"]
        cat_id = category_id_map[cat_slug]

        # Ingredients (quantified)
        ingredients = []
        for i_idx, ing in enumerate(r["ingredients"]):
            ingredients.append({
                "name": ing["name"],
                "quantity": ing["quantity"],
                "amount": ing["quantity"],
                "unit": ing["unit"],
                "notes": ing.get("notes", ""),
                "orderIndex": i_idx
            })

        # Steps
        steps = []
        for s_idx, s in enumerate(r["steps"]):
            s_num = s_idx + 1
            minio_step_path = f"/culinary-blog/recipes/{recipe_id}/steps/{s_num}.jpg"
            steps.append({
                "stepNumber": s_num,
                "title": s["title"],
                "description": s["description"],
                "instruction": s["description"],
                "timerMinutes": s.get("timerMinutes", 5),
                "timerSeconds": s.get("timerMinutes", 5) * 60,
                "tip": "",
                "imageUrl": minio_step_path,
                "orderIndex": s_idx
            })
            manifest_images[minio_step_path] = s["imageUrl"]

        # Cover image
        minio_cover_path = f"/culinary-blog/recipes/{recipe_id}/cover.jpg"
        manifest_images[minio_cover_path] = r["coverUrl"]

        images = [
            {
                "id": str(uuid.uuid5(IMAGE_NAMESPACE, f"{recipe_id}-cover")),
                "url": minio_cover_path,
                "originalUrl": minio_cover_path,
                "mediumUrl": minio_cover_path,
                "thumbnailUrl": minio_cover_path,
                "alt": f"Món {title} thơm ngon chuẩn vị",
                "altText": f"Món {title} thơm ngon chuẩn vị",
                "isPrimary": True,
                "orderIndex": 0
            }
        ]

        # Markdown instructions
        instructions_md = (
            f"### Hướng dẫn cách nấu: {title}\n\n" +
            "\n\n".join([
                f"**Bước {s['stepNumber']}: {s['title']}**\n{s['description']}"
                for s in steps
            ])
        )

        recipes.append({
            "id": recipe_id,
            "title": title,
            "slug": slug,
            "description": r["description"],
            "instructions": instructions_md,
            "servings": r.get("servings", 4),
            "prepTimeMinutes": r.get("prepTimeMinutes", 20),
            "cookTimeMinutes": r.get("cookTimeMinutes", 30),
            "difficulty": r.get("difficulty", "Medium"),
            "status": "Published",
            "isPublished": True,
            "categoryId": cat_id,
            "categorySlug": cat_slug,
            "authorId": "admin@culinaryblog.com",
            "ingredients": ingredients,
            "steps": steps,
            "images": images,
            "orderIndex": idx
        })

    master_dataset = {
        "categories": categories,
        "recipes": recipes
    }

    # Write recipes_master_dataset.json
    with open(DATASET_PATH, "w", encoding="utf-8") as f:
        json.dump(master_dataset, f, ensure_ascii=False, indent=2)
    print(f"✅ Generated master dataset with {len(categories)} categories and {len(recipes)} recipes at: {DATASET_PATH}")

    # Write image_source_manifest.json
    manifest = {
        "totalImages": len(manifest_images),
        "images": manifest_images
    }
    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    print(f"✅ Generated image manifest with {len(manifest_images)} images at: {MANIFEST_PATH}")

if __name__ == "__main__":
    main()
