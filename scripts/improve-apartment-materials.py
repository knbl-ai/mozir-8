"""Create versioned GLBs with the approved palette; preserve all geometry and originals."""
import json,struct,copy,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
CONFIG=json.loads(Path(__file__).with_name('apartment-materials.json').read_text())
def role(name,material):
 n=name.lower();m=material.partition('_')[2]
 if 'skirting' in n:return 'RV2_Skirting'
 if 'floor' in n:
  if any(w in n for w in ['bath','ensuite','laundry']):return 'RV2_Bath_floor'
  if m=='oak':return 'RV2_Oak_floor'
 if 'sofa' in n and m in ['linen','bedding']:return 'RV2_Sofa'
 if m=='white':
  if any(w in n for w in ['wardrobe door','storage door','kitchen bank door','upper kitchen cabinet']):return 'RV2_Cabinet'
  if 'door' in n:return 'RV2_Door'
 return material
for apt in ['front-view','rear-view','garden']:
 folder=ROOT/'public/projects/building-preview/apartments'/apt
 b=(folder/'apartment-v1.glb').read_bytes();length=struct.unpack_from('<I',b,12)[0];d=json.loads(b[20:20+length]);old=copy.deepcopy(d)
 for m in d['materials']:
  key=m['name'].partition('_')[2]
  if key in CONFIG['palette']:
   color,rough=CONFIG['palette'][key];m['pbrMetallicRoughness'].update(baseColorFactor=color,roughnessFactor=rough)
 for name,(color,rough) in CONFIG['roles'].items():d['materials'].append({'name':name,'pbrMetallicRoughness':{'baseColorFactor':color,'roughnessFactor':rough,'metallicFactor':0}})
 ids={m['name']:i for i,m in enumerate(d['materials'])};count=0
 for mesh in d['meshes']:
  for p in mesh['primitives']:
   name=d['materials'][p['material']]['name'];new=role(mesh['name'],name)
   if new!=name:p['material']=ids[new];count+=1
 j=json.dumps(d,separators=(',',':')).encode();j+=b' '*((-len(j))%4);tail=b[20+length:]
 result=struct.pack('<III',0x46546c67,2,20+len(j)+len(tail))+struct.pack('<II',len(j),0x4e4f534a)+j+tail
 (folder/'apartment-v2.glb').write_bytes(result)
 assert d['nodes']==old['nodes'] and d['accessors']==old['accessors']
 assert result[20+len(j):]==tail
 print(apt, 'geometry unchanged;',count,'material-role assignments;',len(result),'bytes')
