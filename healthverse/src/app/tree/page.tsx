"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/browserClient";
import Navbar from "@/components/Navbar";
import KnowledgeTreeVisual from "@/components/KnowledgeTreeVisual";

export default function KnowledgeTreePage() {
  const [cards, setCards] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);
  const [badge, setBadge] = useState("none");

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        window.location.href = "/auth";
        return;
      }
      const userId = session.user.id;

      const { data, error } = await supabase
        .from("user_fact_cards")
        .select("fact_cards(id,title,content,category)")
        .eq("user_id", userId)
        .order("unlocked_at", { ascending: false });
      if (!error && data) setCards(data);

      const { data: stats } = await supabase
        .from("user_stats")
        .select("current_streak,last_badge")
        .eq("user_id", userId)
        .single();

      if (stats) {
        setStreak(stats.current_streak);
        setBadge(stats.last_badge);
      }
    })();
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10 text-center">
        <h1 className="text-3xl font-bold mb-2">🌳 Knowledge Tree</h1>
        <p className="text-gray-400 mb-6">
          Your wisdom grows with every habit you log.
        </p>

        {/* Tree Visualization */}
        <div className="flex justify-center mb-10">
          <KnowledgeTreeVisual totalCards={cards.length} />
        </div>

        {/* Badge + Streak */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl py-4 mb-8">
          <p className="text-lg font-semibold">
            🔥 Streak: <span className="text-indigo-400">{streak}</span> days
          </p>
          {badge !== "none" && (
            <p className="text-green-400 font-semibold mt-2">🏅 {badge}</p>
          )}
        </div>

        {/* Card Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {cards.length === 0 ? (
            <p className="text-gray-500 col-span-full">
              No fact cards unlocked yet — log habits to grow your tree!
            </p>
          ) : (
            cards.map((c) => (
              <div
                key={c.fact_cards.id}
                className="bg-gray-900 border border-gray-800 p-4 rounded-xl hover:border-indigo-500 transition"
              >
                <h3 className="text-indigo-400 font-semibold mb-2">
                  {c.fact_cards.title}
                </h3>
                <p className="text-gray-300 text-sm mb-2">
                  {c.fact_cards.content}
                </p>
                <p className="text-xs text-gray-500">
                  #{c.fact_cards.category}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
