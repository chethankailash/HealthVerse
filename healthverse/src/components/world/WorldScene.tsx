"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Sky,
  Environment,
  Float,
  Points,
  PointMaterial,
  OrbitControls,
} from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import NatureObject from "./NatureObject";
import PlayerController from "./PlayerController";

function StreakAura({ streak }: { streak: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < 250; i++) {
      const r = 1 + Math.random() * 0.6;
      const angle = Math.random() * Math.PI * 2;
      pts.push(Math.cos(angle) * r, Math.random() * 0.8, Math.sin(angle) * r);
    }
    return new Float32Array(pts);
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.15;
  });

  if (streak < 3) return null;

  return (
    <Float speed={1} rotationIntensity={0.6} floatIntensity={1}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={streak > 10 ? "#34d399" : "#60a5fa"}
          size={0.06 + Math.min(streak / 100, 0.05)}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </Float>
  );
}

export default function WorldScene({
  xp = 0,
  streak = 0,
}: {
  xp?: number;
  streak?: number;
}) {
  const baseHue = 120;
  const lightness = 0.35 + Math.min(xp / 1000, 0.4);
  const sunElevation = 10 + Math.min(xp / 100, 40);
  const skyTurbidity = 8 - Math.min(xp / 200, 4);

  return (
    <div className="w-full h-[80vh] bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      <Canvas
        shadows
        gl={{ antialias: true }}
        camera={{ position: [0, 3, 6], fov: 50 }}
      >
        {/* ☀️ Lighting */}
        <ambientLight intensity={0.6 + Math.min(xp / 500, 0.8)} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1 + Math.min(xp / 400, 0.5)}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* 🌅 Sky */}
        <Sky
          sunPosition={[100, sunElevation, 100]}
          turbidity={skyTurbidity}
          rayleigh={2}
          mieCoefficient={0.02}
          mieDirectionalG={0.8}
        />
        <Environment preset="sunset" />
        <color
          attach="background"
          args={[`hsl(${baseHue}, 50%, ${lightness * 100}%)`]}
        />

        <fog attach="fog" args={["#0f172a", 10, 35]} />

        {/* Ground Plane */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1.35, 0]}
          receiveShadow
        >
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#ab8c51" />
        </mesh>

        {/* Character + Effects */}
        <PlayerController />
        <StreakAura streak={streak} />

        {/* 🌿 Animated Nature */}
        {xp > 50 && (
          <NatureObject model="Tree_01.glb" count={5} scale={0.9} area={12} animationDelay={0.1} />
        )}
        {xp > 120 && (
          <NatureObject model="Bush_01.glb" count={6} scale={0.7} area={10} animationDelay={0.3} />
        )}
        {xp > 250 && (
          <NatureObject model="Rock_01.glb" count={6} scale={0.6} area={10} animationDelay={0.5} />
        )}
        {xp > 400 && (
          <NatureObject model="Grass_01.glb" count={8} scale={0.5} area={12} animationDelay={0.7} />
        )}
        {xp > 600 && (
          <NatureObject model="Stump_01.glb" count={4} scale={0.8} area={8} animationDelay={0.9} />
        )}
        {xp > 800 && (
          <NatureObject model="Flowers_01.glb" count={10} scale={0.6} area={10} animationDelay={1.1} />
        )}

        <OrbitControls
          maxPolarAngle={Math.PI / 2.1}
          minDistance={4}
          maxDistance={15}
          enablePan={false}
        />
      </Canvas>
    </div>
  );
}
