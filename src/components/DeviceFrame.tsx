/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, ArrowLeft, RotateCw, ExternalLink, Settings, Smartphone, Monitor } from 'lucide-react';
import { motion } from 'motion/react';

interface DeviceFrameProps {
  children: React.ReactNode;
  isDeviceMode: boolean;
  setIsDeviceMode: (val: boolean) => void;
  selectedAppName?: string | null;
  onGoBack?: () => void;
  onRefresh?: () => void;
  onLaunchExternal?: () => void;
  isMediaPlaying?: boolean;
}

export default function DeviceFrame({
  children,
  isDeviceMode,
  setIsDeviceMode,
  selectedAppName,
  onGoBack,
  onRefresh,
  onLaunchExternal,
  isMediaPlaying = false,
}: DeviceFrameProps) {
  const [time, setTime] = useState('');
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      setTime(`${hours}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileViewport(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isDeviceMode || isMobileViewport) {
    return (
      <div id="webliox-direct-root" className="min-h-screen bg-[#000] text-[#e0e0e0] flex flex-col font-sans select-text overflow-hidden">
        {/* Interactive App Toolbar (Only shown when a web app is active and media isn't full-screen) */}
        {selectedAppName && !isMediaPlaying && (
          <header className="h-14 bg-bg-darker border-b border-white/5 px-4 flex items-center justify-between select-none shrink-0 z-50">
            <div className="flex items-center gap-2.5">
              <button
                onClick={onGoBack}
                className="p-1.5 rounded-full hover:bg-white/5 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Back to Launcher"
              >
                <ArrowLeft size={16} />
              </button>
              <span className="font-bold text-sm tracking-tight text-white truncate max-w-[180px]">
                {selectedAppName}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  className="p-1.5 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Refresh WebView"
                >
                  <RotateCw size={14} />
                </button>
              )}
              {onLaunchExternal && (
                <button
                  onClick={onLaunchExternal}
                  className="p-1.5 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Open in Browser"
                >
                  <ExternalLink size={14} />
                </button>
              )}
            </div>
          </header>
        )}

        {/* Content body - occupying the full viewport */}
        <main className="flex-1 flex flex-col overflow-hidden relative bg-[#000]">
          {children}
        </main>

        {/* Developer workspace toggle - only visible on desktop viewports and when on the launcher home */}
        {!selectedAppName && (
          <div className="hidden md:block fixed bottom-4 right-4 z-50">
            <button
              onClick={() => setIsDeviceMode(true)}
              className="flex items-center gap-1.5 bg-indigo-600/90 hover:bg-indigo-600 text-white font-bold text-[11px] px-3.5 py-2 rounded-full transition-all cursor-pointer shadow-lg hover:scale-105 border border-indigo-500/20 backdrop-blur-sm"
              title="Open Developer Workspace"
            >
              <Smartphone size={12} />
              <span>Developer Workspace</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div id="webliox-simulator-root" className="min-h-screen bg-bg-darkest text-[#e0e0e0] flex flex-col font-sans overflow-hidden">
      
      {/* Top Professional Header (IDE window wrapper) */}
      <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-bg-darker select-none shrink-0">
        <div className="flex items-center gap-3">
          {/* Mock Window Controls */}
          <div className="flex gap-1.5 mr-3">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <span className="text-[11px] font-bold tracking-widest text-slate-500 uppercase font-mono">
            Webliox Workspace — feat/initial-ui-setup
          </span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-semibold text-indigo-400 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            Branch: master
          </span>
          <span className="px-2 py-1 bg-indigo-500/10 rounded border border-indigo-500/10">
            Sprint 01: Core UI Architecture
          </span>
        </div>
      </header>

      {/* Main 3-Column Workspace Area */}
      <main className="flex-1 grid grid-cols-12 overflow-hidden">
        
        {/* COLUMN 1: LEFT SIDEBAR (Project Structure) */}
        <aside className="col-span-3 border-r border-white/10 p-5 bg-bg-darker flex flex-col overflow-y-auto custom-scrollbar select-none">
          <div className="mb-6">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
              Project Structure
            </h3>
            
            {/* Visual File Tree Mock */}
            <div className="font-mono text-[11px] space-y-2 opacity-90 text-slate-300">
              <div className="text-indigo-400 font-bold">▼ Webliox-Mobile/</div>
              <div className="pl-4 text-slate-400">▼ src/</div>
              <div className="pl-8 text-indigo-300">▼ components/</div>
              <div className="pl-12 flex items-center gap-1 text-slate-300">
                <span className="text-indigo-500">📄</span>
                <span className={!selectedAppName && onGoBack === undefined ? 'text-indigo-300 font-bold' : ''}>LauncherHome.tsx</span>
              </div>
              <div className="pl-12 flex items-center gap-1 text-slate-300">
                <span className="text-indigo-500">📄</span>
                <span className={selectedAppName ? 'text-indigo-300 font-bold' : ''}>WebPreviewer.tsx</span>
              </div>
              <div className="pl-12 flex items-center gap-1 text-slate-300">
                <span className="text-indigo-500">📄</span>
                <span className={!selectedAppName && onGoBack !== undefined ? 'text-indigo-300 font-bold' : ''}>AddWebsiteForm.tsx</span>
              </div>
              <div className="pl-12 flex items-center gap-1 text-slate-300">
                <span className="text-indigo-500">📄</span>
                <span>DeviceFrame.tsx</span>
              </div>
              <div className="pl-8 text-indigo-300">▼ types/</div>
              <div className="pl-12 flex items-center gap-1 text-slate-400">- types.ts</div>
              <div className="pl-4 flex items-center gap-1 text-slate-300">
                <span className="text-indigo-400">📄</span>
                <span>App.tsx</span>
              </div>
            </div>
          </div>

          {/* Mentor Note Box */}
          <div className="mt-auto p-4 rounded-xl bg-bg-card border border-white/5 text-xs">
            <p className="text-indigo-400 font-bold mb-1.5 flex items-center gap-1.5">
              <span>👨‍🏫 Senior Mentor Note</span>
            </p>
            <p className="leading-relaxed text-slate-400 text-[11px] italic">
              "As a beginner, pay close attention to <b>Separation of Concerns</b>. The <b>App.tsx</b> controls the state engine, while layout is isolated in <b>DeviceFrame</b> and cards live in <b>LauncherHome</b>. This is clean SOLID design!"
            </p>
          </div>
        </aside>

        {/* COLUMN 2: CENTER WORKSPACE (Android Phone Simulator) */}
        <section className="col-span-6 bg-bg-darkest flex flex-col items-center justify-center relative p-4 overflow-y-auto custom-scrollbar">
          
          {/* Top Emulator Banner / Controls */}
          <div className="mb-4 flex flex-col items-center gap-1.5 z-10 text-center max-w-sm">
            <h1 className="text-sm font-bold text-slate-100 tracking-tight flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span>Webliox Android Emulator</span>
            </h1>
            <p className="text-[10px] text-slate-400">
              Interactive high-fidelity prototype. Click widgets, launch cards, and toggle views just like a real phone!
            </p>
            <button
              onClick={() => setIsDeviceMode(false)}
              className="mt-1 flex items-center gap-1 bg-bg-card hover:bg-slate-900 border border-white/5 text-slate-300 hover:text-white text-[10px] px-2.5 py-1.5 rounded-full transition-all cursor-pointer shadow-sm"
            >
              <Monitor size={10} />
              <span>Full-Screen Desktop Mode</span>
            </button>
          </div>

          {/* Android Device Mockup (Phone Frame) */}
          <div className="relative mx-auto w-[340px] h-[680px] rounded-[48px] border-[12px] border-bg-card bg-bg-darkest shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden transition-all duration-300 border-white/10">
            
            {/* Notch / Dynamic Island */}
            {!isMediaPlaying && (
              <div className="absolute top-2.5 left-1/2 transform -translate-x-1/2 w-28 h-5.5 bg-black rounded-full z-[100] flex items-center justify-center">
                <div className="w-2 h-2 bg-neutral-950 rounded-full mr-2 border border-neutral-900"></div>
                <div className="w-1 h-1 bg-neutral-950 rounded-full"></div>
              </div>
            )}

            {/* Android Status Bar */}
            {!isMediaPlaying && (
              <div className="h-10 bg-bg-darker px-5 pt-3.5 flex items-center justify-between text-slate-300 select-none z-[90] shrink-0 text-[10px] font-semibold transition-all duration-300">
                <span className="tracking-tight ml-1">{time || '04:35 AM'}</span>
                <div className="flex items-center gap-1.5 mr-1">
                  <Signal size={10} className="opacity-90" />
                  <Wifi size={10} className="opacity-90" />
                  <div className="flex items-center gap-0.5">
                    <Battery size={11} className="opacity-90" />
                    <span className="text-[9px] scale-90">100%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Navigation Header */}
            {!isMediaPlaying && (
              <div className="h-12 bg-bg-darker border-b border-white/5 px-4.5 flex items-center justify-between select-none z-50 shrink-0 transition-all duration-300">
                <div className="flex items-center gap-2">
                  {onGoBack ? (
                    <button
                      onClick={onGoBack}
                      className="p-1 rounded-full hover:bg-white/5 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Back to Launcher"
                    >
                      <ArrowLeft size={16} />
                    </button>
                  ) : (
                    <div className="w-5.5 h-5.5 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-[10px] shadow-sm">
                      W
                    </div>
                  )}
                  <span className="font-bold text-[13px] tracking-tight text-white truncate max-w-[150px]">
                    {selectedAppName || 'Webliox Launcher'}
                  </span>
                </div>

                <div className="flex items-center gap-0.5">
                  {selectedAppName && onRefresh && (
                    <button
                      onClick={onRefresh}
                      className="p-1 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Refresh WebView"
                    >
                      <RotateCw size={13} />
                    </button>
                  )}
                  {selectedAppName && onLaunchExternal && (
                    <button
                      onClick={onLaunchExternal}
                      className="p-1 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Open in new window"
                    >
                      <ExternalLink size={13} />
                    </button>
                  )}
                  {!selectedAppName && (
                    <div className="flex items-center gap-1 text-[9px] text-indigo-400 font-mono bg-indigo-500/5 px-1.5 py-0.5 rounded border border-indigo-500/10">
                      <span className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse"></span>
                      <span>Android 14</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Device Active View Container */}
            <div className="flex-1 bg-[#000] relative overflow-hidden flex flex-col">
              {children}
            </div>

            {/* Android Navigation Bar */}
            {!isMediaPlaying && (
              <div className="h-9 bg-bg-darker flex items-center justify-around select-none z-50 shrink-0 pb-1 border-t border-white/5 transition-all duration-300">
                <button 
                  onClick={onGoBack || (() => {})} 
                  className={`p-1 text-slate-500 hover:text-slate-300 transition-colors flex items-center justify-center ${!onGoBack ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                  disabled={!onGoBack}
                >
                  <div className="w-3 h-3 border-l-2 border-b-2 border-current transform rotate-45 translate-x-0.5"></div>
                </button>

                <button 
                  onClick={onGoBack || (() => {})} 
                  className="p-1 text-slate-500 hover:text-slate-300 transition-colors flex items-center justify-center cursor-pointer"
                  title="Home"
                >
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-current"></div>
                </button>

                <button 
                  className="p-1 text-slate-500 opacity-40 cursor-not-allowed flex items-center justify-center"
                  disabled
                >
                  <div className="w-3 h-3 border-2 border-current rounded-sm"></div>
                </button>
              </div>
            )}

            {/* Rounded screen corner overlay */}
            <div className="absolute inset-0 border border-white/5 pointer-events-none rounded-[36px]"></div>
          </div>
        </section>

        {/* COLUMN 3: RIGHT SIDEBAR (Tech Stack & Tutorial Tips) */}
        <aside className="col-span-3 border-l border-white/10 p-6 bg-bg-darker flex flex-col gap-6 overflow-y-auto custom-scrollbar select-none">
          
          {/* Design Principles Block */}
          <div>
            <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-3 underline underline-offset-4">
              01. Design Principles
            </h4>
            <ul className="text-xs space-y-2.5 text-slate-400 leading-relaxed font-sans">
              <li className="flex gap-2">
                <span className="text-indigo-500 font-bold">•</span>
                <span><b>Material You:</b> Dynamic background coloring based on custom launchers.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-500 font-bold">•</span>
                <span><b>Subtle Elevation:</b> Utilizes single-pixel borders (<code>border-white/5</code>) instead of flat shadows.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-500 font-bold">•</span>
                <span><b>Optimal Scanability:</b> Features big icons and consistent typography metrics for rapid app selection.</span>
              </li>
            </ul>
          </div>

          {/* Tech Stack Block */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">
              02. Technical Stack
            </h4>
            <div className="grid grid-cols-1 gap-2">
              <div className="bg-bg-card p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">React Native</span>
                <span className="text-[9px] font-mono text-indigo-400 bg-indigo-500/5 px-1.5 py-0.5 rounded border border-indigo-500/10">UI Engine</span>
              </div>
              <div className="bg-bg-card p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">Expo WebView</span>
                <span className="text-[9px] font-mono text-indigo-400 bg-indigo-500/5 px-1.5 py-0.5 rounded border border-indigo-500/10">Sandboxed</span>
              </div>
              <div className="bg-bg-card p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">AsyncStorage</span>
                <span className="text-[9px] font-mono text-indigo-400 bg-indigo-500/5 px-1.5 py-0.5 rounded border border-indigo-500/10">SQLite cache</span>
              </div>
            </div>
          </div>

          {/* Next Tutorial Box */}
          <div className="mt-auto p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-[11px] text-indigo-300 leading-relaxed font-sans">
            <p className="font-bold text-indigo-400 mb-1">Upcoming Tutorial:</p>
            How to use <b>AsyncStorage</b> to persist the user's custom launchers offline so that state is not lost on app reboots!
          </div>
        </aside>

      </main>
    </div>
  );
}
