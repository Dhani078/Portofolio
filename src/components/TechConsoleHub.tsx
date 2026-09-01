'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Send, Trash2 } from 'lucide-react';

interface CommandOutput {
  command: string;
  response: string | React.ReactNode;
  time: string;
}

export default function TechConsoleHub() {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      command: 'welcome',
      response: (
        <div className="space-y-2 text-zinc-300">
          <div className="text-white font-bold">
            ✦ MRR.DEV TERMINAL
          </div>
          <div>Welcome to the interactive console.</div>
          <div className="text-zinc-400">Type <span className="text-white font-bold font-mono">help</span> to see available commands.</div>
        </div>
      ),
      time: new Date().toLocaleTimeString('id-ID', { hour12: false }),
    },
  ]);

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = async (cmdStr: string) => {
    const cleanCmd = cmdStr.trim().toLowerCase();
    const now = new Date().toLocaleTimeString('id-ID', { hour12: false });

    let res: React.ReactNode = '';

    switch (cleanCmd) {
      case 'help':
        res = (
          <div className="space-y-1.5 text-zinc-300">
            <div className="text-white font-bold">COMMANDS:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-2 font-mono text-xs">
              <div><span className="text-white font-bold">gh status</span> — Fetch latest GitHub activity</div>
              <div><span className="text-white font-bold">npm run test</span> — Run unit tests</div>
              <div><span className="text-white font-bold">clear</span> — Clear console</div>
            </div>
          </div>
        );
        break;

      case 'gh status':
        res = <div className="text-zinc-400">Fetching GitHub data...</div>;
        setHistory((prev) => [...prev, { command: cmdStr, response: res, time: now }]);
        
        try {
          const apiRes = await fetch('/api/github');
          const data = await apiRes.json();
          
          if (data.repos) {
            const updatedRes = (
              <div className="space-y-3 text-zinc-300 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">GITHUB ACTIVITY // Dhani078</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px]">
                    {data.user?.public_repos || 0} Repos
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.repos.map((repo: any, i: number) => (
                    <div key={i} className="p-3 rounded-xl bg-[#121215] border border-white/10 hover:border-white/30 transition-colors">
                      <a href={repo.html_url} target="_blank" rel="noreferrer" className="text-white font-bold hover:underline block truncate">
                        {repo.name}
                      </a>
                      <div className="text-zinc-400 mt-1 line-clamp-2 min-h-[2rem]">
                        {repo.description || 'No description provided.'}
                      </div>
                      <div className="flex items-center gap-3 text-zinc-500 text-[10px] mt-3">
                        {repo.language && (
                          <span className="flex items-center gap-1 text-white">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            {repo.language}
                          </span>
                        )}
                        <span>⭐ {repo.stargazers_count}</span>
                        <span>🔄 {new Date(repo.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
            setHistory((prev) => {
              const newHist = [...prev];
              newHist[newHist.length - 1].response = updatedRes;
              return newHist;
            });
          } else {
            setHistory((prev) => {
              const newHist = [...prev];
              newHist[newHist.length - 1].response = <div className="text-red-400">Failed to parse GitHub data.</div>;
              return newHist;
            });
          }
        } catch {
          setHistory((prev) => {
            const newHist = [...prev];
            newHist[newHist.length - 1].response = <div className="text-red-400">Network error fetching GitHub data.</div>;
            return newHist;
          });
        }
        setInputVal('');
        return; // Early return because we already updated history optimistically

      case 'npm run test':
        res = (
          <div className="space-y-1 font-mono text-xs text-zinc-300">
            <div className="text-white font-bold">&gt; portfolio@0.1.0 test</div>
            <div>&gt; vitest run</div>
            <br />
            <div className="text-green-400">✓ src/components/Hero.test.tsx (4 tests)</div>
            <div className="text-green-400">✓ src/app/api/contact/route.test.ts (2 tests)</div>
            <div className="text-green-400">✓ src/lib/utils.test.ts (8 tests)</div>
            <br />
            <div>Test Files  <span className="text-white font-bold">3 passed</span> (3)</div>
            <div>Tests       <span className="text-white font-bold">14 passed</span> (14)</div>
            <div>Time        1.24s</div>
            <div className="text-white font-bold mt-2">Coverage: 98.4% Statements</div>
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      default:
        res = (
          <div className="text-zinc-400 font-mono text-xs">
            Command not found: &quot;{cleanCmd}&quot;. Type <span className="text-white font-bold">help</span>.
          </div>
        );
    }

    setHistory((prev) => [...prev, { command: cmdStr, response: res, time: now }]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputVal.trim()) {
      executeCommand(inputVal);
    }
  };

  return (
    <section className="py-24 border-t border-white/10 max-w-[1400px] mx-auto w-full px-4 sm:px-8 lg:px-12 scroll-mt-24" id="console">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
      >
        <div>
          <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-white" />
            <span>INTERACTIVE CLI</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            Terminal.
          </h2>
        </div>
      </motion.div>

      {/* Terminal Window */}
      <div className="rounded-3xl bg-[#09090B]/95 border border-white/15 overflow-hidden shadow-2xl backdrop-blur-2xl">
        {/* Titlebar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#121215]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-3 h-3 rounded-full bg-zinc-500" />
            <div className="w-3 h-3 rounded-full bg-white" />
            <span className="text-xs font-mono text-zinc-400 ml-2 font-medium">
              ~/mrr-engine (zsh)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => executeCommand('clear')}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Clear Console"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Console Body */}
        <div className="p-6 sm:p-8 font-mono text-xs sm:text-sm space-y-4 max-h-[420px] overflow-y-auto bg-[#000000]/80 min-h-[200px]">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center gap-2 text-zinc-400 text-xs">
                <span className="text-white font-bold">➜</span>
                <span className="text-zinc-500">~</span>
                <span className="text-white font-bold">{item.command}</span>
                <span className="text-zinc-600 text-[11px] ml-auto">{item.time}</span>
              </div>
              <div className="pl-4 py-1 leading-relaxed">{item.response}</div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#121215] space-y-3">
          <div className="flex items-center gap-3 bg-[#000000] px-4 py-2.5 rounded-2xl border border-white/15 focus-within:border-white transition-colors">
            <span className="text-white font-bold text-sm font-mono">➜</span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type 'help' or 'gh status'..."
              className="w-full bg-transparent text-white font-mono text-xs sm:text-sm focus:outline-none placeholder:text-zinc-600"
            />
            <button
              onClick={() => {
                if (inputVal.trim()) executeCommand(inputVal);
              }}
              className="p-1.5 rounded-xl bg-white text-black hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-500 mr-1">Quick:</span>
            {['help', 'gh status', 'npm run test', 'clear'].map((cmd) => (
              <button
                key={cmd}
                onClick={() => executeCommand(cmd)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white text-xs font-mono transition-all cursor-pointer"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
