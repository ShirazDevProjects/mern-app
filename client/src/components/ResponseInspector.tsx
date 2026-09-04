import React, { useState } from 'react';
import { Terminal, Copy, Check, Code2 } from 'lucide-react';

interface ResponseInspectorProps {
    data: any;
    rawJson: string;
}

export const ResponseInspector: React.FC<ResponseInspectorProps> = ({ data, rawJson }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (rawJson) {
            navigator.clipboard.writeText(rawJson);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
            
            {/* Terminal Top Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800/80 select-none">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 mr-2">
                        <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                        <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                        <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                    </div>
                    <Terminal className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-mono font-semibold text-slate-300">
                        GET /api/message
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                        200 OK
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                        application/json
                    </span>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700/60 transition cursor-pointer"
                        title="Copy JSON Payload"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
                        <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                    </button>
                </div>
            </div>

            {/* Terminal Body */}
            <div className="p-4 bg-[#060911]/90 overflow-x-auto">
                {data ? (
                    <pre className="text-xs font-mono text-indigo-200/90 leading-relaxed">
                        <code>{JSON.stringify(data, null, 2)}</code>
                    </pre>
                ) : (
                    <div className="py-8 text-center text-slate-500 font-mono text-xs flex flex-col items-center gap-2">
                        <Code2 className="w-8 h-8 text-slate-700" />
                        <span>No response data loaded yet. Trigger diagnostic check above.</span>
                    </div>
                )}
            </div>

            {/* Bottom Footer Info */}
            {data && (
                <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/60 text-[11px] text-slate-400 font-mono flex items-center justify-between">
                    <span>Message: "{data.message || 'N/A'}"</span>
                    <span>Payload Size: {new Blob([rawJson]).size} bytes</span>
                </div>
            )}

        </div>
    );
};
