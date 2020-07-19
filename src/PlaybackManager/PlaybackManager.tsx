import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import AudioPlayer from "../AudioPlayer";
import { service } from "../QueueService/QueueService";
import { Song } from "../types";
import { PlaybackManagerProvider } from "./PlaybackManagerContext";
import { RepeatMode, ShuffleMode } from "./types";
import { useAudioState } from "./use-audio-state";
import { useTimeUpdate } from "./use-time-update";

const { Helmet } = require("react-helmet");

export default function PlaybackManager({ children }: { children: ReactNode }) {
  const player = useRef(new AudioPlayer());
  const state = useAudioState(player.current);
  const currentTime = useTimeUpdate(player.current);
  const [currentSong, setCurrentSong] = useState<Song>();

  const { title, album } = (currentSong ?? {}) as Song;

  const play = () => {
    player.current.play();
  };

  const pause = () => {
    player.current.pause();
  };

  const getQueue = () => service.queue;

  const getRepeatMode = () => service.repeatMode;

  const getShuffleMode = () => service.shuffleMode;

  const seekTo = (time: number) => {
    player.current.seekTo(time);
  };

  const setSong = (song: Song) => {
    return player.current.setMediaSource(song.getURL());
  };

  const setRepeatMode = (mode: RepeatMode) => {
    service.setRepeatMode(mode);
  };

  const setShuffleMode = (mode: ShuffleMode) => {
    service.setShuffleMode(mode);
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
    setShuffleMode(
      getShuffleMode() === ShuffleMode.NONE
        ? ShuffleMode.SHUFFLE
        : ShuffleMode.NONE
    );
  };

  const cycleRepeatMode = () => {
    const get = () => {
      switch (getRepeatMode()) {
        case RepeatMode.ALL:
          return RepeatMode.CURRENT;
        case RepeatMode.CURRENT:
          return RepeatMode.NONE;
        case RepeatMode.NONE:
          return RepeatMode.ALL;
      }
    };

    setRepeatMode(get());
  };

  const playSongAt = async (pos: number | undefined | null) => {
    const song = getQueue()[pos as number];

    if (!song) return;

    service.position = pos;

    await setSong(song);
    play();

    setCurrentSong(song);
  };

  const playSong = async (song: Song) => {
    const position = getQueue().findIndex((s) => {
      return s.id === song.id;
    });

    playSongAt(position);
  };

  const playNextSong = (force = false) => {
    const newPos = service.getNextPosition(force);
    playSongAt(newPos);
  };

  const playPreviousSong = (force = false) => {
    const newPos = service.getPreviousPosition(force);
    playSongAt(newPos);
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

  const helmetTitle = [title, album].filter((title) => !!title);

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
        playSongAt,
        currentSong,
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
      <Helmet>
        <title>{helmetTitle.join(" - ")}</title>
      </Helmet>
      {children}
    </PlaybackManagerProvider>
  );
}
