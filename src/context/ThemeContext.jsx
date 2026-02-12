import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'bluearchive-theme';

const defaultTheme = {
  backgroundKey: 'committeeRoom',
  colorScheme: 'default', // default | warm | cool | soft
};

function loadTheme() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        backgroundKey: parsed.backgroundKey ?? defaultTheme.backgroundKey,
        colorScheme: parsed.colorScheme ?? defaultTheme.colorScheme,
      };
    }
  } catch (_) {}
  return { ...defaultTheme };
}

function saveTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  } catch (_) {}
}

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(loadTheme);

  const setTheme = (next) => {
    setThemeState((prev) => {
      const nextTheme = typeof next === 'function' ? next(prev) : { ...prev, ...next };
      saveTheme(nextTheme);
      return nextTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

/** CSS class names for chat UI by color scheme */
export function getColorSchemeClasses(scheme) {
  switch (scheme) {
    case 'warm':
      return {
        userBubble: 'bg-amber-500/35 text-amber-100 border-amber-400/30',
        assistantBubble: 'bg-slate-700/90 text-slate-200 border-amber-900/20',
        accent: 'text-amber-400',
        accentBg: 'bg-amber-500/20',
        inputFocus: 'focus-within:border-amber-400/50',
        sendBtn: 'bg-amber-500 hover:bg-amber-400',
      };
    case 'cool':
      return {
        userBubble: 'bg-indigo-500/35 text-indigo-100 border-indigo-400/30',
        assistantBubble: 'bg-slate-700/90 text-slate-200 border-indigo-900/20',
        accent: 'text-indigo-400',
        accentBg: 'bg-indigo-500/20',
        inputFocus: 'focus-within:border-indigo-400/50',
        sendBtn: 'bg-indigo-500 hover:bg-indigo-400',
      };
    case 'soft':
      return {
        userBubble: 'bg-rose-500/30 text-rose-100 border-rose-400/30',
        assistantBubble: 'bg-slate-700/85 text-slate-200 border-rose-900/20',
        accent: 'text-rose-400',
        accentBg: 'bg-rose-500/20',
        inputFocus: 'focus-within:border-rose-400/50',
        sendBtn: 'bg-rose-500 hover:bg-rose-400',
      };
    default:
      return {
        userBubble: 'bg-sky-500/30 text-sky-100 border-sky-400/30',
        assistantBubble: 'bg-slate-700/80 text-slate-200 border-slate-600/80',
        accent: 'text-sky-400',
        accentBg: 'bg-sky-500/20',
        inputFocus: 'focus-within:border-sky-400/50',
        sendBtn: 'bg-sky-500 hover:bg-sky-400',
      };
  }
}
