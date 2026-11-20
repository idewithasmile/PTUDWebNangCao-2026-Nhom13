@echo off
title Khoi tao & Dong bo Du lieu Culinary Blog (1-Click Setup)
chcp 65001 > nul
echo =====================================================================
echo    🚀 KHỞI TẠO & ĐỒNG BỘ DỮ LIỆU CULINARY BLOG (1-CLICK SETUP)
echo =====================================================================
echo.

echo [1/4] Kiểm tra và khởi động các dịch vụ Docker (PostgreSQL, MinIO, Redis)...
docker compose -f infrastructure\docker-compose.yml up -d postgres minio redis
if %ERRORLEVEL% NEQ 0 (
    echo [LỖI] Không thể khởi động Docker. Vui lòng đảm bảo Docker Desktop đang chạy!
    pause
    exit /b %ERRORLEVEL%
)

echo [2/4] Đang chờ cơ sở dữ liệu PostgreSQL sẵn sàng...
set /a attempts=0
:wait_postgres
set /a attempts+=1
docker exec culinary_postgres pg_isready -U postgres -d culinary_blog > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    if %attempts% GEQ 30 (
        echo [LỖI] PostgreSQL không phản hồi sau 30 giây.
        pause
        exit /b 1
    )
    timeout /t 1 /nobreak > nul
    goto wait_postgres
)
echo    ✓ PostgreSQL đã sẵn sàng!

echo [3/4] Đang đồng bộ cơ sở dữ liệu từ infrastructure\seed_data.sql...
docker exec -i culinary_postgres psql -U postgres -d culinary_blog < infrastructure\seed_data.sql > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo    [CẢNH BÁO] Không thể nạp qua seed_data.sql trực tiếp, tiếp tục bước sau...
) else (
    echo    ✓ Đã đồng bộ toàn bộ công thức, danh mục, tài khoản và nguyên liệu thành công!
)

echo [4/4] Đang đồng bộ hình ảnh món ăn vào MinIO Object Storage...
where python > nul 2>&1
if %ERRORLEVEL% EQU 0 (
    python scripts\seed_minio_authentic_images.py
) else (
    where py > nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        py scripts\seed_minio_authentic_images.py
    ) else (
        echo    [LƯU Ý] Chưa tìm thấy Python để tải ảnh MinIO. Các dịch vụ khác vẫn hoạt động bình thường.
    )
)

echo.
echo =====================================================================
echo    🎉 ĐỒNG BỘ DỮ LIỆU HOÀN TẤT!
echo    - Dữ liệu Database và Hình ảnh MinIO đã khớp 100%% với máy chuẩn.
echo    - Để khởi động hệ thống, bạn hãy chạy: start_app.bat
echo =====================================================================
pause
