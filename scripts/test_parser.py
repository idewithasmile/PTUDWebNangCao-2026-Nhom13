import requests, sys, re
from bs4 import BeautifulSoup

if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'}

def parse_dmx_recipe(url):
    r = requests.get(url, headers=headers, timeout=10)
    if r.status_code != 200:
        return None
    soup = BeautifulSoup(r.text, 'html.parser')
    
    title_el = soup.find('h1')
    title = title_el.text.strip() if title_el else ''
    
    # cover
    og_img = soup.find('meta', property='og:image')
    cover_url = og_img['content'] if og_img else ''
    
    # ingredients
    ingredients = []
    ing_sec = soup.find('div', class_='list-ingredient') or soup.find('ul', class_='list-ingredient')
    if not ing_sec:
        for h in soup.find_all(['h2', 'h3']):
            if 'nguyên liệu' in h.text.lower():
                sib = h.find_next_sibling()
                while sib and sib.name not in ['h2', 'h3']:
                    for li in sib.find_all('li'):
                        text = li.text.strip()
                        if text:
                            ingredients.append(text)
                    sib = sib.find_next_sibling()
                break
    else:
        for li in ing_sec.find_all('li'):
            text = li.text.strip()
            if text:
                ingredients.append(text)
                
    # steps
    steps = []
    content = soup.find('div', class_='detail-content') or soup.find('div', class_='content-article')
    if content:
        for h in content.find_all(['h3', 'h4']):
            h_text = h.text.strip()
            if any(bad in h_text.lower() for bad in ['xin lỗi', 'món ngon liên quan', 'từ khóa', 'xem thêm', 'thông tin', 'cách chọn mua', 'dụng cụ']):
                continue
            
            desc_parts = []
            step_imgs = []
            sib = h.find_next_sibling()
            while sib and sib.name not in ['h2', 'h3', 'h4']:
                if sib.name == 'p':
                    p_txt = sib.text.strip()
                    if p_txt and not p_txt.startswith('Từ khóa:') and not 'Xem thêm:' in p_txt:
                        desc_parts.append(p_txt)
                for img in sib.find_all('img'):
                    src = img.get('data-src') or img.get('src')
                    if src and 'cdn.tgdd.vn' in src:
                        if any(bad in src for bad in ['CookTipsNote', 'CookUtensilandNotes', 'banner', 'icon', 'common']):
                            continue
                        step_imgs.append(src)
                sib = sib.find_next_sibling()
            
            if desc_parts or step_imgs:
                steps.append({
                    'title': h_text,
                    'desc': ' '.join(desc_parts),
                    'images': step_imgs
                })
                
    return {
        'title': title,
        'cover': cover_url,
        'ingredients_count': len(ingredients),
        'ingredients_sample': ingredients[:3],
        'steps_count': len(steps),
        'steps': steps
    }

urls = [
    'https://www.dienmayxanh.com/vao-bep/cach-lam-cha-gio-mien-nam-nhan-tom-thit-ngon-gion-tan-de-dai-24366',
    'https://www.dienmayxanh.com/vao-bep/cach-lam-bun-cha-chan-thom-ngon-dam-da-tai-nha-chuan-vi-nhu-24433',
    'https://www.dienmayxanh.com/vao-bep/cach-lam-pho-bo-tron-chua-ngot-ngon-mieng-hap-dan-chuan-vi-12755'
]

for u in urls:
    res = parse_dmx_recipe(u)
    if res:
        print('='*70)
        print('TITLE:', res['title'])
        print('COVER:', res['cover'])
        print('INGREDIENTS (' + str(res['ingredients_count']) + '):', res['ingredients_sample'])
        print('STEPS (' + str(res['steps_count']) + '):')
        for i, s in enumerate(res['steps']):
            print(f"  Step {i+1}: {s['title']} -> Imgs: {len(s['images'])}")
            if s['images']:
                print(f"     First img: {s['images'][0]}")
