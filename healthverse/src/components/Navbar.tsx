"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/browserClient";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    })();

    // listen for login/logout events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  return (
    <nav className="sticky top-0 z-20 bg-gray-900/90 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-indigo-400">
          HealthVerse
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link href="/facts" className="hover:text-indigo-400 transition">
            Facts
          </Link>
          <Link href="/habits" className="hover:text-indigo-400 transition">
            Habits
          </Link>
          <Link href="/world" className="hover:text-indigo-400 transition">
            World
          </Link>
          <Link href="/dashboard" className="hover:text-indigo-400 transition">
            Dashboard
          </Link>
          <Link href="/profile" className="hover:text-indigo-400">Profile</Link>
          {user ? (
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 transition"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/auth"
              className="bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg text-white transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
