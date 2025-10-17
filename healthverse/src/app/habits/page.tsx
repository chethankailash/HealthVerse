"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/browserClient";
import HabitForm from "@/components/HabitForm";
import Navbar from "@/components/Navbar";

// 📅 FullCalendar imports (no CSS import here)
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

type Habit = {
  id: number;
  type: string;
  value: number;
  date: string;
  created_at: string;
};

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // ✅ Fetch logged-in user
  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/auth";
      return;
    }
    setUserId(user.id);
    return user.id;
  };

  // ✅ Fetch user's habits
  const fetchHabits = async () => {
    setLoading(true);
    const currentUserId = userId || (await fetchUser());
    if (!currentUserId) return;

    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", currentUserId)
      .order("date", { ascending: false });

    if (error) console.error("Error fetching habits:", error);
    else setHabits(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUser().then(() => fetchHabits());
  }, []);

  // ✅ Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const formatDateKey = (d: Date | string) => {
    const dateObj = typeof d === "string" ? new Date(d) : d;
    return dateObj.toISOString().split("T")[0];
  };

  // ✅ Filter habits by selected day
  const habitsForDate = habits.filter(
    (h) => formatDateKey(h.date) === (selectedDate ? formatDateKey(selectedDate) : "")
  );

  // ✅ Color by habit type
  const habitColor = (type: string) => {
    switch (type) {
      case "sleep":
        return "#34d399"; // green
      case "hydration":
        return "#3b82f6"; // blue
      case "exercise":
        return "#f59e0b"; // yellow
      case "mindfulness":
        return "#a855f7"; // purple
      default:
        return "#6366f1"; // indigo fallback
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <motion.h1
            className="text-4xl font-bold mb-3 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Habit Tracker
          </motion.h1>

          <motion.p
            className="text-gray-400 max-w-2xl text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Visualize your routines across the month — track, reflect, and grow.
          </motion.p>
        </div>

        {/* ➕ Add Habit Section */}
        <motion.div
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-semibold text-indigo-400 mb-4 text-center">
            ➕ Add a New Habit
          </h2>
          <HabitForm onAdded={fetchHabits} />
        </motion.div>

        {/* 📅 FullCalendar View */}
        <motion.div
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-semibold text-indigo-400 mb-6 text-center">
            📅 Habit Calendar
          </h2>

          <div className="bg-gray-800 rounded-lg overflow-hidden p-4">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              height="auto"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "",
              }}
              events={habits.map((h) => ({
                title: `${h.type} (${h.value})`,
                date: h.date,
                backgroundColor: habitColor(h.type),
                borderColor: habitColor(h.type),
                textColor: "#fff",
              }))}
              dateClick={(info) => {
                setSelectedDate(new Date(info.dateStr + "T00:00:00"));
              }}
              dayMaxEventRows={2}
              eventDisplay="block"
              eventTextColor="#fff"
              eventClassNames="rounded-md text-xs font-semibold"
            />
          </div>
        </motion.div>

        {/* 🗓️ Habits for Selected Date */}
        <motion.div
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-indigo-400 text-center">
            🗓 Habits for {selectedDate?.toLocaleDateString()}
          </h2>

          {loading ? (
            <p className="text-gray-400 text-center">Loading habits...</p>
          ) : habitsForDate.length === 0 ? (
            <p className="text-gray-500 text-center">
              No habits logged for this day.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {habitsForDate.map((h) => (
                <motion.div
                  key={h.id}
                  className="bg-gray-800 border border-gray-700 hover:border-indigo-500 transition rounded-xl p-4 flex flex-col justify-between"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div>
                    <h3
                      className="text-lg font-semibold capitalize"
                      style={{ color: habitColor(h.type) }}
                    >
                      {h.type}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Value: <span className="text-white">{h.value}</span>
                    </p> 
                  </div>
                  <p className="text-gray-500 text-xs mt-2 text-right">
                    {new Date(h.date).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
