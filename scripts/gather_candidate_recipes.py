import requests, sys, re, json, os
from bs4 import BeautifulSoup

if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'}

CATEGORY_SOURCES = [
    {
        "slug": "mon-khai-vi",
        "name": "Món Khai Vị",
        "desc": "Các món gỏi, chả giò, nem rán nhẹ nhàng kích thích vị giác trước bữa ăn.",
        "search_pages": ["/vao-bep/mon-goi-tron", "/vao-bep/mon-cuon-tron"],
        "extra_links": [
            "/vao-bep/cach-lam-cha-gio-mien-nam-nhan-tom-thit-ngon-gion-tan-de-dai-24366"
        ],
        "target_count": 4
    },
    {
        "slug": "mon-chinh",
        "name": "Món Chính",
        "desc": "Các món ăn chính đậm đà, giàu dinh dưỡng cho bữa cơm gia đình.",
        "search_pages": ["/vao-bep/mon-tu-bo", "/vao-bep/mon-tu-ga"],
        "extra_links": [
            "/vao-bep/cach-lam-thit-kho-tram-xanh-thom-ngon-bui-beo-cuc-hao-com-cho-24473"
        ],
        "target_count": 4
    },
    {
        "slug": "canh-sup",
        "name": "Canh - Súp",
        "desc": "Các món canh chua, canh thanh mát và súp bổ dưỡng cho mọi lứa tuổi.",
        "search_pages": ["/vao-bep/mon-canh"],
        "extra_links": [
            "/vao-bep/cach-lam-canh-chua-ca-ngu-thom-ngon-khong-tanh-chuan-vi-mien-24504"
        ],
        "target_count": 4
    },
    {
        "slug": "mon-kho",
        "name": "Món Kho",
        "desc": "Các món thịt kho, cá kho tộ đậm đà thơm nức mùi nước màu và tiêu ớt.",
        "search_pages": ["/vao-bep/mon-kho"],
        "extra_links": [],
        "target_count": 4
    },
    {
        "slug": "mon-xao",
        "name": "Món Xào",
        "desc": "Các món xào giòn ngọt từ rau củ, hải sản và thịt bò tươi ngon.",
        "search_pages": ["/vao-bep/mon-xao"],
        "extra_links": [
            "/vao-bep/cach-lam-dau-bap-xao-thit-bo-mem-mong-va-bi-quyet-xao-dau-bap-24516"
        ],
        "target_count": 4
    },
    {
        "slug": "mon-nuong",
        "name": "Món Nướng",
        "desc": "Các món nướng than hoa, nồi chiên không dầu thơm lừng hấp dẫn.",
        "search_pages": ["/vao-bep/mon-nuong"],
        "extra_links": [],
        "target_count": 4
    },
    {
        "slug": "mon-chien",
        "name": "Món Chiên Rán",
        "desc": "Các món chiên vàng giòn rụm, giòn rụm bên ngoài và mềm mọng bên trong.",
        "search_pages": ["/vao-bep/mon-chien"],
        "extra_links": [
            "/vao-bep/cach-lam-cha-tom-thit-chien-vang-gion-rum-cuc-ngon-hap-dan-24506"
        ],
        "target_count": 4
    },
    {
        "slug": "mon-hap-luoc",
        "name": "Món Hấp & Luộc",
        "desc": "Các món hấp cách thủy giữ trọn độ ngọt tự nhiên thanh đạm.",
        "search_pages": ["/vao-bep/mon-hap"],
        "extra_links": [],
        "target_count": 4
    },
    {
        "slug": "bun-pho-mi",
        "name": "Bún - Phở - Mì",
        "desc": "Tinh hoa món nước Việt Nam từ phở bò, bún chả, bún bò đến hủ tiếu đậm đà.",
        "search_pages": ["/vao-bep/mon-nuoc"],
        "extra_links": [
            "/vao-bep/cach-lam-pho-bo-tron-chua-ngot-ngon-mieng-hap-dan-chuan-vi-12755",
            "/vao-bep/cach-lam-bun-cha-chan-thom-ngon-dam-da-tai-nha-chuan-vi-nhu-24433"
        ],
        "target_count": 4
    },
    {
        "slug": "mon-cuon-goi",
        "name": "Món Cuốn & Nộm",
        "desc": "Món cuốn bánh tráng, nộm chua ngọt kèm rau sống tươi mát thanh nhiệt.",
        "search_pages": ["/vao-bep/mon-cuon-tron", "/vao-bep/mon-goi-tron"],
        "extra_links": [],
        "target_count": 4
    },
    {
        "slug": "mon-lau",
        "name": "Món Lẩu",
        "desc": "Các nồi lẩu nghi ngút khói chua cay mặn ngọt cho các buổi sum họp.",
        "search_pages": ["/vao-bep/mon-lau"],
        "extra_links": [],
        "target_count": 4
    },
    {
        "slug": "mon-chay",
        "name": "Món Chay",
        "desc": "Món ăn thuần chay thanh tịnh, dinh dưỡng từ nấm, đậu hũ và rau củ tươi.",
        "search_pages": ["/vao-bep/mon-chay"],
        "extra_links": [],
        "target_count": 4
    },
    {
        "slug": "trang-mieng",
        "name": "Tráng Miệng & Bánh",
        "desc": "Các món chè ngọt thanh, bánh truyền thống bùi béo tráng miệng hoàn hảo.",
        "search_pages": ["/vao-bep/mon-che", "/vao-bep/mon-banh"],
        "extra_links": [],
        "target_count": 4
    },
    {
        "slug": "do-uong",
        "name": "Đồ Uống & Giải Khát",
        "desc": "Cà phê, trà trái cây và sinh tố giải nhiệt thanh mát cho cả nhà.",
        "search_pages": ["/vao-bep/thuc-uong", "/vao-bep/tra-sua", "/vao-bep/sinh-to"],
        "extra_links": [],
        "target_count": 4
    }
]

