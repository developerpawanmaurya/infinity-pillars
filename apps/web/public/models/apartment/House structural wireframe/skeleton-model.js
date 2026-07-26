export async function mount(stage) {
  const { THREE } = await stage.ready;
  const M = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .85, metalness: .05 }, o));
  const mats = {
    concrete: M(0xaab3bc), slab: M(0x8d97a2),
    steel: M(0x2e353d, { roughness: .5, metalness: .3 }),
    wood: M(0x8a5a33), glass: M(0xbfe0ec, { transparent: true, opacity: .4, roughness: .15 }),
    stone: M(0xc9895f), paving: M(0xd8cfbc),
    water: M(0x46b8dc, { transparent: true, opacity: .75, roughness: .1 })
  };
  for (const k in mats) mats[k].name = k;
  const g = new THREE.Group(); g.name = 'villa_skeleton';
  let n = 0;
  const box = (mat, w, h, d, x, y, z, name) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats[mat]);
    m.name = name || mat + '_' + (n++); m.position.set(x, y, z); g.add(m); return m;
  };
  const beamX = (mat, x1, x2, y, z, s = .28, sy) => box(mat, Math.abs(x2 - x1), sy || s, s, (x1 + x2) / 2, y, z);
  const beamZ = (mat, z1, z2, y, x, s = .28, sy) => box(mat, s, sy || s, Math.abs(z2 - z1), x, y, (z1 + z2) / 2);
  const col = (mat, x, z, y1, y2, s = .32) => box(mat, s, y2 - y1, s, x, (y1 + y2) / 2, z, 'column_' + (n++));

  // columns — towers rise to parapet, central bay to roof
  for (const sx of [-1, 1]) {
    for (const [x, z] of [[9, 4.5], [4.4, 4.5], [9, -4.5], [4.4, -4.5]]) col('concrete', sx * x, z, 0, 7.4);
    for (const [x, z] of [[1.5, 3.2], [1.5, -4.5]]) col('concrete', sx * x, z, 0, 6.6);
  }
  // floor + roof frames (perimeter beams + joists)
  for (const y of [3.3, 6.6]) {
    for (const sx of [-1, 1]) {
      beamX('slab', sx * 4.4, sx * 9, y, 4.5);
      beamZ('slab', 3.2, 4.5, y, sx * 4.4);
    }
    beamX('slab', -4.4, 4.4, y, 3.2);
    beamX('slab', -9, 9, y, -4.5);
    for (const x of [-9, -4.4, 4.4, 9]) beamZ('slab', -4.5, 4.5, y, x);
    for (const x of [-1.5, 1.5]) beamZ('slab', -4.5, 3.2, y, x);
    for (let x = -8.3; x < 8.4; x += 1.15) {
      if ([-9, -4.4, -1.5, 1.5, 4.4, 9].some(c => Math.abs(c - x) < .45)) continue;
      beamZ('slab', -4.5, Math.abs(x) > 4.4 ? 4.5 : 3.2, y, x, .14, .22);
    }
  }
  // tower parapets + timber slat canopies
  for (const sx of [-1, 1]) {
    const x1 = sx * 4.4, x2 = sx * 9, lo = Math.min(x1, x2), hi = Math.max(x1, x2);
    beamX('concrete', x1, x2, 7.4, 4.5, .3); beamX('concrete', x1, x2, 7.4, -4.5, .3);
    beamZ('concrete', -4.5, 4.5, 7.4, x1, .3); beamZ('concrete', -4.5, 4.5, 7.4, x2, .3);
    for (let x = lo + .5; x < hi - .3; x += .45) beamZ('wood', -4.4, 4.4, 7.05, x, .09, .16);
    // glass balustrade on tower balcony
    beamX('steel', x1, x2, 4.38, 4.62, .07);
    box('glass', Math.abs(x2 - x1) - .2, 1.0, .05, (x1 + x2) / 2, 3.88, 4.62, sx > 0 ? 'balustrade_r' : 'balustrade_l');
  }
  // steel balcony canopy over terrace
  beamX('steel', -5.4, 5.4, 3.55, 4.25, .25, .5);
  for (let x = -5; x < 5.1; x += 1.25) beamZ('steel', 3.2, 4.25, 3.5, x, .16);
  // central glazing walls
  box('glass', 8.6, 3.0, .06, 0, 1.62, 3.2, 'glazing_ground');
  box('glass', 8.6, 2.9, .06, 0, 4.95, 3.2, 'glazing_upper');
  // terrace + steps
  box('paving', 19.5, .12, 9.8, 0, -.06, .2, 'terrace_slab');
  for (let i = 0; i < 4; i++) box('paving', 13 + i * .9, .16, .55, 0, -.2 - .16 * i, 5.3 + .55 * i, 'step_' + i);
  // stone planter walls
  for (const sx of [-1, 1]) box('stone', 3.4, .8, 1.6, sx * 7.4, -.4, 5.9, sx > 0 ? 'planter_r' : 'planter_l');
  // pool (coping frame + water)
  const py = -.68;
  beamX('paving', -8.1, 8.1, py, 7.4, .25); beamX('paving', -8.1, 8.1, py, 13.8, .25);
  beamZ('paving', 7.4, 13.8, py, -8, .25); beamZ('paving', 7.4, 13.8, py, 8, .25);
  box('water', 15.7, .1, 6.3, 0, py - .12, 10.6, 'pool_water');
  stage.setObject(g);
}
