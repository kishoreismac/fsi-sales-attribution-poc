from pathlib import Path

import fitz


OUT = Path("docs/FSI_Sales_Attribution_Sell_Sheet.pdf")
QA_DIR = Path("docs/sell_sheet_qa")

W, H = 612, 792
M = 48

NAVY = (7 / 255, 27 / 255, 51 / 255)
INK = (26 / 255, 28 / 255, 28 / 255)
MUTED = (88 / 255, 103 / 255, 122 / 255)
RED = (233 / 255, 28 / 255, 36 / 255)
RED_DARK = (191 / 255, 0, 20 / 255)
TEAL = (22 / 255, 166 / 255, 166 / 255)
BLUE = (47 / 255, 108 / 255, 230 / 255)
GREEN = (40 / 255, 167 / 255, 69 / 255)
ORANGE = (245 / 255, 111 / 255, 24 / 255)
LIGHT = (248 / 255, 249 / 255, 251 / 255)
CARD = (1, 1, 1)
BORDER = (213 / 255, 222 / 255, 234 / 255)
SOFT_BLUE = (236 / 255, 244 / 255, 255 / 255)
SOFT_RED = (255 / 255, 235 / 255, 235 / 255)
SOFT_GREEN = (232 / 255, 247 / 255, 239 / 255)


def rect(x, y, w, h):
    return fitz.Rect(x, y, x + w, y + h)


def text(page, box, value, size=10, color=INK, bold=False, align=0, lineheight=None):
    fontname = "Helvetica-Bold" if bold else "Helvetica"
    current_size = size
    current_lineheight = lineheight or 1.05
    for _ in range(8):
        remaining = page.insert_textbox(
            box,
            value,
            fontsize=current_size,
            fontname=fontname,
            color=color,
            align=align,
            lineheight=current_lineheight,
        )
        if remaining >= 0:
            return
        current_size *= 0.9
        current_lineheight = 1.0
    page.insert_text(
        (box.x0, box.y0 + max(4, current_size)),
        value.splitlines()[0],
        fontsize=current_size,
        fontname=fontname,
        color=color,
    )


def fill_rect(page, box, fill, stroke=None, width=0.8):
    page.draw_rect(box, color=stroke or fill, fill=fill, width=width)


def label(page, x, y, value, fill=BLUE, color=(1, 1, 1), w=118):
    box = rect(x, y, w, 16)
    fill_rect(page, box, fill)
    text(page, box + (0, 3, 0, 0), value.upper(), size=6.8, color=color, bold=True, align=1)


def purina_mark(page, x, y, size=30):
    outer = rect(x, y, size, size)
    fill_rect(page, outer, CARD, RED, width=1.8)
    pad = size * 0.13
    cell = (size - 2 * pad) / 3
    for row in range(3):
        for col in range(3):
            if (row, col) in [(0, 0), (0, 2), (1, 1), (2, 0), (2, 2)]:
                fill_rect(page, rect(x + pad + col * cell, y + pad + row * cell, cell, cell), RED)


def card(page, x, y, w, h, title, body, number=None, accent=NAVY, fill=CARD):
    box = rect(x, y, w, h)
    fill_rect(page, box, fill, BORDER)
    if number:
        nbox = rect(x + 10, y + 12, 24, 18)
        fill_rect(page, nbox, NAVY)
        text(page, nbox + (0, 5, 0, 0), number, size=6.5, color=(1, 1, 1), bold=True, align=1)
        tx = x + 44
    else:
        tx = x + 14
    text(page, rect(tx, y + 12, w - (tx - x) - 12, 16), title, size=8.5, color=NAVY, bold=True)
    text(page, rect(x + 14, y + 33, w - 28, h - 42), body, size=6.6, color=(39 / 255, 52 / 255, 70 / 255))
    page.draw_line((x, y), (x + w, y), color=accent, width=1.1)


