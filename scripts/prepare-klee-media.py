"""KLEE 8 media for the website, from the pipeline's deliverables (projects/KLEE-8-Tel-Aviv/apt_*):
films (1080p with the locator map and native sound, re-encoded for the web), posters, gallery stills
(webp) and the developer's plans. The 3D models come from pipeline/aptlib/blender/export_web.py.
  python3 website/scripts/prepare-klee-media.py [--force]"""
import subprocess, sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / 'projects/KLEE-8-Tel-Aviv'
OUT = ROOT / 'website/public/projects/klee-8'
FORCE = '--force' in sys.argv

FILMS = {'apt-1': 'apt_1/deliverables/video/klee8-apt1_1080p_map_sound.mp4',
         'apt-2': 'apt_2/deliverables/video/klee8-apt2_1080p_map_sound.mp4',
         'apt-3': 'apt_3/deliverables/video/klee8-apt3_1080p_map.mp4'}
POSTER_AT = {'apt-1': 3.0, 'apt-2': 3.0, 'apt-3': 3.0}
# Gallery = exactly the reference images the final films were generated from (traced through each 1080p
# request to its draft's uploads, byte-identical), in walk order, then the film's closing top-down.
# The first is the front page's card.
USED = {
 'apt-1': ['v-living', 'v-balcony', 'v-living-back', 'v-bedroom'],
 'apt-2': ['v-living', 'v-balcony', 'v-mamad', 'v-master', 'v-ensuite'],
 'apt-3': ['v-garden', 'v-living', 'v-balcony', 'v-dining', 'v-west', 'v-kids-t', 'v-corridor-s3', 'v-bath', 'v-mamad',
           'v-stair', 'v-master-walk', 'v-bed'],
}
STILLS = {apt: [f'keyframes/generated/{n}.png' for n in names] + ['keyframes/final/top.png'] for apt, names in USED.items()}
PLANS = {'apt-1': ['source/apt_1/WhatsApp Image 2026-10-04 at 14.54.48.jpeg'],
         'apt-2': ['source/apt_2/WhatsApp Image 2026-10-04 at 14.55.01.jpeg'],
         # the duplex: entry floor and garden floor side by side, on one sheet
         'apt-3': ['source/apt_3/WhatsApp Image 2026-10-04 at 14.55.21.jpeg', 'source/apt_3/WhatsApp Image 2026-10-04 at 14.55.22.jpeg']}


def apt_dir(apt):
    return SRC / apt.replace('-', '_')


def fresh(dst):
    return FORCE or not dst.exists()


def run(*cmd):
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


for apt, film in FILMS.items():
    d = OUT / 'media' / apt; d.mkdir(parents=True, exist_ok=True)
    src = SRC / film
    if fresh(d / 'film.mp4'):
        run('ffmpeg', '-y', '-i', str(src), '-c:v', 'libx264', '-preset', 'slow', '-crf', '22', '-maxrate', '5M', '-bufsize', '10M',
            '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', str(d / 'film.mp4'))
    if fresh(d / 'poster.webp'):
        png = d / 'poster.png'   # this ffmpeg has no libwebp: grab a PNG, Pillow writes the webp
        run('ffmpeg', '-y', '-ss', str(POSTER_AT[apt]), '-i', str(src), '-frames:v', '1', '-vf', 'scale=1600:-2', str(png))
        Image.open(png).convert('RGB').save(d / 'poster.webp', 'WEBP', quality=82, method=6); png.unlink()
    for rel in STILLS[apt]:
        name = Path(rel).stem.split('.')[0]
        dst = d / f'{name}.webp'
        if fresh(dst):
            im = Image.open(apt_dir(apt) / rel).convert('RGB'); im.thumbnail((2048, 2048))
            im.save(dst, 'WEBP', quality=84, method=6)
    dst = OUT / 'plans' / f'{apt}.webp'; dst.parent.mkdir(parents=True, exist_ok=True)
    if fresh(dst):
        ims = [Image.open(SRC / p).convert('RGB') for p in PLANS[apt]]
        h = max(i.height for i in ims)
        ims = [i.resize((round(i.width * h / i.height), h), Image.LANCZOS) for i in ims]
        gap = 60 if len(ims) > 1 else 0
        sheet = Image.new('RGB', (sum(i.width for i in ims) + gap * (len(ims) - 1), h), 'white')
        x = 0
        for i in ims:
            sheet.paste(i, (x, 0)); x += i.width + gap
        sheet.save(dst, 'WEBP', quality=88, method=6)
    print(apt, 'ok', flush=True)
