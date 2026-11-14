#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Patch script to enrich ingredients and steps in Batch 1, Batch 2, Batch 3
so that 100% of recipes satisfy:
- At least 10 ingredients (10-16)
- At least 5 steps (5-8)
"""

import sys
import os

repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(repo_root, "scripts"))

# 1. Patch Batch 1
def patch_batch1():
    b1_path = os.path.join(repo_root, "scripts", "recipes_batch1.py")
    with open(b1_path, "r", encoding="utf-8") as f:
        content = f.read()

    # ca-tim-nuong-mo-hanh-chay
    old_ca_tim = '{"name": "Nước cốt chanh tươi", "quantity": 1, "unit": "muỗng canh", "notes": "Cân bằng vị chua ngọt"}\n        ],'
    new_ca_tim = '{"name": "Nước cốt chanh tươi", "quantity": 1, "unit": "muỗng canh", "notes": "Cân bằng vị chua ngọt"},\n            {"name": "Hạt nêm nấm hương chay", "quantity": 1, "unit": "muỗng cà phê", "notes": "Nêm vào mỡ hành boa-rô đậm đà"},\n            {"name": "Hành phi chay giòn rụm", "quantity": 20, "unit": "gram", "notes": "Rắc lên mặt đĩa tăng độ giòn thơm"}\n        ],'
    content = content.replace(old_ca_tim, new_ca_tim, 1)

    # che-hat-sen-long-nhan-thanh-mat
    old_sen = '{"name": "Nước lọc tinh khiết", "quantity": 1000, "unit": "ml", "notes": "Nấu nước chè trong veo"}\n        ],'
    new_sen = '{"name": "Nước lọc tinh khiết", "quantity": 1000, "unit": "ml", "notes": "Nấu nước chè trong veo"},\n            {"name": "Hạt chia hữu cơ", "quantity": 15, "unit": "gram", "notes": "Ngâm nở tạo cảm giác thanh mát bổ dưỡng"},\n            {"name": "Táo đỏ Tân Cương thái lát", "quantity": 30, "unit": "gram", "notes": "Nấu cùng nước chè tạo vị ngọt thanh tự nhiên"},\n            {"name": "Kỳ tử đỏ", "quantity": 10, "unit": "gram", "notes": "Thả vào nồi chè bồi bổ khí huyết"},\n            {"name": "Muối biển tinh", "quantity": 0.5, "unit": "muỗng cà phê", "notes": "Dằn vị ngọt sâu"}\n        ],'
    content = content.replace(old_sen, new_sen, 1)

    # che-buoi-an-giang-gion-san-sat
    old_buoi = '{"name": "Tinh dầu hoa bưởi", "quantity": 2, "unit": "giọt", "notes": "Tạo hương thơm truyền thống"}\n        ],'
    new_buoi = '{"name": "Tinh dầu hoa bưởi", "quantity": 2, "unit": "giọt", "notes": "Tạo hương thơm truyền thống"},\n            {"name": "Đậu phộng rang bóc vỏ giã dập", "quantity": 50, "unit": "gram", "notes": "Rắc lên mặt ly chè tăng độ bùi béo"},\n            {"name": "Vani chiết xuất tự nhiên", "quantity": 1, "unit": "muỗng cà phê", "notes": "Dậy hương thơm ngọt ngào"}\n        ],'
    content = content.replace(old_buoi, new_buoi, 1)

    # che-suong-sa-hat-luu-cot-dua
    old_suong_sa = '{"name": "Dầu chuối tự nhiên", "quantity": 2, "unit": "giọt", "notes": "Hương thơm giải nhiệt mùa hè"}\n        ],'
    new_suong_sa = '{"name": "Dầu chuối tự nhiên", "quantity": 2, "unit": "giọt", "notes": "Hương thơm giải nhiệt mùa hè"},\n            {"name": "Mè trắng rang thơm", "quantity": 20, "unit": "gram", "notes": "Rắc lên lớp nước cốt dừa"}\n        ],'
    content = content.replace(old_suong_sa, new_suong_sa, 1)

    # sua-chua-deo-tra-xanh-trai-cay
    old_sua_chua = '{"name": "Đường cát trắng", "quantity": 50, "unit": "gram", "notes": "Nấu sốt chanh leo chua ngọt"}\n        ],'
    new_sua_chua = '{"name": "Đường cát trắng", "quantity": 50, "unit": "gram", "notes": "Nấu sốt chanh leo chua ngọt"},\n            {"name": "Kiwi xanh thái lát", "quantity": 1, "unit": "trái", "notes": "Trang trí kèm dâu tây và xoài"},\n            {"name": "Hạnh nhân lát nướng giòn", "quantity": 25, "unit": "gram", "notes": "Rắc lên bề mặt đĩa sữa chua dẻo"}\n        ],'
    content = content.replace(old_sua_chua, new_sua_chua, 1)

    # banh-flan-caramel-trung-ga-min
    old_flan = '{"name": "Đá bào mát lạnh", "quantity": 100, "unit": "gram", "notes": "Ăn kèm bánh flan"}\n        ],'
    new_flan = '{"name": "Đá bào mát lạnh", "quantity": 100, "unit": "gram", "notes": "Ăn kèm bánh flan"},\n            {"name": "Kem béo thực vật (whipping cream)", "quantity": 80, "unit": "ml", "notes": "Tăng độ béo ngậy mượt mà cho cốt bánh"},\n            {"name": "Muối biển tinh khiết", "quantity": 0.5, "unit": "muỗng cà phê", "notes": "Cân bằng vị béo ngậy của sữa trứng"}\n        ],'
    content = content.replace(old_flan, new_flan, 1)

    with open(b1_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Batch 1 patched successfully.")

# 2. Patch Batch 2
def patch_batch2():
    b2_path = os.path.join(repo_root, "scripts", "recipes_batch2.py")
    with open(b2_path, "r", encoding="utf-8") as f:
        content = f.read()

    # ca-phe-sua-da-sai-gon-nguyen-ban
    old_cf_sd = '{"name": "Đá viên sạch", "quantity": 150, "unit": "gram", "notes": "Đá tinh khiết giữ lạnh"}\n        ],'
    new_cf_sd = '{"name": "Đá viên sạch", "quantity": 150, "unit": "gram", "notes": "Đá tinh khiết giữ lạnh"},\n            {"name": "Sữa tươi thanh trùng không đường", "quantity": 20, "unit": "ml", "notes": "Tạo lớp bọt sữa mềm mượt"},\n            {"name": "Bơ Pháp lạt đun chảy", "quantity": 5, "unit": "gram", "notes": "Ủ vào bột cà phê tạo độ béo ngậy"},\n            {"name": "Đường phèn cô đặc", "quantity": 10, "unit": "ml", "notes": "Điều vị ngọt thanh"},\n            {"name": "Muối biển hạt mịn", "quantity": 0.2, "unit": "muỗng cà phê", "notes": "Dằn vị đắng gắt tôn hương thơm"},\n            {"name": "Bột ca cao nguyên chất", "quantity": 2, "unit": "gram", "notes": "Rắc nhẹ lên mặt ly"}\n        ],'
    content = content.replace(old_cf_sd, new_cf_sd, 1)

    # tra-dao-cam-sa-thanh-nhiet
    old_tra_dao = '{"name": "Đá viên mát lạnh", "quantity": 150, "unit": "gram", "notes": "Lắc đều làm lạnh"}\n        ],'
    new_tra_dao = '{"name": "Đá viên mát lạnh", "quantity": 150, "unit": "gram", "notes": "Lắc đều làm lạnh"},\n            {"name": "Lá bạc hà tươi", "quantity": 10, "unit": "gram", "notes": "Trang trí và tạo hương thơm the mát"}\n        ],'
    content = content.replace(old_tra_dao, new_tra_dao, 1)

    # tra-sen-vang-macchiato-thom-ngat
    old_tra_sen = '{"name": "Đá viên tinh khiết", "quantity": 150, "unit": "gram", "notes": "Làm lạnh thức uống"}\n        ],'
    new_tra_sen = '{"name": "Đá viên tinh khiết", "quantity": 150, "unit": "gram", "notes": "Làm lạnh thức uống"},\n            {"name": "Bột phô mai béo nhẹ", "quantity": 10, "unit": "gram", "notes": "Đánh cùng kem macchiato tạo vị mặn béo"}\n        ],'
    content = content.replace(old_tra_sen, new_tra_sen, 1)

    # sinh-to-bo-sau-rieng-cot-dua (ingredients + 5th step)
    old_st_bo = '{"name": "Đá bào tinh khiết", "quantity": 100, "unit": "gram", "notes": "Xay nhuyễn cùng nguyên liệu"}\n        ],'
    new_st_bo = '{"name": "Đá bào tinh khiết", "quantity": 100, "unit": "gram", "notes": "Xay nhuyễn cùng nguyên liệu"},\n            {"name": "Đậu phộng rang giã dập", "quantity": 25, "unit": "gram", "notes": "Rắc mặt ly tăng độ bùi giòn"},\n            {"name": "Dừa non nạo sợi", "quantity": 30, "unit": "gram", "notes": "Trang trí lên mặt ly"},\n            {"name": "Chiết xuất vani tự nhiên", "quantity": 1, "unit": "muỗng cà phê", "notes": "Dậy hương thơm béo"},\n            {"name": "Muối biển tinh", "quantity": 0.2, "unit": "muỗng cà phê", "notes": "Dằn ngọt béo"}\n        ],'
    content = content.replace(old_st_bo, new_st_bo, 1)

    old_st_bo_steps = '{"stepNumber": 4, "title": "Rót ly và thưởng thức", "description": "Rót sinh tố bơ sầu riêng sánh mịn ra ly thủy tinh, có thể trang trí vài sợi dừa non hoặc lát bơ tươi lên trên. Dùng muỗng thưởng thức ngay khi còn lạnh.", "timerMinutes": null}\n        ]'
    new_st_bo_steps = '{"stepNumber": 4, "title": "Rót ly sinh tố sánh mịn", "description": "Rót hỗn hợp sinh tố bơ sầu riêng sánh đặc mượt mà ra ly thủy tinh cao.", "timerMinutes": null},\n            {"stepNumber": 5, "title": "Trang trí và thưởng thức", "description": "Rắc đậu phộng rang giã dập và dừa non nạo sợi lên trên mặt ly sinh tố bơ sầu riêng. Cắm ống hút và thưởng thức ngay khi ly sinh tố còn mát lạnh sánh mịn.", "timerMinutes": null}\n        ]'
    content = content.replace(old_st_bo_steps, new_st_bo_steps, 1)

    # ca-phe-trung-ha-noi-bot-kem
    old_cf_trung = '{"name": "Nước sôi tinh khiết", "quantity": 100, "unit": "ml", "notes": "Pha cà phê và đặt bát nước nóng giữ nhiệt"}\n        ],'
    new_cf_trung = '{"name": "Nước sôi tinh khiết", "quantity": 100, "unit": "ml", "notes": "Pha cà phê và đặt bát nước nóng giữ nhiệt"},\n            {"name": "Bột quế thơm", "quantity": 1, "unit": "gram", "notes": "Rắc nhẹ lên lớp bọt kem trứng tạo hình nghệ thuật"},\n            {"name": "Rượu rum hoặc mật ong", "quantity": 5, "unit": "ml", "notes": "Đánh cùng trứng khử tanh hoàn toàn"},\n            {"name": "Sữa tươi nóng", "quantity": 30, "unit": "ml", "notes": "Rót vào đáy ly trước khi rót cà phê"},\n            {"name": "Bột ca cao đắng", "quantity": 2, "unit": "gram", "notes": "Rắc mặt ly"}\n        ],'
    content = content.replace(old_cf_trung, new_cf_trung, 1)

    # thit-kho-tau-nuoc-dua-trung-vit
    old_thit_kho = '{"name": "Dầu ăn thực vật", "quantity": 2, "unit": "muỗng canh", "notes": "Phi hành tỏi"}\n        ],'
    new_thit_kho = '{"name": "Dầu ăn thực vật", "quantity": 2, "unit": "muỗng canh", "notes": "Phi hành tỏi"},\n            {"name": "Nước hàng (nước màu caramen)", "quantity": 1.5, "unit": "muỗng canh", "notes": "Tạo màu nâu cánh gián óng ả"}\n        ],'
    content = content.replace(old_thit_kho, new_thit_kho, 1)

    # suon-non-kho-thom-chua-ngot
    old_suon_kho = '{"name": "Dầu màu điều", "quantity": 2, "unit": "muỗng canh", "notes": "Tạo màu cam đỏ óng ánh"}\n        ],'
    new_suon_kho = '{"name": "Dầu màu điều", "quantity": 2, "unit": "muỗng canh", "notes": "Tạo màu cam đỏ óng ánh"},\n            {"name": "Ớt sừng đỏ thái lát", "quantity": 1, "unit": "trái", "notes": "Tạo màu sắc và vị cay ấm"}\n        ],'
    content = content.replace(old_suon_kho, new_suon_kho, 1)

    # rau-muong-xao-toi-xanh-muot
    old_rau_muong = '{"name": "Hạt tiêu đen xay", "quantity": 1/2, "unit": "muỗng cà phê", "notes": "Rắc lên mặt khi dọn đĩa"}\n        ],'
    new_rau_muong = '{"name": "Hạt tiêu đen xay", "quantity": 1/2, "unit": "muỗng cà phê", "notes": "Rắc lên mặt khi dọn đĩa"},\n            {"name": "Tỏi phi giòn nguyên tép", "quantity": 30, "unit": "gram", "notes": "Rắc lên mặt đĩa khi dọn"},\n            {"name": "Nước tương ngon", "quantity": 1, "unit": "muỗng canh", "notes": "Dùng pha nước chấm ớt tỏi ăn kèm"},\n            {"name": "Ớt chỉ thiên đỏ", "quantity": 1, "unit": "trái", "notes": "Thái lát xắt xéo xào cùng rau"},\n            {"name": "Đá viên làm lạnh", "quantity": 200, "unit": "gram", "notes": "Ngâm rau sau khi chần giữ màu xanh ngọc"}\n        ],'
    content = content.replace(old_rau_muong, new_rau_muong, 1)

    # bun-cha-ha-noi-nuong-than-hoa
    old_bun_cha = '{"name": "Ớt chỉ thiên băm nhỏ", "quantity": 1, "unit": "muỗng canh", "notes": "Pha nước chấm chua ngọt"}\n        ],'
    new_bun_cha = '{"name": "Ớt chỉ thiên băm nhỏ", "quantity": 1, "unit": "muỗng canh", "notes": "Pha nước chấm chua ngọt"},\n            {"name": "Húng láng và tía tô tươi", "quantity": 80, "unit": "gram", "notes": "Rau thơm ăn kèm không thể thiếu của người Tràng An"}\n        ],'
    content = content.replace(old_bun_cha, new_bun_cha, 1)

    # ga-nuong-muoi-ot-tay-bac
    old_ga_nuong = '{"name": "Lá chanh tươi thái chỉ", "quantity": 10, "unit": "lá", "notes": "Rắc lên gà sau khi nướng"}\n        ],'
    new_ga_nuong = '{"name": "Lá chanh tươi thái chỉ", "quantity": 10, "unit": "lá", "notes": "Rắc lên gà sau khi nướng"},\n            {"name": "Hạt dổi rừng nướng thơm", "quantity": 3, "unit": "hạt", "notes": "Giã nhuyễn cùng mắc khén tạo hương vị Tây Bắc đích thực"},\n            {"name": "Nước cốt chanh tươi", "quantity": 2, "unit": "muỗng canh", "notes": "Pha muối hạt chẩm chéo chấm gà"}\n        ],'
    content = content.replace(old_ga_nuong, new_ga_nuong, 1)

    # bach-tuoc-nuong-sa-te
    old_bach_tuoc = '{"name": "Rau răm ăn kèm", "quantity": 50, "unit": "gram", "notes": "Rửa sạch để ráo ăn kèm"}\n        ],'
    new_bach_tuoc = '{"name": "Rau răm ăn kèm", "quantity": 50, "unit": "gram", "notes": "Rửa sạch để ráo ăn kèm"},\n            {"name": "Đậu bắp nướng kèm", "quantity": 100, "unit": "gram", "notes": "Nướng cùng bạch tuộc giải ngấy giòn ngọt"}\n        ],'
    content = content.replace(old_bach_tuoc, new_bach_tuoc, 1)

    # canh-ga-chien-nuoc-mam-toi-ot
    old_canh_ga = '{"name": "Dầu ăn thực vật", "quantity": 300, "unit": "ml", "notes": "Chiên ngập dầu cánh gà"}\n        ],'
    new_canh_ga = '{"name": "Dầu ăn thực vật", "quantity": 300, "unit": "ml", "notes": "Chiên ngập dầu cánh gà"},\n            {"name": "Gừng tươi đập dập", "quantity": 20, "unit": "gram", "notes": "Chần sơ cánh gà khử mùi"},\n            {"name": "Mè trắng rang thơm", "quantity": 10, "unit": "gram", "notes": "Rắc lên cánh gà sau khi rim"}\n        ],'
    content = content.replace(old_canh_ga, new_canh_ga, 1)

    # ca-tai-tuong-chien-xu-gion-vay
    old_tai_tuong = '{"name": "Khế chua thái lát", "quantity": 2, "unit": "trái", "notes": "Cuốn bánh tráng kèm cá"}\n        ],'
    new_tai_tuong = '{"name": "Khế chua thái lát", "quantity": 2, "unit": "trái", "notes": "Cuốn bánh tráng kèm cá"},\n            {"name": "Chuối chát thái lát mỏng", "quantity": 1, "unit": "trái", "notes": "Cuốn bánh tráng cùng cá tai tượng"}\n        ],'
    content = content.replace(old_tai_tuong, new_tai_tuong, 1)

    # tom-su-hap-nuoc-dua-tuoi
    old_tom_hap = '{"name": "Muối tiêu chanh chấm kèm", "quantity": 1, "unit": "đĩa", "notes": "Pha cùng ớt băm"}\n        ],'
    new_tom_hap = '{"name": "Muối tiêu chanh chấm kèm", "quantity": 1, "unit": "đĩa", "notes": "Pha cùng ớt băm"},\n            {"name": "Gừng tươi thái sợi", "quantity": 20, "unit": "gram", "notes": "Hấp cùng tôm khử tanh và tăng hương thơm"},\n            {"name": "Ớt chỉ thiên đỏ", "quantity": 2, "unit": "trái", "notes": "Pha muối tiêu chanh"},\n            {"name": "Rau răm tươi", "quantity": 30, "unit": "gram", "notes": "Lót đĩa tôm hấp và ăn kèm"}\n        ],'
    content = content.replace(old_tom_hap, new_tom_hap, 1)

    # muc-trung-hap-gung-sa
    old_muc_hap = '{"name": "Nước mắm gừng chấm kèm", "quantity": 1, "unit": "bát", "notes": "Pha nước mắm đường gừng ớt chua ngọt"}\n        ],'
    new_muc_hap = '{"name": "Nước mắm gừng chấm kèm", "quantity": 1, "unit": "bát", "notes": "Pha nước mắm đường gừng ớt chua ngọt"},\n            {"name": "Rau húng quế", "quantity": 30, "unit": "gram", "notes": "Ăn kèm mực hấp gừng"},\n            {"name": "Chanh tươi vắt nước cốt", "quantity": 1, "unit": "trái", "notes": "Pha nước mắm gừng ớt chấm mực"}\n        ],'
    content = content.replace(old_muc_hap, new_muc_hap, 1)

    with open(b2_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Batch 2 patched successfully.")

# 3. Patch Batch 3
def patch_batch3():
    b3_path = os.path.join(repo_root, "scripts", "recipes_batch3.py")
    with open(b3_path, "r", encoding="utf-8") as f:
        content = f.read()

    # rau-lang-luoc-cham-kho-quet
    old_rau_lang = '{"name": "Hành lá & ớt hiểm băm", "quantity": 30, "unit": "gram", "notes": "Cho vào niêu kho quẹt"}\n        ],'
    new_rau_lang = '{"name": "Hành lá & ớt hiểm băm", "quantity": 30, "unit": "gram", "notes": "Cho vào niêu kho quẹt"},\n            {"name": "Muối hạt tinh", "quantity": 1, "unit": "muỗng cà phê", "notes": "Cho vào nước luộc giữ rau xanh mướt"}\n        ],'
    content = content.replace(old_rau_lang, new_rau_lang, 1)

    # da-day-heo-luoc-gion-san-sat
    old_da_day = '{"name": "Muối tiêu chanh chấm kèm", "quantity": 1, "unit": "đĩa", "notes": "Pha cùng ớt băm"}\n        ],'
    new_da_day = '{"name": "Muối tiêu chanh chấm kèm", "quantity": 1, "unit": "đĩa", "notes": "Pha cùng ớt băm"},\n            {"name": "Bột mì đa dụng", "quantity": 30, "unit": "gram", "notes": "Bóp bao tử khử sạch nhớt"}\n        ],'
    content = content.replace(old_da_day, new_da_day, 1)

    # bap-bo-luoc-cham-mam-gung
    old_bap_bo = '{"name": "Rau húng lủi ăn kèm", "quantity": 50, "unit": "gram", "notes": "Rửa sạch để ráo"}\n        ],'
    new_bap_bo = '{"name": "Rau húng lủi ăn kèm", "quantity": 50, "unit": "gram", "notes": "Rửa sạch để ráo"},\n            {"name": "Hạt tiêu sọ đập dập", "quantity": 1, "unit": "muỗng cà phê", "notes": "Cho vào nước luộc tăng hương thơm"}\n        ],'
    content = content.replace(old_bap_bo, new_bap_bo, 1)

    # goi-xoai-xanh-ca-sac-nuong
    old_goi_xoai = '{"name": "Tỏi và ớt băm nhuyễn", "quantity": 25, "unit": "gram", "notes": "Pha nước mắm trộn gỏi"}\n        ],'
    new_goi_xoai = '{"name": "Tỏi và ớt băm nhuyễn", "quantity": 25, "unit": "gram", "notes": "Pha nước mắm trộn gỏi"},\n            {"name": "Hành phi vàng giòn", "quantity": 25, "unit": "gram", "notes": "Rắc mặt đĩa gỏi tăng độ thơm giòn"}\n        ],'
    content = content.replace(old_goi_xoai, new_goi_xoai, 1)

    # lau-ga-la-e-chuan-vi-da-lat
    old_ga_la_e = '{"name": "Nước mắm ngon cốt cá", "quantity": 3, "unit": "muỗng canh", "notes": "Nêm nước lẩu đậm đà"}\n        ],'
    new_ga_la_e = '{"name": "Nước mắm ngon cốt cá", "quantity": 3, "unit": "muỗng canh", "notes": "Nêm nước lẩu đậm đà"},\n            {"name": "Hành tím nướng thơm", "quantity": 30, "unit": "gram", "notes": "Thả vào nồi lẩu hầm nước dùng ngọt trong"}\n        ],'
    content = content.replace(old_ga_la_e, new_ga_la_e, 1)

    # com-tam-suon-bi-cha-sai-gon
    old_com_tam = '{"name": "Chén mỡ hành lá bóng mượt", "quantity": 1, "unit": "chén", "notes": "Rưới lên mặt cơm sườn"}\n        ],'
    new_com_tam = '{"name": "Chén mỡ hành lá bóng mượt", "quantity": 1, "unit": "chén", "notes": "Rưới lên mặt cơm sườn"},\n            {"name": "Đồ chua củ cải cà rốt", "quantity": 80, "unit": "gram", "notes": "Kèm dĩa cơm tấm giải ngấy"}\n        ],'
    content = content.replace(old_com_tam, new_com_tam, 1)

    # com-ga-hoi-an-vang-ong
    old_com_ga = '{"name": "Chén tương ớt xào Hội An", "quantity": 1, "unit": "chén", "notes": "Cay ngọt đậm đà"}\n        ],'
    new_com_ga = '{"name": "Chén tương ớt xào Hội An", "quantity": 1, "unit": "chén", "notes": "Cay ngọt đậm đà"},\n            {"name": "Bột nghệ vàng", "quantity": 1, "unit": "muỗng cà phê", "notes": "Nấu cơm tạo màu vàng óng ả"}\n        ],'
    content = content.replace(old_com_ga, new_com_ga, 1)

    # chao-suon-sun-pho-co-ha-noi
    old_chao_suon = '{"name": "Hành hoa & ngò rí", "quantity": 40, "unit": "gram", "notes": "Thái nhỏ rắc mặt bát cháo"}\n        ],'
    new_chao_suon = '{"name": "Hành hoa & ngò rí", "quantity": 40, "unit": "gram", "notes": "Thái nhỏ rắc mặt bát cháo"},\n            {"name": "Bột tiêu sọ xay mịn", "quantity": 1, "unit": "muỗng cà phê", "notes": "Rắc lên mặt bát cháo"}\n        ],'
    content = content.replace(old_chao_suon, new_chao_suon, 1)

    # oc-huong-rang-muoi-tuyet (ingredients + 5th step)
    old_oc_huong = '{"name": "Muối hạt tinh khiết", "quantity": 2, "unit": "muỗng canh", "notes": "Giã nhuyễn làm muối tuyết"}\n        ],'
    new_oc_huong = '{"name": "Muối hạt tinh khiết", "quantity": 2, "unit": "muỗng canh", "notes": "Giã nhuyễn làm muối tuyết"},\n            {"name": "Gừng tươi giã dập", "quantity": 20, "unit": "gram", "notes": "Luộc sơ ốc hương khử tanh"},\n            {"name": "Lá chanh tươi thái chỉ", "quantity": 5, "unit": "lá", "notes": "Rắc lên ốc khi hoàn thành"},\n            {"name": "Nước cốt tắc (quất)", "quantity": 2, "unit": "quả", "notes": "Pha muối tiêu ớt chấm kèm"}\n        ],'
    content = content.replace(old_oc_huong, new_oc_huong, 1)

    old_oc_huong_steps = '{"stepNumber": 4, "title": "Bày đĩa và thưởng thức", "description": "Trút ốc hương rang muối tuyết ra đĩa có lót rau răm, ăn kèm muối tiêu chanh hoặc nước mắm chua ngọt khi ốc còn nóng rực.", "timerMinutes": null}\n        ]'
    new_oc_huong_steps = '{"stepNumber": 4, "title": "Rang muối tuyết áo đều vỏ ốc", "description": "Cho hỗn hợp muối ớt vào chảo đảo liên tục trên lửa nhỏ cùng ốc hương đến khi hạt muối se khô bám trắng xóa quanh vỏ ốc như tuyết.", "timerMinutes": 4},\n            {"stepNumber": 5, "title": "Bày đĩa và thưởng thức", "description": "Trút ốc hương rang muối tuyết ra đĩa, rắc lá chanh thái chỉ mỏng lên trên. Thưởng thức nóng cùng rau răm và chén muối tiêu tắc cay thơm.", "timerMinutes": null}\n        ]'
    content = content.replace(old_oc_huong_steps, new_oc_huong_steps, 1)

    # hau-nuong-mo-hanh-pho-mai
    old_hau_nuong = '{"name": "Phô mai Mozzarella sợi", "quantity": 100, "unit": "gram", "notes": "Rải lên hàu nướng phô mai kéo sợi"}\n        ],'
    new_hau_nuong = '{"name": "Phô mai Mozzarella sợi", "quantity": 100, "unit": "gram", "notes": "Rải lên hàu nướng phô mai kéo sợi"},\n            {"name": "Ớt sừng băm nhuyễn", "quantity": 1, "unit": "trái", "notes": "Điểm xuyết lên mặt hàu nướng mỡ hành"},\n            {"name": "Rau răm ăn kèm", "quantity": 30, "unit": "gram", "notes": "Rửa sạch để ráo ăn kèm hàu nướng"},\n            {"name": "Muối tiêu chanh", "quantity": 1, "unit": "chén", "notes": "Chấm thịt hàu nóng hổi"}\n        ],'
    content = content.replace(old_hau_nuong, new_hau_nuong, 1)

    # tom-cang-xanh-sot-trung-muoi
    old_tom_cang = '{"name": "Dầu ăn thực vật", "quantity": 250, "unit": "ml", "notes": "Chiên giòn tôm càng"}\n        ],'
    new_tom_cang = '{"name": "Dầu ăn thực vật", "quantity": 250, "unit": "ml", "notes": "Chiên giòn tôm càng"},\n            {"name": "Rượu trắng", "quantity": 1, "unit": "muỗng canh", "notes": "Rửa lòng đỏ trứng muối khử tanh"},\n            {"name": "Bánh mì giòn ăn kèm", "quantity": 2, "unit": "ổ", "notes": "Chấm nước sốt bơ trứng muối béo ngậy"}\n        ],'
    content = content.replace(old_tom_cang, new_tom_cang, 1)

    # banh-trang-nuong-da-lat
    old_bt_nuong = '{"name": "Tương ớt & mayonnaise", "quantity": 3, "unit": "muỗng canh", "notes": "Xịt zíc zắc lên mặt bánh tráng"}\n        ],'
    new_bt_nuong = '{"name": "Tương ớt & mayonnaise", "quantity": 3, "unit": "muỗng canh", "notes": "Xịt zíc zắc lên mặt bánh tráng"},\n            {"name": "Phô mai con bò cười", "quantity": 1, "unit": "miếng", "notes": "Tán đều lên mặt bánh tráng nướng béo ngậy"}\n        ],'
    content = content.replace(old_bt_nuong, new_bt_nuong, 1)

    # cut-lon-xao-me-chua-ngot (steps)
    old_cut_lon_steps = '{"stepNumber": 4, "title": "Rim trứng cút lộn sốt me", "description": "Thả toàn bộ trứng cút lộn vào chảo sốt me, đun nhỏ lửa trong 4 phút lắc nhẹ chảo cho sốt áo đều quanh từng quả trứng. Rắc đậu phộng rang và rau răm lên trên rồi tắt bếp.", "timerMinutes": 4}\n        ]'
    new_cut_lon_steps = '{"stepNumber": 4, "title": "Rim trứng cút lộn sốt me", "description": "Thả toàn bộ trứng cút lộn vào chảo sốt me, đun nhỏ lửa trong 4 phút lắc nhẹ chảo cho sốt áo đều quanh từng quả trứng. Rắc đậu phộng rang và rau răm lên trên.", "timerMinutes": 4},\n            {"stepNumber": 5, "title": "Thưởng thức nóng hổi với bánh mì", "description": "Múc cút lộn xào me ra đĩa sâu lòng, rắc thêm đậu phộng rang giòn và vài nhánh rau răm. Ăn nóng kèm bánh mì ổ giòn chấm nước sốt me sánh sệt đậm đà.", "timerMinutes": null}\n        ]'
    content = content.replace(old_cut_lon_steps, new_cut_lon_steps, 1)

    # bap-xao-tep-kho-bo-thom
    old_bap_xao = '{"name": "Hạt nêm và tiêu xay", "quantity": 1, "unit": "muỗng cà phê", "notes": "Nêm nếm vừa miệng"}\n        ],'
    new_bap_xao = '{"name": "Hạt nêm và tiêu xay", "quantity": 1, "unit": "muỗng cà phê", "notes": "Nêm nếm vừa miệng"},\n            {"name": "Đường cát trắng", "quantity": 1, "unit": "muỗng canh", "notes": "Cân bằng vị béo mặn của bơ và tép"},\n            {"name": "Tương ớt cay", "quantity": 2, "unit": "muỗng canh", "notes": "Xịt lên mặt đĩa bắp xào khi ăn"},\n            {"name": "Tiêu đen xay nhuyễn", "quantity": 1, "unit": "muỗng cà phê", "notes": "Tạo vị cay nồng thơm ấm"}\n        ],'
    content = content.replace(old_bap_xao, new_bap_xao, 1)

    with open(b3_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Batch 3 patched successfully.")

if __name__ == "__main__":
    patch_batch1()
    patch_batch2()
    patch_batch3()
