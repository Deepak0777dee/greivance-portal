from PIL import Image
import os

src_dir = r"C:\Users\D-ROCK\.gemini\antigravity-ide\brain\bd1ea84c-eea8-4076-817e-f90f0670a727"
dst_dir = r"c:\Users\D-ROCK\Desktop\greivance portal\images"

files = {
    "hero_1_1786454561101.png": "hero-1.webp",
    "hero_2_1786454872458.png": "hero-2.webp",
    "hero_3_1786454991998.png": "hero-3.webp",
}

for src_name, dst_name in files.items():
    img = Image.open(os.path.join(src_dir, src_name))
    img = img.resize((1200, 600), Image.LANCZOS)
    dst_path = os.path.join(dst_dir, dst_name)
    img.save(dst_path, "WEBP", quality=70)
    size_kb = os.path.getsize(dst_path) // 1024
    print(f"{dst_name}: {size_kb}kb")

print("Done!")
