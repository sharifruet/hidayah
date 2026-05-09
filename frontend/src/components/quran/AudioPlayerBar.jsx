import { useRef, useEffect, useState } from 'react';
import { resolveAudioUrl } from '../../services/quranService.js';

export default function AudioPlayerBar({
  surah,
  ayah,
  ayahs,
  reciter,
  language,
  repeatCount,      // how many times to play each ayah before advancing (1 = no repeat)
  onAyahChange,
  onClose,
}) {
  const audioRef       = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [speed, setSpeed]         = useState(1);
  const [loopCount, setLoopCount] = useState(1); // how many times the current ayah has played
  const [sleepMinutes, setSleepMinutes] = useState(0); // 0 = off
  const [sleepRemaining, setSleepRemaining] = useState(0); // seconds remaining
  const sleepTimerRef = useRef(null);

  const repeat = Math.max(1, repeatCount || 1);
  const currentIdx = ayahs.findIndex((a) => a.number === ayah?.number);

  const audioUrl = ayah && reciter
    ? resolveAudioUrl(reciter.audio_url_template, surah.number, ayah.number)
    : null;

  // Reset loop counter and load audio when ayah or reciter changes
  useEffect(() => {
    if (!audioRef.current || !audioUrl) return;
    setLoopCount(1);
    audioRef.current.src = audioUrl;
    audioRef.current.playbackRate = speed;
    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }, [audioUrl]);

  // Sync speed without reloading
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed;
  }, [speed]);

  function handleTimeUpdate() {
    const el = audioRef.current;
    if (!el || !el.duration) return;
    setProgress((el.currentTime / el.duration) * 100);
  }

  function handleEnded() {
    setIsPlaying(false);
    if (loopCount < repeat) {
      // Play the same ayah again
      setLoopCount((c) => c + 1);
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      // Advance to next ayah
      setLoopCount(1);
      if (currentIdx >= 0 && currentIdx < ayahs.length - 1) {
        onAyahChange(ayahs[currentIdx + 1]);
      }
    }
  }

  function togglePlay() {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      el.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }

  function prevAyah() {
    if (currentIdx > 0) {
      setLoopCount(1);
      onAyahChange(ayahs[currentIdx - 1]);
    }
  }

  function nextAyah() {
    if (currentIdx < ayahs.length - 1) {
      setLoopCount(1);
      onAyahChange(ayahs[currentIdx + 1]);
    }
  }

  function handleSeek(e) {
    const el = audioRef.current;
    if (!el || !el.duration) return;
    const pct = parseFloat(e.target.value);
    el.currentTime = (pct / 100) * el.duration;
    setProgress(pct);
  }

  function startSleepTimer(minutes) {
    clearInterval(sleepTimerRef.current);
    setSleepMinutes(minutes);
    if (minutes === 0) { setSleepRemaining(0); return; }
    let seconds = minutes * 60;
    setSleepRemaining(seconds);
    sleepTimerRef.current = setInterval(() => {
      seconds -= 1;
      setSleepRemaining(seconds);
      if (seconds <= 0) {
        clearInterval(sleepTimerRef.current);
        audioRef.current?.pause();
        setIsPlaying(false);
        setSleepMinutes(0);
        setSleepRemaining(0);
        onClose();
      }
    }, 1000);
  }

  // Clean up timer on unmount
  useEffect(() => () => clearInterval(sleepTimerRef.current), []);

  if (!ayah) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50 px-4 py-3">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="max-w-3xl mx-auto">
        {/* Track info */}
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
            <span className="font-medium text-gray-900 dark:text-gray-100">{surah.name_en}</span>
            {' '}
            <span className="text-gray-500">
              {language === 'bn' ? 'আয়াত' : 'Ayah'} {ayah.number}
            </span>
            {/* Repeat indicator */}
            {repeat > 1 && (
              <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">
                {loopCount}/{repeat}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="text-xs border border-gray-200 rounded px-1 py-0.5"
              aria-label="Playback speed"
            >
              {[0.75, 1, 1.25, 1.5].map((s) => (
                <option key={s} value={s}>{s}x</option>
              ))}
            </select>

            {/* Sleep timer picker */}
            <select
              value={sleepMinutes}
              onChange={(e) => startSleepTimer(parseInt(e.target.value))}
              className="text-xs border border-gray-200 rounded px-1 py-0.5"
              aria-label="Sleep timer"
              title="Sleep timer"
            >
              <option value={0}>⏾</option>
              {[5, 10, 15, 20, 30, 45, 60].map((m) => (
                <option key={m} value={m}>{m}m</option>
              ))}
            </select>

            {/* Sleep countdown */}
            {sleepRemaining > 0 && (
              <span className="text-xs text-purple-600 font-medium tabular-nums">
                {Math.floor(sleepRemaining / 60)}:{String(sleepRemaining % 60).padStart(2, '0')}
              </span>
            )}

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close player"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={handleSeek}
          className="w-full h-1 mb-2 accent-green-600"
          aria-label="Seek"
        />

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={prevAyah}
            disabled={currentIdx <= 0}
            className="text-gray-500 hover:text-gray-800 disabled:opacity-30"
            aria-label="Previous ayah"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>

          <button
            onClick={togglePlay}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-green-600 text-white hover:bg-green-700"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm4-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          <button
            onClick={nextAyah}
            disabled={currentIdx >= ayahs.length - 1}
            className="text-gray-500 hover:text-gray-800 disabled:opacity-30"
            aria-label="Next ayah"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
