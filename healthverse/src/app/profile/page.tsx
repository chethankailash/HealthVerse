"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/browserClient";
import Navbar from "@/components/Navbar";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stats, setStats] = useState<any>(null);

  // ✅ Fetch profile & stats
  const fetchProfile = async () => {
    setLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      window.location.href = "/auth";
      return;
    }

    setUser(session.user);

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    const { data: s } = await supabase
      .from("user_stats")
      .select("xp,current_streak,last_badge")
      .eq("user_id", session.user.id)
      .maybeSingle();

    setStats(s || { xp: 0, current_streak: 0, last_badge: "none" });

    if (!error && data) setProfile(data);
    else
      setProfile({
        username: "",
        bio: "",
        age: "",
        location: "",
        gender: "",
        avatar_url: "",
      });

    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ Handle Avatar Upload
  const handleAvatarUpload = async (event: any) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      setProfile((p: any) => ({ ...p, avatar_url: publicUrl }));
    } catch (error) {
      console.error(error);
      alert("Error uploading avatar!");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Save Profile
  const handleSave = async () => {
    setSaving(true);

    const updates = {
      id: user.id,
      username: profile.username,
      bio: profile.bio,
      age: profile.age ? parseInt(profile.age) : null,
      location: profile.location,
      gender: profile.gender,
      avatar_url: profile.avatar_url,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("user_profiles")
      .upsert(updates, { onConflict: "id" });

    if (!error) {
      alert("✅ Profile updated successfully!");
      setEditMode(false);
    } else {
      alert("❌ Error saving profile.");
    }

    setSaving(false);
  };

  if (loading)
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">Loading profile...</p>
      </main>
    );

  const xp = stats?.xp || 0;
  const level = Math.floor(xp / 100) + 1;
  const progress = ((xp % 100) / 100) * 100;

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.h1
          className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          👤 My Profile
        </motion.h1>

        <motion.div
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* AVATAR */}
          <div className="flex flex-col items-center mb-6">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative cursor-pointer group"
            >
              <img
                src={
                  profile?.avatar_url ||
                  `https://ui-avatars.com/api/?name=${profile?.username || "User"}&background=1e293b&color=ffffff`
                }
                alt="Avatar"
                className="w-24 h-24 rounded-full border-2 border-indigo-500 object-cover transition group-hover:opacity-80"
              />
              <div className="absolute bottom-0 right-0 bg-indigo-500 p-1.5 rounded-full shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V8.414a2 2 0 00-.586-1.414l-4.414-4.414A2 2 0 0011.586 2H4zm0 2h7v3a1 1 0 001 1h3v7H4V5z" />
                </svg>
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleAvatarUpload}
            />

            {uploading && (
              <p className="text-sm text-gray-400 mt-2">Uploading...</p>
            )}
          </div>

          {/* VIEW / EDIT MODE */}
          {!editMode ? (
            <>
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold">
                  {profile?.username || "Unnamed User"}
                </h2>
                <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
              </div>

              <div className="text-center mb-6">
                <p className="text-gray-300 italic">
                  {profile?.bio || "No bio added yet."}
                </p>
              </div>

              {/* Stats Summary */}
              <div className="bg-gray-800 rounded-xl p-4 mb-6 text-center">
                <p className="text-gray-300 mb-2">
                  🌿 XP:{" "}
                  <span className="text-green-400 font-semibold">{xp}</span>{" "}
                  (Level {level})
                </p>
                <div className="w-full bg-gray-700 h-2 rounded-full mb-2 overflow-hidden">
                  <div
                    className="h-2 bg-gradient-to-r from-indigo-400 to-green-400 transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-gray-400 text-sm">
                  🔥 Streak: {stats?.current_streak || 0} days —{" "}
                  {stats?.last_badge !== "none" && (
                    <span className="text-green-400 font-semibold">
                      🏅 {stats?.last_badge}
                    </span>
                  )}
                </p>
              </div>

              {/* Details */}
              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Location</p>
                  <p className="text-white">
                    {profile?.location || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Gender</p>
                  <p className="text-white capitalize">
                    {profile?.gender || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Age</p>
                  <p className="text-white">{profile?.age || "Not specified"}</p>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => setEditMode(true)}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition"
                >
                  ✏️ Edit Profile
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Editable Form */}
              <div className="mb-4">
                <label className="text-gray-400 text-sm">Username</label>
                <input
                  type="text"
                  value={profile?.username || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, username: e.target.value })
                  }
                  className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="text-gray-400 text-sm">Bio</label>
                <textarea
                  value={profile?.bio || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  rows={3}
                  className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-gray-400 text-sm">Age</label>
                  <input
                    type="number"
                    value={profile?.age || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, age: e.target.value })
                    }
                    className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Location</label>
                  <input
                    type="text"
                    value={profile?.location || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, location: e.target.value })
                    }
                    className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Gender</label>
                  <select
                    value={profile?.gender || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, gender: e.target.value })
                    }
                    className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 outline-none"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="nonbinary">Non-binary</option>
                    <option value="prefer_not">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-center gap-3 mt-6">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`px-6 py-2 rounded-lg font-semibold ${
                    saving
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-500 to-green-400 text-white hover:opacity-90 transition"
                  }`}
                >
                  {saving ? "Saving..." : "💾 Save"}
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
                >
                  ✖ Cancel
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </main>
  );
}
