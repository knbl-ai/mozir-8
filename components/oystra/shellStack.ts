// @ts-nocheck
// The Oystra main buildings as a stack of frosted mother-of-pearl plates that turns: one plate per floor, cut to the
// smooth outer line of that floor (pipeline/signature/building in the pipeline repo: trace_outer.py → align_floors.py →
// build_model.py → model.json). Data: [[floor, [outline…], [set-back outline…]], …] in points of the developer's page,
// x right, y toward the boulevard. Plain three.js on one canvas; returns a clean-up.
import * as THREE from 'three';

const FH = 11.8, TH = 3.6, CX = 645, CY = 400;      // floor height and plate thickness in page points (1 pt ≈ 0.29 m)
const PAL = `vec3 pal(float t){ vec3 c0 = vec3(1., .955, .89), c1 = vec3(1., .80, .86), c2 = vec3(.74, .92, .96), c3 = vec3(.87, .82, .99); float s = fract(t) * 4., f = smoothstep(0., 1., fract(s));
  return s < 1. ? mix(c0, c1, f) : s < 2. ? mix(c1, c2, f) : s < 3. ? mix(c2, c3, f) : mix(c3, c0, f); }`;
const VERT = 'varying vec3 vN, vV, vW, vG; void main(){ vN = normalize(normalMatrix * normal); vG = normalize(mat3(modelMatrix) * normal); vec4 mv = modelViewMatrix * vec4(position, 1.); vV = -mv.xyz; vW = (modelMatrix * vec4(position, 1.)).xyz; gl_Position = projectionMatrix * mv; }';

export type Floor = [number, number[][][], number[][][]];

