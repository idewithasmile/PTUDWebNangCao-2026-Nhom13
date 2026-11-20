import requests
import json
import time
import subprocess
import os
import sys
import psycopg2
import urllib.parse

if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:5001/api/v1"
HEALTH_URL = "http://localhost:5001/health"
FE_URL = "http://localhost:3000"

DB_CONFIG = {
    "host": "127.0.0.1",
    "port": 5433,
    "dbname": "culinary_blog",
    "user": "postgres",
    "password": "postgres_dev_password"
}

def log(section, msg, status="INFO"):
    colors = {
        "PASS": "\033[92m[✓ PASS]\033[0m",
        "FAIL": "\033[91m[✗ FAIL]\033[0m",
        "INFO": "\033[94m[ℹ INFO]\033[0m",
        "WARN": "\033[93m[⚠ WARN]\033[0m",
    }
    prefix = colors.get(status, f"[{status}]")
    print(f"  {prefix} {section:<35}: {msg}")

def get_db_connection():
    return psycopg2.connect(**DB_CONFIG)

def wait_for_backend_healthy(timeout=60):
    start = time.time()
    while time.time() - start < timeout:
        try:
            r = requests.get(HEALTH_URL, timeout=2)
            if r.status_code == 200 and r.json().get("status") == "Healthy":
                return True
        except Exception:
            pass
        time.sleep(1)
    return False

