import { useState, useEffect, useCallback } from 'react';
import { Navbar } from '../components/Navbar';
import { DatabaseCard } from '../components/DatabaseCard';
import { ResponseInspector } from '../components/ResponseInspector';
import { 
    RefreshCw, 
    Activity, 
    Layers, 
    Clock, 
    RotateCw,
    Server
} from 'lucide-react';

interface ApiResponse {
    message: string;
    databaseConnected?: boolean;
    error?: string | null;
    mongoConnected?: boolean;
    mongoError?: string | null;
    postgresConnected?: boolean;
    postgresError?: string | null;
}

export const Home = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [responseData, setResponseData] = useState<ApiResponse | null>(null);
    const [rawJson, setRawJson] = useState<string>('');
    const [lastPing, setLastPing] = useState<number | null>(null);
    const [lastCheckedTime, setLastCheckedTime] = useState<string | null>(null);
    const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(0); // 0 = off, 5 = 5s, 10 = 10s

    const runDiagnostics = useCallback(async () => {
        setLoading(true);
        const startTime = performance.now();

        try {
            const res = await fetch('/api/message');
            const data: ApiResponse = await res.json();
            const endTime = performance.now();
            const latency = Math.round(endTime - startTime);

            setResponseData(data);
            setRawJson(JSON.stringify(data, null, 2));
            setLastPing(latency);
            setLastCheckedTime(new Date().toLocaleTimeString());
        } catch (err: any) {
            console.error('Failed to query backend health:', err);
            const fallbackErr = {
                message: 'Failed to connect to backend server',
                mongoConnected: false,
                mongoError: 'Backend API endpoint unreachable (port 4500)',
                postgresConnected: false,
                postgresError: 'Backend API endpoint unreachable (port 4500)'
            };
            setResponseData(fallbackErr);
            setRawJson(JSON.stringify(fallbackErr, null, 2));
            setLastPing(null);
            setLastCheckedTime(new Date().toLocaleTimeString());
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load fetch
    useEffect(() => {
        runDiagnostics();
    }, [runDiagnostics]);

    // Auto-refresh interval handler
    useEffect(() => {
        if (autoRefreshInterval <= 0) return;

        const timer = setInterval(() => {
            runDiagnostics();
        }, autoRefreshInterval * 1000);

        return () => clearInterval(timer);
    }, [autoRefreshInterval, runDiagnostics]);

    // Extract statuses safely
    const mongoStatus = responseData 
        ? (responseData.mongoConnected ?? responseData.databaseConnected ?? false) 
        : null;
    const mongoError = responseData 
        ? (responseData.mongoError ?? responseData.error ?? null) 
        : null;

    const postgresStatus = responseData 
        ? (responseData.postgresConnected ?? false) 
        : null;
    const postgresError = responseData 
        ? (responseData.postgresError ?? null) 
        : null;

    // Overall System Health Status
    const totalServices = 2;
    const activeServices = (mongoStatus ? 1 : 0) + (postgresStatus ? 1 : 0);

    let overallHealthStatus = 'Standby';
    let overallHealthBadgeClass = 'bg-slate-800 text-slate-400 border-slate-700';

    if (responseData) {
        if (activeServices === totalServices) {
            overallHealthStatus = '100% Operational';
            overallHealthBadgeClass = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 glow-emerald';
        } else if (activeServices > 0) {
            overallHealthStatus = 'Degraded Performance';
            overallHealthBadgeClass = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
        } else {
            overallHealthStatus = 'System Outage';
            overallHealthBadgeClass = 'bg-rose-500/15 text-rose-400 border-rose-500/30 glow-rose';
        }
    }

    return (
        <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
            
            {/* Top Navigation */}
            <Navbar isServerOnline={responseData !== null} lastPing={lastPing} />

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
                
                {/* Hero / Header Section */}
                <div className="relative glass-panel rounded-3xl p-6 sm:p-8 overflow-hidden border border-slate-800 shadow-2xl">
                    
                    {/* Background Decorative Mesh */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-600/15 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-emerald-600/10 via-cyan-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        
                        {/* Hero Text */}
                        <div className="space-y-2 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                <Activity className="w-3.5 h-3.5" />
                                Live Infrastructure Inspector
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                                Database & System <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Health Center</span>
                            </h2>
                            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                                Monitor real-time database connectivity, verify query handshakes, and inspect backend response payloads across your MERN stack services.
                            </p>
                        </div>

                        {/* Diagnostics & Auto-Refresh Control Bar */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            
                            {/* Auto-Refresh Select */}
                            <div className="flex items-center justify-between sm:justify-start gap-2 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs">
                                <span className="text-slate-400 font-medium px-2 flex items-center gap-1.5">
                                    <RotateCw className={`w-3.5 h-3.5 text-indigo-400 ${autoRefreshInterval > 0 ? 'animate-spin' : ''}`} />
                                    Auto:
                                </span>
                                <div className="flex items-center gap-1">
                                    {[0, 5, 10].map((sec) => (
                                        <button
                                            key={sec}
                                            onClick={() => setAutoRefreshInterval(sec)}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition cursor-pointer ${
                                                autoRefreshInterval === sec 
                                                    ? 'bg-indigo-600 text-white shadow-md' 
                                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                                            }`}
                                        >
                                            {sec === 0 ? 'Off' : `${sec}s`}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Run Diagnostic Button */}
                            <button
                                onClick={runDiagnostics}
                                disabled={loading}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                <span>{loading ? 'Testing System...' : 'Run Diagnostics'}</span>
                            </button>
                        </div>

                    </div>

                    {/* Stats Metrics Cards Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-800/80">
                        
                        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
                            <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                                Monitored DBs
                            </div>
                            <div className="text-lg font-bold text-slate-100 font-mono">
                                2 Databases
                            </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
                            <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                                <Server className="w-3.5 h-3.5 text-purple-400" />
                                Overall Health
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold border ${overallHealthBadgeClass}`}>
                                    {overallHealthStatus}
                                </span>
                            </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
                            <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                                API Round-Trip
                            </div>
                            <div className="text-lg font-bold text-slate-100 font-mono">
                                {lastPing !== null ? `${lastPing} ms` : '--'}
                            </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
                            <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                                <Clock className="w-3.5 h-3.5 text-pink-400" />
                                Last Checked
                            </div>
                            <div className="text-lg font-bold text-slate-100 font-mono">
                                {lastCheckedTime || '--:--:--'}
                            </div>
                        </div>

                    </div>

                </div>

                {/* Databases Grid Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                            <span>Database Instances & Handshakes</span>
                        </h3>
                        <span className="text-xs text-slate-400 font-medium">
                            Showing {activeServices} of {totalServices} online
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* MongoDB Card */}
                        <DatabaseCard
                            name="MongoDB"
                            subtitle="NoSQL Document Storage"
                            isConnected={mongoStatus}
                            error={mongoError}
                            brandColor="emerald"
                            defaultPort="27017"
                            connectionType="Mongoose ODM"
                        />

                        {/* PostgreSQL Card */}
                        <DatabaseCard
                            name="PostgreSQL"
                            subtitle="Relational SQL Engine"
                            isConnected={postgresStatus}
                            error={postgresError}
                            brandColor="blue"
                            defaultPort="5432"
                            connectionType="pg (Node Pool)"
                        />
                    </div>
                </div>

                {/* Developer Response Inspector Section */}
                <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                            <span>Backend Endpoint Response Inspector</span>
                        </h3>
                    </div>

                    <ResponseInspector data={responseData} rawJson={rawJson} />
                </div>

            </main>

            {/* Footer */}
            <footer className="mt-12 py-6 border-t border-slate-800/60 text-center text-xs text-slate-500 font-medium">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span>MERN App Architecture & Infrastructure Monitor</span>
                    <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                        <span>React 18</span>
                        <span>•</span>
                        <span>Vite</span>
                        <span>•</span>
                        <span>Express 5</span>
                        <span>•</span>
                        <span>Node.js</span>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default Home;
