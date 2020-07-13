import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import AudioPlayer from "../AudioPlayer";
import { useAudioState } from "./use-audio-state";
import { useTimeUpdate } from "./use-time-update";
import { service } from "../QueueService/QueueService";
import { Song } from "../types";
import { RepeatMode, ShuffleMode } from "./types";
import { getNextPosition, getPreviousPosition } from "./utils";
import { PlaybackManagerProvider } from "./PlaybackManagerContext";

export default function PlaybackManager({ children }: { children: ReactNode }) {
  const position = useRef(-1);
  const player = useRef(new AudioPlayer());
  const state = useAudioState(player.current);
  const currentTime = useTimeUpdate(player.current);
  const [currentSong, setCurrentSong] = useState<Song>();
  const [repeatMode, setRepeatMode] = useState(RepeatMode.NONE);
  const [shuffleMode, setShuffleMode] = useState(ShuffleMode.NONE);

  const play = () => {
    player.current.play();
  };

  const pause = () => {
    player.current.pause();
  };

  const getQueue = () => service.queue;

  const seekTo = (time: number) => {
    player.current.seekTo(time);
  };

  const setSong = (song: Song) => {
    return player.current.setMediaSource(song.getURL());
  };

  const getDuration = () => {
    const duration = player.current.getDuration();
    return isNaN(duration) ? 0 : duration;
  };

  const openQueue = useCallback((songs: Song[], shuffleMode?: ShuffleMode) => {
    service.openQueue(songs);
    if (shuffleMode) setShuffleMode(shuffleMode);
  }, []);

  const enqueue = useCallback((...songs: Song[]) => {
    service.enqueue(songs);
  }, []);

  const enqueueAt = useCallback((position: number, ...songs: Song[]) => {
    service.enqueueAt(position, songs);
  }, []);

  const toggleShuffle = () => {
    setShuffleMode((shuffleMode) => {
      return shuffleMode === ShuffleMode.NONE
        ? ShuffleMode.SHUFFLE
        : ShuffleMode.NONE;
    });
  };

  const cycleRepeatMode = () => {
    setRepeatMode((repeatMode) => {
      switch (repeatMode) {
        case RepeatMode.ALL:
          return RepeatMode.CURRENT;
        case RepeatMode.CURRENT:
          return RepeatMode.NONE;
        case RepeatMode.NONE:
          return RepeatMode.ALL;
      }
    });
  };

  const playSongAt = async (pos: number) => {
    const song = getQueue()[pos];
    await setSong(song);
    play();

    position.current = pos;
    setCurrentSong(song);
  };

  const playSong = async (song: Song) => {
    const position = getQueue().findIndex((s) => {
      return s.id === song.id;
    });

    playSongAt(position);
  };

  const playNextSong = (force = true) => {
    const size = service.getQueueSize();

    const newPos = getNextPosition(
      repeatMode,
      shuffleMode,
      size,
      position.current,
      force
    );

    // if (newPos < size)
    playSongAt(newPos);
  };

  const playPreviousSong = (force = true) => {
    const size = service.getQueueSize();
    const newPos = getPreviousPosition(
      repeatMode,
      shuffleMode,
      size,
      position.current,
      force
    );

    if (newPos > 0) playSongAt(newPos);
  };

  useEffect(() => {
    player.current.init();
  }, []);

  useEffect(() => {
    const _player = player.current;
    const onEnded = () => playNextSong();
    _player.addListener("ended", onEnded);

    return () => {
      _player.removeListener("ended", onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PlaybackManagerProvider
      value={{
        play,
        pause,
        state,
        seekTo,
        enqueue,
        setSong,
        getQueue,
        playSong,
        enqueueAt,
        openQueue,
        repeatMode,
        playSongAt,
        currentSong,
        shuffleMode,
        getDuration,
        currentTime,
        playNextSong,
        setRepeatMode,
        toggleShuffle,
        setShuffleMode,
        cycleRepeatMode,
        playPreviousSong,
      }}
    >
      {children}
    </PlaybackManagerProvider>
  );
}
