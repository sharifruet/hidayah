import { useEffect, useRef, useState } from 'react';

import { useAyahAudioPlayer } from './useAyahAudioPlayer';
import { getLocalAyahAudioUri } from '../lib/offlineAudio';
import { resolveAudioUrl, type Ayah, type Reciter } from '../lib/services/quran';

/**
 * Continuous surah playback: play/pause/prev/next across a list of ayahs,
 * with an optional per-ayah repeat count (for memorisation) and a sleep timer.
 * Wraps the single-track `useAyahAudioPlayer` and adds the "what plays after
 * this finishes" orchestration that a single ayah player doesn't need.
 */
export function useSurahPlayback(surahNumber: number, ayahs: Ayah[], reciter: Reciter | undefined, repeatCount: number) {
  const audio = useAyahAudioPlayer();
  const [currentAyah, setCurrentAyah] = useState<number | null>(null);
  const [loopCount, setLoopCount] = useState(1);
  const [sleepMinutes, setSleepMinutes] = useState(0);
  const [sleepRemaining, setSleepRemaining] = useState(0);
  const sleepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const repeat = Math.max(1, repeatCount || 1);
  const currentIdx = currentAyah != null ? ayahs.findIndex((a) => a.number === currentAyah) : -1;

  function urlFor(ayahNumber: number): string | null {
    if (!reciter) return null;
    const local = getLocalAyahAudioUri(reciter.id, surahNumber, ayahNumber);
    return local ?? resolveAudioUrl(reciter.audio_url_template, surahNumber, ayahNumber);
  }

  function playAyah(ayahNumber: number) {
    const url = urlFor(ayahNumber);
    if (!url) return;
    setLoopCount(1);
    setCurrentAyah(ayahNumber);
    audio.play(`${surahNumber}:${ayahNumber}`, url);
  }

  function togglePlay() {
    if (currentAyah == null) {
      if (ayahs[0]) playAyah(ayahs[0].number);
      return;
    }
    const url = urlFor(currentAyah);
    if (url) audio.play(`${surahNumber}:${currentAyah}`, url);
  }

  function prev() {
    if (currentIdx > 0) playAyah(ayahs[currentIdx - 1].number);
  }

  function next() {
    if (currentIdx >= 0 && currentIdx < ayahs.length - 1) playAyah(ayahs[currentIdx + 1].number);
  }

  function stop() {
    audio.stop();
    setCurrentAyah(null);
    setLoopCount(1);
  }

  // Advance (or repeat) when the current ayah finishes playing.
  useEffect(() => {
    if (!audio.isFinished || currentAyah == null) return;
    if (loopCount < repeat) {
      const url = urlFor(currentAyah);
      if (url) audio.restart(`${surahNumber}:${currentAyah}`, url);
      setLoopCount((c) => c + 1);
    } else if (currentIdx >= 0 && currentIdx < ayahs.length - 1) {
      playAyah(ayahs[currentIdx + 1].number);
    } else {
      stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio.isFinished]);

  function startSleepTimer(minutes: number) {
    if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
    setSleepMinutes(minutes);
    if (minutes === 0) {
      setSleepRemaining(0);
      return;
    }
    let seconds = minutes * 60;
    setSleepRemaining(seconds);
    sleepTimerRef.current = setInterval(() => {
      seconds -= 1;
      setSleepRemaining(seconds);
      if (seconds <= 0) {
        if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
        setSleepMinutes(0);
        setSleepRemaining(0);
        stop();
      }
    }, 1000);
  }

  useEffect(
    () => () => {
      if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
    },
    []
  );

  return {
    currentAyah,
    isPlaying: currentAyah != null && audio.isPlaying(`${surahNumber}:${currentAyah}`),
    playAyah,
    togglePlay,
    prev,
    next,
    stop,
    hasPrev: currentIdx > 0,
    hasNext: currentIdx >= 0 && currentIdx < ayahs.length - 1,
    loopCount,
    repeat,
    rate: audio.rate,
    setRate: audio.setRate,
    progress: audio.progress,
    seekToFraction: audio.seekToFraction,
    sleepMinutes,
    sleepRemaining,
    startSleepTimer,
  };
}
