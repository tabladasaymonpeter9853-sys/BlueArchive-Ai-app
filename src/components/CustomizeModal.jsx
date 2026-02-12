import React, { useState, useEffect, useCallback } from 'react';
import { backgrounds, backgroundLabels } from '../assets';

const COLOR_SCHEMES = [
  { id: 'default', name: 'Default', preview: 'bg-sky-500/40' },
  { id: 'warm', name: 'Warm', preview: 'bg-amber-500/40' },
  { id: 'cool', name: 'Cool', preview: 'bg-indigo-500/40' },
  { id: 'soft', name: 'Soft', preview: 'bg-rose-500/40' },
];

function CustomizeModal({ isOpen, onClose, theme, onSave }) {
  const [backgroundKey, setBackgroundKey] = useState(theme.backgroundKey);
  const [colorScheme, setColorScheme] = useState(theme.colorScheme);

  useEffect(() => {
    if (isOpen) {
      setBackgroundKey(theme.backgroundKey);
      setColorScheme(theme.colorScheme);
    }
  }, [isOpen, theme.backgroundKey, theme.colorScheme]);

  const handleEscape = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );
  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleEscape]);

  const handleSave = () => {
    onSave({ backgroundKey, colorScheme });
    onClose();
  };

  if (!isOpen) return null;

  const backgroundEntries = Object.entries(backgrounds);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customize-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl glass-panel border border-white/10 shadow-2xl animate-scale-in card-glow"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-600 bg-slate-800/95 backdrop-blur-md">
          <h2 id="customize-title" className="text-lg font-semibold text-white">
            Customize
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-600/60 transition touch-target sm:min-h-0 sm:min-w-0"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          <section className="animate-fade-in-up delay-100">
            <h3 className="text-sm font-medium text-slate-300 mb-3">Background</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {backgroundEntries.map(([key, url]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setBackgroundKey(key)}
                  className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 hover-lift ${backgroundKey === key
                      ? 'border-sky-400 ring-2 ring-sky-400/50'
                      : 'border-slate-600 hover:border-slate-500'
                    }`}
                >
                  <img
                    src={url}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] sm:text-xs px-1 py-0.5 truncate">
                    {backgroundLabels[key] ?? key}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="animate-fade-in-up delay-200">
            <h3 className="text-sm font-medium text-slate-300 mb-3">Color scheme</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {COLOR_SCHEMES.map((scheme) => (
                <button
                  key={scheme.id}
                  type="button"
                  onClick={() => setColorScheme(scheme.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-3 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 hover-lift ${colorScheme === scheme.id
                      ? 'border-sky-400 bg-sky-500/10'
                      : 'border-slate-600 hover:border-slate-500 bg-slate-700/50'
                    }`}
                >
                  <span
                    className={`w-8 h-8 rounded-full ${scheme.preview} transition-transform duration-200 ${colorScheme === scheme.id ? 'scale-110' : ''
                      }`}
                  />
                  <span className="text-xs font-medium text-slate-200">{scheme.name}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 flex gap-2 px-4 sm:px-6 py-4 border-t border-slate-600 bg-slate-800/95 backdrop-blur-md">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-500 text-slate-200 hover:bg-slate-600/60 transition-all duration-200 font-medium hover:scale-[1.02] active:scale-95"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-medium transition-all duration-200 hover:scale-[1.02] active:scale-95 hover:shadow-lg hover:shadow-sky-500/25"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomizeModal;
