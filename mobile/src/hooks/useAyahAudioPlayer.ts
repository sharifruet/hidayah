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

  function stop() {
    player.pause();
    setActiveKey(null);
  }

  function setRate(next: number) {
    setRateState(next);
    player.setPlaybackRate(next);
  }

  const isPlaying = (key: string) => activeKey === key && status.playing;
  const isFinished = activeKey != null && status.didJustFinish;

  return { play, stop, isPlaying, setRate, rate, activeKey, isFinished, status };
}
