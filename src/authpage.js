import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useDiscordLogin } from 'react-discord-login';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL } from './baseurl';
import 'react-toastify/dist/ReactToastify.css';

const AuthPage = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const discordLoginParams = {
    clientId: '1353009606363709480',
    redirectUri: 'http://localhost:3000/signin',
    responseType: 'token',
    scopes: ['identify', 'email'],
    onSuccess: response => {
      console.log('res', response);
      let avatar = `https://cdn.discordapp.com/avatars/${response.user.id}/${response.avatar}.png`;
      let data = {
        userName: response.user.username,
        avatar,
        email: response.user.email
      };
      authenticate(data, true);
    },
    onFailure: error => {
      console.error('Login failed:', error);
      setIsAuthenticating(false);
      toast.error('Discord login failed. Please try again.', { containerId: 'authPage' });
    },
  };

  const authenticate = async (data, login) => {
    setIsAuthenticating(true);
    console.log(data);
    try {
      if (login) {
        let res = await axios.post(`${BASE_URL}/login`, data);
        toast.success(res.data.message, { containerId: 'authPage' });
        console.log(res);
        localStorage.setItem('token', res.data.token);
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        let res = await axios.post(`${BASE_URL}/register`, data);
        toast.success(res.data.message, { containerId: "authPage" });
        setIsAuthenticating(false);
      }
    } catch (e) {
      console.log("ERROR", e);
      setIsAuthenticating(false);
      if (e?.response?.data?.error) {
        toast.error(e?.response?.data?.error, { containerId: "authPage" });
      } else {
        toast.error("Something went wrong. Please try again.", { containerId: "authPage" });
      }
    }
  };

  const { buildUrl, isLoading } = useDiscordLogin(discordLoginParams);

  useEffect(() => {
    // Smooth scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <ToastContainer 
        containerId="authPage" 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className='min-h-screen bg-gray-800 flex flex-col lg:flex-row overflow-x-hidden'>
        {/* Left Section - Descriptive Panels */}
        <div className='w-full lg:w-1/2 p-6 lg:p-8 xl:p-12 flex flex-col justify-center gap-6 lg:gap-8 overflow-y-auto max-h-screen'>
          {/* Panel 1: Discover and collect - Light Blue Background */}
          <div 
            className='bg-[#a8d5e2] rounded-lg p-5 lg:p-6 border-2 border-black transition-all duration-300 hover:shadow-lg hover:shadow-[#a8d5e2]/50 hover:scale-[1.02]'
            style={{ animation: 'fadeInUp 0.6s ease-out' }}
          >
            <div className='flex flex-col sm:flex-row items-start gap-4'>
              <div className='flex-shrink-0 w-full sm:w-[45%] lg:w-[40%] h-48 sm:h-auto sm:min-h-[200px] bg-white rounded-lg flex items-center justify-center border-2 border-black overflow-hidden transition-transform duration-300 hover:scale-105'>
                <img 
                  src="/ss1.png" 
                  alt="Discover and collect" 
                  className='w-full h-full object-contain'
                  loading="lazy"
                />
              </div>
              <div className='flex-1 min-w-0'>
                <h3 className='text-black text-lg lg:text-xl font-bold mb-2 sm:mb-3'>Discover and collect</h3>
                <p className='text-black text-xs sm:text-sm leading-relaxed'>
                  Discover and collect unique digital cards tied to the indie games we host. Cardpon's digital collectibles are designed to spotlight indie creators, create collectible economies, and give players a reason to return beyond matches: trade, flex, and complete your collections as new games join the shop.
                </p>
              </div>
            </div>
          </div>

          {/* Panel 2: Play the physical game - Light Yellow Background */}
          <div 
            className='bg-[#f7e98e] rounded-lg p-5 lg:p-6 border-2 border-black transition-all duration-300 hover:shadow-lg hover:shadow-[#f7e98e]/50 hover:scale-[1.02]'
            style={{ animation: 'fadeInUp 0.8s ease-out' }}
          >
            <div className='flex flex-col sm:flex-row items-start gap-4'>
              <div className='flex-shrink-0 w-full sm:w-[45%] lg:w-[40%] h-48 sm:h-auto sm:min-h-[200px] bg-white rounded-lg flex items-center justify-center border-2 border-black overflow-hidden transition-transform duration-300 hover:scale-105'>
                <img 
                  src="/ss2.png" 
                  alt="Play the physical game" 
                  className='w-full h-full object-contain'
                  loading="lazy"
                />
              </div>
              <div className='flex-1 min-w-0'>
                <h3 className='text-black text-lg lg:text-xl font-bold mb-2 sm:mb-3'>Play the physical game you love</h3>
                <p className='text-black text-xs sm:text-sm leading-relaxed'>
                  Play the physical game you love with real opponents from anywhere. Cardpon provides automatic matchmaking and a standardized remote setup (top-down webcam, clear zones, on-camera shuffles) so matches are fair, transparent, and tournament-ready. Matches can be streamed or recorded for creators and community content; players get instant, ranked play with no local-store requirement.
                </p>
              </div>
            </div>
          </div>

          {/* Panel 3: Rise through ladders - Light Pink Background */}
          <div 
            className='bg-[#f5c2c7] rounded-lg p-5 lg:p-6 border-2 border-black transition-all duration-300 hover:shadow-lg hover:shadow-[#f5c2c7]/50 hover:scale-[1.02]'
            style={{ animation: 'fadeInUp 1s ease-out' }}
          >
            <div className='flex flex-col sm:flex-row items-start gap-4'>
              <div className='flex-shrink-0 w-full sm:w-[45%] lg:w-[40%] h-48 sm:h-auto sm:min-h-[200px] bg-white rounded-lg flex items-center justify-center border-2 border-black overflow-hidden transition-transform duration-300 hover:scale-105'>
                <img 
                  src="/ss3.png" 
                  alt="Rise through ladders" 
                  className='w-full h-full object-contain'
                  loading="lazy"
                />
              </div>
              <div className='flex-1 min-w-0'>
                <h3 className='text-black text-lg lg:text-xl font-bold mb-2 sm:mb-3'>Rise through ladders</h3>
                <p className='text-black text-xs sm:text-sm leading-relaxed'>
                  Rise through ladders, seasonal leaderboards, and tournaments to become a Cardpon champion. Every match updates your stats and rank; seasonal resets and badges keep competition fresh. Free players can jump in (limited concurrent slots), while subscribers skip queue and enjoy priority access – all built to reward active competitors, spotlight top players, and give indie developers real players and publicity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Logo, Tagline, and Login */}
        <div className='w-full lg:w-1/2 p-6 lg:p-8 xl:p-12 flex flex-col justify-center items-center bg-black m-20 rounded-[100px] shadow-2xl shadow-white/20'>
          {/* CARDPON Logo */}
          <div className='mb-6 lg:mb-8 text-center animate-fadeIn' style={{ animation: 'fadeIn 0.8s ease-out' }}>
            <div className='relative inline-block'>
              <img 
                src="/Logo.png" 
                alt="CARDPON Logo" 
                className='w-[250px] sm:w-[300px] lg:w-[350px] max-w-full mx-auto mb-4 transition-transform duration-300 hover:scale-105'
                loading="eager"
              />
            </div>
            <p 
              className='text-[#2cac4f] text-xl sm:text-2xl lg:text-3xl italic mt-2 animate-fadeIn' 
              style={{ 
                fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive",
                animation: 'fadeIn 1s ease-out 0.2s both'
              }}
            >
              Collect. Connect. Play.
            </p>
          </div>

          {/* Login Panel */}
          <div 
            className='bg-white rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-md transition-all duration-300 hover:shadow-3xl hover:shadow-white/20'
            style={{ animation: 'fadeInUp 1.2s ease-out' }}
          >
            <h2 className='text-xl sm:text-2xl font-bold text-center mb-6 text-gray-800'>Login</h2>
            <button
              onClick={() => {
                if (!isLoading && !isAuthenticating) {
                  window.location.href = buildUrl();
                }
              }}
              disabled={isLoading || isAuthenticating}
              type="button"
              className="w-full bg-[#5865F2] text-white py-3 px-4 rounded-lg font-semibold
                       hover:bg-[#4752C4] active:bg-[#3c45a5] transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-[#5865F2] focus:ring-offset-2
                       flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
                       transform hover:scale-[1.02] active:scale-[0.98]"
              aria-label="Login with Discord"
            >
              {isLoading || isAuthenticating ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z"/>
                  </svg>
                  <span>Login with Discord</span>
                </>
              )}
            </button>
            <p className='text-center mt-6 text-gray-600 text-sm'>
              Not registered?{' '}
              <Link
                className='text-[#2cac4f] cursor-pointer font-bold hover:underline transition-colors duration-200 hover:text-[#228B3A]'
                to="/signup"
                aria-label="Go to sign up page"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Footer Text */}
          <p className='mt-6 lg:mt-8 text-gray-400 text-xs sm:text-sm text-center max-w-md leading-relaxed px-4'>
            We chose to integrate exclusively with Discord Login (OAuth 2.0) to build our community and game platform on a foundation of safety, security, and integrity. Your protection is our top priority, and Discord provides layers of defense we believe are essential.
          </p>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>
    </>
  );
};

export default AuthPage;