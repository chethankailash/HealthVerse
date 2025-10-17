"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/browserClient";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    if (error) alert("❌ " + error.message);
    else setSent(true);

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full shadow-xl text-center">
        <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Forgot Password
        </h1>
        {!sent ? (
          <form onSubmit={handleReset}>
            <p className="text-gray-400 mb-6 text-sm">
              Enter your registered email. You’ll receive a link to reset your password.
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
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
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div>
            <p className="text-green-400 mb-4">
              ✅ Check your email for the password reset link!
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
