import { useEffect, useRef, useState } from 'react';
import { createAudioPlayer, setAudioModeAsync, useAudioPlayerStatus, type AudioPlayer } from 'expo-audio';

let sharedPlayer: AudioPlayer | null = null;

function getPlayer(): AudioPlayer {
  if (!sharedPlayer) sharedPlayer = createAudioPlayer();
  return sharedPlayer;
}

export function useAyahAudioPlayer() {
  const player = useRef(getPlayer()).current;
  const status = useAudioPlayerStatus(player);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [rate, setRateState] = useState(1);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true, interruptionMode: 'duckOthers' }).catch(() => {});
  }, []);

  function play(key: string, url: string) {
    if (activeKey === key && status.playing) {
      player.pause();
      return;
    }
    if (activeKey === key && !status.playing && status.currentTime > 0) {
      player.play();
      return;
    }
    player.replace({ uri: url });
    player.setPlaybackRate(rate);
    player.play();
    setActiveKey(key);
  }

  /** Always restarts playback from 0, even if `key` matches what's already active — unlike
   * `play`, which toggles pause/resume on a repeated call with the same key. Used for
   * programmatic replays (e.g. memorisation-mode repeat) where a fresh start is required. */
  function restart(key: string, url: string) {
    player.replace({ uri: url });
    player.setPlaybackRate(rate);
    player.play();
    setActiveKey(key);
  }

  function stop() {
    player.pause();
    setActiveKey(null);
  }

  function setRate(next: number) {
    setRateState(next);
    player.setPlaybackRate(next);
  }

  function seekToFraction(fraction: number) {
    if (!status.duration) return;
    player.seekTo(fraction * status.duration).catch(() => {});
  }

  const isPlaying = (key: string) => activeKey === key && status.playing;
  const isFinished = activeKey != null && status.didJustFinish;
  const progress = status.duration > 0 ? status.currentTime / status.duration : 0;

  return {
    play,
    restart,
    stop,
    isPlaying,
    setRate,
    rate,
    activeKey,
    isFinished,
    status,
    progress,
    currentTime: status.currentTime,
    duration: status.duration,
    seekToFraction,
  };
}
