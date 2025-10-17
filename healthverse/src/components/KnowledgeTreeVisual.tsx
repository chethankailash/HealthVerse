"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Props = {
  totalCards: number;
};

export default function KnowledgeTreeVisual({ totalCards }: Props) {
  const [growth, setGrowth] = useState(totalCards);

  useEffect(() => {
    setGrowth(totalCards);
  }, [totalCards]);

  const height = 150 + growth * 10; // grows with card count
  const leaves = Array.from({ length: Math.min(growth, 12) });

  return (
    <motion.div
      className="relative flex flex-col items-center justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Tree trunk */}
      <motion.div
        className="bg-amber-800 w-6 rounded-t-md"
        style={{ height }}
        initial={{ scaleY: 0.5 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.8 }}
      />

      {/* Glowing leaves */}
      {leaves.map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-green-500 rounded-full"
          style={{
            width: 20,
            height: 20,
            left: `${50 + (Math.random() * 60 - 30)}%`,
            top: `${30 + Math.random() * 40}%`,
            boxShadow: "0 0 8px #22c55e",
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.9, scale: 1 }}
          transition={{ delay: 0.1 * i }}
        />
      ))}

      {/* Label */}
      <p className="text-gray-400 text-sm mt-3">
        🌿 {growth} Knowledge Cards
      </p>
    </motion.div>
  );
}
