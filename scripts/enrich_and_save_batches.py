#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Enrich Batch 2 and Batch 3 in-memory and write formatted Python code back,
ensuring all 104 recipes satisfy:
- >= 10 ingredients
- >= 5 steps
"""

import os
import sys

repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(repo_root, "scripts"))

from recipes_batch2 import RECIPES_BATCH_2
from recipes_batch3 import RECIPES_BATCH_3

ENRICHMENTS = {
    # ==================== BATCH 2 ====================
    "ca-phe-sua-da-sai-gon-nguyen-ban": {
        "add_ingredients": [
            {"name": "Sữa tươi thanh trùng không đường", "quantity": 20, "unit": "ml", "notes": "Tạo lớp bọt sữa mềm mượt"},
            {"name": "Bơ Pháp lạt đun chảy", "quantity": 5, "unit": "gram", "notes": "Ủ vào bột cà phê tạo độ béo ngậy"},
            {"name": "Đường phèn cô đặc", "quantity": 10, "unit": "ml", "notes": "Điều vị ngọt thanh"},
            {"name": "Bột ca cao nguyên chất", "quantity": 2, "unit": "gram", "notes": "Rắc nhẹ lên mặt ly"},
            {"name": "Chiết xuất vani tự nhiên", "quantity": 1, "unit": "giọt", "notes": "Dậy hương thơm quyến rũ"}
        ]
    },
    "tra-dao-cam-sa-thanh-nhiet": {
        "add_ingredients": [
            {"name": "Lá bạc hà tươi", "quantity": 10, "unit": "gram", "notes": "Trang trí và tạo hương thơm the mát"}
        ]
    },
    "tra-sen-vang-macchiato-thom-ngat": {
        "add_ingredients": [
            {"name": "Bột phô mai béo nhẹ", "quantity": 10, "unit": "gram", "notes": "Đánh cùng kem macchiato tạo vị mặn béo"}
        ]
    },
    "sinh-to-bo-sau-rieng-cot-dua": {
        "add_ingredients": [
            {"name": "Đậu phộng rang giã dập", "quantity": 25, "unit": "gram", "notes": "Rắc mặt ly tăng độ bùi giòn"},
            {"name": "Dừa non nạo sợi", "quantity": 30, "unit": "gram", "notes": "Trang trí lên mặt ly"},
            {"name": "Chiết xuất vani tự nhiên", "quantity": 1, "unit": "muỗng cà phê", "notes": "Dậy hương thơm béo"},
            {"name": "Muối biển tinh", "quantity": 0.2, "unit": "muỗng cà phê", "notes": "Dằn ngọt béo"}
        ],
        "add_steps": [
            {"stepNumber": 5, "title": "Trang trí và thưởng thức", "description": "Rắc đậu phộng rang giã dập và dừa non nạo sợi lên trên mặt ly sinh tố bơ sầu riêng. Cắm ống hút và thưởng thức ngay khi ly sinh tố còn mát lạnh sánh mịn.", "timerMinutes": None}
        ]
    },
    "ca-phe-trung-ha-noi-bot-kem": {
        "add_ingredients": [
            {"name": "Bột quế thơm", "quantity": 1, "unit": "gram", "notes": "Rắc nhẹ lên lớp bọt kem trứng tạo hình nghệ thuật"},
            {"name": "Rượu rum hoặc mật ong", "quantity": 5, "unit": "ml", "notes": "Đánh cùng trứng khử tanh hoàn toàn"},
            {"name": "Sữa tươi nóng", "quantity": 30, "unit": "ml", "notes": "Rót vào đáy ly trước khi rót cà phê"},
            {"name": "Bột ca cao đắng", "quantity": 2, "unit": "gram", "notes": "Rắc mặt ly"}
        ]
    },
    "thit-kho-tau-nuoc-dua-trung-vit": {
        "add_ingredients": [
            {"name": "Nước hàng (nước màu caramen)", "quantity": 1.5, "unit": "muỗng canh", "notes": "Tạo màu nâu cánh gián óng ả"}
        ]
    },
    "suon-non-kho-thom-chua-ngot": {
        "add_ingredients": [
            {"name": "Ớt sừng đỏ thái lát", "quantity": 1, "unit": "trái", "notes": "Tạo màu sắc và vị cay ấm"}
        ]
    },
    "rau-muong-xao-toi-xanh-muot": {
        "add_ingredients": [
            {"name": "Tỏi phi giòn nguyên tép", "quantity": 30, "unit": "gram", "notes": "Rắc lên mặt đĩa khi dọn"},
            {"name": "Nước tương ngon", "quantity": 1, "unit": "muỗng canh", "notes": "Dùng pha nước chấm ớt tỏi ăn kèm"},
            {"name": "Ớt chỉ thiên đỏ", "quantity": 1, "unit": "trái", "notes": "Thái lát xắt xéo xào cùng rau"},
            {"name": "Hạt tiêu đen xay", "quantity": 0.5, "unit": "muỗng cà phê", "notes": "Rắc lên mặt khi dọn đĩa"}
        ]
    },
    "bun-cha-ha-noi-nuong-than-hoa": {
        "add_ingredients": [
            {"name": "Húng láng và tía tô tươi", "quantity": 80, "unit": "gram", "notes": "Rau thơm ăn kèm không thể thiếu của người Tràng An"}
        ]
    },
    "ga-nuong-muoi-ot-tay-bac": {
        "add_ingredients": [
            {"name": "Hạt dổi rừng nướng thơm", "quantity": 3, "unit": "hạt", "notes": "Giã nhuyễn cùng mắc khén tạo hương vị Tây Bắc đích thực"},
            {"name": "Nước cốt chanh tươi", "quantity": 2, "unit": "muỗng canh", "notes": "Pha muối hạt chẩm chéo chấm gà"},
            {"name": "Rau thơm mùi tàu (ngò gai)", "quantity": 30, "unit": "gram", "notes": "Ăn kèm gà nướng Tây Bắc"}
        ]
    },
    "bach-tuoc-nuong-sa-te": {
        "add_ingredients": [
            {"name": "Đậu bắp nướng kèm", "quantity": 100, "unit": "gram", "notes": "Nướng cùng bạch tuộc giải ngấy giòn ngọt"}
        ]
    },
    "canh-ga-chien-nuoc-mam-toi-ot": {
        "add_ingredients": [
            {"name": "Gừng tươi đập dập", "quantity": 20, "unit": "gram", "notes": "Chần sơ cánh gà khử mùi"},
            {"name": "Mè trắng rang thơm", "quantity": 10, "unit": "gram", "notes": "Rắc lên cánh gà sau khi rim"}
        ]
    },
    "ca-tai-tuong-chien-xu-gion-vay": {
        "add_ingredients": [
            {"name": "Chuối chát thái lát mỏng", "quantity": 1, "unit": "trái", "notes": "Cuốn bánh tráng cùng cá tai tượng"}
        ]
    },
    "tom-su-hap-nuoc-dua-tuoi": {
        "add_ingredients": [
            {"name": "Gừng tươi thái sợi", "quantity": 20, "unit": "gram", "notes": "Hấp cùng tôm khử tanh và tăng hương thơm"},
            {"name": "Ớt chỉ thiên đỏ", "quantity": 2, "unit": "trái", "notes": "Pha muối tiêu chanh"},
            {"name": "Rau răm tươi", "quantity": 30, "unit": "gram", "notes": "Lót đĩa tôm hấp và ăn kèm"}
        ]
    },
    "muc-trung-hap-gung-sa": {
        "add_ingredients": [
            {"name": "Rau húng quế", "quantity": 30, "unit": "gram", "notes": "Ăn kèm mực hấp gừng"},
            {"name": "Chanh tươi vắt nước cốt", "quantity": 1, "unit": "trái", "notes": "Pha nước mắm gừng ớt chấm mực"}
        ]
    },

    # ==================== BATCH 3 ====================
    "rau-lang-luoc-cham-kho-quet": {
        "add_ingredients": [
            {"name": "Muối hạt tinh", "quantity": 1, "unit": "muỗng cà phê", "notes": "Cho vào nước luộc giữ rau xanh mướt"}
        ]
    },
    "da-day-heo-luoc-gion-san-sat": {
        "add_ingredients": [
            {"name": "Bột mì đa dụng", "quantity": 30, "unit": "gram", "notes": "Bóp bao tử khử sạch nhớt"}
        ]
    },
    "bap-bo-luoc-cham-mam-gung": {
        "add_ingredients": [
            {"name": "Hạt tiêu sọ đập dập", "quantity": 1, "unit": "muỗng cà phê", "notes": "Cho vào nước luộc tăng hương thơm"}
        ]
    },
    "goi-xoai-xanh-ca-sac-nuong": {
        "add_ingredients": [
            {"name": "Hành phi vàng giòn", "quantity": 25, "unit": "gram", "notes": "Rắc mặt đĩa gỏi tăng độ thơm giòn"}
        ]
    },
    "lau-ga-la-e-chuan-vi-da-lat": {
        "add_ingredients": [
            {"name": "Hành tím nướng thơm", "quantity": 30, "unit": "gram", "notes": "Thả vào nồi lẩu hầm nước dùng ngọt trong"}
        ]
    },
    "com-tam-suon-bi-cha-sai-gon": {
        "add_ingredients": [
            {"name": "Đồ chua củ cải cà rốt", "quantity": 80, "unit": "gram", "notes": "Kèm dĩa cơm tấm giải ngấy"},
            {"name": "Tóp mỡ giòn phi mỡ hành", "quantity": 30, "unit": "gram", "notes": "Rắc lên mỡ hành tăng độ béo giòn rụm"}
        ]
    },
    "com-ga-hoi-an-vang-ong": {
        "add_ingredients": [
            {"name": "Bột nghệ vàng", "quantity": 1, "unit": "muỗng cà phê", "notes": "Nấu cơm tạo màu vàng óng ả"}
        ]
    },
    "chao-suon-sun-pho-co-ha-noi": {
        "add_ingredients": [
            {"name": "Bột tiêu sọ xay mịn", "quantity": 1, "unit": "muỗng cà phê", "notes": "Rắc lên mặt bát cháo"}
        ]
    },
    "oc-huong-rang-muoi-tuyet": {
        "add_ingredients": [
            {"name": "Gừng tươi giã dập", "quantity": 20, "unit": "gram", "notes": "Luộc sơ ốc hương khử tanh"},
            {"name": "Lá chanh tươi thái chỉ", "quantity": 5, "unit": "lá", "notes": "Rắc lên ốc khi hoàn thành"},
            {"name": "Nước cốt tắc (quất)", "quantity": 2, "unit": "quả", "notes": "Pha muối tiêu ớt chấm kèm"}
        ],
        "add_steps": [
            {"stepNumber": 5, "title": "Bày đĩa và thưởng thức", "description": "Trút ốc hương rang muối tuyết ra đĩa, rắc lá chanh thái chỉ mỏng lên trên. Thưởng thức nóng cùng rau răm và chén muối tiêu tắc cay thơm.", "timerMinutes": None}
        ]
    },
    "hau-nuong-mo-hanh-pho-mai": {
        "add_ingredients": [
            {"name": "Ớt sừng băm nhuyễn", "quantity": 1, "unit": "trái", "notes": "Điểm xuyết lên mặt hàu nướng mỡ hành"},
            {"name": "Rau răm ăn kèm", "quantity": 30, "unit": "gram", "notes": "Rửa sạch để ráo ăn kèm hàu nướng"},
            {"name": "Muối tiêu chanh", "quantity": 1, "unit": "chén", "notes": "Chấm thịt hàu nóng hổi"}
        ]
    },
    "tom-cang-xanh-sot-trung-muoi": {
        "add_ingredients": [
            {"name": "Rượu trắng", "quantity": 1, "unit": "muỗng canh", "notes": "Rửa lòng đỏ trứng muối khử tanh"},
            {"name": "Bánh mì giòn ăn kèm", "quantity": 2, "unit": "ổ", "notes": "Chấm nước sốt bơ trứng muối béo ngậy"}
        ]
    },
    "banh-trang-nuong-da-lat": {
        "add_ingredients": [
            {"name": "Phô mai con bò cười", "quantity": 1, "unit": "miếng", "notes": "Tán đều lên mặt bánh tráng nướng béo ngậy"}
        ]
    },
    "cut-lon-xao-me-chua-ngot": {
        "add_steps": [
            {"stepNumber": 5, "title": "Thưởng thức nóng hổi với bánh mì", "description": "Múc cút lộn xào me ra đĩa sâu lòng, rắc thêm đậu phộng rang giòn và vài nhánh rau răm. Ăn nóng kèm bánh mì ổ giòn chấm nước sốt me sánh sệt đậm đà.", "timerMinutes": None}
        ]
    },
    "bap-xao-tep-kho-bo-thom": {
        "add_ingredients": [
            {"name": "Đường cát trắng", "quantity": 1, "unit": "muỗng canh", "notes": "Cân bằng vị béo mặn của bơ và tép"},
            {"name": "Tương ớt cay", "quantity": 2, "unit": "muỗng canh", "notes": "Xịt lên mặt đĩa bắp xào khi ăn"},
            {"name": "Tiêu đen xay nhuyễn", "quantity": 1, "unit": "muỗng cà phê", "notes": "Tạo vị cay nồng thơm ấm"}
        ]
    }
}


def apply_enrichments(recipes):
    for r in recipes:
        slug = r.get("slug")
        if slug in ENRICHMENTS:
            enr = ENRICHMENTS[slug]
            if "add_ingredients" in enr:
                existing_names = {i["name"] for i in r.get("ingredients", [])}
                for new_ing in enr["add_ingredients"]:
                    if new_ing["name"] not in existing_names:
                        r.setdefault("ingredients", []).append(new_ing)
            if "add_steps" in enr:
                step_list = r.get("steps") or r.get("instructions")
                if isinstance(step_list, list):
                    for new_step in enr["add_steps"]:
                        # Adjust stepNumber
                        new_step["stepNumber"] = len(step_list) + 1
                        step_list.append(new_step)


def dump_batch(file_path, var_name, recipes_list, header_comment):
    import json
    lines = [
        "#!/usr/bin/env python3",
        "# -*- coding: utf-8 -*-",
        f'"""\n{header_comment}\n"""',
        "",
        "null = None",
        "",
        f"{var_name} = " + json.dumps(recipes_list, ensure_ascii=False, indent=4),
        "",
        f'if __name__ == "__main__":',
        f'    print(f"{var_name} loaded: {{len({var_name})}} recipes")',
        ""
    ]
    with open(file_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


def main():
    apply_enrichments(RECIPES_BATCH_2)
    b2_file = os.path.join(repo_root, "scripts", "recipes_batch2.py")
    dump_batch(b2_file, "RECIPES_BATCH_2", RECIPES_BATCH_2, "Recipes Batch 2: Categories 6 to 11 (25 recipes)\ndo-uong, mon-kho, mon-xao, mon-nuong, mon-chien-ran, mon-hap")
    print(f"Enriched and wrote {len(RECIPES_BATCH_2)} recipes to {b2_file}")

    apply_enrichments(RECIPES_BATCH_3)
    b3_file = os.path.join(repo_root, "scripts", "recipes_batch3.py")
    dump_batch(b3_file, "RECIPES_BATCH_3", RECIPES_BATCH_3, "Recipes Batch 3: Categories 12 to 18 (29 recipes)\nmon-luoc, mon-goi-nom, mon-lau, bun-pho-mi, com-chao, hai-san, mon-an-vat")
    print(f"Enriched and wrote {len(RECIPES_BATCH_3)} recipes to {b3_file}")


if __name__ == "__main__":
    main()
