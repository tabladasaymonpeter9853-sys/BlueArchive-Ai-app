import React from 'react';
import TopNav from './TopNav';
import { backgrounds, logo } from '../assets';
import ShirokoPortrait from '../assets/Shiroko_Portrait.webp';

/**
 * Landing page with Blue Archive assets: campus BG, JP logo, Shiroko portrait.
 */
function LandingPage({ onStart = () => {}, onInfo = () => {}, onAbout = () => {} }) {
  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgrounds.campus})` }}
    >
      <div className="min-h-screen flex flex-col bg-slate-900/40 backdrop-blur-[2px]">
        <TopNav onHome={() => {}} onAbout={onAbout} />

        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 safe-bottom">
          <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-10">
            <div className="flex flex-col items-center md:items-start gap-4 sm:gap-6 text-center md:text-left">
              <img
                src={logo.jp}
                alt="ブルーアーカイブ"
                className="h-12 sm:h-14 md:h-16 w-auto object-contain drop-shadow-lg"
              />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-md">
                BlueArchive <span className="text-sky-300">AI</span>
              </h1>
              <p className="max-w-md text-slate-200 text-sm md:text-base drop-shadow">
                Chat with students from Kivotos. Start a session or read more about this project.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onStart}
                  className="rounded-xl bg-sky-400 hover:bg-sky-500 px-6 py-3.5 font-medium text-white shadow-lg transition active:bg-sky-600 min-h-[44px]"
                >
                  Start
                </button>
                <button
                  type="button"
                  onClick={onInfo}
                  className="rounded-xl border-2 border-sky-400 text-sky-200 hover:bg-sky-500/20 px-6 py-3.5 font-medium transition active:bg-sky-500/30 min-h-[44px]"
                >
                  Info
                </button>
              </div>
            </div>

            <div className="flex-shrink-0 w-40 h-48 sm:w-48 sm:h-56 md:w-56 md:h-72 rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl bg-slate-800/50">
              <img
                src={ShirokoPortrait}
                alt="Sunaookami Shiroko"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default LandingPage;
