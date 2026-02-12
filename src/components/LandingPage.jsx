import React from 'react';
import TopNav from './TopNav';
import { backgrounds, logo, characterPortraits } from '../assets';

const HERO_STUDENTS = [
  { key: 'Reisa', name: 'Uzawa Reisa', sub: 'Trinity • Vigilante', portrait: characterPortraits.Reisa },
  { key: 'Shiroko', name: 'Sunaookami Shiroko', sub: 'Abydos • Committee', portrait: characterPortraits.Shiroko },
  { key: 'Momoi', name: 'Saiba Momoi', sub: 'Millennium • Game Dev', portrait: characterPortraits.Momoi },
];

/**
 * Landing page: campus BG, JP logo, hero with Reisa / Shiroko / Momoi portraits.
 */
function LandingPage({ onStart = () => { }, onInfo = () => { }, onAbout = () => { } }) {
  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat ba-mesh"
      style={{ backgroundImage: `url(${backgrounds.campus})` }}
    >
      <div className="min-h-screen flex flex-col hero-overlay backdrop-blur-[3px]">
        <TopNav onHome={() => { }} onAbout={onAbout} />

        <main className="flex-1 px-4 sm:px-6 py-8 sm:py-12 safe-bottom">
          <div className="w-full max-w-6xl mx-auto space-y-6 sm:space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-12">
            <div className="flex flex-col items-center md:items-start gap-4 sm:gap-6 text-center md:text-left rounded-2xl p-6 sm:p-8 glass-panel ba-frame shadow-2xl animate-fade-in-up relative overflow-hidden">
              <div className="absolute inset-x-6 top-0 h-[2px] bg-gradient-to-r from-sky-300/0 via-sky-300/70 to-sky-300/0" />
              <img
                src={logo.jp}
                alt="ブルーアーカイブ"
                className="h-12 sm:h-14 md:h-16 w-auto object-contain drop-shadow-lg animate-fade-in-up"
              />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-md animate-fade-in-up delay-100">
                BlueArchive <span className="gradient-text">AI</span>
              </h1>
              <p className="max-w-md text-slate-200 text-sm md:text-base drop-shadow animate-fade-in-up delay-200 leading-relaxed">
                Chat with students from Kivotos. Start a session or read more about this project.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs animate-fade-in-up delay-200">
                <span className="px-3 py-1 rounded-full ba-chip text-sky-100/90">Kivotos UI</span>
                <span className="px-3 py-1 rounded-full ba-chip text-sky-100/90">Separate chats</span>
                <span className="px-3 py-1 rounded-full ba-chip text-sky-100/90">Themes + BG</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto animate-fade-in-up delay-300">
                <button
                  type="button"
                  onClick={onStart}
                  className="rounded-xl px-6 py-3.5 font-semibold text-white shadow-lg transition-all duration-200 active:scale-[0.98] min-h-[44px] send-btn-glow bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300"
                >
                  Start
                </button>
                <button
                  type="button"
                  onClick={onInfo}
                  className="rounded-xl border-2 border-sky-400/80 text-sky-200 hover:bg-sky-500/20 hover:scale-[1.03] px-6 py-3.5 font-semibold transition-all duration-200 active:bg-sky-500/30 active:scale-[0.98] min-h-[44px] hover:border-sky-300"
                >
                  Info
                </button>
              </div>
            </div>

            {/* Same hero portrait spot as before: Reisa, Shiroko, Momoi in the same design */}
            <div className="flex-shrink-0 flex gap-2 sm:gap-3 animate-fade-in-up delay-400">
              {HERO_STUDENTS.map((s) => (
                <div
                  key={s.key}
                  className="flex-shrink-0 w-28 h-36 sm:w-36 sm:h-44 md:w-40 md:h-52 lg:w-44 lg:h-64 rounded-2xl overflow-hidden border-2 border-white/40 shadow-2xl shadow-black/30 ring-4 ring-white/10 hover-lift relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none z-10" />
                  <img
                    src={s.portrait}
                    alt={s.name}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
            </div>

            {/* BA-style quick panels */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 animate-fade-in-up delay-300">
              <div className="rounded-2xl glass-panel ba-frame p-4 sm:p-5 hover-lift">
                <div className="text-xs text-slate-300 mb-1">SYSTEM</div>
                <div className="text-white font-semibold">Student Chats</div>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                  Each student has their own page—keep conversations separate.
                </p>
              </div>
              <div className="rounded-2xl glass-panel ba-frame p-4 sm:p-5 hover-lift">
                <div className="text-xs text-slate-300 mb-1">CUSTOMIZE</div>
                <div className="text-white font-semibold">Background + Scheme</div>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                  Pick a scene and a color scheme that matches your vibe.
                </p>
              </div>
              <div className="rounded-2xl glass-panel ba-frame p-4 sm:p-5 hover-lift">
                <div className="text-xs text-slate-300 mb-1">UX</div>
                <div className="text-white font-semibold">Mobile-ready UI</div>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                  Touch-friendly controls, clean layouts, and smooth motion.
                </p>
              </div>
            </section>

            {/* Roster strip (visual only) */}
            <section className="rounded-2xl glass-panel ba-frame p-4 sm:p-5 animate-fade-in-up delay-400">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <div className="text-xs text-slate-300">ROSTER</div>
                  <div className="text-white font-semibold">Available students</div>
                </div>
                <button
                  type="button"
                  onClick={onStart}
                  className="px-4 py-2 rounded-xl ba-chip text-[rgb(var(--scheme-accent))] font-semibold hover:opacity-90 transition"
                >
                  Enter Chat →
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {HERO_STUDENTS.map((c) => (
                  <div key={c.key} className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover-lift flex flex-col sm:flex-row sm:items-center gap-3 p-0">
                    <div className="w-full sm:w-20 h-28 sm:h-full min-h-[7rem] flex-shrink-0 relative overflow-hidden">
                      <img
                        src={c.portrait}
                        alt={c.name}
                        className="absolute inset-0 w-full h-full object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    </div>
                    <div className="p-3 sm:pr-4 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="text-white font-semibold truncate">{c.name}</div>
                        <span className="text-[10px] px-2 py-1 rounded-full ba-chip text-slate-100/90">
                          {c.key === 'Reisa' ? 'Justice' : c.key === 'Shiroko' ? 'Calm' : 'Creative'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 mt-1">{c.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default LandingPage;
