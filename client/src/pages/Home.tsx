import { useState } from 'react';

const Home = () => {
    const [message, setMessage] = useState<string>('');
    const [mongoStatus, setMongoStatus] = useState<boolean | null>(null);
    const [mongoError, setMongoError] = useState<string | null>(null);
    const [postgresStatus, setPostgresStatus] = useState<boolean | null>(null);
    const [postgresError, setPostgresError] = useState<string | null>(null);

    const fetchMessage = () => {
        // Fetch message from the backend API when the button is clicked
        fetch('/api/message')
            .then((res) => res.json())
            .then((data) => {
                setMessage(data.message);
                setMongoStatus(data.mongoConnected ?? data.databaseConnected ?? false);
                setMongoError(data.mongoError ?? data.error ?? null);
                setPostgresStatus(data.postgresConnected ?? false);
                setPostgresError(data.postgresError ?? null);
            })
            .catch((err) => console.error('Error fetching data:', err));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 bg-gray-50">
            <h1 className="text-4xl font-bold text-gray-800">Welcome to App</h1>
            <p className="mt-2 text-lg text-gray-600">Database Connection Monitor</p>

            <button
                onClick={fetchMessage}
                className="mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition flex items-center gap-2 cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
                </svg>
                Get Backend Status
            </button>

            {message && (
                <div className="mt-8 p-6 bg-white border border-gray-200 rounded-xl shadow-lg w-full max-w-2xl transform transition-all duration-300 ease-in-out">
                    <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-6 text-center">
                        <p className="font-bold text-gray-700 text-lg mb-1">Backend Response:</p>
                        <p className="text-lg text-indigo-600 font-semibold">{message}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* MongoDB Status Card */}
                        <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center">
                            <div className="flex items-center gap-2 mb-3">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                                </svg>
                                <span className="font-bold text-gray-700">MongoDB</span>
                            </div>

                            <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-white text-sm font-bold shadow-xs ${mongoStatus ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                {mongoStatus ? (
                                    <>
                                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                        Connected
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                        Disconnected
                                    </>
                                )}
                            </div>

                            {mongoError && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg w-full text-left">
                                    <p className="text-red-800 text-xs font-semibold mb-1 flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Error Details:
                                    </p>
                                    <p className="text-red-600 text-xs font-mono break-all bg-red-100/60 p-2 rounded">{mongoError}</p>
                                </div>
                            )}
                        </div>

                        {/* PostgreSQL Status Card */}
                        <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center">
                            <div className="flex items-center gap-2 mb-3">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                </svg>
                                <span className="font-bold text-gray-700">PostgreSQL</span>
                            </div>

                            <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-white text-sm font-bold shadow-xs ${postgresStatus ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                {postgresStatus ? (
                                    <>
                                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                        Connected
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                        Disconnected
                                    </>
                                )}
                            </div>

                            {postgresError && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg w-full text-left">
                                    <p className="text-red-800 text-xs font-semibold mb-1 flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Error Details:
                                    </p>
                                    <p className="text-red-600 text-xs font-mono break-all bg-red-100/60 p-2 rounded">{postgresError}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;

