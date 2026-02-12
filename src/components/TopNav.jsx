import React from 'react';

/**
 * Top navigation bar matching Blue Archive visual: light blue background, white text, Home + About.
 */
function TopNav({ onHome, onAbout }) {
  return (
    <nav className="flex items-center gap-4 sm:gap-8 px-4 sm:px-6 py-3 safe-top bg-white/15 backdrop-blur-md border-b border-white/25 shadow-lg shadow-black/10">
      <button
        type="button"
        onClick={onHome}
        className="text-gray-800 font-semibold hover:text-sky-700 transition py-2 px-3 -mx-1 rounded-lg hover:bg-white/25 active:bg-white/30 touch-target sm:min-h-0 sm:min-w-0 sm:py-0 sm:px-0 sm:-mx-0"
      >
        Home
      </button>
      <button
        type="button"
        onClick={onAbout}
        className="text-gray-800 font-semibold hover:text-sky-700 transition py-2 px-3 -mx-1 rounded-lg hover:bg-white/25 active:bg-white/30 touch-target sm:min-h-0 sm:min-w-0 sm:py-0 sm:px-0 sm:-mx-0"
      >
        About
      </button>
    </nav>
  );
}

export default TopNav;
