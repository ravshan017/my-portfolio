const boot = async () => {
  const wrap = document.getElementById('sceneWrap');
  const canvas = document.getElementById('hero-canvas');
  if (!wrap || !canvas) return;
  try {
    const THREE = await import('three');
    const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
    const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');
    const { Reflector } = await import('three/addons/objects/Reflector.js');

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07070a);
    scene.fog = new THREE.FogExp2(0x07070a, 0.036);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 140);
    const camFrom = new THREE.Vector3(12, 5.6, 11.2);
    const camTo = new THREE.Vector3(5.7, 1.8, 6.1);
    camera.position.copy(camFrom);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0.75, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 4.4;
    controls.maxDistance = 11;
    controls.minPolarAngle = 0.35;
    controls.maxPolarAngle = 1.52;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    controls.autoRotate = !reduced;
    controls.autoRotateSpeed = 0.55;
    controls.enabled = false;

    const hemi = new THREE.HemisphereLight(0x35415c, 0x05060a, 0.45);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xfff2dd, 2.6);
    key.position.set(6, 9, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    Object.assign(key.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 1, far: 30 });
    key.shadow.camera.updateProjectionMatrix();
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.02;
    scene.add(key);

    const cool = new THREE.DirectionalLight(0x5f8cff, 1.5);
    cool.position.set(-8, 5, -7);
    scene.add(cool);

    const warm = new THREE.DirectionalLight(0xff9d5c, 0.8);
    warm.position.set(-4, 3, 9);
    scene.add(warm);

    const spot = new THREE.SpotLight(0xffffff, 160, 45, 0.5, 1, 1.8);
    spot.position.set(0, 14, 0);
    scene.add(spot, spot.target);

    const glow = new THREE.PointLight(0xe7c886, 6, 8, 2);
    glow.position.set(0, 0.3, 0);
    scene.add(glow);

    const mirror = new Reflector(new THREE.CircleGeometry(34, 64), {
      clipBias: 0.003,
      textureWidth: 1024,
      textureHeight: 1024,
      color: 0x15151b
    });
    mirror.rotateX(-Math.PI / 2);
    scene.add(mirror);

    const veil = new THREE.Mesh(
      new THREE.CircleGeometry(34, 64),
      new THREE.MeshStandardMaterial({ color: 0x04040a, transparent: true, opacity: 0.58, roughness: 0.9 })
    );
    veil.rotateX(-Math.PI / 2);
    veil.position.y = 0.002;
    scene.add(veil);

    const podium = new THREE.Mesh(
      new THREE.CylinderGeometry(3.55, 3.72, 0.12, 80),
      new THREE.MeshStandardMaterial({ color: 0x101117, roughness: 0.45, metalness: 0.35 })
    );
    podium.position.y = 0.06;
    podium.receiveShadow = true;
    scene.add(podium);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.55, 0.016, 12, 140),
      new THREE.MeshBasicMaterial({ color: 0xe9cd8f })
    );
    ring.rotateX(Math.PI / 2);
    ring.position.y = 0.126;
    scene.add(ring);

    const paint = new THREE.MeshPhysicalMaterial({ color: 0x8f1626, metalness: 0.85, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.06 });
    const glassM = new THREE.MeshPhysicalMaterial({ color: 0x11141c, metalness: 0, roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.03 });
    const carbon = new THREE.MeshStandardMaterial({ color: 0x0d0e12, metalness: 0.55, roughness: 0.42 });
    const chrome = new THREE.MeshStandardMaterial({ color: 0xf2f4f7, metalness: 1, roughness: 0.18 });
    const tireM = new THREE.MeshStandardMaterial({ color: 0x0a0a0c, roughness: 0.96 });
    const rimM = new THREE.MeshStandardMaterial({ color: 0xd7dade, metalness: 1, roughness: 0.24 });
    const lampW = new THREE.MeshStandardMaterial({ color: 0x050505, emissive: 0xfff3d6, emissiveIntensity: 3.4 });
    const lampR = new THREE.MeshStandardMaterial({ color: 0x180404, emissive: 0xff2114, emissiveIntensity: 2.8 });

    const car = new THREE.Group();
    const M = (geo, mat) => {
      const m = new THREE.Mesh(geo, mat);
      m.castShadow = true;
      m.receiveShadow = true;
      return m;
    };
    const box = (w, h, d, mat, x, y, z) => {
      const m = M(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z);
      car.add(m);
      return m;
    };

    const s = new THREE.Shape();
    s.moveTo(-2.35, 0.30);
    s.lineTo(-2.48, 0.58);
    s.quadraticCurveTo(-2.53, 0.84, -2.10, 0.90);
    s.lineTo(-1.30, 0.97);
    s.quadraticCurveTo(-0.95, 1.34, -0.20, 1.36);
    s.quadraticCurveTo(0.55, 1.34, 0.95, 1.02);
    s.lineTo(1.55, 0.92);
    s.quadraticCurveTo(2.15, 0.86, 2.42, 0.66);
    s.lineTo(2.48, 0.40);
    s.quadraticCurveTo(2.49, 0.26, 2.30, 0.24);
    s.lineTo(-2.15, 0.24);
    s.closePath();
    const bodyGeo = new THREE.ExtrudeGeometry(s, { depth: 1.55, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.12, bevelSegments: 6, curveSegments: 20 });
    bodyGeo.translate(0, 0, -0.775);
    car.add(M(bodyGeo, paint));

    const wShape = new THREE.Shape();
    wShape.moveTo(-1.18, 0.96);
    wShape.quadraticCurveTo(-0.88, 1.26, -0.20, 1.285);
    wShape.quadraticCurveTo(0.45, 1.265, 0.82, 0.99);
    wShape.closePath();
    const glassGeo = new THREE.ExtrudeGeometry(wShape, { depth: 1.6, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.04, bevelSegments: 3, curveSegments: 16 });
    glassGeo.translate(0, 0, -0.8);
    car.add(M(glassGeo, glassM));

    box(2.6, 0.16, 1.28, carbon, 0, 0.30, 0);
    box(0.5, 0.05, 1.7, carbon, 2.2, 0.215, 0);
    box(0.45, 0.06, 1.66, carbon, -2.28, 0.225, 0);
    box(0.05, 0.16, 0.92, carbon, 2.44, 0.40, 0);
    box(0.03, 0.07, 1.38, lampR, -2.49, 0.78, 0);
    const hl1 = box(0.07, 0.1, 0.4, lampW, 2.415, 0.62, 0.52);
    hl1.rotation.z = -0.25;
    const hl2 = box(0.07, 0.1, 0.4, lampW, 2.415, 0.62, -0.52);
    hl2.rotation.z = -0.25;
    box(0.02, 0.02, 0.55, lampW, 2.46, 0.5, 0.5);
    box(0.02, 0.02, 0.55, lampW, 2.46, 0.5, -0.5);
    box(0.3, 0.035, 1.5, carbon, -2.2, 1.13, 0);
    box(0.16, 0.15, 0.05, carbon, -2.2, 1.03, 0.45);
    box(0.16, 0.15, 0.05, carbon, -2.2, 1.03, -0.45);
    box(0.02, 0.03, 0.14, carbon, 0.9, 1.0, 0.83);
    box(0.16, 0.09, 0.07, paint, 0.9, 1.05, 0.92);
    box(0.02, 0.03, 0.14, carbon, 0.9, 1.0, -0.83);
    box(0.16, 0.09, 0.07, paint, 0.9, 1.05, -0.92);
    const ex1 = M(new THREE.CylinderGeometry(0.05, 0.05, 0.14, 20), chrome);
    ex1.rotation.z = Math.PI / 2;
    ex1.position.set(-2.44, 0.30, 0.3);
    car.add(ex1);
    const ex2 = ex1.clone();
    ex2.position.z = -0.3;
    car.add(ex2);

    const mkWheel = (x, z) => {
      const g = new THREE.Group();
      const t = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.43, 0.3, 28), tireM);
      t.rotation.x = Math.PI / 2;
      t.castShadow = true;
      g.add(t);
      const r = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.315, 24), rimM);
      r.rotation.x = Math.PI / 2;
      g.add(r);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.33, 14), chrome);
      hub.rotation.x = Math.PI / 2;
      g.add(hub);
      for (let i = 0; i < 5; i++) {
        const sp = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.44, 0.29), rimM);
        sp.rotation.z = i * Math.PI * 2 / 5;
        sp.castShadow = true;
        g.add(sp);
      }
      g.position.set(x, 0.43, z);
      car.add(g);
    };
    [[1.46, 0.82], [1.46, -0.82], [-1.5, 0.82], [-1.5, -0.82]].forEach(([x, z]) => mkWheel(x, z));

    car.position.y = 0.12;
    scene.add(car);

    const pGeo = new THREE.BufferGeometry();
    const pN = 220;
    const arr = new Float32Array(pN * 3);
    for (let i = 0; i < pN; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 26;
      arr[i * 3 + 1] = Math.random() * 7 + 0.2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 26;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    const pts = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xd8b46a, size: 0.035, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false }));
    scene.add(pts);

    const paintTarget = new THREE.Color(0x8f1626);
    document.querySelectorAll('.swatch').forEach(b => b.addEventListener('click', () => {
      document.querySelectorAll('.swatch').forEach(x => x.classList.remove('is-active'));
      b.classList.add('is-active');
      paintTarget.set(b.dataset.hex);
      const lbl = document.getElementById('swatchName');
      if (lbl) lbl.textContent = b.dataset.name;
    }));

    const size = () => {
      const wd = wrap.clientWidth, ht = wrap.clientHeight;
      renderer.setSize(wd, ht, false);
      camera.aspect = wd / ht;
      camera.updateProjectionMatrix();
    };
    size();
    if ('ResizeObserver' in window) new ResizeObserver(size).observe(wrap);
    else addEventListener('resize', size);

    let visible = true;
    new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0 }).observe(wrap);

    const clock = new THREE.Clock();
    let t = reduced ? 1 : 0;
    let readySent = false;
    const ease = x => 1 - Math.pow(1 - x, 3);
    if (reduced) { camera.position.copy(camTo); controls.enabled = true; }

    renderer.setAnimationLoop(() => {
      const dt = Math.min(clock.getDelta(), 0.05);
      if (document.hidden || !visible) return;
      if (t < 1) {
        t = Math.min(1, t + dt / 1.7);
        camera.position.lerpVectors(camFrom, camTo, ease(t));
        if (t >= 1) controls.enabled = true;
      }
      controls.update();
      paint.color.lerp(paintTarget, 1 - Math.exp(-dt * 6));
      pts.rotation.y += dt * 0.02;
      glow.intensity = 5 + Math.sin(clock.elapsedTime * 2) * 1.2;
      ring.material.color.setHSL(0.11, 0.45, 0.62 + Math.sin(clock.elapsedTime * 1.4) * 0.05);
      renderer.render(scene, camera);
      if (!readySent) {
        readySent = true;
        dispatchEvent(new Event('scene:ready'));
      }
    });

    canvas.addEventListener('pointerdown', () => {
      const h = document.getElementById('dragHint');
      if (h) h.classList.add('hide');
    }, { once: true });

    addEventListener('pointerdown', () => {
      controls.autoRotate = false;
      clearTimeout(controls.__it);
      controls.__it = setTimeout(() => { controls.autoRotate = !reduced; }, 3200);
    }, { passive: true });
  } catch (err) {
    console.warn('3D disabled:', err);
    wrap.classList.add('no3d');
    dispatchEvent(new Event('scene:error'));
  }
};
boot();
