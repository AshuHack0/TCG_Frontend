import Header from "./components/header";
import pokemon from "./pokemon.png";
import { socketContext } from "./socketContext";
import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { BASE_URL } from "./baseurl";

export default function CardGame() {
    const { socketRef, socket, profile} = useContext(socketContext);
    const [matches, setMatches] = useState([]);
    const [matchSettings, setMatchSettings] = useState();
    const [users, setUsers] = useState([]);
    const listenerAdded = useRef(false); 
    const navigate = useNavigate();

    useEffect(() => {
        if (socketRef?.current && !listenerAdded.current) {
            console.log("Setting up socket listener...");
            socketRef?.current?.emit("getUsers");
            
            socketRef?.current?.on("getUsers", (data) => {
                console.log("getUsers");
                console.log(data);
                setUsers(data);
            });
            
            socketRef?.current?.on("updatedSpectatorInteractionControls", (data) => {
                setMatchSettings(data);
            });
            
            // Listen for spectator join/leave events to update user list
            socketRef?.current?.on("spectatorJoined", (data) => {
                console.log("Spectator joined:", data);
                // Refresh users list when someone joins as spectator
                socketRef?.current?.emit("getUsers");
            });
            
            socketRef?.current?.on("spectatorLeft", (data) => {
                console.log("Spectator left:", data);
                // Refresh users list when someone leaves as spectator
                socketRef?.current?.emit("getUsers");
            });
            
            // Listen for any user updates
            socketRef?.current?.on("userUpdated", (data) => {
                console.log("User updated:", data);
                socketRef?.current?.emit("getUsers");
            });
            
            const handleGetMatches = (data) => {
                console.log('Received matches data:', data);
                
                if (Array.isArray(data) && data.length > 0) {
                    console.log("Updating matches state");
                    setMatches(data); 
                } else {
                    setMatches([]);
                }
            };

            socketRef.current.on('getMatches', handleGetMatches);
            socketRef.current.emit("getMatches");
            
            listenerAdded.current = true;
            
            return () => {
                console.log("Removing socket listener...");
                socketRef.current.off('getMatches', handleGetMatches);
                socketRef.current.off('spectatorJoined');
                socketRef.current.off('spectatorLeft');
                socketRef.current.off('userUpdated');
                listenerAdded.current = false;
            };
        }
    }, [socketRef.current, socket]); 

    useEffect(() => {
        getMatchSettings();
    }, []);

    const getMatchSettings = async () => {
        try {
            let response = await axios.get(`${BASE_URL}/getMatchSettings`);
            console.log("getMatchSettings");
            console.log(response.data);
            setMatchSettings(response.data.settings);
        } catch (e) {
            console.error("Error fetching match settings:", e);
        }
    };

    // Only count actual spectators (users with spectator:true)
    const getSpectatorCount = (matchRoomId) => {
        return users.filter(user => 
            user?.roomId === matchRoomId && 
            user.spectator === true
        ).length;
    };

    // Check if a match can be watched
    const canWatchMatch = (matchRoomId) => {
        // If spectator settings are disabled, no one can watch
        if (!matchSettings?.enable_spectator_settings) {
            return false;
        }
        
        const spectatorCount = getSpectatorCount(matchRoomId);
        return spectatorCount < matchSettings?.max_spectators;
    };

    // Get watch status text
    const getWatchStatus = (matchRoomId) => {
        // If spectator settings are disabled, don't show status
        if (!matchSettings?.enable_spectator_settings) {
            return null; 
        }
        
        const spectatorCount = getSpectatorCount(matchRoomId);
        const maxSpectators = matchSettings?.max_spectators || 0;
        
        if (spectatorCount >= maxSpectators) {
            return "Room Full";
        }
        
        return `Watch Now (${spectatorCount}/${maxSpectators})`;
    };

    // Handle watch game click with additional validation
    const handleWatchGame = async (matchRoomId, playerOneId, playerTwoId, liveStreamRoomId) => {
        // Double-check spectator capacity before navigating
        const currentSpectatorCount = getSpectatorCount(matchRoomId);
        const maxSpectators = matchSettings?.max_spectators || 0;
        
        if (currentSpectatorCount >= maxSpectators) {
            alert('This match is now full. Please try another match.');
            // Refresh users data to get latest state
            socketRef?.current?.emit("getUsers");
            return;
        }
        
        // Navigate to watch game
        navigate(`/watchgame?playerOne=${playerOneId}&playerTwo=${playerTwoId}&liveStreamRoomId=${liveStreamRoomId}`);
    };

    // Add interval to periodically refresh users data for real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            if (socketRef?.current) {
                socketRef.current.emit("getUsers");
            }
        }, 5000); // Refresh every 5 seconds

        return () => clearInterval(interval);
    }, [socketRef]);

    // Show all matches but handle capacity check on click
    const getDisplayMatches = () => {
        return matches;
    };

    return (
        <div className='w-full min-h-screen bg-gray-800 relative overflow-hidden'>
            {/* Header */}
            <div className='relative z-50'>
                <Header />
            </div>
            
            {/* Animated background effects */}
            <div className='fixed inset-0 pointer-events-none overflow-hidden z-0'>
                {/* Floating gradient orbs */}
                <div className='absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-[#2cac4f]/20 to-[#ffc845]/20 rounded-full filter blur-3xl animate-float-slow'></div>
                <div className='absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-[#ffc845]/20 to-[#ff6b9d]/20 rounded-full filter blur-3xl animate-float-slower'></div>
                <div className='absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-[#ff6b9d]/20 to-[#2cac4f]/20 rounded-full filter blur-3xl animate-float-reverse'></div>
                
                {/* Animated particles */}
                <div className='absolute top-1/4 left-1/4 w-2 h-2 bg-[#2cac4f] rounded-full animate-particle-float-1'></div>
                <div className='absolute top-1/3 right-1/3 w-2 h-2 bg-[#ffc845] rounded-full animate-particle-float-2'></div>
                <div className='absolute bottom-1/3 left-1/2 w-2 h-2 bg-[#ff6b9d] rounded-full animate-particle-float-3'></div>
                <div className='absolute top-2/3 right-1/4 w-2 h-2 bg-[#2cac4f] rounded-full animate-particle-float-4'></div>
            </div>

            <div className='relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12'>
                {/* Hero Title */}
                <div className='text-center mb-8 md:mb-12 animate-title-entrance'>
                    <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-3 tracking-tight'>
                        <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#2cac4f] via-[#ffc845] to-[#ff6b9d] animate-gradient-flow animate-text-shimmer'>
                            Live Matches
                        </span>
                    </h1>
                    <p className='text-gray-300 text-sm md:text-base font-medium animate-fade-in-delayed-long'>
                        Watch exciting TCG battles in real-time
                    </p>
                </div>

                {/* Matches Container */}
                <div className='flex flex-col gap-4 md:gap-6'>
                    {getDisplayMatches().length === 0 ? (
                        <div className="bg-white rounded-2xl p-8 md:p-12 border-2 border-black shadow-2xl text-center animate-fade-in-up">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-20 h-20 bg-[#a8d5e2] rounded-full flex items-center justify-center border-2 border-black">
                                    <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-black">No Active Matches</h3>
                                <p className="text-gray-600">Check back soon for live TCG battles!</p>
                            </div>
                        </div>
                    ) : (
                        getDisplayMatches().map((val, i) => {
                            const matchRoomId = val?.roomId;
                            const watchStatus = getWatchStatus(matchRoomId);
                            const canWatch = canWatchMatch(matchRoomId);
                            const spectatorCount = getSpectatorCount(matchRoomId);
                            const maxSpectators = matchSettings?.max_spectators || 0;
                            
                            return (
                                <div 
                                    key={`${val.socketId}-${i}`} 
                                    className="bg-white rounded-2xl border-2 border-black overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 animate-fade-in-up"
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                >
                                    <div className="flex gap-0 items-stretch flex-col md:flex-row">
                                        {/* Game Image */}
                                        <div className="md:w-32 w-full h-32 md:h-auto bg-[#a8d5e2] border-b-2 md:border-b-0 md:border-r-2 border-black flex justify-center items-center p-4 group overflow-hidden">
                                            <img 
                                                src={val?.image ? val?.image : 'Logo.png'} 
                                                alt="Game" 
                                                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" 
                                            />
                                        </div>
                                        
                                        {/* Match Info */}
                                        <div className="flex-1 p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                                    <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Live Now</span>
                                                </div>
                                                
                                                <h3 className="text-lg md:text-xl font-black text-black mb-2">
                                                    {val?.userName}
                                                    <span className="text-gray-500 mx-2">vs</span>
                                                    {val?.matchAgainst?.userName}
                                                </h3>
                                                
                                                {matchSettings?.enable_spectator_settings && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        <span className="text-gray-600 font-semibold">
                                                            {spectatorCount} / {maxSpectators} viewers
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Watch Button */}
                                            {matchSettings?.enable_spectator_settings && (
                                                <button
                                                    onClick={canWatch ? () => handleWatchGame(
                                                        matchRoomId,
                                                        val?.socketId, 
                                                        val?.matchAgainst?.socketId, 
                                                        val?.liveStreamRoomId
                                                    ) : undefined}
                                                    disabled={!canWatch}
                                                    className={`px-6 py-3 rounded-xl font-bold text-sm md:text-base border-2 border-black transition-all duration-300 whitespace-nowrap ${
                                                        canWatch 
                                                            ? 'bg-[#2cac4f] text-white hover:bg-[#259741] hover:scale-105 hover:-translate-y-1 hover:shadow-lg cursor-pointer' 
                                                            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                    }`}
                                                    title={canWatch ? 'Click to watch this match' : 'Maximum spectators reached'}
                                                >
                                                    {spectatorCount >= maxSpectators ? (
                                                        <span className="flex items-center gap-2">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                            </svg>
                                                            Room Full
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-2">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            Watch Now
                                                        </span>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes float-slow {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(50px, -30px) scale(1.1); }
                }
                
                @keyframes float-slower {
                    0%, 100% { transform: translate(0, 0) scale(1.05); }
                    50% { transform: translate(-40px, 40px) scale(1); }
                }
                
                @keyframes float-reverse {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(30px, 50px) scale(1.08); }
                }
                
                @keyframes particle-float-1 {
                    0%, 100% { transform: translate(0, 0); opacity: 0.3; }
                    50% { transform: translate(100px, -100px); opacity: 1; }
                }
                
                @keyframes particle-float-2 {
                    0%, 100% { transform: translate(0, 0); opacity: 0.3; }
                    50% { transform: translate(-80px, 80px); opacity: 1; }
                }
                
                @keyframes particle-float-3 {
                    0%, 100% { transform: translate(0, 0); opacity: 0.3; }
                    50% { transform: translate(60px, -120px); opacity: 1; }
                }
                
                @keyframes particle-float-4 {
                    0%, 100% { transform: translate(0, 0); opacity: 0.3; }
                    50% { transform: translate(-90px, -60px); opacity: 1; }
                }
                
                @keyframes title-entrance {
                    0% { opacity: 0; transform: translateY(-50px) scale(0.9); }
                    50% { transform: translateY(10px) scale(1.02); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                
                @keyframes gradient-flow {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                @keyframes text-shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes fade-in-delayed-long {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-float-slow { animation: float-slow 20s ease-in-out infinite; }
                .animate-float-slower { animation: float-slower 25s ease-in-out infinite; }
                .animate-float-reverse { animation: float-reverse 22s ease-in-out infinite; }
                .animate-particle-float-1 { animation: particle-float-1 8s ease-in-out infinite; }
                .animate-particle-float-2 { animation: particle-float-2 10s ease-in-out infinite; }
                .animate-particle-float-3 { animation: particle-float-3 12s ease-in-out infinite; }
                .animate-particle-float-4 { animation: particle-float-4 9s ease-in-out infinite; }
                .animate-title-entrance { animation: title-entrance 1s ease-out; }
                .animate-gradient-flow { background-size: 200% 200%; animation: gradient-flow 3s ease infinite; }
                .animate-text-shimmer { background-size: 200% auto; animation: text-shimmer 3s linear infinite; }
                .animate-fade-in-up { animation: fade-in-up 0.8s ease-out both; }
                .animate-fade-in-delayed-long { animation: fade-in-delayed-long 1s ease-out 0.5s both; }
            `}</style>
        </div>
    );
}