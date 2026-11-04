#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Recipes Batch 1: Categories 1 to 8 (38 recipes)
mon-khai-vi, mon-chinh, canh-sup, mon-chay, trang-mieng, do-uong, mon-kho, mon-xao
Includes mandatory 'pho-bo-tai-lan-chuan-vi-ha-thanh'
"""

null = None

RECIPES_BATCH_1 = [
    # ==================== 1. MÓN KHAI VỊ (mon-khai-vi) ====================
    {
        "title": "Gỏi cuốn tôm thịt thanh mát kèm sốt tương đen",
        "slug": "goi-cuon-tom-thit-thanh-mat",
        "categorySlug": "mon-khai-vi",
        "authorEmail": "author@culinaryblog.com",
        "description": "Món khai vị thanh tao trứ danh của Việt Nam với tôm sú tươi ngọt, thịt ba chỉ luộc mềm thái mỏng, bún tươi và các loại rau thơm tươi non cuộn chặt trong bánh tráng dẻo, chấm cùng tương đen bùi ngậy bơ đậu phộng.",
        "instructions": "### Hướng dẫn làm Gỏi cuốn tôm thịt chuẩn vị\n\n- **Bí quyết chọn thịt và tôm**: Chọn thịt ba chỉ có nạc mỡ đan xen đều, luộc với chút hành tím và muối hạt để thịt thơm trắng. Tôm sú hấp sơ với chút rượu trắng cho đỏ au và ngọt thịt, sau đó chẻ đôi dọc sống lưng.\n- **Sốt chấm tương đen**: Phi thơm tỏi băm, xào tương đen với bơ đậu phộng mịn, nước dừa tươi và đường thốt nốt đến khi sánh bóng mượt mà, rắc đậu phộng rang giã dập và ớt băm lên trên.",
        "prepTimeMinutes": 25,
        "cookTimeMinutes": 15,
        "servings": 4,
        "difficulty": "Easy",
        "nutrition": {"calories": 320, "protein": 18.5, "carbohydrates": 42.0, "fat": 8.5, "fiber": 3.0, "sodium": 680},
        "ingredients": [
            {"name": "Tôm sú tươi", "quantity": 300, "unit": "gram", "notes": "Hấp chín, bóc vỏ, chẻ đôi dọc sống lưng"},
            {"name": "Thịt ba chỉ heo", "quantity": 300, "unit": "gram", "notes": "Luộc chín tới, ngâm nước đá, thái lát mỏng"},
            {"name": "Bánh tráng gỏi cuốn", "quantity": 20, "unit": "cái", "notes": "Bánh tráng dẻo mềm không bị gãy"},
            {"name": "Bún tươi sợi nhỏ", "quantity": 300, "unit": "gram", "notes": "Chần sơ nước sôi, để ráo"},
            {"name": "Xà lách tươi", "quantity": 200, "unit": "gram", "notes": "Rửa sạch, tách bẹ để ráo nước"},
            {"name": "Rau húng quế và húng lủi", "quantity": 100, "unit": "gram", "notes": "Nhặt lá non rửa sạch"},
            {"name": "Hẹ lá tươi", "quantity": 50, "unit": "gram", "notes": "Cắt khúc dài khoảng 12cm để lộ cọng khi cuốn"},
            {"name": "Tương hột đen xay nhuyễn", "quantity": 100, "unit": "ml", "notes": "Tương đen mịn dùng làm sốt chấm"},
            {"name": "Bơ đậu phộng mịn", "quantity": 2, "unit": "muỗng canh", "notes": "Tạo độ sánh béo thơm ngậy cho sốt"},
            {"name": "Đậu phộng rang giã dập", "quantity": 30, "unit": "gram", "notes": "Rắc lên mặt chén sốt chấm"},
            {"name": "Tỏi và ớt băm nhỏ", "quantity": 20, "unit": "gram", "notes": "Phi thơm sốt và nêm nếm cay nhẹ"},
            {"name": "Đồ chua củ cải cà rốt", "quantity": 50, "unit": "gram", "notes": "Ăn kèm nước chấm tăng vị chua ngọt"}
        ],
        "steps": [
            {"stepNumber": 1, "title": "Sơ chế và luộc thịt ba chỉ", "description": "Rửa sạch thịt ba chỉ với nước muối loãng. Đun sôi nồi nước cùng 1 củ hành tím đập dập và chút muối, cho thịt vào luộc trong 15 phút đến khi chín tới. Vớt ra ngâm ngay vào âu nước đá lạnh 5 phút để thịt săn giòn và trắng nõn, sau đó thái lát mỏng vừa ăn.", "timerMinutes": 15},
            {"stepNumber": 2, "title": "Hấp và chẻ đôi tôm sú", "description": "Tôm rửa sạch, cho vào xửng hấp cùng 1 nhánh sả đập dập trong 5-7 phút cho tôm chuyển màu đỏ cam ngọt thịt. Bóc vỏ, bỏ chỉ đen lưng, dùng dao sắc chẻ đôi từng con tôm theo chiều dọc.", "timerMinutes": 7},
            {"stepNumber": 3, "title": "Nấu sốt tương đen bơ đậu phộng", "description": "Phi thơm tỏi băm với dầu ăn trong chảo nhỏ, cho tương đen và bơ đậu phộng cùng 3 muỗng nước dừa tươi, 1 muỗng đường vào khuấy đều trên lửa nhỏ 5 phút cho sốt sánh mịn đậm đà, tắt bếp để nguội.", "timerMinutes": 5},
            {"stepNumber": 4, "title": "Cuốn gỏi cuốn đẹp mắt", "description": "Thấm ướt nhẹ bánh tráng bằng khăn ẩm sạch. Xếp một lớp xà lách, rau thơm, bún tươi và vài lát thịt ba chỉ. Cuộn tròn một vòng, sau đó xếp 3 nửa con tôm (mặt đỏ úp xuống dưới) và cọng hẹ thò ra ngoài, gấp hai mép bên hông lại rồi cuộn chặt tay.", "timerMinutes": null},
            {"stepNumber": 5, "title": "Trình bày và thưởng thức", "description": "Xếp các cuốn gỏi ra đĩa cùng chén sốt tương đen thơm lừng, rắc đậu phộng rang giã dập, ớt băm và chút đồ chua lên trên chén sốt. Thưởng thức ngay khi bánh tráng còn mềm dai tươi ngon.", "timerMinutes": null}
        ]
    },
    {
        "title": "Nem rán truyền thống Hà Nội giòn rụm",
        "slug": "nem-ran-truyen-thong-ha-noi",
        "categorySlug": "mon-khai-vi",
        "authorEmail": "author@culinaryblog.com",
        "description": "Món chả giò truyền thống của người Tràng An với nhân thịt vai băm, tôm tươi, miến dong, mộc nhĩ, nấm hương và rau củ, gói trong bánh đa nem giòn rụm màu vàng ruộm, chấm nước mắm chua ngọt thanh tao.",
        "instructions": "### Bí quyết làm Nem rán Hà Nội vàng giòn lâu\n\n- **Độ ẩm của nhân**: Nhân nem không được quá ướt, trứng gà cho từng lòng đỏ vào trộn đều, chỉ dùng lượng lòng trắng vừa đủ để kết dính.\n- **Kỹ thuật rán 2 lần**: Lần 1 rán sơ ở lửa vừa cho nem se mặt định hình. Lần 2 trước khi ăn rán lửa lớn cho vỏ ngoài vàng óng giòn tan thoát dầu.",
        "prepTimeMinutes": 30,
        "cookTimeMinutes": 25,
        "servings": 6,
        "difficulty": "Medium",
        "nutrition": {"calories": 420, "protein": 22.0, "carbohydrates": 35.0, "fat": 21.0, "fiber": 2.8, "sodium": 750},
        "ingredients": [
            {"name": "Thịt nạc vai heo xay", "quantity": 400, "unit": "gram", "notes": "Thịt dẻo có chút mỡ để nem không bị khô"},
            {"name": "Tôm sú bóc nõn", "quantity": 150, "unit": "gram", "notes": "Băm nhỏ hạt lựu tăng độ ngọt"},
            {"name": "Miến dong", "quantity": 50, "unit": "gram", "notes": "Ngâm nước ấm mềm, cắt khúc 1.5cm"},
            {"name": "Mộc nhĩ khô", "quantity": 20, "unit": "gram", "notes": "Ngâm nở, rửa sạch thái sợi nhỏ"},
            {"name": "Nấm hương khô", "quantity": 15, "unit": "gram", "notes": "Ngâm nở băm nhỏ dậy mùi thơm"},
            {"name": "Cà rốt", "quantity": 1, "unit": "củ", "notes": "Bào sợi ngắn vắt nhẹ bớt nước"},
            {"name": "Su hào hoặc củ đậu", "quantity": 100, "unit": "gram", "notes": "Thái sợi vắt ráo nước để nhân khô"},
            {"name": "Trứng gà ta", "quantity": 3, "unit": "quả", "notes": "Lấy lòng đỏ và một phần lòng trắng"},
            {"name": "Hành hoa và rau mùi", "quantity": 50, "unit": "gram", "notes": "Rửa sạch thái nhỏ"},
            {"name": "Hành khô", "quantity": 3, "unit": "củ", "notes": "Băm nhuyễn"},
            {"name": "Bánh đa nem gói nem", "quantity": 30, "unit": "lá", "notes": "Bánh đa nem gạo truyền thống"},
            {"name": "Dầu ăn", "quantity": 300, "unit": "ml", "notes": "Dùng chiên nem ngập dầu"},
            {"name": "Nước mắm ngon và giấm gạo", "quantity": 3, "unit": "muỗng canh", "notes": "Pha nước chấm chua ngọt"}
        ],
        "steps": [
            {"stepNumber": 1, "title": "Sơ chế nguyên liệu nhân nem", "description": "Ngâm miến dong, mộc nhĩ, nấm hương vào nước ấm cho nở mềm, vớt ra rửa sạch, để ráo rồi băm nhỏ. Cà rốt và củ đậu bào sợi ngắn, vắt nhẹ cho ra bớt nước thừa để tránh làm nhũn bánh đa nem.", "timerMinutes": null},
            {"stepNumber": 2, "title": "Trộn đều nhân nem", "description": "Cho thịt nạc vai, tôm băm, miến, mộc nhĩ, nấm hương, cà rốt, củ đậu, hành khô, hành hoa vào tô lớn. Nêm 1 muỗng cà phê tiêu đen xay, 1 muỗng hạt nêm, 1 muỗng nước mắm ngon. Cho lòng đỏ trứng vào trộn nhẹ tay cho nhân hòa quyện.", "timerMinutes": null},
            {"stepNumber": 3, "title": "Cuốn nem thon đều", "description": "Trải lá bánh đa nem ra thớt phẳng, thoa nhẹ chút nước giấm pha loãng lên mép bánh để vỏ giòn. Múc lượng nhân vừa phải đặt vào 1/3 lá bánh, gập hai mép bên hông lại và cuộn tròn đều tay, không cuộn quá chặt kẻo khi rán nem nở rách vỏ.", "timerMinutes": null},
            {"stepNumber": 4, "title": "Rán nem lần 1 (Rán chín sơ)", "description": "Đun nóng dầu ăn trong chảo sâu lòng trên lửa vừa. Thả từng chiếc nem vào rán ngập dầu trong khoảng 8-10 phút cho vỏ ngoài se cứng và nhân vừa chín tới thì vớt ra khay lót giấy thấm dầu.", "timerMinutes": 10},
            {"stepNumber": 5, "title": "Rán nem lần 2 (Rán giòn vàng ruộm)", "description": "Trước khi ăn, đun dầu sôi nóng già, thả nem vào rán lại lần 2 trên lửa lớn trong 4-5 phút cho vỏ nem chuyển sang màu vàng cánh gián óng ả và giòn rụm thì vớt ra ngay.", "timerMinutes": 5},
            {"stepNumber": 6, "title": "Pha nước mắm và thưởng thức", "description": "Pha nước chấm theo tỷ lệ 1 mắm : 1 giấm : 1 đường : 5 nước ấm, khuấy tan rồi thả tỏi ớt băm cùng đu đủ cà rốt ngâm chua vào. Cắt nem thành từng miếng vừa ăn, thưởng thức kèm bún tươi và rau sống.", "timerMinutes": null}
        ]
    },
    {
        "title": "Chả giò rế hải sản chiên xù sốt mayonnaise",
        "slug": "cha-gio-re-hai-san-chien-xu",
        "categorySlug": "mon-khai-vi",
        "authorEmail": "author@culinaryblog.com",
        "description": "Sự kết hợp tinh tế giữa bánh tráng rế giòn tan độc đáo và nhân hải sản tôm mực tươi ngon ngọt lịm, quyện cùng sốt chấm mayonnaise chua béo kích thích vị giác.",
        "instructions": "### Mẹo cuốn chả giò rế không bị vỡ\n\nBánh tráng rế có cấu trúc mắt lưới giòn xốp. Để cuốn dễ dàng, cần giữ bánh tráng trong khăn ẩm nhẹ 1-2 phút trước khi cuốn. Rán trên lửa vừa để phần rế nở phồng bung xốp đều màu.",
        "prepTimeMinutes": 25,
        "cookTimeMinutes": 15,
        "servings": 4,
        "difficulty": "Medium",
        "nutrition": {"calories": 390, "protein": 20.0, "carbohydrates": 32.0, "fat": 20.5, "fiber": 2.1, "sodium": 620},
        "ingredients": [
            {"name": "Tôm sú tươi bóc nõn", "quantity": 250, "unit": "gram", "notes": "Băm nhỏ hạt lựu"},
            {"name": "Mực ống tươi", "quantity": 150, "unit": "gram", "notes": "Rửa sạch băm nhỏ"},
            {"name": "Thịt nạc heo xay", "quantity": 100, "unit": "gram", "notes": "Tăng độ kết dính cho nhân"},
            {"name": "Củ sắn (củ đậu)", "quantity": 80, "unit": "gram", "notes": "Thái hạt lựu vắt ráo nước"},
            {"name": "Cà rốt tươi", "quantity": 50, "unit": "gram", "notes": "Bào sợi ngắn"},
            {"name": "Hành tây băm nhỏ", "quantity": 40, "unit": "gram", "notes": "Xào sơ cho ngọt"},
            {"name": "Hành lá và ngò rí", "quantity": 30, "unit": "gram", "notes": "Rửa sạch băm nhỏ"},
            {"name": "Bánh tráng rế", "quantity": 20, "unit": "lá", "notes": "Loại rế vàng giòn chuyên dụng"},
            {"name": "Lòng đỏ trứng gà", "quantity": 2, "unit": "quả", "notes": "Tạo độ dẻo kết dính"},
            {"name": "Sốt mayonnaise hảo hạng", "quantity": 4, "unit": "muỗng canh", "notes": "Làm sốt chấm chua béo"},
            {"name": "Tương ớt chua ngọt", "quantity": 2, "unit": "muỗng canh", "notes": "Khuấy đều cùng mayonnaise"},
            {"name": "Dầu ăn thực vật", "quantity": 300, "unit": "ml", "notes": "Chiên ngập dầu"}
        ],
        "steps": [
            {"stepNumber": 1, "title": "Sơ chế hải sản tươi sạch", "description": "Tôm sú bóc nõn rút chỉ đen lưng, mực làm sạch túi mực và da màng. Rửa sạch bằng nước muối loãng pha chút gừng, sau đó thấm thật khô ráo rồi băm hạt lựu nhỏ.", "timerMinutes": null},
            {"stepNumber": 2, "title": "Trộn nhân chả giò hải sản", "description": "Trộn đều tôm, mực, thịt xay, củ sắn, cà rốt, hành tây và ngò rí trong tô lớn. Nêm 1 muỗng cà phê hạt nêm, 1/2 muỗng tiêu trắng xay và lòng đỏ trứng gà, quết đều tay trong 3 phút cho nhân dẻo dính.", "timerMinutes": 3},
            {"stepNumber": 3, "title": "Cuốn chả giò bánh tráng rế", "description": "Đặt bánh tráng rế lên thớt, cho lượng nhân vừa vặn vào giữa, gập 2 mép bên hông rồi cuộn tròn thon dài đẹp mắt. Thoa chút lòng trắng trứng ở mép cuối để cố định chả giò.", "timerMinutes": null},
            {"stepNumber": 4, "title": "Chiên chả giò rế vàng giòn", "description": "Đun nóng dầu ăn đến nhiệt độ khoảng 160°C. Thả từng cuốn chả giò rế vào chiên trên lửa vừa trong 6-8 phút cho sợi rế nở phồng bung xốp và chuyển màu vàng tươi ruộm thì vớt ra ráo dầu.", "timerMinutes": 8},
            {"stepNumber": 5, "title": "Pha sốt và thưởng thức", "description": "Khuấy đều sốt mayonnaise với tương ớt chua ngọt và vài giọt nước cốt chanh. Xếp chả giò rế ra đĩa trang trí với xà lách và cà chua bi, dùng nóng chấm sốt béo ngậy.", "timerMinutes": null}
        ]
    },
    {
        "title": "Nộm bò bóp thấu chua ngọt giòn sần sật",
        "slug": "nom-bo-bop-thau-chua-ngot",
        "categorySlug": "mon-khai-vi",
        "authorEmail": "author@culinaryblog.com",
        "description": "Món khai vị trứ danh kết hợp thịt bắp bò mềm ngọt tái chanh, chuối chát, khế chua, dứa thơm, hành tây giòn ngọt cùng lạc rang thơm bùi, kích thích trọn vẹn vị giác.",
        "instructions": "### Bí quyết làm Bò bóp thấu thịt mềm mọng không dai\n\n- Thịt bắp bò phải thái thật mỏng ngang thớ. Chần sơ nhanh trong nước sôi có gừng đập dập khoảng 30 giây rồi vớt ra ngay, không để chín kỹ.\n- Khế và chuối xanh sau khi thái lát mỏng phải ngâm ngay vào âu nước đá vắt chanh để giữ màu trắng tinh và độ giòn sần sật.",
        "prepTimeMinutes": 25,
        "cookTimeMinutes": 5,
        "servings": 4,
        "difficulty": "Easy",
        "nutrition": {"calories": 285, "protein": 24.0, "carbohydrates": 18.5, "fat": 12.0, "fiber": 3.5, "sodium": 590},
        "ingredients": [
            {"name": "Bắp bò hoa tươi", "quantity": 350, "unit": "gram", "notes": "Thái lát thật mỏng ngang thớ"},
            {"name": "Chuối chát xanh", "quantity": 2, "unit": "quả", "notes": "Tước vỏ ngoài, thái lát mỏng ngâm nước chanh"},
            {"name": "Khế chua tươi", "quantity": 2, "unit": "quả", "notes": "Gọt rìa cánh khế, thái lát mỏng hình ngôi sao"},
            {"name": "Dứa chín thơm", "quantity": 100, "unit": "gram", "notes": "Gọt mắt, thái con chì nhỏ"},
            {"name": "Hành tây trắng", "quantity": 1, "unit": "củ", "notes": "Thái mỏng ngâm giấm đường đá lạnh khử hăng"},
            {"name": "Cà rốt", "quantity": 1, "unit": "củ", "notes": "Bào sợi giòn"},
            {"name": "Rau răm và ngò gai", "quantity": 50, "unit": "gram", "notes": "Rửa sạch cắt khúc ngắn"},
            {"name": "Đậu phộng rang vàng giã dập", "quantity": 40, "unit": "gram", "notes": "Rắc lên mặt khi hoàn thành"},
            {"name": "Hành phi vàng thơm", "quantity": 20, "unit": "gram", "notes": "Tạo độ thơm bùi đặc trưng"},
            {"name": "Nước cốt chanh tươi", "quantity": 4, "unit": "muỗng canh", "notes": "Vắt lấy nước cốt lọc bỏ hạt"},
            {"name": "Nước mắm ngon và đường cát", "quantity": 3, "unit": "muỗng canh", "notes": "Pha nước sốt bóp gỏi"},
            {"name": "Ớt sừng băm và tỏi băm", "quantity": 15, "unit": "gram", "notes": "Gia vị cay thơm hài hòa"}
        ],
        "steps": [
            {"stepNumber": 1, "title": "Sơ chế thịt bắp bò", "description": "Thịt bắp bò rửa sạch thấm khô, dùng dao bén thái lát thật mỏng. Đun sôi một nồi nước nhỏ với 1 củ gừng đập dập, trút thịt bò vào chần nhanh trong 30-40 giây cho thịt vừa chín tái hồng thì vớt ra ngay vào đĩa để ráo.", "timerMinutes": 1},
            {"stepNumber": 2, "title": "Sơ chế các loại rau củ ghém", "description": "Chuối xanh tước vỏ thái lát mỏng ngâm vào nước đá vắt nước cốt chanh. Khế chua thái lát mỏng. Hành tây thái mỏng ngâm giấm đường với vài viên đá lạnh 10 phút cho giòn ngọt hết hăng. Vớt tất cả ra để ráo nước.", "timerMinutes": null},
            {"stepNumber": 3, "title": "Pha nước sốt bóp thấu đậm đà", "description": "Hòa tan 3 muỗng canh nước mắm nguyên chất, 3 muỗng canh đường cát, 3 muỗng canh nước cốt chanh, 1 muỗng cà phê bột ngọt. Khuấy tan hoàn toàn rồi cho tỏi băm và ớt sừng băm vào nổi trên mặt sốt.", "timerMinutes": null},
            {"stepNumber": 4, "title": "Bóp thấu thịt bò và rau củ", "description": "Cho thịt bò chần tái vào âu lớn cùng 1/2 lượng nước sốt, bóp nhẹ tay cho thịt ngấm vị trong 3 phút. Tiếp tục cho chuối chát, khế, dứa, hành tây, cà rốt và phần nước sốt còn lại vào trộn nhẹ tay cho ngấm đều gia vị.", "timerMinutes": 3},
            {"stepNumber": 5, "title": "Trình bày và thưởng thức", "description": "Cho rau răm, ngò gai vào đảo nhẹ rồi gắp nộm ra đĩa cao lòng. Rắc đậu phộng rang giã dập, mè rang và hành phi giòn lên trên cùng. Thưởng thức kèm bánh phồng tôm giòn tan.", "timerMinutes": null}
        ]
    },
    {
        "title": "Bánh tôm Hồ Tây vàng ruộm giòn tan",
        "slug": "banh-tom-ho-tay-vang-ruom",
        "categorySlug": "mon-khai-vi",
        "authorEmail": "author@culinaryblog.com",
        "description": "Đặc sản nức tiếng đất Hà Thành với sợi khoai lang bùi ngọt đượm bột nghệ giòn rụm, ôm trọn chú tôm nước ngọt tươi rói đỏ au, chấm nước mắm giấm ớt đu đủ chua ngọt giòn giòn.",
        "instructions": "### Bí quyết bột bánh tôm giòn xốp lâu\n\nPha bột gạo tẻ với một chút bột năng và bột nở, thêm chút bột nghệ tạo sắc vàng rực rỡ. Khoai lang chọn loại khoai vàng củ ngọt, thái sợi tăm đều đặn ngâm nước muối loãng cho bớt nhựa.",
        "prepTimeMinutes": 30,
        "cookTimeMinutes": 20,
        "servings": 4,
        "difficulty": "Medium",
        "nutrition": {"calories": 380, "protein": 17.0, "carbohydrates": 45.0, "fat": 15.0, "fiber": 3.8, "sodium": 640},
        "ingredients": [
            {"name": "Tôm tươi nước ngọt", "quantity": 300, "unit": "gram", "notes": "Tôm đồng hoặc tôm nước ngọt tươi sống cắt râu"},
            {"name": "Khoai lang vàng", "quantity": 300, "unit": "gram", "notes": "Gọt vỏ thái sợi mỏng ngâm nước muối"},
            {"name": "Bột mì đa dụng", "quantity": 100, "unit": "gram", "notes": "Tạo kết cấu thân bánh"},
            {"name": "Bột gạo tẻ", "quantity": 50, "unit": "gram", "notes": "Tạo độ giòn xốp truyền thống"},
            {"name": "Bột năng", "quantity": 30, "unit": "gram", "notes": "Tăng độ dẻo giòn"},
            {"name": "Bột nghệ vàng", "quantity": 1, "unit": "muỗng cà phê", "notes": "Tạo màu vàng ruộm tự nhiên bắt mắt"},
            {"name": "Bột nở baking powder", "quantity": 1/2, "unit": "muỗng cà phê", "notes": "Giúp bột phồng xốp rế"},
            {"name": "Trứng gà", "quantity": 1, "unit": "quả", "notes": "Tạo độ ngậy thơm cho vỏ bánh"},
            {"name": "Dầu ăn", "quantity": 400, "unit": "ml", "notes": "Chiên ngập dầu giòn đều"},
            {"name": "Rau sống ăn kèm", "quantity": 200, "unit": "gram", "notes": "Xà lách, kinh giới, tía tô, húng láng"},
            {"name": "Đu đủ xanh và cà rốt ngâm chua", "quantity": 100, "unit": "gram", "notes": "Thái lát mỏng ngâm giấm đường ăn kèm nước mắm"},
            {"name": "Nước mắm cá cơm truyền thống", "quantity": 4, "unit": "muỗng canh", "notes": "Pha nước chấm chua cay mặn ngọt"}
        ],
        "steps": [
            {"stepNumber": 1, "title": "Sơ chế khoai lang và tôm", "description": "Khoai lang gọt vỏ, dùng dao bào thái thành các sợi mỏng dài khoảng 5cm. Ngâm ngay vào âu nước muối loãng 15 phút cho ra hết nhựa, sau đó vớt ra xả sạch để thật ráo nước. Tôm rửa sạch, cắt bỏ râu và ngạnh nhọn đầu tôm, để ráo.", "timerMinutes": null},
            {"stepNumber": 2, "title": "Pha bột chiên bánh tôm", "description": "Trộn đều bột mì, bột gạo, bột năng, bột nghệ, bột nở và 1/2 muỗng cà phê muối trong âu lớn. Đập trứng gà vào cùng khoảng 180ml nước lạnh, khuấy đều nhẹ tay thành hỗn hợp sánh mịn không vón cục. Để bột nghỉ 15 phút.", "timerMinutes": 15},
            {"stepNumber": 3, "title": "Trộn khoai vào bột", "description": "Cho toàn bộ khoai lang sợi ráo nước vào âu bột, đảo nhẹ tay cho bột áo đều một lớp mỏng quanh từng sợi khoai lang.", "timerMinutes": null},
            {"stepNumber": 4, "title": "Rán bánh tôm vàng giòn", "description": "Đun dầu nóng già trong chảo sâu lòng. Dùng muôi phẳng múc một lớp khoai sợi phủ bột dàn mỏng, gắp 2 con tôm đặt lên giữa muôi khoai rồi nhẹ nhàng thả lướt vào chảo dầu sôi. Chiên trên lửa vừa trong 4-5 phút mỗi mặt đến khi bánh tôm vàng ươm giòn rụm thì vớt ra gác lên vỉ ráo dầu.", "timerMinutes": 5},
            {"stepNumber": 5, "title": "Pha nước chấm và thưởng thức", "description": "Pha nước mắm chua ngọt ấm nồng vị tỏi ớt băm cùng lát đu đủ cà rốt giòn ngọt. Cắt bánh tôm thành miếng vừa ăn, cuốn cùng rau sống tươi non và chấm đẫm vào bát nước mắm.", "timerMinutes": null}
        ]
    },

    # ==================== 2. MÓN CHÍNH (mon-chinh) ====================
    {
        "title": "Phở bò tái lăn chuẩn vị Hà Thành",
        "slug": "pho-bo-tai-lan-chuan-vi-ha-thanh",
        "categorySlug": "mon-chinh",
        "authorEmail": "author@culinaryblog.com",
        "description": "Phở bò tái lăn chuẩn vị Hà Thành với thịt bò thăn mềm ngọt được xào lăn nhanh trên chảo gang lửa lớn cùng gừng tỏi dậy mùi thơm nức, hòa quyện trong làn nước dùng hầm từ xương ống bò thơm lừng quế hồi thảo quả.",
        "instructions": "### Bí quyết nấu Phở bò tái lăn Hà Nội chuẩn vị\n\nPhở tái lăn là một biến tấu đặc sắc của phở truyền thống, nổi tiếng nhất tại phố Lò Đúc. Điểm mấu chốt nằm ở kỹ thuật xào lăn: chảo gang phải thật nóng, dầu ăn già, cho tỏi gừng đập dập phi thơm rồi trút thịt bò vào đảo nhanh tay trong 30-45 giây để thịt vừa chín tới bên ngoài nhưng bên trong vẫn giữ nguyên độ hồng mềm mọng ngọt nước.\n\nNước dùng phở phải được ninh từ xương ống bò trong ít nhất 8 tiếng cùng gừng nướng, hành tây nướng, quế, hồi, thảo quả và rễ mùi già, luôn hớt bọt để nước trong vắt và dậy hương thơm nồng ấm đặc trưng.",
        "prepTimeMinutes": 30,
        "cookTimeMinutes": 90,
        "servings": 4,
        "difficulty": "Medium",
        "nutrition": {"calories": 580, "protein": 36.5, "carbohydrates": 68.0, "fat": 16.5, "fiber": 3.2, "sodium": 1250},
        "ingredients": [
            {"name": "Bánh phở tươi", "quantity": 800, "unit": "gram", "notes": "Sợi phở mềm dai tươi mới trong ngày"},
            {"name": "Thịt thăn bò tươi", "quantity": 400, "unit": "gram", "notes": "Thái lát mỏng bản to ngang thớ"},
            {"name": "Xương ống bò", "quantity": 1000, "unit": "gram", "notes": "Chặt khúc, ngâm nước muối loãng chần sạch"},
            {"name": "Gừng già", "quantity": 80, "unit": "gram", "notes": "Một nửa nướng thơm, một nửa đập dập băm nhỏ xào thịt"},
            {"name": "Hành tây", "quantity": 2, "unit": "củ", "notes": "Nướng thơm bóc vỏ để ninh nước dùng"},
            {"name": "Hoa hồi", "quantity": 4, "unit": "bông", "notes": "Rang thơm trên chảo nhỏ lửa"},
            {"name": "Thảo quả", "quantity": 2, "unit": "quả", "notes": "Nướng thơm đập dập lấy hạt"},
            {"name": "Quế thanh", "quantity": 1, "unit": "thanh", "notes": "Nướng sơ dậy mùi thơm nức"},
            {"name": "Hành hoa và rau mùi già", "quantity": 150, "unit": "gram", "notes": "Hành hoa thái nhỏ lá, chẻ cọng trắng, rau mùi rửa sạch"},
            {"name": "Tỏi ta", "quantity": 1, "unit": "củ", "notes": "Đập dập băm nhỏ để phi thơm xào thịt bò"},
            {"name": "Nước mắm truyền thống", "quantity": 4, "unit": "muỗng canh", "notes": "Nước mắm cá cơm 40 độ đạm nguyên chất"},
            {"name": "Hạt tiêu đen xay", "quantity": 1, "unit": "muỗng cà phê", "notes": "Rắc lên bát phở khi thưởng thức"},
            {"name": "Dầu ăn", "quantity": 3, "unit": "muỗng canh", "notes": "Dùng để xào lăn thịt bò trên lửa lớn"}
        ],
        "steps": [
            {"stepNumber": 1, "title": "Sơ chế xương bò và ninh nước dùng ban đầu", "description": "Rửa sạch xương ống bò, ngâm nước muối loãng 30 phút rồi chần qua nước sôi 5 phút. Vớt ra rửa lại thật sạch, cho vào nồi cùng 3 lít nước sạch đun sôi bùng rồi hạ lửa nhỏ liu riu hớt bọt.", "timerMinutes": 15},
            {"stepNumber": 2, "title": "Nướng hương liệu và hầm nước dùng đậm đà", "description": "Nướng chín vàng gừng già, hành tây, hoa hồi, thảo quả và quế thanh. Cạo sạch phần cháy xém, rửa sơ rồi cho tất cả vào bọc vải thả vào nồi nước dùng xương. Ninh nhỏ lửa trong 90 phút, liên tục vớt bọt để nước dùng trong vắt.", "timerMinutes": 90},
            {"stepNumber": 3, "title": "Sơ chế và ướp thịt thăn bò mềm mọng", "description": "Thịt thăn bò rửa sạch thấm khô, thái lát mỏng ngang thớ. Ướp thịt với 1 muỗng cà phê bột canh, 1 muỗng nước mắm ngon, một ít gừng băm và 1 muỗng dầu ăn để thịt mềm, không bị dai.", "timerMinutes": null},
            {"stepNumber": 4, "title": "Xào tái lăn thịt bò trên chảo lửa cực lớn", "description": "Đặt chảo gang lên bếp đun thật nóng già, cho 2 muỗng canh dầu ăn vào phi thơm tỏi băm và gừng đập dập. Trút toàn bộ thịt bò vào đảo nhanh tay trên lửa cực lớn trong 45 giây đến 1 phút cho thịt vừa chín tái, xém cạnh dậy mùi thơm thì tắt bếp ngay.", "timerMinutes": 2},
            {"stepNumber": 5, "title": "Trần bánh phở và xếp vào tô", "description": "Đun một nồi nước sôi riêng, cho bánh phở tươi vào vợt trần qua nước sôi 15-20 giây cho nóng và ráo nước. Chia đều bánh phở ra các tô lớn, xếp thịt bò xào lăn lên trên cùng hành lá thái nhỏ và hành chẻ.", "timerMinutes": 1},
            {"stepNumber": 6, "title": "Chan nước dùng nóng hổi và thưởng thức", "description": "Nêm lại nồi nước dùng cho vừa vị mặn ngọt thanh tao bằng nước mắm ngon và muối hạt. Múc nước dùng đang sôi sùng sục chan đều ngập bánh phở và thịt bò. Rắc tiêu xay, ăn kèm quẩy giòn, chanh tươi và ớt quả tươi.", "timerMinutes": null}
        ]
    },
    {
        "title": "Bò xào lúc lắc rau củ tươi ngon",
        "slug": "bo-xao-luc-lac-rau-cu-tuoi-ngon",
        "categorySlug": "mon-chinh",
        "authorEmail": "author@culinaryblog.com",
        "description": "Thịt thăn bò mềm ngọt thái quân cờ vuông vức được xào lăn trên chảo lửa lớn dậy mùi bơ tỏi, hòa quyện cùng ớt chuông ba màu, hành tây giòn ngọt và sốt tiêu đen đậm đà sóng sánh.",
        "instructions": "### Kỹ thuật xào bò lúc lắc mềm ngọt\n\nThịt thăn bò cắt khối quân cờ khoảng 2x2cm, ướp dầu hào, xì dầu và tiêu xay ít nhất 20 phút. Khi xào, dùng chảo gang thật nóng, trút thịt vào đảo nhanh tay (lắc chảo) ở lửa lớn để thịt xém cạnh thơm lừng mà bên trong vẫn giữ nguyên nước thịt mềm mọng.",
        "prepTimeMinutes": 20,
        "cookTimeMinutes": 10,
        "servings": 4,
        "difficulty": "Easy",
        "nutrition": {"calories": 460, "protein": 34.0, "carbohydrates": 16.0, "fat": 28.0, "fiber": 3.0, "sodium": 820},
        "ingredients": [
            {"name": "Thịt thăn ngoại bò", "quantity": 500, "unit": "gram", "notes": "Cắt khối quân cờ 2x2cm"},
            {"name": "Ớt chuông đỏ, vàng, xanh", "quantity": 250, "unit": "gram", "notes": "Bỏ hạt, cắt miếng vuông vừa ăn"},
            {"name": "Hành tây trắng", "quantity": 1, "unit": "củ", "notes": "Cắt miếng vuông vừa ăn"},
            {"name": "Bơ lạt động vật", "quantity": 30, "unit": "gram", "notes": "Thêm vào cuối để dậy mùi thơm béo"},
            {"name": "Tỏi cô đơn", "quantity": 1, "unit": "củ", "notes": "Đập dập băm nhỏ phi thơm"},
            {"name": "Dầu hào cao cấp", "quantity": 2, "unit": "muỗng canh", "notes": "Gia vị ướp và xào chính"},
            {"name": "Nước tương xì dầu ngon", "quantity": 1.5, "unit": "muỗng canh", "notes": "Tạo màu nâu cánh gián óng ả"},
            {"name": "Dầu mè thơm", "quantity": 1, "unit": "muỗng cà phê", "notes": "Ướp thịt bò tăng hương vị"},
            {"name": "Hạt tiêu đen xay vỡ", "quantity": 1, "unit": "muỗng cà phê", "notes": "Tạo vị cay nồng đặc trưng"},
            {"name": "Đường cát trắng", "quantity": 1, "unit": "muỗng canh", "notes": "Cân bằng vị mặn ngọt"},
            {"name": "Khoai tây chiên ăn kèm", "quantity": 200, "unit": "gram", "notes": "Chiên giòn ăn kèm"},
            {"name": "Dầu ăn", "quantity": 3, "unit": "muỗng canh", "notes": "Dùng xào thịt trên chảo nóng"}
        ],
        "steps": [
            {"stepNumber": 1, "title": "Sơ chế và ướp thịt bò", "description": "Thịt bò rửa sạch thấm thật khô, thái khối quân cờ vuông vức 2x2cm. Ướp với dầu hào, xì dầu, dầu mè, đường, tiêu đen và tỏi băm trong 20 phút cho thấm gia vị.", "timerMinutes": 20},
            {"stepNumber": 2, "title": "Sơ chế ớt chuông và hành tây", "description": "Ớt chuông 3 màu và hành tây rửa sạch, cắt miếng vuông đồng đều kích cỡ với thịt bò. Để thật ráo nước để khi xào không bị chảy nước làm mềm rau củ.", "timerMinutes": null},
            {"stepNumber": 3, "title": "Xào rau củ giòn ngọt", "description": "Đặt chảo lên bếp đun nóng với 1 muỗng dầu ăn, cho tỏi băm vào phi thơm, trút ớt chuông và hành tây vào đảo nhanh tay trên lửa lớn trong 2 phút cho vừa chín tới giữ độ giòn, trút ra đĩa riêng.", "timerMinutes": 2},
            {"stepNumber": 4, "title": "Lúc lắc thịt bò trên chảo lửa lớn", "description": "Đun chảo gang thật nóng già với 2 muỗng dầu ăn. Trút thịt bò vào dàn đều một lớp, để yên 1 phút cho xém mặt dưới rồi lắc chảo đảo mặt trong 1 phút tiếp theo. Cho bơ lạt vào lắc đều cho bơ tan chảy thơm ngậy.", "timerMinutes": 3},
            {"stepNumber": 5, "title": "Hòa quyện và hoàn thiện món ăn", "description": "Trút toàn bộ rau củ vào chảo thịt bò, đảo đều trên lửa lớn thêm 30 giây cho ngấm đều sốt bơ tỏi rồi tắt bếp ngay.", "timerMinutes": 1},
            {"stepNumber": 6, "title": "Trình bày và thưởng thức", "description": "Bày bò xào lúc lắc ra đĩa, trang trí với xà lách, cà chua bi và khoai tây chiên vàng giòn. Ăn kèm muối tiêu chanh hoặc tương ớt.", "timerMinutes": null}
        ]
    },
    {
        "title": "Bò bít tết sốt tiêu đen thảo mộc kiểu Âu",
        "slug": "bo-bit-tet-sot-tieu-den-thao-moc",
        "categorySlug": "mon-chinh",
        "authorEmail": "author@culinaryblog.com",
        "description": "Miếng thăn bò ngoại hảo hạng dày dặn được áp chảo bơ tỏi cùng lá hương thảo thơm nồng, giữ nguyên độ mềm mọng nước hồng hào bên trong, rưới đẫm sốt tiêu đen sánh mịn cay nồng quyến rũ.",
        "instructions": "### Bí quyết áp chảo bít tết chuẩn độ chín Medium-Rare\n\nĐể miếng bò ở nhiệt độ phòng 20 phút trước khi nấu. Thấm thật khô bề mặt, rắc muối biển và tiêu xay ngay trước khi cho vào chảo gang bốc khói. Khi lật mặt, cho bơ lạt, tỏi nguyên tép và cọng hương thảo vào, dùng muôi rưới bơ liên tục lên mặt thịt (basting). Sau khi nấu xong, để thịt nghỉ 5-7 phút trên thớt trước khi thái.",
        "prepTimeMinutes": 20,
        "cookTimeMinutes": 15,
        "servings": 2,
        "difficulty": "Hard",
        "nutrition": {"calories": 520, "protein": 42.0, "carbohydrates": 12.0, "fat": 32.0, "fiber": 2.0, "sodium": 780},
        "ingredients": [
            {"name": "Thịt thăn lưng bò (Ribeye)", "quantity": 450, "unit": "gram", "notes": "Cắt lát dày khoảng 2.5 - 3cm"},
            {"name": "Muối biển hạt thô", "quantity": 1, "unit": "muỗng cà phê", "notes": "Ướp đều hai mặt thịt"},
            {"name": "Tiêu đen xay hạt vỡ", "quantity": 1.5, "unit": "muỗng cà phê", "notes": "Rắc đều hai mặt thịt"},
            {"name": "Bơ lạt tự nhiên Pháp", "quantity": 40, "unit": "gram", "notes": "Dùng rưới mặt thịt khi áp chảo"},
            {"name": "Lá hương thảo tươi (Rosemary)", "quantity": 3, "unit": "nhánh", "notes": "Áp chảo cùng bơ tạo hương thơm Âu"},
            {"name": "Lá cỏ xạ hương (Thyme)", "quantity": 3, "unit": "nhánh", "notes": "Tăng tầng hương thảo mộc"},
            {"name": "Tỏi khô nguyên củ", "quantity": 1, "unit": "củ", "notes": "Cắt đôi ngang củ đập nhẹ để nguyên vỏ"},
            {"name": "Rượu vang đỏ", "quantity": 60, "unit": "ml", "notes": "Khử men chảo làm nước sốt tiêu đen"},
            {"name": "Nước hầm xương bò cô đặc", "quantity": 100, "unit": "ml", "notes": "Tạo vị ngọt đậm đà cho sốt"},
            {"name": "Kem tươi nấu ăn (Whipping cream)", "quantity": 30, "unit": "ml", "notes": "Làm sốt sánh mượt béo ngậy"},
            {"name": "Măng tây tươi", "quantity": 150, "unit": "gram", "notes": "Bỏ gốc già xào bơ tỏi ăn kèm"},
            {"name": "Dầu ô liu nguyên chất", "quantity": 2, "unit": "muỗng canh", "notes": "Quét chảo áp chảo thịt"}
        ],
        "steps": [
            {"stepNumber": 1, "title": "Chuẩn bị miếng thăn bò", "description": "Lấy thịt bò ra khỏi tủ lạnh trước 20 phút cho về nhiệt độ phòng. Dùng khăn giấy thấm thật khô nước trên hai mặt thịt. Rắc đều muối biển và tiêu xay vỡ lên khắp các bề mặt thịt.", "timerMinutes": null},
            {"stepNumber": 2, "title": "Áp chảo thịt bò trên chảo gang cực nóng", "description": "Đun nóng chảo gang trên lửa lớn với dầu ô liu đến khi chảo bắt đầu bốc khói nhẹ. Nhẹ nhàng đặt miếng thịt bò vào, áp chảo mỗi mặt 2.5 phút không xê dịch để tạo lớp vỏ ngoài màu nâu caramel giòn đẹp.", "timerMinutes": 5},
            {"stepNumber": 3, "title": "Rưới bơ tỏi thảo mộc (Basting)", "description": "Hạ lửa xuống mức vừa, cho bơ lạt, các nhánh hương thảo, cỏ xạ hương và nửa củ tỏi vào chảo. Khi bơ tan sủi bọt, nghiêng nhẹ chảo và dùng muôi múc bơ nóng liên tục rưới lên mặt thịt bò trong 1.5 phút để hương thơm ngấm sâu.", "timerMinutes": 2},
            {"stepNumber": 4, "title": "Để thịt nghỉ (Resting)", "description": "Gắp miếng thịt bò ra thớt gỗ hoặc đĩa ấm, để thịt nghỉ trong 5-7 phút cho các thớ cơ thư giãn và nước ngọt phân bổ đều khắp miếng thịt, giữ cho thịt mềm mọng không bị chảy nước khi cắt.", "timerMinutes": 7},
            {"stepNumber": 5, "title": "Nấu sốt tiêu đen rượu vang", "description": "Trên chiếc chảo vừa áp chảo thịt, chắt bớt dầu thừa, đổ rượu vang đỏ vào cạo sạch lớp caramen đọng đáy chảo. Cho nước hầm xương bò, tiêu đen hạt đập dập và kem tươi vào đun nhỏ lửa 3 phút cho sốt sánh mượt.", "timerMinutes": 3},
            {"stepNumber": 6, "title": "Áp chảo măng tây và hoàn thiện", "description": "Xào nhanh măng tây trên lửa lớn với chút bơ và muối trong 2 phút. Thái thịt bò thành từng lát dày bản, xếp ra đĩa cùng măng tây và rưới đẫm sốt tiêu đen nóng hổi lên trên.", "timerMinutes": 2}
        ]
    },
    {
        "title": "Cà ri gà nước cốt dừa khoai lang sánh béo",
        "slug": "ca-ri-ga-nuoc-cot-dua-khoai-lang",
        "categorySlug": "mon-chinh",
        "authorEmail": "author@culinaryblog.com",
        "description": "Tô cà ri gà béo ngậy nước cốt dừa thơm nức mũi mùi bột cà ri Ấn Độ, sả đập dập, khoai lang ngọt bùi mềm tan và thịt gà ta dai ngọt, ăn cùng bánh mì nóng giòn hay bún tươi đều xuất sắc.",
        "instructions": "### Hướng dẫn nấu Cà ri gà ngon không bị ngấy\n\n- Gà chặt miếng vừa ăn, ướp bột cà ri dầu và bột cà ri khô cùng nước mắm sả ớt trong 30 phút.\n- Khoai lang và khoai tây chiên sơ trước khi cho vào nấu để khoai không bị nát vụn làm đục nước cà ri.\n- Nước cốt dừa chia làm 2 phần: phần nước dão nấu cùng gà cho thấm, phần cốt dừa đặc cho vào sau cùng khuấy đều rồi tắt bếp ngay.",
        "prepTimeMinutes": 30,
        "cookTimeMinutes": 40,
        "servings": 5,
        "difficulty": "Medium",
        "nutrition": {"calories": 590, "protein": 35.0, "carbohydrates": 48.0, "fat": 28.0, "fiber": 4.5, "sodium": 920},
        "ingredients": [
            {"name": "Thịt gà ta thả vườn", "quantity": 1000, "unit": "gram", "notes": "Chặt miếng vừa ăn, rửa sạch để ráo"},
            {"name": "Nước cốt dừa đậm đặc", "quantity": 300, "unit": "ml", "notes": "Nước cốt dừa tươi nguyên chất"},
            {"name": "Nước dão dừa", "quantity": 500, "unit": "ml", "notes": "Dùng nấu hầm gà chín mềm"},
            {"name": "Khoai lang vàng", "quantity": 300, "unit": "gram", "notes": "Gọt vỏ cắt khúc vuông chiên sơ"},
            {"name": "Khoai tây củ nhỏ", "quantity": 200, "unit": "gram", "notes": "Cắt khối vuông chiên sơ"},
            {"name": "Bột cà ri thơm mịn", "quantity": 2, "unit": "gói", "notes": "Gia vị cà ri truyền thống"},
            {"name": "Sốt cà ri dầu", "quantity": 1, "unit": "hũ", "notes": "Tạo màu vàng óng và hương thơm béo"},
            {"name": "Sả cây", "quantity": 5, "unit": "cây", "notes": "Đập dập cắt khúc 7cm"},
            {"name": "Hành tím và tỏi băm", "quantity": 40, "unit": "gram", "notes": "Phi thơm xào gà"},
            {"name": "Nước mắm ngon", "quantity": 3, "unit": "muỗng canh", "notes": "Nêm nếm vị đậm đà"},
            {"name": "Hạt nêm và đường phèn", "quantity": 2, "unit": "muỗng canh", "notes": "Tạo vị ngọt thanh tự nhiên"},
            {"name": "Bánh mì giòn ăn kèm", "quantity": 4, "unit": "ổ", "notes": "Nướng giòn chấm cà ri"}
        ],
        "steps": [
            {"stepNumber": 1, "title": "Sơ chế và ướp thịt gà", "description": "Gà rửa sạch với nước muối gừng, chặt miếng vừa ăn. Ướp gà với 1 gói bột cà ri, 1/2 hũ cà ri dầu, 2 muỗng nước mắm, 1 muỗng hạt nêm, hành tỏi băm và sả băm trong 30 phút cho ngấm sâu gia vị.", "timerMinutes": 30},
            {"stepNumber": 2, "title": "Chiên sơ khoai lang và khoai tây", "description": "Khoai lang và khoai tây cắt khúc vuông lớn vừa ăn. Đun nóng chảo dầu, cho khoai vào chiên sơ trong 4-5 phút cho se mặt ngoài rồi vớt ra ráo dầu để khoai không bị nát khi hầm.", "timerMinutes": 5},
            {"stepNumber": 3, "title": "Xào gà săn đậm vị", "description": "Phi thơm tỏi băm, hành tím và sả đập dập với 2 muỗng dầu ăn trong nồi lớn. Cho thịt gà đã ướp vào xào trên lửa lớn trong 8-10 phút cho thịt gà săn chắc lại và dậy mùi thơm cà ri nức mũi.", "timerMinutes": 10},
            {"stepNumber": 4, "title": "Hầm gà với nước dão dừa", "description": "Đổ 500ml nước dão dừa và 300ml nước lọc vào nồi gà, đun sôi rồi hạ lửa vừa hầm trong 15 phút. Nêm đường phèn và hạt nêm cho vừa miệng.", "timerMinutes": 15},
            {"stepNumber": 5, "title": "Cho khoai và nước cốt dừa đậm đặc", "description": "Cho khoai lang và khoai tây đã chiên vào nồi hầm tiếp 10 phút cho khoai chín mềm bùi. Đổ toàn bộ 300ml nước cốt dừa đậm đặc vào, khuấy nhẹ tay cho nước cà ri sánh béo rồi tắt bếp.", "timerMinutes": 10},
            {"stepNumber": 6, "title": "Trình bày và thưởng thức", "description": "Múc cà ri gà ra tô lớn, rưới phần sốt vàng óng sánh mịn lên trên, trang trí bằng vài nhánh ngò rí và ớt sừng thái sợi. Thưởng thức nóng hổi cùng bánh mì giòn tan hoặc bún tươi.", "timerMinutes": null}
        ]
    },
    {
        "title": "Gà hấp lá chanh da giòn mọng nước",
        "slug": "ga-hap-la-chanh-da-gion",
        "categorySlug": "mon-chinh",
        "authorEmail": "author@culinaryblog.com",
        "description": "Thịt gà ta thả vườn hấp chín tới da vàng óng giòn sần sật, thịt ngọt mềm mọng nước thơm nức mùi lá chanh tươi, chấm cùng muối tiêu chanh ớt truyền thống ngon ngây ngất.",
        "instructions": "### Bí quyết hấp gà da giòn vàng óng\n\nXát nghệ tươi và muối hột quanh da gà để có màu vàng ươm tự nhiên. Lót lớp lá chanh và sả đập dập dưới đáy xửng hấp. Hấp lửa vừa trong 25 phút rồi tắt bếp ủ thêm 10 phút. Ngay sau khi lấy gà ra, quét một lớp mỡ gà mỏng lên da để da gà bóng mượt và giòn lâu.",
        "prepTimeMinutes": 20,
        "cookTimeMinutes": 30,
        "servings": 4,
        "difficulty": "Easy",
        "nutrition": {"calories": 480, "protein": 40.0, "carbohydrates": 4.0, "fat": 28.0, "fiber": 1.0, "sodium": 680},
        "ingredients": [
            {"name": "Gà ta thả vườn nguyên con", "quantity": 1300, "unit": "gram", "notes": "Làm sạch, xát muối gừng khử mùi"},
            {"name": "Lá chanh bánh tẻ tươi", "quantity": 30, "unit": "lá", "notes": "Một nửa lót xửng, một nửa thái chỉ rắc lên gà"},
            {"name": "Sả cây tươi", "quantity": 6, "unit": "cây", "notes": "Đập dập cắt khúc lót đáy xửng"},
            {"name": "Củ nghệ tươi", "quantity": 1, "unit": "củ", "notes": "Giã vắt lấy nước cốt quét da gà tạo màu vàng"},
            {"name": "Hành tím khô", "quantity": 4, "unit": "củ", "notes": "Đập dập nhồi bụng gà"},
            {"name": "Gừng già", "quantity": 1, "unit": "củ", "notes": "Thái lát nhồi bụng gà"},
            {"name": "Muối hạt", "quantity": 2, "unit": "muỗng canh", "notes": "Làm sạch và làm muối chấm"},
            {"name": "Tiêu sọ xay thơm", "quantity": 1, "unit": "muỗng cà phê", "notes": "Pha muối chấm tiêu chanh"},
            {"name": "Ớt hiểm đỏ", "quantity": 2, "unit": "trái", "notes": "Thái lát nhỏ pha muối chấm"},
            {"name": "Nước cốt chanh tươi", "quantity": 2, "unit": "muỗng canh", "notes": "Vắt vào đĩa muối tiêu"},
            {"name": "Rượu trắng", "quantity": 2, "unit": "muỗng canh", "notes": "Khử mùi hôi gà"}
        ],
        "steps": [
            {"stepNumber": 1, "title": "Sơ chế và ướp gà", "description": "Gà làm sạch, dùng muối hạt và rượu trắng chà xát kỹ khử sạch mùi. Giã nghệ tươi hòa chút nước lọc quét đều lên toàn bộ da gà để khi hấp gà có màu vàng ươm rực rỡ.", "timerMinutes": null},
            {"stepNumber": 2, "title": "Nhồi hương liệu vào bụng gà", "description": "Nhồi hành tím đập dập, gừng thái lát và 5 lá chanh vào bụng gà để thịt gà ngọt thơm từ bên trong.", "timerMinutes": null},
            {"stepNumber": 3, "title": "Chuẩn bị xửng hấp thảo mộc", "description": "Đun sôi nước trong nồi hấp. Xếp sả đập dập và 15 lá chanh phủ kín đáy xửng hấp để tạo lớp lót thơm nồng.", "timerMinutes": null},
            {"stepNumber": 4, "title": "Hấp gà chín tới da giòn", "description": "Đặt gà lên lớp sả lá chanh, đậy kín nắp hấp trên lửa vừa trong 25 phút. Tắt bếp và ủ nguyên gà trong nồi thêm 10 phút cho thịt gà chín thấu ngọt mọng nước.", "timerMinutes": 25},
            {"stepNumber": 5, "title": "Chặt gà và thưởng thức", "description": "Lấy gà ra để nguội bớt, chặt miếng vừa ăn xếp ra đĩa phẳng. Rắc lá chanh thái chỉ mỏng như sợi tơ lên khắp mặt đĩa gà. Thưởng thức cùng đĩa muối tiêu chanh ớt thơm lừng.", "timerMinutes": null}
        ]
    },

    # ==================== 3. CANH & SÚP (canh-sup) ====================
    {
        "title": "Canh chua cá lóc Nam Bộ chuẩn vị",
        "slug": "canh-chua-ca-loc-nam-bo",
        "categorySlug": "canh-sup",
        "authorEmail": "author@culinaryblog.com",
        "description": "Tô canh chua cá lóc đậm chất miền Tây sông nước với thịt cá lóc đồng ngọt chắc, nước canh chua thanh mát từ me chín, hòa quyện cùng bạc hà giòn xốp, đậu bắp, dứa thơm, cà chua và rau ngò om ngò gai thơm ngát.",
        "instructions": "### Bí quyết nấu Canh chua cá lóc miền Tây không tanh\n\nCá lóc đồng làm sạch nhớt bằng muối và chanh, cắt khúc vừa ăn. Nấu sôi nước me rồi mới thả cá vào, cá chín vớt ra đĩa riêng rồi mới cho các loại rau vào để cá không bị nát. Phi thơm tỏi băm thật vàng giòn rắc lên mặt tô canh trước khi ăn là bí quyết dậy mùi thơm quyến rũ.",
        "prepTimeMinutes": 25,
        "cookTimeMinutes": 20,
        "servings": 4,
        "difficulty": "Easy",
        "nutrition": {"calories": 310, "protein": 28.0, "carbohydrates": 26.0, "fat": 7.5, "fiber": 4.0, "sodium": 860},
        "ingredients": [
            {"name": "Cá lóc đồng tươi sống", "quantity": 600, "unit": "gram", "notes": "Làm sạch vảy, khử nhớt bằng muối chanh, cắt khúc dày 3cm"},
            {"name": "Me chín vắt", "quantity": 60, "unit": "gram", "notes": "Ngâm nước ấm dầm lấy nước cốt chua thanh"},
            {"name": "Dứa (thơm) chín", "quantity": 1/2, "unit": "quả", "notes": "Gọt vỏ bỏ mắt, thái lát xéo mỏng"},
            {"name": "Cà chua chín mọng", "quantity": 2, "unit": "quả", "notes": "Cắt múi cau đẹp mắt"},
            {"name": "Đậu bắp non", "quantity": 100, "unit": "gram", "notes": "Cắt xéo khúc vừa ăn"},
            {"name": "Bạc hà (dọc mùng)", "quantity": 150, "unit": "gram", "notes": "Tước vỏ, thái vát xéo, bóp muối rửa sạch vắt ráo"},
            {"name": "Giá đỗ tươi", "quantity": 100, "unit": "gram", "notes": "Rửa sạch để ráo"},
            {"name": "Rau ngò om và ngò gai", "quantity": 40, "unit": "gram", "notes": "Rửa sạch thái nhỏ dậy mùi thơm"},
            {"name": "Ớt chỉ thiên đỏ", "quantity": 2, "unit": "quả", "notes": "Thái lát tạo vị cay nồng ấm"},
            {"name": "Tỏi phi vàng giòn", "quantity": 2, "unit": "muỗng canh", "notes": "Rắc lên mặt tô canh hoàn thiện"},
            {"name": "Nước mắm cá cơm 40 độ đạm", "quantity": 3, "unit": "muỗng canh", "notes": "Nêm nếm vị đậm đà nguyên bản"},
            {"name": "Đường phèn hoặc đường cát", "quantity": 2, "unit": "muỗng canh", "notes": "Tạo vị chua ngọt cân bằng đặc trưng Nam Bộ"}
        ],
        "steps": [
            {"stepNumber": 1, "title": "Sơ chế cá lóc đồng", "description": "Cá lóc cạo sạch vảy, chà xát với muối hạt và nước cốt chanh để sạch nhớt hoàn toàn. Rửa sạch, cắt khúc dày khoảng 3cm, để ráo nước.", "timerMinutes": null},
            {"stepNumber": 2, "title": "Sơ chế rau củ nấu canh chua", "description": "Bạc hà tước sạch vỏ ngoài, thái vát xéo rồi bóp nhẹ với chút muối hạt, rửa lại và vắt ráo. Dứa thái lát, cà chua cắt múi cau, đậu bắp cắt xéo, ngò om và ngò gai thái nhỏ.", "timerMinutes": null},
            {"stepNumber": 3, "title": "Nấu nước canh chua và nấu cá", "description": "Đun sôi 1.2 lít nước trong nồi. Dầm me chín với 1 vá nước ấm, lọc lấy nước cốt me đổ vào nồi nước sôi. Nêm 2 muỗng đường, 1 muỗng muối rồi thả cá lóc vào nấu nhỏ lửa trong 8-10 phút cho cá chín ngọt thịt.", "timerMinutes": 10},
            {"stepNumber": 4, "title": "Cho các loại rau quả vào nồi", "description": "Vớt cá lóc ra đĩa riêng để tránh bị nát. Cho dứa và cà chua vào nấu 3 phút, tiếp tục cho đậu bắp và bạc hà vào nấu sôi lại 2 phút cho rau củ chín giòn.", "timerMinutes": 5},
            {"stepNumber": 5, "title": "Hoàn thiện canh chua", "description": "Nêm lại nước mắm ngon và chút đường cho đạt vị chua ngọt mặn hài hòa. Cho giá đỗ vào nồi, gắp cá lóc trở lại nồi canh, rắc rau ngò om, ngò gai và ớt thái lát lên trên rồi tắt bếp.", "timerMinutes": null},
            {"stepNumber": 6, "title": "Trình bày và thưởng thức", "description": "Múc canh chua ra tô lớn, rắc tỏi phi vàng thơm lừng lên trên cùng. Dọn kèm chén nước mắm mặn nguyên chất dầm ớt hiểm để chấm cá lóc.", "timerMinutes": null}
        ]
    },
    {
        "title": "Canh sườn hầm rau củ nhiệt đới thanh mát",
        "slug": "canh-suon-ham-rau-cu-nhiet-doi",
        "categorySlug": "canh-sup",
        "authorEmail": "author@culinaryblog.com",
        "description": "Bát canh sườn hầm rau củ ngọt lịm từ sườn non hầm mềm rục cùng bắp ngọt, cà rốt, củ dền và su su thanh mát, cung cấp dồi dào vitamin và khoáng chất cho cả gia đình.",
        "instructions": "### Cách hầm nước canh sườn trong veo không đục\n\nChần sườn qua nước sôi có gừng đập dập rồi rửa sạch từng miếng dưới vòi nước chảy. Khi ninh sườn, mở vung ở giai đoạn đầu, liên tục hớt bọt trắng. Cho bắp ngọt vào hầm cùng sườn ngay từ đầu để nước dùng có vị ngọt tự nhiên không cần nhiều gia vị mì chính.",
        "prepTimeMinutes": 20,
        "cookTimeMinutes": 45,
        "servings": 4,
        "difficulty": "Easy",
        "nutrition": {"calories": 360, "protein": 26.0, "carbohydrates": 24.0, "fat": 15.0, "fiber": 4.2, "sodium": 580},
        "ingredients": [
            {"name": "Sườn non heo tươi", "quantity": 500, "unit": "gram", "notes": "Chặt khúc 3-4cm dầy thịt"},
            {"name": "Bắp ngọt (ngô ngọt)", "quantity": 1, "unit": "bắp", "notes": "Cắt khoanh tròn dày 2.5cm"},
            {"name": "Cà rốt tươi", "quantity": 1, "unit": "củ", "notes": "Tỉa hoa cắt khoanh tròn 1cm"},
            {"name": "Khoai tây củ vừa", "quantity": 2, "unit": "củ", "notes": "Gọt vỏ cắt miếng vừa ăn"},
            {"name": "Su su giòn", "quantity": 1, "unit": "củ", "notes": "Gọt vỏ bỏ ruột cắt miếng vuông"},
            {"name": "Hành tím khô", "quantity": 3, "unit": "củ", "notes": "Đập dập phi thơm nấu nước"},
            {"name": "Hành hoa và ngò rí", "quantity": 40, "unit": "gram", "notes": "Rửa sạch thái nhỏ rắc lên canh"},
            {"name": "Muối hạt", "quantity": 1, "unit": "muỗng canh", "notes": "Chần sườn và nêm nước canh"},
            {"name": "Hạt nêm từ thịt", "quantity": 1.5, "unit": "muỗng canh", "notes": "Tăng vị ngọt thanh đậm đà"},
            {"name": "Nước mắm ngon", "quantity": 1, "unit": "muỗng canh", "notes": "Nêm cuối dậy mùi thơm"},
            {"name": "Tiêu xay trắng", "quantity": 1/2, "unit": "muỗng cà phê", "notes": "Rắc lên mặt bát canh"}
        ],
        "steps": [
            {"stepNumber": 1, "title": "Sơ chế và chần sườn non", "description": "Sườn non chặt khúc vừa ăn, ngâm nước muối 15 phút. Đun sôi nồi nước với chút muối và gừng đập dập, cho sườn vào chần trong 3 phút rồi vớt ra rửa sạch bọt bẩn dưới vòi nước lạnh.", "timerMinutes": 3},
            {"stepNumber": 2, "title": "Ninh sườn với bắp ngọt", "description": "Cho sườn non và các khoanh bắp ngọt vào nồi cùng 1.5 lít nước sạch. Đun sôi bùng, vớt sạch bọt rồi hạ lửa nhỏ hầm liu riu trong 30 phút cho sườn mềm và bắp tiết vị ngọt thanh.", "timerMinutes": 30},
            {"stepNumber": 3, "title": "Sơ chế rau củ", "description": "Cà rốt tỉa hoa thái lát, khoai tây và su su cắt khối vuông vừa ăn. Ngâm khoai tây trong nước muối loãng để không bị thâm đen.", "timerMinutes": null},
            {"stepNumber": 4, "title": "Cho rau củ vào hầm chín mềm", "description": "Cho cà rốt và khoai tây vào nồi canh hầm trong 8 phút. Tiếp tục cho su su vào hầm thêm 4 phút cho tất cả rau củ chín tới, mềm ngọt mà không bị nát.", "timerMinutes": 12},
            {"stepNumber": 5, "title": "Nêm nếm gia vị và thưởng thức", "description": "Nêm hạt nêm, muối và 1 muỗng nước mắm ngon cho vừa khẩu vị gia đình. Tắt bếp, rắc hành hoa, ngò rí thái nhỏ và tiêu xay lên trên. Múc canh ra tô lớn dùng nóng cùng cơm trắng.", "timerMinutes": null}
        ]
    },
    {
        "title": "Súp cua măng tây tuyết nhĩ hải sản",
        "slug": "sup-cua-mang-tay-tuyet-nhi",
        "categorySlug": "canh-sup",
        "authorEmail": "author@culinaryblog.com",
        "description": "Món súp khai vị cao cấp sánh mượt với thịt cua biển tươi ngọt đậm đà, măng tây xanh non giòn ngọt, nấm tuyết nhĩ sần sật và vân trứng bồng bềnh như hoa tuyết.",
        "instructions": "### Kỹ thuật đánh vân trứng súp cua đẹp như nhà hàng\n\n- Hòa tan bột năng với nước lạnh, từ từ rót vào nồi súp đang sôi lăn tăn, khuấy đều tay theo một chiều cho súp đạt độ sánh chuẩn.\n- Đánh tan lòng trắng trứng gà, dùng rây hoặc kẽ ngón tay rót từ từ từ trên cao xuống nồi súp, vừa rót vừa dùng đũa khuấy tròn nhẹ nhàng để tạo thành những sợi vân trứng mỏng nhẹ bồng bềnh đẹp mắt.",
        "prepTimeMinutes": 25,
        "cookTimeMinutes": 20,
        "servings": 4,
        "difficulty": "Medium",
        "nutrition": {"calories": 240, "protein": 18.0, "carbohydrates": 22.0, "fat": 6.5, "fiber": 2.5, "sodium": 650},
        "ingredients": [
            {"name": "Thịt cua biển gỡ sẵn", "quantity": 200, "unit": "gram", "notes": "Thịt cua tươi ngọt hấp chín gỡ miếng lớn"},
            {"name": "Măng tây xanh tươi", "quantity": 150, "unit": "gram", "notes": "Cắt bỏ gốc già, cắt khúc ngắn 1.5cm"},
            {"name": "Nấm tuyết nhĩ khô", "quantity": 20, "unit": "gram", "notes": "Ngâm nở bung xốp, cắt chân băm nhỏ"},
            {"name": "Trứng cút luộc chín", "quantity": 12, "unit": "quả", "notes": "Bóc vỏ để nguyên quả"},
            {"name": "Nước dùng xương gà trong", "quantity": 1000, "unit": "ml", "notes": "Hầm từ xương gà trong veo ngọt thanh"},
            {"name": "Lòng trắng trứng gà", "quantity": 2, "unit": "quả", "notes": "Đánh tan tạo vân mây"},
            {"name": "Bột năng nguyên chất", "quantity": 50, "unit": "gram", "notes": "Hòa tan với 80ml nước lạnh để tạo độ sánh"},
            {"name": "Dầu mè thơm thượng hạng", "quantity": 1, "unit": "muỗng canh", "notes": "Nhỏ vài giọt lên chén súp khi ăn"},
            {"name": "Hành tím băm nhỏ", "quantity": 20, "unit": "gram", "notes": "Phi thơm xào sơ thịt cua"},
            {"name": "Ngò rí tươi", "quantity": 30, "unit": "gram", "notes": "Rửa sạch thái nhỏ"},
            {"name": "Hạt tiêu trắng xay", "quantity": 1/2, "unit": "muỗng cà phê", "notes": "Tạo vị cay thanh nồng ấm"},
            {"name": "Nước tương ngon", "quantity": 1, "unit": "muỗng canh", "notes": "Ăn kèm nêm thêm theo khẩu vị"}
        ],
        "steps": [
            {"stepNumber": 1, "title": "Sơ chế nguyên liệu súp", "description": "Nấm tuyết ngâm nước ấm 15 phút cho nở bung xòe trắng muốt, cắt bỏ gốc vàng rồi băm nhỏ. Măng tây cắt khúc ngắn 1.5cm. Thịt cua kiểm tra kỹ bỏ sạch vụn mai cua.", "timerMinutes": 15},
            {"stepNumber": 2, "title": "Xào thơm thịt cua", "description": "Phi thơm hành tím băm với chút dầu ăn, cho thịt cua vào xào nhanh tay trên lửa vừa trong 2 phút cùng 1/2 muỗng cà phê hạt nêm và chút tiêu trắng cho thịt cua săn thơm ngấm vị.", "timerMinutes": 2},
            {"stepNumber": 3, "title": "Nấu sôi nước dùng và cho rau củ", "description": "Đun sôi 1 lít nước dùng xương gà trong nồi. Nêm 1 muỗng hạt nêm, 1 muỗng muối hạt và 1 muỗng cà phê đường phèn. Cho măng tây, nấm tuyết và trứng cút vào nấu trong 3 phút.", "timerMinutes": 3},
            {"stepNumber": 4, "title": "Tạo độ sánh cho súp bằng bột năng", "description": "Khuấy đều 50g bột năng với 80ml nước lạnh. Hạ lửa nhỏ liu riu, từ từ rót nước bột năng vào nồi súp, tay kia dùng muôi khuấy đều liên tục theo một chiều cho súp sánh mượt trong suốt.", "timerMinutes": 3},
            {"stepNumber": 5, "title": "Tạo vân trứng hoa tuyết bồng bềnh", "description": "Rót từ từ lòng trắng trứng gà đã đánh tan qua kẽ ngón tay hoặc rây vào nồi súp đang sôi lăn tăn, vừa rót vừa khuấy nhẹ vòng tròn để tạo thành các sợi vân trứng mỏng nhẹ đẹp mắt. Cho thịt cua xào vào khuấy đều.", "timerMinutes": 2},
            {"stepNumber": 6, "title": "Trình bày và thưởng thức", "description": "Múc súp cua ra chén nhỏ, nhỏ vài giọt dầu mè thơm, rắc ngò rí thái nhỏ và tiêu trắng lên trên. Dùng nóng để cảm nhận trọn vẹn vị ngọt tinh khiết của cua và măng tây.", "timerMinutes": null}
        ]
    },
    {
        "title": "Canh nghêu nấu thì là chua thanh giải nhiệt",
        "slug": "canh-ngheu-nau-thi-la-chua-thanh",
        "categorySlug": "canh-sup",
        "authorEmail": "author@culinaryblog.com",
        "description": "Món canh dân dã thanh mát xua tan oi bức mùa hè với thịt nghêu béo ngọt, nước canh trong veo chua dịu từ me hoặc quả sấu, nồng nàn hương thơm của rau thì là và hành hoa tươi non.",
        "instructions": "### Mẹo luộc nghêu nước trong veo không sạn\n\nNghêu ngâm nước vo gạo có vài lát ớt hiểm trong 2 tiếng để nhả sạch cát. Luộc nghêu với lượng nước vừa phải, khi nghêu vừa há miệng thì vớt ra ngay, tách lấy ruột. Chắt lấy phần nước luộc trong bên trên, bỏ cặn cát lắng dưới đáy nồi.",
        "prepTimeMinutes": 20,
        "cookTimeMinutes": 15,
        "servings": 4,
        "difficulty": "Easy",
        "nutrition": {"calories": 180, "protein": 16.0, "carbohydrates": 14.0, "fat": 4.0, "fiber": 2.0, "sodium": 720},
        "ingredients": [
            {"name": "Nghêu sống tươi", "quantity": 1000, "unit": "gram", "notes": "Chọn nghêu tươi sống ngâm nhả sạch cát"},
            {"name": "Cà chua chín", "quantity": 2, "unit": "quả", "notes": "Cắt múi cau"},
            {"name": "Dứa chín thơm", "quantity": 1/4, "unit": "quả", "notes": "Thái lát mỏng tạo vị ngọt thanh"},
            {"name": "Sấu xanh hoặc me tươi", "quantity": 3, "unit": "quả", "notes": "Cạo vỏ đập dập tạo vị chua thanh"},
            {"name": "Rau thì là", "quantity": 50, "unit": "gram", "notes": "Rửa sạch cắt khúc 3cm"},
            {"name": "Hành hoa", "quantity": 40, "unit": "gram", "notes": "Thái nhỏ"},
            {"name": "Hành tím", "quantity": 2, "unit": "củ", "notes": "Băm nhỏ phi thơm"},
            {"name": "Gừng tươi", "quantity": 1, "unit": "nhánh nhỏ", "notes": "Đập dập khử hàn"},
            {"name": "Nước mắm ngon", "quantity": 2, "unit": "muỗng canh", "notes": "Nêm nếm vị ngọt thanh"},
            {"name": "Ớt sừng đỏ", "quantity": 1, "unit": "quả", "notes": "Thái lát xéo"}
        ],
        "steps": [
            {"stepNumber": 1, "title": "Sơ chế và luộc nghêu", "description": "Nghêu rửa sạch vỏ ngoài. Đun sôi 1 lít nước với vài lát gừng, cho nghêu vào đun trên lửa lớn trong 3-4 phút đến khi nghêu há miệng đều thì tắt bếp vớt ra ngay.", "timerMinutes": 4},
            {"stepNumber": 2, "title": "Tách thịt nghêu và lọc nước trong", "description": "Tách lấy thịt nghêu để riêng ra chén. Nước luộc nghêu để yên 5 phút cho lắng cặn rồi nhẹ nhàng chắt lấy phần nước trong bên trên sang nồi khác.", "timerMinutes": 5},
            {"stepNumber": 3, "title": "Xào thơm cà chua và thịt nghêu", "description": "Phi thơm hành tím băm với 1 muỗng dầu ăn, cho cà chua và dứa vào xào mềm tạo màu. Cho thịt nghêu vào đảo nhanh 1 phút cùng chút nước mắm ngon rồi trút ra đĩa.", "timerMinutes": 2},
            {"stepNumber": 4, "title": "Nấu nước canh chua thanh", "description": "Đổ nước luộc nghêu vào nồi cùng quả sấu cạo vỏ, đun sôi trong 5 phút cho sấu chín mềm. Dầm nát sấu để lấy vị chua thanh dịu mát, vớt bỏ hạt.", "timerMinutes": 5},
            {"stepNumber": 5, "title": "Hoàn thiện và thưởng thức", "description": "Trút thịt nghêu và cà chua vào nồi đun sôi bùng lại. Nêm gia vị vừa miệng, cho thì là, hành hoa và ớt lát vào rồi tắt bếp ngay. Múc canh ra tô dùng nóng.", "timerMinutes": null}
        ]
    },
    {
        "title": "Súp kem nấm bào ngư kiểu Pháp béo mịn",
        "slug": "sup-kem-nam-bao-ngu-kieu-phap",
        "categorySlug": "canh-sup",
        "authorEmail": "author@culinaryblog.com",
        "description": "Món súp kem béo ngậy chuẩn phong vị ẩm thực Pháp với nấm bào ngư tươi và nấm mỡ xào bơ tỏi thơm nức, xay nhuyễn cùng kem tươi béo ngậy và nước hầm gà thanh ngọt.",
        "instructions": "### Bí quyết súp kem nấm sánh mượt không ngấy\n\nXào nấm với bơ lạt trên lửa vừa cho nấm tiết hết nước ngọt và hơi xém cạnh vàng nâu dậy mùi thơm nức. Thêm một chút rượu vang trắng để dậy mùi thơm thảo mộc trước khi cho nước hầm gà vào nấu.",
        "prepTimeMinutes": 20,
        "cookTimeMinutes": 20,
        "servings": 4,
        "difficulty": "Easy",
        "nutrition": {"calories": 310, "protein": 9.5, "carbohydrates": 18.0, "fat": 23.0, "fiber": 3.2, "sodium": 520},
        "ingredients": [
            {"name": "Nấm bào ngư tươi", "quantity": 250, "unit": "gram", "notes": "Cắt gốc rửa sạch để ráo xé nhỏ"},
            {"name": "Nấm mỡ nâu (Cremini)", "quantity": 150, "unit": "gram", "notes": "Lau sạch thái lát mỏng"},
            {"name": "Bơ lạt động vật", "quantity": 40, "unit": "gram", "notes": "Xào nấm thơm béo"},
            {"name": "Hành tây trắng", "quantity": 1, "unit": "củ", "notes": "Băm nhỏ hạt lựu"},
            {"name": "Tỏi khô băm nhuyễn", "quantity": 3, "unit": "tép", "notes": "Phi thơm cùng bơ"},
            {"name": "Nước dùng gà trong", "quantity": 600, "unit": "ml", "notes": "Nấu hầm ngọt thanh"},
            {"name": "Kem tươi nấu ăn (Cooking cream)", "quantity": 150, "unit": "ml", "notes": "Tạo độ sánh mượt béo ngậy"},
            {"name": "Lá cỏ xạ hương tươi (Thyme)", "quantity": 2, "unit": "nhánh", "notes": "Lấy lá băm nhỏ"},
            {"name": "Bánh mì nướng bơ tỏi (Croutons)", "quantity": 50, "unit": "gram", "notes": "Ăn kèm giòn rụm"},
            {"name": "Muối biển và tiêu đen xay", "quantity": 1, "unit": "muỗng cà phê", "notes": "Nêm nếm vừa vị"}
        ],
        "steps": [
            {"stepNumber": 1, "title": "Sơ chế nấm tươi", "description": "Nấm bào ngư xé sợi nhỏ vừa ăn. Nấm mỡ lau sạch bằng khăn ẩm rồi thái lát mỏng. Chừa lại một ít nấm mỡ nguyên lát để áp chảo trang trí mặt súp.", "timerMinutes": null},
            {"stepNumber": 2, "title": "Xào nấm với bơ tỏi", "description": "Đun chảy 30g bơ lạt trong nồi sâu lòng, cho hành tây và tỏi băm vào phi thơm trong 2 phút. Cho toàn bộ nấm vào xào cùng lá thyme trên lửa vừa trong 6-8 phút cho nấm chín mềm và thơm nức.", "timerMinutes": 8},
            {"stepNumber": 3, "title": "Nấu nấm với nước dùng gà", "description": "Đổ 600ml nước dùng gà vào nồi nấm, đun sôi bùng rồi hạ lửa nhỏ đun liu riu trong 10 phút cho các hương vị hòa quyện đậm đà.", "timerMinutes": 10},
            {"stepNumber": 4, "title": "Xay nhuyễn súp kem mịn", "description": "Dùng máy xay cầm tay xay nhuyễn mịn trực tiếp trong nồi (hoặc cho vào máy sinh tố xay nhuyễn rồi đổ lại vào nồi).", "timerMinutes": 2},
            {"stepNumber": 5, "title": "Hoàn thiện súp với kem tươi", "description": "Đổ 150ml kem tươi vào nồi súp, khuấy đều trên lửa nhỏ đến khi súp sôi lăn tăn trở lại thì nêm muối tiêu vừa vị rồi tắt bếp.", "timerMinutes": 2},
            {"stepNumber": 6, "title": "Trình bày và thưởng thức", "description": "Múc súp ra đĩa sâu lòng, rưới vài giọt kem tươi tạo vân mây xoáy nghệ thuật, rắc bánh mì nướng giòn và chút lá thyme tươi lên trên. Dùng nóng.", "timerMinutes": null}
        ]
    },
    # ==================== 4. MÓN CHAY (mon-chay) ====================
    {
        "title": "Đậu hũ non sốt nấm đông cô tươi thanh tịnh",
        "slug": "dau-hu-non-sot-nam-dong-co",
        "categorySlug": "mon-chay",
        "authorEmail": "author@culinaryblog.com",
        "description": "Đĩa đậu hũ non mềm mịn núng nính phủ lớp sốt nấm đông cô tươi sánh nâu óng ánh, vị ngọt tự nhiên thanh tao của nấm hòa quyện cùng dầu hào chay và dầu mè thơm nức.",
        "instructions": "### Hướng dẫn hấp đậu hũ non mềm mịn không nát\n\nCắt đậu hũ non thành từng khoanh tròn hoặc khối vuông nhẹ tay, xếp ra đĩa sâu lòng hấp cách thủy 5 phút cho nóng ấm. Nấu sốt nấm riêng trên chảo rồi rưới ngập lên mặt đậu hũ khi vừa hấp xong.",
        "prepTimeMinutes": 15,
        "cookTimeMinutes": 15,
        "servings": 4,
        "difficulty": "Easy",
        "nutrition": {"calories": 210, "protein": 14.5, "carbohydrates": 16.0, "fat": 10.5, "fiber": 3.8, "sodium": 540},
        "ingredients": [
            {"name": "Đậu hũ non hộp cây tròn", "quantity": 2, "unit": "cây", "notes": "Cắt khoanh tròn dày 2cm"},
            {"name": "Nấm đông cô tươi", "quantity": 150, "unit": "gram", "notes": "Cắt gốc khía hoa chữ thập trên mũ"},
            {"name": "Nấm rơm tươi búp", "quantity": 100, "unit": "gram", "notes": "Gọt gốc ngâm muối rửa sạch chẻ đôi"},
            {"name": "Cà rốt tỉa hoa", "quantity": 50, "unit": "gram", "notes": "Thái lát mỏng 3mm"},
            {"name": "Hành boa-rô (tỏi tây)", "quantity": 1, "unit": "cây", "notes": "Thái xéo phi thơm phần gốc trắng"},
            {"name": "Dầu hào chay từ nấm", "quantity": 2.5, "unit": "muỗng canh", "notes": "Tạo vị mặn ngọt đậm đà"},
            {"name": "Nước tương đậu nành thượng hạng", "quantity": 1.5, "unit": "muỗng canh", "notes": "Tạo màu nâu cánh gián"},
            {"name": "Dầu mè thơm nguyên chất", "quantity": 1, "unit": "muỗng cà phê", "notes": "Dậy mùi thơm thanh nhã"},
            {"name": "Bột năng hòa tan", "quantity": 1.5, "unit": "muỗng canh", "notes": "Tạo độ sánh mượt cho sốt"},
            {"name": "Đường phèn hạt nhỏ", "quantity": 1, "unit": "muỗng cà phê", "notes": "Vị ngọt thanh dịu"},
            {"name": "Tiêu sọ trắng xay", "quantity": 1/2, "unit": "muỗng cà phê", "notes": "Rắc lên mặt đĩa"}
        ],
        "steps": [
            {"stepNumber": 1, "title": "Sơ chế đậu hũ và nấm", "description": "Đậu hũ non nhẹ nhàng lấy ra khỏi hộp, cắt thành các khoanh tròn dày 2cm, xếp gọn gàng ra đĩa sâu lòng. Nấm đông cô khía chữ thập trên mũ nấm, nấm rơm chẻ đôi, cà rốt tỉa hoa thái lát.", "timerMinutes": null},
            {"stepNumber": 2, "title": "Hấp nóng đậu hũ non", "description": "Đặt đĩa đậu hũ non vào xửng hấp cách thủy trong 5 phút trên lửa vừa cho đậu hũ nóng ấm đều và săn nhẹ, chắt bỏ phần nước tiết ra đĩa.", "timerMinutes": 5},
            {"stepNumber": 3, "title": "Xào thơm nấm đông cô và rau củ", "description": "Phi thơm phần gốc hành boa-rô với 1 muỗng dầu ăn, cho nấm đông cô, nấm rơm và cà rốt vào xào trên lửa vừa trong 3-4 phút cho nấm chín săn thơm nức.", "timerMinutes": 4},
            {"stepNumber": 4, "title": "Nấu sốt nấm sánh mượt", "description": "Cho 150ml nước dùng rau củ, dầu hào chay, nước tương, đường phèn vào chảo nấm đun sôi lăn tăn 3 phút. Rót từ từ nước bột năng vào khuấy đều cho sốt sánh bóng mượt mà, nhỏ vài giọt dầu mè thơm rồi tắt bếp.", "timerMinutes": 3},
            {"stepNumber": 5, "title": "Hoàn thiện và thưởng thức", "description": "Rưới phần sốt nấm nâu óng ánh ngập lên đĩa đậu hũ non đang bốc khói. Rắc lá boa-rô thái nhỏ và chút tiêu trắng xay lên trên. Dùng nóng cùng cơm gạo lứt hoặc cơm trắng.", "timerMinutes": null}
        ]
    },
    {
        "title": "Canh nấm hạt sen thập cẩm bồi bổ sức khỏe",
        "slug": "canh-nam-hat-sen-thap-cam",
        "categorySlug": "mon-chay",
        "authorEmail": "author@culinaryblog.com",
        "description": "Món canh chay thanh nhiệt, bồi bổ tâm trí với hạt sen tươi bùi bở nấu cùng nấm đùi gà, nấm đông cô, cà rốt và bắp non ngọt lịm trong nước dùng hầm củ quả tự nhiên.",
        "instructions": "### Cách nấu canh nấm hạt sen thơm trong\n\nHạt sen tươi thông tâm sen để không bị đắng, luộc sơ qua nước sôi 5 phút trước khi nấu canh. Hầm nước dùng từ lê, củ cải trắng và bắp ngọt để tạo vị ngọt sâu không cần bột ngọt.",
        "prepTimeMinutes": 20,
        "cookTimeMinutes": 25,
        "servings": 4,
        "difficulty": "Easy",
        "nutrition": {"calories": 195, "protein": 8.5, "carbohydrates": 32.0, "fat": 3.5, "fiber": 4.5, "sodium": 420},
        "ingredients": [
            {"name": "Hạt sen tươi Huế", "quantity": 150, "unit": "gram", "notes": "Bỏ tâm sen, rửa sạch"},
            {"name": "Nấm đùi gà baby", "quantity": 100, "unit": "gram", "notes": "Cắt khoanh tròn dày 1cm"},
            {"name": "Nấm đông cô tươi", "quantity": 80, "unit": "gram", "notes": "Khía chữ thập trên mũ"},
            {"name": "Nấm kim châm", "quantity": 80, "unit": "gram", "notes": "Cắt gốc tách khóm nhỏ"},
            {"name": "Bắp non ngọt", "quantity": 80, "unit": "gram", "notes": "Chẻ đôi dọc thân"},
            {"name": "Cà rốt tươi", "quantity": 1, "unit": "củ", "notes": "Tỉa hoa thái lát mỏng"},
            {"name": "Hành boa-rô", "quantity": 1, "unit": "nhánh", "notes": "Thái nhỏ"},
            {"name": "Ngò rí tươi", "quantity": 20, "unit": "gram", "notes": "Rửa sạch thái nhỏ rắc lên canh"},
            {"name": "Hạt nêm nấm chay", "quantity": 1.5, "unit": "muỗng canh", "notes": "Nêm nước dùng thanh ngọt"},
            {"name": "Muối khoáng tự nhiên", "quantity": 1, "unit": "muỗng cà phê", "notes": "Nêm nếm vừa vị"},
            {"name": "Dầu ăn thực vật", "quantity": 1, "unit": "muỗng canh", "notes": "Xào sơ nấm"}
        ],
        "steps": [
            {"stepNumber": 1, "title": "Sơ chế hạt sen và các loại nấm", "description": "Hạt sen tươi rửa sạch để ráo. Nấm đùi gà cắt khoanh tròn, nấm đông cô khía chữ thập, nấm kim châm bỏ gốc tách cụm nhỏ. Bắp non chẻ đôi, cà rốt tỉa hoa.", "timerMinutes": null},
            {"stepNumber": 2, "title": "Hầm hạt sen chín bùi", "description": "Cho hạt sen vào nồi cùng 1.2 lít nước sạch, đun sôi rồi hạ lửa nhỏ hầm trong 15 phút cho hạt sen chín bở mềm mà không bị vỡ nát.", "timerMinutes": 15},
            {"stepNumber": 3, "title": "Xào sơ nấm và cà rốt", "description": "Phi thơm gốc boa-rô với 1 muỗng dầu ăn, cho nấm đùi gà, nấm đông cô, bắp non và cà rốt vào xào nhanh 2 phút với 1 muỗng hạt nêm nấm chay.", "timerMinutes": 2},
            {"stepNumber": 4, "title": "Nấu canh nấm hạt sen", "description": "Trút toàn bộ nấm và rau củ đã xào vào nồi nước hầm hạt sen, đun sôi lại trên lửa vừa trong 6-8 phút cho các loại nấm chín ngọt và hòa quyện hương vị.", "timerMinutes": 8},
            {"stepNumber": 5, "title": "Hoàn thiện và thưởng thức", "description": "Cho nấm kim châm vào sau cùng đun sôi thêm 1 phút. Nêm lại muối và hạt nêm cho vừa miệng, rắc ngò rí và tiêu sọ xay lên trên rồi múc ra tô lớn thưởng thức.", "timerMinutes": 1}
        ]
    },
    {
        "title": "Nấm đùi gà kho tiêu xanh đậm đà đưa cơm",
        "slug": "nam-dui-ga-kho-tieu-xanh",
        "categorySlug": "mon-chay",
        "authorEmail": "author@culinaryblog.com",
        "description": "Tộ nấm đùi gà kho tiêu xanh sánh nâu đậm đà, miếng nấm giòn ngọt sần sật ngấm đẫm vị cay thơm nồng nàn của tiêu xanh tươi và nước dừa thanh ngọt, vô cùng bắt cơm.",
        "instructions": "### Bí quyết kho nấm đùi gà dai giòn không ra nước\n\nKhía vảy rồng trên bề mặt từng khúc nấm, áp chảo vàng nhẹ hai mặt trước khi kho. Kho bằng nước dừa tươi trên lửa nhỏ trong tộ đất để nấm săn dai và nước sốt keo lại bám đều quanh từng miếng nấm.",
        "prepTimeMinutes": 15,
        "cookTimeMinutes": 20,
        "servings": 4,
        "difficulty": "Easy",
        "nutrition": {"calories": 180, "protein": 6.5, "carbohydrates": 22.0, "fat": 7.5, "fiber": 4.0, "sodium": 680},
        "ingredients": [
            {"name": "Nấm đùi gà tươi", "quantity": 400, "unit": "gram", "notes": "Cắt khúc 3cm, khía ca rô trên mặt"},
            {"name": "Tiêu xanh tươi nguyên nhánh", "quantity": 4, "unit": "nhánh", "notes": "Đập dập nhẹ 2 nhánh, để nguyên 2 nhánh"},
            {"name": "Nước dừa xiêm tươi", "quantity": 150, "unit": "ml", "notes": "Kho tạo vị ngọt dịu và độ sánh"},
            {"name": "Nước tương ngon hảo hạng", "quantity": 3, "unit": "muỗng canh", "notes": "Gia vị kho chính"},
            {"name": "Dầu hào chay", "quantity": 1.5, "unit": "muỗng canh", "notes": "Tạo độ sánh bóng nâu"},
            {"name": "Đường phèn nâu", "quantity": 1.5, "unit": "muỗng canh", "notes": "Thắng nước màu caramel"},
            {"name": "Gốc hành boa-rô băm", "quantity": 2, "unit": "muỗng canh", "notes": "Phi thơm kho nấm"},
            {"name": "Ớt hiểm đỏ", "quantity": 2, "unit": "trái", "notes": "Để nguyên trái kho cùng"},
            {"name": "Dầu ăn", "quantity": 2, "unit": "muỗng canh", "notes": "Áp chảo nấm"},
            {"name": "Tiêu đen xay", "quantity": 1/2, "unit": "muỗng cà phê", "notes": "Rắc lên mặt khi hoàn thành"}
        ],
        "steps": [
            {"stepNumber": 1, "title": "Sơ chế và khía nấm đùi gà", "description": "Nấm đùi gà rửa sạch thấm khô, cắt khúc dày 3cm. Dùng dao khía các đường ca rô trên hai mặt cắt của nấm để nấm ngấm sâu gia vị và khi chín bung hình vảy rồng đẹp mắt.", "timerMinutes": null},
            {"stepNumber": 2, "title": "Áp chảo nấm vàng mặt", "description": "Đun nóng chảo với 1 muỗng dầu ăn, cho các khúc nấm vào áp chảo mỗi mặt 2 phút trên lửa vừa đến khi hai mặt nấm se vàng nhẹ thì gắp ra tộ đất.", "timerMinutes": 4},
            {"stepNumber": 3, "title": "Nấu sốt kho tiêu xanh", "description": "Trên chảo, cho đường phèn nâu vào thắng tan thành màu cánh gián đẹp mắt, cho gốc boa-rô băm và tiêu xanh đập dập vào phi thơm nức. Đổ nước tương, dầu hào chay và nước dừa tươi vào khuấy tan đều.", "timerMinutes": 3},
            {"stepNumber": 4, "title": "Kho nấm trong tộ đất", "description": "Đổ toàn bộ nước sốt vào tộ đất chứa nấm, thả các nhánh tiêu xanh nguyên và ớt hiểm vào. Đun sôi rồi hạ lửa nhỏ liu riu kho trong 12-15 phút cho nước kho keo lại sền sệt bám bóng quanh từng miếng nấm.", "timerMinutes": 15},
            {"stepNumber": 5, "title": "Trình bày và thưởng thức", "description": "Rắc tiêu đen xay lên trên tộ nấm đang sôi sùng sục bốc khói ngào ngạt mùi tiêu xanh. Dùng nóng kèm cơm trắng và dưa leo thái lát.", "timerMinutes": null}
        ]
    },
    {
        "title": "Chả giò chay nhân nấm hạt sen khoai môn",
        "slug": "cha-gio-chay-nhan-nam-hat-sen",
        "categorySlug": "mon-chay",
        "authorEmail": "author@culinaryblog.com",
        "description": "Cuốn chả giò chay vàng ruộm giòn tan với nhân khoai môn dẻo bùi, hạt sen bở mềm, nấm mèo, nấm hương thơm lừng và đậu xanh bùi ngậy, chấm cùng tương chua ngọt thanh tao.",
        "instructions": "### Bí quyết chả giò chay giòn rụm lâu\n\nKhoai môn bào sợi xào sơ qua để nhân không bị ẩm nhão. Cuốn vừa tay, chiên ngập dầu ở lửa vừa cho chả giò chín đều từ trong ra ngoài, sau đó nâng lửa lớn 1 phút trước khi vớt ra để chả giò ráo dầu tuyệt đối.",
        "prepTimeMinutes": 30,
        "cookTimeMinutes": 20,
        "servings": 5,
        "difficulty": "Medium",
        "nutrition": {"calories": 330, "protein": 9.5, "carbohydrates": 44.0, "fat": 14.0, "fiber": 4.2, "sodium": 510},
        "ingredients": [
            {"name": "Khoai môn cao", "quantity": 200, "unit": "gram", "notes": "Gọt vỏ bào sợi mỏng"},
            {"name": "Hạt sen tươi", "quantity": 80, "unit": "gram", "notes": "Hấp chín bở, giã dập nhẹ"},
            {"name": "Đậu xanh đãi vỏ", "quantity": 80, "unit": "gram", "notes": "Hấp chín tán nhuyễn"},
            {"name": "Mộc nhĩ khô", "quantity": 20, "unit": "gram", "notes": "Ngâm nở thái sợi mỏng"},
            {"name": "Nấm hương khô", "quantity": 15, "unit": "gram", "notes": "Ngâm nở băm nhỏ thơm nức"},
            {"name": "Cà rốt tươi", "quantity": 80, "unit": "gram", "notes": "Bào sợi ngắn vắt ráo"},
            {"name": "Bánh tráng bò bía đậu xanh", "quantity": 25, "unit": "lá", "notes": "Lá xốp cuốn chả giò giòn tan"},
            {"name": "Hành boa-rô băm nhỏ", "quantity": 2, "unit": "muỗng canh", "notes": "Phi thơm trộn nhân"},
            {"name": "Hạt nêm nấm chay", "quantity": 1.5, "unit": "muỗng canh", "notes": "Nêm nhân vừa vặn"},
            {"name": "Dầu ăn", "quantity": 350, "unit": "ml", "notes": "Chiên ngập dầu"},
            {"name": "Nước sốt chua ngọt chay", "quantity": 4, "unit": "muỗng canh", "notes": "Chấm kèm"}
        ],
        "steps": [
            {"stepNumber": 1, "title": "Sơ chế nguyên liệu nhân", "description": "Khoai môn và cà rốt bào sợi. Mộc nhĩ, nấm hương ngâm mềm băm nhỏ. Hạt sen và đậu xanh hấp chín tới.", "timerMinutes": null},
            {"stepNumber": 2, "title": "Xào sơ nhân cho khô ráo", "description": "Phi thơm gốc boa-rô trong chảo, cho khoai môn và cà rốt vào xào nhanh 2 phút trên lửa lớn cho ráo bớt nước rồi trút ra âu lớn để nguội.", "timerMinutes": 2},
            {"stepNumber": 3, "title": "Trộn đều nhân chả giò chay", "description": "Trộn đều khoai môn, hạt sen, đậu xanh, mộc nhĩ, nấm hương cùng hạt nêm nấm chay, tiêu xay và 1 muỗng dầu mè thơm cho nhân kết dính dẻo mịn.", "timerMinutes": null},
            {"stepNumber": 4, "title": "Cuốn chả giò thon đẹp", "description": "Trải bánh tráng ra thớt, múc một lượng nhân vừa phải, gập hai mép bên hông và cuộn chặt tay đều đặn. Thoa chút bột mì pha nước ở mép để dán chặt.", "timerMinutes": null},
            {"stepNumber": 5, "title": "Chiên chả giò vàng giòn", "description": "Đun nóng dầu ăn trên lửa vừa, thả chả giò vào chiên trong 7-9 phút cho vỏ bánh phồng xốp và vàng đều ruộm. Vớt ra khay có giấy thấm dầu.", "timerMinutes": 8},
            {"stepNumber": 6, "title": "Trình bày và thưởng thức", "description": "Xếp chả giò ra đĩa cùng rau xà lách, rau thơm và chén nước chấm chua ngọt chay pha tỏi ớt chay. Ăn ngay khi còn nóng giòn.", "timerMinutes": null}
        ]
    },
    {
        "title": "Cà tím nướng mỡ hành chay chấm tương bần",
        "slug": "ca-tim-nuong-mo-hanh-chay",
        "categorySlug": "mon-chay",
        "authorEmail": "author@culinaryblog.com",
        "description": "Món ăn mộc mạc thơm lừng mùi khói với cà tím nướng chín mềm mướt ngọt lịm, rưới đẫm mỡ hành boa-rô xanh mướt béo ngậy và đậu phộng rang giòn, chấm tương bần đậm đà ngọt bùi.",
        "instructions": "### Cách nướng cà tím mềm ngọt không cháy đắng\n\nChọn cà tím thon dài tươi bóng. Dùng nĩa xăm quanh quả cà rồi nướng trên vỉ than hoa hoặc nồi chiên không dầu đến khi vỏ ngoài cháy sém đen phồng rộp, ruột bên trong mềm nhũn chảy mật. Lột sạch lớp vỏ cháy khi cà còn ấm.",
        "prepTimeMinutes": 10,
        "cookTimeMinutes": 15,
        "servings": 3,
        "difficulty": "Easy",
        "nutrition": {"calories": 160, "protein": 4.5, "carbohydrates": 18.0, "fat": 9.0, "fiber": 5.0, "sodium": 480},
        "ingredients": [
            {"name": "Cà tím quả dài tươi", "quantity": 3, "unit": "trái", "notes": "Chọn quả cuống tươi, thon đều"},
            {"name": "Hành boa-rô tươi", "quantity": 3, "unit": "nhánh", "notes": "Thái nhỏ làm mỡ hành chay"},
            {"name": "Đậu phộng rang vàng giã dập", "quantity": 40, "unit": "gram", "notes": "Rắc lên mặt tạo độ bùi béo"},
            {"name": "Dầu ăn thực vật", "quantity": 4, "unit": "muỗng canh", "notes": "Đun sôi rót vào boa-rô làm mỡ hành"},
            {"name": "Tương bần truyền thống", "quantity": 3, "unit": "muỗng canh", "notes": "Pha nước chấm"},
            {"name": "Đường thốt nốt", "quantity": 1.5, "unit": "muỗng canh", "notes": "Hòa tan cùng tương bần"},
            {"name": "Ớt sừng băm nhỏ", "quantity": 1, "unit": "muỗng cà phê", "notes": "Pha nước chấm cay nhẹ"},
            {"name": "Nước cốt chanh tươi", "quantity": 1, "unit": "muỗng canh", "notes": "Cân bằng vị chua ngọt"},
            {"name": "Hạt nêm nấm hương chay", "quantity": 1, "unit": "muỗng cà phê", "notes": "Nêm vào mỡ hành boa-rô đậm đà"},
            {"name": "Hành phi chay giòn rụm", "quantity": 20, "unit": "gram", "notes": "Rắc lên mặt đĩa tăng độ giòn thơm"}
        ],
        "steps": [
            {"stepNumber": 1, "title": "Sơ chế và xăm cà tím", "description": "Cà tím rửa sạch để nguyên cuống. Dùng tăm hoặc nĩa xăm đều quanh thân quả cà để khi nướng không bị nổ và nhanh chín đều từ trong ruột.", "timerMinutes": null},
            {"stepNumber": 2, "title": "Nướng cà tím thơm lừng", "description": "Nướng cà tím trên bếp than hoa hoặc nồi chiên không dầu ở 200°C trong 15 phút, lật mặt 1 lần đến khi vỏ ngoài cháy xém phồng rộp và bóp thấy mềm nhũn.", "timerMinutes": 15},
            {"stepNumber": 3, "title": "Lột vỏ cà tím", "description": "Để cà tím nguội bớt, nhẹ nhàng lột sạch lớp vỏ đen cháy bên ngoài, giữ lại phần cuống xanh và phần thịt cà trắng mềm ngọt mọng nước.", "timerMinutes": null},
            {"stepNumber": 4, "title": "Làm mỡ hành boa-rô chay", "description": "Cho boa-rô thái nhỏ vào bát cùng 1/2 muỗng cà phê hạt nêm chay. Đun sôi nóng già 4 muỗng dầu ăn rồi dội trực tiếp vào bát boa-rô khuấy đều cho hành chín xanh mướt.", "timerMinutes": 2},
            {"stepNumber": 5, "title": "Pha tương bần và hoàn thiện", "description": "Hòa tan tương bần với đường thốt nốt, nước cốt chanh và ớt băm. Đặt cà tím nướng ra đĩa, dùng nĩa tước nhẹ từng thớ thịt cà, rưới đẫm mỡ hành boa-rô và rắc đậu phộng rang giã dập lên trên. Dùng chấm tương bần ấm nóng.", "timerMinutes": null}
        ]
    },

    # ==================== 5. TRÁNG MIỆNG (trang-mieng) ====================
    {
        "title": "Chè hạt sen long nhãn thanh mát ngọt dịu",
        "slug": "che-hat-sen-long-nhan-thanh-mat",
        "categorySlug": "trang-mieng",
        "authorEmail": "author@culinaryblog.com",
        "description": "Món chè cung đình Huế thanh tao với hạt sen bở bùi được khéo léo lồng vào bên trong múi nhãn cùi giòn ngọt mọng nước, hòa trong làn nước đường phèn hoa bưởi thơm ngát dịu dàng.",
        "instructions": "### Kỹ thuật lồng hạt sen vào múi nhãn\n\nHạt sen ninh chín mềm bở nhưng hạt vẫn nguyên vẹn không nát, rim với đường phèn cho hạt sen ngấm ngọt đậm đà. Dùng dao nhọn tách nhẹ hạt nhãn tươi ra khỏi cùi nhãn, khéo léo nhồi từng viên hạt sen chín bùi vào bên trong múi nhãn.",
        "prepTimeMinutes": 25,
        "cookTimeMinutes": 25,
        "servings": 4,
        "difficulty": "Medium",
        "nutrition": {"calories": 220, "protein": 4.5, "carbohydrates": 50.0, "fat": 0.8, "fiber": 2.5, "sodium": 45},
        "ingredients": [
            {"name": "Hạt sen tươi Huế", "quantity": 250, "unit": "gram", "notes": "Bỏ tâm sen, rửa sạch"},
            {"name": "Nhãn lồng tươi (hoặc long nhãn khô)", "quantity": 500, "unit": "gram", "notes": "Chọn quả cùi dày giòn ngọt, bóc vỏ tách hạt"},
            {"name": "Đường phèn kết tinh tự nhiên", "quantity": 180, "unit": "gram", "notes": "Tạo vị ngọt thanh tao không gắt"},
            {"name": "Nước hoa bưởi tự nhiên", "quantity": 1, "unit": "muỗng cà phê", "notes": "Dậy hương thơm quý phái cung đình"},
            {"name": "Lá dứa (lá nếp)", "quantity": 3, "unit": "lá", "notes": "Rửa sạch cuộn thành bó nấu nước"},
            {"name": "Nước lọc tinh khiết", "quantity": 1000, "unit": "ml", "notes": "Nấu nước chè trong veo"},
            {"name": "Hạt chia hữu cơ", "quantity": 15, "unit": "gram", "notes": "Ngâm nở tạo cảm giác thanh mát bổ dưỡng"},
            {"name": "Táo đỏ Tân Cương thái lát", "quantity": 30, "unit": "gram", "notes": "Nấu cùng nước chè tạo vị ngọt thanh tự nhiên"},
            {"name": "Kỳ tử đỏ", "quantity": 10, "unit": "gram", "notes": "Thả vào nồi chè bồi bổ khí huyết"},
            {"name": "Muối biển tinh", "quantity": 0.5, "unit": "muỗng cà phê", "notes": "Dằn vị ngọt sâu"}
        ],
        "steps": [
            {"stepNumber": 1, "title": "Ninh hạt sen chín bở", "description": "Hạt sen tươi rửa sạch cho vào nồi cùng 800ml nước và bó lá dứa. Đun sôi rồi hạ lửa nhỏ ninh trong 15-18 phút đến khi hạt sen chín bở bùi, hạt còn nguyên vẹn không bị vỡ nát.", "timerMinutes": 18},
            {"stepNumber": 2, "title": "Rim hạt sen với đường phèn", "description": "Vớt hạt sen ra nồi nhỏ riêng, cho 80g đường phèn vào đun nhỏ lửa trong 7 phút cho đường tan chảy và ngấm sâu vị ngọt vào từng hạt sen.", "timerMinutes": 7},
            {"stepNumber": 3, "title": "Bóc vỏ và tách hạt nhãn", "description": "Nhãn bóc vỏ, dùng mũi dao nhọn lách nhẹ quanh cuống hạt nhãn rồi đẩy nhẹ hạt ra ngoài, giữ nguyên vẹn múi cùi nhãn tròn mọng.", "timerMinutes": null},
            {"stepNumber": 4, "title": "Lồng hạt sen vào cùi nhãn", "description": "Lấy từng hạt sen đã rim đường khéo léo nhồi vào bên trong múi cùi nhãn sao cho cùi nhãn ôm khít hạt sen tròn xoe đẹp mắt.", "timerMinutes": null},
            {"stepNumber": 5, "title": "Nấu nước chè thanh mát", "description": "Đun sôi lại nồi nước ninh hạt sen với lượng đường phèn còn lại cho tan hoàn toàn. Thả toàn bộ nhãn lồng hạt sen vào đun sôi bùng lại 1 phút rồi tắt bếp ngay để cùi nhãn giữ độ giòn sần sật.", "timerMinutes": 1},
            {"stepNumber": 6, "title": "Hoàn thiện và thưởng thức", "description": "Nhỏ vài giọt nước hoa bưởi vào nồi chè khuấy nhẹ. Múc chè ra bát thủy tinh, thưởng thức khi chè còn ấm hoặc thêm đá lạnh giải nhiệt mùa hè.", "timerMinutes": null}
        ]
    },
    {
        "title": "Chè bưởi An Giang giòn sần sật béo ngậy cốt dừa",
        "slug": "che-buoi-an-giang-gion-san-sat",
        "categorySlug": "trang-mieng",
        "authorEmail": "author@culinaryblog.com",
        "description": "Món chè trứ danh miền Tây với cùi bưởi giòn sần sật trong veo không một chút đắng cay, hòa quyện cùng đậu xanh bùi bở, nước cốt dừa béo ngậy và hương hoa bưởi thanh khiết.",
        "instructions": "### Bí quyết khử đắng và tạo độ giòn cho cùi bưởi\n\nCùi bưởi gọt sạch vỏ xanh và lớp màng xơ bên trong, cắt hạt lựu. Bóp muối hạt và xả nước lạnh 5-6 lần đến khi nếm cùi bưởi thấy hết hẳn vị đắng. Luộc cùi bưởi với chút phèn chua rồi ngâm ngay vào âu nước đá lạnh để cùi giòn sần sật.",
        "prepTimeMinutes": 35,
        "cookTimeMinutes": 25,
        "servings": 5,
        "difficulty": "Medium",
        "nutrition": {"calories": 280, "protein": 6.0, "carbohydrates": 52.0, "fat": 7.0, "fiber": 3.8, "sodium": 65},
        "ingredients": [
            {"name": "Cùi bưởi da xanh hoặc năm roi", "quantity": 200, "unit": "gram", "notes": "Cắt hạt lựu 1.5cm khử sạch đắng"},
            {"name": "Đậu xanh đãi vỏ", "quantity": 150, "unit": "gram", "notes": "Ngâm nở hấp chín tới hạt tơi"},
            {"name": "Bột năng nguyên chất", "quantity": 150, "unit": "gram", "notes": "Áo cùi bưởi và tạo độ sánh cho chè"},
            {"name": "Đường thốt nốt hoặc đường phèn", "quantity": 200, "unit": "gram", "notes": "Tạo màu vàng óng và vị ngọt thanh"},
            {"name": "Nước cốt dừa tươi đậm đặc", "quantity": 200, "unit": "ml", "notes": "Nấu sốt cốt dừa béo ngậy chan lên chè"},
            {"name": "Lá dứa thơm", "quantity": 4, "unit": "lá", "notes": "Nấu nước chè dậy mùi thơm"},
            {"name": "Muối hạt", "quantity": 2, "unit": "muỗng canh", "notes": "Dùng bóp cùi bưởi khử đắng"},
            {"name": "Tinh dầu hoa bưởi", "quantity": 2, "unit": "giọt", "notes": "Tạo hương thơm truyền thống"},
            {"name": "Đậu phộng rang bóc vỏ giã dập", "quantity": 50, "unit": "gram", "notes": "Rắc lên mặt ly chè tăng độ bùi béo"},
            {"name": "Vani chiết xuất tự nhiên", "quantity": 1, "unit": "muỗng cà phê", "notes": "Dậy hương thơm ngọt ngào"}
        ],
        "steps": [
            {"stepNumber": 1, "title": "Khử đắng cùi bưởi", "description": "Cùi bưởi cắt hạt lựu bóp thật kỹ với 2 muỗng muối hạt trong 3 phút, sau đó xả nước lạnh vắt kiệt. Lặp lại thao tác bóp muối và xả nước 5 lần đến khi nếm cùi bưởi không còn vị the đắng.", "timerMinutes": 10},
            {"stepNumber": 2, "title": "Luộc và ngâm nước đá cùi bưởi", "description": "Đun sôi nồi nước với chút muối, cho cùi bưởi vào chần nhanh trong 1 phút rồi vớt ra ngâm ngay vào âu nước đá lạnh 10 phút để cùi bưởi săn giòn sần sật.", "timerMinutes": 10},
            {"stepNumber": 3, "title": "Áo bột năng cho cùi bưởi", "description": "Vắt nhẹ cùi bưởi cho ráo bớt nước, ướp với 2 muỗng canh đường cho ngấm ngọt. Rắc từ từ bột năng vào xốc đều để từng viên cùi bưởi được phủ một lớp bột năng dày đều đặn.", "timerMinutes": null},
            {"stepNumber": 4, "title": "Luộc cùi bưởi trong veo", "description": "Đun sôi nồi nước lớn, thả cùi bưởi tẩm bột vào luộc trên lửa vừa trong 3-4 phút đến khi lớp bột bên ngoài chín trong suốt và nổi đều lên mặt nước thì vớt ra ngâm ngay vào âu nước lạnh.", "timerMinutes": 4},
            {"stepNumber": 5, "title": "Nấu chè bưởi sánh mượt", "description": "Đun sôi 1 lít nước cùng đường thốt nốt và bó lá dứa cho tan đều. Hòa tan 50g bột năng với nước lạnh rót từ từ vào khuấy đều cho nước chè sánh mượt. Cho đậu xanh hấp chín và cùi bưởi vào khuấy nhẹ tay 2 phút rồi tắt bếp.", "timerMinutes": 5},
            {"stepNumber": 6, "title": "Nấu nước cốt dừa và thưởng thức", "description": "Đun sôi nước cốt dừa với chút xíu muối và bột năng cho sánh béo. Múc chè bưởi ra ly, chan một vá nước cốt dừa béo ngậy lên trên, thêm đá bào và thưởng thức.", "timerMinutes": 3}
        ]
    },
    {
        "title": "Chè sương sa hạt lựu ba màu cốt dừa",
        "slug": "che-suong-sa-hat-luu-cot-dua",
        "categorySlug": "trang-mieng",
        "authorEmail": "author@culinaryblog.com",
        "description": "Ly chè ba màu rực rỡ sắc màu với những viên hạt lựu củ năng giòn rụm đỏ hồng bọc bột năng dai mềm, thạch sương sa lá dứa xanh ngát, đậu xanh bùi bở quyện cùng nước cốt dừa béo ngậy.",
        "instructions": "### Cách làm hạt lựu củ năng giòn tan không dính chùm\n\nCủ năng gọt vỏ thái hạt lựu nhỏ, ngâm vào nước cốt củ dền hoặc siro dâu để có màu đỏ hồng tự nhiên. Áo bột năng thật đều, rây bỏ bột thừa trước khi luộc. Luộc trong nước sôi bùng rồi vớt ra ngâm ngay vào âu nước đường lạnh.",
        "prepTimeMinutes": 30,
        "cookTimeMinutes": 15,
        "servings": 4,
        "difficulty": "Easy",
        "nutrition": {"calories": 260, "protein": 4.0, "carbohydrates": 54.0, "fat": 6.0, "fiber": 3.0, "sodium": 55},
        "ingredients": [
            {"name": "Củ năng tươi (củ mã thầy)", "quantity": 200, "unit": "gram", "notes": "Gọt vỏ thái hạt lựu nhỏ 0.8cm"},
            {"name": "Nước cốt củ dền", "quantity": 100, "unit": "ml", "notes": "Tạo màu đỏ hồng tự nhiên cho hạt lựu"},
            {"name": "Bột năng hảo hạng", "quantity": 120, "unit": "gram", "notes": "Áo hạt lựu tạo lớp vỏ dai giòn"},
            {"name": "Bột rau câu dẻo (Jelly powder)", "quantity": 10, "unit": "gram", "notes": "Nấu thạch sương sa lá dứa"},
            {"name": "Nước cốt lá dứa tươi", "quantity": 100, "unit": "ml", "notes": "Tạo màu xanh ngọc và mùi thơm mát"},
            {"name": "Đậu xanh cà vỏ", "quantity": 100, "unit": "gram", "notes": "Nấu nhuyễn tán mịn với chút đường"},
            {"name": "Nước cốt dừa tươi", "quantity": 200, "unit": "ml", "notes": "Nấu sôi sánh béo"},
            {"name": "Đường cát trắng", "quantity": 150, "unit": "gram", "notes": "Nấu nước đường chè"},
            {"name": "Dầu chuối tự nhiên", "quantity": 2, "unit": "giọt", "notes": "Hương thơm giải nhiệt mùa hè"},
            {"name": "Mè trắng rang thơm", "quantity": 20, "unit": "gram", "notes": "Rắc lên lớp nước cốt dừa"}
        ],
        "steps": [
            {"stepNumber": 1, "title": "Nấu thạch sương sa lá dứa", "description": "Hòa tan bột rau câu với 600ml nước và 60g đường. Đun sôi nhỏ lửa trong 5 phút, cho nước cốt lá dứa vào khuấy đều rồi đổ ra khay để nguội cho thạch đông chắc. Cắt thạch thành các sợi dài vừa ăn.", "timerMinutes": 5},
            {"stepNumber": 2, "title": "Nấu đậu xanh đánh", "description": "Đậu xanh vo sạch ngâm nước ấm 30 phút, nấu chín nhừ cùng chút muối và 40g đường. Dùng muỗng tán đậu xanh thật nhuyễn mịn thành hỗn hợp sánh sệt.", "timerMinutes": 15},
            {"stepNumber": 3, "title": "Làm hạt lựu củ năng đỏ", "description": "Củ năng hạt lựu ngâm vào nước cốt củ dền 15 phút cho nhuộm màu đỏ đẹp. Vớt củ năng ra ráo nước, cho vào âu xốc đều với bột năng cho bột áo kín từng viên rồi rây bỏ bột thừa.", "timerMinutes": 15},
            {"stepNumber": 4, "title": "Luộc hạt lựu giòn trong", "description": "Thả hạt lựu vào nồi nước đang sôi bùng, luộc 2-3 phút đến khi hạt lựu nổi lên và lớp vỏ bột năng chuyển trong suốt thì vớt ra ngâm ngay vào âu nước đường loãng có đá lạnh.", "timerMinutes": 3},
            {"stepNumber": 5, "title": "Trình bày và thưởng thức", "description": "Cho đá bào vào ly, múc một lớp đậu xanh tán mịn, một lớp thạch sương sa lá dứa, một lớp hạt lựu đỏ rực rỡ, chan nước đường và rưới nước cốt dừa béo ngậy lên trên. Nhỏ giọt dầu chuối thơm ngát và thưởng thức.", "timerMinutes": null}
        ]
    },
    {
        "title": "Sữa chua dẻo trà xanh trái cây tươi sốt chanh leo",
        "slug": "sua-chua-deo-tra-xanh-trai-cay",
        "categorySlug": "trang-mieng",
        "authorEmail": "author@culinaryblog.com",
        "description": "Từng viên sữa chua dẻo thơm mát đượm vị bột trà xanh matcha Nhật Bản mịn màng, cắt khối vuông vức ăn kèm dâu tây, xoài chín, thanh long đỏ và rưới sốt chanh leo chua ngọt quyến rũ.",
        "instructions": "### Cách làm sữa chua dẻo đông kết mịn không tách nước\n\nNgâm lá gelatin trong nước lạnh 10 phút cho nở mềm hoàn toàn, vắt ráo rồi hấp cách thủy cho tan chảy. Hòa gelatin ấm vào hỗn hợp sữa chua và sữa đặc đánh đều nhẹ tay để sữa chua dẻo mịn dẻo quánh sau khi để lạnh 6 tiếng.",
        "prepTimeMinutes": 20,
        "cookTimeMinutes": 5,
        "servings": 4,
        "difficulty": "Easy",
        "nutrition": {"calories": 210, "protein": 6.5, "carbohydrates": 36.0, "fat": 5.0, "fiber": 2.2, "sodium": 65},
        "ingredients": [
            {"name": "Sữa chua không đường", "quantity": 400, "unit": "gram", "notes": "Sữa chua sánh đặc tự nhiên"},
            {"name": "Sữa đặc có đường", "quantity": 100, "unit": "gram", "notes": "Tạo độ ngọt béo mịn"},
            {"name": "Lá gelatin tự nhiên", "quantity": 12, "unit": "gram", "notes": "Ngâm nước đá nở mềm tạo kết cấu dẻo"},
            {"name": "Bột trà xanh Matcha Nhật", "quantity": 10, "unit": "gram", "notes": "Rây mịn hòa tan tạo màu xanh và vị thanh"},
            {"name": "Dâu tây tươi Đà Lạt", "quantity": 100, "unit": "gram", "notes": "Cắt hạt lựu hoặc lát mỏng"},
            {"name": "Xoài chín ngọt", "quantity": 100, "unit": "gram", "notes": "Cắt khối vuông nhỏ"},
            {"name": "Chanh leo tươi (chanh dây)", "quantity": 3, "unit": "quả", "notes": "Nạo ruột lọc lấy nước cốt nấu sốt"},
            {"name": "Đường cát trắng", "quantity": 50, "unit": "gram", "notes": "Nấu sốt chanh leo chua ngọt"},
            {"name": "Kiwi xanh thái lát", "quantity": 1, "unit": "trái", "notes": "Trang trí kèm dâu tây và xoài"},
            {"name": "Hạnh nhân lát nướng giòn", "quantity": 25, "unit": "gram", "notes": "Rắc lên bề mặt đĩa sữa chua dẻo"}
        ],
        "steps": [
            {"stepNumber": 1, "title": "Ngâm nở gelatin", "description": "Ngâm các lá gelatin vào âu nước đá lạnh trong 10 phút cho nở mềm. Vớt ra vắt ráo nước, cho vào chén nhỏ chưng cách thủy 2 phút cho gelatin tan chảy hoàn toàn thành chất lỏng trong.", "timerMinutes": 10},
            {"stepNumber": 2, "title": "Pha hỗn hợp sữa chua trà xanh", "description": "Khuấy đều sữa chua không đường với sữa đặc và bột matcha rây mịn. Từ từ đổ gelatin ấm vào khuấy đều tay theo một chiều cho hỗn hợp hòa quyện mượt mà.", "timerMinutes": null},
            {"stepNumber": 3, "title": "Đổ khuôn và ủ lạnh", "description": "Đổ hỗn hợp sữa chua vào khuôn chữ nhật có lót màng bọc thực phẩm, gõ nhẹ khuôn xuống bàn để thoát bọt khí. Cho vào ngăn mát tủ lạnh ít nhất 5-6 tiếng cho sữa chua đông dẻo chắc.", "timerMinutes": null},
            {"stepNumber": 4, "title": "Nấu sốt chanh leo chua ngọt", "description": "Ruột chanh leo lọc bớt hạt, cho vào chảo nhỏ đun sôi cùng 50g đường và 30ml nước lọc trên lửa nhỏ trong 3 phút cho sốt sánh nhẹ óng ánh rồi để nguội.", "timerMinutes": 3},
            {"stepNumber": 5, "title": "Trình bày và thưởng thức", "description": "Lấy sữa chua dẻo ra khỏi khuôn, dùng dao nhúng nước ấm cắt thành các khối vuông quân cờ đều đặn. Xếp ra đĩa cùng dâu tây, xoài chín và rưới sốt chanh leo lên trên.", "timerMinutes": null}
        ]
    },
    {
        "title": "Bánh flan caramel trứng gà béo mịn thơm cà phê",
        "slug": "banh-flan-caramel-trung-ga-min",
        "categorySlug": "trang-mieng",
        "authorEmail": "author@culinaryblog.com",
        "description": "Chiếc bánh flan núng nính mềm mịn tan ngay trên đầu lưỡi, thơm lừng vị sữa tươi và lòng đỏ trứng gà ta, hòa quyện với lớp caramel ngọt đắng màu hổ phách và chút cà phê đen đậm đà đá mát lạnh.",
        "instructions": "### Bí quyết hấp bánh flan mịn màng không rỗ mặt\n\nKhuấy trứng với sữa nhẹ tay theo một chiều, tuyệt đối không đánh bông tạo bọt khí. Lọc hỗn hợp qua rây 2 lần để loại bỏ lợn cợn lòng trắng. Khi hấp, hạ lửa thật nhỏ liu riu, phủ khăn vải lên nắp nồi hấp để hơi nước không nhỏ giọt làm rỗ mặt bánh.",
        "prepTimeMinutes": 20,
        "cookTimeMinutes": 30,
        "servings": 6,
        "difficulty": "Easy",
        "nutrition": {"calories": 230, "protein": 7.0, "carbohydrates": 30.0, "fat": 9.5, "fiber": 0.0, "sodium": 95},
        "ingredients": [
            {"name": "Trứng gà tươi", "quantity": 5, "unit": "quả", "notes": "Dùng 3 quả nguyên và 2 lòng đỏ"},
            {"name": "Sữa tươi không đường", "quantity": 400, "unit": "ml", "notes": "Đun ấm khoảng 50°C"},
            {"name": "Sữa đặc có đường", "quantity": 120, "unit": "gram", "notes": "Tạo độ ngọt béo sánh mịn"},
            {"name": "Đường cát làm caramel", "quantity": 80, "unit": "gram", "notes": "Thắng caramel màu cánh gián"},
            {"name": "Nước cốt chanh tươi", "quantity": 1/2, "unit": "muỗng cà phê", "notes": "Chống lại đường khi thắng caramel"},
            {"name": "Chiết xuất vani tự nhiên", "quantity": 1, "unit": "muỗng cà phê", "notes": "Khử mùi tanh trứng dậy mùi thơm bánh"},
            {"name": "Cà phê đen pha phin", "quantity": 50, "unit": "ml", "notes": "Rưới lên mặt bánh khi ăn"},
            {"name": "Đá bào mát lạnh", "quantity": 100, "unit": "gram", "notes": "Ăn kèm bánh flan"},
            {"name": "Kem béo thực vật (whipping cream)", "quantity": 80, "unit": "ml", "notes": "Tăng độ béo ngậy mượt mà cho cốt bánh"},
            {"name": "Muối biển tinh khiết", "quantity": 0.5, "unit": "muỗng cà phê", "notes": "Cân bằng vị béo ngậy của sữa trứng"}
        ],
        "steps": [
            {"stepNumber": 1, "title": "Thắng caramel màu hổ phách", "description": "Cho 80g đường và 30ml nước vào chảo nhỏ đun trên lửa vừa, không khuấy. Khi đường chuyển sang màu vàng mật ong cánh gián, nhỏ vài giọt nước cốt chanh vào lắc đều rồi rót nhanh vào đáy các khuôn flan một lớp mỏng.", "timerMinutes": 6},
            {"stepNumber": 2, "title": "Khuấy hỗn hợp trứng và sữa", "description": "Khuấy tan 3 quả trứng nguyên và 2 lòng đỏ nhẹ tay. Đun ấm 400ml sữa tươi và 120g sữa đặc đến khoảng 50°C. Từ từ rót sữa ấm vào âu trứng, vừa rót vừa khuấy nhẹ một chiều cho hòa quyện cùng vani.", "timerMinutes": null},
            {"stepNumber": 3, "title": "Lọc mịn hỗn hợp flan", "description": "Rây hỗn hợp trứng sữa qua rây mắt nhỏ 2 lần để loại bỏ hoàn toàn bọt khí và cặn lòng trắng thừa, giúp bánh sau khi hấp đạt độ mịn màng không tì vết.", "timerMinutes": null},
            {"stepNumber": 4, "title": "Rót vào khuôn và chuẩn bị hấp", "description": "Rót nhẹ nhàng hỗn hợp sữa trứng vào từng khuôn flan đã tráng sẵn caramel. Đậy nắp khuôn hoặc bọc giấy bạc lên miệng từng khuôn.", "timerMinutes": null},
            {"stepNumber": 5, "title": "Hấp bánh flan lửa nhỏ", "description": "Xếp các khuôn flan vào xửng hấp. Đun sôi nước rồi hạ lửa xuống mức nhỏ nhất liu riu, hấp bánh trong 25-30 phút. Dùng tăm xăm thử thấy tăm khô ráo là bánh đã chín mịn.", "timerMinutes": 30},
            {"stepNumber": 6, "title": "Làm lạnh và thưởng thức", "description": "Để bánh nguội hẳn rồi cho vào ngăn mát tủ lạnh ít nhất 4 tiếng. Khi ăn, dùng mũi dao lách nhẹ quanh thành khuôn, úp ngược bánh ra đĩa, rưới chút cà phê đen pha phin và đá bào mát lạnh lên trên.", "timerMinutes": null}
        ]
    }
]

print(f"Batch 1 loaded: {len(RECIPES_BATCH_1)} recipes")

