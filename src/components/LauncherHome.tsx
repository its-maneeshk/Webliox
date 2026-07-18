/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, Star, Clock, Trash2, ExternalLink, Globe,
  MessageSquare, Palette, Camera, Tv, BookOpen, ShieldCheck, 
  GraduationCap, LayoutDashboard, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WebApp, AppCategory } from '../types';
import BrandLogo from './BrandLogo';

interface LauncherHomeProps {
  apps: WebApp[];
  onLaunchApp: (app: WebApp) => void;
  onAddAppClick: () => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onDeleteApp?: (id: string, e: React.MouseEvent) => void;
  recentApps: WebApp[];
  onInfoClick: () => void;
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
  
  if (nameLower.includes('chatgpt') || nameLower.includes('ai') || nameLower.includes('gpt')) {
    return (
      <div className="absolute bottom-0 right-0 w-[100px] h-[65px] opacity-25 group-hover:opacity-60 transition-all duration-300 overflow-hidden rounded-br-2xl rounded-tl-2xl border-l border-t border-white/10 bg-[#0c0d10] p-1.5 flex flex-col gap-1.5 select-none pointer-events-none group-hover:scale-[1.03] group-hover:translate-x-0.5 group-hover:translate-y-0.5">
        <div className="w-full flex items-center justify-between border-b border-white/5 pb-1">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
            <span className="text-[6px] text-slate-400 font-bold font-sans">GPT-4o Workspace</span>
          </div>
          <span className="text-[5px] text-slate-600 font-mono">1.2ms</span>
        </div>
        <div className="flex flex-col gap-1 flex-1 justify-end">
          {/* Incoming chatbot message */}
          <div className="flex gap-1 items-start">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 flex items-center justify-center text-[4px] text-white shrink-0 font-bold">AI</div>
            <div className="bg-neutral-800/80 rounded-[4px] rounded-tl-none p-1 flex flex-col gap-0.5 max-w-[55px]">
              <div className="w-10 h-0.5 bg-emerald-400/80 rounded-full"></div>
              <div className="w-8 h-0.5 bg-slate-500 rounded-full"></div>
            </div>
          </div>
          {/* Outgoing user message */}
          <div className="flex gap-1 items-start self-end">
            <div className="bg-indigo-650/80 rounded-[4px] rounded-tr-none p-1 max-w-[45px]">
              <div className="w-7 h-0.5 bg-indigo-200 rounded-full"></div>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 flex items-center justify-center text-[4px] text-white shrink-0 font-bold">ME</div>
          </div>
        </div>
        <div className="h-3.5 bg-neutral-900 border border-white/10 rounded-md mt-auto flex items-center px-1.5 justify-between">
          <div className="w-14 h-1 bg-neutral-800 rounded-full"></div>
          <div className="w-1.5 h-1.5 rounded bg-emerald-500/80"></div>
        </div>
      </div>
    );
  }

  if (nameLower.includes('netflix') || nameLower.includes('stream') || nameLower.includes('movie') || nameLower.includes('video') || nameLower.includes('tv')) {
    return (
      <div className="absolute bottom-0 right-0 w-[100px] h-[65px] opacity-25 group-hover:opacity-60 transition-all duration-300 overflow-hidden rounded-br-2xl rounded-tl-2xl border-l border-t border-white/10 bg-[#09090b] select-none pointer-events-none group-hover:scale-[1.03] group-hover:translate-x-0.5 group-hover:translate-y-0.5 flex flex-col justify-between">
        <div className="p-1 border-b border-white/5 flex items-center justify-between bg-black/40">
          <span className="text-[8px] text-red-600 font-black tracking-tighter">NETFLIX</span>
          <span className="text-[5px] text-red-500 font-extrabold tracking-wide uppercase">4K LIVE</span>
        </div>
        <div className="px-1.5 py-1 flex-1 flex flex-col justify-center gap-1">
          <div className="flex gap-1 items-center">
            {/* Main movie feature poster mock */}
            <div className="w-7 h-7 bg-red-950/40 border border-red-500/20 rounded flex flex-col justify-between p-0.5 relative overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-gradient-to-t from-red-900/60 to-transparent"></div>
              <span className="text-[3px] text-white/90 font-bold relative z-10">THE CROWN</span>
              <span className="text-[2px] text-red-400 relative z-10">SEASON 5</span>
            </div>
            {/* Movie thumbnails row */}
            <div className="flex-1 flex flex-col gap-1">
              <div className="w-12 h-1 bg-neutral-800 rounded-full"></div>
              <div className="flex gap-1">
                <div className="w-4 h-4 bg-zinc-800 rounded-[2px] border border-white/5"></div>
                <div className="w-4 h-4 bg-zinc-800 rounded-[2px] border border-white/5"></div>
                <div className="w-4 h-4 bg-zinc-800 rounded-[2px] border border-white/5"></div>
              </div>
            </div>
          </div>
        </div>
        {/* Playback scrubbing line */}
        <div className="h-1 bg-neutral-800 w-full relative">
          <div className="h-full bg-red-600 w-[60%]"></div>
          <div className="absolute w-1.5 h-1.5 rounded-full bg-red-500 top-1/2 left-[60%] -translate-y-1/2 shadow-sm"></div>
        </div>
      </div>
    );
  }

