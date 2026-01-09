import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import { BASE_URL } from "../baseurl";
import { useNavigate } from "react-router-dom";
import FadeLoader	 from 'react-spinners/FadeLoader'
const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [loading,setLoading]=useState(true)
  const [user,setUser]=useState()

  const navigate=useNavigate()
  const handleAuth = () => {
    setIsLoggedIn(!isLoggedIn);
    setIsMenuOpen(false); 
    localStorage.removeItem('token')
    navigate('/')
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

useEffect(()=>{
fetchProfile();
},[])

  const fetchProfile=async()=>{
try{
  let token=localStorage.getItem('token')
  if(token){
    setIsLoggedIn(true)
  }
  if(!token){
return;
  }
let headers={
  headers:{
    authorization:`Bearer ${token}`
  }
}
let res=await axios.get(`${BASE_URL}/getProfile`,headers)
console.log(res)
setUser(res.data.user)
setLoading(false)
}catch(e){

}
  }

  return (
    <div className="w-full relative">
      {/* Header with glassmorphic effect */}
      <div className="relative bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            
            {/* Logo Section */}
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer" onClick={() => window.location.href = '/'}>
                <img 
                  src="Logo.png" 
                  className="relative w-16 h-16 lg:w-20 lg:h-20 object-cover transition-all duration-300 hover:scale-110" 
                  alt="Logo"
                />
              </div>
              
              {/* Navigation Links */}
              <nav className="hidden md:flex items-center gap-2 lg:gap-3">
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-4 py-2 text-sm lg:text-base font-semibold text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 relative group"
                >
                  <span className="relative z-10">Play Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </button>

                <button
                  onClick={() => window.location.href = '/cardgame'}
                  className="px-4 py-2 text-sm lg:text-base font-semibold text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 relative group"
                >
                  <span className="relative z-10">Card Game</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </button>

                <button
                  onClick={() => window.location.href = '/announcements'}
                  className="px-4 py-2 text-sm lg:text-base font-semibold text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 relative group"
                >
                  <span className="relative z-10">Announcements</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </button>

                <button
                  onClick={() => window.location.href = 'https://discord.gg/77FCC4wqYx'}
                  className="px-4 py-2 text-sm lg:text-base font-semibold text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 relative group flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  <span className="relative z-10">Discord</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </button>

                {!localStorage.getItem('token') && (
                  <button
                    onClick={() => window.location.href = '/signin'}
                    className="ml-2 px-5 py-2 text-sm lg:text-base font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50 transform hover:scale-105"
                  >
                    Login
                  </button>
                )}
              </nav>
            </div>

            {/* User Profile Section */}
            {isLoggedIn && (
              <div className="relative">
                <div 
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={toggleMenu}
                >
                  {loading ? (
                    <FadeLoader	
                      color="#3b82f6"
                      loading={loading}
                      cssOverride={override}
                      size={35}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 blur-sm transition duration-300"></div>
                        <img
                          src={user?.avatar} 
                          alt="User Avatar"
                          className="relative w-10 h-10 rounded-full border-2 border-white/20 object-cover"
                        />
                      </div>
                      
                      {/* User Info */}
                      <div className="hidden lg:flex flex-col">
                        <span className="text-white font-bold text-sm">{user?.userName}</span>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-white/70">
                            W: <span className="text-emerald-400 font-bold">
                              {user?.recentMatchHistory?.filter(u=>u.winBy==user._id && u?.counted===true)?.length || 0}
                            </span>
                          </span>
                          <span className="text-white/70">
                            L: <span className="text-red-400 font-bold">
                              {user?.recentMatchHistory?.filter(u=>u?.winBy && u.winBy!=user._id && u?.counted===true)?.length || 0}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Dropdown Arrow */}
                      <svg 
                        className={`w-4 h-4 text-white/70 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800/98 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-slide-down">
                    <ul className="py-2">
                      <Link 
                        className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer" 
                        to="/profile"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-semibold">Profile</span>
                      </Link>
                      <li 
                        className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-red-500/20 transition-all duration-200 cursor-pointer border-t border-white/5" 
                        onClick={handleAuth}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="font-semibold">Logout</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            {!isLoggedIn && (
              <button
                onClick={() => window.location.href = '/signin'}
                className="md:hidden px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap gap-2">
          <button
            onClick={() => window.location.href = '/'}
            className="px-3 py-1.5 text-xs font-semibold text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300"
          >
            Play Now
          </button>
          <button
            onClick={() => window.location.href = '/cardgame'}
            className="px-3 py-1.5 text-xs font-semibold text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300"
          >
            Card Game
          </button>
          <button
            onClick={() => window.location.href = '/announcements'}
            className="px-3 py-1.5 text-xs font-semibold text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300"
          >
            Announcements
          </button>
          <button
            onClick={() => window.location.href = 'https://discord.gg/77FCC4wqYx'}
            className="px-3 py-1.5 text-xs font-semibold text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300"
          >
            Discord
          </button>
        </nav>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from { 
            opacity: 0; 
            transform: translateY(-8px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}