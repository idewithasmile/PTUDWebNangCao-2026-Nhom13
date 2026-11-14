import os
import re
import sys
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

sys.stdout.reconfigure(encoding='utf-8')

def set_cell_background(cell, fill_hex):
    """Đặt màu nền cho ô trong bảng"""
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    """Đặt lề trong cho ô (padding)"""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'''
        <w:tcMar {nsdecls("w")}>
            <w:top w:w="{top}" w:type="dxa"/>
            <w:bottom w:w="{bottom}" w:type="dxa"/>
            <w:left w:w="{left}" w:type="dxa"/>
            <w:right w:w="{right}" w:type="dxa"/>
        </w:tcMar>
    ''')
    tcPr.append(tcMar)

def set_table_borders(table, color="D3D3D3", sz="4", val="single"):
    """Đặt viền thanh lịch cho bảng"""
    tblPr = table._tbl.tblPr
    borders = parse_xml(f'''
        <w:tblBorders {nsdecls("w")}>
            <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideV w:val="none"/>
            <w:left w:val="none"/>
            <w:right w:val="none"/>
        </w:tblBorders>
    ''')
    tblPr.append(borders)

def add_code_block(doc, code_lines):
    """Thêm khối code block với font chữ lập trình và nền xám"""
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Inches(0.25)
    p.paragraph_format.right_indent = Inches(0.25)
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.05

    # Đặt background xám cho paragraph
    pPr = p._p.get_or_add_pPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="F4F6F9"/>')
    pPr.append(shd)
    
    # Border trái màu cam
    pBdr = parse_xml(f'''
        <w:pBdr {nsdecls("w")}>
            <w:left w:val="single" w:sz="18" w:space="8" w:color="EA580C"/>
            <w:top w:val="none"/>
            <w:right w:val="none"/>
            <w:bottom w:val="none"/>
        </w:pBdr>
    ''')
    pPr.append(pBdr)

    full_code = "\n".join(code_lines)
    run = p.add_run(full_code)
    run.font.name = 'Consolas'
    run.font.size = Pt(9.0)
    run.font.color.rgb = RGBColor(30, 41, 59)

def format_inline_text(paragraph, text, base_font_size=10.5, is_italic_base=False):
    """Hàm phân tích cú pháp inline markdown: **bold**, *italic*, `code`, math $...$"""
    # Xóa ký hiệu math LaTeX đơn giản
    clean_text = text
    clean_text = clean_text.replace(r'\text{', '').replace(r'}', '')
    clean_text = clean_text.replace(r'\rightarrow', '➔').replace(r'\longleftarrow', '⟵')
    clean_text = clean_text.replace(r'\le', '≤').replace(r'\ge', '≥')
    clean_text = clean_text.replace(r'\times', '×').replace(r'\dots', '...')
    clean_text = clean_text.replace(r'\mathbf{', '').replace('$', '')

    # Regex bắt: `code`, **bold**, *italic*, [link](url)
    pattern = re.compile(r'(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))')
    tokens = pattern.split(clean_text)

    for token in tokens:
        if not token:
            continue
        
        # Inline code `...`
        if token.startswith('`') and token.endswith('`') and len(token) >= 2:
            code_str = token[1:-1]
            run = paragraph.add_run(code_str)
            run.font.name = 'Consolas'
            run.font.size = Pt(base_font_size - 0.5)
            run.font.color.rgb = RGBColor(194, 65, 12) # Cam đậm
            # Highlight nhẹ
            continue
            
        # Bold **...**
        if token.startswith('**') and token.endswith('**') and len(token) >= 4:
            bold_str = token[2:-2]
            run = paragraph.add_run(bold_str)
            run.font.name = 'Times New Roman'
            run.font.size = Pt(base_font_size)
            run.bold = True
            if is_italic_base:
                run.italic = True
            continue

        # Italic *...*
        if token.startswith('*') and token.endswith('*') and len(token) >= 2:
            italic_str = token[1:-1]
            run = paragraph.add_run(italic_str)
            run.font.name = 'Times New Roman'
            run.font.size = Pt(base_font_size)
            run.italic = True
            continue

        # Link [text](url)
        link_match = re.match(r'\[([^\]]+)\]\(([^)]+)\)', token)
        if link_match:
            link_text = link_match.group(1)
            run = paragraph.add_run(link_text)
            run.font.name = 'Times New Roman'
            run.font.size = Pt(base_font_size)
            run.font.color.rgb = RGBColor(2, 132, 199) # Xanh dương
            run.underline = True
            continue

        # Text thông thường
        run = paragraph.add_run(token)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(base_font_size)
        if is_italic_base:
            run.italic = True