def parse_time_text(text):
    if not text:
        return 20
    hours = 0
    mins = 0
    h_m = re.search(r'(\d+)\s*(?:giờ|h)', text)
    if h_m:
        hours = int(h_m.group(1))
    m_m = re.search(r'(\d+)\s*(?:phút|p|’|\')', text)
    if m_m:
        mins = int(m_m.group(1))
    total = hours * 60 + mins
    return total if total > 0 else 20

def parse_recipe_detail(url):
    full_url = url if url.startswith('http') else f"https://www.dienmayxanh.com{url}"
    try:
        r = requests.get(full_url, headers=headers, timeout=10)
        if r.status_code != 200:
            return None
        soup = BeautifulSoup(r.text, 'html.parser')
        
        # Title
        h1 = soup.find('h1')
        if not h1:
            return None
        title = h1.text.strip()
        clean_title = re.sub(r'^(?:Cách làm|Cách nấu|Hướng dẫn cách làm|Bí quyết làm)\s+', '', title, flags=re.IGNORECASE).strip()
        clean_title = clean_title[0].upper() + clean_title[1:] if clean_title else title
        
        # Cover image
        og_img = soup.find('meta', property='og:image')
        cover_url = og_img['content'] if og_img else ''
        if not cover_url or 'tgdd' not in cover_url:
            return None
        # Only exclude explicit ad banners
        if any(bad in cover_url.lower() for bad in ['cooktipsnote', 'cookutensil', 'banner', 'logo', 'icon', 'chao-nhom']):
            return None

        # Prep time, cook time, difficulty
        prep_time = 20
        cook_time = 30
        difficulty = "Medium"
        for h in soup.find_all('h2'):
            txt = h.text.strip()
            if 'Chuẩn bị' in txt:
                prep_time = parse_time_text(h.parent.text)
            elif 'Chế biến' in txt:
                cook_time = parse_time_text(h.parent.text)
            elif 'Độ khó' in txt:
                diff_txt = h.parent.text.lower()
                if 'dễ' in diff_txt:
                    difficulty = "Easy"
                elif 'khó' in diff_txt:
                    difficulty = "Hard"
                else:
                    difficulty = "Medium"
                    
        # Ingredients from div.staple
        ingredients = []
        staple = soup.find(class_='staple')
        servings = 4
        if staple:
            h2_staple = staple.find('h2')
            if h2_staple:
                m_serv = re.search(r'Cho\s+(\d+)', h2_staple.text)
                if m_serv:
                    servings = max(1, min(12, int(m_serv.group(1))))
                    
            for sp in staple.find_all('span'):
                sm = sp.find('small')
                em = sp.find('em')
                qty_str = sm.text.strip() if sm else ''
                notes = em.text.strip('() ') if em else ''
                if sm:
                    sm.extract()
                if em:
                    em.extract()
                ing_name = sp.text.strip()
                if not ing_name or any(bad in ing_name.lower() for bad in ['dụng cụ', 'chảo', 'nồi']):
                    continue
                
                q_num = 1.0
                unit = "g"
                if qty_str:
                    m_num = re.search(r'(\d+(?:[.,]\d+)?)', qty_str)
                    if m_num:
                        try:
                            q_num = float(m_num.group(1).replace(',', '.'))
                        except:
                            q_num = 1.0
                    u_str = re.sub(r'[\d.,]+', '', qty_str).strip()
                    unit = u_str if u_str else "g"
                    
                ingredients.append({
                    "name": ing_name,
                    "quantity": q_num,
                    "unit": unit,
                    "notes": notes
                })

        # Need >= 5 ingredients
        if len(ingredients) < 5:
            return None

        # Description
        desc_p = soup.find('p', class_='short-desc') or (soup.find('div', class_='detail-content').find('p') if soup.find('div', class_='detail-content') else None)
        desc = desc_p.text.strip() if desc_p else f"Món {clean_title} thơm ngon, đậm đà chuẩn vị truyền thống."
        if len(desc) < 20 or 'xem ngay' in desc.lower():
            desc = f"Món {clean_title} hấp dẫn với hương vị thơm ngon đặc trưng, cách làm đơn giản chuẩn vị tại nhà."

        # Steps
        steps = []
        content = soup.find('div', class_='detail-content') or soup.find('div', class_='content-article')
        if not content:
            return None

        for h in content.find_all(['h3', 'h4']):
            h_text = h.text.strip()
            if any(bad in h_text.lower() for bad in [
                'xin lỗi', 'món ngon liên quan', 'từ khóa', 'xem thêm', 'thông tin',
                'cách chọn mua', 'dụng cụ', 'mẹo thực hiện', 'nơi mua', 'mách bạn'
            ]):
                continue

            desc_parts = []
            step_imgs = []
            sib = h.find_next_sibling()
            while sib and sib.name not in ['h2', 'h3', 'h4']:
                if sib.name == 'p':
                    p_txt = sib.text.strip()
                    if p_txt and not p_txt.startswith('Từ khóa:') and not 'Xem thêm:' in p_txt and len(p_txt) > 10:
                        desc_parts.append(p_txt)
                for img in sib.find_all('img'):
                    src = img.get('data-src') or img.get('src')
                    if src and 'cdn.tgdd.vn' in src and 'Cook' in src:
                        if any(bad in src.lower() for bad in ['cooktipsnote', 'cookutensil', 'banner', 'icon', 'chao-nhom']):
                            continue
                        step_imgs.append(src)
                sib = sib.find_next_sibling()

            if desc_parts and step_imgs:
                steps.append({
                    "title": h_text,
                    "description": ' '.join(desc_parts),
                    "imageUrl": step_imgs[0],
                    "timerMinutes": max(5, int(cook_time / max(1, len(steps) + 1)))
                })

        # Need >= 3 steps
        if len(steps) < 3:
            return None

        # Prefer final step image if it exists and looks like finished dish
        thanh_pham_steps = [s for s in steps if any(k in s['title'].lower() for k in ['thành phẩm', 'hoàn thành', 'thưởng thức'])]
        if thanh_pham_steps and thanh_pham_steps[-1].get('imageUrl'):
            cover_url = thanh_pham_steps[-1]['imageUrl']

        return {
            "sourceUrl": full_url,
            "title": clean_title,
            "originalTitle": title,
            "description": desc[:300],
            "servings": servings,
            "prepTimeMinutes": prep_time,
            "cookTimeMinutes": cook_time,
            "difficulty": difficulty,
            "coverUrl": cover_url,
            "ingredients": ingredients,
            "steps": steps
        }
    except Exception as e:
        print(f"Error parsing {url}: {e}")
        return None

