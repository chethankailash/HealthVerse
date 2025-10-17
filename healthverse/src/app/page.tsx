"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/browserClient";

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [session, setSession] = useState<any>(null);

  // ✅ Check session on load
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // ✅ Ensure video autoplay works
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          setTimeout(() => video.play().catch(() => {}), 1000);
        });
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col overflow-hidden relative">
      <Navbar />

      {/* ============================ */}
      {/* 🎬 Hero Section */}
      {/* ============================ */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        {/* Background Video */}
        <video
          ref={videoRef}
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/70 via-gray-950/60 to-gray-950/80 pointer-events-none" />

        {/* Foreground Content */}
        <div className="relative z-10">
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-4 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent leading-tight drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Build Habits. <br /> Gain Wisdom.
          </motion.h1>

          <motion.p
            className="max-w-2xl text-gray-200 mb-10 text-lg sm:text-xl leading-relaxed mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Transform your daily routines into a living digital world.  
            Earn XP, evolve your realm, and unlock real-world wisdom inside  
            <span className="text-indigo-400 font-semibold"> HealthVerse</span>.
          </motion.p>

          {/* Hero Buttons */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 relative z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Link
              href="/habits"
              className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-500 font-semibold transition"
            >
              Start Tracking
            </Link>
            <Link
              href="/world"
              className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-semibold transition"
            >
              View World
            </Link>
            <a
              href="#about"
              className="px-6 py-3 rounded-lg border border-gray-700 hover:border-indigo-400 transition"
            >
              Learn More
            </a>
          </motion.div>
        </div>
      </section>

      {/* ============================ */}
      {/* 💡 About Section */}
      {/* ============================ */}
      <section
        id="about"
        className="bg-gray-900 border-t border-gray-800 py-16 px-6 sm:px-10 text-center relative z-10"
      >
        <motion.h2
          className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          About HealthVerse
        </motion.h2>

        <motion.p
          className="max-w-3xl mx-auto text-gray-400 mb-12 text-lg leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <span className="text-indigo-400 font-semibold">HealthVerse</span> is a gamified wellness
          ecosystem that connects your habits to an evolving digital world.  
          Each action you take — from tracking hydration to practicing mindfulness —  
          adds life, growth, and balance to your personal realm.
        </motion.p>

        {/* Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {[
            { icon: "🔥", title: "Habit XP", desc: "Earn XP every time you log your progress." },
            { icon: "🌎", title: "Evolving World", desc: "Watch your realm grow as you build better habits." },
            { icon: "🌿", title: "Knowledge Tree", desc: "Unlock fact cards and see your wisdom expand." },
            { icon: "💫", title: "Gamified Progress", desc: "Track streaks, badges, and levels in real time." },
          ].map((f, i) => (
            <motion.div
              key={i}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-left hover:border-indigo-400 transition"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i }}
            >
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="text-xl font-semibold text-indigo-400 mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============================ */}
      {/* ⚡ CTA Section (Dynamic) */}
      {/* ============================ */}
      <section className="py-16 px-6 text-center bg-gradient-to-b from-gray-900 to-gray-950 border-t border-gray-800 relative z-20">
        {!session ? (
          <>
            <motion.h3
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Ready to Start Your Journey?
            </motion.h3>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                href="/auth"
                className="px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-semibold transition relative z-30"
              >
                Join HealthVerse Now
              </Link>
            </motion.div>
          </>
        ) : (
          <>
            <motion.h3
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Welcome back, explorer! 🌍
            </motion.h3>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                href="/dashboard"
                className="px-8 py-3 rounded-lg bg-green-600 hover:bg-green-500 font-semibold transition relative z-30"
              >
                Go to Dashboard
              </Link>
            </motion.div>
          </>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 text-center py-4 text-gray-500 text-sm relative z-20">
        © {new Date().getFullYear()} HealthVerse — Built with ❤️ for Codestorm 5 Hackathon
      </footer>
    </main>
  );
}
