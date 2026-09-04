import React, { useState } from 'react';
import { Database, CheckCircle2, XCircle, AlertTriangle, Copy, Check, ShieldCheck, HardDrive } from 'lucide-react';

interface DatabaseCardProps {
    name: 'MongoDB' | 'PostgreSQL';
    subtitle: string;
    isConnected: boolean | null;
    error: string | null;
    brandColor: 'emerald' | 'blue';
    defaultPort: string;
    connectionType: string;
}

export const DatabaseCard: React.FC<DatabaseCardProps> = ({
    name,
    subtitle,
    isConnected,
    error,
    brandColor,
    defaultPort,
    connectionType
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopyError = () => {
        if (error) {
            navigator.clipboard.writeText(error);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const isEmerald = brandColor === 'emerald';
    const accentGradient = isEmerald 
        ? 'from-emerald-500/20 via-teal-500/10 to-transparent' 
        : 'from-blue-500/20 via-indigo-500/10 to-transparent';
    const iconBg = isEmerald ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20';

    return (
        <div className={`relative glass-panel glass-panel-hover rounded-2xl p-6 overflow-hidden flex flex-col justify-between border ${isConnected === true ? 'border-slate-800' : isConnected === false ? 'border-rose-900/40' : 'border-slate-800'}`}>
            
            {/* Top Glow Background */}
            <div className={`absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br ${accentGradient} rounded-full blur-2xl pointer-events-none`} />

            <div>
                {/* Header Row */}
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl border ${iconBg} shadow-inner`}>
                            {isEmerald ? <Database className="w-6 h-6" /> : <HardDrive className="w-6 h-6" />}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                                {name}
                            </h3>
                            <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
                        </div>
                    </div>

                    {/* Status Badge */}
                    {isConnected === null ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700/60 animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                            Standby
                        </span>
                    ) : isConnected ? (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 glow-emerald">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Connected
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 glow-rose">
                            <XCircle className="w-3.5 h-3.5" />
                            Disconnected
                        </span>
                    )}
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-3 my-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
                    <div>
                        <span className="text-slate-500 font-medium block">Default Port</span>
                        <span className="text-slate-200 font-mono font-semibold">{defaultPort}</span>
                    </div>
                    <div>
                        <span className="text-slate-500 font-medium block">Driver / Client</span>
                        <span className="text-slate-200 font-mono font-semibold">{connectionType}</span>
                    </div>
                </div>
            </div>

            {/* Bottom Status / Error Feedback */}
            <div className="mt-4 pt-4 border-t border-slate-800/80">
                {isConnected === true && (
                    <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-950/30 p-3 rounded-xl border border-emerald-900/30">
                        <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                        <span>Database handshake verified & responding.</span>
                    </div>
                )}

                {isConnected === false && error && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-rose-400 font-semibold">
                            <span className="flex items-center gap-1.5">
                                <AlertTriangle className="w-4 h-4" />
                                Connection Failure Diagnostic
                            </span>
                            <button
                                onClick={handleCopyError}
                                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50 cursor-pointer"
                                title="Copy error log"
                            >
                                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                        <div className="p-3 bg-rose-950/40 border border-rose-900/50 rounded-xl overflow-hidden">
                            <p className="text-xs font-mono text-rose-300/90 break-all leading-relaxed max-h-24 overflow-y-auto">
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                {isConnected === null && (
                    <p className="text-xs text-slate-500 italic text-center py-1">
                        Click "Run Full Diagnostics" to query system health
                    </p>
                )}
            </div>

        </div>
    );
};
