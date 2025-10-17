"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/browserClient";
import Link from "next/link";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("❌ Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) alert("❌ " + error.message);
    else setSuccess(true);

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full shadow-xl text-center">
        <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
          Reset Your Password
        </h1>

        {!success ? (
          <form onSubmit={handleUpdate}>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 outline-none mb-3"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 outline-none mb-4"
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg font-semibold transition ${
                loading
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 to-green-400 text-white hover:opacity-90"
              }`}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        ) : (
          <div>
            <p className="text-green-400 mb-4">
              ✅ Password updated successfully!
            </p>
            <Link
              href="/auth"
              className="text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
