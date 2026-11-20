#!/bin/bash
set -e

echo "====================================================================="
echo "   🚀 KHỞI TẠO & ĐỒNG BỘ DỮ LIỆU CULINARY BLOG (1-CLICK SETUP)"
echo "====================================================================="

echo "[1/4] Kiểm tra và khởi động các dịch vụ Docker (PostgreSQL, MinIO, Redis)..."
docker compose -f infrastructure/docker-compose.yml up -d postgres minio redis

echo "[2/4] Đang chờ cơ sở dữ liệu PostgreSQL sẵn sàng..."
for i in $(seq 1 30); do
  if docker exec culinary_postgres pg_isready -U postgres -d culinary_blog > /dev/null 2>&1; then
    echo "   ✓ PostgreSQL đã sẵn sàng!"
    break
  fi
  sleep 1
done

echo "[3/4] Đang đồng bộ cơ sở dữ liệu từ infrastructure/seed_data.sql..."
if [ -f "infrastructure/seed_data.sql" ]; then
    docker exec -i culinary_postgres psql -U postgres -d culinary_blog < infrastructure/seed_data.sql > /dev/null 2>&1 || true
    echo "   ✓ Đã đồng bộ cơ sở dữ liệu thành công!"
fi

echo "[4/4] Đang đồng bộ hình ảnh món ăn vào MinIO Object Storage..."
if command -v python3 &> /dev/null; then
    python3 scripts/seed_minio_authentic_images.py
elif command -v python &> /dev/null; then
    python scripts/seed_minio_authentic_images.py
else
    echo "   [LƯU Ý] Chưa tìm thấy Python để tải ảnh MinIO."
fi

echo "====================================================================="
echo "   🎉 ĐỒNG BỘ DỮ LIỆU HOÀN TẤT!"
echo "====================================================================="
