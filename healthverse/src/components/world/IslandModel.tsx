"use client";
import { useGLTF } from "@react-three/drei";

export default function IslandModel() {
  const { scene } = useGLTF("/models/island.glb");
  return <primitive object={scene} scale={2} position={[0, -1.5, 0]} />;
}

useGLTF.preload("/models/island.glb");
