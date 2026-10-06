"""Promote an apartment's APPROVED media from the pipeline to the website (runbook §11, R-PIPE-PROMOTE / R-PIPE-SLOT).
Generic: everything project-specific comes from <apt>/apartment.yaml -> web: and from <apt>/studio.json statuses.

  python3 website/scripts/prepare-apt-media.py <apt_dir> --stage plan,model,blockout,keyframes,480p,1080p [--force]
  (normally through: python3 -m pipeline.aptlib.cli promote <apt_dir> --stage=...)

apartment.yaml:
  web:
    site: borges-15                 # website/public/projects/<site>/, content/projects/<site>.media.json
    apt: 3b                         # the apartment id on the page (?apt=3b) and the media folder
    plans: [source/plans/a.png, ...]   # relative to the project folder; side by side for a duplex
    model: {orbit: '30deg 42deg 95%', levels: [{id: both, label: Both floors, labelHe: ..., suffix: ''}, ...]}
    gallery: [{id: v-living, label: Living room, labelHe: סלון}, ...]   # keyframe ids, in page order; 'top' = the photoreal top-down
    poster_at: 3.0

Writes website/public/projects/<site>/{plans,media/<apt>} and website/content/projects/<site>.media.json, and records
what's on the page in <apt>/studio.json -> pages. Only approved/locked items go up; --force overrides (log why).
"""
import argparse, datetime, json, subprocess, sys
from pathlib import Path
import yaml
from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parents[2]
WEB = ROOT / 'website'


def run(*cmd):
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def webp(src, dst, size=2048, q=84):
    im = Image.open(src).convert('RGB'); im.thumbnail((size, size))
    dst.parent.mkdir(parents=True, exist_ok=True); im.save(dst, 'WEBP', quality=q, method=6)


def trim(im, pad=40):
    """Crop a plan sheet to its drawing (anything not near-white), keeping a margin."""
    bg = Image.new('RGB', im.size, (255, 255, 255))
    box = ImageChops.difference(im, bg).convert('L').point(lambda v: 255 if v > 18 else 0).getbbox()
    if not box:
        return im
    return im.crop((max(0, box[0] - pad), max(0, box[1] - pad), min(im.width, box[2] + pad), min(im.height, box[3] + pad)))


