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

// Renders an interactive miniature wireframe/preview mockup for the card background
const renderMiniPreview = (app: WebApp) => {
  const nameLower = app.name.toLowerCase();
  
  if (nameLower.includes('chatgpt') || nameLower.includes('ai')) {
    return (
      <div className="absolute bottom-0 right-0 w-[84px] h-[52px] opacity-25 group-hover:opacity-50 transition-all duration-300 overflow-hidden rounded-br-2xl rounded-tl-xl border-l border-t border-white/5 bg-neutral-950 p-1 flex flex-col gap-1 select-none pointer-events-none">
        <div className="w-full flex items-center justify-between border-b border-white/5 pb-0.5">
          <span className="text-[5px] text-slate-600 font-mono">GPT-4o</span>
          <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
        </div>
        <div className="flex flex-col gap-0.5 flex-1 justify-end pb-0.5">
          <div className="bg-emerald-950/40 rounded-[2px] p-0.5 max-w-[35px] self-start">
            <div className="w-4 h-0.5 bg-emerald-400 rounded-full"></div>
          </div>
          <div className="bg-neutral-800 rounded-[2px] p-0.5 max-w-[45px] self-end">
            <div className="w-6 h-0.5 bg-slate-400 rounded-full"></div>
          </div>
        </div>
        <div className="h-2 bg-neutral-900 border border-white/5 rounded-[2px] mt-auto flex items-center px-1">
          <div className="w-8 h-0.5 bg-neutral-700 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (nameLower.includes('netflix') || nameLower.includes('stream')) {
    return (
      <div className="absolute bottom-0 right-0 w-[84px] h-[52px] opacity-25 group-hover:opacity-50 transition-all duration-300 overflow-hidden rounded-br-2xl rounded-tl-xl border-l border-t border-white/5 bg-neutral-950 select-none pointer-events-none flex flex-col justify-between">
        <div className="p-1 flex items-center justify-between">
          <span className="text-[7px] text-red-600 font-black tracking-tighter">N</span>
          <span className="text-[4px] text-slate-500">POPULAR</span>
        </div>
        <div className="px-1 flex gap-0.5 items-end pb-1">
          <div className="w-5 h-6 bg-red-950/20 border border-white/5 rounded-[2px] shrink-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600/35"></div>
          </div>
          <div className="w-5 h-6 bg-indigo-950/20 border border-white/5 rounded-[2px] shrink-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600/35"></div>
          </div>
          <div className="w-5 h-6 bg-emerald-950/20 border border-white/5 rounded-[2px] shrink-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600/35"></div>
          </div>
        </div>
        <div className="h-0.5 bg-red-600 w-[55%]"></div>
      </div>
    );
  }

  if (nameLower.includes('canva') || nameLower.includes('design') || nameLower.includes('palette')) {
    return (
      <div className="absolute bottom-0 right-0 w-[84px] h-[52px] opacity-25 group-hover:opacity-50 transition-all duration-300 overflow-hidden rounded-br-2xl rounded-tl-xl border-l border-t border-white/5 bg-neutral-950 p-1 select-none pointer-events-none flex flex-col gap-1">
        <div className="flex justify-between items-center border-b border-white/5 pb-0.5">
          <span className="text-[5px] text-indigo-400 font-bold">Canva</span>
          <div className="flex gap-0.5">
            <span className="w-1 h-1 rounded-full bg-blue-400"></span>
            <span className="w-1 h-1 rounded-full bg-purple-400"></span>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-0.5 items-center">
          <div className="rounded-[2px] border border-indigo-500/20 aspect-video flex items-center justify-center bg-indigo-500/5">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/40"></div>
          </div>
          <div className="rounded-[2px] border border-purple-500/20 aspect-video flex items-center justify-center bg-purple-500/5">
            <div className="w-1.5 h-1.5 bg-purple-400/40 rotate-45"></div>
          </div>
        </div>
      </div>
    );
  }

  if (nameLower.includes('notion') || nameLower.includes('book') || nameLower.includes('notes') || nameLower.includes('workspace')) {
    return (
      <div className="absolute bottom-0 right-0 w-[84px] h-[52px] opacity-25 group-hover:opacity-50 transition-all duration-300 overflow-hidden rounded-br-2xl rounded-tl-xl border-l border-t border-white/5 bg-neutral-950 p-1 flex flex-col gap-1 select-none pointer-events-none">
        <div className="flex items-center gap-1 border-b border-white/5 pb-0.5">
          <span className="text-[6px] font-bold text-white">N</span>
          <span className="text-[4px] text-slate-500">Docs</span>
        </div>
        <div className="flex flex-col gap-0.5 mt-0.5">
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 border border-slate-600 rounded-[1px]"></div>
            <div className="w-8 h-0.5 bg-slate-500 rounded-full"></div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 border border-slate-600 rounded-[1px]"></div>
            <div className="w-10 h-0.5 bg-slate-500 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (nameLower.includes('photopea') || nameLower.includes('camera') || nameLower.includes('editor')) {
    return (
      <div className="absolute bottom-0 right-0 w-[84px] h-[52px] opacity-25 group-hover:opacity-50 transition-all duration-300 overflow-hidden rounded-br-2xl rounded-tl-xl border-l border-t border-white/5 bg-neutral-950 p-1 flex select-none pointer-events-none gap-1">
        <div className="flex-1 flex flex-col justify-between border border-emerald-500/20 bg-emerald-500/5 p-0.5 rounded-[2px]">
          <div className="w-full h-1 bg-neutral-900 border-b border-white/5"></div>
          <div className="w-3.5 h-3.5 rounded-full border border-emerald-400/40 mx-auto flex items-center justify-center">
            <div className="w-1 h-1 bg-emerald-400/60 rounded-full"></div>
          </div>
          <div className="w-full h-0.5 bg-neutral-900"></div>
        </div>
        <div className="w-3 flex flex-col gap-0.5 border-l border-white/5 pl-0.5 justify-center">
          <div className="w-full h-0.5 bg-neutral-800 rounded-[1px]"></div>
          <div className="w-full h-0.5 bg-neutral-800 rounded-[1px]"></div>
        </div>
      </div>
    );
  }

  // Generic Dynamic Website Preview for custom apps
  return (
    <div className="absolute bottom-0 right-0 w-[84px] h-[52px] opacity-25 group-hover:opacity-50 transition-all duration-300 overflow-hidden rounded-br-2xl rounded-tl-xl border-l border-t border-white/5 bg-neutral-950 p-1 flex flex-col gap-1 select-none pointer-events-none">
      <div className="flex items-center justify-between border-b border-white/5 pb-0.5">
        <div className="flex gap-0.5">
          <div className="w-0.5 h-0.5 rounded-full bg-red-500"></div>
          <div className="w-0.5 h-0.5 rounded-full bg-yellow-500"></div>
          <div className="w-0.5 h-0.5 rounded-full bg-green-500"></div>
        </div>
        <span className="text-[3px] text-slate-500 font-mono truncate max-w-[40px]">{app.url.replace('https://', '').replace('www.', '')}</span>
      </div>
      <div className="flex-1 flex flex-col justify-center gap-1 px-0.5">
        <div className="w-full h-1 bg-indigo-500/10 rounded-[1px] border border-indigo-500/15"></div>
        <div className="flex flex-col gap-0.5">
          <div className="w-10 h-0.5 bg-slate-600 rounded-full"></div>
          <div className="w-6 h-0.5 bg-slate-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

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
  const [profileName, setProfileName] = useState(() => {
    return localStorage.getItem('webhub_profile_name_v2') || '';
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(profileName);

  const handleSaveName = () => {
    const trimmed = tempName.trim();
    setProfileName(trimmed);
    localStorage.setItem('webhub_profile_name_v2', trimmed);
    setIsEditingName(false);
  };

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
      <div className="px-6 pt-6 pb-4 relative z-10 flex justify-between items-start">
        <div className="flex-1">
          <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase font-mono">webliox launcher</span>
          
          {isEditingName ? (
            <div className="flex items-center gap-1.5 mt-1.5">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="your name..."
                maxLength={15}
                className="bg-neutral-900 border border-white/10 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500 w-28 font-light"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveName();
                  if (e.key === 'Escape') setIsEditingName(false);
                }}
              />
              <button
                onClick={handleSaveName}
                className="text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-2 py-1 rounded cursor-pointer transition-colors"
              >
                Save
              </button>
            </div>
          ) : (
            <h2 
              onClick={() => {
                setTempName(profileName);
                setIsEditingName(true);
              }}
              className="text-2xl font-light text-white mt-1 leading-tight cursor-pointer group flex items-center gap-1 select-none"
              title="Click to personalize name"
            >
              <span>{greeting.toLowerCase()}, </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-indigo-400 border-b border-dashed border-indigo-400/30 group-hover:border-indigo-400 transition-colors">
                {profileName ? profileName.toLowerCase() : 'friend'}
              </span>
            </h2>
          )}
          <p className="text-xs text-slate-500 mt-1">launch your workspaces</p>
        </div>
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
                  className="group relative p-4 rounded-2xl bg-bg-card border border-white/5 hover:border-white/10 cursor-pointer flex flex-col justify-between h-[115px] hover:bg-[#25232a] transition-all shadow-sm overflow-hidden"
                >
                  {/* Decorative faint glow */}
                  <div className={`absolute -inset-px rounded-2xl bg-gradient-to-tr ${app.color} opacity-0 group-hover:opacity-5 transition-opacity blur-xs pointer-events-none`}></div>

                  {/* Micro aesthetic website preview mockup */}
                  {renderMiniPreview(app)}

                  {/* Card top half: Icon & Favorites Star */}
                  <div className="flex justify-between items-start relative z-20">
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

                      {onDeleteApp && (
                        <button
                          onClick={(e) => onDeleteApp(app.id, e)}
                          className="p-1 rounded-full hover:bg-white/5 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete Application"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Card bottom half: Labels */}
                  <div className="mt-3 min-w-0 relative z-20">
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

    </div>
  );
}