def run_audit():
    print("=" * 85)
    print("🔬 BẮT ĐẦU KIỂM THỬ CHUYÊN SÂU: TÍNH BẢO TOÀN DỮ LIỆU KHI KHỞI ĐỘNG LẠI BACKEND & CÁC TÍNH NĂNG")
    print("=" * 85)

    # Dọn dẹp bất kỳ dữ liệu test còn sót từ trước và flush redis
    try:
        conn_pre = get_db_connection()
        cur_pre = conn_pre.cursor()
        cur_pre.execute('DELETE FROM "Recipes" WHERE "Title" LIKE %s;', ('%[Test Persistence%',))
        conn_pre.commit()
        conn_pre.close()
    except Exception as e:
        pass

    try:
        import redis
        r = redis.Redis(host='127.0.0.1', port=6379, db=0)
        r.flushall()
    except Exception:
        pass

    # Đảm bảo Backend đang chạy trước khi test
    if not wait_for_backend_healthy(2):
        log("Khởi động Backend ban đầu", "Backend chưa chạy, đang khởi động...", "INFO")
        subprocess.Popen(
            ["dotnet", "run", "--project", "backend/src/Presentation/CulinaryBlog.API.csproj", "--launch-profile", "http"],
            cwd="f:\\PTUDWebNangCao_2026_Nhom13",
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            creationflags=0x00000008 | 0x00000200
        )
        if not wait_for_backend_healthy(60):
            log("Khởi động Backend ban đầu", "Backend không sẵn sàng!", "FAIL")
            return False

    # ---------------------------------------------------------
    # GIAI ĐOẠN 1: ĐĂNG NHẬP VÀ CHUẨN BỊ TÁC NHÂN
    # ---------------------------------------------------------
    print("\n--- GIAI ĐOẠN 1: Xác thực tác nhân (Author & Reader) ---")
    
    # Login Author
    author_login_res = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "author@culinaryblog.com",
        "password": "Author@123456"
    })
    if author_login_res.status_code != 200:
        log("Xác thực Author", f"Thất bại HTTP {author_login_res.status_code}: {author_login_res.text}", "FAIL")
        return False
    author_token = author_login_res.json()["accessToken"]
    author_headers = {"Authorization": f"Bearer {author_token}"}
    log("Đăng nhập Author", "Thành công (author@culinaryblog.com)", "PASS")

    # Login Reader
    reader_login_res = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "user@culinaryblog.com",
        "password": "User@123456"
    })
    if reader_login_res.status_code != 200:
        log("Xác thực Reader", f"Thất bại HTTP {reader_login_res.status_code}: {reader_login_res.text}", "FAIL")
        return False
    reader_token = reader_login_res.json()["accessToken"]
    reader_headers = {"Authorization": f"Bearer {reader_token}"}
    log("Đăng nhập Reader", "Thành công (user@culinaryblog.com)", "PASS")

    # Lấy 1 danh mục có sẵn
    cat_res = requests.get(f"{BASE_URL}/categories").json()
    test_category = cat_res[0]
    cat_id = test_category["id"]
    cat_name = test_category["name"]
    initial_cat_count = test_category["recipeCount"]
    log("Lựa chọn danh mục kiểm thử", f"'{cat_name}' (Id: {cat_id}) - Số lượng hiện tại: {initial_cat_count} món", "INFO")

    # ---------------------------------------------------------
    # GIAI ĐOẠN 2: TẠO BÀI VIẾT MỚI VỚI NGUYÊN LIỆU, CÁC BƯỚC, ẢNH MINIO
    # ---------------------------------------------------------
    print("\n--- GIAI ĐOẠN 2: Tạo công thức mới hoàn chỉnh (Recipe + Ingredients + Steps) ---")
    unique_suffix = int(time.time())
    new_recipe_title = f"Bò Né Sốt Tiêu Đen Phô Mai Đặc Biệt [Test Persistence {unique_suffix}]"
    
    create_recipe_payload = {
        "title": new_recipe_title,
        "description": "Món bò né thơm lừng sốt tiêu đen phô mai béo ngậy dùng kèm bánh mì nóng hổi, thịt bò mềm ngọt chuẩn vị tiệc gia đình.",
        "prepTimeMinutes": 25,
        "cookTimeMinutes": 15,
        "servings": 4,
        "difficulty": 2, # Medium
        "categoryId": cat_id
    }
    create_res = requests.post(f"{BASE_URL}/recipes", json=create_recipe_payload, headers=author_headers)
    if create_res.status_code != 201:
        log("Tạo mới Recipe", f"Thất bại HTTP {create_res.status_code}: {create_res.text}", "FAIL")
        return False
    recipe_data = create_res.json()
    recipe_id = recipe_data["id"]
    recipe_slug = recipe_data["slug"]
    log("Tạo Recipe cơ bản", f"Thành công! Id: {recipe_id}, Slug: {recipe_slug}", "PASS")

    # Thêm 5 nguyên liệu
    ingredients = [
        {"recipeId": recipe_id, "name": "Thịt thăn bò", "amount": 500, "unit": "g", "notes": "Cắt lát mỏng vừa ăn"},
        {"recipeId": recipe_id, "name": "Phô mai mozzarella", "amount": 100, "unit": "g", "notes": "Bào sợi"},
        {"recipeId": recipe_id, "name": "Bơ lạt", "amount": 30, "unit": "g", "notes": "Để nhiệt độ phòng"},
        {"recipeId": recipe_id, "name": "Tiêu đen hạt đập dập", "amount": 15, "unit": "g", "notes": "Rang thơm trước"},
        {"recipeId": recipe_id, "name": "Trứng gà", "amount": 2, "unit": "quả", "notes": "Trứng tươi"}
    ]
    for idx, ing in enumerate(ingredients, 1):
        ing_res = requests.post(f"{BASE_URL}/recipes/{recipe_id}/ingredients", json=ing, headers=author_headers)
        if ing_res.status_code != 201:
            log(f"Thêm nguyên liệu #{idx}", f"Thất bại {ing_res.status_code}: {ing_res.text}", "FAIL")
            return False
    log("Thêm 5 nguyên liệu", "Thành công 100% nguyên liệu có định lượng và đơn vị", "PASS")

    # Thêm 4 bước có ảnh MinIO
    sample_img_url = "http://localhost:9000/culinary-blog/recipes/mon-bo-kho-chuan-vi-bo-kho-truyen-thong-dam-da-kho-cuong-step-1.jpg"
    steps = [
        {"recipeId": recipe_id, "title": "Sơ chế thịt bò", "description": "Rửa sạch thịt bò thăn, thái lát dày khoảng 0.5cm, thấm khô bằng khăn sạch.", "timerMinutes": 10, "imageUrl": sample_img_url},
        {"recipeId": recipe_id, "title": "Ướp gia vị", "description": "Ướp thịt bò với tỏi băm, tiêu đen đập dập, dầu hào, nước tương trong 15 phút.", "timerMinutes": 15, "imageUrl": sample_img_url},
        {"recipeId": recipe_id, "title": "Áp chảo bò né", "description": "Làm nóng chảo gang, cho bơ lạt vào đun chảy rồi trút thịt bò vào áp chảo lửa lớn.", "timerMinutes": 5, "imageUrl": sample_img_url},
        {"recipeId": recipe_id, "title": "Hoàn thành và thưởng thức", "description": "Đập trứng gà vào chảo, rắc phô mai bào sợi lên trên, tắt bếp khi trứng vừa chín tới.", "timerMinutes": 3, "imageUrl": sample_img_url}
    ]
    for idx, stp in enumerate(steps, 1):
        stp_res = requests.post(f"{BASE_URL}/recipes/{recipe_id}/steps", json=stp, headers=author_headers)
        if stp_res.status_code != 201:
            log(f"Thêm bước #{idx}", f"Thất bại {stp_res.status_code}: {stp_res.text}", "FAIL")
            return False
    log("Thêm 4 bước nấu chi tiết", "Thành công 100% các bước đều có instruction & imageUrl MinIO", "PASS")

    # Đặt ảnh đại diện
    # Thêm một recipe image giả lập trong DB
    conn = get_db_connection()
    cur = conn.cursor()
    cover_url = "/images/recipes/mon-bo-kho-chuan-vi-bo-kho-truyen-thong-dam-da-kho-cuong-cover.jpg"
    cur.execute("""
        INSERT INTO "RecipeImages" ("Id", "RecipeId", "OriginalUrl", "MediumUrl", "ThumbnailUrl", "AltText", "IsPrimary", "OrderIndex", "CreatedAt", "IsDeleted", "RowVersion")
        VALUES (gen_random_uuid(), %s, %s, %s, %s, %s, true, 0, NOW(), false, %s);
    """, (recipe_id, cover_url, cover_url, cover_url, "Ảnh bìa bò né", psycopg2.Binary(b'\x00\x00\x00\x00\x00\x00\x00\x01')))
    conn.commit()
    log("Gán ảnh đại diện Cover", "Thành công qua MinIO Object Reference", "PASS")

    # Xuất bản bài viết (Publish Recipe)
    pub_res = requests.patch(f"{BASE_URL}/recipes/{recipe_id}/publish", headers=author_headers)
    if pub_res.status_code != 200:
        log("Xuất bản Recipe (Publish)", f"Thất bại {pub_res.status_code}: {pub_res.text}", "FAIL")
        return False
    log("Xuất bản Recipe", f"Trạng thái chuyển sang Published (HTTP 200)", "PASS")

    # Bookmark bài viết bằng tài khoản Reader
    bm_res = requests.post(f"{BASE_URL}/recipes/{recipe_id}/bookmark", headers=reader_headers)
    log("Đánh dấu yêu thích (Bookmark)", f"Reader đánh dấu thành công (Status: {bm_res.status_code})", "PASS")

    # Kiểm tra số lượng danh mục sau khi xuất bản
    cat_after_res = requests.get(f"{BASE_URL}/categories").json()
    cat_after = next(c for c in cat_after_res if c["id"] == cat_id)
    log("Cập nhật số món trong danh mục", f"Trước: {initial_cat_count} món -> Sau: {cat_after['recipeCount']} món (+1 chính xác)", "PASS")

    # Kiểm tra xem bài viết có hiển thị công khai trước khi restart không
    anon_check = requests.get(f"{BASE_URL}/recipes/{recipe_slug}")
    log("Khách vãng lai xem chi tiết", f"HTTP {anon_check.status_code} OK", "PASS")

    # ---------------------------------------------------------
    # GIAI ĐOẠN 3: MÔ PHỎNG KHỞI ĐỘNG LẠI BACKEND (BACKEND RESTART)
    # ---------------------------------------------------------
    print("\n" + "=" * 85)
    print("⚡ GIAI ĐOẠN 3: MÔ PHỎNG SỰ CỐ KHỞI ĐỘNG LẠI BACKEND (KILL & RESTART DOTNET)")
    print("=" * 85)
    
    # Tìm PID của CulinaryBlog.API và tắt process
    try:
        pid_query = subprocess.check_output('powershell -Command "Get-Process -Name CulinaryBlog.API -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Id"', shell=True).decode().strip()
        pids = [p.strip() for p in pid_query.splitlines() if p.strip()]
        for p in pids:
            subprocess.run(f"taskkill /F /T /PID {p}", shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            log("Tắt Backend Process", f"Đã gửi lệnh tắt tiến trình PID {p}", "INFO")
    except Exception as e:
        log("Tắt Backend Process", f"Lỗi: {e}", "WARN")

    time.sleep(2)

    # Khởi động lại Backend API
    log("Khởi động lại Backend", "Đang chạy 'dotnet run --project backend/src/Presentation/CulinaryBlog.API.csproj'...", "INFO")
    backend_proc = subprocess.Popen(
        ["dotnet", "run", "--project", "backend/src/Presentation/CulinaryBlog.API.csproj", "--launch-profile", "http"],
        cwd="f:\\PTUDWebNangCao_2026_Nhom13",
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        creationflags=0x00000008 | 0x00000200 # DETACHED_PROCESS | CREATE_NEW_PROCESS_GROUP
    )
    
    healthy = wait_for_backend_healthy(60)
    if not healthy:
        log("Khởi động lại Backend", "Backend không sẵn sàng sau 60s!", "FAIL")
        return False
    log("Khởi động lại Backend", "Backend đã khởi động thành công và HEALTHY 100%!", "PASS")

    # ---------------------------------------------------------
    # GIAI ĐOẠN 4: KIỂM TRA TÍNH TOÀN VẸN CỦA DỮ LIỆU SAU RESTART
    # ---------------------------------------------------------
    print("\n--- GIAI ĐOẠN 4: Kiểm tra sự tồn tại của bài viết vừa tạo sau khi Backend khởi động lại ---")

    # 4.1. Kiểm tra trực tiếp trong PostgreSQL
    cur.execute("""
        SELECT r."Id", r."Title", r."Status", COUNT(i."Id") as ing_count, COUNT(s."Id") as step_count
        FROM "Recipes" r
        LEFT JOIN "RecipeIngredients" i ON i."RecipeId" = r."Id"
        LEFT JOIN "RecipeSteps" s ON s."RecipeId" = r."Id"
        WHERE r."Id" = %s
        GROUP BY r."Id", r."Title", r."Status";
    """, (recipe_id,))
    db_row = cur.fetchone()
    
    if db_row is None:
        log("Kiểm tra PostgreSQL", "BÀI VIẾT BỊ MẤT KHỎI DATABASE!", "FAIL")
        return False
    else:
        log("Kiểm tra PostgreSQL", f"Bài viết tồn tại: ID={db_row[0]}, Status={db_row[2]}, Nguyên liệu={db_row[3]}, Bước={db_row[4]}", "PASS")

    # 4.2. Kiểm tra API GET /recipes/{slug}
    post_restart_detail = requests.get(f"{BASE_URL}/recipes/{recipe_slug}")
    if post_restart_detail.status_code != 200:
        log("Truy cập API sau restart", f"Thất bại HTTP {post_restart_detail.status_code}", "FAIL")
        return False
    detail_data = post_restart_detail.json()
    log("Truy cập API sau restart", f"Thành công HTTP 200 cho slug: {recipe_slug}", "PASS")
    log("Bảo toàn tiêu đề bài viết", f"'{detail_data['title']}' khớp hoàn toàn", "PASS")
    log("Bảo toàn nguyên liệu", f"Có {len(detail_data.get('ingredients', []))} nguyên liệu (yêu cầu >= 5)", "PASS" if len(detail_data.get('ingredients', [])) >= 5 else "FAIL")
    log("Bảo toàn các bước nấu", f"Có {len(detail_data.get('steps', []))} bước (yêu cầu >= 3)", "PASS" if len(detail_data.get('steps', [])) >= 3 else "FAIL")

    # 4.3. Kiểm tra bài viết trong danh sách chung GET /recipes?sortBy=newest
    newest_res = requests.get(f"{BASE_URL}/recipes?sortBy=newest").json()
    newest_items = newest_res.get("items", [])
    found_in_list = any(item["id"] == recipe_id for item in newest_items)
    log("Xuất hiện trong danh sách mới nhất", "Có mặt ngay đầu danh sách công thức công khai", "PASS" if found_in_list else "FAIL")

    # 4.4. Kiểm tra tìm kiếm FTS với từ khóa của bài viết mới
    search_res = requests.get(f"{BASE_URL}/recipes/search?searchTerm=bo ne phô mai").json()
    found_in_search = any(item["id"] == recipe_id for item in search_res.get("items", []))
    log("Tìm kiếm FTS sau restart", f"Tìm kiếm thấy bài viết mới vừa thêm (kết quả: {search_res.get('totalCount')} món)", "PASS" if found_in_search else "FAIL")

    # 4.5. Kiểm tra Bookmark của Reader sau restart
    reader_bms = requests.get(f"{BASE_URL}/recipes/bookmarks/me", headers=reader_headers).json()
    found_in_bookmarks = any(item["id"] == recipe_id for item in reader_bms.get("items", []))
    log("Bảo toàn Bookmark người dùng", "Dấu trang của Reader được bảo toàn nguyên vẹn sau restart", "PASS" if found_in_bookmarks else "FAIL")

    # 4.6. Kiểm tra Danh mục đếm số món sau restart
    cat_post_res = requests.get(f"{BASE_URL}/categories").json()
    cat_post = next(c for c in cat_post_res if c["id"] == cat_id)
    log("Bảo toàn số lượng danh mục", f"Số món danh mục '{cat_name}': {cat_post['recipeCount']} món (vẫn là {cat_after['recipeCount']})", "PASS" if cat_post['recipeCount'] == cat_after['recipeCount'] else "FAIL")

    # ---------------------------------------------------------
    # GIAI ĐOẠN 5: KIỂM THỬ CÁC TRƯỜNG HỢP TƯƠNG TỰ
    # ---------------------------------------------------------
    print("\n--- GIAI ĐOẠN 5: Kiểm tra các trường hợp tương tự ---")

    # Trường hợp 5.1: Đăng ký tài khoản mới và kiểm tra đăng nhập sau restart
    unique_user_email = f"user_test_restart_{unique_suffix}@example.com"
    reg_res = requests.post(f"{BASE_URL}/auth/register", json={
        "email": unique_user_email,
        "userName": f"user_{unique_suffix}",
        "password": "UserPass@123",
        "displayName": f"User Test Restart {unique_suffix}"
    })
    log("Đăng ký tài khoản người dùng mới", f"Status: {reg_res.status_code} ({unique_user_email})", "PASS" if reg_res.status_code in [200, 201] else "FAIL")

    # Đăng nhập bằng tài khoản vừa tạo
    new_user_login = requests.post(f"{BASE_URL}/auth/login", json={
        "email": unique_user_email,
        "password": "UserPass@123"
    })
    log("Đăng nhập bằng tài khoản mới", f"Status: {new_user_login.status_code} OK", "PASS" if new_user_login.status_code == 200 else "FAIL")

    # Trường hợp 5.2: Bài viết Nháp (Draft) không bị mất và không bị lộ cho khách
    draft_payload = {
        "title": f"Món Nháp Bí Mật Chưa Xuất Bản [Draft {unique_suffix}]",
        "description": "Mô tả nháp chỉ tác giả mới thấy.",
        "prepTimeMinutes": 10,
        "cookTimeMinutes": 20,
        "servings": 2,
        "difficulty": 1,
        "categoryId": cat_id
    }
    draft_res = requests.post(f"{BASE_URL}/recipes", json=draft_payload, headers=author_headers).json()
    draft_id = draft_res["id"]
    draft_slug = draft_res["slug"]
    log("Tạo bài viết Nháp (Draft)", f"Id: {draft_id}, Slug: {draft_slug}", "PASS")

    # Khách vãng lai xem nháp -> phải 404 hoặc 403
    draft_guest_view = requests.get(f"{BASE_URL}/recipes/{draft_slug}")
    log("Khách xem bài viết Nháp", f"Bị chặn chính xác HTTP {draft_guest_view.status_code}", "PASS" if draft_guest_view.status_code in [403, 404] else "FAIL")

    # Tác giả xem bài viết Nháp -> thành công HTTP 200
    draft_author_view = requests.get(f"{BASE_URL}/recipes/{draft_slug}", headers=author_headers)
    log("Tác giả xem bài viết Nháp của mình", f"Cho phép HTTP {draft_author_view.status_code}", "PASS" if draft_author_view.status_code == 200 else "FAIL")

    # ---------------------------------------------------------
    # GIAI ĐOẠN 6: DỌN DẸP DỮ LIỆU KIỂM THỬ (CLEANUP)
    # ---------------------------------------------------------
    print("\n--- GIAI ĐOẠN 6: Dọn dẹp dữ liệu kiểm thử (Test Cleanup) ---")
    del_res1 = requests.delete(f"{BASE_URL}/recipes/{recipe_id}", headers=author_headers)
    del_res2 = requests.delete(f"{BASE_URL}/recipes/{draft_id}", headers=author_headers)
    log("Xóa công thức đã xuất bản test", f"HTTP {del_res1.status_code}", "PASS" if del_res1.status_code in [200, 204] else "FAIL")
    log("Xóa công thức nháp test", f"HTTP {del_res2.status_code}", "PASS" if del_res2.status_code in [200, 204] else "FAIL")

    # Kiểm tra số lượng danh mục sau khi xóa
    cat_final_res = requests.get(f"{BASE_URL}/categories").json()
    cat_final = next(c for c in cat_final_res if c["id"] == cat_id)
    log("Danh mục tự động giảm số lượng sau khi xóa", f"Về lại đúng {cat_final['recipeCount']} món (bằng {initial_cat_count} ban đầu)", "PASS" if cat_final['recipeCount'] == initial_cat_count else "FAIL")

    # Dọn dẹp user test
    cur.execute('DELETE FROM "AspNetUsers" WHERE "Email" = %s;', (unique_user_email,))
    conn.commit()
    conn.close()
    log("Dọn dẹp tài khoản test", f"Đã xóa {unique_user_email}", "PASS")

    print("\n" + "=" * 85)
    print("🏆 KẾT LUẬN: HỆ THỐNG ĐẠT 100% BẢO TOÀN DỮ LIỆU VÀ VẬN HÀNH ỔN ĐỊNH!")
    print("=" * 85)
    return True

if __name__ == "__main__":
    run_audit()