def add_markdown_table(doc, table_lines):
    """Phân tích cú pháp bảng Markdown và tạo bảng Word chuyên nghiệp"""
    # Lọc bỏ dòng separator |---|---|
    rows_data = []
    for line in table_lines:
        line_clean = line.strip()
        if not line_clean.startswith('|') or not line_clean.endswith('|'):
            continue
        cells = [c.strip() for c in line_clean[1:-1].split('|')]
        # Bỏ qua separator
        if all(re.match(r'^:?-+:?$', c) for c in cells):
            continue
        rows_data.append(cells)

    if not rows_data:
        return

    num_rows = len(rows_data)
    num_cols = max(len(r) for r in rows_data)

    table = doc.add_table(rows=num_rows, cols=num_cols)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(table, color="D1D5DB", sz="6")

    for row_idx, row in enumerate(rows_data):
        is_header = (row_idx == 0)
        table_row = table.rows[row_idx]
        
        # Lặp lại header nếu qua trang
        trPr = table_row._tr.get_or_add_trPr()
        if is_header:
            trPr.append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))

        for col_idx, cell_text in enumerate(row):
            if col_idx < len(table_row.cells):
                cell = table_row.cells[col_idx]
                cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
                set_cell_margins(cell, top=100, bottom=100, left=120, right=120)

                p = cell.paragraphs[0]
                p.paragraph_format.space_before = Pt(2)
                p.paragraph_format.space_after = Pt(2)
                p.paragraph_format.line_spacing = 1.1

                if is_header:
                    set_cell_background(cell, "1E293B") # Slate 800
                    run = p.add_run(cell_text)
                    run.font.name = 'Times New Roman'
                    run.font.size = Pt(9.5)
                    run.bold = True
                    run.font.color.rgb = RGBColor(255, 255, 255)
                    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                else:
                    # Xen kẽ màu dòng
                    if row_idx % 2 == 1:
                        set_cell_background(cell, "F8FAFC")
                    else:
                        set_cell_background(cell, "FFFFFF")
                    format_inline_text(p, cell_text, base_font_size=9.5)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

