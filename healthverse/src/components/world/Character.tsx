"use client";

import { useGLTF, useAnimations } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface CharacterProps {
  moving?: boolean;
}

export default function Character({ moving = false }: CharacterProps) {
  const ref = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/character.glb");
  const { actions } = useAnimations(animations, ref);
  const [currentAction, setCurrentAction] = useState<string | null>(null);

  useEffect(() => {
    if (!actions) return;

    const idle = actions["Idle"] || actions["idle"];
    const walk = actions["Walk"] || actions["Walking"] || actions["walk"];

    const nextAction = moving ? walk : idle;
    const prevAction = moving ? idle : walk;

    if (nextAction && nextAction !== actions[currentAction || ""]) {
      prevAction?.fadeOut(0.3);
      nextAction.reset().fadeIn(0.3).play();
      setCurrentAction(nextAction.getClip().name);
      console.log("🎞 Switching animation →", nextAction.getClip().name);
    }
  }, [moving, actions, currentAction]);

  return (
    <group ref={ref} position={[0, 0.8, 0]} scale={0.7}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/character.glb");
