import React from 'react';
import { Activity, Server, Cpu, ExternalLink } from 'lucide-react';

interface NavbarProps {
    isServerOnline: boolean | null;
    lastPing: number | null;
}

export const Navbar: React.FC<NavbarProps> = ({ isServerOnline, lastPing }) => {
    return (
        <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3.5 shadow-2xl">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                
                {/* Left Brand Identity */}
                <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 shadow-lg shadow-indigo-500/20">
                        <Cpu className="w-5 h-5 text-white animate-pulse" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isServerOnline ? 'bg-emerald-400 opacity-75' : 'bg-amber-400 opacity-75'}`}></span>
                            <span className={`relative inline-flex rounded-full h-3 w-3 ${isServerOnline ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        </span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                                MERN Architecture
                            </h1>
                            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">
                                Core Engine
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5 font-medium">
                            <span>Database & System Health Monitor</span>
                        </p>
                    </div>
                </div>

                {/* Right Badges & Controls */}
                <div className="flex items-center gap-3">
                    
                    {/* Server Latency Pill */}
                    {lastPing !== null && (
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
                            <Activity className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{lastPing} ms</span>
                        </div>
                    )}

                    {/* Environment Pill */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800/80">
                        <Server className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-semibold text-slate-300 hidden md:inline">Express Backend</span>
                        <span className="text-xs font-mono px-1.5 py-0.5 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded">
                            :4500
                        </span>
                    </div>

                    <a 
                        href="http://localhost:4500/api/message" 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 hover:text-white transition border border-slate-700/50 flex items-center gap-1 text-xs font-medium"
                        title="Open Direct API Endpoint"
                    >
                        <span className="hidden sm:inline">Raw API</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>

            </div>
        </header>
    );
};
