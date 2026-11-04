# -*- coding: utf-8 -*-
"""
Batch 4: 25 authentic culinary recipes covering categories 19 to 25:
19. banh-ngot (4 recipes)
20. am-thuc-mien-bac (4 recipes)
21. am-thuc-mien-trung (4 recipes)
22. am-thuc-mien-nam (4 recipes)
23. gia-cam (3 recipes)
24. thit-bo (3 recipes)
25. thit-heo (3 recipes)
"""

null = None

BATCH_4_RECIPES = [
    # ==========================================
    # CATEGORY 19: BÁNH NGỌT & BÁNH TRUYỀN THỐNG (banh-ngot) - 4 recipes
    # ==========================================
    {
        "title": "Bánh mì kẹp thịt xá xíu pate bơ trứng giòn tan",
        "slug": "banh-mi-kep-thit-xa-xiu-pate",
        "description": "Bánh mì Việt Nam danh tiếng với vỏ ngoài giòn rụm, ruột mềm xốp, phết đẫm pate gan béo ngậy, bơ trứng vàng ươm, kẹp thịt xá xíu đậm đà cùng đồ chua và rau thơm thanh mát.",
        "categorySlug": "banh-ngot",
        "difficulty": "Medium",
        "prepTimeMinutes": 35,
        "cookTimeMinutes": 40,
        "servings": 4,
        "calories": 520,
        "protein": 24.5,
        "fat": 22.0,
        "carbs": 56.0,
        "fiber": 3.8,
        "sodium": 860.0,
        "ingredients": [
            {"name": "Bánh mì ổ giòn", "amount": 4.0, "unit": "ổ", "notes": "Vỏ mỏng giòn rụm", "orderIndex": 0},
            {"name": "Thịt nạc vai heo làm xá xíu", "amount": 400.0, "unit": "g", "notes": "Cắt dải dài bản dày", "orderIndex": 1},
            {"name": "Pate gan heo mịn", "amount": 120.0, "unit": "g", "notes": "Pate Hải Phòng hoặc nhà làm béo ngậy", "orderIndex": 2},
            {"name": "Bơ sốt trứng gà (mayonnaise Việt)", "amount": 80.0, "unit": "g", "notes": "Đánh từ lòng đỏ trứng gà và dầu ăn", "orderIndex": 3},
            {"name": "Xốt ướp xá xíu Lee Kum Kee", "amount": 3.0, "unit": "muỗng canh", "notes": "Pha cùng mật ong và ngũ vị hương", "orderIndex": 4},
            {"name": "Mật ong nguyên chất", "amount": 1.5, "unit": "muỗng canh", "notes": "Tạo độ bóng và ngọt thanh", "orderIndex": 5},
            {"name": "Ngũ vị hương", "amount": 0.5, "unit": "muỗng cà phê", "notes": "Thơm đặc trưng", "orderIndex": 6},
            {"name": "Dưa leo", "amount": 2.0, "unit": "trái", "notes": "Cắt lát xéo mỏng", "orderIndex": 7},
            {"name": "Đồ chua (cà rốt & củ cải ngâm giấm đường)", "amount": 120.0, "unit": "g", "notes": "Vắt ráo nước", "orderIndex": 8},
            {"name": "Rau ngò rí", "amount": 30.0, "unit": "g", "notes": "Rửa sạch để ráo", "orderIndex": 9},
            {"name": "Ớt sừng đỏ", "amount": 2.0, "unit": "trái", "notes": "Cắt lát mỏng", "orderIndex": 10},
            {"name": "Nước tương ngon", "amount": 2.0, "unit": "muỗng canh", "notes": "Nấu hơi sệt cùng ít nước xá xíu làm nước chan", "orderIndex": 11}
        ],
        "instructions": [
            {"stepNumber": 1, "title": "Ướp thịt xá xíu", "instruction": "Thịt nạc vai rửa sạch với muối, thấm khô. Ướp cùng 3 muỗng xốt xá xíu, 1.5 muỗng mật ong, ngũ vị hương, tỏi băm trong ít nhất 2 giờ.", "timerSeconds": 7200, "tip": "Ướp qua đêm trong tủ mát thịt thấm sâu và mềm mọng hơn.", "orderIndex": 0},
            {"stepNumber": 2, "title": "Nướng thịt xá xíu", "instruction": "Làm nóng lò ở 190°C. Cho thịt vào khay nướng 25 phút, lật mặt và quét nước ướp thêm 15 phút đến khi cạnh thịt hơi cháy xém thơm lừng.", "timerSeconds": 2400, "tip": "Quét mật ong pha chút nước ướp ở 5 phút cuối để lên màu đỏ nâu óng ả.", "orderIndex": 1},
            {"stepNumber": 3, "title": "Làm nóng bánh mì và xắt thịt", "instruction": "Bánh mì cho vào lò nướng hoặc nồi chiên không dầu sấy lại ở 160°C trong 3 phút cho vỏ giòn tan. Thịt xá xíu để nghỉ 5 phút rồi thái lát mỏng vừa ăn.", "timerSeconds": 180, "tip": "Không thái thịt ngay khi mới lấy ra khỏi lò để tránh chảy nước cốt.", "orderIndex": 2},
            {"stepNumber": 4, "title": "Phết sốt và xếp nhân", "instruction": "Xẻ dọc thân bánh mì. Dùng dao phết một lớp bơ trứng béo vàng, kế đến phết lớp pate gan béo đậm đà đều khắp lòng bánh.", "timerSeconds": null, "tip": "Phết bơ và pate cả hai bên thành bánh để cắn miếng nào cũng đậm vị.", "orderIndex": 3},
            {"stepNumber": 5, "title": "Hoàn thiện ổ bánh mì", "instruction": "Gắp dưa leo lát, xếp đều thịt xá xíu, gắp đồ chua củ cải cà rốt rải lên, thêm cọng ngò rí và vài lát ớt tươi. Rưới một muỗng xốt xá xíu rim mặn ngọt dọc ổ bánh.", "timerSeconds": null, "tip": "Dùng ngay khi bánh còn nóng giòn để tận hưởng kết cấu hoàn hảo.", "orderIndex": 4}
        ],
        "imageCaptions": [
            "Ổ bánh mì kẹp xá xíu vàng ươm giòn rụm phết pate ngập tràn",
            "Dải thịt xá xíu nướng mật ong thơm lừng bóng bẩy xắt lát mỏng",
            "Bát bơ sốt trứng vàng ngà sánh mịn cùng pate gan truyền thống",
            "Bánh mì cắt đôi phô bày các tầng nhân thịt rau đồ chua hài hòa"
        ]
    },
    {
        "title": "Bánh bao nhân thịt xá xíu trứng cút nóng hổi",
        "slug": "banh-bao-nhan-thit-xa-xiu",
        "description": "Bánh bao truyền thống với vỏ bột trắng tinh xốp mềm như mây, bọc trọn nhân thịt heo băm, xá xíu đậm đà, mộc nhĩ giòn sần sật và trứng cút luộc thơm ngon bổ dưỡng.",
        "categorySlug": "banh-ngot",
        "difficulty": "Hard",
        "prepTimeMinutes": 60,
        "cookTimeMinutes": 25,
        "servings": 8,
        "calories": 380,
        "protein": 14.8,
        "fat": 12.2,
        "carbs": 52.0,
        "fiber": 2.1,
        "sodium": 580.0,
        "ingredients": [
            {"name": "Bột mì hoa ngọc lan (protein 10-11%)", "amount": 400.0, "unit": "g", "notes": "Rây mịn", "orderIndex": 0},
            {"name": "Men nở khô (instant dry yeast)", "amount": 5.0, "unit": "g", "notes": "Kích hoạt bằng sữa ấm", "orderIndex": 1},
            {"name": "Sữa tươi không đường", "amount": 220.0, "unit": "ml", "notes": "Ấm nhẹ khoảng 35°C", "orderIndex": 2},
            {"name": "Đường cát trắng", "amount": 50.0, "unit": "g", "notes": "Dành cho bột vỏ bánh", "orderIndex": 3},
            {"name": "Dầu ăn", "amount": 25.0, "unit": "ml", "notes": "Giúp vỏ bánh mềm mượt bóng", "orderIndex": 4},
            {"name": "Thịt heo xay nạc dăm", "amount": 300.0, "unit": "g", "notes": "Xay vừa không quá nhuyễn", "orderIndex": 5},
            {"name": "Thịt xá xíu thái hạt lựu", "amount": 100.0, "unit": "g", "notes": "Tạo điểm nhấn vị thơm", "orderIndex": 6},
            {"name": "Trứng cút", "amount": 8.0, "unit": "quả", "notes": "Luộc chín bóc vỏ", "orderIndex": 7},
            {"name": "Mộc nhĩ ngâm nở", "amount": 30.0, "unit": "g", "notes": "Băm nhỏ", "orderIndex": 8},
            {"name": "Nấm hương khô ngâm nở", "amount": 20.0, "unit": "g", "notes": "Băm nhỏ", "orderIndex": 9},
            {"name": "Hành tím và đầu hành lá", "amount": 40.0, "unit": "g", "notes": "Băm nhuyễn phi thơm", "orderIndex": 10},
            {"name": "Dầu hào và tiêu sọ xay", "amount": 2.0, "unit": "muỗng canh", "notes": "Gia vị ướp nhân", "orderIndex": 11}
        ],
        "instructions": [
            {"stepNumber": 1, "title": "Trộn và nhồi bột", "instruction": "Hòa men nở và chút đường vào sữa ấm nghỉ 10 phút sủi bọt. Trộn bột mì, đường, dầu ăn và sữa men, nhồi tay 15 phút hoặc dùng máy đến khi khối bột mịn dẻo, không dính tay.", "timerSeconds": 900, "tip": "Sữa không được quá 40°C sẽ làm chết men.", "orderIndex": 0},
            {"stepNumber": 2, "title": "Ủ bột lần 1", "instruction": "Quét lớp dầu mỏng quanh âu, đặt khối bột vào đậy khăn ẩm. Ủ bột ở nơi ấm áp khoảng 45-60 phút đến khi nở gấp đôi.", "timerSeconds": 3000, "tip": "Dùng ngón tay ấn vào khối bột, vết lõm giữ nguyên là bột đã ủ đạt.", "orderIndex": 1},
            {"stepNumber": 3, "title": "Trộn nhân bánh", "instruction": "Trộn đều thịt xay, xá xíu hạt lựu, mộc nhĩ, nấm hương, hành phi, dầu hào, hạt nêm, tiêu sọ. Chia làm 8 phần, ấn dẹt rồi bọc kín 1 quả trứng cút vào giữa mỗi phần nhân.", "timerSeconds": null, "tip": "Nhân bọc chặt tay tránh khoảng rỗng sinh hơi khi hấp.", "orderIndex": 2},
            {"stepNumber": 4, "title": "Cán vỏ và tạo hình", "instruction": "Bột ủ xong đấm xẹp bọt khí, chia làm 8 phần vo tròn, nghỉ 10 phút. Cán mép bột mỏng hơn tâm giữa, đặt viên nhân vào và gấp nếp viền cánh hoa xoắn miệng bánh lại.", "timerSeconds": 600, "tip": "Đặt từng bánh lên một miếng giấy nến chống dính nhỏ.", "orderIndex": 3},
            {"stepNumber": 5, "title": "Ủ lần 2 và hấp bánh", "instruction": "Ủ bánh đã tạo hình thêm 20 phút. Đun sôi xửng hấp có pha 2 muỗng giấm vào nước cho vỏ trắng. Cho bánh vào hấp lửa vừa 20 phút không mở nắp.", "timerSeconds": 1200, "tip": "Tắt bếp để bánh nguyên trong xửng 5 phút rồi mới mở nắp để bánh không xẹp.", "orderIndex": 4}
        ],
        "imageCaptions": [
            "Xửng bánh bao nóng hổi nghi ngút khói với lớp vỏ trắng mịn căng tròn",
            "Thao tác gấp nếp xếp hoa tỉ mỉ túm miệng bánh bao truyền thống",
            "Viên nhân thịt xá xíu bọc trứng cút đậm đà xếp trên khay",
            "Bánh bao bẻ đôi khoe nhân thịt thơm lừng trứng cút béo bùi"
        ]
    },
    {
        "title": "Bánh bò thốt nốt nướng rễ tre béo ngậy dừa tươi",
        "slug": "banh-bo-thot-not-nuong-re-tre",
        "description": "Món bánh ngọt trứ danh Tây Nam Bộ với màu nâu caramel óng ả từ đường thốt nốt nguyên chất, kết cấu rễ tre tơi xốp mềm dai cùng hương thơm béo ngậy ngập tràn của nước cốt dừa tươi.",
        "categorySlug": "banh-ngot",
        "difficulty": "Hard",
        "prepTimeMinutes": 45,
        "cookTimeMinutes": 50,
        "servings": 8,
        "calories": 290,
        "protein": 4.2,
        "fat": 8.5,
        "carbs": 50.0,
        "fiber": 1.2,
        "sodium": 120.0,
        "ingredients": [
            {"name": "Bột năng tinh khiết", "amount": 250.0, "unit": "g", "notes": "Tạo độ dai dẻo đặc trưng", "orderIndex": 0},
            {"name": "Bột gạo tẻ mịn", "amount": 50.0, "unit": "g", "notes": "Cân bằng độ mềm cho bánh", "orderIndex": 1},
            {"name": "Đường thốt nốt An Giang", "amount": 220.0, "unit": "g", "notes": "Cắt nhỏ nấu chảy tạo màu và vị thanh", "orderIndex": 2},
            {"name": "Nước cốt dừa đậm đặc", "amount": 250.0, "unit": "ml", "notes": "Vắt từ cơm dừa tươi", "orderIndex": 3},
            {"name": "Trứng gà tươi", "amount": 4.0, "unit": "quả", "notes": "Để nhiệt độ phòng", "orderIndex": 4},
            {"name": "Men nở khô (instant dry yeast)", "amount": 6.0, "unit": "g", "notes": "Kích nở rễ tre", "orderIndex": 5},
            {"name": "Bột nở (baking powder)", "amount": 5.0, "unit": "g", "notes": "Tạo độ phồng xốp bổ trợ", "orderIndex": 6},
            {"name": "Nước dừa xiêm tươi", "amount": 50.0, "unit": "ml", "notes": "Kích hoạt men", "orderIndex": 7},
            {"name": "Bơ lạt hoặc dầu dừa", "amount": 20.0, "unit": "g", "notes": "Quét chống dính khuôn nướng", "orderIndex": 8},
            {"name": "Muối biển tinh", "amount": 0.5, "unit": "muỗng cà phê", "notes": "Dằn vị ngọt béo", "orderIndex": 9},
            {"name": "Vani chiết xuất tự nhiên", "amount": 1.0, "unit": "muỗng cà phê", "notes": "Tăng hương thơm hấp dẫn", "orderIndex": 10}
        ],
        "instructions": [
            {"stepNumber": 1, "title": "Nấu caramel nước cốt dừa thốt nốt", "instruction": "Cho đường thốt nốt cùng nước cốt dừa và chút muối vào nồi nhỏ đun lửa liu riu cho đường tan chảy hoàn toàn, tắt bếp để nguội về nhiệt độ ấm ấm (khoảng 35°C).", "timerSeconds": 480, "tip": "Không để hỗn hợp quá nóng làm chết men khi trộn sau này.", "orderIndex": 0},
            {"stepNumber": 2, "title": "Kích hoạt men và ủ bột", "instruction": "Khuấy tan men vào 50ml nước dừa ấm nghỉ 10 phút. Trộn bột năng, bột gạo rồi đổ men và hỗn hợp đường cốt dừa ấm vào, khuấy đều tay lọc qua rây, ủ kín 90 phút.", "timerSeconds": 5400, "tip": "Sau khi ủ thấy bột sủi tăm li ti dày đặc là đạt chuẩn rễ tre.", "orderIndex": 1},
            {"stepNumber": 3, "title": "Đánh trứng và trộn hỗn hợp", "instruction": "Đập 4 quả trứng gà dùng phới lồng khuấy nhẹ nhàng theo một chiều không tạo bọt khí lớn. Cho trứng qua rây vào thau bột đã ủ, thêm bột nở và vani, khuấy nhẹ đều tay.", "timerSeconds": 300, "tip": "Khuấy nhẹ tay tránh làm vỡ các bọt khí men đang nở.", "orderIndex": 2},
            {"stepNumber": 4, "title": "Làm nóng khuôn và lọc bột", "instruction": "Bật lò nướng 180°C kèm khuôn nướng quét bơ bên trong trong 15 phút cho khuôn thật nóng già. Lấy khuôn ra đổ bột qua rổ lược lỗ nhỏ trực tiếp vào khuôn để nghe tiếng 'xèo'.", "timerSeconds": 900, "tip": "Khuôn cực nóng là bí quyết vàng để bánh phóng tia rễ tre từ đáy lên.", "orderIndex": 3},
            {"stepNumber": 5, "title": "Nướng bánh và làm nguội", "instruction": "Cho khuôn vào rãnh dưới của lò nướng ở 175°C trong 45-50 phút. Khi bánh chín vàng thơm, dùng tăm xiên không dính là đạt. Lấy ra để nguội hoàn toàn rồi mới úp bánh ra đĩa.", "timerSeconds": 3000, "tip": "Cắt bánh khi nguội hẳn mặt cắt rễ tre sẽ lộ rõ mồn một và bóng bẩy.", "orderIndex": 4}
        ],
        "imageCaptions": [
            "Bánh bò thốt nốt nướng vàng nâu óng ả kết cấu rễ tre chi chít tuyệt đẹp",
            "Nồi nước cốt dừa thốt nốt đun sánh màu caramel thơm phức ngát hương",
            "Thao tác rây bột men sủi bọt vào khuôn bánh gang đang nóng ran",
            "Lát bánh bò thốt nốt mềm dai núng nính rưới cốt dừa mè rang béo ngậy"
        ]
    },
    {
        "title": "Bánh chuối nướng cốt dừa ổ mềm thơm bơ",
        "slug": "banh-chuoi-nuong-cot-dua",
        "description": "Bánh chuối nướng miền Nam với những lát chuối sứ đỏ hồng ngọt lịm xếp lớp tinh tế trên nền cốt bánh bánh mì ngâm nước cốt dừa, sữa đặc và bơ thơm ngát mềm mịn.",
        "categorySlug": "banh-ngot",
        "difficulty": "Easy",
        "prepTimeMinutes": 30,
        "cookTimeMinutes": 60,
        "servings": 8,
        "calories": 260,
        "protein": 4.0,
        "fat": 7.8,
        "carbs": 44.5,
        "fiber": 2.5,
        "sodium": 140.0,
        "ingredients": [
            {"name": "Chuối sứ chín muồi (chuối xiêm)", "amount": 10.0, "unit": "trái", "notes": "Vỏ đốm trứng cuốc ngọt sắc", "orderIndex": 0},
            {"name": "Bánh mì cũ xé nhỏ", "amount": 150.0, "unit": "g", "notes": "Tạo kết cấu cốt bánh vững chắc", "orderIndex": 1},
            {"name": "Nước cốt dừa", "amount": 300.0, "unit": "ml", "notes": "Béo ngậy đậm đà", "orderIndex": 2},
            {"name": "Sữa tươi không đường", "amount": 150.0, "unit": "ml", "notes": "Làm mềm ẩm ruột bánh", "orderIndex": 3},
            {"name": "Sữa đặc có đường", "amount": 80.0, "unit": "g", "notes": "Vị ngọt thanh dịu", "orderIndex": 4},
            {"name": "Bơ lạt đun chảy", "amount": 50.0, "unit": "g", "notes": "Hương thơm quyến rũ", "orderIndex": 5},
            {"name": "Rượu rum hoặc rượu Mai Quế Lộ", "amount": 1.5, "unit": "muỗng canh", "notes": "Ướp chuối lên màu đỏ đẹp", "orderIndex": 6},
            {"name": "Đường cát vàng", "amount": 60.0, "unit": "g", "notes": "Ướp chuối và áo mặt bánh", "orderIndex": 7},
            {"name": "Bột mì đa dụng", "amount": 40.0, "unit": "g", "notes": "Gắn kết cốt bánh", "orderIndex": 8},
            {"name": "Trứng gà", "amount": 2.0, "unit": "quả", "notes": "Đánh tan", "orderIndex": 9},
            {"name": "Muối biển", "amount": 0.5, "unit": "muỗng cà phê", "notes": "Dằn ngọt", "orderIndex": 10}
        ],
        "instructions": [
            {"stepNumber": 1, "title": "Ướp chuối lên màu đỏ", "instruction": "Lột vỏ 7 trái chuối cắt lát xéo, 3 trái còn lại dằm nhuyễn. Trộn chuối xắt lát cùng đường cát vàng và rượu rum, bọc màng thực phẩm ướp ít nhất 1 giờ.", "timerSeconds": 3600, "tip": "Rượu rum kết hợp với đường giúp chuối khi nướng chuyển sang màu đỏ tím quyến rũ.", "orderIndex": 0},
            {"stepNumber": 2, "title": "Làm cốt bánh bánh mì cốt dừa", "instruction": "Xé nhỏ bánh mì vào âu lớn, rót nước cốt dừa, sữa tươi, sữa đặc, bơ chảy, trứng gà, muối và chuối dằm nhuyễn vào. Ngâm 20 phút cho bánh mì hút no nước rồi dùng phới tán nhuyễn.", "timerSeconds": 1200, "tip": "Rây thêm bột mì vào cốt bánh quấy đều để bánh đứng dáng khi nướng.", "orderIndex": 1},
            {"stepNumber": 3, "title": "Vào khuôn bánh", "instruction": "Lót giấy nến đáy và quanh thành khuôn tròn/vuông. Múc 1/2 hỗn hợp cốt bánh vào dàn phẳng, rải một lớp chuối xắt lát, múc tiếp phần cốt bánh còn lại, trên cùng xếp kín chuối lát xếp vảy cá nghệ thuật.", "timerSeconds": null, "tip": "Rưới phần nước đường rượu ướp chuối còn sót lại lên mặt trên.", "orderIndex": 2},
            {"stepNumber": 4, "title": "Nướng bánh vàng ươm", "instruction": "Bật lò 175°C trước 10 phút. Đặt khuôn bánh vào nướng 60-70 phút đến khi mặt chuối chuyển màu đỏ hồng caramel thơm lừng, dùng que thử bánh không dính ướt.", "timerSeconds": 3900, "tip": "Nếu mặt trên vàng sớm có thể che giấy bạc để nướng tiếp ruột bánh.", "orderIndex": 3},
            {"stepNumber": 5, "title": "Làm nguội và thưởng thức", "instruction": "Lấy bánh ra khỏi lò quét thêm lớp bơ mỏng lên mặt chuối cho bóng. Để bánh nguội hoàn toàn rồi bọc kín cất ngăn mát tủ lạnh 3 tiếng trước khi cắt miếng tam giác.", "timerSeconds": 10800, "tip": "Bánh chuối nướng ăn lạnh sẽ có độ dẻo mềm béo ngậy ngon gấp bội.", "orderIndex": 4}
        ],
        "imageCaptions": [
            "Ổ bánh chuối nướng cốt dừa màu đỏ tím óng ả xếp chuối vảy cá bắt mắt",
            "Tô hỗn hợp bánh mì xé ngâm cốt dừa bơ trứng thơm ngát mềm mịn",
            "Khuôn bánh vừa xếp lớp chuối rượu rum chuẩn bị cho vào lò nướng",
            "Miếng bánh chuối cắt tam giác dẻo quánh béo ngậy mát lạnh hấp dẫn"
        ]
    },

    # ==========================================
    # CATEGORY 20: ẨM THỰC MIỀN BẮC (am-thuc-mien-bac) - 4 recipes
    # ==========================================
    {
        "title": "Chả cá Lã Vọng thì là hành hoa thơm lừng mắm tôm",
        "slug": "cha-ca-la-vong-thi-la-hanh-hoa",
        "description": "Món ăn tinh hoa đất Tràng An với từng miếng cá lăng tươi rói ướp riềng mẻ nghệ vàng ruộm, nướng than hoa rồi đảo nóng trên chảo mỡ cùng hành hoa, thì là xum xuê và chấm mắm tôm sủi bọt.",
        "categorySlug": "am-thuc-mien-bac",
        "difficulty": "Medium",
        "prepTimeMinutes": 35,
        "cookTimeMinutes": 25,
        "servings": 4,
        "calories": 480,
        "protein": 34.0,
        "fat": 26.0,
        "carbs": 26.0,
        "fiber": 3.2,
        "sodium": 820.0,
        "ingredients": [
            {"name": "Cá lăng tươi phi lê", "amount": 600.0, "unit": "g", "notes": "Thịt dai ngọt không xương dăm, thái miếng vuông dày", "orderIndex": 0},
            {"name": "Riềng già củ tươi", "amount": 80.0, "unit": "g", "notes": "Giã nát vắt lấy nước cốt đặc", "orderIndex": 1},
            {"name": "Cơm mẻ ngấu chua", "amount": 3.0, "unit": "muỗng canh", "notes": "Nghiền lọc qua rây lấy nước mịn", "orderIndex": 2},
            {"name": "Mắm tôm loại ngon", "amount": 2.0, "unit": "muỗng canh", "notes": "Dùng ướp cá tạo chiều sâu vị giác", "orderIndex": 3},
            {"name": "Nghệ tươi hoặc tinh bột nghệ", "amount": 1.5, "unit": "muỗng canh", "notes": "Giã vắt nước tạo màu vàng óng tự nhiên", "orderIndex": 4},
            {"name": "Hành hoa (hành lá) bánh tẻ", "amount": 250.0, "unit": "g", "notes": "Cắt khúc dài ngón tay, chẻ củ trắng", "orderIndex": 5},
            {"name": "Rau thì là tươi", "amount": 200.0, "unit": "g", "notes": "Cắt khúc dài bằng hành lá", "orderIndex": 6},
            {"name": "Đậu phộng (lạc) rang", "amount": 80.0, "unit": "g", "notes": "Bóc vỏ giã dập nhẹ", "orderIndex": 7},
            {"name": "Bún tươi sợi mảnh", "amount": 500.0, "unit": "g", "notes": "Bún lá hoặc bún rối Hà Nội", "orderIndex": 8},
            {"name": "Mỡ heo nước", "amount": 4.0, "unit": "muỗng canh", "notes": "Xào cá tăng độ béo bóng truyền thống", "orderIndex": 9},
            {"name": "Bát mắm tôm chấm kèm (mắm tôm, chanh, đường, ớt, rượu trắng)", "amount": 1.0, "unit": "phần", "notes": "Đánh bông sủi bọt trắng", "orderIndex": 10},
            {"name": "Bánh đa nướng mè", "amount": 2.0, "unit": "cái", "notes": "Bẻ miếng ăn kèm giòn rụm", "orderIndex": 11}
        ],
        "instructions": [
            {"stepNumber": 1, "title": "Sơ chế và ướp cá lăng", "instruction": "Cá lăng rửa nước muối gừng, thấm khô kiệt, cắt miếng vuông cỡ 3x4cm dày 1.5cm. Ướp cá với nước cốt riềng, nước nghệ, mẻ lọc, 1 muỗng mắm tôm, tiêu sọ và chút dầu ăn trong 40 phút.", "timerSeconds": 2400, "tip": "Thịt cá lăng dày và chắc nên ướp đủ thời gian để riềng mẻ ngấm vào tâm miếng cá.", "orderIndex": 0},
            {"stepNumber": 1, "title": "Nướng cá chín tới trên than hồng", "instruction": "Kẹp từng miếng cá vào vỉ nướng đã quét dầu chống dính. Nướng trên than hoa đượm lửa, quạt nhẹ và trở đều hai mặt đến khi miếng cá se lại, vàng ươm và thơm nức mùi riềng nghệ (chín khoảng 80%).", "timerSeconds": 600, "tip": "Không nướng cá quá khô cứng, chỉ nướng xém cạnh để giữ nước ngọt mọng bên trong.", "orderIndex": 1},
            {"stepNumber": 3, "title": "Pha mắm tôm chấm chả cá", "instruction": "Cho mắm tôm ngon vào bát con, thêm đường cát, rượu trắng khử tanh và nước cốt chanh tươi. Dùng đũa đánh thật mạnh tay và nhanh cho mắm tôm bông xốp nổi bọt trắng xóa, thả vài lát ớt chỉ thiên.", "timerSeconds": 180, "tip": "Một giọt tinh dầu cà cuống vào bát mắm tôm sẽ chuẩn phong vị Hà Nội cổ.", "orderIndex": 2},
            {"stepNumber": 4, "title": "Đảo chả cá tại bàn", "instruction": "Đặt chảo nhỏ lên bếp cồn/bếp ga mini giữa bàn ăn, cho 2 muỗng mỡ heo đun sôi lăn tăn. Thả cá đã nướng vào xào nóng, phủ ngập ngọn thì là và hành lá lên trên, đảo nhẹ nhàng cho rau vừa chín tái và ngấm mỡ cá.", "timerSeconds": 240, "tip": "Rau thì là và hành chỉ cần tái chín tới để giữ vị ngọt hăng thơm nồng.", "orderIndex": 3},
            {"stepNumber": 5, "title": "Thưởng thức đúng điệu Tràng An", "instruction": "Gắp chút bún vào bát, gắp miếng cá lăng vàng ruộm bốc khói, thêm đũa hành hoa thì là đẫm mỡ, rắc vài hạt lạc rang bùi bùi, bẻ vụn góc bánh đa giòn, rưới thìa mắm tôm bông xốp lên và thưởng thức.", "timerSeconds": null, "tip": "Ăn ngay khi cá và rau còn nóng hổi sôi xèo xèo trên chảo.", "orderIndex": 4}
        ],
        "imageCaptions": [
            "Chảo chả cá Lã Vọng xèo xèo sôi mỡ phủ ngập thì là và hành hoa xanh mướt",
            "Từng miếng cá lăng nướng vàng ươm thơm lừng mùi riềng mẻ nghệ than hoa",
            "Bát mắm tôm đánh chanh sủi bọt trắng xóa điểm xuyết ớt đỏ tươi",
            "Mâm bún chả cá Hà Nội đủ vị với bún sợi nhỏ lạc rang và bánh đa giòn"
        ]
    },
    {
        "title": "Bánh cuốn Thanh Trì tráng mỏng chả quế hành phi",
        "slug": "banh-cuon-thanh-tri-cha-que",
        "description": "Đặc sản nức tiếng kinh kỳ ngàn năm văn hiến, bánh cuốn được tráng mỏng như cánh ve, mềm mướt trắng trong, thoa lớp mỡ hành béo ngậy, cuộn mộc nhĩ thịt băm hoặc để chay, ăn kèm chả quế thơm lừng và nước mắm cà cuống ấm dịu.",
        "categorySlug": "am-thuc-mien-bac",
        "difficulty": "Hard",
        "prepTimeMinutes": 45,
        "cookTimeMinutes": 30,
        "servings": 4,
        "calories": 420,
        "protein": 18.0,
        "fat": 14.5,
        "carbs": 54.0,
        "fiber": 2.2,
        "sodium": 760.0,
        "ingredients": [
            {"name": "Gạo tẻ ngon xay ướt (hoặc bột bánh cuốn pha sẵn)", "amount": 300.0, "unit": "g", "notes": "Gạo Khang Dân ngâm xay bột nước", "orderIndex": 0},
            {"name": "Bột năng tinh khiết", "amount": 60.0, "unit": "g", "notes": "Tạo độ trong dai mềm mướt", "orderIndex": 1},
            {"name": "Nước lọc tinh khiết", "amount": 800.0, "unit": "ml", "notes": "Hòa tan bột và thay nước lắng", "orderIndex": 2},
            {"name": "Thịt nạc vai băm nhỏ", "amount": 200.0, "unit": "g", "notes": "Xào nhân bánh", "orderIndex": 3},
            {"name": "Mộc nhĩ & nấm hương ngâm nở", "amount": 40.0, "unit": "g", "notes": "Băm nhuyễn xào cùng thịt", "orderIndex": 4},
            {"name": "Hành khô ta phi vàng giòn", "amount": 80.0, "unit": "g", "notes": "Tự phi thơm vàng ruộm ráo dầu", "orderIndex": 5},
            {"name": "Chả quế nướng Hà Nội", "amount": 250.0, "unit": "g", "notes": "Thái lát xéo dày", "orderIndex": 6},
            {"name": "Nước mắm cốt truyền thống", "amount": 4.0, "unit": "muỗng canh", "notes": "Pha nước chấm nhạt ấm nóng", "orderIndex": 7},
            {"name": "Giấm nếp ngon hoặc chanh tươi", "amount": 2.0, "unit": "muỗng canh", "notes": "Tạo vị chua thanh dịu", "orderIndex": 8},
            {"name": "Đường cát trắng", "amount": 3.0, "unit": "muỗng canh", "notes": "Cân bằng nước mắm", "orderIndex": 9},
            {"name": "Rau mùi ta và húng láng", "amount": 50.0, "unit": "g", "notes": "Rửa sạch để ráo ăn kèm", "orderIndex": 10},
            {"name": "Mỡ gà hoặc dầu ăn thoa bánh", "amount": 2.0, "unit": "muỗng canh", "notes": "Thoa mâm cuộn bánh chống dính", "orderIndex": 11}
        ],
        "instructions": [
            {"stepNumber": 1, "title": "Pha bột và ngâm bột bánh cuốn", "instruction": "Hòa bột gạo tẻ và bột năng vào 800ml nước cùng 1 thìa cà phê muối. Ngâm bột 4-6 tiếng, thỉnh thoảng chắt bỏ phần nước trong trên mặt rồi châm lại lượng nước ấm tương đương để bánh không có mùi chua.", "timerSeconds": 14400, "tip": "Thay nước lắng 2-3 lần giúp lá bánh tráng ra trong vắt và dẻo dai.", "orderIndex": 0},
            {"stepNumber": 2, "title": "Xào nhân thịt mộc nhĩ", "instruction": "Phi thơm hành tím băm, trút thịt nạc vai băm vào xào săn tơi. Thêm nấm hương và mộc nhĩ băm nhỏ vào đảo đều, nêm 1 thìa nước mắm, tiêu sọ xay, xào chín khô ráo không đọng mỡ thừa.", "timerSeconds": 480, "tip": "Nhân phải xào thật ráo để khi cuộn không làm ướt rách vỏ bánh.", "orderIndex": 1},
            {"stepNumber": 3, "title": "Tráng bánh cuốn mỏng tang", "instruction": "Căng vải nồi hơi nước thật phẳng, đun sôi nước sùng sục. Múc một muôi bột lỏng láng đều thật mỏng trên mặt vải, đậy vung hấp 30-45 giây. Dùng thanh tre dẹt thoa chút mỡ khéo léo gạt lấy lá bánh trải ra mâm có thoa mỡ gà.", "timerSeconds": 60, "tip": "Hơi nước phải cực mạnh để lá bánh chín phồng trong suốt chỉ sau nửa phút.", "orderIndex": 2},
            {"stepNumber": 4, "title": "Cuộn bánh và rắc hành phi", "instruction": "Cho thìa nhân thịt mộc nhĩ vào giữa lá bánh rồi cuộn tròn thon dài (hoặc gập đôi nếu làm bánh cuốn Thanh Trì chay truyền thống). Xếp bánh lên đĩa, dùng cọ quét lớp dầu mỡ hành bóng bẩy rồi rắc hành khô phi vàng giòn lên trên.", "timerSeconds": null, "tip": "Thao tác cuộn nhanh tay khi bánh còn ấm để bánh mướt không dính bết.", "orderIndex": 3},
            {"stepNumber": 5, "title": "Pha nước chấm ấm và thưởng thức", "instruction": "Hòa 1 phần nước mắm ngon với 1 phần đường, 1 phần giấm nếp và 4 phần nước ấm ấm, khuấy tan đều vị ngọt dịu thanh mát. Thả vài lát ớt tươi, hạt tiêu. Ăn kèm đĩa bánh cuốn nóng cùng chả quế bùi ngậy và rau húng láng.", "timerSeconds": 180, "tip": "Nước mắm bánh cuốn Hà Nội luôn phải dùng ấm nóng mới chuẩn vị.", "orderIndex": 4}
        ],
        "imageCaptions": [
            "Đĩa bánh cuốn Thanh Trì mướt bóng rắc ngập hành phi vàng rụm giòn tan",
            "Thao tác tráng bánh cuốn mỏng như cánh ve trên mặt vải nồi hơi nghi ngút khói",
            "Đĩa chả quế nướng vàng ươm thái vát bên cạnh bát nước mắm ấm hoa ớt",
            "Bánh cuốn nóng hổi chấm đẫm bát nước mắm chua ngọt thơm lừng thảo mộc"
        ]
    },
    {
        "title": "Vịt om sấu chua thanh thơm béo nước dừa Hà Nội",
        "slug": "vit-om-sau-chua-thanh-ha-noi",
        "description": "Món canh om kinh điển của mùa hè đất Bắc kết hợp vị thịt vịt béo mềm thơm lừng cùng vị chua thanh tao độc đáo của quả sấu tươi, nước dừa ngọt dịu và khoai sọ bở tơi ngậy ngậy.",
        "categorySlug": "am-thuc-mien-bac",
        "difficulty": "Medium",
        "prepTimeMinutes": 30,
        "cookTimeMinutes": 35,
        "servings": 4,
        "calories": 540,
        "protein": 32.0,
        "fat": 28.5,
        "carbs": 24.0,
        "fiber": 3.8,
        "sodium": 880.0,
        "ingredients": [
            {"name": "Thịt vịt cỏ hoặc vịt bầu làm sạch", "amount": 1200.0, "unit": "g", "notes": "Chặt miếng vừa ăn, chọn vịt chắc thịt ít mỡ", "orderIndex": 0},
            {"name": "Quả sấu tươi Hà Nội", "amount": 8.0, "unit": "quả", "notes": "Cạo sạch vỏ ngoài ngâm nước muối", "orderIndex": 1},
            {"name": "Khoai sọ củ nhỏ", "amount": 350.0, "unit": "g", "notes": "Gọt vỏ luộc sơ bổ đôi", "orderIndex": 2},
            {"name": "Nước dừa tươi xiêm", "amount": 500.0, "unit": "ml", "notes": "Tạo vị ngọt thanh tự nhiên cho nước om", "orderIndex": 3},
            {"name": "Gừng tươi già", "amount": 40.0, "unit": "g", "notes": "Giã nát xát vịt và ướp", "orderIndex": 4},
            {"name": "Sả tươi đập dập", "amount": 3.0, "unit": "nhánh", "notes": "Cắt khúc ngắn", "orderIndex": 5},
            {"name": "Hành tím & tỏi băm", "amount": 30.0, "unit": "g", "notes": "Phi thơm", "orderIndex": 6},
            {"name": "Rau ngò gai (mùi tàu) & ngổ điếc", "amount": 50.0, "unit": "g", "notes": "Rửa sạch cắt nhỏ tạo hương đặc trưng", "orderIndex": 7},
            {"name": "Rượu trắng", "amount": 3.0, "unit": "muỗng canh", "notes": "Khử mùi gây của vịt", "orderIndex": 8},
            {"name": "Nước mắm truyền thống ngon", "amount": 2.5, "unit": "muỗng canh", "notes": "Gia vị nêm nếm chính", "orderIndex": 9},
            {"name": "Hạt nêm và tiêu sọ xay", "amount": 1.5, "unit": "muỗng canh", "notes": "Ướp thịt vịt", "orderIndex": 10},
            {"name": "Ớt sừng chỉ thiên", "amount": 2.0, "unit": "trái", "notes": "Thái lát cay nhẹ", "orderIndex": 11}
        ],
        "instructions": [
            {"stepNumber": 1, "title": "Khử mùi tanh và chặt vịt", "instruction": "Chà xát thịt vịt thật kỹ với muối hạt, gừng giã nát và rượu trắng trong 5 phút rồi rửa sạch, thấm ráo nước. Chặt vịt thành từng miếng vuông quân cờ vừa ăn.", "timerSeconds": 300, "tip": "Cắt bỏ hẳn phần phao câu để nước om tuyệt đối thơm tho không tanh.", "orderIndex": 0},
            {"stepNumber": 2, "title": "Ướp thịt vịt thấm vị", "instruction": "Ướp vịt với hành tỏi băm, gừng băm, 2 muỗng nước mắm ngon, 1 muỗng hạt nêm, tiêu xay và sả đập dập trong 25 phút.", "timerSeconds": 1500, "tip": "Thịt vịt ướp kỹ xào săn sẽ giữ được độ dai ngọt không bị bã.", "orderIndex": 1},
            {"stepNumber": 3, "title": "Xào săn thịt vịt", "instruction": "Bắc nồi đáy dày lên bếp cho chút dầu ăn, phi thơm hành tỏi sả rồi trút thịt vịt vào xào trên lửa lớn trong 8-10 phút cho miếng vịt săn chắc và ra bớt mỡ.", "timerSeconds": 600, "tip": "Có thể chắt bớt váng mỡ vịt tiết ra nếu không thích quá béo.", "orderIndex": 2},
            {"stepNumber": 4, "title": "Om vịt cùng sấu tươi và nước dừa", "instruction": "Đổ nước dừa tươi và thêm nước lọc cho ngập mặt thịt vịt, thả sấu tươi cạo vỏ vào đun sôi bùng, vớt bọt sạch rồi hạ lửa liu riu om trong 20 phút.", "timerSeconds": 1200, "tip": "Vớt bọt thường xuyên để nước canh sấu có độ trong veo óng ánh.", "orderIndex": 3},
            {"stepNumber": 5, "title": "Thêm khoai sọ và dầm sấu", "instruction": "Cho khoai sọ vào om tiếp 12 phút đến khi khoai bở mềm. Dùng muôi vớt các quả sấu ra bát dầm nát, lọc bỏ hạt rồi trút nước cốt sấu chua trở lại nồi, khuấy đều nếm vừa vặn chua thanh. Rắc mùi tàu, ngổ điếc và ớt lát rồi tắt bếp.", "timerSeconds": 720, "tip": "Dầm sấu từng chút một để kiểm soát độ chua thanh vừa khẩu vị gia đình.", "orderIndex": 4}
        ],
        "imageCaptions": [
            "Tô vịt om sấu nước canh trong veo thơm nồng ngổ điếc khoai sọ bở tơi",
            "Thịt vịt cỏ ướp gừng sả xào săn óng mỡ bên các quả sấu xanh mướt",
            "Thao tác dầm nát quả sấu chín mềm lấy nước cốt chua thanh tao",
            "Nồi lẩu vịt om sấu sôi sùng sục ăn kèm bún tươi và rau muống giòn"
        ]
    },
    {
        "title": "Cá chép om dưa chua tóp mỡ thì là hành hoa",
        "slug": "ca-chep-om-dua-chua-top-mo",
        "description": "Món ngon đậm vị đồng bằng Bắc Bộ với thịt cá chép ngọt thơm om nhừ cùng dưa cải chua giòn, cà chua đỏ mọng, tóp mỡ béo bùi giòn rụm và ngập tràn hương thơm thì là, hành hoa.",
        "categorySlug": "am-thuc-mien-bac",
        "difficulty": "Medium",
        "prepTimeMinutes": 30,
        "cookTimeMinutes": 30,
        "servings": 4,
        "calories": 460,
        "protein": 36.0,
        "fat": 22.0,
        "carbs": 18.0,
        "fiber": 3.0,
        "sodium": 890.0,
        "ingredients": [
            {"name": "Cá chép sông tươi sống", "amount": 1000.0, "unit": "g", "notes": "Cá chép giòn hoặc cá chép sông vảy bóng thịt chắc", "orderIndex": 0},
            {"name": "Dưa cải muối chua", "amount": 350.0, "unit": "g", "notes": "Dưa chua vàng giòn, giữ lại nửa bát nước dưa", "orderIndex": 1},
            {"name": "Mỡ heo khổ làm tóp mỡ", "amount": 200.0, "unit": "g", "notes": "Thái hạt lựu rán vàng giòn rụm", "orderIndex": 2},
            {"name": "Cà chua chín đỏ", "amount": 3.0, "unit": "trái", "notes": "Bổ múi cau", "orderIndex": 3},
            {"name": "Thì là tươi", "amount": 150.0, "unit": "g", "notes": "Cắt khúc dài ngón tay", "orderIndex": 4},
            {"name": "Hành lá chẻ gốc củ", "amount": 150.0, "unit": "g", "notes": "Cắt khúc tương tự thì là", "orderIndex": 5},
            {"name": "Hành tím củ băm nhỏ", "amount": 30.0, "unit": "g", "notes": "Phi thơm", "orderIndex": 6},
            {"name": "Gừng tươi đập dập", "amount": 25.0, "unit": "g", "notes": "Khử tanh cá", "orderIndex": 7},
            {"name": "Nghệ tươi giã vắt nước cốt", "amount": 1.5, "unit": "muỗng canh", "notes": "Tạo màu vàng ánh hấp dẫn", "orderIndex": 8},
            {"name": "Nước mắm ngon cốt nhỉ", "amount": 2.5, "unit": "muỗng canh", "notes": "Nêm nước om đậm đà", "orderIndex": 9},
            {"name": "Ớt sừng cay", "amount": 2.0, "unit": "trái", "notes": "Cắt lát mỏng", "orderIndex": 10},
            {"name": "Bún tươi ăn kèm", "amount": 500.0, "unit": "g", "notes": "Chan nước om dưa nóng", "orderIndex": 11}
        ],
        "instructions": [
            {"stepNumber": 1, "title": "Sơ chế cá và rán tóp mỡ", "instruction": "Mỡ heo thắng lửa vừa lấy mỡ nước và tóp mỡ vàng giòn vớt ra để riêng. Cá chép đánh vảy, mổ ruột rửa sạch gừng muối, khứa xéo thân cá rồi ướp chút hạt nêm, nước cốt nghệ trong 15 phút.", "timerSeconds": 900, "tip": "Thoa chút nước nghệ lên da cá khi rán sẽ có màu vàng mật ong cực đẹp.", "orderIndex": 0},
            {"stepNumber": 2, "title": "Rán sơ cá chép", "instruction": "Cho mỡ nước vào chảo đun nóng già, thả cá chép vào rán sơ 2 mặt khoảng 4 phút mỗi mặt cho da cá săn chắc và vàng xém, không rán chín kỹ.", "timerSeconds": 480, "tip": "Rán săn da cá giúp khi om cá không bị nát và khử sạch mùi tanh.", "orderIndex": 1},
            {"stepNumber": 3, "title": "Xào dưa chua và cà chua", "instruction": "Dùng nồi om rộng, phi thơm hành tím với 1 muỗng mỡ heo, cho cà chua vào xào mềm tạo màu, tiếp tục trút dưa chua vào xào săn với 1 muỗng nước mắm trong 5 phút.", "timerSeconds": 300, "tip": "Xào dưa kỹ giúp dưa ngấm mỡ bóng mượt và nhả vị chua thanh.", "orderIndex": 2},
            {"stepNumber": 4, "title": "Om cá cùng dưa chua", "instruction": "Châm nước sôi và nước dưa chua vào nồi dưa ngập xâm xấp, đun sôi rồi nhẹ nhàng đặt cá chép đã rán vào. Đậy vung om lửa nhỏ trong 20 phút cho thịt cá thấm đậm vị dưa chua dịu.", "timerSeconds": 1200, "tip": "Dùng nước sôi để nước om không bị tanh và đục.", "orderIndex": 3},
            {"stepNumber": 5, "title": "Thêm tóp mỡ, hành thì là và hoàn thiện", "instruction": "Mở nắp, rải đều tóp mỡ giòn, ớt lát quanh thân cá. Phủ kín mặt cá bằng hành lá và thì là cắt khúc, đun thêm 2 phút cho rau vừa chín tái tỏa hương thơm ngát thì tắt bếp dọn lên bàn lẩu.", "timerSeconds": 120, "tip": "Ăn nóng kèm bún tươi chan nước dưa chua thanh béo ngậy tóp mỡ.", "orderIndex": 4}
        ],
        "imageCaptions": [
            "Chảo cá chép om dưa chua vàng óng phủ kín thì là hành hoa tóp mỡ",
            "Cá chép sông nguyên con rán se da vàng ươm chuẩn bị cho vào nồi dưa",
            "Đĩa tóp mỡ heo rán vàng giòn rụm bên cạnh dưa cải muối chua giòn",
            "Nồi lẩu cá chép om dưa sôi ùng ục khói bay nghi ngút ấm lòng ngày lạnh"
        ]
    },

    # ==========================================
    # CATEGORY 21: ẨM THỰC MIỀN TRUNG (am-thuc-mien-trung) - 4 recipes
    # ==========================================
    {
        "title": "Bánh bèo chén tôm cháy mỡ hành tóp mỡ xứ Huế",
        "slug": "banh-beo-chen-tom-chay-hue",
        "description": "Món bánh cung đình Huế dân dã mà thanh tao với từng chén bánh bèo mỏng tang xoáy sâu chính giữa, phủ đầy tôm cháy đỏ hồng thơm lừng, tóp mỡ giòn tan, mỡ hành óng mượt và nước mắm ngọt cay xé lưỡi.",
        "categorySlug": "am-thuc-mien-trung",
        "difficulty": "Medium",
        "prepTimeMinutes": 40,
        "cookTimeMinutes": 20,
        "servings": 4,
        "calories": 360,
        "protein": 16.5,
        "fat": 11.0,
        "carbs": 48.0,
        "fiber": 1.5,
        "sodium": 790.0,
        "ingredients": [
            {"name": "Bột gạo tẻ ngon", "amount": 200.0, "unit": "g", "notes": "Bột gạo xay ướt hoặc mịn", "orderIndex": 0},
            {"name": "Bột năng tinh khiết", "amount": 40.0, "unit": "g", "notes": "Tạo độ dai dẻo không bở", "orderIndex": 1},
            {"name": "Nước lọc lạnh", "amount": 300.0, "unit": "ml", "notes": "Hòa tan bột ban đầu", "orderIndex": 2},
            {"name": "Nước sôi sùng sục", "amount": 250.0, "unit": "ml", "notes": "Lấy trùng bột tạo xoáy bánh bèo", "orderIndex": 3},
            {"name": "Tôm đất tươi (hoặc tôm sú)", "amount": 300.0, "unit": "g", "notes": "Luộc chín bóc vỏ giã nhuyễn làm tôm cháy", "orderIndex": 4},
            {"name": "Da heo chiên giòn hoặc bánh mì chiên (tóp mỡ)", "amount": 60.0, "unit": "g", "notes": "Giòn rụm thơm bùi", "orderIndex": 5},
            {"name": "Hành lá tươi", "amount": 60.0, "unit": "g", "notes": "Cắt nhỏ làm mỡ hành", "orderIndex": 6},
            {"name": "Dầu ăn thực vật", "amount": 4.0, "unit": "muỗng canh", "notes": "Nấu mỡ hành và thoa chén", "orderIndex": 7},
            {"name": "Nước mắm ngon cốt cá cơm", "amount": 3.0, "unit": "muỗng canh", "notes": "Pha nước mắm chan ngọt nhẹ", "orderIndex": 8},
            {"name": "Đường cát trắng", "amount": 2.5, "unit": "muỗng canh", "notes": "Nấu nước mắm chan", "orderIndex": 9},
            {"name": "Nước luộc tôm", "amount": 150.0, "unit": "ml", "notes": "Pha vào nước mắm tạo vị ngọt tự nhiên", "orderIndex": 10},
            {"name": "Ớt chỉ thiên xanh đỏ Huế", "amount": 4.0, "unit": "trái", "notes": "Cắt khoanh mỏng thả vào bát nước mắm", "orderIndex": 11}
        ],
        "instructions": [
            {"stepNumber": 1, "title": "Pha bột lấy trùng tạo xoáy sâu", "instruction": "Khuấy tan bột gạo, bột năng, 1/2 muỗng muối trong nước lạnh. Sau đó rót từ từ 250ml nước sôi vào vừa rót vừa khuấy nhanh tay để bột lấy trùng nhẹ. Để bột nghỉ 30 phút.", "timerSeconds": 1800, "tip": "Tỷ lệ nước sôi chuẩn giúp bánh khi hấp tạo thành lỗ xoáy đồng tiền sâu ở giữa.", "orderIndex": 0},
            {"stepNumber": 2, "title": "Làm tôm cháy đỏ hồng", "instruction": "Tôm đất luộc chín với chút muối (giữ lại nước luộc), bóc vỏ giã tơi sợi. Cho tôm giã vào chảo sao lửa nhỏ cùng 1/2 muỗng dầu màu điều, chút tiêu và nước mắm đến khi tôm khô tơi xốp, màu đỏ cam bắt mắt.", "timerSeconds": 600, "tip": "Sao tôm lửa nhỏ và đảo liên tục để tôm bông xốp không bị cháy khét.", "orderIndex": 1},
            {"stepNumber": 3, "title": "Hấp chén bánh bèo", "instruction": "Xếp các chén sành nhỏ vào xửng hấp đun nước thật sôi, quét lớp dầu ăn mỏng vào lòng chén làm nóng 2 phút. Khuấy đều thau bột, múc bột đổ vào 1/3 chén, đậy nắp hấp lửa lớn 7-8 phút đến khi bột đông trắng đục có xoáy sâu.", "timerSeconds": 480, "tip": "Chén phải thật nóng trước khi đổ bột thì bánh mới xoáy đẹp.", "orderIndex": 2},
            {"stepNumber": 4, "title": "Làm mỡ hành và nước mắm tôm", "instruction": "Đun sôi dầu ăn rót vào bát hành lá xắt nhỏ đảo đều giữ màu xanh non. Nấu sôi nước luộc tôm cùng đường và nước mắm ngon, để nguội nếm vị mặn ngọt thanh nhẹ, thả ớt xắt khoanh vào.", "timerSeconds": 240, "tip": "Nước mắm bánh bèo Huế không dùng tỏi và chanh, chỉ có mắm tôm đường và ớt cay xé.", "orderIndex": 3},
            {"stepNumber": 5, "title": "Bày chén và thưởng thức", "instruction": "Lấy chén bánh bèo ra, phết chút mỡ hành lên mặt xoáy, rắc muỗng tôm cháy đỏ au, rải vài hạt tóp mỡ giòn rụm. Khi ăn chan một muỗng nước mắm ớt cay vào chén rồi dùng thìa tre dẹp xúc trọn miếng bánh.", "timerSeconds": null, "tip": "Bánh bèo ăn nóng vừa ra lò là thơm ngon chuẩn vị cố đô nhất.", "orderIndex": 4}
        ],
        "imageCaptions": [
            "Mâm chén bánh bèo chén Huế phủ tôm cháy đỏ au tóp mỡ giòn rụm",
            "Chén bánh bèo trắng trong hấp chín xoáy sâu đồng tiền duyên dáng",
            "Chảo sao tôm đất giã nhuyễn tơi xốp thơm nức mũi màu cam tự nhiên",
            "Thao tác chan nước mắm ớt cay xé lưỡi vào từng chén bánh bèo nhỏ"
        ]
    },
    {
        "title": "Bánh bột lọc nhân tôm thịt trong suốt giòn dai",
        "slug": "banh-bot-loc-nhan-tom-thit-hue",
        "description": "Món bánh lọc trứ danh xứ cố đô với lớp vỏ bột lọc trong vắt nhìn thấu con tôm đất đỏ au và miếng thịt ba chỉ kho mặn ngọt đậm đà, chấm cùng nước mắm ớt xanh cay xé đặc trưng.",
        "categorySlug": "am-thuc-mien-trung",
        "difficulty": "Hard",
        "prepTimeMinutes": 50,
        "cookTimeMinutes": 25,
        "servings": 6,
        "calories": 340,
        "protein": 14.0,
        "fat": 10.0,
        "carbs": 46.0,
        "fiber": 1.1,
        "sodium": 750.0,
        "ingredients": [
            {"name": "Bột năng thượng hạng", "amount": 350.0, "unit": "g", "notes": "Bột mịn không pha tạp", "orderIndex": 0},
            {"name": "Nước sôi 100°C", "amount": 220.0, "unit": "ml", "notes": "Lấy trùng nhồi bột dẻo mịn", "orderIndex": 1},
            {"name": "Tôm sông hoặc tôm đất tươi", "amount": 250.0, "unit": "g", "notes": "Cắt bỏ đầu đuôi nhọn giữ nguyên vỏ giòn", "orderIndex": 2},
            {"name": "Thịt ba chỉ heo", "amount": 200.0, "unit": "g", "notes": "Thái con chì nhỏ vừa ăn", "orderIndex": 3},
            {"name": "Dầu màu điều", "amount": 2.0, "unit": "muỗng canh", "notes": "Tạo màu đỏ cam bóng đẹp cho nhân", "orderIndex": 4},
            {"name": "Nước mắm ngon truyền thống", "amount": 3.0, "unit": "muỗng canh", "notes": "Rim nhân thịt tôm", "orderIndex": 5},
            {"name": "Đường cát vàng", "amount": 2.0, "unit": "muỗng canh", "notes": "Tạo vị mặn ngọt đậm đà", "orderIndex": 6},
            {"name": "Tiêu đen xay nhuyễn", "amount": 1.0, "unit": "muỗng cà phê", "notes": "Thơm cay nồng", "orderIndex": 7},
            {"name": "Hành lá xắt nhỏ làm mỡ hành", "amount": 40.0, "unit": "g", "notes": "Trộn bánh sau khi luộc", "orderIndex": 8},
            {"name": "Lá chuối tươi (nếu gói bánh lọc lá)", "amount": 500.0, "unit": "g", "notes": "Chần nước sôi lau sạch", "orderIndex": 9},
            {"name": "Ớt xiêm xanh cay nồng", "amount": 5.0, "unit": "trái", "notes": "Dầm nát trong nước mắm cốt", "orderIndex": 10}
        ],
        "instructions": [
            {"stepNumber": 1, "title": "Rim nhân tôm thịt đậm đà", "instruction": "Phi thơm dầu màu điều với tỏi băm, cho thịt ba chỉ vào xào săn chảy mỡ. Tiếp tục cho tôm vào đảo đều, nêm nước mắm, đường, tiêu rim lửa nhỏ 15 phút cho ngấm sâu đến khi nhân săn chắc, bóng bẩy và cạn nước.", "timerSeconds": 900, "tip": "Để nguyên vỏ tôm đất rim sẽ dai giòn và giữ dáng tôm nguyên vẹn.", "orderIndex": 0},
            {"stepNumber": 2, "title": "Lấy trùng và nhồi bột lọc", "instruction": "Cho 300g bột năng vào âu tạo giếng giữa. Rót từ từ 220ml nước sôi sùng sục vào tâm, dùng muỗng gỗ khuấy nhanh tay. Khi bột nguội bớt, cho nốt 50g bột khô còn lại vào nhồi tay liên tục 10 phút đến khi khối bột dẻo mịn không dính tay.", "timerSeconds": 600, "tip": "Nước phải thật sôi 100°C mới làm chín nửa bột tạo độ dẻo đàn hồi.", "orderIndex": 1},
            {"stepNumber": 3, "title": "Bắt bánh tạo hình", "instruction": "Ngắt viên bột nhỏ cỡ quả quất, vo tròn ấn dẹt mỏng mép. Đặt 1 con tôm và 1 miếng thịt vào giữa, gấp đôi mép bột lại rồi dùng ngón tay miết chặt viền tạo hình bán nguyệt hình tai bèo.", "timerSeconds": null, "tip": "Miết kín mép viền để khi luộc nước không lọt vào trong nhân.", "orderIndex": 2},
            {"stepNumber": 4, "title": "Luộc bánh bột lọc trong suốt", "instruction": "Đun sôi nồi nước lớn với 1 muỗng dầu ăn. Thả từng mẻ bánh vào luộc lửa vừa. Khi bánh nổi lên mặt nước và lớp vỏ chuyển từ trắng đục sang trong suốt hoàn toàn, luộc thêm 2 phút rồi vớt ra thau nước đá lạnh 1 phút cho giòn.", "timerSeconds": 360, "tip": "Sốc nước đá lạnh giúp vỏ bánh săn giòn sần sật không bị dính nát.", "orderIndex": 3},
            {"stepNumber": 5, "title": "Thoa mỡ hành và dọn mắm ớt", "instruction": "Vớt bánh ra đĩa, rưới đều mỡ hành bóng mướt chống dính. Rót nước mắm nguyên chất thơm ngon ra chén, dầm nát vài trái ớt xiêm xanh cay nồng chấm cùng bánh bột lọc dẻo dai bùi béo.", "timerSeconds": null, "tip": "Nước mắm chấm bánh lọc Huế chỉ dùng mắm cốt nguyên chất và ớt dầm.", "orderIndex": 4}
        ],
        "imageCaptions": [
            "Đĩa bánh bột lọc trong suốt lấp lánh lộ rõ tôm thịt đỏ au mỡ hành bóng mượt",
            "Chảo rim nhân tôm đất thịt ba chỉ màu cánh gián óng ả đậm đà",
            "Thao tác nhồi khối bột lọc trắng ngà dẻo mịn không dính tay",
            "Bánh bột lọc chấm ngập chén nước mắm ớt xiêm xanh cay nồng xé lưỡi"
        ]
    },
    {
        "title": "Ram bắp Hội An giòn tan cuốn rau sống bánh tráng",
        "slug": "ram-bap-hoi-an-gion-tan",
        "description": "Món ăn đường phố quyến rũ của phố cổ Hội An với những cuốn ram bắp vàng ươm giòn rụm bên ngoài, nhân bắp nếp non ngọt lịm thơm bùi bên trong, cuốn cùng bánh tráng mè, rau sống Trà Quế và chấm nước mắm chua ngọt.",
        "categorySlug": "am-thuc-mien-trung",
        "difficulty": "Easy",
        "prepTimeMinutes": 25,
        "cookTimeMinutes": 20,
        "servings": 4,
        "calories": 320,
        "protein": 7.5,
        "fat": 14.0,
        "carbs": 42.0,
        "fiber": 3.6,
        "sodium": 540.0,
        "ingredients": [
            {"name": "Bắp nếp non sữa tươi", "amount": 4.0, "unit": "trái", "notes": "Bào mỏng rồi giã dập lấy sữa ngọt", "orderIndex": 0},
            {"name": "Bánh tráng bò bía đậu xanh (hoặc bánh tráng lề)", "amount": 25.0, "unit": "lá", "notes": "Lá mỏng mềm dai chiên cực giòn", "orderIndex": 1},
            {"name": "Hành tím củ thơm", "amount": 40.0, "unit": "g", "notes": "Băm nhuyễn tạo mùi đặc trưng", "orderIndex": 2},
            {"name": "Hành lá tươi", "amount": 40.0, "unit": "g", "notes": "Thái nhuyễn", "orderIndex": 3},
            {"name": "Tiêu đen xay thô", "amount": 1.5, "unit": "muỗng cà phê", "notes": "Cay nồng ấm bụng", "orderIndex": 4},
            {"name": "Hạt nêm và muối", "amount": 1.0, "unit": "muỗng cà phê", "notes": "Nêm vừa vị thanh ngọt", "orderIndex": 5},
            {"name": "Dầu ăn thực vật để chiên", "amount": 300.0, "unit": "ml", "notes": "Chiên ngập dầu", "orderIndex": 6},
            {"name": "Rau sống làng Trà Quế (húng lủi, tía tô, xà lách, diếp cá)", "amount": 200.0, "unit": "g", "notes": "Rửa sạch để ráo", "orderIndex": 7},
            {"name": "Bánh tráng lề Đại Lộc cuốn kèm", "amount": 1.0, "unit": "xấp", "notes": "Nhúng sơ nước", "orderIndex": 8},
            {"name": "Nước mắm chua ngọt Hội An (mắm, đường, tỏi ớt, chanh)", "amount": 1.0, "unit": "bát", "notes": "Vị chua ngọt đậm đà tỏi ớt nổi mặt", "orderIndex": 9}
        ],
        "instructions": [
            {"stepNumber": 1, "title": "Bào bắp và trộn nhân ram", "instruction": "Bắp nếp lột vỏ bỏ râu, dùng dao sắc bào mỏng hạt bắp theo chiều dọc rồi cho vào cối giã sơ cho các hạt bắp dập nhuyễn tươm sữa. Trộn bắp với hành tím băm, hành lá, tiêu xay, chút muối và hạt nêm.", "timerSeconds": 600, "tip": "Chọn bắp nếp non bấm tay chảy sữa, không dùng bắp già hạt cứng xơ.", "orderIndex": 0},
            {"stepNumber": 2, "title": "Cuốn ram bắp thon nhỏ", "instruction": "Trải bánh tráng lên mặt thớt phẳng. Múc 1 muỗng cà phê nhân bắp đặt vào mép bánh, gấp hai bên mép lại rồi cuộn tròn chặt tay thành cuốn ram nhỏ thon dài cỡ ngón tay trỏ.", "timerSeconds": null, "tip": "Cuốn ram vừa tay không quá lỏng cũng không quá chặt để khi chiên bắp chín nở không vỡ vỏ.", "orderIndex": 1},
            {"stepNumber": 3, "title": "Chiên ram bắp vàng giòn rụm", "instruction": "Đun nóng chảo dầu ăn ngập 1/2 cuốn ram, thử đầu đũa sủi tăm. Hạ lửa vừa, thả từng cuốn ram vào chiên. Lật đều tay khoảng 6-8 phút đến khi cuốn ram chuyển màu vàng ruộm óng ả và vỏ giòn tan.", "timerSeconds": 480, "tip": "Vắt vài giọt chanh vào dầu trước khi chiên giúp ram giữ độ giòn lâu gấp đôi.", "orderIndex": 2},
            {"stepNumber": 4, "title": "Vớt ram thấm ráo dầu", "instruction": "Gắp ram bắp ra rổ nhôm hoặc đĩa lót giấy thấm dầu dựng đứng cuốn ram cho ráo kiệt dầu thừa.", "timerSeconds": 180, "tip": "Dựng đứng cuốn ram giúp vỏ giòn ráo tuyệt đối không ngấy ngán.", "orderIndex": 3},
            {"stepNumber": 5, "title": "Bày mâm cuốn và thưởng thức", "instruction": "Bày ram bắp nóng hổi lên mẹt tre cùng rổ rau sống Trà Quế và xấp bánh tráng mỏng Đại Lộc. Đặt ram bắp vào bánh tráng, thêm rau thơm cuộn tròn chấm ngập chén nước mắm chua ngọt tỏi ớt cay xè.", "timerSeconds": null, "tip": "Ăn ngay khi ram bắp vừa chiên xong để nghe tiếng giòn rụm tan trong miệng.", "orderIndex": 4}
        ],
        "imageCaptions": [
            "Đĩa ram bắp Hội An vàng ruộm giòn tan bày cùng rổ rau sống tươi non",
            "Thao tác bào mỏng bắp nếp sữa tươi ngọt lịm giã dập trộn tiêu nồng",
            "Từng cuốn ram bắp nhỏ nhắn chiên sôi sùng sục trong chảo dầu vàng óng",
            "Cuốn bánh tráng gói trọn ram bắp giòn rụm chấm nước mắm ớt Hội An"
        ]
    },
    {
        "title": "Nem lụi nướng sả Huế chấm nước lèo béo bùi",
        "slug": "nem-lui-nuong-sa-hue-nuoc-leo",
        "description": "Đặc sản kinh kỳ với những xiên nem quấn quanh củ sả tươi thơm nức mũi, nướng than hoa vàng xém cạnh mọng nước, ăn kèm rau sống, bánh tráng và chén nước lèo gan đậu phộng sánh béo thần thánh.",
        "categorySlug": "am-thuc-mien-trung",
        "difficulty": "Medium",
        "prepTimeMinutes": 45,
        "cookTimeMinutes": 25,
        "servings": 4,
        "calories": 490,
        "protein": 28.0,
        "fat": 24.5,
        "carbs": 38.0,
        "fiber": 3.0,
        "sodium": 840.0,
        "ingredients": [
            {"name": "Giò sống dẻo quánh", "amount": 300.0, "unit": "g", "notes": "Tạo độ kết dính đàn hồi giòn dai", "orderIndex": 0},
            {"name": "Thịt nạc vai heo xay mịn", "amount": 250.0, "unit": "g", "notes": "Cân bằng độ mềm ngọt", "orderIndex": 1},
            {"name": "Mỡ heo hạt lựu luộc sơ", "amount": 80.0, "unit": "g", "notes": "Ướp đường phơi trong giúp nem mọng nước", "orderIndex": 2},
            {"name": "Cây sả tươi mập mạp", "amount": 12.0, "unit": "cây", "notes": "Cắt bớt ngọn làm xiên nem", "orderIndex": 3},
            {"name": "Gan heo tươi làm nước lèo", "amount": 100.0, "unit": "g", "notes": "Ngâm sữa tươi xay nhuyễn", "orderIndex": 4},
            {"name": "Đậu phộng rang bóc vỏ", "amount": 80.0, "unit": "g", "notes": "Xay nhuyễn làm sánh nước lèo", "orderIndex": 5},
            {"name": "Tương bần hoặc tương đậu nành xay", "amount": 2.0, "unit": "muỗng canh", "notes": "Tạo vị bùi mặn đặc trưng nước lèo Huế", "orderIndex": 6},
            {"name": "Hành tím & tỏi băm thơm", "amount": 40.0, "unit": "g", "notes": "Ướp nem và nấu sốt", "orderIndex": 7},
            {"name": "Nước mắm ngon cốt cá cơm", "amount": 2.0, "unit": "muỗng canh", "notes": "Nêm gia vị", "orderIndex": 8},
            {"name": "Bánh tráng nem cuốn kèm", "amount": 1.0, "unit": "xấp", "notes": "Bánh tráng dẻo mỏng", "orderIndex": 9},
            {"name": "Rau sống, chuối chát, khế chua, dưa leo", "amount": 250.0, "unit": "g", "notes": "Rửa sạch thái lát mỏng cuốn kèm", "orderIndex": 10}
        ],
        "instructions": [
            {"stepNumber": 1, "title": "Quết thịt làm nem dẻo dai", "instruction": "Trộn giò sống, thịt nạc xay, mỡ hạt lựu trong âu lớn. Thêm hành tỏi băm, 1.5 muỗng nước mắm, tiêu sọ đập dập, 1 thìa đường. Dùng muôi gỗ quết thật mạnh tay 10-15 phút đến khi hỗn hợp dẻo quánh đồng nhất.", "timerSeconds": 900, "tip": "Quết càng kỹ thì nem lụi nướng xong càng giòn dai không bị bở vụn.", "orderIndex": 0},
            {"stepNumber": 2, "title": "Bọc nem vào cây sả", "instruction": "Thoa lớp dầu ăn mỏng vào lòng bàn tay. Múc một phần thịt cỡ quả trứng gà bọc kín quanh phần gốc cây sả, vuốt thuôn dài đều đặn khoảng 8cm.", "timerSeconds": null, "tip": "Để xiên nem trong ngăn mát tủ lạnh 30 phút cho se mặt trước khi nướng.", "orderIndex": 1},
            {"stepNumber": 3, "title": "Nấu nước lèo chấm nem lụi", "instruction": "Phi thơm tỏi hành, cho gan heo xay vào xào chín săn. Đổ tương xay, đậu phộng rang xay mịn, chút nước lọc, đường và nước mắm đun sôi liu riu 10 phút đến khi nước lèo sánh sệt, ngậy bùi thơm nức mũi.", "timerSeconds": 600, "tip": "Nước lèo chuẩn vị Huế phải có độ sánh béo ngọt bùi từ gan và đậu phộng.", "orderIndex": 2},
            {"stepNumber": 4, "title": "Nướng nem lụi thơm lừng than hoa", "instruction": "Xếp các xiên nem lụi lên vỉ nướng trên than hoa đượm hồng. Lật trở đều tay liên tục khoảng 12-15 phút, quét thêm chút dầu màu điều cho nem vàng ruộm xém cạnh và dậy mùi thơm tinh dầu sả.", "timerSeconds": 900, "tip": "Không nướng lửa quá to làm cháy lớp ngoài mà bên trong chưa chín.", "orderIndex": 3},
            {"stepNumber": 5, "title": "Cuốn bánh tráng thưởng thức", "instruction": "Rút cây sả lấy phần nem lụi nóng hổi đặt lên bánh tráng, thêm lát khế chua, chuối chát, dưa leo và rau thơm cuộn chặt tay. Chấm ngập cuốn nem vào chén nước lèo ấm nóng rắc mè rang và thưởng thức.", "timerSeconds": null, "tip": "Vị chát của chuối và chua của khế hòa quyện vị béo ngậy của nước lèo tạo nên sự cân bằng hoàn hảo.", "orderIndex": 4}
        ],
        "imageCaptions": [
            "Mẹt nem lụi nướng sả vàng xém cạnh bóng bẩy bên bát nước lèo sánh béo",
            "Thao tác bọc giò sống thịt quết dẻo mịn quanh từng thân cây sả tươi",
            "Xiên nem nướng xèo xèo trên than hồng rực khói thơm nồng nàn góc phố",
            "Cuốn bánh tráng nem lụi rau sống chấm đẫm bát sốt tương gan đậu phộng"
        ]
    },

    # ==========================================
    # CATEGORY 22: ẨM THỰC MIỀN NAM (am-thuc-mien-nam) - 4 recipes
    # ==========================================
    {
        "title": "Bánh canh ghẹ nước dùng béo ngọt gạch ghẹ tươi",
        "slug": "banh-canh-ghe-nuoc-dung-beo-ngot",
        "description": "Tô bánh canh ghẹ miền Nam làm say đắm lòng người với từng sợi bánh canh bột gạo dai mềm, thịt ghẹ tươi xé miếng chắc ngọt, gạch ghẹ béo bùi và nước dùng sền sệt vàng óng sóng sánh thơm lừng.",
        "categorySlug": "am-thuc-mien-nam",
        "difficulty": "Medium",
        "prepTimeMinutes": 40,
        "cookTimeMinutes": 35,
        "servings": 4,
        "calories": 510,
        "protein": 34.0,
        "fat": 15.0,
        "carbs": 58.0,
        "fiber": 2.5,
        "sodium": 870.0,
        "ingredients": [
            {"name": "Ghẹ xanh tươi sống", "amount": 2.0, "unit": "con", "notes": "Khoảng 600g, hấp chín gỡ lấy thịt và gạch", "orderIndex": 0},
            {"name": "Sợi bánh canh bột gạo pha bột lọc", "amount": 500.0, "unit": "g", "notes": "Chần sơ nước sôi", "orderIndex": 1},
            {"name": "Xương ống heo hầm nước dùng", "amount": 500.0, "unit": "g", "notes": "Ninh lấy nước ngọt thanh", "orderIndex": 2},
            {"name": "Trứng cút luộc bóc vỏ", "amount": 8.0, "unit": "quả", "notes": "Thả vào nồi nước dùng", "orderIndex": 3},
            {"name": "Huyết heo luộc cắt miếng", "amount": 150.0, "unit": "g", "notes": "Mềm mướt bùi bùi", "orderIndex": 4},
            {"name": "Nấm rơm búp tươi", "amount": 150.0, "unit": "g", "notes": "Cắt chân chẻ đôi xào sơ", "orderIndex": 5},
            {"name": "Bột năng hòa nước", "amount": 3.0, "unit": "muỗng canh", "notes": "Tạo độ sánh sệt cho nước dùng", "orderIndex": 6},
            {"name": "Dầu màu điều", "amount": 2.0, "unit": "muỗng canh", "notes": "Xào gạch ghẹ lên màu vàng son", "orderIndex": 7},
            {"name": "Hành tím và tỏi phi thơm", "amount": 30.0, "unit": "g", "notes": "Tăng hương vị đậm đà", "orderIndex": 8},
            {"name": "Hành ngò xắt nhuyễn", "amount": 40.0, "unit": "g", "notes": "Rắc mặt tô", "orderIndex": 9},
            {"name": "Muối ớt xanh chấm thịt ghẹ", "amount": 1.0, "unit": "chén", "notes": "Vắt chanh cay nồng", "orderIndex": 10}
        ],
        "instructions": [
            {"stepNumber": 1, "title": "Ninh nước hầm xương và sơ chế ghẹ", "instruction": "Xương ống chần nước sôi rửa sạch, ninh cùng 2 lít nước và củ hành tím nướng trong 45 phút lấy nước ngọt trong veo. Ghẹ rửa sạch hấp chín cùng sả gừng trong 12 phút, gỡ riêng phần thịt ghẹ và phần gạch ghẹ.", "timerSeconds": 2700, "tip": "Giữ lại nước hấp ghẹ chắt vào nồi nước dùng để tăng vị ngọt hải sản.", "orderIndex": 0},
            {"stepNumber": 2, "title": "Xào thịt ghẹ và gạch ghẹ", "instruction": "Phi thơm hành tỏi với 2 muỗng dầu màu điều, trút gạch ghẹ vào xào trước cho dậy mùi thơm và lên màu cam đỏ rực rỡ. Cho thịt ghẹ vào đảo nhẹ tay nêm chút hạt nêm và tiêu xay.", "timerSeconds": 240, "tip": "Đảo nhẹ tay tránh làm nát vụn các thớ thịt càng ghẹ nguyên khối.", "orderIndex": 1},
            {"stepNumber": 3, "title": "Nấu nước dùng sánh sệt", "instruction": "Cho nấm rơm xào sơ, trứng cút, huyết heo vào nồi nước dùng xương heo đang sôi. Nêm nước mắm ngon, hạt nêm, đường phèn cho vừa miệng. Rót từ từ bát bột năng hòa nước vào khuấy đều tay đến khi nước dùng sánh mượt như lụa.", "timerSeconds": 360, "tip": "Độ sánh vừa phải phủ nhẹ lên sợi bánh canh khi chan.", "orderIndex": 2},
            {"stepNumber": 4, "title": "Thả sợi bánh canh", "instruction": "Thả sợi bánh canh bột gạo đã chần sơ vào nồi nước dùng đang sôi liu riu, đun khoảng 3-4 phút cho sợi bánh thấm đượm vị ngọt béo của nước dùng.", "timerSeconds": 240, "tip": "Nấu sợi bánh canh trực tiếp trong nước dùng giúp bột hòa quyện đậm vị hơn.", "orderIndex": 3},
            {"stepNumber": 5, "title": "Múc tô và thưởng thức", "instruction": "Múc sợi bánh canh và nước dùng sánh đặc ra tô lớn. Gắp thịt càng ghẹ, gạch ghẹ vàng son xếp lên trên, thêm trứng cút, miếng huyết, rắc hành ngò thái nhỏ, hành phi giòn và chút tiêu sọ xay. Ăn kèm đĩa muối tiêu chanh hoặc muối ớt xanh.", "timerSeconds": null, "tip": "Ăn ngay khi tô bánh canh còn bốc khói ngùn ngụt.", "orderIndex": 4}
        ],
        "imageCaptions": [
            "Tô bánh canh ghẹ nước súp sánh vàng óng ánh ngập tràn thịt ghẹ gạch ghẹ",
            "Ghẹ xanh tươi rói hấp chín gỡ từng thớ thịt càng trắng nõn chắc nịch",
            "Nồi nước dùng sánh sệt sôi nhẹ với nấm rơm trứng cút đỏ au màu điều",
            "Sợi bánh canh dai mềm ngập trong nước dùng thơm lừng béo ngậy hải sản"
        ]
    },
    {
        "title": "Cá lóc hấp bầu cuốn bánh tráng rau rừng mắm nêm",
        "slug": "ca-loc-hap-bau-cuon-banh-trang",
        "description": "Món ăn mộc mạc trứ danh đồng bằng sông Cửu Long, cá lóc đồng ngọt thịt nằm trọn trong lòng trái bầu non mọng nước, hấp cách thủy giữ nguyên vị ngọt thanh khiết, cuốn bánh tráng rau rừng chấm mắm nêm thơm nồng.",
        "categorySlug": "am-thuc-mien-nam",
        "difficulty": "Easy",
        "prepTimeMinutes": 30,
        "cookTimeMinutes": 25,
        "servings": 4,
        "calories": 380,
        "protein": 35.0,
        "fat": 12.0,
        "carbs": 32.0,
        "fiber": 3.8,
        "sodium": 780.0,
        "ingredients": [
            {"name": "Cá lóc đồng còn sống", "amount": 800.0, "unit": "g", "notes": "Thịt chắc ngọt không tanh, làm sạch nhớt", "orderIndex": 0},
            {"name": "Trái bầu non dài", "amount": 1.0, "unit": "trái", "notes": "Cỡ 1kg, khoét ruột tạo thuyền đựng cá", "orderIndex": 1},
            {"name": "Hành lá chẻ sợi dài", "amount": 80.0, "unit": "g", "notes": "Phủ lên thân cá khi hấp", "orderIndex": 2},
            {"name": "Nấm mèo (mộc nhĩ) ngâm nở", "amount": 30.0, "unit": "g", "notes": "Thái sợi giòn sần sật", "orderIndex": 3},
            {"name": "Bún tàu (miến dong) ngâm mềm", "amount": 40.0, "unit": "g", "notes": "Cắt khúc ngắn lót thân cá", "orderIndex": 4},
            {"name": "Hành tím & tỏi băm nhuyễn", "amount": 30.0, "unit": "g", "notes": "Ướp cá", "orderIndex": 5},
            {"name": "Đậu phộng rang vàng giã dập", "amount": 50.0, "unit": "g", "notes": "Rắc mặt cá sau khi hấp", "orderIndex": 6},
            {"name": "Mắm nêm pha sẵn thơm ngon", "amount": 1.0, "unit": "bát", "notes": "Pha cùng khóm (dứa) băm, tỏi ớt, đường và chanh", "orderIndex": 7},
            {"name": "Bánh tráng phơi sương Trảng Bàng", "amount": 1.0, "unit": "xấp", "notes": "Dẻo dai cuốn không rách", "orderIndex": 8},
            {"name": "Rau rừng Tây Ninh (lá cóc, đọt xoài, lá lụa, quế vị)", "amount": 300.0, "unit": "g", "notes": "Rửa sạch để ráo", "orderIndex": 9},
            {"name": "Dầu hào và tiêu sọ xay", "amount": 1.5, "unit": "muỗng canh", "notes": "Gia vị ướp cá", "orderIndex": 10}
        ],
        "instructions": [
            {"stepNumber": 1, "title": "Sơ chế cá lóc sạch nhớt", "instruction": "Cá lóc đánh vảy, dùng muối hạt và chanh chà xát sạch nhớt, rửa sạch mổ bỏ mang ruột. Khứa xéo nhẹ hai bên thân cá rồi ướp cùng hành tỏi băm, dầu hào, hạt nêm, tiêu sọ xay trong 20 phút.", "timerSeconds": 1200, "tip": "Chà muối chanh kỹ giúp da cá lóc sạch nhớt và tuyệt đối không tanh khi hấp.", "orderIndex": 0},
            {"stepNumber": 2, "title": "Tạo hình thuyền bầu", "instruction": "Trái bầu non rửa sạch để nguyên vỏ, dùng dao cắt dọc một góc 1/3 thân bầu làm nắp đậy. Dùng muỗng cạo bớt phần ruột bầu bên trong tạo khoảng trống vừa vặn để đặt nguyên con cá lóc.", "timerSeconds": null, "tip": "Chọn trái bầu suôn dài tương đương chiều dài con cá để cá nằm trọn vẹn.", "orderIndex": 1},
            {"stepNumber": 3, "title": "Nhồi cá vào trái bầu", "instruction": "Rải một lớp bún tàu và nấm mèo thái sợi vào đáy ruột bầu. Đặt cá lóc đã ướp vào giữa, phủ thêm nấm mèo, hành lá chẻ ngọn và ớt sừng cắt sợi lên trên mình cá rồi đậy nắp bầu lại (hoặc để mở hé cho đẹp).", "timerSeconds": null, "tip": "Bún tàu và nấm mèo sẽ hút trọn nước cốt ngọt tinh túy tiết ra từ cá khi hấp.", "orderIndex": 2},
            {"stepNumber": 4, "title": "Hấp cách thủy chín mềm mọng nước", "instruction": "Đặt thuyền bầu đựng cá vào xửng hấp trên nồi nước sôi sùng sục. Đậy kín vung hấp lửa vừa trong 20-25 phút đến khi vỏ bầu chuyển màu xanh thẫm mềm mướt và thịt cá lóc chín trắng ngọt lịm.", "timerSeconds": 1500, "tip": "Không hấp quá lâu bầu sẽ bị nhũn nát mất hình dáng.", "orderIndex": 3},
            {"stepNumber": 5, "title": "Bày bàn cuốn và pha mắm nêm", "instruction": "Cẩn thận bưng đĩa cá hấp bầu ra bàn, rưới mỡ hành bóng mượt, rắc đậu phộng rang giòn. Dùng đũa gắp từng thớ thịt cá lóc ngọt mềm cùng miếng bầu non mọng nước cuốn bánh tráng, rau rừng chấm mắm nêm thơm nức.", "timerSeconds": null, "tip": "Nước mắm nêm băm nhiều dứa tạo vị ngọt chua hài hòa làm bừng tỉnh vị giác.", "orderIndex": 4}
        ],
        "imageCaptions": [
            "Trái bầu non khoét thuyền chứa trọn con cá lóc đồng hấp mỡ hành đậu phộng",
            "Cá lóc đồng khứa vảy ướp tiêu thơm lót nấm mèo bún tàu trong lòng bầu",
            "Mâm rau rừng Tây Ninh đủ vị chát bùi chua ngọt cuốn bánh tráng phơi sương",
            "Cuốn bánh tráng cá lóc hấp bầu chấm đẫm chén mắm nêm khóm tỏi ớt cay nồng"
        ]
    },
    {
        "title": "Bao tử heo hầm tiêu xanh hạt sen nước dừa giòn ngọt",
        "slug": "bao-tu-heo-ham-tieu-xanh",
        "description": "Món canh hầm bổ dưỡng đậm đà phong vị miền Tây, từng miếng bao tử heo giòn sần sật không chút mùi tanh, hòa quyện vị cay nồng ấm áp của tiêu xanh chùm, hạt sen bùi béo và nước dừa tươi ngọt thanh mát lành.",
        "categorySlug": "am-thuc-mien-nam",
        "difficulty": "Medium",
        "prepTimeMinutes": 35,
        "cookTimeMinutes": 45,
        "servings": 4,
        "calories": 420,
        "protein": 28.0,
        "fat": 16.0,
        "carbs": 38.0,
        "fiber": 4.5,
        "sodium": 760.0,
        "ingredients": [
            {"name": "Bao tử (dạ dày) heo tươi dày mình", "amount": 600.0, "unit": "g", "notes": "Chọn bao tử màu trắng hồng không có mùi lạ", "orderIndex": 0},
            {"name": "Tiêu xanh nguyên chùm tươi", "amount": 6.0, "unit": "chùm", "notes": "Đập dập nhẹ 3 chùm, để nguyên 3 chùm", "orderIndex": 1},
            {"name": "Hạt sen tươi Đồng Tháp", "amount": 150.0, "unit": "g", "notes": "Thông bỏ tâm sen tránh đắng", "orderIndex": 2},
            {"name": "Nước dừa tươi xiêm", "amount": 700.0, "unit": "ml", "notes": "Hầm nước dùng thanh ngọt", "orderIndex": 3},
            {"name": "Nấm đùi gà hoặc nấm rơm", "amount": 150.0, "unit": "g", "notes": "Cắt miếng vừa ăn", "orderIndex": 4},
            {"name": "Củ cải trắng", "amount": 1.0, "unit": "củ", "notes": "Cắt khúc tròn dày tăng độ ngọt", "orderIndex": 5},
            {"name": "Gừng già đập dập & rượu trắng", "amount": 50.0, "unit": "g", "notes": "Sơ chế khử sạch mùi bao tử", "orderIndex": 6},
            {"name": "Hành tím củ phi thơm", "amount": 30.0, "unit": "g", "notes": "Xào săn bao tử", "orderIndex": 7},
            {"name": "Nước mắm ngon cốt cá", "amount": 2.0, "unit": "muỗng canh", "notes": "Nêm nước hầm", "orderIndex": 8},
            {"name": "Rau mồng tơi hoặc rau xà lách xoong ăn kèm", "amount": 200.0, "unit": "g", "notes": "Nhúng lẩu thanh nhiệt", "orderIndex": 9},
            {"name": "Mì tươi hoặc bún sợi mảnh", "amount": 400.0, "unit": "g", "notes": "Ăn cùng nước hầm tiêu xanh", "orderIndex": 10}
        ],
        "instructions": [
            {"stepNumber": 1, "title": "Sơ chế bao tử heo trắng sạch giòn sần sật", "instruction": "Lộn trái bao tử cạo sạch nhớt với bột mì và muối hạt, bóp kỹ rồi rửa sạch. Chần bao tử vào nồi nước sôi có gừng đập dập và rượu trắng trong 2 phút, vớt ra ngâm ngay vào âu nước đá lạnh rồi dùng dao cạo sạch lớp màng trắng bẩn.", "timerSeconds": 600, "tip": "Sốc nhiệt nước đá lạnh giúp bao tử co lại giữ được độ giòn rụm hoàn hảo.", "orderIndex": 0},
            {"stepNumber": 2, "title": "Cắt và ướp bao tử", "instruction": "Cắt bao tử thành từng miếng xéo cỡ 2 ngón tay. Ướp bao tử với 3 chùm tiêu xanh đập dập, hành tím băm, 1 muỗng nước mắm ngon, hạt nêm và chút tiêu sọ trong 20 phút.", "timerSeconds": 1200, "tip": "Tiêu xanh đập dập ướp trực tiếp giúp tinh dầu tiêu thấm sâu vào thớ thịt bao tử.", "orderIndex": 1},
            {"stepNumber": 3, "title": "Xào săn bao tử", "instruction": "Bắc nồi lên bếp phi thơm hành tím với 1 muỗng dầu ăn, trút bao tử đã ướp vào xào trên lửa lớn trong 5 phút cho miếng bao tử săn cong lại và dậy mùi thơm nức.", "timerSeconds": 300, "tip": "Xào lửa lớn giúp bao tử săn giòn không bị chảy nước dai nhách.", "orderIndex": 2},
            {"stepNumber": 4, "title": "Hầm bao tử cùng nước dừa và hạt sen", "instruction": "Đổ 700ml nước dừa xiêm cùng 500ml nước lọc vào nồi bao tử đun sôi bùng, vớt sạch bọt. Thả hạt sen tươi, củ cải trắng và các chùm tiêu xanh nguyên vẹn vào hầm lửa liu riu trong 30-35 phút.", "timerSeconds": 2100, "tip": "Kiểm tra thấy hạt sen chín bở mềm và miếng bao tử giòn sần sật là đạt chuẩn.", "orderIndex": 3},
            {"stepNumber": 5, "title": "Hoàn thiện và thưởng thức", "instruction": "Cho nấm rơm/nấm đùi gà vào đun thêm 5 phút, nêm nếm lại nước dùng cho vừa vị cay nồng ngọt thanh. Dọn ra nồi lẩu nhỏ giữ nóng, nhúng rau mồng tơi hoặc xà lách xoong, chan mì tươi ăn nóng.", "timerSeconds": 300, "tip": "Nước dùng có vị cay dịu ấm nồng từ tiêu xanh rất tốt cho tiêu hóa và giải cảm.", "orderIndex": 4}
        ],
        "imageCaptions": [
            "Nồi bao tử heo hầm tiêu xanh hạt sen nghi ngút khói thơm lừng nồng ấm",
            "Bao tử heo sơ chế sạch trắng tinh cắt miếng giòn sần sật ướp tiêu xanh",
            "Chùm tiêu xanh tươi bóng bẩy bên cạnh hạt sen Đồng Tháp bở bùi",
            "Bát canh bao tử giòn sần sật chan mì tươi cùng rau mồng tơi xanh mướt"
        ]
    },
    {
        "title": "Vịt xiêm nấu chao khoai môn rau muống miền Tây",
        "slug": "vit-xiem-nau-chao-khoai-mon",
        "description": "Món lẩu trứ danh của miền sông nước Cần Thơ, vịt xiêm thịt dày ít mỡ om nhừ cùng chao đỏ chao trắng béo ngậy đậm đà, khoai môn sáp bở bùi dẻo quánh và rau muống non giòn ngọt.",
        "categorySlug": "am-thuc-mien-nam",
        "difficulty": "Medium",
        "prepTimeMinutes": 35,
        "cookTimeMinutes": 40,
        "servings": 4,
        "calories": 560,
        "protein": 34.0,
        "fat": 30.0,
        "carbs": 36.0,
        "fiber": 4.0,
        "sodium": 920.0,
        "ingredients": [
            {"name": "Thịt vịt xiêm chắc thịt", "amount": 1200.0, "unit": "g", "notes": "Vịt xiêm ít mỡ thịt ngọt đậm đà", "orderIndex": 0},
            {"name": "Chao trắng & chao đỏ nguyên viên", "amount": 6.0, "unit": "viên", "notes": "Tán nhuyễn cùng 3 muỗng nước chao", "orderIndex": 1},
            {"name": "Khoai môn cao (khoai sáp)", "amount": 400.0, "unit": "g", "notes": "Cắt khối vuông chiên sơ se mặt", "orderIndex": 2},
            {"name": "Nước dừa tươi xiêm", "amount": 800.0, "unit": "ml", "notes": "Nấu nước lẩu ngọt béo dịu", "orderIndex": 3},
            {"name": "Rượu trắng & gừng tươi", "amount": 50.0, "unit": "g", "notes": "Khử triệt để mùi hôi vịt", "orderIndex": 4},
            {"name": "Sả tươi băm nhuyễn & đập dập", "amount": 4.0, "unit": "nhánh", "notes": "Tạo hương thơm nồng ấm", "orderIndex": 5},
            {"name": "Hành tím & tỏi băm thơm", "amount": 30.0, "unit": "g", "notes": "Phi thơm xào vịt", "orderIndex": 6},
            {"name": "Đường phèn", "amount": 1.5, "unit": "muỗng canh", "notes": "Cân bằng vị mặn chao", "orderIndex": 7},
            {"name": "Rau muống đồng & cải xanh ăn kèm", "amount": 300.0, "unit": "g", "notes": "Nhặt sạch ngọn non", "orderIndex": 8},
            {"name": "Bún tươi sợi lớn", "amount": 500.0, "unit": "g", "notes": "Chan lẩu vịt nấu chao", "orderIndex": 9},
            {"name": "Chén chao chấm kèm (chao, đường, chanh, ớt băm)", "amount": 1.0, "unit": "chén", "notes": "Đánh nhuyễn sánh mịn", "orderIndex": 10}
        ],
        "instructions": [
            {"stepNumber": 1, "title": "Khử mùi và chặt vịt xiêm", "instruction": "Chà xát thịt vịt kỹ với muối hạt, gừng đập dập và rượu trắng trong 5 phút rồi rửa sạch, thấm khô kiệt. Chặt vịt thành từng miếng vừa ăn cỡ bao diêm.", "timerSeconds": 300, "tip": "Thui sơ da vịt trên lửa cho se vàng thơm sẽ giúp thịt vịt săn chắc hơn khi nấu.", "orderIndex": 0},
            {"stepNumber": 2, "title": "Ướp vịt cùng chao béo ngậy", "instruction": "Tán nhuyễn 4 viên chao trắng và 2 viên chao đỏ cùng nước chao. Trộn vào thịt vịt cùng hành tỏi băm, sả băm, 1 muỗng đường phèn, hạt nêm, tiêu xay. Ướp trong ít nhất 40 phút cho ngấm sâu.", "timerSeconds": 2400, "tip": "Chao đỏ giúp thịt vịt có màu đỏ gạch bắt mắt và vị béo dịu đặc sắc.", "orderIndex": 1},
            {"stepNumber": 3, "title": "Chiên sơ khoai môn và xào săn vịt", "instruction": "Khoai môn cắt khối chiên ngập dầu 3-4 phút cho se cứng lớp vỏ ngoài rồi vớt ra ráo dầu. Phi thơm sả đập dập, trút thịt vịt đã ướp chao vào xào săn trên lửa lớn khoảng 8-10 phút đến khi thịt săn lại tỏa hương chao thơm lừng.", "timerSeconds": 600, "tip": "Chiên sơ khoai môn giúp khi hầm lẩu khoai không bị nát vụn làm đục nước.", "orderIndex": 2},
            {"stepNumber": 4, "title": "Nấu vịt cùng nước dừa tươi", "instruction": "Đổ 800ml nước dừa tươi vào nồi vịt đun sôi bùng, vớt bọt sạch rồi hạ lửa vừa đun 25 phút cho thịt vịt xiêm chín mềm mọng. Tiếp tục thả khoai môn chiên vào hầm thêm 10 phút cho khoai bở dẻo mềm.", "timerSeconds": 2100, "tip": "Nước dừa tươi kết hợp với chao tạo nên vị ngọt béo tự nhiên không gắt.", "orderIndex": 3},
            {"stepNumber": 5, "title": "Bày bàn lẩu và thưởng thức", "instruction": "Chuyển vịt nấu chao sang nồi lẩu điện/cồn giữ sôi nhẹ. Nhúng ngọn rau muống non giòn sần sật, gắp miếng thịt vịt mềm béo chấm vào chén chao đánh đường ớt cay bùi, ăn kèm bún tươi.", "timerSeconds": null, "tip": "Nước lẩu chan bún ăn kèm rau muống giòn tan là tuyệt phẩm ẩm thực Tây Nam Bộ.", "orderIndex": 4}
        ],
        "imageCaptions": [
            "Nồi lẩu vịt xiêm nấu chao khoai môn đỏ au màu gạch bốc khói nghi ngút",
            "Thịt vịt xiêm ướp chao đỏ chao trắng sánh ngậy đậm đà hương sả tỏi",
            "Đĩa khoai môn chiên vàng xém cạnh bên cạnh rổ rau muống đồng xanh ngắt",
            "Thịt vịt nấu chao mềm béo chấm chén sốt chao ớt cay nồng đậm đà"
        ]
    },

    # ==========================================
    # CATEGORY 23: MÓN TỪ GIA CẦM (gia-cam) - 3 recipes
    # ==========================================
    {
        "title": "Gà bó xôi chiên giòn rụm nguyên con vàng óng",
        "slug": "ga-bo-xoi-chien-gion-nguyen-con",
        "description": "Tuyệt kỹ gà không lối thoát với lớp vỏ xôi nếp nương chiên vàng ruộm phồng giòn tan bên ngoài, bọc kín nguyên con gà ta hấp thảo mộc mọng nước ngọt mềm béo ngậy bên trong.",
        "categorySlug": "gia-cam",
        "difficulty": "Hard",
        "prepTimeMinutes": 60,
        "cookTimeMinutes": 50,
        "servings": 6,
        "calories": 680,
        "protein": 42.0,
        "fat": 32.0,
        "carbs": 58.0,
        "fiber": 2.8,
        "sodium": 820.0,
        "ingredients": [
            {"name": "Gà ta thả vườn nguyên con", "amount": 1400.0, "unit": "g", "notes": "Gà mái tơ thịt ngọt mềm da vàng", "orderIndex": 0},
            {"name": "Gạo nếp nương hoặc nếp cái hoa vàng", "amount": 600.0, "unit": "g", "notes": "Ngâm nước ấm 4 tiếng đồ xôi dẻo", "orderIndex": 1},
            {"name": "Nước cốt dừa", "amount": 100.0, "unit": "ml", "notes": "Rưới vào xôi tạo độ thơm béo dẻo bóng", "orderIndex": 2},
            {"name": "Hạt sen tươi & nấm hương", "amount": 100.0, "unit": "g", "notes": "Nhồi bụng gà tăng hương vị bổ dưỡng", "orderIndex": 3},
            {"name": "Bột nghệ hoặc nước cốt nghệ", "amount": 1.0, "unit": "muỗng canh", "notes": "Trộn vào nếp tạo màu xôi vàng óng", "orderIndex": 4},
            {"name": "Gừng tươi & sả cây", "amount": 50.0, "unit": "g", "notes": "Hấp cùng gà", "orderIndex": 5},
            {"name": "Hành tím băm thơm", "amount": 40.0, "unit": "g", "notes": "Ướp gà", "orderIndex": 6},
            {"name": "Nước mắm ngon cốt cá", "amount": 2.5, "unit": "muỗng canh", "notes": "Gia vị ướp", "orderIndex": 7},
            {"name": "Dầu ăn thực vật", "amount": 800.0, "unit": "ml", "notes": "Chiên ngập dầu quả xôi bọc gà", "orderIndex": 8},
            {"name": "Muối tiêu chanh ớt lá chanh", "amount": 1.0, "unit": "đĩa", "notes": "Chấm thịt gà xé", "orderIndex": 9}
        ],
        "instructions": [
            {"stepNumber": 1, "title": "Sơ chế và ướp gà", "instruction": "Gà làm sạch mổ moi, chà xát muối gừng khử mùi. Ướp gà trong và ngoài với hành tím băm, nước mắm, tiêu xay, bột nêm trong 30 phút. Nhồi hạt sen tươi và nấm hương vào bụng gà ghim kín lại.", "timerSeconds": 1800, "tip": "Mổ moi giúp giữ trọn vẹn nước ngọt tiết ra trong thân gà khi hấp.", "orderIndex": 0},
            {"stepNumber": 2, "title": "Hấp chín gà thảo mộc", "instruction": "Đặt gà vào xửng hấp lót sả gừng đập dập, hấp cách thủy lửa vừa trong 25-30 phút đến khi gà chín tới 90%. Lấy gà ra để nguội ráo nước hoàn toàn.", "timerSeconds": 1800, "tip": "Gà phải thật ráo nước trước khi bọc xôi để vỏ xôi không bị nhão bung khi chiên.", "orderIndex": 1},
            {"stepNumber": 3, "title": "Đồ xôi dẻo và dát xôi", "instruction": "Gạo nếp ngâm trộn chút muối và nước nghệ, đồ chín dẻo trong 30 phút, rưới nước cốt dừa đảo đều đồ thêm 10 phút. Trải màng bọc thực phẩm ra mâm, dàn xôi nóng thành hình chữ nhật dày khoảng 1cm nén thật phẳng mịn.", "timerSeconds": 2400, "tip": "Nén xôi thật đều tay không để khe hở để dầu không lọt vào gà khi chiên.", "orderIndex": 2},
            {"stepNumber": 4, "title": "Bó xôi bọc kín gà", "instruction": "Đặt con gà vào giữa tấm xôi, dùng màng bọc túm chặt mép xôi bọc kín hoàn toàn toàn bộ con gà thành một khối bầu dục căng tròn liền mạch, miết đều tay rồi để nguội se cứng 20 phút.", "timerSeconds": 1200, "tip": "Đảm bảo khối xôi bọc kín mít không một kẽ hở nào.", "orderIndex": 3},
            {"stepNumber": 5, "title": "Chiên xôi giòn rụm vàng ươm", "instruction": "Đun sôi chảo dầu sâu lòng ngập 1/2 quả xôi. Nhẹ nhàng thả quả xôi gà vào chiên, múc dầu sôi xối liên tục lên mặt trên trong 12-15 phút đến khi vỏ xôi phồng rộp vàng giòn rụm đều khắp mặt. Vớt ra để ráo dầu, dùng kéo cắt đôi phô bày con gà mọng nước thơm nức bên trong.", "timerSeconds": 900, "tip": "Dầu phải thật nóng già lúc đầu để vỏ xôi se giòn ngay không ngấm dầu thừa.", "orderIndex": 4}
        ],
        "imageCaptions": [
            "Khối xôi chiên vàng ruộm giòn tan cắt mở phô bày nguyên con gà mọng nước",
            "Thao tác dát xôi nếp dẻo thơm nước cốt dừa bọc kín gà nguyên con",
            "Xối dầu sôi nóng bỏng lên quả xôi gà đang phồng rộp vàng óng ả",
            "Miếng xôi giòn rụm kèm thớ thịt gà ta ngọt mềm chấm muối tiêu lá chanh"
        ]
    },
    {
        "title": "Cơm gà Hải Nam da giòn mọng nước cơm thơm gừng",
        "slug": "com-ga-hai-nam-da-gion",
        "description": "Món cơm gà kinh điển với lớp da gà vàng ươm giòn sần sật mọng nước ngọt lịm, hạt cơm dẻo bùi nấu từ nước luộc gà và mỡ gà thơm ngát mùi gừng tỏi phi, ăn kèm 3 loại nước chấm trứ danh.",
        "categorySlug": "gia-cam",
        "difficulty": "Medium",
        "prepTimeMinutes": 35,
        "cookTimeMinutes": 40,
        "servings": 4,
        "calories": 620,
        "protein": 36.0,
        "fat": 24.0,
        "carbs": 64.0,
        "fiber": 2.2,
        "sodium": 790.0,
        "ingredients": [
            {"name": "Gà ta hoặc gà tam hoàng thả vườn", "amount": 1300.0, "unit": "g", "notes": "Chọn gà da vàng thịt chắc ngọt", "orderIndex": 0},
            {"name": "Gạo thơm hoa lài", "amount": 350.0, "unit": "g", "notes": "Vo sạch để ráo nước", "orderIndex": 1},
            {"name": "Mỡ gà tươi", "amount": 100.0, "unit": "g", "notes": "Thắng lấy mỡ nước xào gạo nấu cơm", "orderIndex": 2},
            {"name": "Gừng tươi già", "amount": 80.0, "unit": "g", "notes": "Một nửa thái lát luộc gà, một nửa băm nhuyễn làm sốt", "orderIndex": 3},
            {"name": "Tỏi cô đơn", "amount": 50.0, "unit": "g", "notes": "Băm nhuyễn phi thơm", "orderIndex": 4},
            {"name": "Hành lá nguyên cây", "amount": 60.0, "unit": "g", "notes": "Bó tròn luộc cùng gà", "orderIndex": 5},
            {"name": "Dưa leo & cà chua thái lát", "amount": 150.0, "unit": "g", "notes": "Ăn kèm giải ngấy", "orderIndex": 6},
            {"name": "Dầu mè thơm thượng hạng", "amount": 2.0, "unit": "muỗng canh", "notes": "Quét lên da gà tạo độ bóng và mùi thơm đặc trưng", "orderIndex": 7},
            {"name": "Hắc xì dầu ngọt (sweet dark soy sauce)", "amount": 3.0, "unit": "muỗng canh", "notes": "Nước chấm ngọt sánh", "orderIndex": 8},
            {"name": "Ớt sừng đỏ xay nhuyễn", "amount": 3.0, "unit": "trái", "notes": "Pha nước sốt ớt tỏi gừng chua cay", "orderIndex": 9},
            {"name": "Muối hạt tinh khiết", "amount": 2.0, "unit": "muỗng canh", "notes": "Chà xát da gà và nêm nước luộc", "orderIndex": 10}
        ],
        "instructions": [
            {"stepNumber": 1, "title": "Luộc gà ngâm đá tạo da giòn sần sật", "instruction": "Gà chà muối rửa sạch. Đun sôi nồi nước ngập gà với gừng lát, bó hành lá và thìa muối. Cho gà vào luộc lửa vừa 10 phút, tắt bếp đậy vung ngâm om 25 phút. Vớt gà ngâm ngay vào âu nước đá lạnh 15 phút, vớt ra quét dầu mè cho bóng mướt.", "timerSeconds": 2400, "tip": "Kỹ thuật om gà không sôi và sốc nước đá lạnh giúp da gà giòn sần sật mọng nước ngọt tự nhiên.", "orderIndex": 0},
            {"stepNumber": 2, "title": "Thắng mỡ gà xào gạo thơm", "instruction": "Cho mỡ gà vào chảo thắng lấy nước mỡ trong veo, phi thơm gừng tỏi băm đến khi vàng ruộm. Trút gạo đã ráo vào đảo đều tay trên lửa vừa trong 5 phút đến khi hạt gạo đục se lại và ngấm đẫm mỡ thơm.", "timerSeconds": 300, "tip": "Xào gạo với mỡ gà trước khi nấu giúp cơm khi chín tơi xốp từng hạt bóng bẩy.", "orderIndex": 1},
            {"stepNumber": 3, "title": "Nấu cơm gà bằng nước luộc gà", "instruction": "Trút gạo đã xào vào nồi cơm điện, đong nước luộc gà ngập hơn mặt gạo 1 đốt ngón tay, thêm chút muối và lát gừng. Bật nút nấu chín cơm dẻo thơm nức mũi.", "timerSeconds": 1800, "tip": "Dùng nước luộc gà nóng để nấu cơm giúp hạt cơm nở đều và đậm đà.", "orderIndex": 2},
            {"stepNumber": 4, "title": "Pha bộ ba nước chấm Hải Nam", "instruction": "Làm 3 chén sốt: (1) Sốt gừng hành: gừng băm nhuyễn, hành lá thái nhỏ dội dầu ăn đang sôi cùng chút muối; (2) Sốt ớt tỏi chua cay: ớt băm, tỏi băm, giấm, đường, nước luộc gà; (3) Hắc xì dầu ngọt đặc sánh.", "timerSeconds": 360, "tip": "Đủ 3 loại sốt mới tạo nên bản hòa tấu phong vị trọn vẹn của cơm gà Hải Nam.", "orderIndex": 3},
            {"stepNumber": 5, "title": "Chặt gà và bày đĩa", "instruction": "Chặt gà thành từng miếng chữ nhật đều đặn bày lên đĩa có lót dưa leo thái vát. Xới chén cơm gà vàng óng nén chặt úp ra đĩa, dọn kèm 3 bát nước sốt và bát nước luộc gà rắc hành ngò thanh ngọt.", "timerSeconds": null, "tip": "Chấm miếng gà vào sốt gừng hành trước rồi nhúng qua sốt ớt chua cay để bùng nổ hương vị.", "orderIndex": 4}
        ],
        "imageCaptions": [
            "Đĩa cơm gà Hải Nam hạt cơm vàng óng bóng mỡ bên đĩa thịt gà da giòn mọng nước",
            "Gà luộc om nước dùng ngâm đá lạnh quét dầu mè vàng ruộm bóng bẩy",
            "Thao tác xào gạo thơm hạt lài cùng mỡ gà gừng tỏi phi thơm nức mũi",
            "Bộ ba chén nước chấm sốt gừng hành tỏi ớt và hắc xì dầu sánh đậm"
        ]
    },
    {
        "title": "Chim bồ câu hầm hạt sen táo đỏ kỳ tử bổ dưỡng",
        "slug": "chim-bo-cau-ham-hat-sen-tao-do",
        "description": "Món canh tiềm bổ dưỡng đại bổ khí huyết theo y học cổ truyền, chim bồ câu ra ràng ngọt thịt hầm nhừ cùng hạt sen bở bùi, táo đỏ ngọt thanh, kỳ tử và nấm hương trong nước dùng trong vắt thanh tao.",
        "categorySlug": "gia-cam",
        "difficulty": "Medium",
        "prepTimeMinutes": 30,
        "cookTimeMinutes": 60,
        "servings": 4,
        "calories": 450,
        "protein": 38.0,
        "fat": 18.0,
        "carbs": 34.0,
        "fiber": 4.2,
        "sodium": 640.0,
        "ingredients": [
            {"name": "Chim bồ câu ra ràng làm sạch", "amount": 2.0, "unit": "con", "notes": "Khoảng 800g, bồ câu mới ra ràng thịt mềm ngọt", "orderIndex": 0},
            {"name": "Hạt sen tươi (hoặc khô ngâm mềm)", "amount": 120.0, "unit": "g", "notes": "Thông bỏ tâm sen đắng", "orderIndex": 1},
            {"name": "Táo đỏ Tân Cương", "amount": 10.0, "unit": "quả", "notes": "Rửa sạch khía nhẹ vỏ quả", "orderIndex": 2},
            {"name": "Kỳ tử đỏ tự nhiên", "amount": 20.0, "unit": "g", "notes": "Rửa sạch để ráo", "orderIndex": 3},
            {"name": "Nấm hương khô rừng", "amount": 15.0, "unit": "g", "notes": "Ngâm nở cắt bỏ chân nấm", "orderIndex": 4},
            {"name": "Đẳng sâm hoặc ý dĩ", "amount": 20.0, "unit": "g", "notes": "Tăng vị thuốc bắc ngọt thanh bổ tỳ vị", "orderIndex": 5},
            {"name": "Gừng tươi đập dập & rượu trắng", "amount": 40.0, "unit": "g", "notes": "Khử tanh thịt bồ câu", "orderIndex": 6},
            {"name": "Nước dừa tươi hoặc nước dùng xương", "amount": 600.0, "unit": "ml", "notes": "Tạo vị ngọt thanh tao", "orderIndex": 7},
            {"name": "Muối tinh và hạt nêm", "amount": 1.5, "unit": "muỗng canh", "notes": "Nêm nhẹ nhàng thanh đạm", "orderIndex": 8},
            {"name": "Hành ngò rí", "amount": 20.0, "unit": "g", "notes": "Rắc tô canh khi ăn", "orderIndex": 9}
        ],
        "instructions": [
            {"stepNumber": 1, "title": "Sơ chế và khử tanh chim bồ câu", "instruction": "Bồ câu rửa sạch mổ moi, dùng muối hạt, gừng giã nát và rượu trắng chà xát cả trong lẫn ngoài thân chim trong 3 phút rồi rửa lại nước ấm, để ráo. Thui sơ qua lửa cho se da và cháy hết lông tơ thừa.", "timerSeconds": 300, "tip": "Thui se da giúp chim bồ câu khi hầm nước canh thơm lừng không bị tanh.", "orderIndex": 0},
            {"stepNumber": 2, "title": "Chiên sơ hoặc chần sơ thịt bồ câu", "instruction": "Đun sôi nồi nước có vài lát gừng, thả chim bồ câu vào chần sơ 2 phút rồi vớt ra ngâm nước lạnh cho thịt săn chắc và sạch bọt bẩn hoàn toàn.", "timerSeconds": 120, "tip": "Chần sơ nước sôi giúp nước hầm sau này trong vắt như hổ phách.", "orderIndex": 1},
            {"stepNumber": 3, "title": "Xếp nguyên liệu vào thố tiềm", "instruction": "Đặt 2 con chim bồ câu vào thố sứ hoặc nồi đất dày. Nhồi một nửa hạt sen và nấm hương vào bụng chim, phần hạt sen còn lại cùng táo đỏ, kỳ tử, đẳng sâm rải đều xung quanh thân chim.", "timerSeconds": null, "tip": "Dùng thố tiềm cách thủy là phương pháp hoàn hảo nhất để giữ trọn dưỡng chất.", "orderIndex": 2},
            {"stepNumber": 4, "title": "Hầm cách thủy chậm giữ trọn tinh chất", "instruction": "Rót nước dừa tươi và nước lọc ấm ngập sâm sấp mặt bồ câu, nêm 1 thìa cà phê muối và chút hạt nêm. Đậy nắp thố, đặt vào nồi hấp hầm cách thủy lửa nhỏ trong 50-60 phút đến khi thịt bồ câu mềm rục rã thớ.", "timerSeconds": 3600, "tip": "Hầm lửa nhỏ liu riu để nước dùng trong ngọt mà hạt sen và táo đỏ không bị nát vụn.", "orderIndex": 3},
            {"stepNumber": 5, "title": "Nêm nếm và thưởng thức", "instruction": "Mở nắp thố, nêm lại chút muối cho vừa vị thanh ngọt tự nhiên của thịt chim và táo đỏ, thả chút kỳ tử vào đun thêm 3 phút rồi tắt bếp. Rắc chút ngò rí thái nhỏ, dùng nóng khi canh còn bốc hơi ấm áp.", "timerSeconds": 180, "tip": "Món ăn cực kỳ bổ dưỡng cho người cần bồi bổ sức khỏe, người già và mẹ bầu.", "orderIndex": 4}
        ],
        "imageCaptions": [
            "Thố chim bồ câu tiềm hạt sen táo đỏ nước dùng trong vắt tỏa hương thơm thảo mộc",
            "Chim bồ câu ra ràng làm sạch nhồi hạt sen nấm hương chuẩn bị vào thố",
            "Đĩa thảo mộc dưỡng sinh táo đỏ kỳ tử hạt sen tươi căng mẩy",
            "Múc muỗng canh bồ câu nóng hổi thịt mềm rục tan hạt sen bùi béo ngọt lịm"
        ]
    },

    # ==========================================
    # CATEGORY 24: MÓN TỪ THỊT BÒ (thit-bo) - 3 recipes
    # ==========================================
    {
        "title": "Bò sốt vang thơm hương thảo quế hồi ăn bánh mì",
        "slug": "bo-sot-vang-huong-thao-que-hoi",
        "description": "Món bò sốt vang phong cách ẩm thực Hà Nội giao thoa Pháp, từng miếng dẻ sườn và bắp bò ngập gân hầm nhừ mềm tan trong sốt cà chua vang đỏ sánh đậm, ngào ngạt hương quế, hồi, thảo quả ăn cùng bánh mì giòn rụm.",
        "categorySlug": "thit-bo",
        "difficulty": "Medium",
        "prepTimeMinutes": 35,
        "cookTimeMinutes": 60,
        "servings": 4,
        "calories": 580,
        "protein": 38.0,
        "fat": 26.0,
        "carbs": 48.0,
        "fiber": 3.5,
        "sodium": 860.0,
        "ingredients": [
            {"name": "Dẻ sườn bò & bắp bò nhiều gân", "amount": 800.0, "unit": "g", "notes": "Cắt khối vuông quân cờ cỡ 3cm", "orderIndex": 0},
            {"name": "Rượu vang đỏ (Red wine Bordeaux hoặc Đà Lạt)", "amount": 150.0, "unit": "ml", "notes": "Ướp thịt và nấu sốt tạo hương nồng", "orderIndex": 1},
            {"name": "Cà chua chín mọng", "amount": 3.0, "unit": "trái", "notes": "Xay nhuyễn làm sốt cà", "orderIndex": 2},
            {"name": "Sốt cà chua cô đặc (tomato paste)", "amount": 2.0, "unit": "muỗng canh", "notes": "Tạo màu đỏ sẫm và độ sánh đậm", "orderIndex": 3},
            {"name": "Cà rốt & khoai tây", "amount": 300.0, "unit": "g", "notes": "Cắt khối vuông luộc sơ", "orderIndex": 4},
            {"name": "Hoa hồi, quế thanh, thảo quả", "amount": 1.0, "unit": "set", "notes": "Rang thơm dậy mùi thảo mộc", "orderIndex": 5},
            {"name": "Bơ lạt thơm", "amount": 30.0, "unit": "g", "notes": "Xào thịt bò tăng độ béo", "orderIndex": 6},
            {"name": "Hành tây & tỏi băm", "amount": 50.0, "unit": "g", "notes": "Phi thơm", "orderIndex": 7},
            {"name": "Bột năng hòa nước", "amount": 2.0, "unit": "muỗng canh", "notes": "Tạo độ sánh mượt bóng cho sốt", "orderIndex": 8},
            {"name": "Bánh mì ổ giòn", "amount": 4.0, "unit": "ổ", "notes": "Chấm cùng sốt vang", "orderIndex": 9},
            {"name": "Rau mùi ta (ngò rí)", "amount": 30.0, "unit": "g", "notes": "Trang trí khi dọn", "orderIndex": 10}
        ],
        "instructions": [
            {"stepNumber": 1, "title": "Sơ chế và ướp thịt bò với rượu vang", "instruction": "Thịt bò rửa nước ấm gừng, thấm khô, cắt miếng vuông quân cờ. Ướp thịt với 80ml rượu vang đỏ, tỏi băm, 1.5 muỗng hạt nêm, tiêu sọ xay, 1 muỗng đường trong 40 phút cho ngấm sâu.", "timerSeconds": 2400, "tip": "Rượu vang đỏ giúp các thớ gân và cơ thịt bò mềm nhanh và thơm ngát khi nấu.", "orderIndex": 0},
            {"stepNumber": 2, "title": "Xào sốt cà chua và thảo mộc", "instruction": "Đun chảy bơ lạt trong nồi đáy dày, phi thơm tỏi băm và hành tây. Cho cà chua xay nhuyễn và tương cà tomato paste vào đảo đều tạo màu đỏ gạch rực rỡ. Thả quế, hoa hồi, thảo quả rang thơm vào đảo cùng.", "timerSeconds": 300, "tip": "Phi tương cà với bơ tạo màu đỏ tự nhiên bóng bẩy đặc trưng kiểu Pháp.", "orderIndex": 1},
            {"stepNumber": 3, "title": "Xào săn thịt bò", "instruction": "Trút thịt bò đã ướp vào nồi sốt cà chua, đảo đều tay trên lửa lớn trong 8-10 phút cho miếng thịt săn se mặt và ngấm trọn màu đỏ sánh của sốt.", "timerSeconds": 600, "tip": "Xào thật săn để thịt khóa chặt nước ngọt bên trong miếng thịt.", "orderIndex": 2},
            {"stepNumber": 4, "title": "Hầm mềm thịt bò cùng rượu vang", "instruction": "Châm nước sôi ngập mặt thịt bò, đậy vung hầm lửa nhỏ liu riu trong 45 phút. Khi thịt bò bắt đầu mềm, cho khoai tây và cà rốt vào hầm thêm 15 phút. Rót 70ml rượu vang đỏ còn lại vào nồi khuấy đều.", "timerSeconds": 3600, "tip": "Thêm một phần rượu vang ở giai đoạn cuối giúp lưu giữ hương vị rượu nồng nàn quyến rũ.", "orderIndex": 3},
            {"stepNumber": 5, "title": "Làm sánh sốt và thưởng thức", "instruction": "Rót từ từ bát bột năng hòa nước vào khuấy nhẹ tay đến khi sốt bò sốt vang sánh sệt, bóng mượt ôm trọn miếng thịt. Tắt bếp, múc ra tô rắc tiêu xay và ngò rí, chấm bánh mì giòn rụm hoặc chan phở bún.", "timerSeconds": 180, "tip": "Ăn nóng hổi cùng bánh mì nướng giòn rụm là sự kết hợp không gì sánh bằng.", "orderIndex": 4}
        ],
        "imageCaptions": [
            "Tô bò sốt vang màu đỏ nâu sóng sánh đậm đà ngập tràn dẻ sườn mềm tan",
            "Miếng thịt bò gân quân cờ ướp ngập rượu vang đỏ và thảo mộc quế hồi",
            "Nồi sốt cà chua bơ lạt sôi liu riu tỏa hương thơm ngát đặc trưng",
            "Bánh mì giòn rụm chấm ngập nước sốt vang thơm nồng béo ngậy ngào ngạt"
        ]
    },
    {
        "title": "Bò cuộn nấm kim châm áp chảo sốt dầu hào tỏi ớt",
        "slug": "bo-cuon-nam-kim-cham-ap-chao",
        "description": "Món ăn thanh tao đẹp mắt và cực kỳ kích thích vị giác với từng dải ba chỉ bò Mỹ mềm mỏng bọc cuộn nấm kim châm tươi giòn ngọt, áp chảo xém cạnh rưới sốt dầu hào tỏi ớt đậm đà sánh quyện.",
        "categorySlug": "thit-bo",
        "difficulty": "Easy",
        "prepTimeMinutes": 20,
        "cookTimeMinutes": 15,
        "servings": 4,
        "calories": 380,
        "protein": 26.0,
        "fat": 22.0,
        "carbs": 18.0,
        "fiber": 3.0,
        "sodium": 740.0,
        "ingredients": [
            {"name": "Ba chỉ bò cuộn (beef short plate)", "amount": 400.0, "unit": "g", "notes": "Cắt lát mỏng dài đều đặn có vân mỡ xen kẽ", "orderIndex": 0},
            {"name": "Nấm kim châm tươi", "amount": 300.0, "unit": "g", "notes": "Cắt gốc rửa sạch tách khóm nhỏ", "orderIndex": 1},
            {"name": "Dầu hào Maggi hảo hạng", "amount": 2.5, "unit": "muỗng canh", "notes": "Linh hồn của sốt áp chảo", "orderIndex": 2},
            {"name": "Nước tương ngon", "amount": 1.5, "unit": "muỗng canh", "notes": "Cân bằng vị mặn thanh", "orderIndex": 3},
            {"name": "Mật ong nguyên chất", "amount": 1.0, "unit": "muỗng canh", "notes": "Tạo độ bóng và vị ngọt dịu", "orderIndex": 4},
            {"name": "Tỏi cô đơn băm nhuyễn", "amount": 30.0, "unit": "g", "notes": "Phi thơm làm sốt", "orderIndex": 5},
            {"name": "Ớt sừng băm nhỏ", "amount": 1.0, "unit": "trái", "notes": "Tạo màu và vị cay nhẹ", "orderIndex": 6},
            {"name": "Hành lá chần sơ nước sôi", "amount": 15.0, "unit": "cọng", "notes": "Buộc cố định cuộn bò (nếu thích)", "orderIndex": 7},
            {"name": "Mè trắng rang thơm", "amount": 1.0, "unit": "muỗng canh", "notes": "Rắc mặt đĩa", "orderIndex": 8},
            {"name": "Dầu ăn thực vật", "amount": 1.5, "unit": "muỗng canh", "notes": "Áp chảo", "orderIndex": 9}
        ],
        "instructions": [
            {"stepNumber": 1, "title": "Sơ chế nấm và thịt bò", "instruction": "Nấm kim châm cắt bỏ phần chân gốc già, rửa nhẹ nhàng dưới vòi nước rồi vắt ráo, tách thành các bó nhỏ vừa tay. Thịt ba chỉ bò trải phẳng từng dải dài lên thớt.", "timerSeconds": 300, "tip": "Thịt bò để hơi se lạnh sẽ dễ trải và cuốn chặt tay hơn.", "orderIndex": 0},
            {"stepNumber": 2, "title": "Cuốn bò nấm kim châm", "instruction": "Đặt một bó nấm kim châm vào đầu dải thịt bò sao cho phần ngọn nấm thò ra ngoài một đoạn đẹp mắt. Cuộn tròn chặt tay dải thịt bò quanh bó nấm đến hết chiều dài miếng thịt.", "timerSeconds": null, "tip": "Cuộn chặt tay để khi áp chảo miếng bò không bị bung tuột.", "orderIndex": 1},
            {"stepNumber": 3, "title": "Pha nước sốt dầu hào tỏi ớt", "instruction": "Khuấy tan trong bát con gồm: 2.5 muỗng dầu hào, 1.5 muỗng nước tương, 1 muỗng mật ong, 1 muỗng tỏi băm, ớt băm, chút tiêu và 3 muỗng nước lọc.", "timerSeconds": 120, "tip": "Khuấy tan hoàn toàn mật ong để sốt không bị khét khi đun.", "orderIndex": 2},
            {"stepNumber": 4, "title": "Áp chảo bò cuộn nấm", "instruction": "Quét lớp dầu mỏng lên chảo chống dính đun nóng già. Xếp từng cuộn bò vào áp chảo lửa vừa trong 3-4 phút, lật nhẹ các mặt đến khi thịt bò chín săn, xém cạnh vàng nâu thơm lức.", "timerSeconds": 240, "tip": "Không áp chảo quá lâu thịt bò sẽ bị dai khô mất độ mềm mọng.", "orderIndex": 3},
            {"stepNumber": 5, "title": "Rưới sốt và rim ngấm vị", "instruction": "Rưới đều bát sốt dầu hào tỏi ớt vào chảo đang sôi. Lắc nhẹ chảo đun sôi liu riu 2 phút cho sốt sánh lại áo một lớp màu nâu cánh gián bóng bẩy lên từng cuộn bò. Gắp ra đĩa rắc mè rang thơm phức.", "timerSeconds": 120, "tip": "Ăn nóng cùng cơm trắng hạt dẻo thơm thì ngon hết ý.", "orderIndex": 4}
        ],
        "imageCaptions": [
            "Đĩa bò cuộn nấm kim châm áp chảo sốt dầu hào nâu óng ả rắc mè trắng",
            "Từng dải ba chỉ bò cuộn tròn chặt tay quanh ngọn nấm kim châm tươi giòn",
            "Chảo bò cuộn nấm áp chảo xèo xèo sôi lăn tăn nước sốt dầu hào đậm đà",
            "Miếng bò cuộn nấm cắn ngập miệng cảm nhận vị ngọt mọng nước giòn sần sật"
        ]
    },
    {
        "title": "Bắp bò ngâm mắm ớt chua ngọt giòn sần sật",
        "slug": "bap-bo-ngam-mam-ot-chua-ngot",
        "description": "Món nhắm thượng hạng ngày lễ Tết với bắp hoa bò nhiều vân gân luộc chín tới giòn sần sật, ngâm thấm đẫm trong nước mắm cốt nhĩ nấu chua ngọt cùng tỏi ớt tươi, gừng, sả thơm lừng.",
        "categorySlug": "thit-bo",
        "difficulty": "Easy",
        "prepTimeMinutes": 25,
        "cookTimeMinutes": 35,
        "servings": 6,
        "calories": 320,
        "protein": 34.0,
        "fat": 11.0,
        "carbs": 21.0,
        "fiber": 1.2,
        "sodium": 890.0,
        "ingredients": [
            {"name": "Bắp hoa bò hoặc bắp lõi rùa", "amount": 800.0, "unit": "g", "notes": "Nhiều vân hoa giòn sần sật, lọc sạch mỡ thừa", "orderIndex": 0},
            {"name": "Nước mắm truyền thống cốt nhĩ (40 độ đạm)", "amount": 350.0, "unit": "ml", "notes": "Tạo vị mặn sâu thơm lừng", "orderIndex": 1},
            {"name": "Đường phèn hoặc đường hoa mai", "amount": 300.0, "unit": "g", "notes": "Tạo vị ngọt thanh và nước mắm trong", "orderIndex": 2},
            {"name": "Giấm gạo lên men tự nhiên", "amount": 150.0, "unit": "ml", "notes": "Vị chua thanh dịu nhẹ", "orderIndex": 3},
            {"name": "Nước lọc tinh khiết", "amount": 100.0, "unit": "ml", "notes": "Hòa tan hỗn hợp nước mắm", "orderIndex": 4},
            {"name": "Tỏi tép cô đơn", "amount": 60.0, "unit": "g", "notes": "Bóc vỏ thái lát mỏng", "orderIndex": 5},
            {"name": "Ớt chỉ thiên đỏ", "amount": 8.0, "unit": "trái", "notes": "Để nguyên trái và thái lát", "orderIndex": 6},
            {"name": "Gừng tươi, sả, hoa hồi, quế", "amount": 1.0, "unit": "set", "notes": "Luộc cùng bắp bò cho thơm", "orderIndex": 7},
            {"name": "Tiêu đen hạt", "amount": 1.0, "unit": "muỗng canh", "notes": "Rang sơ thả vào hũ ngâm", "orderIndex": 8},
            {"name": "Hũ thủy tinh sạch tiệt trùng", "amount": 1.0, "unit": "hũ", "notes": "Tráng nước sôi lau khô kiệt", "orderIndex": 9}
        ],
        "instructions": [
            {"stepNumber": 1, "title": "Luộc bắp bò chín tới giữ độ giòn", "instruction": "Bắp bò rửa sạch, dùng chỉ thực phẩm cuộn chặt định hình tròn. Cho vào nồi cùng sả đập dập, gừng, 1 thanh quế, 2 hoa hồi và 1 thìa muối. Đun sôi luộc lửa vừa 30-35 phút đến khi xiên tăm qua thịt không còn nước đỏ.", "timerSeconds": 2100, "tip": "Không luộc quá nhừ làm bắp bò mất độ giòn sần sật.", "orderIndex": 0},
            {"stepNumber": 2, "title": "Sốc lạnh và làm nguội bắp bò", "instruction": "Vớt bắp bò ngâm ngay vào thau nước đá lạnh 15 phút cho thớ thịt se săn lại. Vớt ra thấm thật khô kiệt bằng khăn sạch rồi cất ngăn mát tủ lạnh 1 giờ cho khối thịt săn cứng.", "timerSeconds": 3600, "tip": "Bắp bò phải thật nguội và khô ráo hoàn toàn trước khi ngâm để nước mắm không bị váng mốc.", "orderIndex": 1},
            {"stepNumber": 3, "title": "Nấu nước mắm ngâm trong veo", "instruction": "Cho nước mắm, đường phèn, giấm gạo và 100ml nước vào nồi. Đun sôi khuấy tan đường trên lửa vừa, hớt sạch bọt rồi hạ lửa nhỏ đun thêm 3 phút. Tắt bếp để nước mắm nguội hoàn toàn 100%.", "timerSeconds": 480, "tip": "Bắt buộc nước mắm phải nguội hẳn mới trút vào hũ ngâm bắp bò.", "orderIndex": 2},
            {"stepNumber": 4, "title": "Ngâm bắp bò vào hũ thủy tinh", "instruction": "Cắt bỏ sợi chỉ, xếp các cuộn bắp bò vào hũ thủy tinh đã tiệt trùng. Thả tỏi lát, ớt đỏ và hạt tiêu hạt xung quanh. Rót nước mắm đã nguội ngập hoàn toàn thịt bò, dùng nan tre hoặc đĩa nhỏ chèn không cho thịt nổi lên.", "timerSeconds": null, "tip": "Thịt nổi lên trên mặt nước mắm sẽ dễ bị thâm đen và hỏng váng.", "orderIndex": 3},
            {"stepNumber": 5, "title": "Thái lát mỏng và thưởng thức", "instruction": "Đậy kín nắp hũ, để nơi thoáng mát 3-4 ngày là ngấm vị (sau đó bảo quản ngăn mát tủ lạnh dùng cả tháng). Khi ăn, dùng dao sắc thái bắp bò thành từng lát mỏng tang khoe vân hoa tuyệt đẹp, chấm nước mắm ngâm cuộn rau sống.", "timerSeconds": null, "tip": "Thái lát thật mỏng để miếng bắp bò giòn tan và thấm trọn vị chua cay mặn ngọt.", "orderIndex": 4}
        ],
        "imageCaptions": [
            "Hũ thủy tinh bắp bò ngâm mắm tỏi ớt đỏ au nước mắm trong veo màu hổ phách",
            "Đĩa bắp bò thái lát mỏng tang khoe trọn từng vân hoa gân giòn sần sật",
            "Nồi nước mắm đường phèn giấm gạo sôi lăn tăn trong veo ráo bọt",
            "Bắp bò ngâm mắm cuốn bánh tráng rau rừng chấm chính nước mắm ngâm chua ngọt"
        ]
    },

    # ==========================================
    # CATEGORY 25: MÓN TỪ THỊT HEO (thit-heo) - 3 recipes
    # ==========================================
    {
        "title": "Thịt heo quay giòn bì da nổ phồng chấm tương ớt",
        "slug": "thit-heo-quay-gion-bi-da-no",
        "description": "Bí quyết làm thịt ba chỉ quay da giòn nổ xốp vàng ruộm như ngoài tiệm, lớp bì giòn tan rôm rốp không cứng, phần thịt mọng nước đậm đà ngũ vị hương và thảo mộc.",
        "categorySlug": "thit-heo",
        "difficulty": "Medium",
        "prepTimeMinutes": 45,
        "cookTimeMinutes": 50,
        "servings": 4,
        "calories": 560,
        "protein": 30.0,
        "fat": 42.0,
        "carbs": 8.0,
        "fiber": 1.0,
        "sodium": 820.0,
        "ingredients": [
            {"name": "Thịt ba chỉ (ba rọi) heo nguyên tảng", "amount": 1000.0, "unit": "g", "notes": "Chọn miếng bì phẳng, nạc mỡ đan xen đều đặn", "orderIndex": 0},
            {"name": "Ngũ vị hương hảo hạng", "amount": 1.0, "unit": "muỗng cà phê", "notes": "Ướp phần thịt thơm lừng", "orderIndex": 1},
            {"name": "Bột tỏi & bột hành tím", "amount": 1.5, "unit": "muỗng canh", "notes": "Ướp thịt không làm cháy khi quay", "orderIndex": 2},
            {"name": "Rượu Mai Quế Lộ hoặc rượu trắng", "amount": 1.5, "unit": "muỗng canh", "notes": "Tăng mùi thơm quyến rũ", "orderIndex": 3},
            {"name": "Dầu hào & hạt tiêu xay", "amount": 1.5, "unit": "muỗng canh", "notes": "Gia vị ướp thịt", "orderIndex": 4},
            {"name": "Giấm trắng tinh luyện", "amount": 2.0, "unit": "muỗng canh", "notes": "Quét lên da kích nổ xốp bì", "orderIndex": 5},
            {"name": "Muối hạt to", "amount": 200.0, "unit": "g", "notes": "Rải phủ kín mặt da hút ẩm khi nướng giai đoạn 1", "orderIndex": 6},
            {"name": "Muối tinh mịn", "amount": 1.0, "unit": "muỗng cà phê", "notes": "Xát đều lên da", "orderIndex": 7},
            {"name": "Dưa kiệu chua & dưa leo ăn kèm", "amount": 150.0, "unit": "g", "notes": "Chống ngấy", "orderIndex": 8},
            {"name": "Nước tương tỏi ớt hoặc tương ớt xí muội", "amount": 1.0, "unit": "chén", "notes": "Chấm thịt quay giòn rụm", "orderIndex": 9}
        ],
        "instructions": [
            {"stepNumber": 1, "title": "Luộc sơ da và xâm bì", "instruction": "Đặt miếng ba chỉ úp mặt bì vào chảo nước sôi có vài lát gừng luộc sơ 3-4 phút cho bì se cứng lại, vớt ra thấm khô kiệt. Dùng dụng cụ xâm bì hoặc bó tăm nhọn xâm thật dày và đều khắp mặt bì (không xâm sâu vào mỡ).", "timerSeconds": 300, "tip": "Xâm bì càng dày và đều thì da khi nướng nổ xốp càng giòn rụm không bị cứng.", "orderIndex": 0},
            {"stepNumber": 2, "title": "Ướp gia vị phần thịt", "instruction": "Khía các rãnh sâu trên phần thịt nạc (không cắt đứt da). Trộn bột tỏi, bột hành, ngũ vị hương, rượu Mai Quế Lộ, dầu hào, tiêu xay xoa đều vào các khe thịt nạc. Tuyệt đối không để gia vị dính vào mặt bì.", "timerSeconds": null, "tip": "Mặt da bị dính ướt gia vị sẽ làm cháy da và mất khả năng nổ giòn.", "orderIndex": 1},
            {"stepNumber": 3, "title": "Sấy khô mặt bì trong tủ lạnh", "instruction": "Quét một lớp giấm trắng mỏng lên mặt bì rồi rắc chút muối tinh. Đặt miếng thịt ngửa mặt bì lên khay, không đậy nắp, cất ngăn mát tủ lạnh ít nhất 4-6 tiếng (hoặc qua đêm) cho mặt da khô cong và trong lại.", "timerSeconds": 18000, "tip": "Bì càng khô kiệt nước thì khi gặp nhiệt độ cao càng nổ phồng rôm rốp.", "orderIndex": 2},
            {"stepNumber": 4, "title": "Nướng giai đoạn 1 với lớp muối hút ẩm", "instruction": "Gói giấy bạc quanh 4 cạnh miếng thịt chỉ để lộ mặt bì. Rải kín một lớp muối hạt dày 1cm phủ kín mặt bì. Cho vào nồi chiên không dầu/lò nướng ở 180°C nướng trong 25 phút. Sau đó lấy ra gạt bỏ sạch toàn bộ lớp muối.", "timerSeconds": 1500, "tip": "Lớp muối hạt hút cạn kiệt lượng nước còn sót lại trong bì heo.", "orderIndex": 3},
            {"stepNumber": 5, "title": "Nướng giai đoạn 2 kích nổ giòn bì", "instruction": "Quét nhẹ thêm lớp giấm mỏng lên mặt da. Tăng nhiệt độ lò lên 200-210°C nướng tiếp trong 20-25 phút. Quan sát thấy lớp bì phồng rộp nổ lách tách nở bung vàng ruộm đều khắp miếng thịt thì lấy ra để nguội 10 phút trước khi chặt miếng.", "timerSeconds": 1500, "tip": "Nghe tiếng da nổ rôm rốp và khi gõ đũa vào thấy tiếng vang giòn đanh là đạt đỉnh cao.", "orderIndex": 4}
        ],
        "imageCaptions": [
            "Miếng thịt heo quay vàng ruộm lớp bì nổ xốp phồng rộp giòn tan bóng bẩy",
            "Thao tác xâm bì heo đều tay tạo hàng nghìn lỗ li ti giúp bì nổ bung rôm rốp",
            "Miếng thịt nướng lớp muối hạt dày hút ẩm trong lò nướng vàng ươm",
            "Đĩa thịt heo quay chặt miếng vuông vắn chấm tương ớt ăn kèm dưa kiệu chua"
        ]
    },
    {
        "title": "Sườn non nướng sốt BBQ mật ong thảo mộc mềm rục",
        "slug": "suon-non-nuong-sot-bbq-mat-ong",
        "description": "Dải sườn non nướng tảng đẫm sốt BBQ mật ong thảo mộc óng ả màu cánh gián, thịt sườn mềm rục róc xương thơm nức mũi hương khói và vị ngọt ngào quyến rũ.",
        "categorySlug": "thit-heo",
        "difficulty": "Easy",
        "prepTimeMinutes": 30,
        "cookTimeMinutes": 60,
        "servings": 4,
        "calories": 590,
        "protein": 36.0,
        "fat": 34.0,
        "carbs": 32.0,
        "fiber": 2.0,
        "sodium": 840.0,
        "ingredients": [
            {"name": "Sườn non heo nguyên dải (pork ribs)", "amount": 1000.0, "unit": "g", "notes": "Sườn non sụn mềm, dải thịt dày", "orderIndex": 0},
            {"name": "Sốt BBQ vị khói (Smoky BBQ sauce)", "amount": 5.0, "unit": "muỗng canh", "notes": "Sốt ướp đậm đà", "orderIndex": 1},
            {"name": "Mật ong hoa nhãn nguyên chất", "amount": 3.0, "unit": "muỗng canh", "notes": "Tạo vị ngọt thanh và màu cánh gián bóng", "orderIndex": 2},
            {"name": "Sốt cà chua ketchup", "amount": 2.0, "unit": "muỗng canh", "notes": "Tạo vị chua ngọt cân bằng", "orderIndex": 3},
            {"name": "Mù tạt vàng Dijon (mustard)", "amount": 1.0, "unit": "muỗng canh", "notes": "Giúp thịt mềm thơm sâu", "orderIndex": 4},
            {"name": "Tỏi băm & hành tây băm nhuyễn", "amount": 40.0, "unit": "g", "notes": "Vắt lấy nước cốt ướp sườn", "orderIndex": 5},
            {"name": "Bột ớt Paprika hun khói", "amount": 1.0, "unit": "muỗng cà phê", "notes": "Tạo màu đỏ hấp dẫn và vị cay nhẹ", "orderIndex": 6},
            {"name": "Lá hương thảo khô (rosemary) hoặc cỏ xạ hương", "amount": 1.0, "unit": "muỗng cà phê", "notes": "Thảo mộc thơm kiểu Âu", "orderIndex": 7},
            {"name": "Bơ lạt đun chảy", "amount": 20.0, "unit": "g", "notes": "Quét bóng mặt sườn", "orderIndex": 8},
            {"name": "Bắp ngọt nướng bơ ăn kèm", "amount": 2.0, "unit": "trái", "notes": "Cắt khúc nướng cùng sườn", "orderIndex": 9}
        ],
        "instructions": [
            {"stepNumber": 1, "title": "Bóc màng sườn và ướp thịt", "instruction": "Sườn rửa sạch lau khô. Dùng mũi dao lách bóc sạch lớp màng mỏng phía sau xương sườn để gia vị ngấm sâu. Trộn sốt BBQ, mật ong, tương cà, mù tạt, bột paprika, lá hương thảo, nước cốt tỏi hành và thoa đều 2 mặt dải sườn, ướp ít nhất 2 giờ.", "timerSeconds": 7200, "tip": "Bóc màng sườn là bí quyết giúp thịt sườn khi nướng chín mềm róc xương không bị dai.", "orderIndex": 0},
            {"stepNumber": 2, "title": "Gói giấy bạc nướng chậm cho sườn mềm rục", "instruction": "Trải 2 lớp giấy bạc lớn, đặt dải sườn vào giữa rưới đẫm sốt ướp rồi gói kín mít không để thoát hơi. Cho vào lò nướng hoặc nồi chiên ở 160°C nướng chậm trong 45 phút.", "timerSeconds": 2700, "tip": "Nướng bọc giấy bạc kín giúp sườn giữ ẩm tuyệt đối chín mềm rã thớ bằng chính nước cốt của thịt.", "orderIndex": 1},
            {"stepNumber": 3, "title": "Pha nước sốt quét bóng caramel", "instruction": "Lấy 2 muỗng sốt BBQ hòa cùng 1 muỗng mật ong và 20g bơ lạt đun chảy khuấy tan làm hỗn hợp sốt quét mặt ngoài sườn.", "timerSeconds": 180, "tip": "Hỗn hợp bơ mật ong tạo lớp men bóng loáng caramel hấp dẫn.", "orderIndex": 2},
            {"stepNumber": 4, "title": "Mở giấy bạc nướng caramen hóa mặt sườn", "instruction": "Cẩn thận mở toang lớp giấy bạc bên trên, chắt bớt nước sườn tiết ra. Dùng cọ quét đẫm lớp sốt bóng bơ mật ong lên mặt sườn. Tăng nhiệt độ lên 200°C nướng trong 10-12 phút cho mặt sườn xém cạnh bóng bẩy.", "timerSeconds": 720, "tip": "Canh chừng để mặt sườn vừa se vàng nâu cánh gián không bị cháy xém quá đà.", "orderIndex": 3},
            {"stepNumber": 5, "title": "Nghỉ thịt và thưởng thức", "instruction": "Lấy dải sườn ra khỏi lò để thịt nghỉ 5 phút cho nước ngọt phân bổ đều lại các thớ thịt. Dùng dao cắt từng dẻ sườn róc xương mềm rục, ăn kèm bắp ngọt nướng bơ và salad khoai tây.", "timerSeconds": 300, "tip": "Thịt sườn mềm đến mức chỉ cần dùng tay khẽ giật nhẹ là xương tuột ra sạch bong.", "orderIndex": 4}
        ],
        "imageCaptions": [
            "Dải sườn non nướng sốt BBQ mật ong cánh gián bóng loáng xém cạnh thơm phức",
            "Thao tác bóc sạch lớp màng sau dải sườn non để gia vị ngấm sâu mềm rục",
            "Sườn nướng bọc giấy bạc ủ chậm trong lò tỏa khói thơm ngào ngạt thảo mộc",
            "Cắt từng dẻ sườn non mọng nước róc xương mềm tan ăn kèm bắp nướng bơ"
        ]
    },
    {
        "title": "Chả lụa truyền thống giòn dai thơm ngát mùi tiêu sọ",
        "slug": "cha-lua-truyen-thong-gion-dai",
        "description": "Món chả lụa quốc hồn quốc túy gói lá chuối xanh ngắt luộc chín thơm lừng, từng khoanh chả cắt ra trắng ngà điểm xuyết lỗ rỗ tổ ong tự nhiên, vị giòn dai sần sật ngọt đậm thịt heo tươi và cay nồng hạt tiêu sọ.",
        "categorySlug": "thit-heo",
        "difficulty": "Hard",
        "prepTimeMinutes": 45,
        "cookTimeMinutes": 50,
        "servings": 8,
        "calories": 280,
        "protein": 22.0,
        "fat": 18.0,
        "carbs": 4.0,
        "fiber": 0.5,
        "sodium": 760.0,
        "ingredients": [
            {"name": "Thịt nạc mông heo nóng dẻo vừa mổ", "amount": 800.0, "unit": "g", "notes": "Thịt còn ấm tay chưa qua rửa nước lạnh để quết chả dai", "orderIndex": 0},
            {"name": "Mỡ phần heo tươi", "amount": 200.0, "unit": "g", "notes": "Tạo độ mềm mướt không khô bã", "orderIndex": 1},
            {"name": "Nước mắm truyền thống cốt nhỉ hảo hạng", "amount": 3.0, "unit": "muỗng canh", "notes": "Hương vị cốt lõi của chả lụa", "orderIndex": 2},
            {"name": "Bột năng hoặc tinh bột bắp", "amount": 20.0, "unit": "g", "notes": "Hỗ trợ kết dính tự nhiên", "orderIndex": 3},
            {"name": "Bột nở (baking powder)", "amount": 5.0, "unit": "g", "notes": "Tạo độ xốp giòn tự nhiên", "orderIndex": 4},
            {"name": "Đường cát trắng", "amount": 1.0, "unit": "muỗng canh", "notes": "Dằn vị mặn", "orderIndex": 5},
            {"name": "Hạt tiêu sọ trắng đập dập", "amount": 1.5, "unit": "muỗng canh", "notes": "Tạo đốm tiêu đen thơm cay nồng", "orderIndex": 6},
            {"name": "Nước đá thật lạnh (nước đá dăm)", "amount": 50.0, "unit": "ml", "notes": "Giữ nhiệt độ thịt luôn lạnh khi xay", "orderIndex": 7},
            {"name": "Lá chuối tươi bánh tẻ", "amount": 500.0, "unit": "g", "notes": "Hơ lửa hoặc chần nước sôi lau sạch", "orderIndex": 8},
            {"name": "Lạt tre hoặc dây buộc giò", "amount": 4.0, "unit": "sợi", "notes": "Buộc đòn chả lụa chặt tay", "orderIndex": 9}
        ],
        "instructions": [
            {"stepNumber": 1, "title": "Sơ chế thịt mỡ và cấp đông", "instruction": "Thịt heo nạc và mỡ cắt nhỏ, trộn đều cùng nước mắm, đường, tiêu sọ, bột năng và bột nở. Trải thịt ra khay bọc kín, cho vào ngăn đông tủ lạnh 2-3 tiếng đến khi thịt dẻo cứng xốp đá dăm nhưng chưa đông cứng.", "timerSeconds": 9000, "tip": "Thịt phải luôn ở trạng thái gần đông đá khi xay để không bị 'chết giò' do ma sát nhiệt.", "orderIndex": 0},
            {"stepNumber": 2, "title": "Xay thịt tốc độ cao thành giò sống", "instruction": "Cho thịt lạnh vào máy xay công suất lớn cùng 50ml nước đá lạnh. Xay ngắt quãng mỗi lần 20 giây rồi dừng, lặp lại 3-4 lần không để cối máy bị nóng. Khi thịt chuyển sang màu hồng nhạt, dẻo quánh bám chặt vào thành cối là giò sống đạt chuẩn.", "timerSeconds": 180, "tip": "Kiểm tra thấy giò sống mịn mượt dẻo quánh như kem là chả sẽ giòn dai hoàn hảo.", "orderIndex": 1},
            {"stepNumber": 3, "title": "Gói chả lụa bằng lá chuối truyền thống", "instruction": "Xếp 3-4 lớp lá chuối đan xen trên mặt phẳng sạch. Đổ khối giò sống vào giữa, khéo léo cuộn tròn lá chuối quanh khối giò nén chặt tay. Gập hai đầu lá chuối lại dựng đứng đòn chả, dùng lạt tre buộc dọc và buộc các vòng tròn ngang thật chắc chắn.", "timerSeconds": 600, "tip": "Buộc vừa đủ chặt để khi luộc giò nở căng đều ôm khít lá chuối.", "orderIndex": 2},
            {"stepNumber": 4, "title": "Luộc chả lụa chín tới ngập nước", "instruction": "Đun sôi nồi nước lớn ngập đòn chả, thả chả lụa vào dựng đứng, đậy kín nắp luộc lửa vừa trong 45-50 phút. Lấy đòn chả ra thả rơi nhẹ xuống đất thấy nảy lên là chả đã chín già.", "timerSeconds": 3000, "tip": "Vớt chả ra treo nơi thoáng mát cho ráo nước và nguội tự nhiên.", "orderIndex": 3},
            {"stepNumber": 5, "title": "Cắt khoanh và thưởng thức", "instruction": "Khi đòn chả nguội hoàn toàn, bóc lớp lá chuối thơm ngát. Dùng dao sắc cắt khoanh chả dày 1.5cm rồi khía 6 miếng tam giác. Mặt cắt chả có màu trắng ngà điểm lỗ rỗ li ti tổ ong, chấm cùng nước mắm cốt nhĩ hạt tiêu hoặc muối tiêu chanh.", "timerSeconds": null, "tip": "Chả lụa có lỗ rỗ li ti là dấu hiệu chứng minh chả làm từ thịt tươi nguyên chất không pha hàn the.", "orderIndex": 4}
        ],
        "imageCaptions": [
            "Khoanh chả lụa cắt lát trắng ngà điểm xuyết lỗ rỗ tổ ong tự nhiên giòn dai",
            "Đòn chả lụa gói lá chuối xanh ngắt buộc lạt tre vuông vức truyền thống",
            "Giò sống quết mịn màng dẻo quánh màu hồng nhạt thơm nức mùi mắm tiêu",
            "Đĩa chả lụa thái cánh hoa bày cùng đĩa muối tiêu chanh và lá chuối tươi"
        ]
    }
]

if __name__ == "__main__":
    print(f"Batch 4 loaded: {len(BATCH_4_RECIPES)} recipes")
