import React, { useState, useRef, useEffect } from 'react';
import { music } from '../assets';

const TRACKS = [
    { id: 'usagiFlap', name: 'Usagi Flap (OST 113)', artist: 'Blue Archive OST', src: music.usagiFlap, icon: music.usagiFlapIcon },
    { id: 'unwelcomeSchool', name: 'Unwelcome School (OST 7)', artist: 'Blue Archive OST', src: music.unwelcomeSchool, icon: music.unwelcomeSchoolIcon },
];

function MusicPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(err => console.error("Audio play error:", err));
        }
        setIsPlaying(!isPlaying);
    };

    const nextTrack = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
        setIsPlaying(true);
    };

    const prevTrack = () => {
        setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
        setIsPlaying(true);
    };

    const handleVolumeChange = (e) => {
        const value = parseFloat(e.target.value);
        setVolume(value);
        setIsMuted(value === 0);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const onTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const total = audioRef.current.duration;
            if (!isNaN(total)) {
                setProgress((current / total) * 100);
            }
        }
    };

    const onLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleProgressChange = (e) => {
        const val = parseFloat(e.target.value);
        if (audioRef.current && duration) {
            audioRef.current.currentTime = (val / 100) * duration;
            setProgress(val);
        }
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load();
            if (isPlaying) {
                audioRef.current.play().catch(err => console.error("Audio play error:", err));
            }
        }
    }, [currentTrackIndex]);

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[120] bg-[rgb(var(--scheme-sidebar))]/95 backdrop-blur-2xl border-t border-[rgb(var(--scheme-border))] ba-mesh select-none shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            {/* Spotify-style Progress Bar (Slim Top) */}
            <div className="absolute -top-[2px] left-0 right-0 h-[3px] group/progress cursor-pointer">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleProgressChange}
                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                />
                <div className="bg-slate-700 w-full h-full" />
                <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-100 ease-linear shadow-[0_0_8px_rgba(56,189,248,0.5)]"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="max-w-[1400px] mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-4">

                {/* Left: Track Info */}
                <div className="flex items-center gap-3 w-1/3 min-w-0">
                    <div className="relative group">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-slate-800 border border-white/10 overflow-hidden shadow-lg transition-transform duration-500 ${isPlaying ? 'rotate-[360deg]' : ''}`}>
                            {TRACKS[currentTrackIndex].icon ? (
                                <img src={TRACKS[currentTrackIndex].icon} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xl">🎵</div>
                            )}
                        </div>
                        {/* BA Halo Mini */}
                        <div className={`absolute -top-1 -right-1 w-4 h-4 border border-sky-400/50 rounded-full transition-opacity duration-300 ${isPlaying ? 'opacity-100 animate-spin' : 'opacity-0'}`} />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-xs sm:text-sm font-bold text-white truncate leading-tight hover:underline cursor-pointer">
                            {TRACKS[currentTrackIndex].name}
                        </span>
                        <span className="text-[10px] sm:text-xs text-slate-400 truncate tracking-wide">
                            {TRACKS[currentTrackIndex].artist}
                        </span>
                    </div>
                </div>

                {/* Center: Playback Controls */}
                <div className="flex flex-col items-center gap-1 flex-1">
                    <div className="flex items-center gap-4 sm:gap-6">
                        <button
                            onClick={prevTrack}
                            className="text-slate-400 hover:text-white transition-colors text-lg hidden sm:block"
                            title="Previous"
                        >
                            ⏮
                        </button>
                        <button
                            onClick={togglePlay}
                            className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-white text-slate-900 shadow-xl hover:scale-105 active:scale-95 transition-all"
                        >
                            <span className="text-xl sm:text-2xl translate-x-[1px]">{isPlaying ? '⏸' : '▶'}</span>
                        </button>
                        <button
                            onClick={nextTrack}
                            className="text-slate-400 hover:text-white transition-colors text-lg"
                            title="Next"
                        >
                            ⏭
                        </button>
                    </div>
                </div>

                {/* Right: Volume & Options (Hidden on small mobile) */}
                <div className="hidden sm:flex items-center justify-end gap-3 w-1/3">
                    <button
                        onClick={toggleMute}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
                    </button>
                    <div className="relative w-24 h-5 flex items-center group">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-full h-1 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-sky-400 transition-all hover:h-1.5"
                        />
                        <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-sky-400 rounded-lg pointer-events-none transition-all group-hover:h-1.5"
                            style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Mobile Mini Mute/Next (Visible only on very small screens) */}
                <div className="flex sm:hidden items-center gap-2">
                    <button
                        onClick={toggleMute}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-slate-300"
                    >
                        {isMuted ? '🔇' : '🔊'}
                    </button>
                </div>

            </div>

            <audio
                ref={audioRef}
                src={TRACKS[currentTrackIndex].src}
                onEnded={nextTrack}
                onTimeUpdate={onTimeUpdate}
                onLoadedMetadata={onLoadedMetadata}
                loop={false}
            />
        </div>
    );
}

export default MusicPlayer;
