from pathlib import Path
import shutil

import pypdfium2 as pdfium


ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / "Group61_Assignment02_CollabBoard_Report.pdf"
OUT = ROOT / "tmp" / "report-render"

if OUT.exists():
    shutil.rmtree(OUT)
OUT.mkdir(parents=True)

document = pdfium.PdfDocument(str(PDF))
for index in range(len(document)):
    page = document[index]
    bitmap = page.render(scale=150 / 72)
    bitmap.to_pil().save(OUT / f"page-{index + 1}.png")
print(f"rendered {len(document)} pages to {OUT}")
