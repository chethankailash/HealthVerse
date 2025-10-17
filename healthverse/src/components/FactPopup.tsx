"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FactPopup({
  fact,
  onClose,
}: {
  fact: any;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!fact) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gray-900 border border-indigo-600 rounded-xl p-6 text-center max-w-md"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <h3 className="text-xl font-bold text-indigo-400 mb-2">
            {fact.title}
          </h3>
          <p className="text-gray-300 text-sm mb-4">{fact.content}</p>
          <p className="text-xs text-gray-500">#{fact.category}</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
