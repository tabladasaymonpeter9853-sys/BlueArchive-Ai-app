import React from 'react';
import TopNav from './TopNav';
import { backgrounds, logo } from '../assets';

/**
 * About page with Blue Archive assets: campus BG, JP logo, full description.
 */
function AboutPage({ onBack = () => { }, onHome, onAbout }) {
  const goHome = onHome ?? onBack;
  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgrounds.campus})` }}
    >
      <div className="min-h-screen flex flex-col bg-slate-900/50 backdrop-blur-[2px]">
        <TopNav onHome={goHome} onAbout={onAbout} />

        <main className="flex-1 px-4 sm:px-6 py-8 sm:py-10 max-w-4xl mx-auto w-full safe-bottom">
          <div className="mb-6 flex items-center gap-3 sm:gap-4">
            <img
              src={logo.jp}
              alt="ブルーアーカイブ"
              className="h-10 sm:h-12 w-auto object-contain drop-shadow-lg"
            />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-md">
              BlueArchive <span className="text-sky-300">AI</span>
            </h2>
          </div>

          <section className="rounded-2xl bg-slate-800/80 backdrop-blur border border-slate-600/80 p-4 sm:p-6 md:p-8 shadow-lg text-slate-200 space-y-4 text-sm sm:text-base">
            <h3 className="text-lg font-semibold text-white">BlueArchive-Ai</h3>
            <p>
              BlueArchive-Ai is an anime-inspired AI assistant designed with a clean, soft, blue aesthetic
              and a calm, welcoming presence. It uses modern academy-style visuals and minimal UI elements
              with expressive character design to create an approachable and immersive chat experience.
            </p>
            <p>
              Features include polished avatar-style animations, smooth chat interactions, subtle typing
              indicators, rounded message bubbles, and pastel color accents to give a student assistant vibe.
              BlueArchiveAI is built to feel like a digital companion rather than a tool, focusing on visual
              personality, expressive states, more animations, and a consistent color theme.
            </p>
            <p>
              Character personalities are based on students from the world of Blue Archive and the
              <a
                href="https://bluearchive.fandom.com/wiki/Blue_Archive_Wiki"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-300 hover:underline ml-1"
              >
                Blue Archive Wiki
              </a>
              . It is present, friendly, and ready to grow as more intelligence and features are added.
            </p>
          </section>

          <div className="mt-8">
            <button
              type="button"
              onClick={goHome}
              className="rounded-xl border-2 border-sky-400 text-sky-200 hover:bg-sky-500/20 px-5 py-3 font-medium transition active:bg-sky-500/30 min-h-[44px]"
            >
              Back Home
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AboutPage;
