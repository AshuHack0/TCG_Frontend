import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/header';
import { useContext } from 'react';
import {useNavigate} from 'react-router-dom'
import { useEffect } from 'react';
import { socketContext } from './socketContext';
import axios from 'axios';
import { BASE_URL } from './baseurl';

function App() {
  const [selectedTCG, setSelectedTCG] = useState('');
  const [selectedGamemode, setSelectedGamemode] = useState('');
  const [isTCGDropdownOpen, setIsTCGDropdownOpen] = useState(false);
  const [isGamemodeDropdownOpen, setIsGamemodeDropdownOpen] = useState(false);
  const [tcgOptions, settcgOptions] = useState([])
  const {socketRef, profile} = useContext(socketContext)

 

  const gamemodeOptions = ['Casual', 'Rank'];

  const handleTCGSelect = (option) => {
    setSelectedTCG(option?.name);
    setIsTCGDropdownOpen(false);
  };

  const handleGamemodeSelect = (option) => {
    setSelectedGamemode(option);
    setIsGamemodeDropdownOpen(false);
  };

  useEffect(()=>{
window.scrollTo(0,0)
  },[])


useEffect(()=>{
getMatches();
},[])

useEffect(()=>{
if(profile){
  console.log("PROFILE")
  console.log(profile)
}
},[profile])

useEffect(()=>{
  console.log(socketRef.current)
if(socketRef?.current){
  socketRef?.current?.on("newGame",(data)=>{
    console.log("newGame")
   settcgOptions((prev)=>{
    let old=prev;
if(old.length>0){
  old=[...old,data]
}else{
  old=[data]
}
return old
   })
  })

  socketRef?.current?.on("updateGameStatus",(data)=>{
console.log("UPDATE GAME STATUS")
console.log(data)
    settcgOptions((prev)=>{
      let old=prev;
  let findIndex=old.findIndex(u=>u?._id==data.id)

  old[findIndex]={
    ...old[findIndex],
    status:data.status
  
}
return old
     })

  })

  socketRef?.current?.on("deleteGame",(data)=>{
    console.log("DELETE GAME")
    console.log(data)
    settcgOptions((prev)=>{
      let old=prev;
      let findIndex=old.findIndex(u=>u._id==data)
      delete old[findIndex]
      return old
    })
  })
}

},[socketRef?.current])

const getMatches=async()=>{
  try{
let response=await axios.get(`${BASE_URL}/get-activegames`)
console.log("ACTIVE")
console.log(response.data)
settcgOptions(response.data.games)
  }catch(e){

  }
}



const navigate=useNavigate();

const searchMatch=()=>{
  if(selectedTCG.length==0){
    alert("Please select TCG")
    return
  }else if(selectedGamemode.length==0){
    alert("Please select game mode")
    return
  }

  navigate(`/match?tch=${selectedTCG}&mode=${selectedGamemode}`)  

}

  return (
    <div className='w-full min-h-screen bg-gray-800 relative overflow-hidden'>
      {/* Header - stays on top */}
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

      {/* Main content - above background */}
      <div className='relative z-10 w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-20'>
        
        {/* Compact Header Badge */}
        <div className='flex justify-center mb-6 sm:mb-8 animate-bounce-in'>
          <div className='inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#2cac4f] rounded-full border-2 border-black shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 animate-glow'>
            <div className='relative'>
              <div className='w-2 h-2 bg-white rounded-full animate-ping absolute'></div>
              <div className='w-2 h-2 bg-white rounded-full animate-pulse'></div>
            </div>
            <span className='text-xs sm:text-sm font-bold text-white'>
              {tcgOptions?.filter(u => u?.status === "ACTIVE")?.length || 0} Active Matches
            </span>
          </div>
        </div>

        {/* Main Compact Hero Title */}
        <div className='text-center mb-8 sm:mb-10 md:mb-12 animate-title-entrance px-2'>
          <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-2 sm:mb-3 tracking-tight leading-tight'>
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#2cac4f] via-[#ffc845] to-[#ff6b9d] animate-gradient-flow animate-text-shimmer'>
              Find Your Match
            </span>
          </h1>
          <p className='text-gray-300 text-xs sm:text-sm md:text-base font-medium px-4 animate-fade-in-delayed-long'>Choose your game, select mode, and start playing</p>
        </div>

        {/* Main Compact Selection Container */}
        <div className='max-w-4xl mx-auto mb-6 sm:mb-8 animate-fade-in-up animation-delay-100'>
          <div className='relative group'>
            {/* Main card with hover effect */}
            <div className='bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border-2 border-black shadow-2xl transition-all duration-300 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1'>
              
              {/* Selection Grid */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6'>
                
                {/* TCG Selection - Compact */}
                <div className='relative group/item animate-slide-in-left animation-delay-200'>
                  <div className='flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3'>
                    <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#2cac4f] border-2 border-black flex items-center justify-center shadow-lg transition-all duration-300 group-hover/item:rotate-12 group-hover/item:scale-110'>
                      <svg className='w-4 h-4 sm:w-5 sm:h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
                      </svg>
                    </div>
                    <div>
                      <h3 className='text-sm sm:text-base font-bold text-black'>Trading Card Game</h3>
                      <p className='text-[10px] sm:text-xs text-gray-600'>Select your TCG</p>
                    </div>
                  </div>
                  
                  <div className='relative'>
                    <div
              onClick={() => setIsTCGDropdownOpen(!isTCGDropdownOpen)}
                      className='w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-[#2cac4f] hover:bg-[#259741] rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 flex justify-between items-center border-2 border-black shadow-lg group/select active:scale-95'
                    >
                      <span className='text-white font-semibold text-xs sm:text-sm truncate'>
                        {selectedTCG || 'Choose TCG'}
                      </span>
                      <svg
                        className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-white transition-transform duration-300 ${isTCGDropdownOpen ? 'rotate-180' : ''} group-hover/select:scale-110`}
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path fillRule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clipRule='evenodd' />
              </svg>
            </div>
                    
            {isTCGDropdownOpen && (
                      <div className='absolute top-full left-0 right-0 mt-2 bg-white border-2 border-black rounded-lg sm:rounded-xl shadow-2xl z-50 overflow-hidden animate-slide-down max-h-40 sm:max-h-48 overflow-y-auto custom-scrollbar'>
                        {tcgOptions?.filter(u => u?.status === "ACTIVE")?.length > 0 ? (
                          tcgOptions?.filter(u => u?.status === "ACTIVE")?.map((option, index) => (
                  <div
                    key={index}
                              className='px-3 sm:px-4 py-2 sm:py-2.5 text-black text-xs sm:text-sm font-medium hover:bg-[#2cac4f] hover:text-white cursor-pointer transition-all duration-150 border-b border-gray-200 last:border-b-0 active:scale-95'
                    onClick={() => handleTCGSelect(option)}
                  >
                    {option?.name}
                  </div>
                          ))
                        ) : (
                          <div className='px-3 sm:px-4 py-2 sm:py-2.5 text-center text-gray-500 text-xs sm:text-sm'>No active games</div>
                        )}
              </div>
            )}
          </div>
                </div>

                {/* Gamemode Selection - Compact */}
                <div className='relative group/item animate-slide-in-right animation-delay-300'>
                  <div className='flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3'>
                    <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#2cac4f] border-2 border-black flex items-center justify-center shadow-lg transition-all duration-300 group-hover/item:rotate-12 group-hover/item:scale-110'>
                      <svg className='w-4 h-4 sm:w-5 sm:h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z' />
                      </svg>
                    </div>
                    <div>
                      <h3 className='text-sm sm:text-base font-bold text-black'>Game Mode</h3>
                      <p className='text-[10px] sm:text-xs text-gray-600'>Choose play style</p>
                    </div>
          </div>

                  <div className='relative'>
            <div
              onClick={() => setIsGamemodeDropdownOpen(!isGamemodeDropdownOpen)}
                      className='w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-[#2cac4f] hover:bg-[#259741] rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 flex justify-between items-center border-2 border-black shadow-lg group/select active:scale-95'
                    >
                      <span className='text-white font-semibold text-xs sm:text-sm truncate'>
                        {selectedGamemode || 'Choose Mode'}
                      </span>
                      <svg
                        className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-white transition-transform duration-300 ${isGamemodeDropdownOpen ? 'rotate-180' : ''} group-hover/select:scale-110`}
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path fillRule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clipRule='evenodd' />
              </svg>
            </div>
                    
            {isGamemodeDropdownOpen && (
                      <div className='absolute top-full left-0 right-0 mt-2 bg-white border-2 border-black rounded-lg sm:rounded-xl shadow-2xl z-50 overflow-hidden animate-slide-down'>
                {gamemodeOptions.map((option, index) => (
                  <div
                    key={index}
                            className='px-3 sm:px-4 py-2 sm:py-2.5 text-black text-xs sm:text-sm font-medium hover:bg-[#2cac4f] hover:text-white cursor-pointer transition-all duration-150 border-b border-gray-200 last:border-b-0 active:scale-95'
                    onClick={() => handleGamemodeSelect(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
                </div>
              </div>

              {/* Divider */}
              <div className='relative h-px bg-gray-300 my-4 sm:my-6'></div>

              {/* Search Button - Full Width */}
              <button
                onClick={searchMatch}
                className='w-full px-4 sm:px-6 py-3 sm:py-4 bg-black hover:bg-gray-900 rounded-lg sm:rounded-xl flex items-center justify-center gap-2 sm:gap-3 transform hover:scale-[1.05] hover:-translate-y-2 active:scale-95 transition-all duration-300 border-2 border-black shadow-lg hover:shadow-[6px_6px_0px_0px_rgba(44,172,79,1)] animate-button-pulse group relative overflow-hidden'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-[#2cac4f]/20 via-[#ffc845]/20 to-[#ff6b9d]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer'></div>
                <svg className='w-5 h-5 sm:w-6 sm:h-6 text-white relative z-10 group-hover:rotate-12 transition-transform duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                </svg>
                <span className='text-base sm:text-lg md:text-xl font-black text-white tracking-wide relative z-10'>SEARCH FOR GAME</span>
                <svg className='w-4 h-4 sm:w-5 sm:h-5 text-white relative z-10 group-hover:translate-x-2 transition-transform duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M13 7l5 5m0 0l-5 5m5-5H6' />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Game Rules Section */}
        <div className='max-w-6xl mx-auto mb-6 sm:mb-8'>
          {/* Camera Setup Images with Animation */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6'>
            <div className='bg-white rounded-2xl p-4 border-2 border-black overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-1 animate-fade-in-up group'>
              <div className='overflow-hidden rounded-lg border-2 border-black'>
                <img 
                  src='/asf.png' 
                  alt='Stream Output - Top-down view setup' 
                  className='w-full h-auto transition-transform duration-500 group-hover:scale-110'
                />
              </div>
              <p className='text-center text-sm font-bold text-black mt-3 group-hover:text-[#2cac4f] transition-colors duration-300'>Stream Output: Top-Down View</p>
            </div>
            <div className='bg-white rounded-2xl p-4 border-2 border-black overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-1 animate-fade-in-up animation-delay-200 group'>
              <div className='overflow-hidden rounded-lg border-2 border-black'>
                <img 
                  src='/asdfa].png' 
                  alt='Camera setup with articulated arm mount' 
                  className='w-full h-auto transition-transform duration-500 group-hover:scale-110'
                />
              </div>
              <p className='text-center text-sm font-bold text-black mt-3 group-hover:text-[#2cac4f] transition-colors duration-300'>Recommended Camera Setup</p>
            </div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
            
            {/* Camera Setup & Match Integrity */}
            <div className='bg-[#a8d5e2] rounded-2xl p-4 sm:p-6 border-2 border-black transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 animate-fade-in-up animation-delay-400'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center border-2 border-black'>
                  <svg className='w-5 h-5 sm:w-6 sm:h-6 text-black' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' />
                  </svg>
                </div>
                <h3 className='text-lg sm:text-xl font-bold text-black'>Camera Setup & Rules</h3>
              </div>
              
              <div className='space-y-3 sm:space-y-4'>
                <div>
                  <h4 className='text-sm sm:text-base font-semibold text-black mb-2'>Camera Setup</h4>
                  <ul className='space-y-1.5 text-xs sm:text-sm text-gray-800 pl-4'>
                    <li className='flex items-start gap-2'>
                      <span className='text-black mt-1'>•</span>
                      <span>Top-down camera must show entire playfield</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-black mt-1'>•</span>
                      <span>Hands must stay visible when touching cards</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-black mt-1'>•</span>
                      <span>No off-camera actions</span>
                    </li>
                  </ul>
                </div>
                
                <div className='h-px bg-black/20'></div>
                
                <div>
                  <h4 className='text-sm sm:text-base font-semibold text-black mb-2'>Visibility & Lighting</h4>
                  <ul className='space-y-1.5 text-xs sm:text-sm text-gray-800 pl-4'>
                    <li className='flex items-start gap-2'>
                      <span className='text-black mt-1'>•</span>
                      <span>All cards must be readable with steady lighting</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-black mt-1'>•</span>
                      <span>Recommended to use a stable camera mount</span>
                    </li>
                  </ul>
                </div>
                
                <div className='h-px bg-black/20'></div>
                
                <div>
                  <h4 className='text-sm sm:text-base font-semibold text-black mb-2'>Match Integrity</h4>
                  <ul className='space-y-1.5 text-xs sm:text-sm text-gray-800 pl-4'>
                    <li className='flex items-start gap-2'>
                      <span className='text-black mt-1'>•</span>
                      <span>No coaching, hidden screens, or extra help</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-black mt-1'>•</span>
                      <span>Report match results honestly</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-black mt-1'>•</span>
                      <span>Intentional disconnects or cheating will result in penalties</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Fair Play & Conduct */}
            <div className='bg-[#ffc845] rounded-2xl p-4 sm:p-6 border-2 border-black transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 animate-fade-in-up animation-delay-600'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center border-2 border-black'>
                  <svg className='w-5 h-5 sm:w-6 sm:h-6 text-black' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' />
                  </svg>
                </div>
                <h3 className='text-lg sm:text-xl font-bold text-black'>Fair Play & Conduct</h3>
              </div>
              
              <div className='space-y-3 sm:space-y-4'>
                <div>
                  <h4 className='text-sm sm:text-base font-semibold text-black mb-2'>Fair Play</h4>
                  <ul className='space-y-1.5 text-xs sm:text-sm text-gray-800 pl-4'>
                    <li className='flex items-start gap-2'>
                      <span className='text-black mt-1'>•</span>
                      <span>Shuffle and draw on camera only</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-black mt-1'>•</span>
                      <span>No pausing or moving the camera during gameplay unless agreed</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-black mt-1'>•</span>
                      <span>Announce all actions out loud</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-black mt-1'>•</span>
                      <span>You may use your second hand to cover the view of the cards in your first hand from the camera</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-black mt-1'>•</span>
                      <span>If you are using the optional facecam, you may just keep cards in facecam view while in-hand, and on the table when not in-use</span>
                    </li>
                  </ul>
                </div>
                
                <div className='h-px bg-black/20'></div>
                
                <div>
                  <h4 className='text-sm sm:text-base font-semibold text-black mb-2'>Conduct</h4>
                  <ul className='space-y-1.5 text-xs sm:text-sm text-gray-800 pl-4'>
                    <li className='flex items-start gap-2'>
                      <span className='text-black mt-1'>•</span>
                      <span>Be respectful! No harassment or arguing</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-black mt-1'>•</span>
                      <span>If a dispute occurs, pause and contact a Cardpon judge</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights - Compact */}
        <div className='max-w-4xl mx-auto'>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4'>
            <div className='bg-[#a8d5e2] rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-black transition-all duration-300 hover:transform hover:scale-110 hover:-translate-y-2 hover:shadow-xl hover:rotate-2 active:scale-95 animate-fade-in-up animation-delay-800'>
              <div className='flex flex-col items-center gap-1.5 sm:gap-2'>
                <div className='w-8 h-8 sm:w-10 sm:h-10 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-lg'>
                  <svg className='w-4 h-4 sm:w-5 sm:h-5 text-black' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                  </svg>
                </div>
                <div className='text-center'>
                  <div className='text-sm sm:text-base md:text-lg font-black text-black'>Fast</div>
                  <div className='text-[9px] sm:text-[10px] text-gray-700 font-medium hidden sm:block'>Instant</div>
                </div>
              </div>
            </div>

            <div className='bg-[#ffc845] rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-black transition-all duration-300 hover:transform hover:scale-110 hover:-translate-y-2 hover:shadow-xl hover:rotate-2 active:scale-95 animate-fade-in-up animation-delay-1000'>
              <div className='flex flex-col items-center gap-1.5 sm:gap-2'>
                <div className='w-8 h-8 sm:w-10 sm:h-10 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-lg'>
                  <svg className='w-4 h-4 sm:w-5 sm:h-5 text-black' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' />
                  </svg>
                </div>
                <div className='text-center'>
                  <div className='text-sm sm:text-base md:text-lg font-black text-black'>Live</div>
                  <div className='text-[9px] sm:text-[10px] text-gray-700 font-medium hidden sm:block'>Players</div>
                </div>
              </div>
            </div>

            <div className='bg-[#2cac4f] rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-black transition-all duration-300 hover:transform hover:scale-110 hover:-translate-y-2 hover:shadow-xl hover:rotate-2 active:scale-95 animate-fade-in-up animation-delay-1200'>
              <div className='flex flex-col items-center gap-1.5 sm:gap-2'>
                <div className='w-8 h-8 sm:w-10 sm:h-10 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-lg'>
                  <svg className='w-4 h-4 sm:w-5 sm:h-5 text-black' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
                  </svg>
                </div>
                <div className='text-center'>
                  <div className='text-sm sm:text-base md:text-lg font-black text-white'>Safe</div>
                  <div className='text-[9px] sm:text-[10px] text-white/90 font-medium hidden sm:block'>Secure</div>
                </div>
              </div>
            </div>

            <div className='bg-[#ff6b9d] rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-black transition-all duration-300 hover:transform hover:scale-110 hover:-translate-y-2 hover:shadow-xl hover:rotate-2 active:scale-95 animate-fade-in-up animation-delay-1400'>
              <div className='flex flex-col items-center gap-1.5 sm:gap-2'>
                <div className='w-8 h-8 sm:w-10 sm:h-10 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-lg'>
                  <svg className='w-4 h-4 sm:w-5 sm:h-5 text-black' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                </div>
                <div className='text-center'>
                  <div className='text-sm sm:text-base md:text-lg font-black text-white'>Fun</div>
                  <div className='text-[9px] sm:text-[10px] text-white/90 font-medium hidden sm:block'>Epic</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translate(0, 0) scale(1); 
          }
          33% { 
            transform: translate(30px, -30px) scale(1.1); 
          }
          66% { 
            transform: translate(-30px, 30px) scale(0.9); 
          }
        }
        
        @keyframes float-slow {
          0%, 100% { 
            transform: translate(0, 0) scale(1); 
          }
          50% { 
            transform: translate(50px, -30px) scale(1.1); 
          }
        }
        
        @keyframes float-slower {
          0%, 100% { 
            transform: translate(0, 0) scale(1.05); 
          }
          50% { 
            transform: translate(-40px, 40px) scale(1); 
          }
        }
        
        @keyframes float-reverse {
          0%, 100% { 
            transform: translate(0, 0) scale(1); 
          }
          50% { 
            transform: translate(30px, 50px) scale(1.08); 
          }
        }
        
        @keyframes particle-float-1 {
          0%, 100% { 
            transform: translate(0, 0); 
            opacity: 0.3;
          }
          50% { 
            transform: translate(100px, -100px); 
            opacity: 1;
          }
        }
        
        @keyframes particle-float-2 {
          0%, 100% { 
            transform: translate(0, 0); 
            opacity: 0.3;
          }
          50% { 
            transform: translate(-80px, 80px); 
            opacity: 1;
          }
        }
        
        @keyframes particle-float-3 {
          0%, 100% { 
            transform: translate(0, 0); 
            opacity: 0.3;
          }
          50% { 
            transform: translate(60px, -120px); 
            opacity: 1;
          }
        }
        
        @keyframes particle-float-4 {
          0%, 100% { 
            transform: translate(0, 0); 
            opacity: 0.3;
          }
          50% { 
            transform: translate(-90px, -60px); 
            opacity: 1;
          }
        }
        
        @keyframes bounce-in {
          0% { 
            transform: scale(0); 
            opacity: 0;
          }
          50% { 
            transform: scale(1.1); 
          }
          100% { 
            transform: scale(1); 
            opacity: 1;
          }
        }
        
        @keyframes title-entrance {
          0% { 
            opacity: 0; 
            transform: translateY(-50px) scale(0.9); 
          }
          50% { 
            transform: translateY(10px) scale(1.02); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        @keyframes gradient-flow {
          0%, 100% { 
            background-position: 0% 50%; 
          }
          50% { 
            background-position: 100% 50%; 
          }
        }
        
        @keyframes text-shimmer {
          0% { 
            background-position: -200% center; 
          }
          100% { 
            background-position: 200% center; 
          }
        }
        
        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 5px rgba(44, 172, 79, 0.5), 0 0 10px rgba(44, 172, 79, 0.3);
          }
          50% { 
            box-shadow: 0 0 20px rgba(44, 172, 79, 0.8), 0 0 30px rgba(44, 172, 79, 0.5);
          }
        }
        
        @keyframes button-pulse {
          0%, 100% { 
            box-shadow: 0 0 0 0 rgba(44, 172, 79, 0.7);
          }
          50% { 
            box-shadow: 0 0 0 10px rgba(44, 172, 79, 0);
          }
        }
        
        @keyframes shimmer {
          0% { 
            transform: translateX(-100%); 
          }
          100% { 
            transform: translateX(100%); 
          }
        }
        
        @keyframes float-delayed {
          0%, 100% { 
            transform: translate(0, 0) scale(1); 
          }
          33% { 
            transform: translate(-40px, 40px) scale(1.05); 
          }
          66% { 
            transform: translate(40px, -40px) scale(0.95); 
          }
        }
        
        @keyframes gradient-x {
          0%, 100% { 
            background-position: 0% 50%; 
          }
          50% { 
            background-position: 100% 50%; 
          }
        }
        
        @keyframes fade-in {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes fade-in-delayed {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slide-in-left {
          from { 
            opacity: 0; 
            transform: translateX(-50px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        @keyframes slide-in-right {
          from { 
            opacity: 0; 
            transform: translateX(50px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
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
        
        @keyframes pulse-subtle {
          0%, 100% { 
            transform: scale(1); 
          }
          50% { 
            transform: scale(1.01); 
          }
        }
        
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 5s ease infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-delayed {
          animation: fade-in-delayed 0.8s ease-out 0.2s both;
        }
        
        .animate-fade-in-delayed-long {
          animation: fade-in-delayed 1s ease-out 0.5s both;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out both;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out both;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out both;
        }
        
        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }
        
        .animate-pulse-subtle {
          animation: pulse-subtle 3s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }
        
        .animate-float-slower {
          animation: float-slower 25s ease-in-out infinite;
        }
        
        .animate-float-reverse {
          animation: float-reverse 22s ease-in-out infinite;
        }
        
        .animate-particle-float-1 {
          animation: particle-float-1 8s ease-in-out infinite;
        }
        
        .animate-particle-float-2 {
          animation: particle-float-2 10s ease-in-out infinite;
        }
        
        .animate-particle-float-3 {
          animation: particle-float-3 12s ease-in-out infinite;
        }
        
        .animate-particle-float-4 {
          animation: particle-float-4 9s ease-in-out infinite;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .animate-title-entrance {
          animation: title-entrance 1s ease-out;
        }
        
        .animate-gradient-flow {
          background-size: 200% 200%;
          animation: gradient-flow 3s ease infinite;
        }
        
        .animate-text-shimmer {
          background-size: 200% auto;
          animation: text-shimmer 3s linear infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .animate-button-pulse {
          animation: button-pulse 2s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animation-delay-100 { animation-delay: 0.1s; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-800 { animation-delay: 0.8s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-1200 { animation-delay: 1.2s; }
        .animation-delay-1400 { animation-delay: 1.4s; }
        
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #2cac4f, #ffc845);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #259741, #ff6b9d);
        }
      `}</style>
    </div>
  );
}

export default App;