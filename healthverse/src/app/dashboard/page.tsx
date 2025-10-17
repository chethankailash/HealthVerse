"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/browserClient";
import Navbar from "@/components/Navbar";
import WorldScene from "@/components/world/WorldScene";
import KnowledgeTreeVisual from "@/components/KnowledgeTreeVisual";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [world, setWorld] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      window.location.href = "/auth";
      return;
    }

    const userId = session.user.id;
    setUser(session.user);

    // 🧠 Load user stats
    const { data: s } = await supabase
      .from("user_stats")
      .select("xp,current_streak,last_badge")
      .eq("user_id", userId)
      .maybeSingle();
    setStats(s || { xp: 0, current_streak: 0, last_badge: "none" });

    // 🌍 Load world data
    const { data: w } = await supabase
      .from("user_world")
      .select("world_state,biome")
      .eq("user_id", userId)
      .maybeSingle();
    setWorld(
      w || {
        world_state: { land: 5, water: 2, trees: 3, sky: 3, aura: 1 },
        biome: "grassland",
      }
    );

    // 🌿 Load fact cards
    const { data: c } = await supabase
      .from("user_fact_cards")
      .select("fact_cards(id,title,content,category),unlocked_at")
      .eq("user_id", userId)
      .order("unlocked_at", { ascending: false });
    setCards(c || []);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading)
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading your dashboard...</p>
      </main>
    );

  const level = Math.floor((stats?.xp || 0) / 100) + 1;
  const progress = ((stats?.xp || 0) % 100) / 100;

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="flex flex-col items-center text-center mb-10">
          <motion.h1
            className="text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Personal Growth Dashboard
          </motion.h1>
          <p className="text-gray-400 max-w-2xl">
            Your evolving summary of habits, world, and wisdom — all in one
            place.
          </p>
        </div>

        {/* PROFILE */}
        <motion.div
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div>
              <p className="font-semibold text-lg">{user?.email}</p>
              <p className="text-gray-400 text-sm">Level {level}</p>
            </div>
            <p className="text-gray-400 mt-2 sm:mt-0">
              🌍 Biome:{" "}
              <span className="text-indigo-400 font-semibold">
                {world?.biome || "Grassland"}
              </span>
            </p>
          </div>
        </motion.div>

        {/* XP BAR */}
        <motion.div
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="mb-2 text-gray-300 font-medium">XP Progress</p>
          <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden mb-2">
            <div
              className="h-3 bg-gradient-to-r from-indigo-500 to-green-400 transition-all duration-700"
              style={{ width: `${progress * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400">
            {stats?.xp} XP — Level {level}
          </p>
        </motion.div>

        {/* STREAK & BADGE */}
        <motion.div
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8 flex justify-between items-center flex-wrap gap-3"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-gray-300">
            🔥 Current Streak:{" "}
            <span className="font-semibold">{stats?.current_streak}</span> days
          </p>
          {stats?.last_badge && stats.last_badge !== "none" && (
            <p className="text-green-400 font-semibold text-sm">
              🏅 {stats.last_badge}
            </p>
          )}
        </motion.div>

        {/* 🌍 3D WORLD SNAPSHOT */}
        <motion.div
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-12"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-semibold text-indigo-400 mb-4 text-center">
            🌎 Your World Snapshot
          </h2>

          <div className="w-full h-[70vh] rounded-xl overflow-hidden border border-gray-800 bg-[#ab8c51]/20">
            <WorldScene xp={stats?.xp || 0} streak={stats?.current_streak || 0} />
          </div>
        </motion.div>

        {/* KNOWLEDGE TREE */}
        <motion.div
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8 text-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-semibold text-indigo-400 mb-2">
            🌳 Knowledge Tree
          </h2>
          <p className="text-gray-400 mb-6">
            Your wisdom grows with every fact card you unlock.
          </p>

          <div className="flex justify-center mb-8">
            <KnowledgeTreeVisual totalCards={cards.length} />
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {cards.length === 0 ? (
              <p className="text-gray-500 col-span-full">
                No fact cards unlocked yet — log habits to grow your tree!
              </p>
            ) : (
              cards.map((c, i) => (
                <motion.div
                  key={c.fact_cards.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-gray-800 border border-gray-700 hover:border-indigo-500 transition rounded-xl p-4 text-left"
                >
                  <h3 className="text-indigo-400 font-semibold mb-2 text-sm">
                    {c.fact_cards.title}
                  </h3>
                  <p className="text-gray-300 text-xs line-clamp-3">
                    {c.fact_cards.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    #{c.fact_cards.category}
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* SUMMARY */}
        <motion.div
          className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-gray-300">
            🌿 Fact Cards Collected:{" "}
            <span className="text-indigo-400 font-semibold">
              {cards.length}
            </span>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
