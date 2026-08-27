"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { pointer } from "@/lib/pointer";

/**
 * Сигнатурный момент сайта в аниме-стилистике «аниме-ночь»:
 * 1) тысячи частиц слетаются вихрем в монограмму «РБ»;
 * 2) за ней раскручивается золотой магический круг;
 * 3) частицы «отвердевают» в глиф с периодическими глитчами.
 * Тёмный фон → аддитивное смешивание даёт мягкое свечение.
 */

const DURATION = 1.9;
const FLIGHT = 0.55;
const MAX_POINTS = 3600;
const GLYPH_WORLD_W = 4.6;
const TEX_W = 1024;
const TEX_H = 600;
const PLANE_W = 5.2;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function makeRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/** Сэмплируем пиксели текста «РБ» с offscreen-canvas → целевые точки частиц. */
function sampleGlyphTargets(): { targets: Float32Array; count: number } {
  const W = 240;
  const H = 140;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { targets: new Float32Array(0), count: 0 };

  ctx.fillStyle = "#fff";
  ctx.font = "bold 104px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("РБ", W / 2, H / 2 + 4);

  const img = ctx.getImageData(0, 0, W, H).data;
  const pts: Array<[number, number]> = [];
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      if (img[(y * W + x) * 4 + 3] > 140) pts.push([x, y]);
    }
  }

  const rand = makeRand(20260826);
  for (let i = pts.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pts[i], pts[j]] = [pts[j], pts[i]];
  }

  const capped = pts.slice(0, MAX_POINTS);
  const s = GLYPH_WORLD_W / W;
  const count = capped.length;
  const targets = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    targets[i * 3] = (capped[i][0] - W / 2) * s;
    targets[i * 3 + 1] = (H / 2 - capped[i][1]) * s;
    targets[i * 3 + 2] = 0;
  }
  return { targets, count };
}

/** Текстура «твёрдой» фазы — светящийся перламутровый глиф. */
function buildGlyphTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, TEX_W, TEX_H);
    ctx.font = "bold 430px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Синее свечение-подложка
    ctx.shadowColor = "#4d74ff";
    ctx.shadowBlur = 44;
    ctx.fillStyle = "rgba(124, 151, 255, 0.16)";
    ctx.fillText("РБ", TEX_W / 2, TEX_H / 2 + 10);
    ctx.fillText("РБ", TEX_W / 2, TEX_H / 2 + 10);

    // Розовый ореол
    ctx.shadowColor = "#f0619e";
    ctx.shadowBlur = 28;
    ctx.lineWidth = 5;
    ctx.strokeStyle = "rgba(255, 126, 184, 0.6)";
    ctx.strokeText("РБ", TEX_W / 2, TEX_H / 2 + 10);

    // Основной светлый контур
    ctx.shadowColor = "#8fa8ff";
    ctx.shadowBlur = 16;
    ctx.lineWidth = 4.5;
    ctx.strokeStyle = "#c7d3ff";
    ctx.strokeText("РБ", TEX_W / 2, TEX_H / 2 + 10);

    // Белое ядро
    ctx.shadowBlur = 0;
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.strokeText("РБ", TEX_W / 2, TEX_H / 2 + 10);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** Магический круг: кольцо, руны-засечки, пунктир и разорванные дуги. */
function buildRuneCircle() {
  const ring: number[] = [];
  const dashes: number[] = [];
  const arcs: number[] = [];

  const push = (arr: number[], r: number, a1: number, a2: number, segs: number) => {
    for (let i = 0; i < segs; i++) {
      const t1 = a1 + ((a2 - a1) * i) / segs;
      const t2 = a1 + ((a2 - a1) * (i + 1)) / segs;
      arr.push(
        Math.cos(t1) * r, Math.sin(t1) * r, 0,
        Math.cos(t2) * r, Math.sin(t2) * r, 0
      );
    }
  };

  const TAU = Math.PI * 2;

  push(ring, 3.05, 0, TAU, 96);
  const rand = makeRand(555);
  for (let deg = 0; deg < 360; deg += 15) {
    if (rand() < 0.14) continue;
    const a = (deg * Math.PI) / 180;
    ring.push(
      Math.cos(a) * 2.8, Math.sin(a) * 2.8, 0,
      Math.cos(a) * 2.94, Math.sin(a) * 2.94, 0
    );
  }
  for (let deg = 0; deg < 360; deg += 20) {
    push(dashes, 2.58, (deg * Math.PI) / 180, ((deg + 12) * Math.PI) / 180, 4);
  }
  push(arcs, 3.45, (18 * Math.PI) / 180, (82 * Math.PI) / 180, 16);
  push(arcs, 3.45, (138 * Math.PI) / 180, (212 * Math.PI) / 180, 18);
  push(arcs, 3.45, (256 * Math.PI) / 180, (330 * Math.PI) / 180, 18);

  return {
    ring: new Float32Array(ring),
    dashes: new Float32Array(dashes),
    arcs: new Float32Array(arcs),
  };
}

