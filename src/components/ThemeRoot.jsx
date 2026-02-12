import React from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Wraps the app with data-color-scheme so CSS variables apply to the whole UI.
 */
function ThemeRoot({ children }) {
  const { theme } = useTheme();
  return (
    <div
      data-color-scheme={theme.colorScheme}
      className="min-h-screen text-white font-sans bg-[rgb(var(--scheme-bg))] selection:bg-[rgb(var(--scheme-selection))]"
    >
      {children}
    </div>
  );
}

export default ThemeRoot;
