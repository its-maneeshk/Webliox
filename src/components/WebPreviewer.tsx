/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, ArrowRight, RotateCw, ExternalLink, Globe, 
  Send, Sparkles, CheckSquare, Film, Play, Image, Type, Palette,
  Shield, Terminal, Activity, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';
import { WebApp } from '../types';

interface WebPreviewerProps {
  app: WebApp;
  onClose: () => void;
  onMediaPlaying?: (isPlaying: boolean) => void;
}

export default function WebPreviewer({ app, onClose, onMediaPlaying }: WebPreviewerProps) {
  const adShieldActive = localStorage.getItem('webliox_adshield_active') !== 'false';
  const dnsEngine = localStorage.getItem('webliox_dns_engine') || 'cloudflare';

  const [isLoading, setIsLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const [simulatedProgress, setSimulatedProgress] = useState(10);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // ChatGPT State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    { sender: 'assistant', text: 'Hello! I am ChatGPT, running inside WebHub Launcher. How can I assist you with your projects today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Notion State
  const [notionTitle, setNotionTitle] = useState('My WebHub Project Plan 🚀');
  const [notionContent, setNotionContent] = useState(
    '# WebHub Roadmap\n\n- [x] Design beautiful MD3 Launcher Cards\n- [x] Create Android Device Frame mock\n- [ ] Wire up AsyncStorage for persistence\n- [ ] Configure Play Store distribution bundles'
  );

  // Netflix State
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(15);

  // Sync isPlaying state to Device Frame wrapper
  useEffect(() => {
    onMediaPlaying?.(isPlaying);
    return () => {
      onMediaPlaying?.(false);
    };
  }, [isPlaying, onMediaPlaying]);

  // Video playback timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setVideoProgress(p => (p >= 100 ? 0 : p + 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Determine if URL is iframe-safe or blocks iframes (X-Frame-Options restrictions)
  const isIframeBlocked = (url: string): boolean => {
    const blockedKeywords = ['chatgpt', 'openai', 'notion', 'netflix', 'canva', 'spotify', 'google', 'government', 'erp', 'net27'];
    return blockedKeywords.some(keyword => url.toLowerCase().includes(keyword));
  };

  const blocksIframe = isIframeBlocked(app.url);

  // Simulate progress bar on startup
  useEffect(() => {
    setIsLoading(true);
    setSimulatedProgress(15);
    
    const progressTimer = setInterval(() => {
      setSimulatedProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressTimer);
          return 90;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 120);

    const loadTimer = setTimeout(() => {
      setIsLoading(false);
      setSimulatedProgress(100);
    }, 1200);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(loadTimer);
    };
  }, [app]);

  // Support physical hardware back button interception & conditional navigation
  useEffect(() => {
    const isNative = Capacitor.isNativePlatform();
    let finishedListener: any = null;
    let backListener: any = null;

    const setupNativeBrowser = async () => {
      if (isNative) {
        try {
          // Open target URL natively in the genuine Sandbox Browser
          await Browser.open({ url: app.url, presentationStyle: 'fullscreen' });

          // Listen for browser finished (dismissed/closed) to notify UI to go home
          finishedListener = await Browser.addListener('browserFinished', () => {
            onClose();
          });

          // Intercept physical hardware back button to dismiss the browser view safely
          backListener = await App.addListener('backButton', async () => {
            await Browser.close();
            onClose();
          });
        } catch (err) {
          console.error("Native Capacitor Browser error:", err);
        }
      }
    };

    setupNativeBrowser();

    // Fallback logic for web preview inside iframe / desktop browsers
    const handleHardwareBackButton = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();

      const iframe = iframeRef.current;
      if (iframe) {
        try {
          if (iframe.contentWindow && iframe.contentWindow.history.length > 1) {
            iframe.contentWindow.history.back();
            return;
          }
        } catch (err) {
          console.warn("Cross-origin URL or restricted history: exiting iframe and closing previewer");
        }
      }
      onClose();
    };

    if (!isNative) {
      document.addEventListener('backbutton', handleHardwareBackButton);
    }

    return () => {
      if (!isNative) {
        document.removeEventListener('backbutton', handleHardwareBackButton);
      }
      if (finishedListener) {
        finishedListener.remove();
      }
      if (backListener) {
        backListener.remove();
      }
    };
  }, [app, onClose]);

  // Handle external launch
  const handleLaunchExternal = () => {
    window.open(app.url, '_blank', 'noopener,noreferrer');
  };

  // ChatGPT simulation helper
  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      const msg = userMsg.toLowerCase();
      let reply = "";

      const genericReplies = [
        "That's an interesting approach! How can we adapt this concept to optimize our launcher workflow?",
        "I like where you're going with this. Would you like to map out a quick UI mockup or jump straight into the database schema?",
        "That's a great question. In full-stack web architectures, we would typical proxy this requests to prevent CORS issues.",
        "Let's explore that deeper! What are the primary user interactions you want to focus on for this custom component?",
        "Fascinating concept! We can implement smooth page exits using Framer Motion's AnimatePresence for a true native app feel.",
        "That makes total sense. We can use client-side state hooks first, and then easily synchronize it with SQLite or Firestore when ready.",
        "Excellent! Let's draft a simple high-level flowchart of how the state flows from user inputs to our preview window.",
        "I'm on board. Tell me more about your design vision: are we going with a sleek dark slate theme or a modern light interface?"
      ];

      if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('hola')) {
        reply = "Hello there! Welcome to the Webliox AI-assisted workspace. What amazing ideas are we brainstorming today?";
      } else if (msg.includes('are you free') || msg.includes('busy') || msg.includes('available')) {
        reply = "I am absolutely free and always at your service! As an AI companion built directly into Webliox, I don't sleep. What can I code or design with you right now?";
      } else if (msg.includes('code') || msg.includes('react') || msg.includes('html') || msg.includes('javascript') || msg.includes('typescript')) {
        reply = "Coding is where the magic happens! To turn any website into a mobile app, we bundle React with Native WebViews. This completely bypasses standard browser sandbox limitations on device compiles!";
      } else if (msg.includes('design') || msg.includes('ui') || msg.includes('ux') || msg.includes('palette') || msg.includes('css')) {
        reply = "For high-fidelity visual design, we prioritize spatial pacing, crisp typography like Plus Jakarta Sans, single-pixel borders for elevated boundaries, and balanced negative space. It feels incredibly premium!";
      } else if (msg.includes('thank') || msg.includes('thanks') || msg.includes('appreciate')) {
        reply = "You are very welcome! Helping you build gorgeous full-stack applications is what I do best. Let me know what we should work on next!";
      } else if (msg.includes('name') || msg.includes('who are you')) {
        reply = "I am ChatGPT, your dynamic AI development assistant! I can help you architect layouts, plan components, write state handlers, and brainstorm full-stack structures.";
      } else if (msg.includes('help') || msg.includes('what can you do')) {
        reply = "I can assist you with coding, designing layouts, drafting documentation, planning user journeys, or brainstorming features for any website you want to transform into an app. Ask me anything!";
      } else {
        // Pick a random, highly creative generic reply to ensure it is never repetitive
        const randomIndex = Math.floor(Math.random() * genericReplies.length);
        reply = genericReplies[randomIndex];
      }

      setChatMessages(prev => [...prev, { sender: 'assistant', text: reply }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div id="web-previewer-viewport" className="flex-1 flex flex-col h-full bg-[#000] select-text text-[#e0e0e0]">
      
      {/* Simulation/Loading progress bar */}
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 z-50">
          <div 
            className="h-full bg-indigo-600 transition-all duration-150 ease-out" 
            style={{ width: `${simulatedProgress}%` }}
          ></div>
        </div>
      )}

      {/* WebView Chrome Header (Browser/App bar inside WebHub) */}
      <div className="h-10 bg-bg-darker border-b border-white/10 px-4 flex items-center justify-between text-xs font-mono shrink-0 select-none">
        <div className="flex items-center gap-1 text-slate-500">
          <Globe size={12} className="text-slate-400" />
          <span className="text-[10px] text-slate-400 font-sans truncate max-w-[200px] font-medium ml-1">
            {app.url}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {blocksIframe && (
            <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20 font-sans font-bold">
              Mock WebView Active
            </span>
          )}
          <button 
            onClick={handleLaunchExternal}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-sans font-bold text-[10px]"
          >
            <span>Launch External</span>
            <ExternalLink size={11} />
          </button>
        </div>
      </div>

      {/* Content Canvas */}
      <div className="flex-1 relative overflow-hidden bg-bg-darkest flex flex-col">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-darkest/95 z-20">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${app.color} flex items-center justify-center text-white text-lg font-bold shadow-lg animate-bounce`}>
              {app.name.charAt(0)}
            </div>
            <p className="text-xs font-bold text-slate-200 mt-4">Connecting sandbox engine...</p>
            <p className="text-[10px] text-slate-500 font-mono mt-1">{app.url}</p>
          </div>
        ) : null}

        {/* ACTUAL WEBPAGE (If safe) or HIGH FIDELITY SIMULATION (If blocked) */}
        <div className="flex-1 relative overflow-hidden bg-[#000]">
          {!blocksIframe ? (
            /* Render actual webpage inside iframe */
            <iframe
              ref={iframeRef}
              src={app.url}
              className="absolute inset-0 w-full h-full border-none bg-[#000]"
              title={app.name}
              allowFullScreen
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-write; clipboard-read"
              onError={() => setIframeError(true)}
            />
          ) : (
            /* RENDER THE HIGH FIDELITY APP SIMULATIONS */
            <div className="flex-1 flex flex-col overflow-hidden h-full bg-bg-darkest">
              {app.name.toLowerCase().includes('chatgpt') ? (
                /* CHATGPT MOCK SIMULATION */
                <div className="flex-1 flex flex-col bg-bg-darkest h-full font-sans">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {chatMessages.map((msg, idx) => (
                      <div 
                        key={idx} 
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                          msg.sender === 'user' 
                            ? 'bg-indigo-600 text-white font-medium rounded-br-none' 
                            : 'bg-bg-card text-slate-100 border border-white/5 rounded-bl-none'
                        }`}>
                          <p className="font-bold text-[9px] opacity-75 mb-1 font-mono tracking-widest">
                            {msg.sender === 'user' ? 'YOU' : 'CHATGPT'}
                          </p>
                          <p className="whitespace-pre-line text-[11px] leading-relaxed">{msg.text}</p>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-bg-card border border-white/5 text-slate-400 rounded-2xl rounded-bl-none p-3.5 text-xs max-w-[80%] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input area */}
                  <div className="p-3 bg-bg-darker border-t border-white/10 flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Ask anything..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                      className="flex-1 bg-bg-pill border border-white/5 rounded-full px-4 py-2.5 text-xs outline-none focus:border-indigo-500/40 text-slate-200"
                    />
                    <button
                      onClick={handleSendChatMessage}
                      className="p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
                    >
                      <Send size={13} />
                    </button>
                  </div>
                </div>
              ) : app.name.toLowerCase().includes('notion') ? (
                /* NOTION MOCK SIMULATION */
                <div className="flex-1 flex flex-col bg-bg-darkest h-full p-6 overflow-y-auto font-sans text-slate-100 custom-scrollbar">
                  <div className="max-w-2xl mx-auto w-full">
                    <input
                      type="text"
                      value={notionTitle}
                      onChange={(e) => setNotionTitle(e.target.value)}
                      className="text-2xl font-light border-none outline-none bg-transparent placeholder-slate-600 w-full mb-3 text-white"
                      placeholder="Untitled Document"
                    />
                    <div className="flex items-center gap-2 text-[10px] text-indigo-400 font-mono mb-5 border-b border-white/10 pb-3">
                      <span>Updated just now</span>
                      <span>•</span>
                      <span>Local Workspace</span>
                    </div>
                    <textarea
                      value={notionContent}
                      onChange={(e) => setNotionContent(e.target.value)}
                      className="w-full h-[260px] bg-transparent border-none outline-none resize-none text-xs font-mono text-slate-300 leading-relaxed focus:ring-0 custom-scrollbar"
                      placeholder="Type your notes here..."
                    />
                  </div>
                </div>
              ) : app.name.toLowerCase().includes('netflix') ? (
                /* NETFLIX MOCK SIMULATION */
                isPlaying ? (
                  /* PORTRAIT FULLSCREEN THEATER PLAYER WITH DYNAMIC IMMERSIVE LAYOUT */
                  <div className="flex-1 flex flex-col bg-black h-full relative justify-between p-5 select-none overflow-hidden animate-fadeIn">
                    {/* Immersive cinematic background video glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000] via-[#050505]/40 to-[#000] z-10 pointer-events-none"></div>
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-60 scale-105 animate-pulse bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800')]"
                      style={{ transition: 'transform 10s ease-in-out' }}
                    ></div>

                    {/* Top Control Bar */}
                    <div className="relative z-20 flex justify-between items-center pt-1.5">
                      <button
                        onClick={() => setIsPlaying(false)}
                        className="flex items-center gap-1.5 bg-neutral-900/80 hover:bg-neutral-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md cursor-pointer transition-all"
                        title="Exit Immersive Stream"
                      >
                        <ArrowLeft size={11} />
                        <span>Back</span>
                      </button>
                      <span className="text-[8px] font-mono font-bold text-red-500 uppercase tracking-wider px-2 py-0.5 rounded bg-red-950/50 border border-red-500/20">
                        HD • DOLBY
                      </span>
                    </div>

                    {/* Central Playback Controls Overlay */}
                    <div className="relative z-20 flex flex-col items-center justify-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsPlaying(false)}
                        className="w-16 h-16 rounded-full bg-red-600/25 hover:bg-red-600/40 border border-red-500/40 flex items-center justify-center text-white cursor-pointer backdrop-blur-sm shadow-xl shadow-red-900/35"
                      >
                        <span className="w-4 h-4 border-l-4 border-r-4 border-white inline-block"></span>
                      </motion.button>
                      <p className="text-xs font-bold text-white tracking-wide mt-2">Stellar Launchers</p>
                      <p className="text-[9px] text-slate-400 font-medium">Streaming Episode 1: "The Core UI Sandbox"</p>
                    </div>

                    {/* Bottom Cinematic Control Panel */}
                    <div className="relative z-20 flex flex-col gap-2.5 pb-2">
                      {/* Interactive Scrubber and Elapsed Timers */}
                      <div className="flex flex-col gap-1">
                        <div className="relative h-1 w-full bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className="absolute top-0 left-0 h-full bg-red-600 rounded-full transition-all duration-1000"
                            style={{ width: `${videoProgress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center text-[8px] font-mono text-slate-400">
                          <span>0:{videoProgress.toString().padStart(2, '0')}</span>
                          <span>2:15</span>
                        </div>
                      </div>

                      {/* Video attributes and dynamic subtitle indicator */}
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] text-slate-500 font-medium">CC English [Subtitles On]</span>
                        <div className="flex items-center gap-1 text-[9px] font-bold text-red-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                          <span>Auto-playing</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col bg-[#000] h-full p-4 overflow-y-auto font-sans text-slate-100 custom-scrollbar">
                    {/* Hero Trailer */}
                    <div className="relative rounded-2xl overflow-hidden h-40 bg-bg-card border border-white/5 mb-5 flex items-end p-4">
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-darkest via-bg-darkest/40 to-transparent z-10"></div>
                      <div className="absolute inset-0 bg-cover bg-center opacity-40 bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800')]"></div>
                      <div className="relative z-20 max-w-xs">
                        <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-1 font-mono">
                          <Sparkles size={9} className="fill-current" /> Original Series
                        </span>
                        <h3 className="text-sm font-bold text-white mt-1">Stellar Launchers</h3>
                        <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-normal">A story about young coders forging full-stack mobile applications from browser sandboxes.</p>
                        
                        <button 
                          onClick={() => setIsPlaying(true)}
                          className="mt-2 flex items-center gap-1 bg-white hover:bg-slate-200 text-slate-950 font-bold text-[9px] px-2.5 py-1 rounded transition-colors cursor-pointer"
                        >
                          <Play size={9} className="fill-current" />
                          <span>Watch Trailer</span>
                        </button>
                      </div>
                    </div>

                    {/* Dynamic Playback Overlay */}
                    {isPlaying && (
                      <div className="mb-4 p-2.5 bg-red-950/20 border border-red-500/20 rounded-xl flex items-center gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></div>
                        <span className="text-[10px] font-bold text-slate-300">Simulating Active Media Stream...</span>
                      </div>
                    )}

                    {/* Category lists */}
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-wider font-mono">Top Picks for You</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="group rounded-xl overflow-hidden bg-bg-card border border-white/5 p-2 cursor-pointer hover:bg-[#25232a]" onClick={() => setIsPlaying(true)}>
                          <div className="h-16 bg-indigo-950/20 rounded-lg flex items-center justify-center text-indigo-400 font-bold mb-2">
                            <Film size={18} />
                          </div>
                          <p className="text-[10px] font-bold text-slate-200">The Native Code</p>
                          <p className="text-[9px] text-slate-500 mt-0.5">Sci-Fi • 98% Match</p>
                        </div>
                        <div className="group rounded-xl overflow-hidden bg-bg-card border border-white/5 p-2 cursor-pointer hover:bg-[#25232a]" onClick={() => setIsPlaying(true)}>
                          <div className="h-16 bg-violet-950/20 rounded-lg flex items-center justify-center text-violet-400 font-bold mb-2">
                            <Film size={18} />
                          </div>
                          <p className="text-[10px] font-bold text-slate-200">MMKV Chronicles</p>
                          <p className="text-[9px] text-slate-500 mt-0.5">Thriller • 95% Match</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ) : app.name.toLowerCase().includes('canva') || app.name.toLowerCase().includes('photopea') ? (
                /* CANVA / DESIGN MOCK SIMULATION */
                <div className="flex-1 flex flex-col bg-bg-darkest h-full p-4 overflow-y-auto font-sans text-slate-100 custom-scrollbar">
                  {/* Tool tray */}
                  <div className="flex items-center gap-1.5 mb-4 bg-bg-card p-1.5 rounded-xl border border-white/5">
                    <button className="p-1.5 rounded bg-indigo-600 text-white cursor-pointer"><Palette size={13} /></button>
                    <button className="p-1.5 rounded text-slate-400 hover:bg-[#25232a] hover:text-slate-200 cursor-pointer"><Type size={13} /></button>
                    <button className="p-1.5 rounded text-slate-400 hover:bg-[#25232a] hover:text-slate-200 cursor-pointer"><Image size={13} /></button>
                  </div>

                  {/* Main canvas mockup */}
                  <div className="flex-1 min-h-[180px] rounded-2xl bg-bg-darkest border border-dashed border-white/10 flex flex-col items-center justify-center p-6 text-center select-none">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-pink-500/10">
                      🎨
                    </div>
                    <p className="text-[11px] font-bold text-slate-100 mt-4">WebHub Design Portal</p>
                    <p className="text-[9px] text-slate-500 mt-1 max-w-xs leading-normal">Double click to add design elements. Export your icons or vectors directly to assets!</p>
                  </div>
                </div>
              ) : (
                /* DEFAULT PORTAL GENERIC SIMULATOR - REDESIGNED MULTI-COMPARTMENT DASHBOARD */
                <div className="flex-1 flex flex-col bg-[#08090d] h-full font-sans text-slate-200">
                  {/* Top Portal Mock Banner */}
                  <div className="p-4 border-b border-white/5 bg-[#0d0e14] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${app.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                        {app.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{app.name}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">{app.category} Portal</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[8px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                        adShieldActive ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-neutral-800 text-slate-500'
                      }`}>
                        🛡️ AdShield {adShieldActive ? 'ON' : 'OFF'}
                      </span>
                      <span className="text-[8px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        ⚡ {dnsEngine.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Split body: Left Stats & Right Console Terminal */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar flex flex-col md:flex-row gap-4">
                    {/* Left stats panel */}
                    <div className="flex-1 space-y-3">
                      <div className="p-3.5 rounded-xl bg-bg-card border border-white/5 space-y-2.5">
                        <div className="flex justify-between items-center text-[10px] text-slate-400 border-b border-white/5 pb-1.5">
                          <span className="font-bold uppercase tracking-wide">Shield Statistics</span>
                          <span className="text-emerald-400 font-mono font-bold">Online</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-[#0b0c10] p-2 rounded-lg border border-white/5">
                            <span className="text-[8px] text-slate-400 block font-mono">AD BLOCKER</span>
                            <span className="text-xs font-black text-slate-200 mt-0.5 block">
                              {adShieldActive ? '24 blocked' : '0 (Off)'}
                            </span>
                          </div>
                          <div className="bg-[#0b0c10] p-2 rounded-lg border border-white/5">
                            <span className="text-[8px] text-slate-400 block font-mono">TRACKERS</span>
                            <span className="text-xs font-black text-slate-200 mt-0.5 block">
                              {adShieldActive ? '18 filtered' : '0 (Off)'}
                            </span>
                          </div>
                          <div className="bg-[#0b0c10] p-2 rounded-lg border border-white/5">
                            <span className="text-[8px] text-slate-400 block font-mono">DNS TUNNEL</span>
                            <span className="text-xs font-black text-slate-200 mt-0.5 block font-mono">
                              {dnsEngine === 'cloudflare' ? '1.1.1.1' : dnsEngine === 'adguard' ? 'AdGuard' : dnsEngine === 'google' ? '8.8.8.8' : 'Carrier'}
                            </span>
                          </div>
                          <div className="bg-[#0b0c10] p-2 rounded-lg border border-white/5">
                            <span className="text-[8px] text-slate-400 block font-mono">LATENCY</span>
                            <span className="text-xs font-black text-slate-200 mt-0.5 block font-mono">
                              {dnsEngine === 'cloudflare' ? '11ms' : dnsEngine === 'adguard' ? '22ms' : dnsEngine === 'google' ? '18ms' : '45ms'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Educational notice block */}
                      <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-[9.5px] text-slate-400 leading-relaxed space-y-1.5">
                        <p className="font-bold text-indigo-300">Why are you seeing a simulation?</p>
                        <p>
                          Standard browser environments enforce sandbox policies (CORS and X-Frame-Options SAMEORIGIN) that block custom sites like <strong className="text-indigo-200">{app.url.replace('https://', '')}</strong> or ChatGPT from running inside nested iframes.
                        </p>
                        <p>
                          When you build or compile Webliox into a <strong>Native Mobile APK</strong>, it uses an unrestricted WebView that ignores browser sandbox blocks to load everything natively!
                        </p>
                      </div>
                    </div>

                    {/* Right console Terminal panel */}
                    <div className="w-full md:w-[220px] bg-black/80 rounded-xl border border-white/15 p-3 font-mono text-[9px] text-emerald-400 space-y-1.5 flex flex-col justify-between shrink-0">
                      <div>
                        <div className="flex items-center gap-1.5 text-slate-400 mb-2 border-b border-white/5 pb-1">
                          <Terminal size={10} />
                          <span className="text-[8px] font-bold uppercase font-sans">Sandbox Shield Console</span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-slate-400"># webliox-cli --dns={dnsEngine}</p>
                          <p className="text-emerald-500">✓ Connected to {dnsEngine === 'cloudflare' ? 'Cloudflare Warp 1.1.1.1' : dnsEngine === 'adguard' ? 'AdGuard Secure DNS' : dnsEngine === 'google' ? 'Google 8.8.8.8' : 'Standard Gateway'}</p>
                          <p className="text-slate-400"># webliox-cli --adblock={adShieldActive ? 'on' : 'off'}</p>
                          <p className="text-emerald-500">{adShieldActive ? '✓ Shield active: Filtered 42 scripts & tracker nodes' : '⚠ AdShield is currently disabled'}</p>
                          <p className="text-slate-400"># curl -I {app.url}</p>
                          <p className="text-amber-500">⚠ Sandbox detected: Frame-ancestors restricted</p>
                          <p className="text-indigo-400">✦ Native WebView sandbox ready to intercept</p>
                        </div>
                      </div>
                      <div className="pt-2 text-[8px] text-slate-500 border-t border-white/5 flex justify-between items-center">
                        <span>SYS_STATUS: ACTIVE</span>
                        <span>PORT 3000</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Core CTA Action Block */}
                  <div className="p-4 bg-[#0d0e14] border-t border-white/5 text-center flex flex-col gap-2">
                    <button
                      onClick={handleLaunchExternal}
                      className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/10 cursor-pointer transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                    >
                      <Zap size={13} className="fill-current text-amber-300 animate-pulse" />
                      <span>Launch Secure Native Sandbox</span>
                      <ExternalLink size={12} />
                    </button>
                    <p className="text-[9px] text-slate-500 font-sans">
                      Renders the website in a standard clean viewport with simulated active shield proxies.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
