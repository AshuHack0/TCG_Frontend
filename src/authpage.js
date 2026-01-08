import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useDiscordLogin } from "react-discord-login";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_URL } from "./baseurl";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import "./AuthPage.css";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const panelVariants = {
  hidden: { opacity: 0, x: -50, scale: 0.9 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      mass: 1,
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 12,
      delay: 0.2,
    },
  },
};

const logoVariants = {
  hidden: { opacity: 0, scale: 0.5, y: -30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 12,
      mass: 0.8,
    },
  },
};

const taglineVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      delay: 0.4,
    },
  },
};

const loginPanelVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 15,
      delay: 0.6,
    },
  },
};

const buttonVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: { scale: 0.98 },
};

const AuthPage = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const discordLoginParams = {
    clientId: "1353009606363709480",
    redirectUri: `${window.location.origin}/signin`,
    responseType: "token",
    scopes: ["identify", "email"],
    onSuccess: (response) => {
      console.log("res", response);
      let avatar = `https://cdn.discordapp.com/avatars/${response.user.id}/${response.avatar}.png`;
      let data = {
        userName: response.user.username,
        avatar,
        email: response.user.email,
      };
      authenticate(data, true);
    },
    onFailure: (error) => {
      console.error("Login failed:", error);
      setIsAuthenticating(false);
      toast.error("Discord login failed. Please try again.", {
        containerId: "authPage",
      });
    },
  };

  const authenticate = async (data, login) => {
    setIsAuthenticating(true);
    console.log(data);
    try {
      if (login) {
        let res = await axios.post(`${BASE_URL}/login`, data);
        toast.success(res.data.message, { containerId: "authPage" });
        console.log(res);
        localStorage.setItem("token", res.data.token);
        setTimeout(() => {
          window.location.href = "/";
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
        toast.error("Something went wrong. Please try again.", {
          containerId: "authPage",
        });
      }
    }
  };

  const { buildUrl, isLoading } = useDiscordLogin(discordLoginParams);

  useEffect(() => {
    // Prevent scrolling only on desktop (lg and above), but always prevent horizontal scrolling
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflowY = "auto";
        document.body.style.overflowX = "hidden";
      }
    };

    // Always prevent horizontal scrolling
    document.body.style.overflowX = "hidden";

    // Set initial state
    handleResize();

    // Listen for resize events
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "unset";
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <ToastContainer
        containerId="authPage"
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        className="!top-4 sm:!top-6"
        toastClassName="!text-sm sm:!text-base"
      />
      <motion.div
        className="min-h-screen lg:h-screen bg-gray-800 flex flex-col lg:flex-row overflow-y-auto overflow-x-hidden lg:overflow-hidden"
        initial="hidden"
        animate="visible"
      >
        {/* Left Section - Descriptive Panels */}
        <motion.div
          className="w-full lg:w-1/2 p-3 sm:p-4 md:p-6 lg:p-6 xl:p-8 flex flex-col justify-center lg:justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 overflow-y-auto overflow-x-hidden lg:overflow-hidden"
          variants={containerVariants}
        >
          {/* Panel 1: Discover and collect - Light Blue Background */}
          <motion.div
            className="bg-[#a8d5e2] rounded-lg p-2 sm:p-3 md:p-4 border-2 border-black flex-1 flex flex-col"
            variants={panelVariants}
            whileHover={{
              scale: 1.02,
              boxShadow:
                "0 20px 25px -5px rgba(168, 213, 226, 0.4), 0 10px 10px -5px rgba(168, 213, 226, 0.2)",
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
          >
            <div className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-3 flex-1">
              <motion.div
                className="flex-shrink-0 w-full sm:w-[40%] lg:w-[35%] h-32 sm:h-36 md:h-40 lg:h-full lg:max-h-48 bg-white rounded-lg flex items-center justify-center border-2 border-black overflow-hidden"
                variants={imageVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src="/Screenshot1.png"
                  alt="Discover and collect"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              </motion.div>
              <motion.div
                className="flex-1 min-w-0 flex flex-col"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              >
                <motion.h3
                  className="auth-panel-heading text-black text-sm sm:text-base md:text-lg mb-1 sm:mb-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                >
                  Discover and collect
                </motion.h3>
                <motion.p
                  className="auth-panel-text text-black text-[10px] sm:text-xs md:text-xs leading-tight sm:leading-relaxed flex-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                >
                  Discover and collect unique digital cards tied to the indie
                  games we host. Cardpon's digital collectibles are designed to
                  spotlight indie creators, create collectible economies, and
                  give players a reason to return beyond matches: trade, flex,
                  and complete your collections as new games join the shop.
                </motion.p>
              </motion.div>
            </div>
          </motion.div>

          {/* Panel 2: Play the physical game - Light Yellow Background */}
          <motion.div
            className="bg-[#f7e98e] rounded-lg p-2 sm:p-3 md:p-4 border-2 border-black flex-1 flex flex-col"
            variants={panelVariants}
            whileHover={{
              scale: 1.02,
              boxShadow:
                "0 20px 25px -5px rgba(247, 233, 142, 0.4), 0 10px 10px -5px rgba(247, 233, 142, 0.2)",
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
          >
            <div className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-3 flex-1">
              <motion.div
                className="flex-shrink-0 w-full sm:w-[40%] lg:w-[35%] h-32 sm:h-36 md:h-40 lg:h-full lg:max-h-48 bg-white rounded-lg flex items-center justify-center border-2 border-black overflow-hidden"
                variants={imageVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src="/Screenshot2.png"
                  alt="Play the physical game"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              </motion.div>
              <motion.div
                className="flex-1 min-w-0 flex flex-col"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              >
                <motion.h3
                  className="auth-panel-heading text-black text-sm sm:text-base md:text-lg mb-1 sm:mb-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                >
                  Play the physical game you love
                </motion.h3>
                <motion.p
                  className="auth-panel-text text-black text-[10px] sm:text-xs md:text-xs leading-tight sm:leading-relaxed flex-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                >
                  Play the physical game you love with real opponents from
                  anywhere. Cardpon provides automatic matchmaking and a
                  standardized remote setup (top-down webcam, clear zones,
                  on-camera shuffles) so matches are fair, transparent, and
                  tournament-ready. Matches can be streamed or recorded for
                  creators and community content; players get instant, ranked
                  play with no local-store requirement.
                </motion.p>
              </motion.div>
            </div>
          </motion.div>

          {/* Panel 3: Rise through ladders - Light Pink Background */}
          <motion.div
            className="bg-[#f5c2c7] rounded-lg p-2 sm:p-3 md:p-4 border-2 border-black flex-1 flex flex-col"
            variants={panelVariants}
            whileHover={{
              scale: 1.02,
              boxShadow:
                "0 20px 25px -5px rgba(245, 194, 199, 0.4), 0 10px 10px -5px rgba(245, 194, 199, 0.2)",
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
          >
            <div className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-3 flex-1">
              <motion.div
                className="flex-shrink-0 w-full sm:w-[40%] lg:w-[35%] h-32 sm:h-36 md:h-40 lg:h-full lg:max-h-48 bg-white rounded-lg flex items-center justify-center border-2 border-black overflow-hidden"
                variants={imageVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src="/Screenshot3.png"
                  alt="Rise through ladders"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              </motion.div>
              <motion.div
                className="flex-1 min-w-0 flex flex-col"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              >
                <motion.h3
                  className="auth-panel-heading text-black text-sm sm:text-base md:text-lg mb-1 sm:mb-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                >
                  Rise through ladders
                </motion.h3>
                <motion.p
                  className="auth-panel-text text-black text-[10px] sm:text-xs/2 md:text-xs leading-tight  sm:leading-relaxed flex-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                >
                  Rise through ladders, seasonal leaderboards, and tournaments
                  to become a Cardpon champion. Every match updates your stats
                  and rank; seasonal resets and badges keep competition fresh.
                  Free players can jump in (limited concurrent slots), while
                  subscribers skip queue and enjoy priority access – all built
                  to reward active competitors, spotlight top players, and give
                  indie developers real players and publicity.
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Section - Logo, Tagline, and Login */}
        <motion.div
          className="w-full lg:w-1/2 p-3 sm:p-4 md:p-6 lg:p-6 xl:p-8 flex flex-col justify-center items-center bg-black m-2 sm:m-4 md:m-6 lg:m-8 xl:m-10 rounded-2xl sm:rounded-3xl md:rounded-[40px] lg:rounded-[60px] xl:rounded-[100px] shadow-2xl shadow-white/20 overflow-y-auto overflow-x-hidden lg:overflow-hidden"
          initial="hidden"
          animate="visible"
        >
          {/* CARDPON Logo */}
          <motion.div
            className="mb-2 sm:mb-3 md:mb-4 lg:mb-6 text-center"
            variants={logoVariants}
          >
            <motion.div
              className="relative inline-block"
              whileHover={{
                scale: 1.05,
                rotate: -2,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 10,
                },
              }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <img
                src="/Logo.png"
                alt="CARDPON Logo"
                className="h-[120px] sm:h-[130px] md:h-[140px] lg:h-[200px] xl:h-[230px] mb-2 sm:mb-3 mx-auto object-contain"
                loading="eager"
              />
            </motion.div>
            <motion.p
              className="text-[#2cac4f] text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl italic mt-1 sm:mt-2 px-2"
              style={{
                fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive",
              }}
              variants={taglineVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              Collect. Connect. Play.
            </motion.p>
          </motion.div>

          {/* Login Panel */}
          <motion.div
            className="bg-white rounded-lg shadow-2xl p-3 sm:p-4 md:p-4 lg:p-4 w-full max-w-md mx-2"
            variants={loginPanelVariants}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.h2
              className="auth-heading text-base sm:text-lg md:text-xl lg:text-2xl text-center mb-3 sm:mb-4 md:mb-5 lg:mb-6 text-gray-800"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
            >
              Login
            </motion.h2>
            <motion.button
              onClick={() => {
                if (!isLoading && !isAuthenticating) {
                  window.location.href = buildUrl();
                }
              }}
              disabled={isLoading || isAuthenticating}
              type="button"
              className="auth-button w-full bg-[#5865F2] text-white py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 rounded-lg text-xs sm:text-sm md:text-base
                       hover:bg-[#4752C4] active:bg-[#3c45a5]
                       focus:outline-none focus:ring-2 focus:ring-[#5865F2] focus:ring-offset-2
                       flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Login with Discord"
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              {isLoading || isAuthenticating ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z" />
                  </svg>
                  <span className="whitespace-nowrap">Login with Discord</span>
                </>
              )}
            </motion.button>
            <motion.p
              className="auth-helper-text text-center mt-2 sm:mt-3 md:mt-4 text-gray-600 text-[10px] sm:text-xs md:text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 200 }}
            >
              Not registered?{" "}
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  className="auth-link text-[#2cac4f] cursor-pointer hover:underline transition-colors duration-200 hover:text-[#228B3A]"
                  to="/signup"
                  aria-label="Go to sign up page"
                >
                  Sign up
                </Link>
              </motion.span>
            </motion.p>
          </motion.div>

          {/* Footer Text */}
          <motion.p
            className="auth-footer-text mt-2 sm:mt-3 md:mt-4 lg:mt-5 text-gray-400 text-[9px] sm:text-[10px] md:text-xs text-center max-w-md leading-tight sm:leading-relaxed px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, type: "spring", stiffness: 100 }}
          >
            We chose to integrate exclusively with Discord Login (OAuth 2.0) to
            build our community and game platform on a foundation of safety,
            security, and integrity. Your protection is our top priority, and
            Discord provides layers of defense we believe are essential.
          </motion.p>
        </motion.div>
      </motion.div>
    </>
  );
};

export default AuthPage;
