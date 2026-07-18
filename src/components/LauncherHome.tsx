/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, Star, Clock, Trash2, ExternalLink, Globe,
  MessageSquare, Palette, Camera, Tv, BookOpen, ShieldCheck, 
  GraduationCap, LayoutDashboard, Info, Shield, Zap, Activity
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

// Renders an interactive miniature wireframe/preview mockup for the card upper compartment
const renderMiniPreview = (app: WebApp) => {
  const nameLower = app.name.toLowerCase();
  
  if (nameLower.includes('chatgpt') || nameLower.includes('ai') || nameLower.includes('gpt')) {
    return (
      <div className="absolute inset-0 bg-[#07080a] p-2 flex flex-col justify-between select-none pointer-events-none">
        <div className="w-full flex items-center justify-between border-b border-white/5 pb-1">
          <div className="flex items-center gap-1 pl-8">
            <span className="w-1 h-1 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
            <span className="text-[6px] text-slate-400 font-bold font-sans">GPT-4o Workspace</span>
          </div>
          <span className="text-[5px] text-slate-600 font-mono">1.2ms</span>
        </div>
        <div className="flex flex-col gap-1 flex-1 justify-end mt-1">
          {/* Incoming chatbot message */}
          <div className="flex gap-1 items-start">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 flex items-center justify-center text-[4px] text-white shrink-0 font-bold">AI</div>
            <div className="bg-neutral-800/80 rounded-[4px] rounded-tl-none p-1 flex flex-col gap-0.5 max-w-[70px]">
              <div className="w-12 h-0.5 bg-emerald-400/80 rounded-full"></div>
              <div className="w-8 h-0.5 bg-slate-500 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="h-3 bg-neutral-900 border border-white/5 rounded mt-auto flex items-center px-1 justify-between">
          <div className="w-14 h-0.5 bg-neutral-800 rounded-full"></div>
          <div className="w-1 h-1 rounded bg-emerald-500/85"></div>
        </div>
      </div>
    );
  }

  if (nameLower.includes('netflix') || nameLower.includes('stream') || nameLower.includes('movie') || nameLower.includes('video') || nameLower.includes('tv')) {
    return (
      <div className="absolute inset-0 bg-[#09090b] select-none pointer-events-none flex flex-col justify-between">
        <div className="p-1 border-b border-white/5 flex items-center justify-between bg-black/40 pl-8">
          <span className="text-[7px] text-red-600 font-black tracking-tighter">NETFLIX</span>
          <span className="text-[4px] text-red-500 font-bold tracking-wide uppercase">LIVE</span>
        </div>
        <div className="px-1.5 py-1 flex-1 flex flex-col justify-center gap-1">
          <div className="flex gap-1.5 items-center">
            {/* Main movie feature poster mock */}
            <div className="w-5 h-5 bg-red-950/40 border border-red-500/20 rounded flex flex-col justify-between p-0.5 relative overflow-hidden shrink-0">
              <span className="text-[3px] text-white/90 font-bold leading-none">CROWN</span>
            </div>
            {/* Movie thumbnails row */}
            <div className="flex-1 flex flex-col gap-1">
              <div className="w-12 h-0.5 bg-neutral-700 rounded-full"></div>
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 bg-zinc-800 rounded-[1px] border border-white/5"></div>
                <div className="w-2.5 h-2.5 bg-zinc-800 rounded-[1px] border border-white/5"></div>
                <div className="w-2.5 h-2.5 bg-zinc-800 rounded-[1px] border border-white/5"></div>
              </div>
            </div>
          </div>
        </div>
        {/* Playback scrubbing line */}
        <div className="h-0.5 bg-red-600 w-[60%]"></div>
      </div>
    );
  }

  if (nameLower.includes('canva') || nameLower.includes('design') || nameLower.includes('palette') || nameLower.includes('illustrator')) {
    return (
      <div className="absolute inset-0 bg-[#0e0f13] p-1.5 select-none pointer-events-none flex flex-col gap-1">
        <div className="flex justify-between items-center border-b border-white/5 pb-1 pl-8">
          <span className="text-[6px] text-indigo-300 font-bold">Canva Hub</span>
          <div className="flex gap-0.5">
            <span className="w-1 h-1 rounded-full bg-blue-400"></span>
            <span className="w-1 h-1 rounded-full bg-purple-500"></span>
          </div>
        </div>
        <div className="flex-1 flex gap-1.5 items-center justify-between mt-0.5">
          {/* Left tools rail */}
          <div className="w-3 flex flex-col gap-0.5 justify-center">
            <div className="w-1.5 h-1.5 bg-neutral-800 rounded flex items-center justify-center text-[3px] text-indigo-400">T</div>
            <div className="w-1.5 h-1.5 bg-neutral-800 rounded flex items-center justify-center text-[3px] text-indigo-400">★</div>
          </div>
          {/* Main workspace editor */}
          <div className="flex-1 grid grid-cols-2 gap-1 items-center">
            <div className="rounded border border-blue-500/20 h-5 flex items-center justify-center bg-blue-500/5 p-0.5">
              <div className="w-3 h-3 rounded-full bg-blue-400/30 border border-blue-400/50"></div>
            </div>
            <div className="rounded border border-purple-500/20 h-5 flex items-center justify-center bg-purple-500/5 p-0.5">
              <div className="w-3 h-3 bg-purple-400/30 border border-purple-400/50 rotate-45"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (nameLower.includes('notion') || nameLower.includes('book') || nameLower.includes('notes') || nameLower.includes('workspace') || nameLower.includes('wiki')) {
    return (
      <div className="absolute inset-0 bg-[#0d0e12] p-1.5 flex flex-col gap-1 select-none pointer-events-none">
        <div className="flex items-center gap-1 border-b border-white/5 pb-1 justify-between pl-8">
          <span className="text-[5px] text-slate-400 font-bold">My Workspace</span>
          <span className="text-[4px] text-emerald-400 bg-emerald-500/10 px-0.5 rounded">SAVED</span>
        </div>
        {/* Document lines */}
        <div className="flex-1 flex flex-col gap-1 justify-center">
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 border border-slate-600 rounded-[1px] bg-slate-900"></div>
            <div className="w-14 h-0.5 bg-slate-400 rounded-full"></div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 border border-slate-600 rounded-[1px] bg-slate-900"></div>
            <div className="w-16 h-0.5 bg-slate-400 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (nameLower.includes('photopea') || nameLower.includes('camera') || nameLower.includes('editor') || nameLower.includes('photoshop')) {
    return (
      <div className="absolute inset-0 bg-[#0e1014] p-1.5 flex select-none pointer-events-none gap-1.5">
        <div className="flex-1 flex flex-col justify-between border border-emerald-500/20 bg-emerald-500/5 p-1 rounded pl-8">
          <div className="w-full flex items-center justify-between border-b border-white/5 pb-0.5">
            <span className="text-[4px] text-emerald-400 font-mono">FILE</span>
            <span className="text-[4px] text-slate-500 font-mono">EDIT</span>
          </div>
          <div className="w-4 h-4 rounded-full border border-dashed border-emerald-400/40 mx-auto flex items-center justify-center relative">
            <div className="w-1.5 h-1.5 bg-emerald-400/30 rounded-full flex items-center justify-center"></div>
          </div>
        </div>
        {/* Layer panels */}
        <div className="w-5 flex flex-col gap-0.5 justify-center shrink-0">
          <div className="w-full h-1 bg-indigo-500/20 rounded-[1px] border border-indigo-500/30"></div>
          <div className="w-full h-1 bg-neutral-800 rounded-[1px]"></div>
        </div>
      </div>
    );
  }

  {/* Generic Dynamic high fidelity browser mockup for customized user additions */}
  return (
    <div className="absolute inset-0 bg-[#0a0a0d] p-1.5 flex flex-col gap-1 select-none pointer-events-none">
      <div className="flex items-center justify-between border-b border-white/5 pb-1 pl-8">
        <div className="flex gap-0.5">
          <div className="w-0.5 h-0.5 rounded-full bg-red-500"></div>
          <div className="w-0.5 h-0.5 rounded-full bg-green-500"></div>
        </div>
        <span className="text-[5px] text-slate-500 font-mono truncate max-w-[50px]">{app.url.replace('https://', '').replace('www.', '')}</span>
      </div>
      <div className="flex-1 flex flex-col justify-center gap-1 px-0.5">
        <div className="w-full h-2.5 bg-indigo-500/10 rounded-[1px] border border-indigo-500/15 flex items-center px-1">
          <span className="text-[3px] text-indigo-300 font-bold font-sans">WEBVIEW</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="w-12 h-0.5 bg-slate-500 rounded-full"></div>
          <div className="w-8 h-0.5 bg-slate-600 rounded-full"></div>
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

  const [adShieldActive, setAdShieldActive] = useState(() => {
    return localStorage.getItem('webliox_adshield_active') !== 'false';
  });
  const [dnsEngine, setDnsEngine] = useState(() => {
    return localStorage.getItem('webliox_dns_engine') || 'cloudflare';
  });
  const [blockedCount, setBlockedCount] = useState(() => {
    const saved = localStorage.getItem('webliox_blocked_count');
    return saved ? parseInt(saved, 10) : 312;
  });

  const handleToggleAdShield = () => {
    const nextVal = !adShieldActive;
    setAdShieldActive(nextVal);
    localStorage.setItem('webliox_adshield_active', String(nextVal));
    if (nextVal) {
      setBlockedCount(prev => {
        const added = prev + Math.floor(Math.random() * 8) + 3;
        localStorage.setItem('webliox_blocked_count', String(added));
        return added;
      });
    }
  };

  const handleDnsChange = (engine: string) => {
    setDnsEngine(engine);
    localStorage.setItem('webliox_dns_engine', engine);
    setBlockedCount(prev => {
      const added = prev + Math.floor(Math.random() * 12) + 5;
      localStorage.setItem('webliox_blocked_count', String(added));
      return added;
    });
  };

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

      {/* Dynamic AdShield & DNS Proxy Dashboard */}
      {!searchQuery && selectedCategory === 'All' && (
        <div className="px-6 mb-6">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 tracking-wider uppercase mb-3 font-sans">
            <Shield size={13} className="text-indigo-400" />
            <span>Network Shield & Speed Boost</span>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#12131a] to-[#0c0d11] border border-white/5 shadow-xl relative overflow-hidden">
            {/* Ambient background glow if AdShield active */}
            {adShieldActive && (
              <div className="absolute -right-12 -top-12 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
            )}

            <div className="flex justify-between items-start gap-3">
              <div className="flex items-start gap-2.5">
                <div className={`p-2 rounded-xl transition-all ${
                  adShieldActive 
                    ? 'bg-indigo-500/15 text-indigo-400 shadow-md shadow-indigo-500/5 ring-1 ring-indigo-500/20' 
                    : 'bg-neutral-800 text-slate-500'
                }`}>
                  <Shield size={18} className={adShieldActive ? 'animate-pulse' : ''} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200 tracking-tight flex items-center gap-1.5">
                    <span>AdShield Pro Blocker</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${adShieldActive ? 'bg-emerald-500' : 'bg-neutral-600'}`}></span>
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
                    {adShieldActive 
                      ? `Active • Filtered ${blockedCount} trackers & ad banners` 
                      : 'Disabled • Tracking scripts allowed'}
                  </p>
                </div>
              </div>

              {/* Toggle switch */}
              <button
                onClick={handleToggleAdShield}
                className={`w-8 h-4 rounded-full relative p-0.5 transition-colors cursor-pointer shrink-0 ${
                  adShieldActive ? 'bg-indigo-600' : 'bg-neutral-800 border border-white/5'
                }`}
                title={adShieldActive ? 'Deactivate AdShield' : 'Activate AdShield'}
              >
                <div className={`w-3 h-3 rounded-full bg-white transition-transform ${
                  adShieldActive ? 'translate-x-4' : 'translate-x-0'
                }`}></div>
              </button>
            </div>

            {/* DNS Boost Control Engine selection */}
            <div className="mt-4 border-t border-white/5 pt-3.5">
              <div className="flex justify-between items-center mb-2.5 text-[10px]">
                <span className="font-bold text-slate-400 tracking-wide uppercase">Core DNS Engine</span>
                <span className="font-mono text-indigo-400 font-bold flex items-center gap-1">
                  <Activity size={10} className="animate-pulse" />
                  Latency: {dnsEngine === 'cloudflare' ? '11ms' : dnsEngine === 'adguard' ? '22ms' : dnsEngine === 'google' ? '18ms' : '45ms'}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'cloudflare', name: '1.1.1.1', desc: 'Cloudflare' },
                  { id: 'adguard', name: 'AdGuard', desc: 'Ad Filter' },
                  { id: 'google', name: '8.8.8.8', desc: 'Google' },
                  { id: 'default', name: 'Carrier', desc: 'Default' }
                ].map((engine) => (
                  <button
                    key={engine.id}
                    onClick={() => handleDnsChange(engine.id)}
                    className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                      dnsEngine === engine.id
                        ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-300 shadow-sm'
                        : 'bg-[#181920]/40 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10'
                    }`}
                  >
                    <p className="text-[10px] font-bold tracking-tight">{engine.name}</p>
                    <p className="text-[7px] opacity-70 mt-0.5 font-medium">{engine.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Sandboxed apk instruction block */}
            <div className="mt-3.5 bg-indigo-500/5 rounded-xl p-2.5 border border-indigo-500/10">
              <p className="text-[9.5px] text-slate-400 leading-relaxed font-sans">
                <span className="font-bold text-indigo-300">💡 Sandbox Info:</span> Browsers enforce sandbox restrictions (CORS) that prevent high-profile sites (e.g. <strong>net27.cc, ChatGPT</strong>) from reloading inside standard preview iframes. When built as a <strong>Native Android APK</strong>, the application completely bypasses these browser limits to load anything perfectly! Use <strong>Launch External</strong> to browse seamlessly with active ad-blocking.
              </p>
            </div>
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
                    className="group relative p-3 rounded-2xl bg-bg-card border border-white/5 hover:border-indigo-500/20 cursor-pointer flex flex-col justify-between h-[150px] hover:bg-[#1f1d24] transition-all shadow-md overflow-hidden"
                  >
                    {/* Decorative faint glow */}
                    <div className={`absolute -inset-px rounded-2xl bg-gradient-to-tr ${app.color} opacity-0 group-hover:opacity-10 transition-opacity blur-md pointer-events-none`}></div>

                    {/* Redesigned Upper Compartment: Framed Site Preview */}
                    <div className="relative w-full h-[70px] bg-[#0c0d10] border border-white/5 rounded-xl overflow-hidden mb-2 shrink-0 flex items-center justify-center">
                      {/* Micro aesthetic website preview mockup */}
                      {renderMiniPreview(app)}

                      {/* Icon overlay absolute on top-left of the preview frame */}
                      <div className={`absolute top-1.5 left-1.5 w-7 h-7 rounded-lg bg-gradient-to-tr ${app.color} flex items-center justify-center text-white shadow-md shadow-black/40 group-hover:scale-105 transition-transform z-30`}>
                        {getIconComponent(app.iconName, 13)}
                      </div>
                    </div>

                    {/* Bottom half: Labels & Action buttons side-by-side with zero overlap */}
                    <div className="flex items-center justify-between min-w-0 w-full mt-auto relative z-20">
                      <div className="min-w-0 pr-1.5 flex-1">
                        <h3 className="font-bold text-slate-100 text-[12px] tracking-tight truncate flex items-center gap-1 group-hover:text-indigo-400 transition-colors">
                          {app.name}
                        </h3>
                        <p className="text-[10px] text-slate-400 truncate font-medium mt-0.5">{app.category}</p>
                      </div>

                      <div className="flex items-center gap-0.5 shrink-0 relative z-30">
                        <button
                          onClick={(e) => onToggleFavorite(app.id, e)}
                          className={`p-1 rounded-full hover:bg-white/10 transition-colors ${
                            app.isFavorite ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                          }`}
                          title={app.isFavorite ? 'Remove Favorite' : 'Mark Favorite'}
                        >
                          <Star size={13} className={app.isFavorite ? 'fill-current' : ''} />
                        </button>

                        {onDeleteApp && (
                          <button
                            onClick={(e) => onDeleteApp(app.id, e)}
                            className="p-1 rounded-full hover:bg-white/10 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete Application"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Special add app action card - Symmetrical Redesign */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onAddAppClick}
                className="p-3 rounded-2xl border border-dashed border-white/15 hover:border-indigo-500/40 bg-transparent hover:bg-bg-card/40 cursor-pointer flex flex-col justify-between h-[150px] text-left transition-all"
              >
                <div className="w-full h-[70px] bg-bg-card/30 border border-white/5 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors shadow-sm mb-2 shrink-0">
                  <Plus size={18} />
                </div>
                <div className="mt-auto">
                  <h3 className="font-bold text-slate-200 text-[12px] tracking-tight">ADD NEW PORTAL</h3>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">Integrate web apps</p>
                </div>
              </motion.button>
            </div>
        )}
      </div>

    </div>
  );
}
