/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, Star, Clock, Trash2, ExternalLink, Globe,
  MessageSquare, Palette, Camera, Tv, BookOpen, ShieldCheck, 
  GraduationCap, LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WebApp, AppCategory } from '../types';

interface LauncherHomeProps {
  apps: WebApp[];
  onLaunchApp: (app: WebApp) => void;
  onAddAppClick: () => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onDeleteApp?: (id: string, e: React.MouseEvent) => void;
  recentApps: WebApp[];
}

// Icon mapper for dynamic lookups
export const getIconComponent = (iconName: string, size = 20, className = '') => {
  switch (iconName) {
    case 'MessageSquare': return <MessageSquare size={size} className={className} />;
    case 'Palette': return <Palette size={size} className={className} />;
    case 'Camera': return <Camera size={size} className={className} />;
    case 'Tv': return <Tv size={size} className={className} />;
    case 'BookOpen': return <BookOpen size={size} className={className} />;
    case 'ShieldCheck': return <ShieldCheck size={size} className={className} />;
    case 'GraduationCap': return <GraduationCap size={size} className={className} />;
    case 'LayoutDashboard': return <LayoutDashboard size={size} className={className} />;
    default: return <Globe size={size} className={className} />;
  }
};

const CATEGORIES: AppCategory[] = ['All', 'AI', 'Design', 'Productivity', 'Entertainment', 'Utility', 'Custom'];

