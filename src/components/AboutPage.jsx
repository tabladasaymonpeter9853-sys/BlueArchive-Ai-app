import React from 'react';
import TopNav from './TopNav';
import { backgrounds, logo, academyLogos } from '../assets';

const ACADEMIES = [
  {
    key: 'Trinity',
    name: 'Trinity General School',
    logo: academyLogos.Trinity,
    lore: 'A prestigious academy embodying faith and order. Its students uphold tradition and justice; the Vigilante Crew and others protect the school\'s ideals. Trinity stands as one of the great powers of Kivotos.',
  },
  {
    key: 'Gehenna',
    name: 'Gehenna Academy',
    logo: academyLogos.Gehenna,
    lore: 'A chaotic academy known for freedom and rebellion. Rules are loose and clubs like the Prefect Team and Handyman 68 operate in their own style. Gehenna\'s spirit is wild and unbound.',
  },
  {
    key: 'Millennium',
    name: 'Millennium Science School',
    logo: academyLogos.Millennium,
    lore: 'A tech-focused academy driven by innovation and research. The Game Development Department and other clubs push the boundaries of science. Millennium shapes the future of Kivotos.',
  },
  {
    key: 'Abydos',
    name: 'Abydos High School',
    logo: academyLogos.Abydos,
    lore: 'A small school in the desert, struggling with debt but rich in spirit. The Countermeasures Committee fights to save their home. Abydos proves that determination can defy the odds.',
  },
  {
    key: 'Hyakkiyako',
    name: 'Hyakkiyako Academy',
    logo: academyLogos.Hyakkiyako,
    lore: 'An academy steeped in martial and cultural tradition. Its students value discipline, harmony, and the way of the warrior. Hyakkiyako guards the ancient soul of Kivotos.',
  },
  {
    key: 'Shanhaijing',
    name: 'Shanhaijing Senior Secondary School',
    logo: academyLogos.Shanhaijing,
    lore: 'A school that blends commerce and strategy. Its students are shrewd and resourceful, navigating the complex landscape of Kivotos with skill and ambition.',
  },
  {
    key: 'RedWinter',
    name: 'Red Winter Federal Academy',
    logo: academyLogos.RedWinter,
    lore: 'A military-style academy from the cold north. Discipline and loyalty define Red Winter. Its students are trained to be steadfast and formidable.',
  },
  {
    key: 'Valkyrie',
    name: 'Valkyrie Police Academy',
    logo: academyLogos.Valkyrie,
    lore: 'An academy dedicated to law and order. Valkyrie students serve as peacekeepers and investigators, upholding justice across the city.',
  },
  {
    key: 'WildHunt',
    name: 'Wild Hunt Academy',
    logo: academyLogos.WildHunt,
    lore: 'An academy of hunters and trackers. Its students thrive in the wild and the unknown, pursuing targets and protecting the borders of civilization.',
  },
];

/**
 * About / Info page: Blue Archive app description + academy logos and lore.
 */
function AboutPage({ onBack = () => { }, onHome, onAbout }) {
  const goHome = onHome ?? onBack;
  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat ba-mesh"
      style={{ backgroundImage: `url(${backgrounds.campus})` }}
    >
      <div className="min-h-screen flex flex-col hero-overlay backdrop-blur-[3px]">
        <TopNav onHome={goHome} onAbout={onAbout} />

        <main className="flex-1 px-4 sm:px-6 py-8 sm:py-10 max-w-4xl mx-auto w-full safe-bottom">
          <div className="mb-6 flex items-center gap-3 sm:gap-4 animate-fade-in-up">
            <img
              src={logo.jp}
              alt="ブルーアーカイブ"
              className="h-10 sm:h-12 w-auto object-contain drop-shadow-lg"
            />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-md">
              BlueArchive <span className="text-sky-300">AI</span>
            </h2>
          </div>

          <section className="rounded-2xl glass-panel ba-frame p-4 sm:p-6 md:p-8 shadow-2xl text-slate-200 space-y-4 text-sm sm:text-base animate-fade-in-up delay-200 card-glow">
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

          <section className="mt-8 animate-fade-in-up delay-300">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Kivotos</span>
              Academies
            </h3>
            <div className="space-y-4">
              {ACADEMIES.map((academy, i) => (
                <article
                  key={academy.key}
                  className="rounded-2xl glass-panel ba-frame p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start hover-lift"
                  style={{ animationDelay: `${300 + i * 50}ms` }}
                >
                  <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 border-white/20 bg-slate-800/50 flex items-center justify-center">
                    <img
                      src={academy.logo}
                      alt=""
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold mb-1">{academy.name}</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{academy.lore}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="mt-8 animate-fade-in-up delay-400">
            <button
              type="button"
              onClick={goHome}
              className="rounded-xl border-2 border-sky-400/80 text-sky-200 hover:bg-sky-500/20 hover:scale-[1.03] px-5 py-3 font-semibold transition-all duration-200 active:bg-sky-500/30 active:scale-[0.98] min-h-[44px] hover:border-sky-300 hover:shadow-lg hover:shadow-sky-500/20"
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
