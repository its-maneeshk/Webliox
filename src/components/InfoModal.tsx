/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Github, ShieldAlert, Scale, HelpCircle, HeartHandshake, FileText } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal content box */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto custom-scrollbar bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl z-10 flex flex-col p-6 text-slate-200 text-left font-sans"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Scale size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white tracking-tight">About & Legal Disclaimers</h3>
                  <p className="text-[10px] text-slate-500 font-mono">webliox launcher v2.1</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Close Info Panel"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="space-y-5 text-xs leading-relaxed overflow-y-auto pr-1">
              
              {/* Introduction */}
              <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                <h4 className="font-bold text-slate-100 flex items-center gap-1.5 mb-1 text-[13px]">
                  <HelpCircle size={14} className="text-indigo-400" />
                  What is Webliox?
                </h4>
                <p className="text-slate-300">
                  Webliox is an ultra-fast, offline-capable client-side web hub and custom app launcher. 
                  It is designed to organize your daily developer workspaces, design canvases, and social channels 
                  into a sleek, responsive, simulated mobile sandbox wrapper.
                </p>
              </div>

              {/* Open Source Contribution Section */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-white/5 flex flex-col gap-3">
                <div className="flex items-start gap-2.5">
                  <Github size={18} className="text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-200 text-[13px]">Open Source & Contributions</h4>
                    <p className="text-slate-400 mt-1">
                      Webliox is fully open-source and community-driven. You can contribute launchers, 
                      report issues, request premium features, or deploy your own local configurations on GitHub!
                    </p>
                  </div>
                </div>

                <a
                  href="https://github.com/its-maneeshk/Webliox.git"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-10 mt-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer hover:shadow-indigo-900/20 hover:scale-[1.01]"
                >
                  <Github size={15} />
                  <span>Contribute on GitHub</span>
                </a>
              </div>

              {/* Comprehensive Legal Disclaimers (Safe Harbor Compliance) */}
              <div className="space-y-4">
                <h4 className="font-mono text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Legal Terms & Safety Disclaimers
                </h4>

                {/* Third-Party Content & Embedding Disclaimer */}
                <div className="flex gap-3">
                  <ShieldAlert size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-200">1. Third-Party Content Disclaimer</h5>
                    <p className="text-slate-400 mt-0.5">
                      Webliox operates strictly as an interactive browser-based routing hub and wrapper. 
                      The software does not host, store, cache, stream, distribute, or modify any media, 
                      text, or copyrightable content rendered inside the iframe/webview panels. 
                      Any application cards pointing to external sites (such as NetMirror, Netflix, Canva, ChatGPT) 
                      are user-configured URLs.
                    </p>
                  </div>
                </div>

                {/* Intellectual Property Safe Harbor */}
                <div className="flex gap-3">
                  <FileText size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-200">2. Intellectual Property & Trademarks</h5>
                    <p className="text-slate-400 mt-0.5">
                      All third-party brand names, company names, logos, and registered trademarks displayed 
                      within this launcher are the exclusive property of their respective trademark holders. 
                      Their representation inside Webliox is solely for identification and simulation purposes, 
                      constituting nominal fair use under intellectual property guidelines.
                    </p>
                  </div>
                </div>

                {/* Safe Harbor DMCA Policy */}
                <div className="flex gap-3">
                  <ShieldAlert size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-200">3. Safe Harbor & DMCA Compliance</h5>
                    <p className="text-slate-400 mt-0.5">
                      As a client-only workspace simulation, Webliox is fully compliant with Safe Harbor provisions. 
                      If you are a copyright owner or representative and wish to request removal of default shortcut URLs 
                      from our open-source codebase, please open an issue or pull request on our GitHub repository.
                    </p>
                  </div>
                </div>

                {/* Limitation of Liability */}
                <div className="flex gap-3">
                  <HeartHandshake size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-200">4. Limitation of Liability</h5>
                    <p className="text-slate-400 mt-0.5">
                      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
                      INCLUDING BUT NOT LIMITED TO FITNESS FOR A PARTICULAR PURPOSE, NONINFRINGEMENT, 
                      OR RELIABILITY. IN NO EVENT SHALL THE DEVELOPERS OR CONTRIBUTORS BE LIABLE FOR ANY CLAIM, 
                      DAMAGES, OR OTHER LIABILITY ARISING FROM THE USE OF USER-ADDED EMBEDDED URLS.
                    </p>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-white/5 text-center text-[10px] text-slate-500 font-mono">
                Webliox is safe, private, and processes zero cookies server-side.
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
