# TEAM_ASSIGNMENT.md — Phân công 4 thành viên

## Nguyên tắc phân công

1. **Vertical slice, không horizontal.** Mỗi người sở hữu 1 module xuyên suốt cả
   backend (Command/Query/Handler/Endpoint) lẫn frontend (page/component/hook) liên
   quan tới module đó — không chia "1 người chỉ làm backend, 1 người chỉ làm
   frontend", vì như vậy mọi task đều cần 2 người merge cùng lúc, dễ nghẽn.
2. **Không sửa ngoài phạm vi module được giao** (theo CLAUDE.md mục 5) — giảm
   conflict giữa 4 nhánh làm song song trên cùng 1 codebase nền tảng.
3. Module nào người khác đang phụ thuộc (Auth, Category) được ưu tiên làm trước.
4. Module `FR-RCP` lớn nhất (10 FR) — chia làm 2 người phụ trách 2 nhóm con thay vì
   1 người ôm hết.

## Bảng phân công theo tuần

| Tuần | Module | FR/NFR | Phụ trách chính | Hỗ trợ | Phụ thuộc trước |
|---|---|---|---|---|---|
| 0 | Scaffold codebase | — | Cả 4 người review kết quả AI Agent tạo, chạy thử local | — | — |
| 1 | Domain entities + EF configs (nếu scaffold chưa đủ chi tiết) | Ch.7 | B, C, D (song song) | A | Scaffold |
| 1 | **FR-AUTH** (đăng ký, login, Google OAuth, refresh, logout, profile) | 7 FR | **A** | — | Scaffold |
| 2 | **FR-CAT** (CRUD danh mục, cần role Admin) | 5 FR | **B** | A (review) | FR-AUTH (role check) |
| 2 | **FR-FILE** (upload/xóa ảnh trên MinIO) | 2 FR | **D** | — | Scaffold |
| 2–3 | **FR-RCP-001→004** (list, detail, tạo, cập nhật recipe) | 4 FR | **C** | — | FR-CAT (FK CategoryId), FR-AUTH |
| 3–4 | **FR-RCP-005→007** (publish/unpublish, archive, xóa) | 3 FR | **C** | — | FR-RCP-001→004 |
| 3–4 | **FR-RCP-008→010** (ảnh, nguyên liệu, bước) | 3 FR | **D** | — | FR-FILE, FR-RCP-001→004 |
| 4 | **FR-SRCH** (full-text search, filter, sort, pagination) | 4 FR | **B** | C | FR-RCP đã có data thật để test search |
| 2–5 | **FR-OBS** (health check, structured logging, tracing) — làm song song, xuyên suốt | 3 FR | **A** | — | Scaffold (health check cơ bản đã có sẵn) |
| 5 | **FR-JOB** (welcome email, resize ảnh, sitemap) | 3 FR | **D** | A | FR-AUTH (trigger email), FR-RCP-008 (trigger resize), FR-CAT+RCP (sitemap) |
| 6 | **NFR-SEO** hoàn thiện (JSON-LD Schema.org, meta/OG tags, sitemap route, slug redirect) | 4 NFR | **B, C** | — | FR-RCP, FR-CAT hoàn thiện |
| 6–7 | Hardening: NFR-SEC, NFR-PERF, test còn thiếu, viết tài liệu bảo vệ đồ án | — | Cả 4 người | — | Tất cả module |

## Ghi chú phụ thuộc quan trọng

- **Không ai được bắt đầu FR-CAT hoặc FR-RCP trước khi FR-AUTH có JWT + role check
  hoạt động** — cả 2 module đều cần phân quyền Author/Admin.
- **FR-RCP-008 (ảnh) phụ thuộc FR-FILE** — D nên làm FR-FILE trước rồi mới sang
  RCP-008, đúng thứ tự trong bảng trên.
- **FR-SRCH cần dữ liệu Recipe thật để test** — B nên chờ C có ít nhất
  FR-RCP-001→004 chạy được trước khi bắt đầu.
- **FR-JOB cần cả 3 module khác** (Auth/Recipe/Category) đã có phần liên quan xong
  — đây là lý do đặt ở tuần 5, gần cuối.

## Quy tắc PR/review (nhắc lại từ CLAUDE.md)

- Mỗi PR chỉ động vào file trong phạm vi module được giao ở trên.
- PR description phải nêu rõ đã thỏa FR/CONS code nào.
- `dotnet build` + `dotnet test` phải xanh trước khi merge.
- Người phụ trách module liên quan trực tiếp (theo cột "Phụ thuộc trước") review PR
  trước khi merge, không chỉ tự merge.