def main():
    print("=" * 70)
    print("🚀 GATHERING 56 HIGH-QUALITY AUTHENTIC RECIPES FROM DIEN MAY XANH")
    print("=" * 70)
    all_selected = []
    seen_urls = set()
    seen_titles = set()

    for cat in CATEGORY_SOURCES:
        cat_slug = cat["slug"]
        cat_name = cat["name"]
        target = cat["target_count"]
        print(f"\n📂 [{cat_name}] ({cat_slug}) - Target: {target}")
        
        cat_recipes = []
        candidate_links = list(cat.get("extra_links", []))
        
        for page in cat["search_pages"]:
            page_url = f"https://www.dienmayxanh.com{page}"
            try:
                r = requests.get(page_url, headers=headers, timeout=8)
                soup = BeautifulSoup(r.text, 'html.parser')
                for a in soup.find_all('a', href=True):
                    href = a['href']
                    if '/vao-bep/cach-lam-' in href:
                        candidate_links.append(href)
            except Exception as e:
                print(f"  Error reading {page_url}: {e}")

        candidate_links = list(dict.fromkeys(candidate_links))
        print(f"  Found {len(candidate_links)} candidates. Parsing...")

        for link in candidate_links:
            if len(cat_recipes) >= target:
                break
            if link in seen_urls:
                continue

            parsed = parse_recipe_detail(link)
            if not parsed:
                continue

            if parsed["title"] in seen_titles:
                continue

            parsed["categorySlug"] = cat_slug
            parsed["categoryName"] = cat_name
            cat_recipes.append(parsed)
            seen_urls.add(link)
            seen_titles.add(parsed["title"])
            print(f"    ✓ [{len(cat_recipes)}/{target}] {parsed['title']} | Steps: {len(parsed['steps'])} | Ings: {len(parsed['ingredients'])}")

        all_selected.extend(cat_recipes)

    print(f"\n🎯 Total gathered recipes: {len(all_selected)} across {len(CATEGORY_SOURCES)} categories.")
    output_path = os.path.join(os.path.dirname(__file__), "scraped_verified_recipes.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(all_selected, f, ensure_ascii=False, indent=2)
    print(f"✅ Saved clean verified dataset to {output_path}")

if __name__ == "__main__":
    main()
