"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export type FactCardType = {
  id: string;
  title: string;
  content: string;
  category: string;
};

export default function FactCard({ fact }: { fact?: FactCardType }) {
  const [flipped, setFlipped] = useState(false);

  // ✅ Handle empty or invalid fact
  if (!fact || !fact.title) {
    return (
      <div className="w-full h-48 bg-gray-900/60 border border-gray-800 rounded-2xl animate-pulse" />
    );
  }

  return (
    <motion.div
      className="relative w-full h-52 sm:h-56 cursor-pointer perspective"
      onClick={() => setFlipped(!flipped)}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200, damping: 12 }}
    >
      {/* Flip Wrapper */}
      <motion.div
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden rounded-2xl bg-gray-900/70 backdrop-blur-md border border-gray-700 hover:border-indigo-500 shadow-md p-4 flex flex-col justify-between text-left">
          <div>
            <h3 className="text-lg font-semibold text-indigo-400 line-clamp-2">
              {fact.title}
            </h3>
            <p className="text-gray-400 text-sm mt-2 line-clamp-3">
              {fact.content}
            </p>
          </div>
          <span className="inline-block text-xs text-gray-300 bg-gray-800/60 border border-gray-700 rounded-full px-2 py-1 self-start">
            {fact.category || "General"}
          </span>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-gradient-to-br from-indigo-700/70 via-purple-600/50 to-cyan-500/40 backdrop-blur-md border border-indigo-500 shadow-lg p-4 text-left text-gray-100">
          <h3 className="text-lg font-bold mb-2">{fact.title}</h3>
          <p className="text-sm leading-relaxed">{fact.content}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
