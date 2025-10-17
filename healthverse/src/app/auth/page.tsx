"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase/browserClient";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) return setMessage(`❌ ${error.message}`);
      setMessage("✅ Check your email to confirm sign-up.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return setMessage(`❌ ${error.message}`);
      setMessage("✅ Logged in!");
      router.push("/");
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">
        {isSignUp ? "Create Account" : "Login"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-xl w-full max-w-sm flex flex-col gap-3 border border-gray-700"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded bg-gray-900 border border-gray-700 text-white"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 rounded bg-gray-900 border border-gray-700 text-white"
          required
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 py-2 rounded-lg font-semibold transition"
        >
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
        <Link href="/auth/forgot" className="text-indigo-400 hover:text-indigo-300 text-sm">
  Forgot password?
</Link>

        <p
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-sm text-gray-400 cursor-pointer hover:text-indigo-400 text-center mt-2"
        >
          {isSignUp ? "Already have an account? Login" : "Don’t have an account? Sign up"}
        </p>
      </form>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </main>
  );
}