def footer(page, page_no):
    page.draw_line((M, H - 36), (W - M, H - 36), color=BORDER, width=0.6)
    text(page, rect(M, H - 26, 260, 10), "FSI Sales Attribution | Credit Assignment Foundation", size=6, color=MUTED)
    text(page, rect(W - M - 40, H - 26, 40, 10), f"{page_no}/2", size=6, color=MUTED, align=2)


def header(page, kicker, title, subtitle, show_logo=True):
    if show_logo:
        purina_mark(page, W - M - 32, 24, 30)
    label(page, M, 54, kicker, NAVY, w=116)
    text(page, rect(M, 82, W - 2 * M, 30), title, size=21, color=NAVY, bold=True)
    text(page, rect(M, 114, W - 2 * M, 22), subtitle, size=8.8, color=MUTED)


def page_one(doc):
    page = doc.new_page(width=W, height=H)
    header(
        page,
        "Product sell sheet",
        "Sales Attribution & Credit Assignment",
        "A governed foundation for seller credit, split ownership, effective-dated history, and monthly interim payment values.",
    )

    hero = rect(M, 156, W - 2 * M, 88)
    fill_rect(page, hero, NAVY)
    page.draw_rect(rect(M, 156, 6, 88), fill=RED, color=RED)
    text(page, rect(M + 20, 170, 250, 14), "Quick product summary", size=9, color=RED, bold=True)
    text(
        page,
        rect(M + 20, 189, 330, 34),
        "One controlled workflow for assigning seller credit from customer + product group through payment review.",
        size=12.5,
        color=(1, 1, 1),
        bold=True,
    )
    text(
        page,
        rect(M + 20, 226, 350, 16),
        "Replaces spreadsheet/email ambiguity with auditable assignments, validation, approvals, and export-ready outputs.",
        size=7,
        color=(218 / 255, 226 / 255, 237 / 255),
    )
    fill_rect(page, rect(W - M - 150, 172, 118, 22), RED)
    text(page, rect(W - M - 150, 178, 118, 12), "P1 FOUNDATION", size=8, color=(1, 1, 1), bold=True, align=1)
    text(page, rect(W - M - 150, 199, 118, 12), "Assignment + validation ready", size=6.4, color=(220 / 255, 230 / 255, 244 / 255), align=1)
    fill_rect(page, rect(W - M - 150, 218, 118, 22), TEAL)
    text(page, rect(W - M - 150, 224, 118, 12), "PAYMENT VALUES", size=8, color=(1, 1, 1), bold=True, align=1)

    label(page, M, 270, "P1 feature set", BLUE, w=122)
    text(page, rect(M + 140, 271, 360, 16), "Built around the five client-priority capabilities.", size=8.2, color=MUTED)
    features = [
        ("01", "Customer + product group credit", "Assign sellers at the precise grain where selling relationships and product responsibility are managed."),
        ("02", "Split allocations", "Support shared ownership, including 80/20 or other direct seller splits that must validate cleanly."),
        ("03", "Role-aware credit", "Handle Direct, Overlay, LPS/Farm Gate, and Manager Roll-up behavior without hardcoding the workflow."),
        ("04", "Effective-dated history", "Preserve start/end dates so current and historical credit logic remains explainable."),
        ("05", "Monthly interim payments", "Generate reviewed interim values from credited invoice amounts while final true-up remains separate."),
    ]
    x_positions = [M, M + 174, M + 348, M + 86, M + 260]
    y_positions = [302, 302, 302, 372, 372]
    for i, (num, title, body) in enumerate(features):
        card(page, x_positions[i], y_positions[i], 164, 58, title, body, num, accent=RED if i in [0, 4] else NAVY)

    label(page, M, 462, "Product workflow", TEAL, w=122)
    text(page, rect(M + 140, 463, 360, 16), "The story is simple: set the rules, validate, approve, calculate, then review payment values.", size=8.2, color=MUTED)
    workflow = [
        ("Setup", "Sellers, roles,\ncustomers, products"),
        ("Assign", "Customer + product\nallocation %"),
        ("Validate", "Split totals,\nlimits, dates"),
        ("Approve", "Manager review\nwith audit trail"),
        ("Calculate", "Invoice credit\nby seller"),
        ("Payments", "Monthly interim\nvalues"),
    ]
    y = 500
    for i, (t, b) in enumerate(workflow):
        x = M + i * 86
        fill = SOFT_GREEN if t == "Calculate" else SOFT_BLUE if t == "Payments" else CARD
        fill_rect(page, rect(x, y, 72, 46), fill, BORDER)
        text(page, rect(x + 4, y + 10, 64, 10), t, size=7.2, color=NAVY, bold=True, align=1)
        text(page, rect(x + 5, y + 25, 62, 18), b, size=5.8, color=MUTED, align=1)
        if i < len(workflow) - 1:
            page.draw_line((x + 74, y + 23), (x + 84, y + 23), color=BLUE, width=1.1)
    text(page, rect(M + 116, 552, 320, 12), "Assignment stores allocation percentage; invoice transactions store quantity, unit, amount, and invoice date.", size=6.6, color=INK, align=1)

    label(page, M, 590, "Business impact", NAVY, w=122)
    impacts = [
        ("For Sales Operations", "Less spreadsheet reconciliation and clearer ownership rules for complex selling relationships."),
        ("For Managers", "Approval decisions are backed by validation results, assignment detail, and audit history."),
        ("For Finance", "Credited invoice amounts roll into monthly interim payment values for review."),
    ]
    for i, (t, b) in enumerate(impacts):
        card(page, M + i * 174, 620, 164, 54, t, b, accent=TEAL)

    takeaway = rect(M, 696, W - 2 * M, 44)
    fill_rect(page, takeaway, SOFT_BLUE, (170 / 255, 199 / 255, 255 / 255), width=0.8)
    text(page, rect(M + 18, 707, 130, 12), "Client takeaway", size=8, color=BLUE, bold=True)
    text(
        page,
        rect(M + 18, 724, W - 2 * M - 36, 14),
        "This is not a static prototype. It is a demo-ready sales credit foundation that can expand into integrations, payroll review, and production-grade persistence.",
        size=8.3,
        color=NAVY,
        bold=True,
    )
    footer(page, 1)


