/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, ArrowLeft, Globe, HelpCircle, Check, Compass,
  MessageSquare, Palette, Camera, Tv, BookOpen, ShieldCheck, 
  GraduationCap, LayoutDashboard 
} from 'lucide-react';
import { WebApp, AppCategory } from '../types';

interface AddWebsiteFormProps {
  onAddApp: (app: Omit<WebApp, 'id' | 'isFavorite'>) => void;
  onCancel: () => void;
}

const PRESETS = [
  { name: 'ChatGPT', url: 'https://chatgpt.com', category: 'AI' as const, icon: 'MessageSquare', color: 'from-emerald-500 to-teal-600' },
  { name: 'Canva', url: 'https://canva.com', category: 'Design' as const, icon: 'Palette', color: 'from-blue-500 to-indigo-600' },
  { name: 'Photopea', url: 'https://photopea.com', category: 'Design' as const, icon: 'Camera', color: 'from-green-500 to-emerald-600' },
  { name: 'Notion', url: 'https://notion.so', category: 'Productivity' as const, icon: 'BookOpen', color: 'from-neutral-700 to-neutral-900' },
  { name: 'Netflix', url: 'https://netflix.com', category: 'Entertainment' as const, icon: 'Tv', color: 'from-red-600 to-rose-700' },
  { name: 'Wikipedia', url: 'https://en.wikipedia.org', category: 'Utility' as const, icon: 'Globe', color: 'from-sky-500 to-blue-600' },
];

const COLORS = [
  { class: 'from-indigo-500 to-purple-600', label: 'Royal Indigo' },
  { class: 'from-rose-500 to-red-600', label: 'Crimson Rose' },
  { class: 'from-emerald-500 to-teal-600', label: 'Forest Teal' },
  { class: 'from-amber-500 to-orange-600', label: 'Warm Orange' },
  { class: 'from-blue-500 to-indigo-600', label: 'Azure Blue' },
  { class: 'from-slate-700 to-slate-900', label: 'Midnight Slate' },
];

const ICONS = [
  { name: 'MessageSquare', label: 'Chat / Speech' },
  { name: 'Palette', label: 'Canvas / Design' },
  { name: 'Camera', label: 'Lens / Photo' },
  { name: 'Tv', label: 'Screen / Stream' },
  { name: 'BookOpen', label: 'Doc / Book' },
  { name: 'ShieldCheck', label: 'Government / Guard' },
  { name: 'GraduationCap', label: 'Academic / ERP' },
  { name: 'LayoutDashboard', label: 'Portal / Panel' },
  { name: 'Globe', label: 'Generic / Web' },
];

const CATEGORIES: AppCategory[] = ['AI', 'Design', 'Productivity', 'Entertainment', 'Utility'];

