import docx
import sys

sys.stdout.reconfigure(encoding='utf-8')

def create_lab8_report():
    template_path = r'F:\PTUDWebNangCao_2026_Nhom13\docs\Mau_Nop_Bao_Cao_Lab_Ca_Nhan_2026.docx'
    output_path = r'F:\PTUDWebNangCao_2026_Nhom13\docs\Lab8_2312691_NguyenThanhMinh.docx'

    doc = docx.Document(template_path)

    # 1. Cập nhật thông tin Header
    # P2: Lab: 08    Từ ngày: 28/10/2026    đến ngày: 03/11/2026
    doc.paragraphs[2].text = "Lab: 08\tTừ ngày: 28/10/2026\tđến ngày: 03/11/2026"

    # P3: MSSV: 2312691    Họ và tên: Nguyễn Thành Minh
    doc.paragraphs[3].text = "MSSV: 2312691\tHọ và tên: Nguyễn Thành Minh"

    # P4: Nhóm: 13
    doc.paragraphs[4].text = "Nhóm: 13"

    # P5: Công việc
    doc.paragraphs[5].text = (
        "Công việc: Hoàn thành việc cài đặt tính năng upload ảnh, xây dựng trang thêm mới/cập nhật công thức, "
        "thay đổi trạng thái công thức (Draft -> Publish -> Archived/Deleted), tích hợp chế độ xem trước toàn cảnh "
        "trực tiếp trong Dashboard (In-Dashboard Full Preview), rà soát phân quyền Dashboard theo đặc tả SRS "
        "và kiểm thử E2E tự động"
    )

    # 2. Cập nhật Bảng công việc (Table 0)
    table = doc.tables[0]

    tasks = [
        {
            "stt": "1",
            "content": (
                "Cài đặt tính năng upload ảnh và quản lý thư viện hình ảnh công thức (FR-FILE, FR-RCP-008)\n\n"
                "Đã hoàn thành:\n"
                "- Tích hợp lớp dịch vụ fileService (src/lib/services/file-service.ts) kết nối trực tiếp với API Backend POST /api/v1/files/upload, lưu trữ dữ liệu an toàn trên MinIO Object Storage tương thích chuẩn S3.\n"
                "- Hỗ trợ tải lên ảnh đại diện chính (Primary image) và đồng thời tải lên nhiều ảnh phụ cho thư viện hình ảnh (Gallery multiple images) trong RecipeForm.tsx.\n"
                "- Cài đặt kiểm thực tính hợp lệ tệp tải lên phía Client (Client-side validation): Giới hạn dung lượng tối đa 5MB/tệp, chỉ chấp nhận các định dạng ảnh web chuẩn (image/jpeg, image/png, image/webp, image/avif).\n"
                "- Hiển thị xem trước hình ảnh tức thời (Instant preview bằng URL.createObjectURL), hỗ trợ đổi ảnh đại diện chính linh hoạt với 1 cú click, tự động dọn dẹp bộ nhớ Blob URL khi unmount component.\n"
                "- Hỗ trợ linh hoạt 2 chế độ nhập ảnh: Tải tệp từ máy tính cục bộ hoặc Nhập liên kết ảnh trực tiếp từ URL bên ngoài (CDN, Unsplash), kèm danh sách ảnh mẫu chất lượng cao nạp sẵn.\n"
                "- Tự động reset giá trị file input sau mỗi lần chọn để cho phép người dùng tải lại cùng một tệp khi cần thiết.\n\n"
                "Chưa hoàn thành: Không."
            ),
            "branch": "https://github.com/idewithasmile/PTUDWebNangCao-2026-Nhom13/tree/2312691/NguyenThanhMinh/tuan-8",
            "progress": "100%"
        },
        {
            "stt": "2",
            "content": (
                "Xây dựng trang thêm mới và cập nhật công thức theo cấu trúc bố cục cân đối và đồng nhất (FR-RCP-003, FR-RCP-004)\n\n"
                "Đã hoàn thành:\n"
                "- Tái cấu trúc toàn diện component RecipeForm.tsx (src/components/recipes/RecipeForm.tsx), dùng chung đồng nhất 100% cho cả trang Tạo mới (DashboardRecipeCreateView.tsx) và trang Chỉnh sửa (DashboardRecipeEditView.tsx), loại bỏ hoàn toàn sự phân mảnh giao diện trước đó.\n"
                "- Xây dựng thanh tiến trình Stepper 4 bước chuẩn mockup:\n"
                "  + Bước 1: Thông tin cơ bản (Tên món, mô tả, danh mục, thời gian chuẩn bị/nấu, khẩu phần, độ khó, giá trị dinh dưỡng Calories/Protein/Carbs/Fat).\n"
                "  + Bước 2: Nguyên liệu (Chuyển nhanh sang tab nguyên liệu).\n"
                "  + Bước 3: Công thức (Chuyển nhanh sang tab quy trình các bước chế biến).\n"
                "  + Bước 4: Hoàn tất (Chuyển ngay sang chế độ Xem trước toàn cảnh và lưu trữ).\n"
                "- Bố cục 2 cột cân đối:\n"
                "  + Cột trái (Chiếm 65%): Form nhập liệu thông tin cơ bản kết hợp hệ thống Sub-tabs trực quan gồm 'steps' (Quy trình các bước làm), 'ingredients' (Danh sách nguyên liệu chi tiết), 'notes' (Ghi chú & Bí quyết đầu bếp) và 'gallery' (Thư viện ảnh bổ sung).\n"
                "  + Cột phải (Chiếm 35%): Thẻ Live Preview Card dính nổi (sticky top-24) cập nhật dữ liệu realtime (tên món, ảnh bìa, badge danh mục, 3 thông số nhanh, nguyên liệu chính), triệt tiêu hoàn toàn khoảng trắng thừa khi cuộn trang dài.\n"
                "- Hỗ trợ chuyển đổi 2 chiều linh hoạt giữa Form 1 trang tinh gọn và Recipe Studio chuyên sâu 5 tab (General, Ingredients, Steps, Media, Preview).\n"
                "- Tích hợp nút \"Mẫu chuẩn\" (Fill Sample Data) nạp sẵn đầy đủ dữ liệu món ăn thực tế chuẩn vị Việt Nam (Phở bò, Bánh mì chảo xíu mại, Bò xào bông cải xanh...).\n\n"
                "Chưa hoàn thành: Không."
            ),
            "branch": "https://github.com/idewithasmile/PTUDWebNangCao-2026-Nhom13/tree/2312691/NguyenThanhMinh/tuan-8",
            "progress": "100%"
        },
        {
            "stt": "3",
            "content": (
                "Cài đặt và quản lý vòng đời chuyển đổi trạng thái công thức (Draft -> Publish -> Archived/Deleted)\n\n"
                "Đã hoàn thành:\n"
                "- Hiện thực trọn vẹn máy trạng thái (State Machine) quản lý vòng đời công thức theo đúng đặc tả SRS v1.0.0:\n"
                "  + Draft (Bản nháp): Trạng thái mặc định khi tạo mới bài viết, cho phép lưu nháp linh hoạt khi thông tin chưa đầy đủ (targetStatus: 'draft').\n"
                "  + Published (Đã xuất bản): Gọi API POST /api/v1/recipes/{id}/publish, kiểm tra điều kiện xuất bản (bắt buộc có ảnh, nguyên liệu và các bước làm).\n"
                "  + Unpublish (Hủy xuất bản): Gọi API POST /api/v1/recipes/{id}/unpublish, đưa bài viết từ xuất bản trở lại bản nháp để chỉnh sửa an toàn.\n"
                "  + Archived (Lưu trữ): Gọi API PATCH /api/v1/recipes/{id}/archive (FR-RCP-006), chuyển công thức vào kho lưu trữ cá nhân, ẩn khỏi danh sách công khai.\n"
                "  + Deleted (Xóa công thức): Gọi API DELETE /api/v1/recipes/{id} (FR-RCP-007), áp dụng chuẩn Soft-delete (IsDeleted = true), bảo toàn dữ liệu hệ thống.\n"
                "- Tích hợp cơ chế Concurrency Control chống ghi đè dữ liệu đồng thời (Optimistic Concurrency Control qua token rowVersionBase64).\n"
                "- Xử lý đồng bộ phản hồi trạng thái: Thông báo Toast notification thành công/thất bại, tự động điều hướng sang tab danh sách phù hợp (recipes-mine, recipes-archived, hoặc trang bài viết công khai).\n\n"
                "Chưa hoàn thành: Không."
            ),
            "branch": "https://github.com/idewithasmile/PTUDWebNangCao-2026-Nhom13/tree/2312691/NguyenThanhMinh/tuan-8",
            "progress": "100%"
        },
        {
            "stt": "4",
            "content": (
                "Xây dựng chế độ Xem trước toàn cảnh trực tiếp trong Bảng điều khiển (In-Dashboard Preview) tích hợp thanh điều khiển trạng thái\n\n"
                "Đã hoàn thành:\n"
                "- Tích hợp state quản lý chế độ xem viewMode: 'edit' | 'preview' trực tiếp trong RecipeForm.tsx:\n"
                "- Khi người dùng bấm nút [Xem trước], link \"Xem trước Dashboard\" tại Live Preview card, hoặc bấm Bước 4 trên Stepper: Giao diện chuyển mượt mà sang chế độ Xem trước toàn cảnh ngay trong Dashboard, giữ nguyên Sidebar và Header điều hướng.\n"
                "- Tích hợp Thanh điều khiển cố định dính nổi (Sticky Action Bar) ở cả đầu và chân trang xem trước với 4 nút hành động:\n"
                "  + [← Quay lại chỉnh sửa]: Trở về form nhập liệu ngay lập tức mà không làm mất dữ liệu vừa nhập.\n"
                "  + [📥 Lưu nháp]: Gửi form với targetStatus 'draft'.\n"
                "  + [📦 Lưu trữ]: Gửi form với targetStatus 'archive'.\n"
                "  + [🚀 Đăng bài ngay]: Gửi form với targetStatus 'publish' (nút gradient cam nổi bật).\n"
                "  + [Tab mới ↗]: Tùy chọn mở xem trước trên tab trình duyệt riêng biệt (/recipes/preview) phục vụ đối chiếu độc lập.\n"
                "- Khung hiển thị chi tiết công thức chuẩn xác 100% như trang xem công khai: Huy hiệu danh mục & độ khó, Tiêu đề lớn, Mô tả, Gallery ảnh có Lightbox, 4 thẻ thông số nhanh (Chuẩn bị, Nấu nướng, Tổng thời gian, Khẩu phần), Thẻ dinh dưỡng Macros, Bố cục 2 cột (Nguyên liệu chi tiết có checkbox và Các bước nấu có đồng hồ bấm giờ tương tác), Hộp bí quyết & ghi chú từ đầu bếp.\n\n"
                "Chưa hoàn thành: Không."
            ),
            "branch": "https://github.com/idewithasmile/PTUDWebNangCao-2026-Nhom13/tree/2312691/NguyenThanhMinh/tuan-8",
            "progress": "100%"
        },
        {
            "stt": "5",
            "content": (
                "Xây dựng trang xem danh sách người dùng và tác giả (Admin, Tác giả) kết nối dữ liệu thực tế ASP.NET Core Identity\n\n"
                "Đã hoàn thành:\n"
                "- Tầng Backend (.NET 10 Minimal API - Clean Architecture):\n"
                "  + Xây dựng DTOs (UserSummaryDto, UserStatsSummaryDto, PagedUsersResultDto) chuẩn Clean Architecture.\n"
                "  + Xây dựng MediatR Query GetUsersQuery và Handler tối ưu: Truy vấn trực tiếp từ bảng AspNetUsers, phân quyền linh hoạt (Admin xem toàn bộ hệ thống; Author xem danh bạ cộng đồng tác giả và đầu bếp công khai).\n"
                "  + Hỗ trợ bộ lọc đa chiều: Lọc theo vai trò (Admin, Author, Reader), lọc trạng thái (Active/Inactive), tìm kiếm từ khóa (tên hiển thị, username, email) và phân trang chuẩn.\n"
                "  + Tính toán tự động số lượng bài viết thật đã tạo và đã xuất bản của từng tác giả qua quan hệ bảng Recipes.\n"
                "  + Xây dựng Command ToggleUserStatusCommand cho phép Quản trị viên khóa/mở khóa tài khoản an toàn (chống Admin tự khóa chính mình).\n"
                "  + Đăng ký Minimal API Endpoints: GET /api/v1/users và PATCH /api/v1/users/{id}/status có bảo vệ bằng JWT Bearer Token.\n"
                "- Tầng Frontend (Next.js 14 App Router - Tailwind CSS):\n"
                "  + Xây dựng userService (src/lib/services/user-service.ts) tích hợp token xác thực tự động.\n"
                "  + Bổ sung tab 'users' vào DashboardSidebar.tsx và UnifiedDashboardView.tsx: Hiển thị mục 'Quản lý người dùng' kèm badge số lượng cho Admin, hoặc 'Cộng đồng tác giả' cho Author.\n"
                "  + Xây dựng component DashboardUsersView.tsx hiện đại: Dải 4 thẻ KPI thống kê (Tổng tài khoản, Quản trị viên, Tác giả bài viết, Đang hoạt động), thanh tìm kiếm debounce 250ms, bộ lọc vai trò/trạng thái.\n"
                "  + Hỗ trợ 2 chế độ hiển thị linh hoạt: Dạng bảng (Table List) chuyên nghiệp và Dạng lưới thẻ (Grid Cards) phong cách tạp chí ẩm thực.\n"
                "  + Tích hợp Modal xem chi tiết hồ sơ người dùng đầy đủ và Modal xác nhận thay đổi trạng thái an toàn.\n\n"
                "Chưa hoàn thành: Không."
            ),
            "branch": "https://github.com/idewithasmile/PTUDWebNangCao-2026-Nhom13/tree/2312691/NguyenThanhMinh/tuan-8",
            "progress": "100%"
        },
        {
            "stt": "6",
            "content": (
                "Rà soát Dashboard theo đặc tả SRS, tích hợp hệ thống Logging ghi nhật ký hệ thống và Kiểm thử E2E tự động\n\n"
                "Đã hoàn thành:\n"
                "- Rà soát đặc tả SRS v1.0.0 cho Dashboard: Phân định rạch ròi vai trò Admin và Author trong DashboardSidebar.tsx và UnifiedDashboardView.tsx. Ẩn hoàn toàn tab Quản lý danh mục đối với tài khoản Author (chỉ tài khoản Admin mới có quyền truy cập theo SRS).\n"
                "- Tinh gọn mã nguồn Dashboard: Loại bỏ hoàn toàn các view mock và widget không thuộc phạm vi đặc tả (comments, files, jobs, analytics, authors giả lập) để toàn bộ hệ thống kết nối 100% dữ liệu API thật từ CSDL PostgreSQL.\n"
                "- Hệ thống Structured Logging (Serilog, UserLogEnrichmentMiddleware, LoggingBehavior) hoạt động xuyên suốt, tự động ghi nhận CorrelationId, UserId, RequestPath, thời gian thực thi và trạng thái HTTP cho mọi thao tác thêm mới/cập nhật/thay đổi trạng thái công thức, upload ảnh và quản lý người dùng vào file log hàng ngày (backend/src/Presentation/logs/culinaryblog-20261103.log).\n"
                "- Xây dựng và thực thi thành công 100% bộ kịch bản kiểm thử tự động Playwright E2E:\n"
                "  + test_dashboard_clean_ui.mjs: Kiểm thử giao diện Dashboard sạch, phân quyền Author/Admin.\n"
                "  + test_mockup_fidelity.mjs: Kiểm thử độ trung thực giao diện tạo công thức theo mockup.\n"
                "  + test_edit_page.mjs: Kiểm thử giao diện trang chỉnh sửa đồng nhất.\n"
                "  + test_inline_preview.mjs: Kiểm thử toàn diện quy trình xem trước trong Dashboard, quay lại chỉnh sửa, lưu nháp, lưu trữ và xuất bản công thức.\n"
                "  + test_dashboard_users_management.mjs: Kiểm thử toàn diện trang quản lý người dùng, tìm kiếm, lọc vai trò, chuyển đổi Table/Grid và mở modal chi tiết (Đạt 100% PASS trên Chromium).\n\n"
                "Chưa hoàn thành: Không."
            ),
            "branch": "https://github.com/idewithasmile/PTUDWebNangCao-2026-Nhom13/tree/2312691/NguyenThanhMinh/tuan-8",
            "progress": "100%"
        }
    ]

    # Template table has 7 rows (1 header + 6 rows).
    # We will populate all 6 rows with tasks.
    for i, task in enumerate(tasks):
        row = table.rows[i + 1]
        row.cells[0].text = task["stt"]
        row.cells[1].text = task["content"]
        row.cells[2].text = task["branch"]
        row.cells[3].text = task["progress"]

    # Xóa hàng thừa nếu có
    while len(table.rows) > len(tasks) + 1:
        tr = table.rows[-1]._tr
        tr.getparent().remove(tr)

    doc.save(output_path)
    print(f"✅ Đã tạo thành công file báo cáo Lab 8: {output_path}")

if __name__ == "__main__":
    create_lab8_report()
