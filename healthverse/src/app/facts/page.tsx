"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/browserClient";
import FactCard, { FactCardType } from "@/components/FactCard";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

export default function FactsPage() {
  const [facts, setFacts] = useState<FactCardType[]>([]);
  const [filteredFacts, setFilteredFacts] = useState<FactCardType[]>([]);
  const [category, setCategory] = useState<string>("all");

  // ✅ Load facts from Supabase
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("fact_cards").select("*");
      if (error) console.error(error);
      else {
        setFacts(data || []);
        setFilteredFacts(data || []);
      }
    })();
  }, []);

  // ✅ Filter facts by category
  useEffect(() => {
    if (category === "all") setFilteredFacts(facts);
    else setFilteredFacts(facts.filter((f) => f.category === category));
  }, [category, facts]);

  const categories = ["all", ...new Set(facts.map((f) => f.category))];

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Page Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <motion.h1
            className="text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Fact Cards
          </motion.h1>

          <motion.p
            className="text-gray-400 max-w-2xl text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Discover bite-sized insights that grow your <span className="text-indigo-400">Knowledge Tree</span>.  
            Filter by topic and expand your wisdom every day.
          </motion.p>
        </div>

        {/* Filter Buttons */}
        <div className="mb-8 flex gap-3 flex-wrap justify-center">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setCategory(cat)}
              whileHover={{ scale: 1.05 }}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${
                category === cat
                  ? "bg-indigo-600 border-indigo-600"
                  : "border-gray-700 hover:border-indigo-400"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Facts Grid */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
          {filteredFacts.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No facts found for this category.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFacts.map((fact, index) => (
                <motion.div
                  key={fact.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <FactCard fact={fact} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
