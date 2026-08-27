"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Лепестки сакуры: до 240 инстансов, обычно видно 90.
 * Событие `rb:otaku` (код Konami) включает шторм: все лепестки летят быстрее.
 */

const COUNT = 240;
const NORMAL_COUNT = 90;
const OTAKU_MULTIPLIER = 2.6;

function makeRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

interface Petal {
  baseX: number;
  y: number;
  speed: number;
  swayAmp: number;
  swayFreq: number;
  phase: number;
  rotSpeed: number;
  scale: number;
}

function makePetals(): Petal[] {
  const rand = makeRand(90210);
  return Array.from({ length: COUNT }, () => ({
    baseX: -7 + rand() * 14,
    y: -4.5 + rand() * 10,
    speed: 0.22 + rand() * 0.5,
    swayAmp: 0.25 + rand() * 0.65,
    swayFreq: 0.4 + rand() * 0.8,
    phase: rand() * Math.PI * 2,
    rotSpeed: (rand() - 0.5) * 2.4,
    scale: 0.6 + rand() * 0.7,
  }));
}

function makePetalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, 64, 64);
    ctx.translate(32, 32);
    ctx.scale(1, 1.55);
    const g = ctx.createRadialGradient(0, -2, 2, 0, 0, 28);
    g.addColorStop(0, "rgba(253, 208, 233, 0.98)");
    g.addColorStop(0.55, "rgba(244, 125, 189, 0.85)");
    g.addColorStop(1, "rgba(244, 125, 189, 0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, 0, 17, 26, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function SakuraPetals() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const texture = useMemo(() => makePetalTexture(), []);
  const petalsRef = useRef<Petal[]>(makePetals());
  const otakuRef = useRef(false);
  const appliedCountRef = useRef(-1);

  useEffect(() => {
    const onOtaku = (e: Event) => {
      otakuRef.current = Boolean(
        (e as CustomEvent<{ on?: boolean }>).detail?.on
      );
    };
    window.addEventListener("rb:otaku", onOtaku);
    return () => window.removeEventListener("rb:otaku", onOtaku);
  }, []);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const otaku = otakuRef.current;
    if (appliedCountRef.current !== (otaku ? COUNT : NORMAL_COUNT)) {
      appliedCountRef.current = otaku ? COUNT : NORMAL_COUNT;
      mesh.count = appliedCountRef.current;
    }

    const mult = otaku ? OTAKU_MULTIPLIER : 1;
    const el = state.clock.elapsedTime;
    const petals = petalsRef.current;
    for (let i = 0; i < COUNT; i++) {
      const p = petals[i];
      p.y -= p.speed * delta * mult;
      if (p.y < -4.8) {
        p.y = 5 + Math.random() * 1.5;
        p.baseX = -7 + Math.random() * 14;
      }
      const x = p.baseX + Math.sin(el * p.swayFreq * mult + p.phase) * p.swayAmp;
      dummy.position.set(x, p.y, -1.6 + (i % 5) * 0.35);
      dummy.rotation.set(
        el * p.rotSpeed * 0.4 * mult + p.phase,
        el * p.rotSpeed * 0.6 * mult,
        el * p.rotSpeed * mult
      );
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const shades = ["#f47dbd", "#fda6d5", "#ffe3f1", "#ec6ab0"];
    const color = new THREE.Color();
    for (let i = 0; i < COUNT; i++) {
      color.set(shades[i % shades.length]);
      mesh.setColorAt(i, color);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, []);

  useLayoutEffect(() => {
    return () => texture.dispose();
  }, [texture]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]} frustumCulled={false} renderOrder={1}>
      <planeGeometry args={[0.11, 0.11]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        toneMapped={false}
        opacity={0.9}
      />
    </instancedMesh>
  );
}
