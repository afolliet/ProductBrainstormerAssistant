import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Loader2, Target, Lightbulb, Megaphone, CheckCircle2, TrendingUp, AlertTriangle, MonitorPlay, Newspaper, MonitorSmartphone, Package } from 'lucide-react';
import { BrandPackage } from './types';

export default function App() {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [brandData, setBrandData] = useState<BrandPackage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate brand package');
      }

      const data = await res.json();
      setBrandData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-black selection:text-white">
      {/* Header */}
      <header className="px-6 py-8 md:py-12 max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Brand Builder</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-24">
        {!brandData && !isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mt-12"
          >
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 leading-tight">
              Describe your product.<br />
              <span className="text-neutral-400">We'll build the brand.</span>
            </h2>
            <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
              Enter a simple description of your product. Our AI will generate a complete brand positioning package, SWOT analysis, and visual asset descriptions for different mediums—maintaining zero human presence in the imagery.
            </p>

            <form onSubmit={handleGenerate} className="space-y-4">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. A sleek, matte black smart water bottle that tracks hydration and glows when it's time to drink."
                className="w-full h-40 p-4 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none text-lg shadow-sm"
              />
              <button
                type="submit"
                disabled={!description.trim() || isLoading}
                className="px-6 py-3 bg-black text-white rounded-xl font-medium flex items-center gap-2 hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Brand Package
                <ArrowRight className="w-4 h-4" />
              </button>
              {error && <p className="text-red-600 font-medium">{error}</p>}
            </form>
          </motion.div>
        )}

        {isLoading && (
          <div className="mt-32 flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-black" />
            <p className="text-neutral-500 font-medium tracking-wide animate-pulse">Architecting Brand Identity...</p>
          </div>
        )}

        <AnimatePresence>
          {brandData && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 space-y-16"
            >
              {/* Top Controls */}
              <div className="flex items-center justify-between border-b border-neutral-200 pb-6">
                <div>
                  <p className="text-sm text-neutral-500 font-medium uppercase tracking-widest mb-1">Positioning Statement</p>
                  <h2 className="text-2xl md:text-3xl font-medium tracking-tight leading-snug">"{brandData.positioningStatement}"</h2>
                </div>
                <button 
                  onClick={() => setBrandData(null)}
                  className="hidden md:flex px-4 py-2 text-sm border border-neutral-200 rounded-md hover:bg-neutral-100 transition"
                >
                  Start Over
                </button>
              </div>

              {/* Grid: Audience & Strategies */}
              <div className="grid md:grid-cols-1 gap-8">
                <section className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 text-black">
                    <Target className="w-6 h-6" />
                    <h3 className="text-xl font-semibold">Customer Persona</h3>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 space-y-4">
                      <div>
                        <p className="text-sm font-medium text-neutral-400 uppercase tracking-widest mb-1">Name</p>
                        <p className="text-xl font-medium">{brandData.targetAudience.name}</p>
                      </div>
                      <div>
                         <p className="text-sm font-medium text-neutral-400 uppercase tracking-widest mb-1">Demographics</p>
                         <p className="text-neutral-700">{brandData.targetAudience.demographics}</p>
                      </div>
                      <div>
                         <p className="text-sm font-medium text-neutral-400 uppercase tracking-widest mb-1">Occupation</p>
                         <p className="text-neutral-700">{brandData.targetAudience.occupation}</p>
                      </div>
                    </div>
                    <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">
                       <div>
                         <p className="text-sm font-medium text-neutral-400 uppercase tracking-widest mb-2">Interests</p>
                         <ul className="space-y-1">
                           {brandData.targetAudience.interests?.map((item, i) => (
                             <li key={i} className="text-neutral-700 flex gap-2"><span className="text-neutral-400 mt-1">•</span>  {item}</li>
                           ))}
                         </ul>
                       </div>
                       <div>
                         <p className="text-sm font-medium text-neutral-400 uppercase tracking-widest mb-2">Pain Points</p>
                         <ul className="space-y-1">
                           {brandData.targetAudience.painPoints?.map((item, i) => (
                             <li key={i} className="text-neutral-700 flex gap-2"><span className="text-neutral-400 mt-1">•</span> {item}</li>
                           ))}
                         </ul>
                       </div>
                       <div className="sm:col-span-2">
                          <p className="text-sm font-medium text-neutral-400 uppercase tracking-widest mb-2">Goals</p>
                         <ul className="space-y-1">
                           {brandData.targetAudience.goals?.map((item, i) => (
                             <li key={i} className="text-neutral-700 flex gap-2"><span className="text-neutral-400 mt-1">•</span> {item}</li>
                           ))}
                         </ul>
                       </div>
                    </div>
                  </div>
                </section>

                <section className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 text-black">
                    <Megaphone className="w-6 h-6" />
                    <h3 className="text-lg font-semibold">Core Marketing Strategies</h3>
                  </div>
                  <ul className="space-y-4">
                    {brandData.marketingStrategies?.map((strategy, idx) => (
                      <li key={idx} className="flex gap-3 text-neutral-600 leading-relaxed">
                        <CheckCircle2 className="w-5 h-5 text-black shrink-0 mt-0.5" />
                        <span>{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* SWOT Analysis */}
              <section>
                <div className="mb-6 flex items-center gap-3">
                  <TrendingUp className="w-6 h-6" />
                  <h3 className="text-xl font-semibold tracking-tight">SWOT Analysis</h3>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: "Strengths", items: brandData.swot.strengths, color: "bg-green-50/50 border-green-100 text-green-900" },
                    { title: "Weaknesses", items: brandData.swot.weaknesses, color: "bg-red-50/50 border-red-100 text-red-900" },
                    { title: "Opportunities", items: brandData.swot.opportunities, color: "bg-blue-50/50 border-blue-100 text-blue-900" },
                    { title: "Threats", items: brandData.swot.threats, color: "bg-amber-50/50 border-amber-100 text-amber-900" },
                  ].map((category, idx) => (
                    <div key={idx} className={`p-6 rounded-xl border ${category.color}`}>
                      <h4 className="font-semibold uppercase tracking-wider text-xs mb-4 opacity-80">{category.title}</h4>
                      <ul className="space-y-3">
                        {category.items?.map((item, i) => (
                          <li key={i} className="text-sm leading-relaxed flex gap-2">
                            <span className="opacity-50 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* Visual Descriptions */}
              <section className="bg-black text-white p-8 md:p-12 rounded-3xl">
                <div className="mb-10">
                  <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-3">Visual Brand Identifications</h3>
                  <p className="text-neutral-400 max-w-2xl leading-relaxed">
                    Concept descriptions for marketing assets across various mediums, designed to showcase the product exclusively without human subjects.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Billboard */}
                  <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col">
                    <div className="flex items-center gap-3 mb-4 text-neutral-300">
                      <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center shrink-0">
                        {/* No specific billboard icon in lucide unfortunately, using something similar or a generic layout */}
                        <MonitorPlay className="w-6 h-6" /> 
                      </div>
                      <h4 className="font-medium text-lg">Billboard Ad</h4>
                    </div>
                    <p className="text-sm text-neutral-400 leading-relaxed">{brandData.visualDescriptions.billboard}</p>
                  </div>

                  {/* Newspaper */}
                  <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col">
                    <div className="flex items-center gap-3 mb-4 text-neutral-300">
                      <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center shrink-0">
                        <Newspaper className="w-6 h-6" />
                      </div>
                      <h4 className="font-medium text-lg">Newspaper Ad</h4>
                    </div>
                    <p className="text-sm text-neutral-400 leading-relaxed">{brandData.visualDescriptions.newspaper}</p>
                  </div>

                  {/* Social Media */}
                  <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col">
                    <div className="flex items-center gap-3 mb-4 text-neutral-300">
                      <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center shrink-0">
                        <MonitorSmartphone className="w-6 h-6" />
                      </div>
                      <h4 className="font-medium text-lg">Social Media Post</h4>
                    </div>
                    <p className="text-sm text-neutral-400 leading-relaxed">{brandData.visualDescriptions.socialMedia}</p>
                  </div>

                  {/* Website Banner */}
                  <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col">
                    <div className="flex items-center gap-3 mb-4 text-neutral-300">
                      <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center shrink-0">
                        <MonitorPlay className="w-6 h-6" />
                      </div>
                      <h4 className="font-medium text-lg">Website Banner</h4>
                    </div>
                    <p className="text-sm text-neutral-400 leading-relaxed">{brandData.visualDescriptions.websiteBanner}</p>
                  </div>

                  {/* Packaging */}
                  <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col">
                    <div className="flex items-center gap-3 mb-4 text-neutral-300">
                      <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center shrink-0">
                        <Package className="w-6 h-6" />
                      </div>
                      <h4 className="font-medium text-lg">Packaging Form</h4>
                    </div>
                    <p className="text-sm text-neutral-400 leading-relaxed">{brandData.visualDescriptions.packaging}</p>
                  </div>
                </div>
              </section>

              {/* Ideas & Influencers */}
              <div className="grid md:grid-cols-2 gap-8 pb-12">
                <section className="bg-white p-8 rounded-2xl border border-neutral-200">
                  <div className="flex items-center gap-3 mb-6">
                    <Lightbulb className="w-6 h-6" />
                    <h3 className="text-lg font-semibold">Content & Campaign Concepts</h3>
                  </div>
                  <ul className="space-y-4">
                    {brandData.contentIdeas?.map((idea, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-neutral-600 leading-relaxed bg-neutral-50 p-4 rounded-lg">
                        <span className="font-mono text-neutral-400 shrink-0 mt-0.5">{(idx + 1).toString().padStart(2, '0')}</span>
                        <span>{idea}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="bg-white p-8 rounded-2xl border border-neutral-200">
                  <div className="flex items-center gap-3 mb-6">
                    <AlertTriangle className="w-6 h-6" />
                    <h3 className="text-lg font-semibold">Influencer Strategies</h3>
                  </div>
                  <ul className="space-y-4">
                    {brandData.influencerRecommendations?.map((rec, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-neutral-600 leading-relaxed bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                        <span className="font-mono text-neutral-400 shrink-0 mt-0.5">{(idx + 1).toString().padStart(2, '0')}</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <div className="md:hidden pb-12">
                 <button 
                  onClick={() => setBrandData(null)}
                  className="w-full px-4 py-3 text-sm font-medium border border-neutral-200 rounded-xl hover:bg-neutral-100 transition"
                >
                  Start Over
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

