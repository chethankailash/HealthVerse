"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase/browserClient";
import FactPopup from "./FactPopup";
import confetti from "canvas-confetti";
import { Howl } from "howler";

type Props = { onAdded?: () => void };

export default function HabitForm({ onAdded }: Props) {
  const [type, setType] = useState("sleep");
  const [value, setValue] = useState("");
  const [date, setDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fact, setFact] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) {
        setMessage("⚠️ Please login first.");
        setLoading(false);
        return;
      }

      const payload = {
        user_id: user.id,
        type,
        value: Number(value),
        date,
      };

      // 1️⃣ Insert habit (backend handles XP, streak, world, fact unlock)
      const { error } = await supabase.from("habits").insert([payload]);
      if (error) throw error;

      // 🎉 Celebration
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      new Howl({ src: ["/success.mp3"], volume: 0.3 }).play();

      // 2️⃣ Fetch random fact for popup
      const { data: factData } = await supabase
        .from("fact_cards")
        .select("*")
        .eq("category", type)
        .order("random()")
        .limit(1)
        .single();

      setFact(factData);
      setValue("");
      setMessage("✅ Habit logged! XP + World updated.");
      onAdded?.();
    } catch (err) {
      console.error("Submit error:", err);
      setMessage("❌ Failed to add habit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 border border-gray-800 p-5 rounded-xl space-y-4"
      >
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Habit Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-gray-800 rounded p-2 border border-gray-700"
          >
            <option value="sleep">Sleep</option>
            <option value="hydration">Hydration</option>
            <option value="exercise">Exercise</option>
            <option value="mindfulness">Mindfulness</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Value</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-gray-800 rounded p-2 border border-gray-700"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-gray-800 rounded p-2 border border-gray-700"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-semibold transition"
        >
          {loading ? "Logging..." : "Add Habit"}
        </button>

        {message && (
          <p className="text-center text-sm mt-2 text-gray-300">{message}</p>
        )}
      </form>

      {fact && <FactPopup fact={fact} onClose={() => setFact(null)} />}
    </>
  );
}