def film(src, dst_dir, name, poster_at):
    dst_dir.mkdir(parents=True, exist_ok=True)
    mp4, poster = dst_dir / f'{name}.mp4', dst_dir / f'{name}-poster.webp'
    run('ffmpeg', '-y', '-i', str(src), '-c:v', 'libx264', '-preset', 'slow', '-crf', '22', '-maxrate', '5M', '-bufsize', '10M',
        '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', str(mp4))
    png = dst_dir / f'{name}-poster.png'   # this ffmpeg has no libwebp: PNG, then Pillow
    run('ffmpeg', '-y', '-ss', str(poster_at), '-i', str(src), '-frames:v', '1', '-vf', 'scale=1600:-2', str(png))
    Image.open(png).convert('RGB').save(poster, 'WEBP', quality=82, method=6); png.unlink()
    return mp4, poster


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('apt'); ap.add_argument('--stage', required=True); ap.add_argument('--force', action='store_true')
    a = ap.parse_args()
    apt = Path(a.apt).resolve(); project = apt.parent
    bio = yaml.safe_load((apt / 'apartment.yaml').read_text())
    web = bio.get('web') or sys.exit('apartment.yaml has no web: block (site, apt)')
    site, aid = web['site'], web['apt']
    pub = WEB / 'public' / 'projects' / site; url = f'/projects/{site}'
    media_json = WEB / 'content' / 'projects' / f'{site}.media.json'
    allm = json.loads(media_json.read_text()) if media_json.exists() else {}
    m = allm.setdefault(aid, {})
    st_path = apt / 'studio.json'; st = json.loads(st_path.read_text()) if st_path.exists() else {}
    pages = st.setdefault('pages', {})
    now = datetime.datetime.now().isoformat(timespec='seconds')
    ok = lambda status: a.force or status in ('approved', 'locked')
    bid = bio['id']

    for stage in a.stage.split(','):
        if stage == 'plan':
            ims = [trim(Image.open(project / p).convert('RGB')) for p in web['plans']]
            h = max(i.height for i in ims)
            ims = [i.resize((round(i.width * h / i.height), h), Image.LANCZOS) for i in ims]
            gap = 60 if len(ims) > 1 else 0
            sheet = Image.new('RGB', (sum(i.width for i in ims) + gap * (len(ims) - 1), h), 'white'); x = 0
            for i in ims:
                sheet.paste(i, (x, 0)); x += i.width + gap
            dst = pub / 'plans' / f'{aid}.webp'; dst.parent.mkdir(parents=True, exist_ok=True)
            sheet.save(dst, 'WEBP', quality=90, method=6)
            pages['plan'] = {'src': f'{url}/plans/{aid}.webp', 'time': now}
        elif stage == 'model':
            # export_web.py writes the GLBs straight into public/projects/<site>/models (runbook §3.1)
            mw = web.get('model', {})
            glb = pub / 'models' / f'{aid}.glb'
            if not glb.exists():
                sys.exit(f'{glb} missing: run present.py + export_web.py first')
            # the model goes up at P2 for review, like the blockout (it's what the user judges the trace on)
            m['model'] = f'{url}/models/{aid}.glb'
            if mw.get('orbit'):
                m['modelOrbit'] = mw['orbit']
            levels = [dict(id=l['id'], label=l['label'], labelHe=l.get('labelHe'), src=f"{url}/models/{aid}{l.get('suffix', '')}.glb")
                      for l in mw.get('levels', [])]
            for l in levels:
                if not (WEB / 'public' / l['src'].lstrip('/')).exists():
                    sys.exit(f"missing level model {l['src']}")
            if levels:
                m['modelLevels'] = levels
            pages['model'] = {'src': m['model'], 'levels': [l['src'] for l in levels], 'time': now}
        elif stage in ('blockout', '480p', '1080p'):
            src = apt / 'deliverables' / 'video' / f'{bid}_{stage}_map.mp4'
            if not src.exists():
                sys.exit(f'{src} missing: run cli {"blockoutfilm" if stage == "blockout" else "assemble " + stage}')
            if stage != 'blockout':   # the blockout is the one item promoted before approval (§11.1)
                segs = st.get('segments', [])
                pending = [s['id'] for s in segs if s.get('status') not in ('approved', 'locked')]
                if pending and not a.force:
                    sys.exit(f'R-PIPE-PROMOTE: segments not approved in the studio: {pending}')
            mp4, poster = film(src, pub / 'media' / aid, f'film-{stage}', web.get('poster_at', 3.0))
            m['film'] = {'src': f'{url}/media/{aid}/{mp4.name}', 'poster': f'{url}/media/{aid}/{poster.name}'}
            if stage == 'blockout':   # work in progress: the page says so (R-PIPE-SLOT)
                m['film'].update(note='Blockout · camera route preview', noteHe='בלוקאאוט · תצוגה מקדימה של מסלול המצלמה')
            elif stage == '480p':
                m['film'].update(note='Draft film · 480p review', noteHe='טיוטת סרט · 480p לבדיקה')
            pages['film'] = {'stage': stage, 'src': m['film']['src'], 'from': str(src.relative_to(apt)), 'time': now}
        elif stage == 'keyframes':
            status = {i['id']: i.get('status') for i in st.get('images', [])}
            out, skipped = [], []
            for g in web.get('gallery', []):
                gid = g['id']
                if gid == 'top':
                    src = apt / 'keyframes' / 'final' / 'top.png'
                    good = src.exists() and (a.force or status.get('top') in ('approved', 'locked', None))
                else:
                    appr = apt / 'keyframes' / 'final' / f'{gid}-approved.png'
                    src = appr if appr.exists() else apt / 'keyframes' / 'generated' / f'{gid}.png'
                    good = src.exists() and ok(status.get(gid))
                if not good:
                    skipped.append(gid); continue
                webp(src, pub / 'media' / aid / f'{gid}.webp')
                out.append({'src': f'{url}/media/{aid}/{gid}.webp', 'label': g['label'], **({'labelHe': g['labelHe']} if g.get('labelHe') else {})})
            if out:
                m['images'] = out
            pages['images'] = {'count': len(out), 'skipped_not_approved': skipped, 'time': now}
            print('keyframes: promoted', len(out), 'skipped (not approved):', skipped)
        else:
            sys.exit(f'unknown stage {stage}')
        print(stage, '->', pages.get({'blockout': 'film', '480p': 'film', '1080p': 'film', 'keyframes': 'images'}.get(stage, stage)), flush=True)

    media_json.write_text(json.dumps(allm, indent=1, ensure_ascii=False) + '\n')
    if st_path.exists() or pages:
        st_path.write_text(json.dumps(st, indent=1, ensure_ascii=False))
    print('->', media_json.relative_to(ROOT))


if __name__ == '__main__':
    main()