export function mountBuilding(stage: HTMLElement, canvas: HTMLCanvasElement, data: Floor[], onHover: (name: string) => void): () => void {
  const R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); R.setPixelRatio(Math.min(2, devicePixelRatio)); R.setClearColor(0x000000, 0);
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(26, 2, 10, 8000), world = new THREE.Group(); scene.add(world);
  const shift = { value: 0 };
  // frosted plate: the tint runs through cream, shell pink, pale aqua and lilac with height and viewing angle; tops are lit,
  // undersides fall into shade, cut edges are the brightest; nearly opaque, so a plate hides what is behind it
  const pearl = (side: number) => new THREE.ShaderMaterial({ transparent: true, depthWrite: true, uniforms: { uShift: shift, uSide: { value: side }, uHot: { value: 0 } }, vertexShader: VERT,
    fragmentShader: `varying vec3 vN, vV, vW, vG; uniform float uShift, uSide, uHot; ${PAL}
     void main(){ float f = 1. - abs(dot(normalize(vN), normalize(vV))); float t = vW.y * .0042 + f * .35 + uShift + (vW.x + vW.z) * .00055; float up = clamp(vG.y * .5 + .5, 0., 1.);
       vec3 col = pal(t) * (uSide > .5 ? 1.04 + .1 * f : mix(.62, .9, up)); col = mix(col, vec3(1., .84, .66), uHot * .75); gl_FragColor = vec4(col, uSide > .5 ? .97 : .9); }` });
  // the body between the plates, set back and in shade, so the gaps are not see-through
  const mBody = new THREE.ShaderMaterial({ uniforms: { uShift: shift }, vertexShader: VERT,
    fragmentShader: `varying vec3 vN, vV, vW, vG; uniform float uShift; ${PAL} void main(){ float t = vW.y * .0042 + uShift + (vW.x + vW.z) * .00055; gl_FragColor = vec4(pal(t) * .56, 1.); }` });
  const mRoof = pearl(0), mEdge = new THREE.LineBasicMaterial({ color: 0xfff1e2, transparent: true, opacity: .22, depthWrite: false });
  const pool = new THREE.Mesh(new THREE.CircleGeometry(900, 64), new THREE.ShaderMaterial({ transparent: true, depthWrite: false,
    vertexShader: 'varying vec2 u; void main(){ u = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }',
    fragmentShader: 'varying vec2 u; void main(){ float d = distance(u, vec2(.5)) * 2.; gl_FragColor = vec4(.62, .74, .82, .2 * pow(1. - clamp(d, 0., 1.), 2.2)); }' }));
  pool.rotation.x = -Math.PI / 2; pool.scale.set(1, .62, 1); pool.position.y = FH - 1; scene.add(pool);
  const shape = (pts: number[][]) => { const s = new THREE.Shape(); pts.forEach(([x, y], i) => (i ? s.lineTo(x - CX, -(y - CY)) : s.moveTo(x - CX, -(y - CY)))); s.closePath(); return s; };
  const slabs: any[] = [], trash: any[] = [mBody, mRoof, mEdge, pool.geometry, pool.material];
  for (const [f, outer, inner] of data) {
    for (const pts of outer) {
      const xs = pts.map(p => p[0]), w = Math.max(...xs) - Math.min(...xs), cx = xs.reduce((a, b) => a + b) / xs.length, res = 'ABCD'[[385, 620, 860].filter(v => cx > v).length];
      const g = new THREE.ExtrudeGeometry(shape(pts), { depth: TH - .8, bevelEnabled: true, bevelThickness: .4, bevelSize: .5, bevelSegments: 2, curveSegments: 1 });
      const m = new THREE.Mesh(g, [pearl(0), pearl(1)]); m.rotation.x = -Math.PI / 2; m.position.y = f * FH + .4; m.renderOrder = f;
      m.userData.name = f >= 15 ? `The arch between B and C · floor ${f}` : w > 330 ? `Floor ${f} · all four residences` : `Residence ${res} · floor ${f}`; world.add(m); slabs.push(m); trash.push(g, ...m.material);
      const lg = new THREE.BufferGeometry().setFromPoints(pts.map(([px, py]) => new THREE.Vector3(px - CX, f * FH + TH + .05, py - CY))); world.add(new THREE.LineLoop(lg, mEdge)); trash.push(lg);
    }
    for (const pts of inner) {
      const g = new THREE.ExtrudeGeometry(shape(pts), { depth: FH - TH, bevelEnabled: false, curveSegments: 1 }), m = new THREE.Mesh(g, mBody); m.rotation.x = -Math.PI / 2; m.position.y = f * FH + TH; world.add(m);
      const cg = new THREE.ExtrudeGeometry(shape(pts), { depth: .5, bevelEnabled: false, curveSegments: 1 }), c = new THREE.Mesh(cg, mRoof); c.rotation.x = -Math.PI / 2; c.position.y = (f + 1) * FH - .1; world.add(c); trash.push(g, cg);
    }
  }
  let ang = -.5, vel = 0, drag: any = null, hot: any = null, t0 = performance.now(), raf = 0, seen = true, dead = false;
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(9, 9), reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heat = (m: any, v: number) => { if (m) m.material.forEach((x: any) => { x.uniforms.uHot.value = v; }); };
  const size = () => { const w = stage.clientWidth, h = stage.clientHeight; if (!w || !h) return; R.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
  function tick(t: number) {
    if (dead) return; raf = requestAnimationFrame(tick); if (!seen) { t0 = t; return; }
    const dt = Math.min(.05, (t - t0) / 1000); t0 = t;
    if (!drag) { ang += vel * dt; vel *= Math.pow(.05, dt); if (!reduce && Math.abs(vel) < .02) ang += .07 * dt; }
    world.rotation.y = ang; shift.value = ang * .16 + (reduce ? 0 : t * .000012);
    const e = 17 * Math.PI / 180, dist = 1380; cam.position.set(0, 118 + Math.sin(e) * dist, Math.cos(e) * dist); cam.lookAt(0, 118, 0);
    ray.setFromCamera(ptr, cam); const hit = drag ? null : ray.intersectObjects(slabs, false)[0], m = hit ? hit.object : null;
    if (m !== hot) { heat(hot, 0); hot = m; heat(m, 1); onHover(m ? m.userData.name : ''); }
    R.render(scene, cam);
  }
  const move = (e: PointerEvent) => { const r = stage.getBoundingClientRect(); ptr.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height * 2 - 1));
    if (drag) { const na = drag.a + (e.clientX - drag.x) * .006, now = performance.now(); drag.v = (na - ang) / Math.max(.001, (now - drag.t) / 1000); drag.t = now; ang = na; } };
  const leave = () => ptr.set(9, 9);
  const down = (e: PointerEvent) => { drag = { x: e.clientX, a: ang, t: performance.now(), v: 0 }; stage.setPointerCapture(e.pointerId); };
  const up = () => { if (drag) { vel = Math.max(-3, Math.min(3, drag.v)); drag = null; } };
  stage.addEventListener('pointermove', move); stage.addEventListener('pointerleave', leave); stage.addEventListener('pointerdown', down); stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
  const ro = new ResizeObserver(size); ro.observe(stage); size();
  const io = new IntersectionObserver(([x]) => { seen = x.isIntersecting; }, { rootMargin: '200px' }); io.observe(stage);   // no drawing while it is off screen
  raf = requestAnimationFrame(tick);
  return () => { dead = true; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
    stage.removeEventListener('pointermove', move); stage.removeEventListener('pointerleave', leave); stage.removeEventListener('pointerdown', down); stage.removeEventListener('pointerup', up); stage.removeEventListener('pointercancel', up);
    trash.forEach(x => x.dispose && x.dispose()); R.dispose(); };
}
