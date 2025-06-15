import React from 'react';
import Link from 'next/link';
import { Users, Layers, Dice6, Shield, Sword, Heart, Zap } from 'lucide-react';

export default function GamePage () {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-indigo-400">
              <Dice6 className="h-8 w-8" />
              <h1 className="text-2xl font-bold text-white">RPG Manager</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Welcome to RPG Manager
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Manage your characters and game tables all in one place. Track stats, 
            health, mana, and organize your campaigns with powerful tools.
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Characters Card */}
          <Link href="/characters">
            <div className="group relative bg-gradient-to-br from-emerald-950/80 to-slate-950 border-2 border-emerald-500/30 rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 hover:border-emerald-500/60 backdrop-blur-sm cursor-pointer">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative p-8">
                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full border border-emerald-500/30 mb-6 group-hover:bg-emerald-500/30 transition-colors">
                  <Users className="h-8 w-8 text-emerald-400" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-100 transition-colors">
                  Character Manager
                </h3>

                {/* Description */}
                <p className="text-slate-300 mb-6 leading-relaxed">
                  Create and manage your RPG characters. Track health, mana, 
                  attack, defense, and other vital stats with an intuitive interface.
                </p>

                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-400">
                    <Heart className="h-4 w-4 text-red-400" />
                    <span className="text-sm">Health & Mana tracking</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <Sword className="h-4 w-4 text-orange-400" />
                    <span className="text-sm">Combat statistics</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <Shield className="h-4 w-4 text-blue-400" />
                    <span className="text-sm">Ally & enemy management</span>
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className="absolute top-6 right-6 text-emerald-400 group-hover:translate-x-1 transition-transform">
                  →
                </div>
              </div>
            </div>
          </Link>

          {/* Tables Card */}
          <Link href="/tables">
            <div className="group relative bg-gradient-to-br from-indigo-950/80 to-slate-950 border-2 border-indigo-500/30 rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 hover:border-indigo-500/60 backdrop-blur-sm cursor-pointer">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative p-8">
                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 bg-indigo-500/20 rounded-full border border-indigo-500/30 mb-6 group-hover:bg-indigo-500/30 transition-colors">
                  <Layers className="h-8 w-8 text-indigo-400" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-100 transition-colors">
                  Game Tables
                </h3>

                {/* Description */}
                <p className="text-slate-300 mb-6 leading-relaxed">
                  Organize your campaigns with custom tables. Create, edit, and 
                  manage game data with flexible columns and random generators.
                </p>

                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-400">
                    <Layers className="h-4 w-4 text-indigo-400" />
                    <span className="text-sm">Multiple game tables</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <Dice6 className="h-4 w-4 text-purple-400" />
                    <span className="text-sm">Random generators</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm">Dynamic content management</span>
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className="absolute top-6 right-6 text-indigo-400 group-hover:translate-x-1 transition-transform">
                  →
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Stats or Additional Info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-6 px-8 py-4 bg-slate-800/50 rounded-full border border-slate-700 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <Users className="h-5 w-5 text-emerald-400" />
              <span className="text-sm">Character Management</span>
            </div>
            <div className="w-px h-6 bg-slate-600" />
            <div className="flex items-center gap-2 text-slate-400">
              <Layers className="h-5 w-5 text-indigo-400" />
              <span className="text-sm">Table Organization</span>
            </div>
            <div className="w-px h-6 bg-slate-600" />
            <div className="flex items-center gap-2 text-slate-400">
              <Dice6 className="h-5 w-5 text-purple-400" />
              <span className="text-sm">Campaign Tools</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