def bullet(page, x, y, color, title, body):
    page.draw_circle((x, y + 3), 2.1, color=color, fill=color)
    text(page, rect(x + 10, y, 120, 11), title, size=6.8, color=INK, bold=True)
    text(page, rect(x + 10, y + 11, 122, 20), body, size=5.8, color=(47 / 255, 60 / 255, 78 / 255))


def roadmap_column(page, x, y, w, h, tag, title, subtitle, items, color):
    fill_rect(page, rect(x, y, w, h), CARD, BORDER)
    fill_rect(page, rect(x + 10, y + 14, 40, 20), color)
    text(page, rect(x + 10, y + 20, 40, 10), tag, size=7.4, color=(1, 1, 1), bold=True, align=1)
    text(page, rect(x + 58, y + 18, w - 68, 12), title, size=8, color=NAVY, bold=True)
    text(page, rect(x + 12, y + 42, w - 24, 18), subtitle, size=6.2, color=color, bold=True)
    yy = y + 76
    for item_title, item_body in items:
        bullet(page, x + 16, yy, color, item_title, item_body)
        yy += 42


def page_two(doc):
    page = doc.new_page(width=W, height=H)
    header(
        page,
        "Feature roadmap",
        "Implementation Progression, Summary Highlights & Next Steps",
        "Structured around what is demo-ready now, what a pilot should harden, and what production can extend.",
        show_logo=False,
    )
    frame = rect(M, 150, W - 2 * M, 350)
    fill_rect(page, frame, LIGHT, BORDER)
    text(page, rect(M + 54, 165, 200, 12), "Implementation narrative", size=8.5, color=NAVY, bold=True)
    text(page, rect(M + 54, 181, 390, 12), "The current POC is demo-ready. Pilot and production expansion should be driven by stakeholder feedback.", size=6.7, color=MUTED)

    roadmap_column(
        page,
        M + 18,
        205,
        150,
        256,
        "MVP",
        "Demo-ready foundation",
        "Implemented P1 workflow",
        [
            ("Assignment grain", "Customer + product group credit ownership."),
            ("Split validation", "Direct split totals, LPS limits, overlay behavior."),
            ("Approvals", "Manager review with approval history."),
            ("Credit calculation", "Invoice amount/quantity allocated by seller."),
            ("Payments", "Monthly interim values and true-up reserve."),
        ],
        BLUE,
    )
    roadmap_column(
        page,
        M + 184,
        205,
        150,
        256,
        "Pilot",
        "Client validation sprint",
        "Harden the operating model",
        [
            ("Data load", "CSV import and repeatable refresh process."),
            ("Role fit", "Confirm real-world direct, overlay, LPS rules."),
            ("E2E testing", "Automate create, validate, approve, calculate."),
            ("Security", "Replace demo role switcher with Entra ID."),
            ("Persistence", "Move from SQLite demo data to managed database."),
        ],
        TEAL,
    )
    roadmap_column(
        page,
        M + 350,
        205,
        150,
        256,
        "Scale",
        "Integration-led rollout",
        "Production roadmap",
        [
            ("Workday", "Seller, manager, employee, and payroll mapping."),
            ("SAP/JDE/SAC", "Invoice, product, customer, quantity, amount feeds."),
            ("Salesforce", "Account visibility and assignment publishing."),
            ("Power BI", "Approved outputs for reporting and leadership views."),
            ("Payroll review", "Governed handoff to final payment workflows."),
        ],
        ORANGE,
    )
    label(page, M, 530, "Summary highlights", BLUE, w=122)
    highlights = [
        ("Clear ownership", "Every credit rule is anchored to customer, product group, seller, role, percentage, and dates."),
        ("Validation before approval", "Split issues are surfaced before they can affect credit calculation or payment review."),
        ("Payment-ready outputs", "Monthly interim payment values are generated from calculated credited amounts."),
        ("Audit confidence", "History and approvals show who changed what, when, and why."),
    ]
    for i, (t, b) in enumerate(highlights):
        x = M + (i % 2) * 258
        y = 560 + (i // 2) * 60
        card(page, x, y, 238, 52, t, b, accent=RED if i == 2 else NAVY)

    label(page, M, 696, "Call to action", TEAL, w=122)
    actions = [
        ("1", "Review", "Walk through the live demo and confirm the business story."),
        ("2", "Validate", "Confirm role rules, split logic, and effective-date examples."),
        ("3", "Prioritize", "Select pilot hardening items and integration sequence."),
        ("4", "Pilot", "Approve a focused pilot plan and success criteria."),
    ]
    for i, (num, title, body) in enumerate(actions):
        x = M + i * 129
        fill_rect(page, rect(x, 724, 112, 42), SOFT_BLUE, (178 / 255, 204 / 255, 255 / 255))
        fill_rect(page, rect(x + 8, 734, 20, 20), NAVY)
        text(page, rect(x + 8, 740, 20, 9), num, size=6, color=(1, 1, 1), bold=True, align=1)
        text(page, rect(x + 36, 734, 70, 10), title, size=7.3, color=NAVY, bold=True)
        text(page, rect(x + 36, 747, 70, 16), body, size=5.4, color=(47 / 255, 60 / 255, 78 / 255))
    footer(page, 2)


def main():
    doc = fitz.open()
    page_one(doc)
    page_two(doc)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc.save(OUT)
    doc.close()

    QA_DIR.mkdir(parents=True, exist_ok=True)
    rendered = fitz.open(OUT)
    for idx, page in enumerate(rendered):
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
        pix.save(QA_DIR / f"page-{idx + 1}.png")
    rendered.close()
    print(OUT.resolve())


if __name__ == "__main__":
    main()
