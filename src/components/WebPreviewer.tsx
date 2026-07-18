/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, ArrowRight, RotateCw, ExternalLink, Globe, 
  Send, Sparkles, CheckSquare, Film, Play, Image, Type, Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WebApp } from '../types';

interface WebPreviewerProps {
  app: WebApp;
  onClose: () => void;
}

export default function WebPreviewer({ app, onClose }: WebPreviewerProps) {
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

  // Determine if URL is iframe-safe or blocks iframes (X-Frame-Options restrictions)
  const isIframeBlocked = (url: string): boolean => {
    const blockedKeywords = ['chatgpt', 'openai', 'notion', 'netflix', 'canva', 'spotify', 'google', 'government', 'erp'];
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
      let reply = "That's an interesting idea! How can we implement that inside our WebHub structure?";
      if (userMsg.toLowerCase().includes('hello') || userMsg.toLowerCase().includes('hi')) {
        reply = "Hello there! Let's build some amazing software. What are we brainstorming today?";
      } else if (userMsg.toLowerCase().includes('code') || userMsg.toLowerCase().includes('react')) {
        reply = "To code this in React Native, we would use a <WebView> from 'react-native-webview'. It lets us bypass browser sandbox headers seamlessly on mobile!";
      } else if (userMsg.toLowerCase().includes('design') || userMsg.toLowerCase().includes('canva')) {
        reply = "Design is everything. Pairing consistent layout spacing, clean Material Design 3 guidelines, and high-contrast typography will set WebHub apart!";
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

        {/* BROWSER SANDBOX BLOCK EDUCATION BAR (Crucial for learning!) */}
        {blocksIframe && !isLoading && (
          <div className="bg-bg-card border-b border-white/10 p-3 text-[10px] text-slate-300 leading-relaxed shrink-0">
            <span className="font-bold text-indigo-400 uppercase">🎓 Junior Developer Lesson: Sandbox Bypass</span><br/>
            Because we are in a web browser preview, standard security <code>X-Frame-Options: DENY</code> blocks us from rendering {app.name} inside an iframe. However, when we deploy this as a native Android app with React Native's <code>WebView</code>, <strong>it bypasses this completely!</strong> To give you a perfect experience, we have booted a beautiful high-fidelity interactive simulation of the app below.
          </div>
        )}

        {/* ACTUAL WEBPAGE (If safe) or HIGH FIDELITY SIMULATION (If blocked) */}
        <div className="flex-1 relative overflow-hidden bg-[#000] flex flex-col">
          {!blocksIframe ? (
            /* Render actual webpage inside iframe */
            <iframe
              ref={iframeRef}
              src={app.url}
              className="w-full h-full border-none bg-white"
              title={app.name}
              sandbox="allow-scripts allow-same-origin allow-forms"
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
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="mt-2 flex items-center gap-1 bg-white hover:bg-slate-200 text-slate-950 font-bold text-[9px] px-2.5 py-1 rounded transition-colors cursor-pointer"
                      >
                        <Play size={9} className="fill-current" />
                        <span>{isPlaying ? 'Pause Movie' : 'Watch Trailer'}</span>
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
                      <div className="group rounded-xl overflow-hidden bg-bg-card border border-white/5 p-2 cursor-pointer hover:bg-[#25232a]">
                        <div className="h-16 bg-indigo-950/20 rounded-lg flex items-center justify-center text-indigo-400 font-bold mb-2">
                          <Film size={18} />
                        </div>
                        <p className="text-[10px] font-bold text-slate-200">The Native Code</p>
                        <p className="text-[9px] text-slate-500 mt-0.5">Sci-Fi • 98% Match</p>
                      </div>
                      <div className="group rounded-xl overflow-hidden bg-bg-card border border-white/5 p-2 cursor-pointer hover:bg-[#25232a]">
                        <div className="h-16 bg-violet-950/20 rounded-lg flex items-center justify-center text-violet-400 font-bold mb-2">
                          <Film size={18} />
                        </div>
                        <p className="text-[10px] font-bold text-slate-200">MMKV Chronicles</p>
                        <p className="text-[9px] text-slate-500 mt-0.5">Thriller • 95% Match</p>
                      </div>
                    </div>
                  </div>
                </div>
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
                /* DEFAULT PORTAL GENERIC SIMULATOR */
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-bg-darkest h-full font-sans">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${app.color} flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-black/40`}>
                    <Globe size={20} />
                  </div>
                  <h3 className="text-xs font-bold text-slate-200 mt-4">Sandbox Protected Portal</h3>
                  <p className="text-[10px] text-slate-500 mt-2 max-w-xs leading-relaxed">
                    This custom portal is secured. Since custom websites frequently block browser-in-browser connections, use the action button above to launch this link in a standard high-speed window!
                  </p>
                  <button
                    onClick={handleLaunchExternal}
                    className="mt-4 flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-500/10"
                  >
                    <span>Launch Website</span>
                    <ExternalLink size={10} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