def convert_md_to_docx(md_path, docx_path):
    doc = docx.Document()

    # Thiết lập lề A4
    for section in doc.sections:
        section.top_margin = Inches(0.75)
        section.bottom_margin = Inches(0.75)
        section.left_margin = Inches(0.85)
        section.right_margin = Inches(0.85)
        
        # Footer: Số trang
        footer = section.footer
        f_p = footer.paragraphs[0]
        f_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        f_run = f_p.add_run("Trang ")
        f_run.font.name = 'Times New Roman'
        f_run.font.size = Pt(9)
        f_run.font.color.rgb = RGBColor(100, 116, 139)
        
        # Thêm field PAGE
        fldSimple = parse_xml(r'<w:fldSimple %s w:instr="PAGE"/>' % nsdecls('w'))
        f_p._p.append(fldSimple)
        
        f_run2 = f_p.add_run(" | Nhóm 13 - Culinary Blog - Đồ Án PTUD Web Nâng Cao")
        f_run2.font.name = 'Times New Roman'
        f_run2.font.size = Pt(9)
        f_run2.font.color.rgb = RGBColor(148, 163, 184)

    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    in_code_block = False
    code_lines = []
    in_table = False
    table_lines = []

    for line in lines:
        raw_line = line.rstrip('\r\n')
        stripped = raw_line.strip()

        # 1. Xử lý Code Block
        if stripped.startswith('```'):
            if in_code_block:
                add_code_block(doc, code_lines)
                code_lines = []
                in_code_block = False
            else:
                if in_table:
                    add_markdown_table(doc, table_lines)
                    table_lines = []
                    in_table = False
                in_code_block = True
                code_lines = []
            continue

        if in_code_block:
            code_lines.append(raw_line)
            continue

        # 2. Xử lý Bảng (Table)
        if stripped.startswith('|') and stripped.endswith('|'):
            in_table = True
            table_lines.append(stripped)
            continue
        else:
            if in_table:
                add_markdown_table(doc, table_lines)
                table_lines = []
                in_table = False

        # 3. Dòng trống
        if not stripped:
            continue

        # 4. Phân cách ngang ---
        if stripped in ('---', '***', '___'):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(4)
            p.paragraph_format.space_after = Pt(6)
            pBdr = parse_xml(f'''
                <w:pBdr {nsdecls("w")}>
                    <w:bottom w:val="single" w:sz="6" w:space="1" w:color="CBD5E1"/>
                </w:pBdr>
            ''')
            p._p.get_or_add_pPr().append(pBdr)
            continue

        # 5. Headings
        if stripped.startswith('# '):
            title_text = stripped[2:].strip()
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(16)
            p.paragraph_format.space_after = Pt(8)
            p.paragraph_format.keep_with_next = True
            run = p.add_run(title_text)
            run.font.name = 'Times New Roman'
            run.font.size = Pt(18)
            run.bold = True
            run.font.color.rgb = RGBColor(154, 52, 18) # Cam đậm đất
            continue

        if stripped.startswith('## '):
            h2_text = stripped[3:].strip()
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(14)
            p.paragraph_format.space_after = Pt(6)
            p.paragraph_format.keep_with_next = True
            run = p.add_run(h2_text)
            run.font.name = 'Times New Roman'
            run.font.size = Pt(15)
            run.bold = True
            run.font.color.rgb = RGBColor(30, 41, 59) # Slate 800
            continue

        if stripped.startswith('### '):
            h3_text = stripped[4:].strip()
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(11)
            p.paragraph_format.space_after = Pt(4)
            p.paragraph_format.keep_with_next = True
            run = p.add_run(h3_text)
            run.font.name = 'Times New Roman'
            run.font.size = Pt(12.5)
            run.bold = True
            run.font.color.rgb = RGBColor(194, 65, 12) # Cam tiêu đề câu hỏi
            continue

        if stripped.startswith('#### '):
            h4_text = stripped[5:].strip()
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(8)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.keep_with_next = True
            run = p.add_run(h4_text)
            run.font.name = 'Times New Roman'
            run.font.size = Pt(11)
            run.bold = True
            run.font.color.rgb = RGBColor(51, 65, 85) # Slate 700
            continue

        # 6. Blockquote (> ...)
        if stripped.startswith('> '):
            quote_text = stripped[2:].strip()
            p = doc.add_paragraph()
            p.paragraph_format.left_indent = Inches(0.3)
            p.paragraph_format.right_indent = Inches(0.2)
            p.paragraph_format.space_before = Pt(3)
            p.paragraph_format.space_after = Pt(4)
            pBdr = parse_xml(f'''
                <w:pBdr {nsdecls("w")}>
                    <w:left w:val="single" w:sz="14" w:space="6" w:color="94A3B8"/>
                </w:pBdr>
            ''')
            p._p.get_or_add_pPr().append(pBdr)
            format_inline_text(p, quote_text, base_font_size=10.0, is_italic_base=True)
            continue

        # 7. Bullet lists (- hoặc *)
        bullet_match = re.match(r'^(\s*)[-*]\s+(.*)$', raw_line)
        if bullet_match:
            indent_spaces = len(bullet_match.group(1))
            bullet_text = bullet_match.group(2)
            p = doc.add_paragraph()
            p.paragraph_format.left_indent = Inches(0.25 + (indent_spaces // 2) * 0.2)
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.15
            
            bullet_char = "• " if indent_spaces < 2 else "◦ "
            run_b = p.add_run(bullet_char)
            run_b.font.name = 'Times New Roman'
            run_b.font.size = Pt(10.5)
            run_b.bold = True
            run_b.font.color.rgb = RGBColor(234, 88, 12)
            format_inline_text(p, bullet_text, base_font_size=10.5)
            continue

        # 8. Numbered lists (1. , 2. )
        num_match = re.match(r'^(\s*)(\d+)\.\s+(.*)$', raw_line)
        if num_match:
            indent_spaces = len(num_match.group(1))
            num_str = num_match.group(2)
            num_text = num_match.group(3)
            p = doc.add_paragraph()
            p.paragraph_format.left_indent = Inches(0.25 + (indent_spaces // 2) * 0.2)
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.15

            run_n = p.add_run(f"{num_str}. ")
            run_n.font.name = 'Times New Roman'
            run_n.font.size = Pt(10.5)
            run_n.bold = True
            format_inline_text(p, num_text, base_font_size=10.5)
            continue

        # 9. Đoạn văn thông thường (Normal paragraph)
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.15
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        format_inline_text(p, stripped, base_font_size=10.5)

    # Đóng nếu còn table/code dở
    if in_table and table_lines:
        add_markdown_table(doc, table_lines)
    if in_code_block and code_lines:
        add_code_block(doc, code_lines)

    doc.save(docx_path)
    print(f"Document successfully created at: {docx_path}")

if __name__ == "__main__":
    md_file = r"F:\PTUDWebNangCao_2026_Nhom13\DAP_AN_ON_TAP_THI_CUOI_KY_CULINARY_BLOG.md"
    docx_file = r"F:\PTUDWebNangCao_2026_Nhom13\DAP_AN_ON_TAP_THI_CUOI_KY_CULINARY_BLOG.docx"
    convert_md_to_docx(md_file, docx_file)
