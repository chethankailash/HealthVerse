"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import Character from "./Character";

const SPEED = 2.5;

export default function PlayerController() {
  const ref = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const pressedKeys = useRef<Record<string, boolean>>({});
  const [rotationY, setRotationY] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) =>
      (pressedKeys.current[e.key.toLowerCase()] = true);
    const handleKeyUp = (e: KeyboardEvent) =>
      (pressedKeys.current[e.key.toLowerCase()] = false);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    const move = new THREE.Vector3();

    if (pressedKeys.current["w"] || pressedKeys.current["arrowup"]) move.z -= 1;
    if (pressedKeys.current["s"] || pressedKeys.current["arrowdown"]) move.z += 1;
    if (pressedKeys.current["a"] || pressedKeys.current["arrowleft"]) move.x -= 1;
    if (pressedKeys.current["d"] || pressedKeys.current["arrowright"]) move.x += 1;

    setIsMoving(move.lengthSq() > 0);

    if (ref.current && move.lengthSq() > 0) {
      move.normalize().multiplyScalar(SPEED * delta);
      ref.current.position.add(move);
      const angle = Math.atan2(move.x, move.z);
      setRotationY(angle);
    }

    if (ref.current) {
      ref.current.position.y = -1.3;
      ref.current.rotation.y = rotationY;
      const camOffset = new THREE.Vector3(0, 3, 6);
      const target = ref.current.position.clone().add(camOffset);
      camera.position.lerp(target, 0.1);
      camera.lookAt(ref.current.position);
    }
  });

  return (
    <group ref={ref} position={[0, -1.3, 0]}>
      <Character moving={isMoving} />
    </group>
  );
}
