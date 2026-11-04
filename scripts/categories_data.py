#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Canonical categories definition for Culinary Blog.
Contains 25 categories meeting R1 and Home page requirements.
"""

CATEGORIES = [
    {
        "name": "Món khai vị",
        "slug": "mon-khai-vi",
        "description": "Các món khai vị nhẹ nhàng, tinh tế đánh thức vị giác đầu bữa tiệc như gỏi cuốn tôm thịt, nem rán, súp cua và các món nộm thanh mát.",
        "orderIndex": 1
    },
    {
        "name": "Món chính",
        "slug": "mon-chinh",
        "description": "Các món ăn giàu đạm và dinh dưỡng, đậm đà phong vị Việt và quốc tế, là tâm điểm ấm cúng trong mỗi bữa cơm gia đình.",
        "orderIndex": 2
    },
    {
        "name": "Canh & Súp",
        "slug": "canh-sup",
        "description": "Những tô canh nóng hổi, thanh mát từ xương hầm và rau củ nhiệt đới tươi non, bồi bổ sức khỏe và xua tan mệt mỏi.",
        "orderIndex": 3
    },
    {
        "name": "Món chay",
        "slug": "mon-chay",
        "description": "Thanh tịnh và giàu dinh dưỡng từ nấm tươi, đậu hũ và rau củ quả thuần khiết mang lại sự an lành và cân bằng thể chất.",
        "orderIndex": 4
    },
    {
        "name": "Tráng miệng",
        "slug": "trang-mieng",
        "description": "Các món ngọt nhẹ nhàng, tươi mát khép lại bữa ăn hoàn mỹ với chè ba miền, sữa chua dẻo, bánh flan và hoa quả tươi.",
        "orderIndex": 5
    },
    {
        "name": "Đồ uống",
        "slug": "do-uong",
        "description": "Thức uống giải nhiệt sảng khoái từ các loại trà hoa quả nhiệt đới, cà phê sữa đá đậm đà và sinh tố tươi mát.",
        "orderIndex": 6
    },
    {
        "name": "Món kho",
        "slug": "mon-kho",
        "description": "Các món kho đậm đà màu cánh gián, vị mặn ngọt hài hòa đặc trưng của thịt kho tàu nước dừa, cá lóc kho tộ ăn kèm cơm trắng nóng hổi.",
        "orderIndex": 7
    },
    {
        "name": "Món xào",
        "slug": "mon-xao",
        "description": "Các món xào giòn ngọt trên lửa lớn, giữ trọn vẹn vitamin và sắc màu tươi sáng tự nhiên của rau củ tươi cùng hải sản, thịt bò.",
        "orderIndex": 8
    },
    {
        "name": "Món nướng",
        "slug": "mon-nuong",
        "description": "Các món nướng thơm nức mũi trên than hoa rực hồng, tẩm ướp gia vị sả ớt, mật ong và thảo mộc đậm đà khó cưỡng.",
        "orderIndex": 9
    },
    {
        "name": "Món chiên & rán",
        "slug": "mon-chien-ran",
        "description": "Lớp vỏ ngoài giòn rụm màu vàng ruộm, bên trong giữ nguyên độ mềm ẩm, ăn kèm rau sống tươi sạch và nước chấm chua ngọt.",
        "orderIndex": 10
    },
    {
        "name": "Món hấp",
        "slug": "mon-hap",
        "description": "Các món hấp thanh tao và bổ dưỡng, lưu giữ nguyên vẹn độ ngọt tự nhiên, độ tươi ngon và dưỡng chất quý giá của món ăn.",
        "orderIndex": 11
    },
    {
        "name": "Món luộc",
        "slug": "mon-luoc",
        "description": "Các món luộc mộc mạc, thuần túy, đề cao độ tươi ngọt tự nhiên của thịt và rau xanh, chấm cùng nước mắm tỏi ớt hoặc kho quẹt đậm đà.",
        "orderIndex": 12
    },
    {
        "name": "Món gỏi & nộm",
        "slug": "mon-goi-nom",
        "description": "Các món gỏi nộm giòn sần sật, hòa quyện bốn vị chua cay mặn ngọt hài hòa kích thích vị giác và chống ngấy hiệu quả.",
        "orderIndex": 13
    },
    {
        "name": "Món lẩu",
        "slug": "mon-lau",
        "description": "Nồi lẩu ấm nồng cho những dịp sum họp, nước lẩu chua cay hoặc ngọt thanh từ xương, phong phú các loại hải sản, thịt và rau nhúng tươi.",
        "orderIndex": 14
    },
    {
        "name": "Bún - Phở - Mì",
        "slug": "bun-pho-mi",
        "description": "Chứa đựng linh hồn ẩm thực truyền thống với nước dùng ninh từ xương ống hồi quế thơm ngát, sợi bánh mềm dai đặc trưng ba miền.",
        "orderIndex": 15
    },
    {
        "name": "Cơm & Cháo",
        "slug": "com-chao",
        "description": "Bình dị, chắc bụng từ cơm tấm sườn nướng, cơm chiên ngọc bích đến các tô cháo sườn, cháo hải sản ấm lòng xua tan giá lạnh.",
        "orderIndex": 16
    },
    {
        "name": "Hải sản",
        "slug": "hai-san",
        "description": "Hải sản tươi rói mang hương vị mặn mòi của biển khơi từ tôm sú, cua biển, cá mú, mực trứng chế biến hấp, nướng, xào đậm đà.",
        "orderIndex": 17
    },
    {
        "name": "Món ăn vặt",
        "slug": "mon-an-vat",
        "description": "Các món ăn vặt đường phố hấp dẫn, vui miệng như bánh tráng nướng, bánh tráng trộn, cút lộn xào me gắn liền với ký ức tuổi trẻ.",
        "orderIndex": 18
    },
    {
        "name": "Bánh ngọt & mặn",
        "slug": "banh-ngot",
        "description": "Các loại bánh nướng thơm lừng mùi bơ, vani và thảo mộc với kết cấu mềm xốp hoặc giòn tan làm say đắm lòng người.",
        "orderIndex": 19
    },
    {
        "name": "Ẩm thực Miền Bắc",
        "slug": "am-thuc-mien-bac",
        "description": "Nổi tiếng với nét tinh tế, vị thanh nhẹ vừa vặn không quá cay nồng, lưu giữ hồn cốt đất kinh kỳ ngàn năm văn hiến.",
        "orderIndex": 20
    },
    {
        "name": "Ẩm thực Miền Trung",
        "slug": "am-thuc-mien-trung",
        "description": "Đậm đà, màu sắc rực rỡ và cay nồng đặc sắc với bún bò Huế, mì Quảng, nem nướng và các món mắm trứ danh miền cát trắng.",
        "orderIndex": 21
    },
    {
        "name": "Ẩm thực Miền Nam",
        "slug": "am-thuc-mien-nam",
        "description": "Hào sảng, phóng khoáng kết hợp vị ngọt tự nhiên của nước dừa, đường thốt nốt và rau đồng trù phú phù sa đồng bằng sông Cửu Long.",
        "orderIndex": 22
    },
    {
        "name": "Gia cầm",
        "slug": "gia-cam",
        "description": "Thịt ngọt da giòn từ gà thả vườn, vịt cỏ, bồ câu nấu chao, nướng muối ớt hay luộc lá chanh truyền thống bổ dưỡng.",
        "orderIndex": 23
    },
    {
        "name": "Thịt bò",
        "slug": "thit-bo",
        "description": "Thịt bò mềm ngọt giàu dưỡng chất, biến hóa đa dạng từ bò lúc lắc, bít tết sốt tiêu, bò sốt vang đến phở bò tái lăn trứ danh.",
        "orderIndex": 24
    },
    {
        "name": "Thịt heo",
        "slug": "thit-heo",
        "description": "Nguyên liệu quen thuộc hàng đầu mâm cơm Việt với thịt kho tàu, sườn nướng mật ong, chả lụa và ba chỉ luộc giòn rụm.",
        "orderIndex": 25
    }
]
