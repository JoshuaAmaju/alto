import { useRef, useState, useEffect, useCallback } from "react";
import AudioPlayer from "./AudioPlayer";
import { PlayStates } from "../PlaybackManager/types";

type EventMap = keyof HTMLMediaElementEventMap;

export default function useAudioPlayer() {
  const [duration, setDuration] = useState(0);
  const { current } = useRef(new AudioPlayer());
  const [currentTime, setCurrentTime] = useState(0);
  const eventListeners = useRef(new Map<EventMap, EventListener[]>());
  const [audioState, setAudioState] = useState(PlayStates.SUSPENDED);

  const play = useCallback(() => {
    current.play();
  }, [current]);

  const pause = useCallback(() => {
    current.pause();
  }, [current]);

  const seekTo = useCallback((time: number) => current.seekTo(time), [current]);

  const setMediaSource = useCallback(
    (src: string) => current.setMediaSource(src),
    [current]
  );

  const onEvent = useCallback(
    (event: EventMap, fn: EventListener) => {
      const listeners = eventListeners.current.get(event) ?? [];
      eventListeners.current.set(event, listeners.concat(fn));
      current.addListener(event, fn);
    },
    [current]
  );

  useEffect(() => {
    const listeners = eventListeners.current;

    return () => {
      listeners.forEach((callbacks, event) => {
        callbacks.forEach((fn) => current.removeListener(event, fn));
      });
    };
  }, [current]);

  useEffect(() => {
    onEvent("play", () => setAudioState(PlayStates.PLAYING));
    onEvent("pause", () => setAudioState(PlayStates.SUSPENDED));
    onEvent("timeupdate", () => setCurrentTime(current.getCurrentTime()));

    onEvent("loadeddata", () => {
      const duration = current.getDuration();
      setDuration(isNaN(duration) ? 0 : duration);
    });
  }, [current, onEvent]);

  return {
    play,
    pause,
    seekTo,
    onEvent,
    duration,
    audioState,
    currentTime,
    setMediaSource,
    player: current,
  };
}
