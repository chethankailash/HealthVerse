"use client";

import Konva from "konva";
import "konva/lib/shapes/Rect";
import "konva/lib/shapes/Circle";
import { Stage, Layer, Rect, Circle } from "react-konva";
import { useEffect, useState } from "react";

type WorldState = {
  land: number;
  water: number;
  trees: number;
  sky: number;
  aura: number;
  biome?: string;
};

export default function WorldCanvas({ userWorld }: { userWorld?: WorldState }) {
  const [state, setState] = useState<WorldState>(
    userWorld || { land: 5, water: 2, trees: 3, sky: 3, aura: 1, biome: "grassland" }
  );
  const [size, setSize] = useState({ width: 800, height: 400 });

  useEffect(() => {
    const handleResize = () => {
      const w = Math.min(window.innerWidth * 0.9, 800);
      setSize({ width: w, height: w * 0.5 });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (userWorld) setState(userWorld);
  }, [userWorld]);

  const biomeColor =
    state.biome === "forest"
      ? "#14532d"
      : state.biome === "desert"
      ? "#facc15"
      : state.biome === "oasis"
      ? "#4ade80"
      : "#065f46";

  return (
    <div className="flex justify-center items-center">
      <Stage width={size.width} height={size.height}>
        <Layer>
          {/* Sky */}
          <Rect
            x={0}
            y={0}
            width={size.width}
            height={size.height * 0.4}
            fill={state.sky > 5 ? "#3b82f6" : "#1e3a8a"}
            opacity={0.9}
          />

          {/* Land */}
          <Rect
            x={0}
            y={size.height * 0.4}
            width={size.width}
            height={size.height * 0.6}
            fill={biomeColor}
          />

          {/* Water */}
          {[...Array(state.water)].map((_, i) => (
            <Circle
              key={`w${i}`}
              x={80 + i * 100}
              y={size.height * 0.8}
              radius={10 + Math.random() * 10}
              fill="#2563eb"
              opacity={0.6 + Math.random() * 0.3}
            />
          ))}

          {/* Trees */}
          {[...Array(state.trees)].map((_, i) => (
            <Rect
              key={`t${i}`}
              x={40 + i * 90}
              y={size.height * 0.55}
              width={15}
              height={40}
              fill="#16a34a"
              scaleY={0.8 + Math.random() * 0.4}
            />
          ))}

          {/* Aura */}
          {[...Array(state.aura)].map((_, i) => (
            <Circle
              key={`a${i}`}
              x={size.width - 100 - i * 40}
              y={size.height * 0.6}
              radius={25}
              fill="#a855f7"
              opacity={0.15 + i * 0.1}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