export default function AddWebsiteForm({ onAddApp, onCancel }: AddWebsiteFormProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<AppCategory>('Utility');
  const [color, setColor] = useState('from-indigo-500 to-purple-600');
  const [iconName, setIconName] = useState('Globe');
  
  const [error, setError] = useState('');

  const handlePresetSelect = (preset: typeof PRESETS[0]) => {
    setName(preset.name);
    setUrl(preset.url);
    setCategory(preset.category);
    setIconName(preset.icon);
    setColor(preset.color);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide a readable application name.');
      return;
    }

    if (!url.trim()) {
      setError('Please provide the application URL link.');
      return;
    }

    // Smart URL formatting: prefix with https:// if user didn't enter protocol
    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    // Basic URL validation
    try {
      new URL(formattedUrl);
    } catch (err) {
      setError('Please enter a valid Web Address (e.g., website.com).');
      return;
    }

    onAddApp({
      name: name.trim(),
      url: formattedUrl,
      category,
      color,
      iconName,
    });
  };

  return (
    <div id="add-portal-form-root" className="flex-1 flex flex-col bg-[#000] overflow-y-auto select-none p-6 text-[#e0e0e0] custom-scrollbar">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 shrink-0">
        <button
          onClick={onCancel}
          className="p-1.5 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="text-sm font-bold text-white">Add Web Application</h2>
          <p className="text-[10px] text-slate-400">Expand your launcher drawer with custom portals</p>
        </div>
      </div>

      {/* Preset App Suggestions (Awesome UX!) */}
      <div className="mb-6 shrink-0">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 tracking-wider uppercase mb-2.5 font-mono">
          <Compass size={11} />
          <span>Quick Preset Suggestions</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handlePresetSelect(preset)}
              className="text-[10px] font-semibold bg-bg-card hover:bg-[#25232a] text-slate-300 hover:text-white px-3 py-2 rounded-xl border border-white/5 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-tr ${preset.color}`} />
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5 justify-between">
        
        <div className="flex flex-col gap-4">
          
          {/* Form Error Alert */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold">
              {error}
            </div>
          )}

          {/* App Name Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Application Name</label>
            <input
              type="text"
              placeholder="e.g., My College Portal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-bg-card border border-white/5 text-xs focus:border-indigo-500/40 text-slate-200 outline-none transition-all focus:ring-1 focus:ring-indigo-500/10"
            />
          </div>

          {/* Website Link URL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1">
              <span>Web Address URL</span>
              <span className="text-[9px] text-slate-600 font-mono italic">(Automatic HTTPS)</span>
            </label>
            <div className="relative">
              <Globe size={13} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="e.g., erp.myuniversity.edu"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-bg-card border border-white/5 text-xs focus:border-indigo-500/40 text-slate-200 outline-none transition-all focus:ring-1 focus:ring-indigo-500/10"
              />
            </div>
          </div>

          {/* Category Select Grid */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Category Group</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                    category === cat
                      ? 'bg-indigo-600 border-indigo-500/20 text-white'
                      : 'bg-bg-card border-white/5 text-slate-400 hover:text-slate-200 hover:bg-[#25232a]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Picker */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Portal Launcher Icon</label>
            <div className="flex flex-wrap gap-2 p-3 bg-bg-card/40 rounded-xl border border-white/5">
              {ICONS.map((ico) => {
                const isSelected = iconName === ico.name;
                return (
                  <button
                    key={ico.name}
                    type="button"
                    onClick={() => setIconName(ico.name)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500/30 text-indigo-400'
                        : 'bg-bg-card border-white/5 text-slate-500 hover:text-slate-200 hover:bg-[#25232a]'
                    }`}
                    title={ico.label}
                  >
                    {/* Render helper icon */}
                    <span className="scale-90">
                      {ico.name === 'MessageSquare' && <MessageSquare size={14} />}
                      {ico.name === 'Palette' && <Palette size={14} />}
                      {ico.name === 'Camera' && <Camera size={14} />}
                      {ico.name === 'Tv' && <Tv size={14} />}
                      {ico.name === 'BookOpen' && <BookOpen size={14} />}
                      {ico.name === 'ShieldCheck' && <ShieldCheck size={14} />}
                      {ico.name === 'GraduationCap' && <GraduationCap size={14} />}
                      {ico.name === 'LayoutDashboard' && <LayoutDashboard size={14} />}
                      {ico.name === 'Globe' && <Globe size={14} />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Gradient Picker */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Card Theme Color</label>
            <div className="grid grid-cols-6 gap-2">
              {COLORS.map((col) => {
                const isSelected = color === col.class;
                return (
                  <button
                    key={col.class}
                    type="button"
                    onClick={() => setColor(col.class)}
                    className={`h-8 rounded-lg bg-gradient-to-tr ${col.class} flex items-center justify-center text-white cursor-pointer relative transition-transform hover:scale-105`}
                    title={col.label}
                  >
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-bg-darkest/80 flex items-center justify-center text-emerald-400">
                        <Check size={10} className="stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom Actions */}
        <div className="flex gap-3 mt-6 border-t border-white/5 pt-4 shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-11 rounded-xl bg-bg-card hover:bg-[#25232a] border border-white/5 text-slate-400 hover:text-slate-200 font-bold text-xs tracking-wide transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs tracking-wide transition-all shadow-md shadow-indigo-600/10 cursor-pointer border border-indigo-500/20"
          >
            Create Launcher
          </button>
        </div>

      </form>

    </div>
  );
}