export default function LauncherHome({
  apps,
  onLaunchApp,
  onAddAppClick,
  onToggleFavorite,
  onDeleteApp,
  recentApps,
}: LauncherHomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AppCategory>('All');

  // Generate dynamic greeting based on simulated or system time
  const greeting = useMemo(() => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Filter apps based on search query and category tab
  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            app.url.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || 
                              (selectedCategory === 'Custom' && app.isCustom) ||
                              app.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [apps, searchQuery, selectedCategory]);

  // Separate favorites
  const favoriteApps = useMemo(() => {
    return apps.filter(app => app.isFavorite);
  }, [apps]);

  return (
    <div id="launcher-home-viewport" className="flex-1 flex flex-col h-full bg-[#000] overflow-y-auto custom-scrollbar select-none text-[#e0e0e0] relative">
      
      {/* Decorative Brand Accent (Material You flavor) */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"></div>

      {/* Hero Welcome Header */}
      <div className="px-6 pt-6 pb-4 relative z-10">
        <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase font-mono">WebHub Launcher</span>
        <h2 className="text-2xl font-light text-white mt-1 leading-tight">
          {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-indigo-400">Developer</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">Launch your workspaces</p>
      </div>

      {/* Quick Search Bar (Styled as md3-pill) */}
      <div className="px-6 mb-4 relative z-10">
        <div className="relative">
          <Search size={15} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search your web hubs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-full bg-bg-pill border border-white/5 focus:border-indigo-500/40 text-xs placeholder-slate-500 text-slate-200 outline-none transition-all shadow-inner focus:ring-1 focus:ring-indigo-500/10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[10px] font-bold text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Category Chips */}
      <div className="px-6 mb-5 overflow-x-auto whitespace-nowrap hide-scrollbar flex items-center gap-1.5 scroll-smooth relative z-10">
        {CATEGORIES.map(category => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-wide transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10 border border-indigo-500/20'
                  : 'bg-bg-card text-slate-400 hover:bg-[#25232a] hover:text-slate-200 border border-white/5'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Recent Applications Dashboard Section */}
      {recentApps.length > 0 && !searchQuery && selectedCategory === 'All' && (
        <div className="px-6 mb-6">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-3">
            <Clock size={11} className="text-indigo-400" />
            <span>Recents</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 hide-scrollbar">
            {recentApps.map(app => (
              <motion.button
                whileTap={{ scale: 0.95 }}
                key={`recent-${app.id}`}
                onClick={() => onLaunchApp(app)}
                className="flex flex-col items-center gap-1 shrink-0 p-2 bg-bg-card/40 rounded-xl border border-white/5 w-[72px] cursor-pointer hover:bg-bg-card transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${app.color} flex items-center justify-center text-white shadow-md`}>
                  {getIconComponent(app.iconName, 18)}
                </div>
                <span className="text-[10px] font-medium tracking-tight text-slate-300 truncate w-full text-center">
                  {app.name}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Favorites Panel Section */}
      {favoriteApps.length > 0 && !searchQuery && selectedCategory === 'All' && (
        <div className="px-6 mb-6">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-3">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span>Favorites</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {favoriteApps.map(app => (
              <motion.div
                whileTap={{ scale: 0.98 }}
                key={`favorite-${app.id}`}
                onClick={() => onLaunchApp(app)}
                className="flex items-center justify-between p-3 rounded-xl bg-bg-card hover:bg-[#25232a] border border-white/5 cursor-pointer relative overflow-hidden group transition-all"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-indigo-500"></div>
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${app.color} flex items-center justify-center text-white shrink-0`}>
                    {getIconComponent(app.iconName, 14)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-slate-200 truncate">{app.name}</p>
                    <p className="text-[9px] text-slate-500 truncate">{app.category}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => onToggleFavorite(app.id, e)}
                  className="text-amber-400 hover:text-slate-400 transition-colors cursor-pointer"
                  title="Remove Favorite"
                >
                  <Star size={13} className="fill-current" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Grid of Launcher Cards */}
      <div className="px-6 mb-6 flex-1">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-3">
          <span>All Applications ({filteredApps.length})</span>
        </div>

        {filteredApps.length === 0 ? (
          <div className="py-12 text-center rounded-2xl bg-bg-card/25 border border-dashed border-white/10 px-4">
            <Globe className="mx-auto text-slate-600 mb-2.5" size={22} />
            <p className="text-xs text-slate-400 font-medium">No applications found in this drawer.</p>
            <p className="text-[10px] text-slate-500 mt-1">Try search queries or add a new portal link!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5">
            <AnimatePresence mode="popLayout">
              {filteredApps.map(app => (
                <motion.div
                  layout
                  key={app.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onLaunchApp(app)}
                  className="group relative p-4 rounded-2xl bg-bg-card border border-white/5 hover:border-white/10 cursor-pointer flex flex-col justify-between h-[115px] hover:bg-[#25232a] transition-all shadow-sm"
                >
                  {/* Decorative faint glow */}
                  <div className={`absolute -inset-px rounded-2xl bg-gradient-to-tr ${app.color} opacity-0 group-hover:opacity-5 transition-opacity blur-xs pointer-events-none`}></div>

                  {/* Card top half: Icon & Favorites Star */}
                  <div className="flex justify-between items-start">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${app.color} flex items-center justify-center text-white shadow-md shadow-black/30 group-hover:scale-105 transition-transform`}>
                      {getIconComponent(app.iconName, 17)}
                    </div>

                    <div className="flex items-center gap-1 relative z-25">
                      <button
                        onClick={(e) => onToggleFavorite(app.id, e)}
                        className={`p-1 rounded-full hover:bg-white/5 transition-colors ${
                          app.isFavorite ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                        }`}
                        title={app.isFavorite ? 'Remove Favorite' : 'Mark Favorite'}
                      >
                        <Star size={13} className={app.isFavorite ? 'fill-current' : ''} />
                      </button>

                      {app.isCustom && onDeleteApp && (
                        <button
                          onClick={(e) => onDeleteApp(app.id, e)}
                          className="p-1 rounded-full hover:bg-white/5 text-slate-500 hover:text-red-400 transition-colors"
                          title="Delete Application"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Card bottom half: Labels */}
                  <div className="mt-3 min-w-0">
                    <h3 className="font-bold text-slate-100 text-xs tracking-tight truncate flex items-center gap-1 group-hover:text-indigo-300 transition-colors">
                      {app.name}
                      <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-slate-400" />
                    </h3>
                    <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{app.category}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Special add app action card */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onAddAppClick}
              className="p-4 rounded-2xl border border-dashed border-white/10 hover:border-indigo-500/30 bg-transparent hover:bg-bg-card/30 cursor-pointer flex flex-col justify-between h-[115px] text-left transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-bg-card border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/10 transition-colors">
                <Plus size={16} />
              </div>
              <div>
                <h3 className="font-bold text-slate-300 text-xs tracking-tight">ADD NEW</h3>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Integrate web apps</p>
              </div>
            </motion.button>
          </div>
        )}
      </div>

      {/* Educational Footer for Junior Developers */}
      <div className="px-6 py-4 border-t border-white/5 bg-bg-darker text-[10px] text-slate-400 text-center flex flex-col gap-1.5 leading-relaxed shrink-0">
        <p className="font-mono text-indigo-400">Junior Dev Insights: State Architecture</p>
        <p>
          Currently, state is persisted in <strong>React Core LocalState</strong>. For our upcoming production code, we will wire this into <strong>AsyncStorage</strong> for Android to enable persistent offline storage!
        </p>
      </div>

    </div>
  );
}
