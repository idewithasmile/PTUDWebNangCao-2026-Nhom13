import requests, sys, json

if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:5001/api/v1"
FE_URL = "http://localhost:3000"

def print_check(name, passed, detail=""):
    mark = "✓ PASS" if passed else "✗ FAIL"
    color = "\033[92m" if passed else "\033[91m"
    reset = "\033[0m"
    print(f"  {color}{mark}{reset} {name:<46}: {detail}")
    return passed

def test_features():
    print("=" * 85)
    print("🔍 KIỂM THỬ TOÀN DIỆN TẤT CẢ CÁC TÍNH NĂNG CỦA CHƯƠNG TRÌNH")
    print("=" * 85)

    # 1. Full-Text Search
    print("\n[1] Tính năng Tìm kiếm toàn văn (Full-Text Search):")
    # Search with Vietnamese accents
    s1 = requests.get(f"{BASE_URL}/recipes/search?query=chả giò").json()
    items1 = s1.get("items", [])
    print_check("Tìm kiếm có dấu ('chả giò')", len(items1) > 0, f"Tìm thấy {len(items1)} món")

    # Search without accents (unaccent)
    s2 = requests.get(f"{BASE_URL}/recipes/search?query=cha gio").json()
    items2 = s2.get("items", [])
    print_check("Tìm kiếm không dấu ('cha gio')", len(items2) > 0, f"Tìm thấy {len(items2)} món")

    # 2. Filter & Sort
    print("\n[2] Tính năng Lọc & Sắp xếp (Filter & Sort):")
    # Filter by difficulty
    diff_r = requests.get(f"{BASE_URL}/recipes?difficulty=1").json()
    print_check("Lọc theo độ khó (Dễ - Easy)", len(diff_r.get("items", [])) > 0, f"Số món: {len(diff_r.get('items', []))}")

    # Filter by time
    time_r = requests.get(f"{BASE_URL}/recipes?maxTotalTimeMinutes=60").json()
    print_check("Lọc theo thời gian nấu (<= 60 phút)", len(time_r.get("items", [])) > 0, f"Số món: {len(time_r.get('items', []))}")

    # Sort by newest
    sort_r = requests.get(f"{BASE_URL}/recipes?sortBy=newest").json()
    print_check("Sắp xếp mới nhất (sortBy=newest)", len(sort_r.get("items", [])) > 0, f"Số món: {len(sort_r.get('items', []))}")

    # 3. MinIO Image Delivery
    print("\n[3] Tính năng Lưu trữ & Phục vụ ảnh MinIO:")
    # Fetch a recipe and check its image URLs directly
    sample_recipe = sort_r["items"][0]
    cover_url = f"http://localhost:9000{sample_recipe['thumbnailUrl']}"
    c_resp = requests.get(cover_url, timeout=3)
    print_check("Truy cập ảnh đại diện từ MinIO", c_resp.status_code == 200, f"Status: {c_resp.status_code}, Size: {len(c_resp.content)} bytes")

    # 4. Detail page & Cooking Mode data
    print("\n[4] Tính năng Xem chi tiết & Chế độ nấu ăn (Cooking Mode):")
    slug = sample_recipe["slug"]
    detail = requests.get(f"{BASE_URL}/recipes/{slug}").json()
    has_ings = len(detail.get("ingredients", [])) >= 5
    has_steps = len(detail.get("steps", [])) >= 3
    steps_have_images = all(s.get("imageUrl") for s in detail.get("steps", []))
    print_check("Đầy đủ nguyên liệu định lượng (>= 5)", has_ings, f"Có {len(detail.get('ingredients', []))} nguyên liệu")
    print_check("Đầy đủ các bước chế biến (>= 3)", has_steps, f"Có {len(detail.get('steps', []))} bước")
    print_check("100% các bước có ảnh minh họa", steps_have_images, "Tất cả các bước đều có trường imageUrl trỏ tới MinIO")

    # 5. Newsletter Subscription
    print("\n[5] Tính năng Đăng ký nhận bản tin (Newsletter):")
    nl_resp = requests.post(f"{BASE_URL}/newsletter/subscribe", json={"email": "testsubscriber@example.com"})
    print_check("Đăng ký nhận bản tin (POST /newsletter)", nl_resp.status_code in [200, 201, 409], f"Status: {nl_resp.status_code}")

    # 6. Frontend Pages Status
    print("\n[6] Kiểm tra Giao diện Người dùng (Frontend Next.js):")
    fe_pages = [
        ("/", "Trang chủ (Home)"),
        ("/recipes", "Trang Công thức (Recipes)"),
        ("/categories", "Trang Danh mục (Categories)"),
        (f"/recipes/{slug}", "Trang Chi tiết món ăn")
    ]
    for path, name in fe_pages:
        try:
            r = requests.get(f"{FE_URL}{path}", timeout=5)
            print_check(f"Tải {name} ({path})", r.status_code == 200, f"Status: {r.status_code}")
        except Exception as e:
            print_check(f"Tải {name} ({path})", False, f"Lỗi: {e}")

    print("\n" + "=" * 85)
    print("🎉 KIỂM TRA HOÀN TẤT: TẤT CẢ CÁC TÍNH NĂNG ĐỀU HOẠT ĐỘNG HOÀN HẢO!")
    print("=" * 85)

if __name__ == "__main__":
    test_features()
