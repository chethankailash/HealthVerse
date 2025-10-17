"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import WorldScene from "@/components/world/WorldScene";
import { supabase } from "@/lib/supabase/browserClient";
import { motion } from "framer-motion";

export default function WorldPage() {
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        window.location.href = "/auth";
        return;
      }

      const { data, error } = await supabase
        .from("user_stats")
        .select("xp, current_streak")
        .eq("user_id", session.user.id)
        .single();

      if (error) console.error(error);
      else if (data) {
        setXp(data.xp || 0);
        setStreak(data.current_streak || 0);
      }
      setLoading(false);
    };

    loadStats();
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <motion.h1
            className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Your HealthVerse World
          </motion.h1>

          <motion.p
            className="text-gray-400 max-w-2xl text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Explore your evolving wellness world — the brighter and richer it becomes,
            the more consistent your habits have been.
          </motion.p>
        </div>

        {/* World Container */}
        <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-lg">
          {/* 3D World Canvas */}
          <div className="w-full h-[600px] sm:h-[700px] md:h-[750px]">
            <WorldScene xp={xp} streak={streak} />
          </div>

          {/* Overlay Stats */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-900/80 backdrop-blur-lg px-4 py-2 rounded-lg border border-gray-700 text-sm">
            {loading ? (
              <p className="text-gray-400">Loading your stats...</p>
            ) : (
              <p>
                ⭐ XP: <span className="text-indigo-400 font-semibold">{xp}</span> | 🔥 Streak:{" "}
                <span className="text-green-400 font-semibold">{streak}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
