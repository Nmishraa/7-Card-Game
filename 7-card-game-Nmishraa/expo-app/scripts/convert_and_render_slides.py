import os
import subprocess
import fitz # PyMuPDF

base_dir = path = os.path.dirname(os.path.abspath(__file__))
pptx_path = os.path.abspath(os.path.join(base_dir, '..', '7-Cards-Least-Game-Presentation.pptx'))
pdf_path = os.path.abspath(os.path.join(base_dir, '..', '7-Cards-Least-Game-Presentation.pdf'))
img_dir = os.path.abspath(os.path.join(base_dir, 'slide_images'))

if not os.path.exists(img_dir):
    os.makedirs(img_dir, exist_ok=True)

print(f"[Export] Converting PPTX to PDF via Keynote: {pptx_path} -> {pdf_path}")

applescript = f'''
tell application "Keynote"
    set origDoc to open POSIX file "{pptx_path}"
    delay 1
    export origDoc to POSIX file "{pdf_path}" as PDF
    close origDoc saving no
end tell
'''

res = subprocess.run(['osascript', '-e', applescript], capture_output=True, text=True)
if res.returncode != 0:
    print(f"[AppleScript Warning] Keynote export failed or returned message: {res.stderr}")
else:
    print(f"[Export] Successfully exported PDF via Keynote!")

if os.path.exists(pdf_path):
    print(f"[Render] Rendering PDF pages to PNG using PyMuPDF...")
    doc = fitz.open(pdf_path)
    for i, page in enumerate(doc):
        pix = page.get_pixmap(dpi=150)
        out_img = os.path.join(img_dir, f"slide_{i+1:02d}.png")
        pix.save(out_img)
        print(f"  Rendered slide {i+1}: {out_img}")
    print(f"[Render] Done! All {len(doc)} slide images saved in scripts/slide_images/")
else:
    print(f"[Error] PDF file was not created: {pdf_path}")