  if (nameLower.includes('canva') || nameLower.includes('design') || nameLower.includes('palette') || nameLower.includes('illustrator')) {
    return (
      <div className="absolute bottom-0 right-0 w-[100px] h-[65px] opacity-25 group-hover:opacity-60 transition-all duration-300 overflow-hidden rounded-br-2xl rounded-tl-2xl border-l border-t border-white/10 bg-[#0e0f13] p-1.5 select-none pointer-events-none group-hover:scale-[1.03] group-hover:translate-x-0.5 group-hover:translate-y-0.5 flex flex-col gap-1">
        <div className="flex justify-between items-center border-b border-white/5 pb-1">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded bg-gradient-to-tr from-blue-400 to-purple-500"></div>
            <span className="text-[6px] text-indigo-300 font-bold">Canva Hub</span>
          </div>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
          </div>
        </div>
        <div className="flex-1 flex gap-1.5 mt-0.5">
          {/* Left tools rail */}
          <div className="w-3 flex flex-col gap-0.5 border-r border-white/5 pr-0.5 justify-center">
            <div className="w-2 h-2 rounded bg-neutral-800 flex items-center justify-center text-[4px] text-indigo-400">T</div>
            <div className="w-2 h-2 rounded bg-neutral-800 flex items-center justify-center text-[4px] text-indigo-400">★</div>
            <div className="w-2 h-2 rounded bg-neutral-800 flex items-center justify-center text-[4px] text-indigo-400">▧</div>
          </div>
          {/* Main workspace editor */}
          <div className="flex-1 grid grid-cols-2 gap-1 items-center">
            <div className="rounded border border-blue-500/20 aspect-square flex items-center justify-center bg-blue-500/5 p-0.5">
              <div className="w-4 h-4 rounded-full bg-blue-400/30 border border-blue-400/50 flex items-center justify-center">
                <span className="text-[3px] text-white">●</span>
              </div>
            </div>
            <div className="rounded border border-purple-500/20 aspect-square flex items-center justify-center bg-purple-500/5 p-0.5">
              <div className="w-4 h-4 bg-purple-400/30 border border-purple-400/50 rotate-45 flex items-center justify-center">
                <span className="text-[3px] text-white">▲</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (nameLower.includes('notion') || nameLower.includes('book') || nameLower.includes('notes') || nameLower.includes('workspace') || nameLower.includes('wiki')) {
    return (
      <div className="absolute bottom-0 right-0 w-[100px] h-[65px] opacity-25 group-hover:opacity-60 transition-all duration-300 overflow-hidden rounded-br-2xl rounded-tl-2xl border-l border-t border-white/10 bg-[#0d0e12] p-1.5 flex flex-col gap-1 select-none pointer-events-none group-hover:scale-[1.03] group-hover:translate-x-0.5 group-hover:translate-y-0.5">
        <div className="flex items-center gap-1 border-b border-white/5 pb-1 justify-between">
          <div className="flex items-center gap-1">
            <span className="text-[8px] font-black text-white font-serif bg-neutral-900 px-0.5 rounded border border-white/10">N</span>
            <span className="text-[5px] text-slate-400 font-bold">My Workspace</span>
          </div>
          <span className="text-[4px] text-emerald-400 bg-emerald-500/10 px-0.5 rounded">SAVED</span>
        </div>
        {/* Document lines */}
        <div className="flex-1 flex flex-col gap-1 mt-1 justify-center">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 border border-slate-600 rounded-[2px] bg-slate-900"></div>
            <div className="w-14 h-1 bg-slate-400 rounded-full"></div>
          </div>
          <div className="flex items-center gap-1 pl-1.5">
            <div className="w-1 h-1 bg-indigo-500/50 rounded-full"></div>
            <div className="w-12 h-0.5 bg-slate-500 rounded-full"></div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 border border-slate-600 rounded-[2px] bg-slate-900"></div>
            <div className="w-16 h-1 bg-slate-400 rounded-full"></div>
          </div>
          <div className="flex items-center gap-1 pl-1.5">
            <div className="w-1 h-1 bg-cyan-500/50 rounded-full"></div>
            <div className="w-10 h-0.5 bg-slate-500 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (nameLower.includes('photopea') || nameLower.includes('camera') || nameLower.includes('editor') || nameLower.includes('photoshop')) {
    return (
      <div className="absolute bottom-0 right-0 w-[100px] h-[65px] opacity-25 group-hover:opacity-60 transition-all duration-300 overflow-hidden rounded-br-2xl rounded-tl-2xl border-l border-t border-white/10 bg-[#0e1014] p-1.5 flex select-none pointer-events-none gap-1.5 group-hover:scale-[1.03] group-hover:translate-x-0.5 group-hover:translate-y-0.5">
        <div className="flex-1 flex flex-col justify-between border border-emerald-500/20 bg-emerald-500/5 p-1 rounded">
          <div className="w-full flex items-center justify-between border-b border-white/5 pb-0.5">
            <span className="text-[4px] text-emerald-400 font-mono">FILE</span>
            <span className="text-[4px] text-slate-500 font-mono">EDIT</span>
          </div>
          <div className="w-6 h-6 rounded-full border border-dashed border-emerald-400/40 mx-auto flex items-center justify-center relative my-0.5">
            <div className="w-2.5 h-2.5 bg-emerald-400/30 rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
            </div>
          </div>
          <div className="w-full h-1 bg-neutral-900 flex items-center px-0.5 justify-between">
            <div className="w-4 h-0.5 bg-neutral-600 rounded-full"></div>
            <span className="text-[3px] text-emerald-500">100%</span>
          </div>
        </div>
        {/* Layer panels */}
        <div className="w-6 flex flex-col gap-1 border-l border-white/5 pl-1 justify-center shrink-0">
          <span className="text-[4px] text-slate-400 font-bold">Layers</span>
          <div className="w-full h-1.5 bg-indigo-500/20 rounded-[1px] border border-indigo-500/30"></div>
          <div className="w-full h-1.5 bg-neutral-800 rounded-[1px]"></div>
          <div className="w-full h-1.5 bg-neutral-800 rounded-[1px]"></div>
        </div>
      </div>
    );
  }

  // Generic Dynamic high fidelity browser mockup for customized user additions
  return (
    <div className="absolute bottom-0 right-0 w-[100px] h-[65px] opacity-25 group-hover:opacity-60 transition-all duration-300 overflow-hidden rounded-br-2xl rounded-tl-2xl border-l border-t border-white/10 bg-[#0a0a0d] p-1.5 flex flex-col gap-1 select-none pointer-events-none group-hover:scale-[1.03] group-hover:translate-x-0.5 group-hover:translate-y-0.5">
      <div className="flex items-center justify-between border-b border-white/5 pb-1">
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-red-500"></div>
          <div className="w-1 h-1 rounded-full bg-yellow-500"></div>
          <div className="w-1 h-1 rounded-full bg-green-500"></div>
        </div>
        <span className="text-[5px] text-slate-500 font-mono truncate max-w-[50px]">{app.url.replace('https://', '').replace('www.', '')}</span>
      </div>
      <div className="flex-1 flex flex-col justify-center gap-1.5 px-0.5">
        <div className="w-full h-3 bg-indigo-500/10 rounded-sm border border-indigo-500/15 flex items-center px-1">
          <span className="text-[4px] text-indigo-300 font-bold font-sans">WEBSITE VIEW</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-16 h-1 bg-slate-500 rounded-full"></div>
          <div className="w-10 h-0.5 bg-slate-600 rounded-full"></div>
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
  onInfoClick,
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
      <div className="px-6 pt-6 pb-4 relative z-10 flex justify-between items-center">
        <div className="flex items-center gap-3.5 min-w-0">
          <BrandLogo size={46} animate={true} />
          <div className="min-w-0">
            <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase font-sans">webliox launcher</span>
            
            {isEditingName ? (
              <div className="flex items-center gap-1.5 mt-1">
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
                className="text-xl font-light text-white mt-0.5 leading-tight cursor-pointer group flex items-center gap-1 select-none"
                title="Click to personalize name"
              >
                <span>{greeting.toLowerCase()}, </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-indigo-400 border-b border-dashed border-indigo-400/30 group-hover:border-indigo-400 transition-colors font-semibold">
                  {profileName ? profileName.toLowerCase() : 'friend'}
                </span>
              </h2>
            )}
            <p className="text-[11px] text-slate-400 font-medium">launch your workspaces</p>
          </div>
        </div>

        <button
          onClick={onInfoClick}
          className="p-2.5 rounded-full bg-neutral-900 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 shadow-lg shadow-black/20"
          title="About & Legal terms"
        >
          <Info size={15} />
        </button>
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
      <div className="px-6 mb-5 overflow-x-auto whitespace-nowrap hide-scrollbar flex items-center gap-2 scroll-smooth relative z-10">
        {CATEGORIES.map(category => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 border border-indigo-500/30 scale-[1.02]'
                  : 'bg-bg-card text-slate-300 hover:bg-[#25232a] hover:text-white border border-white/10'
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
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 tracking-wider uppercase mb-3 font-sans">
            <Clock size={13} className="text-indigo-400" />
            <span>Recents</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 hide-scrollbar">
            {recentApps.map(app => (
              <motion.button
                whileTap={{ scale: 0.95 }}
                key={`recent-${app.id}`}
                onClick={() => onLaunchApp(app)}
                className="flex flex-col items-center gap-1.5 shrink-0 p-2.5 bg-bg-card/40 rounded-2xl border border-white/5 w-[78px] cursor-pointer hover:bg-bg-card transition-all duration-200"
              >
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${app.color} flex items-center justify-center text-white shadow-md`}>
                  {getIconComponent(app.iconName, 20)}
                </div>
                <span className="text-[11px] font-semibold tracking-tight text-slate-200 truncate w-full text-center">
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
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 tracking-wider uppercase mb-3 font-sans">
            <Star size={13} className="text-amber-400 fill-amber-400" />
            <span>Favorites</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {favoriteApps.map(app => (
              <motion.div
                whileTap={{ scale: 0.98 }}
                key={`favorite-${app.id}`}
                onClick={() => onLaunchApp(app)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-bg-card hover:bg-[#25232a] border border-white/5 cursor-pointer relative overflow-hidden group transition-all"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-indigo-500"></div>
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${app.color} flex items-center justify-center text-white shrink-0 shadow-md`}>
                    {getIconComponent(app.iconName, 16)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-100 truncate">{app.name}</p>
                    <p className="text-[10px] text-slate-400 truncate font-medium">{app.category}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => onToggleFavorite(app.id, e)}
                  className="text-amber-400 hover:text-slate-400 transition-colors cursor-pointer p-1"
                  title="Remove Favorite"
                >
                  <Star size={14} className="fill-current" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Grid of Launcher Cards */}
      <div className="px-6 mb-6 flex-1">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 tracking-wider uppercase mb-3 font-sans">
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
                  className="group relative p-4 rounded-2xl bg-bg-card border border-white/5 hover:border-indigo-500/20 cursor-pointer flex flex-col justify-between h-[130px] hover:bg-[#25232a] transition-all shadow-md overflow-hidden"
                >
                  {/* Decorative faint glow */}
                  <div className={`absolute -inset-px rounded-2xl bg-gradient-to-tr ${app.color} opacity-0 group-hover:opacity-10 transition-opacity blur-md pointer-events-none`}></div>

                  {/* Micro aesthetic website preview mockup */}
                  {renderMiniPreview(app)}

                  {/* Card top half: Icon & Favorites Star */}
                  <div className="flex justify-between items-start relative z-20">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${app.color} flex items-center justify-center text-white shadow-md shadow-black/30 group-hover:scale-105 transition-transform`}>
                      {getIconComponent(app.iconName, 18)}
                    </div>

                    <div className="flex items-center gap-1.5 relative z-25">
                      <button
                        onClick={(e) => onToggleFavorite(app.id, e)}
                        className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${
                          app.isFavorite ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                        }`}
                        title={app.isFavorite ? 'Remove Favorite' : 'Mark Favorite'}
                      >
                        <Star size={14} className={app.isFavorite ? 'fill-current' : ''} />
                      </button>

                      {onDeleteApp && (
                        <button
                          onClick={(e) => onDeleteApp(app.id, e)}
                          className="p-1.5 rounded-full hover:bg-white/10 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete Application"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Card bottom half: Labels */}
                  <div className="mt-4 min-w-0 relative z-20">
                    <h3 className="font-bold text-slate-100 text-[13px] tracking-tight truncate flex items-center gap-1 group-hover:text-indigo-300 transition-colors">
                      {app.name}
                      <ExternalLink size={11} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-slate-400" />
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">{app.category}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Special add app action card */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onAddAppClick}
              className="p-4 rounded-2xl border border-dashed border-white/15 hover:border-indigo-500/40 bg-transparent hover:bg-bg-card/40 cursor-pointer flex flex-col justify-between h-[130px] text-left transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-bg-card border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-colors shadow-md">
                <Plus size={18} />
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-slate-200 text-[13px] tracking-tight">ADD NEW</h3>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Integrate web apps</p>
              </div>
            </motion.button>
          </div>
        )}
      </div>

    </div>
  );
}
