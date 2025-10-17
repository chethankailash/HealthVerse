"use client";

import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { a, useSpring } from "@react-spring/three";

interface NatureObjectProps {
  model: string;
  count?: number;
  area?: number;
  scale?: number;
  animationDelay?: number;
}

export default function NatureObject({
  model,
  count = 5,
  area = 10,
  scale = 1,
  animationDelay = 0,
}: NatureObjectProps) {
  const { scene } = useGLTF(`/models/nature/${model}`);

  // Clone + randomize
  const clones = useMemo(() => {
    const items: THREE.Object3D[] = [];
    for (let i = 0; i < count; i++) {
      const clone = scene.clone(true);
      const x = (Math.random() - 0.5) * area;
      const z = (Math.random() - 0.5) * area;
      const s = scale * (0.8 + Math.random() * 0.4);
      clone.position.set(x, -1.35, z);
      clone.scale.setScalar(s);
      clone.rotation.y = Math.random() * Math.PI * 2;
      items.push(clone);
    }
    return items;
  }, [scene, count, area, scale]);

  // 🌱 Spring animation (fade + grow)
  const springs = useSpring({
    from: { scale: 0, opacity: 0, y: -1.5 },
    to: { scale: 1, opacity: 1, y: 0 },
    config: { tension: 80, friction: 15 },
    delay: animationDelay * 1000,
  });

  return (
    <>
      {clones.map((obj, i) => (
        <a.group
          key={i}
          scale={springs.scale}
          position-y={springs.y}
          rotation-y={obj.rotation.y}
        >
          <primitive object={obj} />
        </a.group>
      ))}
    </>
  );
}

useGLTF.preload("/models/nature/Tree_01.glb");
useGLTF.preload("/models/nature/Bush_01.glb");
useGLTF.preload("/models/nature/Rock_01.glb");
useGLTF.preload("/models/nature/Grass_01.glb");
useGLTF.preload("/models/nature/Stump_01.glb");
useGLTF.preload("/models/nature/Flowers_01.glb");