function setLineProgress(geometry: THREE.BufferGeometry, totalVerts: number, p: number) {
  const visible = Math.floor((totalVerts * clamp01(p)) / 2) * 2;
  geometry.setDrawRange(0, visible);
}

interface MonogramData {
  targets: Float32Array;
  scatter: Float32Array;
  colors: Float32Array;
  delays: Float32Array;
  count: number;
  chipBlue: Float32Array;
  chipPink: Float32Array;
  chipBlueVerts: number;
  chipPinkVerts: number;
  runes: ReturnType<typeof buildRuneCircle>;
}

interface MonogramProps {
  instant?: boolean;
}

export function Monogram({ instant = false }: MonogramProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const planeRef = useRef<THREE.Mesh>(null);
  const chipRef = useRef<THREE.LineSegments>(null);
  const padsRef = useRef<THREE.LineSegments>(null);
  const ringMatRef = useRef<THREE.LineBasicMaterial>(null);
  const dashMatRef = useRef<THREE.LineBasicMaterial>(null);
  const arcMatRef = useRef<THREE.LineBasicMaterial>(null);
  const tRef = useRef(instant ? 1 : 0);
  const firedRef = useRef(false);
  const doneRef = useRef(false);
  const nextGlitchRef = useRef(2.8);
  const glitchUntilRef = useRef(-1);
  const otakuRef = useRef(false);
  const { size } = useThree();

  useEffect(() => {
    const onOtaku = (e: Event) => {
      otakuRef.current = Boolean(
        (e as CustomEvent<{ on?: boolean }>).detail?.on
      );
    };
    window.addEventListener("rb:otaku", onOtaku);
    return () => window.removeEventListener("rb:otaku", onOtaku);
  }, []);

  const data = useMemo<MonogramData>(() => {
    const glyph = sampleGlyphTargets();
    const count = glyph.count;
    const scatter = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const delays = new Float32Array(count);

    const blue = new THREE.Color("#5d84ff");
    const blueLight = new THREE.Color("#aebfff");
    const pink = new THREE.Color("#ff7ab8");
    const gold = new THREE.Color("#ffc46b");
    const tmp = new THREE.Color();

    const rand = makeRand(777001);
    for (let i = 0; i < count; i++) {
      const r = 5.2 + rand() * 2.2;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      scatter[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      scatter[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.72;
      scatter[i * 3 + 2] = r * Math.cos(phi) * 0.6 - 1.2;

      if (i % 11 === 0) tmp.copy(pink);
      else if (i % 23 === 0) tmp.copy(gold);
      else tmp.copy(blue).lerp(blueLight, rand() * 0.55);
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;

      delays[i] = rand() * 0.5;
    }

    // Рамка чипа вокруг глифа
    const blueArr: number[] = [];
    const pk: number[] = [];
    const seg = (arr: number[], x1: number, y1: number, x2: number, y2: number) =>
      arr.push(x1, y1, 0, x2, y2, 0);
    const hw = 2.9;
    const hh = 1.9;
    const L = 0.62;
    const corners: Array<[number, number]> = [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
    ];
    for (const [cx, cy] of corners) {
      const bx = cx * hw;
      const by = cy * hh;
      seg(blueArr, bx, by, bx - cx * L, by);
      seg(blueArr, bx, by, bx, by - cy * L);
    }
    for (let x = -hw + 1; x <= hw - 1; x += 0.58) {
      seg(blueArr, x, hh, x, hh - 0.09);
      seg(blueArr, x, -hh, x, -hh + 0.09);
    }
    const traces: Array<[number, number]> = [
      [-1, 0.5],
      [-1, -0.42],
      [1, 0.32],
      [1, -0.56],
    ];
    for (const [side, y] of traces) {
      const x0 = side * hw;
      const bendX = side * (hw + 0.5);
      const endX = side * (hw + 0.95);
      seg(blueArr, x0, y, bendX, y);
      seg(blueArr, bendX, y, endX, y);
      const px = side * (hw + 1.06);
      const pad = 0.07;
      seg(pk, px - pad, y - pad, px + pad, y - pad);
      seg(pk, px + pad, y - pad, px + pad, y + pad);
      seg(pk, px + pad, y + pad, px - pad, y + pad);
      seg(pk, px - pad, y + pad, px - pad, y - pad);
    }

    return {
      targets: glyph.targets,
      scatter,
      colors,
      delays,
      count,
      chipBlue: new Float32Array(blueArr),
      chipPink: new Float32Array(pk),
      chipBlueVerts: blueArr.length / 3,
      chipPinkVerts: pk.length / 3,
      runes: buildRuneCircle(),
    };
  }, []);

  const texture = useMemo(() => buildGlyphTexture(), []);

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  useEffect(() => {
    const group = groupRef.current;
    return () => {
      if (!group) return;
      group.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose();
      });
    };
  }, []);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const elapsed = state.clock.elapsedTime;

    if (!firedRef.current && tRef.current > 0.08) {
      firedRef.current = true;
      window.dispatchEvent(new Event("rb:scene-ready"));
    }

    if (!doneRef.current) {
      if (!instant) tRef.current = Math.min(1, tRef.current + delta / DURATION);
      const t = tRef.current;

      const posAttr = pointsRef.current?.geometry.getAttribute("position");
      if (posAttr) {
        const arr = posAttr.array as Float32Array;
        const { targets, scatter, delays, count } = data;
        for (let i = 0; i < count; i++) {
          const e = easeOutCubic(clamp01((t - delays[i]) / FLIGHT));
          const ix = i * 3;
          const sx = scatter[ix];
          const sy = scatter[ix + 1];
          const sz = scatter[ix + 2];
          const x = sx + (targets[ix] - sx) * e;
          const y = sy + (targets[ix + 1] - sy) * e;
          const z = sz + (targets[ix + 2] - sz) * e;
          const spin = (1 - e) * 1.6 * (i % 2 === 0 ? 1 : -1);
          const cs = Math.cos(spin);
          const sn = Math.sin(spin);
          arr[ix] = x * cs - z * sn;
          arr[ix + 1] = y;
          arr[ix + 2] = x * sn + z * cs;
        }
        posAttr.needsUpdate = true;
      }

      if (chipRef.current)
        setLineProgress(chipRef.current.geometry, data.chipBlueVerts, smoothstep(0.42, 0.85, t));
      if (padsRef.current)
        setLineProgress(
          padsRef.current.geometry,
          data.chipPinkVerts,
          smoothstep(0.6, 0.95, t)
        );

      const planeMat = planeRef.current?.material as THREE.MeshBasicMaterial | undefined;
      const settle = smoothstep(0.75, 1, t);
      const baseOpacity = settle * 0.96;
      if (planeMat) planeMat.opacity = baseOpacity;
      planeRef.current?.scale.setScalar(1 + (1 - settle) * 0.06);

      const runeP = smoothstep(0.35, 0.95, t);
      if (ringMatRef.current) ringMatRef.current.opacity = 0.85 * runeP;
      if (dashMatRef.current) dashMatRef.current.opacity = 0.9 * runeP;
      if (arcMatRef.current) arcMatRef.current.opacity = 0.95 * runeP;

      const ptsMat = pointsRef.current?.material as THREE.PointsMaterial | undefined;
      if (ptsMat) ptsMat.opacity = 0.95 - settle * 0.15;

      if (t >= 1) doneRef.current = true;
    } else {
      // Периодический глитч «сигнала»
      if (elapsed > nextGlitchRef.current) {
        glitchUntilRef.current = elapsed + 0.1 + Math.random() * 0.12;
        nextGlitchRef.current = elapsed + 2.6 + Math.random() * 3.6;
      }
      const glitching = elapsed < glitchUntilRef.current;
      const planeMesh = planeRef.current;
      const planeMat = planeMesh?.material as THREE.MeshBasicMaterial | undefined;
      if (planeMesh && planeMat) {
        planeMesh.position.x = glitching ? (Math.random() - 0.5) * 0.14 : 0;
        planeMat.opacity = glitching ? 0.6 + Math.random() * 0.35 : 0.96;
        if (glitching && Math.random() < 0.3) {
          planeMesh.scale.x = 0.97 + Math.random() * 0.05;
        } else {
          planeMesh.scale.x = 1;
        }
      }

      const ptsMat = pointsRef.current?.material as THREE.PointsMaterial | undefined;
      if (ptsMat) ptsMat.size = 0.048 + Math.sin(elapsed * 1.8) * 0.008;
    }

    // Магический круг: встречное вращение колец + наклон (в режиме отаку — бешеное)
    const rings = ringsRef.current;
    if (rings) {
      const m = otakuRef.current ? 3 : 1;
      rings.rotation.z += delta * 0.14 * m;
      const inner = rings.children[1] as THREE.Group | undefined;
      if (inner) inner.rotation.z -= delta * 0.26 * m;
      rings.rotation.x += (-0.32 - pointer.y * 0.08 - rings.rotation.x) * 0.05;
      rings.rotation.y += (pointer.x * 0.12 - rings.rotation.y) * 0.05;
    }

    // Параллакс всей композиции за мышью
    const swayY = pointer.x * 0.16 + Math.sin(elapsed * 0.25) * 0.05;
    const swayX = -pointer.y * 0.1;
    group.rotation.y += (swayY - group.rotation.y) * 0.06;
    group.rotation.x += (swayX - group.rotation.x) * 0.06;

    const responsiveScale = THREE.MathUtils.clamp(size.width / 1150, 0.58, 1);
    group.scale.setScalar(responsiveScale);
    group.position.x = size.width < 768 ? 0 : 1.35;
    group.position.y = Math.sin(elapsed * 0.7) * 0.06 + (size.width < 768 ? 0.95 : 0);
  });

  return (
    <group ref={groupRef}>
      {/* Золотой магический круг позади глифа */}
      <group ref={ringsRef} position={[0, 0, -0.55]} renderOrder={0}>
        <lineSegments renderOrder={0}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[data.runes.ring, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            ref={ringMatRef}
            color="#ffc46b"
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
        <group>
          <lineSegments renderOrder={0}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[data.runes.dashes, 3]} />
            </bufferGeometry>
            <lineBasicMaterial
              ref={dashMatRef}
              color="#ff7ab8"
              transparent
              opacity={0}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </lineSegments>
        </group>
        <lineSegments renderOrder={0}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[data.runes.arcs, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            ref={arcMatRef}
            color="#7c97ff"
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
      </group>

      {/* Частицы монограммы */}
      <points ref={pointsRef} renderOrder={2}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.scatter, 3]} />
          <bufferAttribute attach="attributes-color" args={[data.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.048}
          vertexColors
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      {/* Твёрдый глиф */}
      <mesh ref={planeRef} renderOrder={1}>
        <planeGeometry args={[PLANE_W, PLANE_W * (TEX_H / TEX_W)]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Рамка чипа */}
      <lineSegments ref={chipRef} renderOrder={3}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.chipBlue, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#7c97ff"
          transparent
          opacity={0.8}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      <lineSegments ref={padsRef} renderOrder={4}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.chipPink, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#ff9ccb"
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}
