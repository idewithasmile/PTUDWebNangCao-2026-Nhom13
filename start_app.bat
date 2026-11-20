@echo off
title Khoi dong Culinary Blog System (Docker Infrastructure)
chcp 65001 > nul
echo =====================================================================
echo    🚀 ĐANG KHỞI ĐỘNG HỆ THỐNG CULINARY BLOG (DOCKER INFRASTRUCTURE)
echo =====================================================================

echo [1/3] Khởi động các Docker Containers (Postgres, Redis, MinIO, Seq, MailHog)...
docker start culinary_postgres culinary_redis culinary_minio culinary_seq culinary_mailhog

echo [2/3] Khởi động Backend WebAPI (.NET 10 - Port 5001)...
start "Backend-API" /min dotnet run --project backend\src\Presentation\CulinaryBlog.API.csproj --launch-profile http

echo [3/3] Khởi động Frontend Next.js (Port 3000)...
start "Frontend-NextJS" cmd /k "cd frontend && npm run dev"

echo.
echo =====================================================================
echo    🎉 TẤT CẢ DỊCH VỤ DOCKER VÀ ỨNG DỤNG ĐÃ SẴN SÀNG!
echo    - Frontend App:   http://localhost:3000
echo    - Backend API:    http://localhost:5001/api/v1
echo    - Scalar Docs:    http://localhost:5001/scalar
echo    - MinIO Storage:  http://localhost:9000 (Console: http://localhost:9001)
echo    - MailHog UI:     http://localhost:8025
echo    - Seq Logging:    http://localhost:5341
echo =====================================================================
timeout /t 5 > nul
